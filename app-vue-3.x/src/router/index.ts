import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path:'/type',
  //   name:'Type',
  //   component:()=> import('../views/Type')
  // },
  {
    path:'/bilibili',
    name:'bilibili',
    component:()=> import('@/views/bilibili/index'),
  },
  {
    path:'/map',
    name:'map',
    component:() => import('@/views/map/index.vue')
  },
  {
    path:'/demo',
    name:'demo',
    component:()=>import('@/views/demo/index')
  },
  {
    path:'/chart',
    name:'chart',
    component:()=>import('@/views/demo/chart.vue')
  },
  {
    path:'/pop',
    name:'pop',
    component:()=>import('@/views/demo/popup.vue')
  },
  {
    path:'/multiMap',
    name:'multiMap',
    component:()=>import('@/views/map/multiMap.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
