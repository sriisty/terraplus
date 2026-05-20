import { createRouter, createWebHistory } from 'vue-router'
import Onboarding from '../views/Onboarding.vue'
import Home from '../views/Home.vue'
import Inbox from '../views/Inbox.vue'
import Admin from '../views/Admin.vue'
import DevTool from '../views/DevTool.vue'
import Selfie from '../views/Selfie.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: Onboarding
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/dev-tool',
      name: 'dev-tool',
      component: DevTool
    },
    {
      path: '/selfie',
      name: 'selfie',
      component: Selfie
    }
  ]
})

export default router
