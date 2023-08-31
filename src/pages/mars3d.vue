<template>
  <div id="mars3dContainer" class="mars3d-container"></div>
</template>

<script lang="ts" setup>
import * as mars3d from "mars3d";

onMounted(() => {
  const mapOptions = {
    basemaps: [{ name: "天地图", type: "tdt", layer: "img_d", show: true }],
  }
  new mars3d.Map("mars3dContainer", mapOptions)

})

</script>
<style lang="less" scoped>
.mars3d-container {
  width: 100%;
  height: calc(100vh - 90px);
}
</style>