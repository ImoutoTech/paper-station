import HomeView from '@/views/view-index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页',
      menuKey: '/',
      needAuth: false
    }
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('@/views/config/view-index.vue'),
    meta: {
      title: '配置管理',
      menuKey: '/config',
      needAuth: true
    }
  },
  {
    path: '/site',
    name: 'site',
    component: HomeView,
    meta: {
      title: '站点管理',
      menuKey: '/site',
      needAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login-callback.vue'),
    meta: {
      title: '登录',
      menuKey: '/login',
      needAuth: false
    }
  }
]

export default routes
