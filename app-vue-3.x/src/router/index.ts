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
    path:'/pop',
    name:'pop',
    component:()=>import('@/views/demo/popup.vue')
  },
  {
    path:'/promise',
    name:'promise',
    component:()=>import('@/views/demo/promise.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
