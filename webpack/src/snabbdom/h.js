import { vnode } from './vnode'

/**
 * 只考虑三种情况
 * @param {String} a selector 
 * @param {Object} b data 
 * @param {Array|String} c children  // 子元素 
 */
export function h(a, b, c) {
    // 第一种情况 ，最简易的  h('div',{key:'key'},'hello')
    if (typeof c == 'string') {
        return vnode(a, b, undefined, c, undefined);
    }
    // 第二种情况 ，c是数组 ，数组里面包含 h('ul',{key:'key'},[h('li',{key:1},'1')]);
    if (Array.isArray(c)) {
        let children = [...c];
        return vnode(a, b, children, undefined, undefined);
    }
    // 第三种情况 ,  h('div',{key:"key"},h('div',{key:2},"inner"))  // c是vnode对象 具有sel 属性
    if (c.sel) {
        let children = [];
        children.push(c);
        return vnode(a, b, children, undefined, undefined);
    }
}