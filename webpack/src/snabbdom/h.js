import { vnode } from './vnode'

export function h(sel, data, c) {
    // 三种情况
    // h('div', {}, 'text')
    if (typeof c == 'string') {
        return vnode(sel, data, undefined, c, undefined);
    }
    if (Array.isArray(c)) {
        let children = [];
        for (let i = 0; i < c.length; i++) {
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined);
    }

    if (typeof c == 'object') {
        let children = [c]
        return vnode(sel, data, children, undefined, undefined);
    }
}