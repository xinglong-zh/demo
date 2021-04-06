import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/bilibili',
    name: 'bilibili',
    component: () => import('@/views/bilibili/index'),
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/map/index.vue')
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index')
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('@/views/demo/chart.vue')
  },
  {
<<<<<<< HEAD
    path: '/pop',
    name: 'pop',
    component: () => import('@/views/demo/popup.vue')
  }
=======
    path:'/pop',
    name:'pop',
    component:()=>import('@/views/demo/popup.vue')
  },
  {
    path:'/promise',
    name:'promise',
    component:()=>import('@/views/demo/promise.vue')
  },
>>>>>>> 59699f1b6251f66cf1ba52607ed60eaaf880b4c7
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
