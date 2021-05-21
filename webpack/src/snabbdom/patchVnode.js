import { sameVnode } from './patch'
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

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        console.log(oldStartIdx, newStartIdx);
        // 开始diff算法
        if (sameVnode(oldStartVnode, newStartVnode)) {
            // patchVnode(oldStartVnode, newStartVnode); // patch children 不存在的情况
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }

    }

    if (oldStartIdx > oldEndIdx || newStartIdx > newEndIdx) {
        // 两个长度不一致
        if (oldStartIdx > oldEndIdx) {
            // 添加  newEndIdx - newStartIdx 之间的元素
            addNodes(vnode.elm, newCh, newStartIdx, newEndIdx);
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
    console.log(nodes);

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