import { createElement, insertBefore, sameVnode } from './patch'
/**
 * 简易版本patch node函数
 */
export function patchVnode(oldVnode, vnode) {
    let oldCh = oldVnode.children;
    let newCh = vnode.children;
    // 创建四个指针
    let oldStartIdx = 0;
    let oldEndIdx = oldCh?.length - 1;
    let newStartIdx = 0;
    let newEndIdx = newCh?.length - 1;
    // 创建四个指针
    let oldStartVnode = oldCh[oldStartIdx];
    let oldEndVnode = oldCh[oldEndIdx];
    let newStartVnode = newCh[newStartIdx];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let elmToMove;
    let idxInOld;  //vnode index in oldch

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 开始diff算法
        if (sameVnode(oldStartVnode, newStartVnode)) {
            // patchVnode(oldStartVnode, newStartVnode); // patch children 不存在的情况
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // patchVnode(oldEndVnode,newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // patchVnode(oldStartVnode, newEndVnode);
            // 插入到 oldend 之后
            insertBefore(oldVnode.elm, oldStartVnode.elm, nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // patchVnode(oldEndVnode, newStartVnode);
            insertBefore(oldVnode.elm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            // 未找到的情况下
            if (oldKeyToIdx == undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldCh[newStartVnode.key];
            if (isUndef(idxInOld)) {

                // 创建
                createElement(newStartVnode);

                insertBefore(oldVnode.elm, newStartVnode.elm, oldStartVnode.elm);
            } else {
                // key 在index中存在
                elmToMove = oldCh[idxInOld];

                if (elmToMove.sel !== newStartVnode.sel) {
                    // 选择器不同
                    insertBefore(oldVnode.elm, createElement(newStartVnode), oldStartVnode);
                } else {
                    // 选择器相同 ，原来的标记为undefined 
                    // patchVnode(elmToMove,newStartVnode);
                    oldCh[idxInOld] = undefined;
                    insertBefore(oldVnode.elm, elmToMove.elm, oldStartVnode.elm);
                }

            }
            newStartVnode = newCh[++newStartIdx];
            console.log(newStartVnode);
        }

    }

    if (oldStartIdx > oldEndIdx || newStartIdx > newEndIdx) {
        // 两个长度不一致
        if (oldStartIdx > oldEndIdx) {
            // 添加  newEndIdx - newStartIdx 之间的元素
            addNodes(oldVnode.elm, newCh, newStartIdx, newEndIdx);
        } else {
            // 删除  oldEndIdx - oldStartIdx 之间的元素
            removeNodes(oldVnode.elm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
}

/**
 * 
 * @param {Node} parent 
 * @param {Array} childrens 
 * @param {Number} startIdx 
 * @param {Number} endIdx 
 */
export function addNodes(parent, childrens, startIdx, endIdx) {
    let nodes = childrens.slice(startIdx, endIdx + 1);
    for (let i = 0; i < nodes.length; i++) {
        createElement(nodes[i]);
        parent.appendChild(nodes[i].elm);
    }

}
/**
 * 
 * @param {Node} parent 
 * @param {Array} childrens 
 * @param {Number} startIdx 
 * @param {Number} endIdx 
 */
export function removeNodes(parent, childrens, startIdx, endIdx) {
    let nodes = childrens.slice(startIdx, endIdx + 1);
    for (let i = 0; i < nodes.length; i++) {
        parent.removeChild(nodes[i].elm);
    }
}

/**
 * 返回 key ：index 键值对 ，方便查找
 * @param {Array} children  vnode.children 
 * @param {*} startIdx  起始index
 * @param {*} endIdx  终止index
 */
export function createKeyToOldIdx(children, startIdx, endIdx) {
    const map = {};
    for (let i = startIdx; i < endIdx; i++) {
        const key = children[i]?.key;
        map[key] = i;
    }
    return map;
}

/**
 * 判断是不是undefined
 */
export function isUndef(s) {
    return s === undefined;
}

/**
 * 
 * @param {Node} node 
 */
export function nextSibling(node) {
    return node.nextSibling;
}