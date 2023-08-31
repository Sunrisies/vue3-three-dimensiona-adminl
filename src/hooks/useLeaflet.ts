import L from 'leaflet'
import { App } from 'vue'
import 'leaflet/dist/leaflet.css'
import { useLeafletStore } from '@/store/index'
interface LineSpec {
  p1: any
  p2: any
  color: string
  line: any
}
export const useLeaflet = (app: App) => {
  const tdtKey = 'd434002ddef854e56c24ce68e885a55b'
  const leafletStore = useLeafletStore()
  let leafletMap = reactive<any>({})
  let markers = reactive<any>([])

  const poLyLines = reactive<LineSpec[]>([])
  const polygonPoints = reactive<any>([])
  const allPolygons = reactive<any>([])

  let currentPolygon: any = null
  let p1: any, p2: any //p1存放起点，p2存放终点
  const initMap = (id: HTMLElement | null) => {
    //影像地图
    const tiandituMap = L.tileLayer(
      `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tdtKey}`
    )
    //注记
    const tiandituText = L.tileLayer(
      `http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tdtKey}`
    )
    const layers = L.layerGroup([tiandituMap, tiandituText])
    leafletMap = L.map(id, {
      //需绑定地图容器div的id
      center: [39.56, 116.2], //初始地图中心
      zoom: 10, //初始缩放等级
      maxZoom: 18, //最大缩放等级
      minZoom: 0, //最小缩放等级
      zoomControl: false, //不显示缩放小控件
      layers: [layers]
    })
    app.config.globalProperties.$Leaflet = leafletMap
  }
  const handleDrawPoint = () => {
    leafletStore.setActive('point')
    clearOff()
    leafletMap.on('click', function (event: any) {
      const latlng = event.latlng
      const marker = L.marker(latlng).addTo(leafletMap)
      L.popup().setLatLng(latlng).setContent(`<p>${latlng}</p>`).openOn(leafletMap)

      markers.push(marker)
    })
  }

  const handleDrawLine = (type: string) => {
    clearOff()
    leafletStore.setActive(type)
    ElMessage({
      message: '点击右键，停止画',
      type: 'warning'
    })
    if (type === 'line') {
      leafletMap.on('click', handleLineFirstClick) // 开始第一次鼠标点击事件监听
    }
    if (type === 'polygon') {
      leafletMap.on('click', handlePolygonFirstClick)
    }
  }

  const handleLineSclick = () => {
    leafletMap.off('mousemove', handleLineMove) // 关闭鼠标移动监听事件
    leafletMap.off('click', handleLineSclick) // 关闭第二次点击事件监听
    leafletMap.on('click', handleLineFirstClick) // 再次开始第一次点击事件监听，准备下次画线
  }

  const handleLineMove = (e: any) => {
    if (poLyLines.length > 0) {
      // 判断是否有画线
      const prevLine = poLyLines[poLyLines.length - 1]
      leafletMap.removeLayer(prevLine) // 清除上一条线段
    }
    p2 = e.latlng // 确定线段终点
    const line = new L.polyline([p1, p2], {
      // 画线
      color: 'blue' // 线段颜色
    }).addTo(leafletMap)
    poLyLines.push({ p1, p2, color: 'blue', line }) // 存储线段规格到数组中
    p1 = p2 // 更新起点为当前终点
    leafletMap.off('click', handleLineFirstClick) // 关闭第一次点击事件监听
    leafletMap.on('contextmenu', handleLineSclick) // 开始第二次点击事件监听
  }

  const handleLineFirstClick = (e: any) => {
    p1 = e.latlng // 确定起点
    leafletMap.off('click', handleLineSclick) // 关闭 sclick: 第二次鼠标点击事件触发函数
    leafletMap.on('mousemove', handleLineMove) // 开始监听鼠标移动事件
  }

  const stopDrawingPolygon = () => {
    leafletMap.off('mousemove', handleMouseMove)
    leafletMap.off('click', handlePolygonFirstClick)
    leafletMap.on('click', handlePolygonFirstClick)
  }

  const handleMouseMove = (e: any) => {
    if (currentPolygon) {
      leafletMap.removeLayer(currentPolygon)
    }
    const point = e.latlng
    polygonPoints.push(point)
    currentPolygon = L.polygon(polygonPoints, {
      color: 'blue'
    }).addTo(leafletMap)
    allPolygons.push(currentPolygon)
    leafletMap.off('click', handlePolygonFirstClick) // 关闭第一次点击事件监听
    leafletMap.on('contextmenu', stopDrawingPolygon) // 开始第二次点击事件监听
  }

  const handlePolygonFirstClick = (e: any) => {
    polygonPoints.length = 0
    const startPoint = e.latlng
    polygonPoints.push(startPoint)
    currentPolygon = null
    leafletMap.off('click', handlePolygonFirstClick)
    leafletMap.on('mousemove', handleMouseMove)
  }
  const clearOff = () => {
    leafletMap.off('click')
    leafletMap.off('mousemove')
    leafletMap.off('contextmenu')
  }
  const handleCleanUp = (type: string) => {
    leafletStore.setActive('')
    clearOff()
    if (type === 'clearPoint') {
      markers.forEach(function (marker: any) {
        leafletMap.removeLayer(marker)
      })
      markers = []
    }
    if (type === 'clearLine') {
      poLyLines.forEach((line) => {
        leafletMap.removeLayer(line.line)
      })
      poLyLines.length = 0
    }
    if (type === 'clearPolygon') {
      allPolygons.forEach((polygon: any) => {
        leafletMap.removeLayer(polygon)
      })
      allPolygons.length = 0
    }
    if (type === 'clear') {
      markers.forEach(function (marker: any) {
        leafletMap.removeLayer(marker)
      })
      markers = []
      poLyLines.forEach((line) => {
        leafletMap.removeLayer(line.line)
      })
      poLyLines.length = 0
      allPolygons.forEach((polygon: any) => {
        leafletMap.removeLayer(polygon)
      })
      allPolygons.length = 0
    }
  }
  return { initMap, handleDrawPoint, handleCleanUp, handleDrawLine }
}
