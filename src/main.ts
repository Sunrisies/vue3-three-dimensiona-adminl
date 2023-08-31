import App from './App.vue'
import { createInstance } from '@/root'
import './style.css'
// import setupLocatorUI from '@locator/runtime'

// if (process.env.NODE_ENV === 'development') {
//   setupLocatorUI({
//     adapter: 'vue'
//   })
// }

import router from './router' //匹配自己项目所对应的路径
// 导入pinia的hock
import { createPinia } from 'pinia'
const store = createPinia()
export const app = createInstance(App)
app.use(router)
app.use(store)
app.mount('#app')
