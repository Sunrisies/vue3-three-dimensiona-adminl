import { createApp, ComponentCustomProperties, App as VueApp } from 'vue'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $Cesium: any // Map类
    $Viewer: any // 地图对象
    $MouseTool: any
    $Leaflet: any
  }
}
let root: ComponentCustomProperties
let app = null as any

export function createInstance(App: any): VueApp {
  app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  root = app.config.globalProperties as ComponentCustomProperties
  return app
}

export function getRoot(): ComponentCustomProperties {
  return root
}

export function getApp(): VueApp {
  return app
}
