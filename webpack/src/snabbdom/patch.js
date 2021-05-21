import { vnode } from '../snabbdom/vnode';
import { patchVnode } from './patchVnode'



// 简易版本 patch函数
export function patch(oldVnode, vnode) {
    let parent
    // 情况1   element 元素 + 虚拟节点
    if (!isVnode(oldVnode)) {
        // 创建一个空节点
        oldVnode = emptyNodeAt(oldVnode);
    }
    // 虚拟元素 + 虚拟元素 diff 
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode);
    } else {
        /**@type {Node} */
        let elm = oldVnode.elm;
        /**@type {Node} */
        parent = parentNode(oldVnode.elm);
        // vnode elm 需要创建

        createElement(vnode);

        insertBefore(parent, vnode.elm, elm.nextSibling);
        // 删除原始引用
        parent.removeChild(elm);
    }
}

/**
 * 判断是否为相同的虚拟节点
 * 简易判断 sel 相同  key 相同
 */
export function sameVnode(oldVnode, vnode) {
    const isSameKey = oldVnode.key == vnode.key
    const isSameSel = oldVnode.sel == vnode.sel
    return isSameKey && isSameSel;
}

// 判断是否是vnode
export function isVnode(vnode) {
    return vnode?.sel !== undefined;
}

//  简易版 ，去掉className
export function emptyNodeAt(elm) {
    let id = elm.id ? '#' + elm.id : '';
    return vnode(id, {}, [], undefined, elm);
}

/**
 * 
 * @param {Node} node 
 * @returns 
 */
export function parentNode(node) {
    return node.parentNode;
}

/**
 * 
 * @param {Node} parentNode 
 * @param {*} elm 
 * @param {*} ref 
 */
export function insertBefore(parentNode, newChild, refChild) {
    parentNode.insertBefore(newChild, refChild);
}
/**
 * 简易版创建对象 ，添加到vnode.elm 上面  
 * 只实现了 ul li 嵌套 ， 和 text单属性
 * @param {*} vnode 
 */
export function createElement(vnode) {
    let tag = vnode.sel;
    let elm = document.createElement(tag)
    let ch = vnode.children;

    if (ch?.length) {
        for (let i = 0; i < ch?.length; i++) {
            createElement(ch[i]);
            elm.appendChild(ch[i].elm);
        }
    } else {
        // 只有text 没有ch 
        let text = document.createTextNode(vnode.text);
        elm.appendChild(text);
    }
    vnode.elm = elm;
    return vnode.elm;
}