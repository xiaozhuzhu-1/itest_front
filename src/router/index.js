import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '../views/main.vue'
import login from '../views/login.vue'
import project from "../views/project";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/project',
    component: project
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/other',
    name: 'other',
    component:()=>import('../views/other')
  },
  {
    path: '/main',
    name: 'main',
    component: main,
    children:[
      {
        path:'service',
        name:'service',
        component:()=>import('../views/service/index')
      },
      {
        path:'interface',
        name:'interface',
        component:()=>import('../views/interface/index')
      },
      {
        path:'task',
        name:'task',
        component:()=>import('../views/task/index')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
