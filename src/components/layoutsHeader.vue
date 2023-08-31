<template>
  <div class="layouts-header">
    <div>
      {{ route.meta.title }}
    </div>
    <div>
      <div class="icon">
        <IconConfigProvider color="black" size="26">
          <el-tooltip class="box-item" effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
            <Icon>
              <FullScreenMinimize24Regular v-if="isFullscreen" @click="exitFullscreen" />
              <FullScreenMaximize20Filled v-else @click="enterFullscreen" />
            </Icon>
          </el-tooltip>
        </IconConfigProvider>
      </div>
      <div>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { FullScreenMinimize24Regular, FullScreenMaximize20Filled } from "@vicons/fluent";
import { Icon, IconConfigProvider } from "@vicons/utils";
const route = useRoute()
const isFullscreen = ref(false)
const enterFullscreen = () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { // 兼容Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { // 兼容Chrome、Safari和Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { // 兼容IE
    document.documentElement.msRequestFullscreen();
  }
  isFullscreen.value = true
}
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  isFullscreen.value = false;
}
</script>

<style lang='less' scoped>
.layouts-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px 0 10px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 6px 0px;
  justify-content: space-between;

  :nth-child(2) {
    // margin-right: 10px;
    display: flex;
    align-items: center;
    gap: 0 10px;
  }

  :nth-child(3) {
    // margin-left: auto;
  }
}
</style>