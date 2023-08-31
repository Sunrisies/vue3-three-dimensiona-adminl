<template>
  <div class="leaflet-container" ref="leafletContainer">

  </div>
  <!-- <div class="leaflet-content">
    <el-button @click="handleTrigger('point')" :class="isActive === 'point' ? 'is-active' : ''">画点</el-button>
    <el-button @click="handleTrigger('line')" :class="isActive === 'line' ? 'is-active' : ''">画线</el-button>
    <el-button @click="handleTrigger('polygon')" :class="isActive === 'polygon' ? 'is-active' : ''">画面</el-button>
    <el-button @click="handleTrigger('clearPoint')">清除点</el-button>
    <el-button @click="handleTrigger('clearLine')">清除线</el-button>
    <el-button @click="handleTrigger('clearPolygon')">清除面</el-button>
    <el-button @click="handleTrigger('clear')">清除</el-button>
  </div> -->
</template>

<script setup lang='ts'>
import { getApp } from '@/root'

import { useLeafletStore } from '@/store/index'
import { useLeaflet } from '@/hooks/useLeaflet'
const leafletContainer = ref<HTMLElement | null>(null)
const app = getApp()
const leafletStore = useLeafletStore()
const isActive = computed(() => leafletStore.getIsActive)
const { initMap, handleDrawPoint, handleCleanUp, handleDrawLine } = useLeaflet(app)

onMounted(() => {
  initMap(leafletContainer.value)
})
const handleTrigger = (type: string): void => {
  switch (type) {
    case 'point':
      handleDrawPoint()
      break
    case 'line':
    case 'polygon':
      handleDrawLine(type)
      break
    case 'clearPoint':
    case 'clearLine':
    case 'clearPolygon':
    case "clear":
      handleCleanUp(type)
      break
    default:
      throw '参数错误'
  }
}
</script>

<style lang='less' scoped>
.leaflet-container {
  width: 100%;
  height: calc(100vh - 90px);
}

.leaflet-content {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 800px;
  display: flex;
  justify-content: start;
  gap: 0 10px;
  z-index: 999;
}

.is-active {
  border: 1px solid #ff00ee;
}
</style>