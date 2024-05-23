import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/pinia'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

import 'normalize.css'
import './assets/base.scss'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs'
  }
})

app.mount('#app')
