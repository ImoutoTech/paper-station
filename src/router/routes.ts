import HomeView from '@/views/view-index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页',
      menuKey: '/'
    }
  },
  {
    path: '/config',
    name: 'config',
    component: HomeView,
    meta: {
      title: '配置管理',
      menuKey: '/config'
    }
  },
  {
    path: '/site',
    name: 'site',
    component: HomeView,
    meta: {
      title: '站点管理',
      menuKey: '/site'
    }
  }
]

export default routes
