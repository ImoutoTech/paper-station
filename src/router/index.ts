import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import pinia from '../stores/pinia'
import { useGlobalStore } from '@/stores/store'
import { MessagePlugin } from 'tdesign-vue-next'

const { menuStore, userStore } = useGlobalStore(pinia)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  if (to.meta.needAuth && !userStore.isLogin && !userStore.loginLoading) {
    MessagePlugin.warning('请先登录')
    router.push('/')
  }

  menuStore.setMenuValue(to.meta.menuKey as string)
  document.title = `Paper Station | ${to.meta.title}`
})

export default router
