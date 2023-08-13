import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'normalize.css'
import './assets/base.scss'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
