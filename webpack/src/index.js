import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

import { h as H } from './snabbdom/h'
import { patch as Patch } from './snabbdom/patch'



const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

const container = document.getElementById("container");



const vnode = H('ul', { key: 1 }, [
    H('li', { key: 'A' }, 'A'),
    H('li', { key: 'B' }, 'B'),
    H('li', { key: 'C' }, 'C'),
    H('li', { key: 'D' }, 'D'),
])

// const vnode = h('div', { key: 'key' }, 'hello');
// const vnode = h('div', { key: 1 }, 'hello');

// const vnode = h('div', { key: 1 }, h('span', { key: 2 }, 'spans'));
// const vnode3 = H('span', { key: 'key' }, '123');

const vnode3 = H('ul', { key: 1 }, [
    H('li', { key: 'A' }, 'A'),
    H('li', { key: 'C' }, 'C'),
    // H('li', { key: 'D' }, 'D'),
    // H('li', { key: 'B' }, 'B'),
    H('li', { key: 'E' }, 'E'),
])



Patch(container, vnode);
Patch(vnode, vnode3);



