package lila.socket

import cats.data.Validated
import chess.format.{ FEN, Uci, UciCharPair }
import chess.opening._
import chess.variant.Variant
import play.api.libs.json.JsObject

import lila.tree.Branch

case class AnaPass(
    variant: Variant,
    fen: FEN,
    path: String,
    chapterId: Option[String]
) extends AnaAny {

  def branch: Validated[String,Branch] =
    chess.Game(variant.some, fen.some).withPassing(true).pass() flatMap { case (game, _) =>
      game.pgnMoves.lastOption toValid "Moved but no last move!" map { san =>
        val uci = Uci.Pass()
        val movable = game.situation playable false
        val fen = chess.format.Forsyth >> game
        Branch(
          id = UciCharPair(uci),
          ply = game.turns,
          move = Uci.WithSan(uci, san),
          fen = fen,
          check = game.situation.check,
          dests = Some(movable ?? game.situation.destinations),
          opening = (game.turns <= 30 && Variant.openingSensibleVariants(variant)) ?? {
            FullOpeningDB findByFen fen
          },
          drops = if (movable) game.situation.drops else Some(Nil),
          crazyData = game.situation.board.crazyData
        )
      }
    }
}

object AnaPass {

  def parse(o: JsObject) =
    for {
      d <- o obj "d"
      variant = chess.variant.Variant orDefault ~d.str("variant")
      fen  <- d str "fen" map FEN.apply
      path <- d str "path"
    } yield AnaPass(
      variant = variant,
      fen = fen,
      path = path,
      chapterId = d str "ch"
    )
}
