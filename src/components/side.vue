<template>
  <el-menu class="el-menu-vertical-demo " :collapse="isCollapse" router >
    <template v-for="menuItem in menuItems" :key="menuItem.index">
      <el-menu-item v-if="!menuItem.subMenuItems" @click="onGoMenuItem(menuItem.router)">
        {{ menuItem.title }}
      </el-menu-item>
      <el-sub-menu v-else :index="menuItem.index"  >
        <template #title>{{ menuItem.title }}</template>
        <el-menu-item  v-for="subItem in menuItem.subMenuItems" :key="subItem.index" :index="subItem.index" @click="onGoMenuItem(subItem.router)">{{ subItem.title }}</el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
  
<script lang="ts" setup>
  const router = useRouter()


const isCollapse = ref(false)
const menuItems = [
  {
    index: '1',
    title: 'Cesium',
    subMenuItems: [
      {
        index: '1-1',
        title: 'Cesium基础',
    router:'/cesium/index',

      },
      {
        index: '1-2',
        title: 'Cesium进阶',
    router:'/cesium/index',

      }
    ]
  },
  {
    index: '2',
    title: 'Leaflet',
    subMenuItems: [
      {
        index: '2-1',
        title: 'Leaflet基础',
    router:'/leaflet/index',

      }
    ]
  }, {
    index: '3',
    title: 'Mars3D',
    router:'/mars3d/index',
  },
  {
    index: '4',
    title: 'ol',
    router:'/ol/index',
  }
]

const onGoMenuItem = (path:string) => {
  router.push({ path })
}

</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
}

</style>
