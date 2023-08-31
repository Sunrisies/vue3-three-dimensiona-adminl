<template>
  <div class="index-content">
    <Side></Side>
    <div class="main">
      <LayoutsHeader></LayOutsHeader>
      <div class="router-content">
        <router-view></router-view>
      </div>
    </div>
  </div>

  <!-- <div class="index-content">
    <el-button @click="handleGoTo('/cesium')">cesium</el-button>
    <el-button type="primary" @click="handleGoTo('/three')">three</el-button>
    <el-button type="primary" @click="handleGoTo('/mars3d')">mars3d</el-button>
    <el-button type="primary" @click="handleGoTo('/leaflet')">leaflet</el-button>
    <el-button type="primary" @click="handleGoTo('/ol')">ol</el-button>



  </div> -->
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.index-content {
  height: 100vh;
  display: flex;

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .router-content {
      flex: 1;
      padding: 20px;
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
