<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
  <!-- <div class="cesium-content">
    <el-button :loading="loading" @click="handleTrigger('point')"
      :class="isActive === 'point' ? 'is-active' : ''">画点</el-button>
    <el-button :loading="loading" @click="handleTrigger('line')"
      :class="isActive === 'line' ? 'is-active' : ''">画线</el-button>
    <el-button :loading="loading" @click="handleTrigger('polygon')"
      :class="isActive === 'polygon' ? 'is-active' : ''">画面</el-button>
    <el-button :loading="loading" @click="handleTrigger('clearPoint')">清除点</el-button>
    <el-button :loading="loading" @click="handleTrigger('clearLine')">清除线</el-button>
    <el-button :loading="loading" @click="handleTrigger('clearPolygon')">清除面</el-button>
    <el-button :loading="loading" @click="handleTrigger('clear')">清除</el-button>
    <el-button :loading="loading" @click="handleTrigger('contour')">等高线</el-button>
    <el-button :loading="loading" @click="handleTrigger('polymerization')">聚和</el-button>

  </div> -->
  <!-- <div id="contour" v-show="isActive === 'contour'">
      <table>
        <tbody>
          <tr>
            <td>Background Transparency</td>
            <td>
              <input type="range" min="0.0" max="1.0" step="0.01" data-bind="value: backgroundTransparency, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Band Transparency</td>
            <td>
              <input type="range" min="0.0" max="1.0" step="0.01" data-bind="value: bandTransparency, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Band Thickness</td>
            <td>
              <input type="range" min="10" max="1000" step="1" data-bind="value: bandThickness, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Band 1 Position</td>
            <td>
              <input type="range" min="4000" max="8848" step="1" data-bind="value: band1Position, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Band 2 Position</td>
            <td>
              <input type="range" min="4000" max="8848" step="1" data-bind="value: band2Position, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Band 3 Position</td>
            <td>
              <input type="range" min="4000" max="8848" step="1" data-bind="value: band3Position, valueUpdate: 'input'">
            </td>
          </tr>
          <tr>
            <td>Gradient</td>
            <td>
              <input type="checkbox" data-bind="checked: gradient">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="polymerization" v-show="isActive === 'polymerization'">
      <table>
        <tbody>
          <tr>
            <td>Pixel Range</td>
            <td>
              <input type="range" min="1" max="200" step="1" data-bind="value: pixelRange, valueUpdate: 'input'">
              <input type="text" size="2" data-bind="value: pixelRange">
            </td>
          </tr>
          <tr>
            <td>Minimum Cluster Size</td>
            <td>
              <input type="range" min="2" max="20" step="1" data-bind="value: minimumClusterSize, valueUpdate: 'input'">
              <input type="text" size="2" data-bind="value: minimumClusterSize">
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
</template>

<script lang="ts" setup>
import { getApp } from '@/root'
import { useCesium } from '@/hooks/useCesium'
import { useCesiumStore } from '@/store/index'

const CesiumStore = useCesiumStore()

const isActive = computed(() => CesiumStore.getIsActive)
const cesiumContainer: Ref<HTMLElement | null> = ref(null)
const app = getApp()
const loading = computed(() => CesiumStore.getLoading)
const { createCesium, handleDrawPoint, handleDrawLine, handleCleanUp, handleContour, handlePolymerization } = useCesium(app)
onMounted(() => {
  nextTick(() => {
    createCesium(cesiumContainer.value)
  })
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
    case 'contour':
      handleContour()
      break
    case 'polymerization':
      handlePolymerization()
      break
    default:
      throw '参数错误'
  }
}


</script>

<style lang="less" scoped>
.cesium-container {
  width: 100%;
  height: calc(100vh - 90px);
  box-sizing: border-box;
}

// .cesium-content {
//   position: absolute;
//   top: 70px;
//   left: 270px;
//   width: 800px;
//   display: flex;
//   justify-content: start;
//   gap: 0 10px;
// }

// .is-active {
//   border: 1px solid #ff00ee;
// }
// #contour,#polymerization{
//   position: absolute;
//   right: 10px;
//   z-index: 999;
//   top: 10px;
//   color: white;
// }
</style>
