import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    // h,
} from "snabbdom";

import { h } from './snabbdom/h'



const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

const container = document.getElementById("container");

// const vnode = h("div#container.two.classes", {
//     on: {
//         click: function () {
//             console.log('click');
//         }
//     }
// }, [
//     h("span", { style: { fontWeight: "bold" } }, "This is bold"),
//     " and this is just normal text",
//     h("a", { props: { href: "/foo" } }, "I'll take you places!"),
// ]);

// const vnode = h('ul', { key: 1 }, [
//     h('li', { key: 'A' }, 'A'),
//     h('li', { key: 'B' }, 'B'),
// ])

// const vnode = h('div', { key: 1 }, 'hello');

const vnode = h('div', { key: 1 }, h('span', { key: 2 }, 'spans'));
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);
// console.log(vnode);

// const newVnode = h(
//     "div#container.two.classes",
//     { on: { click: anotherEventHandler } },
//     [
//         h(
//             "span",
//             { style: { fontWeight: "normal", fontStyle: "italic" } },
//             "This is now italic type"
//         ),
//         " and this is still just normal text",
//         h("a", { props: { href: "/bar" } }, "I'll take you places!"),
//     ]
// );
// // Second `patch` invocation
// patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state