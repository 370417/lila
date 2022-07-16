import { attributesModule, classModule, init } from 'snabbdom';
import makeCtrl from './ctrl';
import menuHover from 'common/menuHover';
import makeView from './view';
import { AnalyseApi, AnalyseOpts } from './interfaces';
import type * as deps2 from './deps';

export const patch = init([classModule, attributesModule]);

export function makeStart(deps?: typeof deps2) {
  return function (opts: AnalyseOpts): AnalyseApi {
    opts.element = document.querySelector('main.analyse') as HTMLElement;
    opts.trans = lichess.trans(opts.i18n);

    const ctrl = (lichess.analysis = new makeCtrl(opts, redraw, deps?.makeStudy));

    const view = makeView(deps);
    const blueprint = view(ctrl);
    opts.element.innerHTML = '';
    let vnode = patch(opts.element, blueprint);

    function redraw() {
      vnode = patch(vnode, view(ctrl));
    }

    menuHover();

    return {
      socketReceive: ctrl.socket.receive,
      path: () => ctrl.path,
      setChapter(id: string) {
        if (ctrl.study) ctrl.study.setChapter(id);
      },
    };
  };
}
