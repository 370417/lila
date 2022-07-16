import makeCtrl from './ctrl';
import menuHover from 'common/menuHover';
import view from './view';
import { AnalyseApi, AnalyseOpts } from './interfaces';
import { VNode } from 'snabbdom';

export default function (patch: (oldVnode: VNode | Element | DocumentFragment, vnode: VNode) => VNode) {
  return function (opts: AnalyseOpts): AnalyseApi {
    opts.element = document.querySelector('main.analyse') as HTMLElement;
    opts.trans = lichess.trans(opts.i18n);

    const ctrl = (lichess.analysis = new makeCtrl(opts, redraw));

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
