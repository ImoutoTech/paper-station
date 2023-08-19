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
    component: HomeView,
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
  }
]

export default routes
