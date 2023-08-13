import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import pinia from '../stores/pinia'
import { useGlobalStore } from '@/stores/store'

const { menuStore } = useGlobalStore(pinia)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  menuStore.setMenuValue(to.meta.menuKey as string)
  document.title = `Paper Station | ${to.meta.title}`
})

export default router
