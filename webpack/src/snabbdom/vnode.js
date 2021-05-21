/**
 * 
 * @param {*} sel 选择器 
 * @param {*} data  数据+属性
 * @param {*} children 子元素
 * @param {*} text 文本属性
 * @param {*} elm 实际的dom对象
 * @returns 
 */
export function vnode(sel, data, children, text, elm) {
    let key = data == undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}