import { attributesModule, classModule, init } from 'snabbdom';
import makeBoot from './boot';
import makeStart from './start';
import LichessChat from 'chat';
import { Chessground } from 'chessground';

export const patch = init([classModule, attributesModule]);

export const start = makeStart(patch);

export const boot = makeBoot(start);

// that's for the rest of lichess to access chessground
// without having to include it a second time
window.Chessground = Chessground;
window.LichessChat = LichessChat;
