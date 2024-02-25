import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/style/tailwind.css'
import WangEditor from '@/components/WangEditor/index.vue'
import SideNavBar from '@/components/SideNavBar/index.vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('WangEditor', WangEditor)
app.component('SideNavBar', SideNavBar)

app.mount('#app')
