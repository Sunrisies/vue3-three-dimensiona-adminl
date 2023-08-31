import * as Cesium from 'cesium'

import { useCesiumStore } from '@/store/index'

import { commonType, PointType, zoomToType, flyToType, getLonAndLatReturn, entitiesAddPolylineType } from '@/types/cesiumType'
import { getRoot } from '@/root'
const useCesium = useCesiumStore()
const root = getRoot()
/**
 * @Date: 2023-08-09 14:16:13
 * @Author: 小朱
 * @function: 在cesium 实例上添加点
 * @Param: 当前cesium实例以及经纬度和其他配置项
 * @return {*}
 */
export const entitiesAddPoint = (params: PointType) => {
  const { position, color, type } = params
  root.$Viewer.entities.add({
    position: position,
    name: type,
    point: {
      pixelSize: 10,
      color: color || root.$Cesium.Color.RED,
      outlineColor: root.$Cesium.Color.BLACK,
      outlineWidth: 2
    }
  })
}
/**
 * @Date: 2023-08-09 14:25:25
 * @Author: 小朱
 * @function: 在cesium中进行跳转，没有过渡
 * @Param: 当前cesium跳转的对象实例
 * @return {*}
 */
export const zoomTo = (params: zoomToType) => root.$Viewer.zoomTo(params.entity)

/**
 * @Date: 2023-08-09 14:40:25
 * @Author: 小朱
 * @function: 跳转，有过渡
 * @param: params 当前组件的根实例,要跳转的位置
 */
// 跳转
export const flyTo = (params: flyToType) => {
  const { position, durationL } = params
  // const flyToPromise = ref(true)
  return new Promise<boolean>((resolve) => {
    root.$Viewer.camera.flyTo({
      destination: position,
      orientation: {
        heading: root.$Cesium.Math.toRadians(0),
        pitch: root.$Cesium.Math.toRadians(-90),
        roll: 0.0
      },
      durationL: durationL || 5,
      complete: () => {
        resolve(false)
      }
    })
  })

  // root.$Viewer.camera.flyTo({
  //   destination: position,
  //   orientation: {
  //     heading: root.$Cesium.Math.toRadians(0),
  //     pitch: root.$Cesium.Math.toRadians(-90),
  //     roll: 0.0
  //   },
  //   durationL: durationL || 5,
  //   complete: () => {
  //     flyToPromise.value = false
  //     console.log('结束')
  //   }
  // })
  // console.log(flyToPromise, 'flyToPromise')
  // return flyToPromise.value
  // 监听 Promise 的 resolve 或 then 方法
  // flyToPromise.then(() => {
  //   console.log('FlyTo animation completed!')
  // })
}

/**
 * @Date: 2023-08-10 13:29:59
 * @Author: 小朱
 * @function: 给cesium的鼠标事情添加小手
 * @Param:
 * @return {*}
 */
export const changeCursor = () => {
  // 添加小手
  const event: Cesium.ScreenSpaceEventType = root.$Cesium.ScreenSpaceEventType.MOUSE_MOVE

  root.$Viewer.screenSpaceEventHandler.setInputAction(function onMouseMove() {
    // const pickedObject = root.scene.pick(movement.endPosition)

    // if (pickedObject && pickedObject.id) {
    root.$Viewer.container.style.cursor = 'pointer'
    // } else {
    //   root.container.style.cursor = 'default'
    // }
  }, event)
}

/**
 * @Date: 2023-08-10 15:29:34
 * @Author: 小朱
 * @function: 获取当前cesium在屏幕上面点击的经纬度
 * @Param:
 * @return {lon,lat}
 */

export const getLeftClickLonAndLat = (params: commonType) => {
  const event: Cesium.ScreenSpaceEventType = root.$Cesium.ScreenSpaceEventType.LEFT_CLICK
  root.$Viewer.screenSpaceEventHandler.setInputAction((event: any) => {
    const lonAndLat: getLonAndLatReturn = worldToLonAndLat({ root: root.$Viewer, position: event.position, type: params.type })
    useCesium.setLeftClickLonAndLatStore(lonAndLat)
    console.log(lonAndLat)
  }, event)
}
/**
 * @Date: 2023-08-11 11:23:58
 * @Author: 小朱
 * @function:
 * @Param:
 * @return {*}
 */
export const getMouseMoveLonAndLat = (params: commonType) => {
  const event: Cesium.ScreenSpaceEventType = root.$Cesium.ScreenSpaceEventType.MOUSE_MOVE
  root.$Viewer.screenSpaceEventHandler.setInputAction((event: any) => {
    const lonAndLat: getLonAndLatReturn = worldToLonAndLat({ root: root.$Viewer, position: event.endPosition, type: params.type })
    useCesium.setMouseMoveLonAndLatStore(lonAndLat)
  }, event)
}
/**
 * @Date: 2023-08-10 17:37:51
 * @Author: 小朱
 * @function: cesium画线
 * @Param:
 * @return {*}
 */
export const entitiesAddPolyline = (params: entitiesAddPolylineType) => {
  const { polylinePointArr, type } = params
  root.$Viewer.entities.add({
    name: type,
    polyline: {
      positions: polylinePointArr,
      width: 3,
      // material: Cesium.Color.GREEN, // 线的颜色
      show: true, // 是否显示
      clampToGround: false, // 一个布尔属性，指定是否应将折线绘制到地面。

      material: new root.$Cesium.PolylineDashMaterialProperty({
        color: root.$Cesium.Color.WHITE
        // dashLength: 5 // 短划线长度
      })
    }
  })
}

/**
 * @Date: 2023-08-11 12:06:10
 * @Author: 小朱
 * @function:
 * @Param:
 * @return {*}
 */
export const worldToLonAndLat = (params: commonType): getLonAndLatReturn => {
  const { position, type } = params
  const lonAndLat = reactive<getLonAndLatReturn>({
    lon: null,
    lat: null,
    type
  })
  const cartesian = root.$Viewer.camera.pickEllipsoid(position, root.$Viewer.scene.globe.ellipsoid) // 将屏幕坐标转成三维笛卡尔坐标
  const cartographic = root.$Cesium.Cartographic.fromCartesian(cartesian) // 将三维笛卡尔坐标转换成经纬度坐标,弧度为单位的
  lonAndLat.lon = root.$Cesium.Math.toDegrees(cartographic.longitude).toFixed(6) // 弧度表示的角度转换为以度数表示的角度。
  lonAndLat.lat = root.$Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
  return lonAndLat
}
/**
 * @Date: 2023-08-11 12:41:45
 * @Author: 小朱
 * @function: 清除所有鼠标事件
 * @Param:
 * @return {*}
 */

export const removeAllMouseEvents = () => {
  root.$Viewer.screenSpaceEventHandler.removeInputAction(root.$Cesium.ScreenSpaceEventType.LEFT_CLICK)
  root.$Viewer.screenSpaceEventHandler.removeInputAction(root.$Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  root.$Viewer.screenSpaceEventHandler.removeInputAction(root.$Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}
/**
 * @Date: 2023-08-11 15:28:41
 * @Author: 小朱
 * @function: 画多边形
 * @Param:
 * @return {*}
 */

export const entitiesAddPolygon = (params: entitiesAddPolylineType) => {
  const { polylinePointArr, type } = params
  root.$Viewer.entities.add({
    name: type,
    polygon: {
      hierarchy: new Cesium.CallbackProperty(() => {
        return new Cesium.PolygonHierarchy(polylinePointArr)
      }, false),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.3))
    }
  })
}
