/**
 * 
 * @param {String} sel CSS selector passed to h()
 * @param {Object} data 
 * @param {Array} children 
 * @param {String} text 
 * @param {Element} elm a pointer to the real DOM node created by snabbdom
 * @returns 
 */

export function vnode(sel, data, children, text, elm,) {
    const key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}