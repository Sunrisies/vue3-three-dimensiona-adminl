import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { mars3dPlugin } from 'vite-plugin-mars3d'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  esbuild: {
    target: 'es2015'
  },
  plugins: [
    vue(),
    cesium(),
    AutoImport({
      /* options */ imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    mars3dPlugin()
  ],
  server: {
    open: true,
    port: 3000,
    host: true
  },
  resolve: {
    //设置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      '*': path.resolve('')
    }
  }
})
