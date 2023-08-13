import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/pinia'

import 'normalize.css'
import './assets/base.scss'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
