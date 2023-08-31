import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Layouts from "@/layouts/index.vue";
// createWebHistory

//2. 路由配置
const routes: Array<RouteRecordRaw> = [
  //redirect 重定向也是通过 routes 配置来完成，下面就是从 / 重定向到 /index
  {
    path: "/",
    redirect: "/index",
    component: Layouts,
    children: [
      {
        path: "/index",
        component: () => import("@/pages/index.vue"),
        name: "index",
      },
    ],
  },
  {
    path: "/cesium",
    name: "cesium",
    component: Layouts,
    children: [
      {
        path: "/cesium/index",
        component: () => import("@/pages/cesium.vue"),
        name: "cesium",
        meta: {
          title: "cesium",
        },
      },
    ],
  },
  {
    path: "/three",
    name: "three",
    component: Layouts,
    children: [
      {
        path: "/three/index",
        component: () => import("@/pages/three.vue"),
        name: "three",
        meta: {
          title: "three",
        },
      },
    ],
  },
  {
    path: "/mars3d",
    name: "mars3d",
    component: Layouts,
    children: [
      {
        path: "/mars3d/index",
        component: () => import("@/pages/mars3d.vue"),
        name: "mars3d",
        meta: {
          title: "mars3d",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login.vue"),
  },
  {
    path: "/leaflet",
    name: "leaflet",
    component: Layouts,
    children: [
      {
        path: "/leaflet/index",
        component: () => import("@/pages/leaflet.vue"),
        name: "leaflet",
        meta: {
          title: "leaflet",
        },
      },
    ],
  },
  {
    path: "/ol",
    name: "ol",
    component: Layouts,
    children: [
      {
        path: "/ol/index",
        component: () => import("@/pages/ol.vue"),
        name: "ol",
        meta: {
          title: "ol",
        },
      },
    ],
  },
];

// 3. 创建路由实例
const router = createRouter({
  // （1）采用hash 模式
  history: createWebHashHistory(),
  // （2）采用 history 模式
  // history: createWebHistory(),
  routes, //使用上方定义的路由配置
});

// 4. 导出router
export default router;
