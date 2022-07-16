import makeBoot from '../boot';
import LichessChat from 'chat';
import { Chessground } from 'chessground';
import { patch, makeStart } from '../start';
import * as deps from '../deps';

export { patch };

export const start = makeStart(deps);

export const boot = makeBoot(start);

// that's for the rest of lichess to access chessground
// without having to include it a second time
window.Chessground = Chessground;
window.LichessChat = LichessChat;
