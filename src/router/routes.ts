import HomeView from '@/views/view-index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/config',
    name: 'config',
    component: HomeView
  },
  {
    path: '/site',
    name: 'site',
    component: HomeView
  }
]

export default routes
