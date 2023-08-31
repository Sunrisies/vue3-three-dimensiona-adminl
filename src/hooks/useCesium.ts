import * as Cesium from "cesium";
import { App } from "vue";
import {
  flyTo,
  entitiesAddPoint,
  changeCursor,
  getLeftClickLonAndLat,
  entitiesAddPolyline,
  getMouseMoveLonAndLat,
  removeAllMouseEvents,
  entitiesAddPolygon,
} from "@/utils/cesium";
import { useCesiumStore } from "@/store/index";
import { getLonAndLatReturn } from "@/types/cesiumType";
export const useCesium = (app: App) => {
  const useCesium = useCesiumStore();
  let viewer = reactive<any>({});
  let mouseTool: Cesium.ScreenSpaceEventHandler;
  const height = 20;
  const isActive = computed(() => useCesium.getIsActive);
  // const esri = new Cesium.ArcGisMapServerImageryProvider({
  //   url: 'http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}'
  // })
  // let terrain = reactive<any>(null)
  //  terrain =  Cesium.Terrain.fromWorldTerrain({
  //   requestVertexNormals: true, //Needed to visualize slope
  // })
  // 创建cesium实例
  const createCesium = async (id: HTMLElement | null) => {
    viewer = new Cesium.Viewer(id!, {
      timeline: false, // 时间线
      animation: false, // 是否显示动画控件
      homeButton: false, // 返回主视角
      shouldAnimate: false,
      fullscreenButton: false, // 是否显示全屏按钮
      baseLayerPicker: false, // 是否显示图层选择控件
      infoBox: false, // 是否显示点击要素之后显示的信息
      navigationHelpButton: false, // 模式切换2D、3D
      geocoder: false, // 搜索框
      // imageryProvider: esri,
      selectionIndicator: false,
      sceneModePicker: false, // 是否显示投影方式控件
      requestRenderMode: false, // 启用请求渲染模式
      scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
      sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
      // terrain:Cesium.Terrain.fromWorldTerrain()
    });
  
 
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 去掉logo
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    mouseTool = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    app.config.globalProperties.$MouseTool = mouseTool;
    app.config.globalProperties.$Viewer = viewer;
    app.config.globalProperties.$Cesium = Cesium;


    const position = Cesium.Cartesian3.fromDegrees(116.3907, 39.972665, 2000);
    await flyTo({ position }).then((res) => {
      useCesium.setLoading(res);
    });

    updateMaterial1()

    return {
      viewer: viewer,
    };
  };
  const handleDrawPoint = () => {
    useCesium.setActive("point");
    viewer.scene.globe.material = undefined;

    changeCursor();
    getLeftClickLonAndLat({ type: "point" });
    watch(
      () => useCesium.getLeftClickLonAndLatStore,
      (n: getLonAndLatReturn) => {
        if (isActive.value === "point") {
          const position = Cesium.Cartesian3.fromDegrees(
            Number(n.lon),
            Number(n.lat),
            height
          );
          entitiesAddPoint({ position, type: "point" });
        }
      },
      { deep: true }
    );
  };
  const demo = () => {
    ElMessage({
      message: '查看等高线之后，在看其他的，请刷新页面',
      type: 'warning'
    })
    const viewModel = {
      gradient: false,
      band1Position: 70.0,
      band2Position: 75.0,
      band3Position: 80.0,
      bandThickness: 10.0,
      bandTransparency: 1,
      backgroundTransparency: 0,
    };
  
  //   Cesium.knockout.track(viewModel);
  //   const toolbar = document.getElementById("contour");
  //    // 清除先前的绑定
  // Cesium.knockout.cleanNode(toolbar);
  //   Cesium.knockout.applyBindings(viewModel, toolbar);
  //   for (const name in viewModel) {
  //     if (viewModel.hasOwnProperty(name)) {
  //       Cesium.knockout
  //         .getObservable(viewModel, name)
  //         .subscribe(updateMaterial);
  //     }
  //   }
    
    function updateMaterial() {
      const gradient = Boolean(viewModel.gradient);
      const band1Position = Number(viewModel.band1Position);
      const band2Position = Number(viewModel.band2Position);
      const band3Position = Number(viewModel.band3Position);
      const bandThickness = Number(viewModel.bandThickness);
      const bandTransparency = Number(viewModel.bandTransparency);
      const backgroundTransparency = Number(
        viewModel.backgroundTransparency
      );
    console.log(bandTransparency,'bandTransparency')
      const layers = [];
      const backgroundLayer = {
        entries: [
          {
            height: 40.0,
            color: new Cesium.Color(0.0, 0.0, 0.2, backgroundTransparency),
          },
          {
            height: 80.0,
            color: new Cesium.Color(1.0, 1.0, 1.0, backgroundTransparency),
          },
          {
            height: 85.0,
            color: new Cesium.Color(1.0, 0.0, 0.0, backgroundTransparency),
          },
        ],
        extendDownwards: true,
        extendUpwards: true,
      };
      layers.push(backgroundLayer);
    
      const gridStartHeight = 42.0;
      const gridEndHeight = 8848.0;
      const gridCount = 5;
      for (let i = 0; i < gridCount; i++) {
        const lerper = i / (gridCount - 1);
        const heightBelow = Cesium.Math.lerp(
          gridStartHeight,
          gridEndHeight,
          lerper
        );
        const heightAbove = heightBelow + 10.0;
        const alpha =
          Cesium.Math.lerp(0.2, 0.4, lerper) * backgroundTransparency;
        layers.push({
          entries: [
            {
              height: heightBelow,
              color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
            },
            {
              height: heightAbove,
              color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
            },
          ],
        });
      }
    
      const antialias = Math.min(10.0, bandThickness * 0.1);
    
      if (!gradient) {
        const band1 = {
          entries: [
            {
              height: band1Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
            },
            {
              height: band1Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
            },
            {
              height: band1Position + bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
            },
            {
              height: band1Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
            },
          ],
        };
    
        const band2 = {
          entries: [
            {
              height: band2Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
            },
            {
              height: band2Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
            },
            {
              height: band2Position + bandThickness * 0.5,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
            },
            {
              height: band2Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
            },
          ],
        };
    
        const band3 = {
          entries: [
            {
              height: band3Position - bandThickness * 0.5 - antialias,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
            },
            {
              height: band3Position - bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
            },
            {
              height: band3Position + bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
            },
            {
              height: band3Position + bandThickness * 0.5 + antialias,
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
            },
          ],
        };
    
        layers.push(band1);
        layers.push(band2);
        layers.push(band3);
      } else {
        const combinedBand = {
          entries: [
            {
              height: band1Position - bandThickness * 0.5,
              color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
            },
            {
              height: band2Position,
              color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
            },
            {
              height: band3Position + bandThickness * 0.5,
              color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
            },
          ],
        };
    
        layers.push(combinedBand);
      }
    
      const material = Cesium.createElevationBandMaterial({
        scene: viewer.scene,
        layers: layers,
      });
      viewer.scene.globe.material = material;
    }
    
    updateMaterial(); 
  }
  const updateMaterial1 =() => {
    const viewerPosition = viewer.camera.positionCartographic;
    const viewerLongitude = Cesium.Math.toDegrees(viewerPosition.longitude);
    const viewerLatitude = Cesium.Math.toDegrees(viewerPosition.latitude);
    // 判断当前位置是否在需要应用地形材质的地区
    const isTargetArea = checkTargetArea(viewerLongitude, viewerLatitude);
  
    if (isTargetArea) {
      console.log(123)
      // 在目标地区，应用地形材质
      // ...
    } else {
  console.log(232)

      // 不在目标地区，保持原样
      // ...
    }
  }
  
  function checkTargetArea(longitude:any, latitude:any) {
    // 在此处添加判断逻辑，根据经纬度判断是否在目标地区
    // 返回一个布尔值，表示是否在目标地区
    // 示例：判断是否在某个矩形区域内
    const targetArea = {
      west: 116.388631,
      south: 39.970387,
      east: 116.386673,
      north: 39.971522
    }
  
    return (
      longitude >= targetArea.west &&
      longitude <= targetArea.east &&
      latitude >= targetArea.south &&
      latitude <= targetArea.north
    );
  }

  // 保存所有点的数据
  let polylinePointArr = reactive<Cesium.Cartesian3[]>([]);

  let tempPositions: any = [];
  // 临时线entity
  let temporaryPolylineEntity: any = null;
  const handleDrawLine = (type: string) => {
    useCesium.setActive(type);
    viewer.scene.globe.material = undefined;

    removeAllMouseEvents();
    changeCursor();
    getLeftClickLonAndLat({ type });
    watch(
      () => useCesium.getLeftClickLonAndLatStore,
      (n: getLonAndLatReturn) => {
        if (n.type === type) {
          const position = Cesium.Cartesian3.fromDegrees(
            Number(n.lon),
            Number(n.lat),
            height
          );
          if (Cesium.defined(position)) {
            polylinePointArr.push(position);
            polylinePointArr = Array.from(
              polylinePointArr
                .reduce((map, point) => {
                  const key = JSON.stringify(point);
                  map.set(key, point);
                  return map;
                }, new Map())
                .values()
            );
            if (temporaryPolylineEntity == null) {
              switch (type) {
                case "line":
                  drawDynamicPolyline();
                  break;
                case "polygon":
                  drawDynamicFace();
                  break;
                default:
                  throw "参数错误";
              }
              getMouseMoveLonAndLat({ type });
            }
          }
        }
      },
      { deep: true }
    );
    watch(
      () => useCesium.getMouseMoveLonAndLatStore,
      (n) => {
        const position = Cesium.Cartesian3.fromDegrees(
          Number(n.lon),
          Number(n.lat),
          height
        );
        if (Cesium.defined(position)) {
          tempPositions = polylinePointArr.concat([position]);
        }
      },
      { deep: true }
    );

    mouseTool.setInputAction(() => {
      viewer.entities.remove(temporaryPolylineEntity);
      temporaryPolylineEntity = null;
      switch (type) {
        case "line":
          entitiesAddPolyline({ polylinePointArr, type });
          break;
        case "polygon":
          entitiesAddPolygon({ polylinePointArr, type });
          break;
        default:
          throw "参数错误";
      }
      polylinePointArr = [];
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  const drawDynamicPolyline = () => {
    temporaryPolylineEntity = viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return tempPositions;
        }, false),
        width: 3, // 宽度
        material: Cesium.Color.GREEN, // 线的颜色,
        show: true, // 是否显示
        clampToGround: false, // 一个布尔属性，指定是否应将折线绘制到地面。
      },
    });
  };
  const drawDynamicFace = () => {
    temporaryPolylineEntity = viewer.entities.add({
      name: "polygon",
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(tempPositions);
        }, false),
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        ),
      },
    });
  };

  const handleDrawFace = () => {
    useCesium.setActive("face");
    viewer.scene.globe.material = undefined;

    drawDynamicFace();
  };
  const handleCleanUp = (type: string) => {
    useCesium.setActive("");
    const clearData = {
      clearPoint: "point",
      clearLine: "line",
      clearPolygon: "polygon",
      clear: "clearAll",
    };
    // 清除所有事件
    removeAllMouseEvents();
    viewer.scene.globe.material = undefined;
    switch (type) {
      case "clearPoint":
        clear(clearData[type]);
        break;
      case "clearLine":
        clear(clearData[type]);
        break;
      case "clearPolygon":
        clear(clearData[type]);
        break;
      case "clear":
        viewer.entities.removeAll();
        break;
      default:
        throw "参数错误";
    }
  };
  const clear = (type: string) => {
    const entities = viewer.entities.values;
    for (const entity of entities) {
      if (entity._name === type) {
        setTimeout(() => {
          viewer.entities.remove(entity);
        }, 50);
      }
    }
  }
  const handleContour = () => {
    useCesium.setActive("contour");
    demo()

  }
  const handlePolymerization = async () => {
    console.log(1234)
    useCesium.setActive("polymerization");
    ElMessage({
      message: '使用聚合的时候，可能存在广告牌看不到的情况，请移动屏幕',
      type: 'warning'
    })
    viewer.scene.globe.material = undefined;
    const options = {
      // camera: viewer.scene.camera,
      // canvas: viewer.scene.canvas,
      // clamToGround: true,
      stroke: Cesium.Color.HOTPINK,
      fill: Cesium.Color.PINK,
      strokeWidth: 3,
      markerSymbol: '?'
    };
    viewer.dataSources.add(
      Cesium.GeoJsonDataSource.load(
        "facilities/facilities.geojson",
        options
      )
    ).then(function (dataSource:any) {
  console.log(dataSource,'dataSource')
  const pixelRange = 20;
  const minimumClusterSize = 5; 
  const enabled = true; 
 
  dataSource.clustering.enabled = enabled; //聚合开启
  dataSource.clustering.pixelRange = pixelRange; //设置像素范围，以扩展显示边框
  dataSource.clustering.minimumClusterSize = minimumClusterSize; //设置最小的聚合点数目，超过此数目才能聚合
 
  let removeListener:any;
  
  //按聚合层级创建对应图标
  const pinBuilder = new Cesium.PinBuilder();
  var pin100 = pinBuilder
    .fromText("100+", Cesium.Color.BLUE, 48)
    .toDataURL();
  var pin50 = pinBuilder
    .fromText("50+", Cesium.Color.BLUE, 48)
    .toDataURL();
  var pin40 = pinBuilder
    .fromText("40+", Cesium.Color.RED, 48)
    .toDataURL();
  var pin30 = pinBuilder
    .fromText("30+", Cesium.Color.RED, 48)
    .toDataURL();
  var pin20 = pinBuilder
    .fromText("20+", Cesium.Color.RED, 48)
    .toDataURL();
  var pin10 = pinBuilder
    .fromText("10+", Cesium.Color.RED, 48)
    .toDataURL();
 
  // 10以内聚合图标
  const singleDigitPins = new Array(8);
  for (let i = 0; i < singleDigitPins.length; ++i) {
    singleDigitPins[i] = pinBuilder
      .fromText(`${i + 2}`, Cesium.Color.VIOLET, 48)
      .toDataURL();
  }
 
  customStyle();
  
  function customStyle() {
    if (Cesium.defined(removeListener)) {
      removeListener();
      removeListener = undefined;
    } else {
      removeListener = dataSource.clustering.clusterEvent.addEventListener(
        function (clusteredEntities:any, cluster:any) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.id = cluster.label.id;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          if (clusteredEntities.length >= 100) {
            cluster.billboard.image = pin100;
          } else if (clusteredEntities.length >= 50) {
            cluster.billboard.image = pin50;
          } else if (clusteredEntities.length >= 40) {
            cluster.billboard.image = pin40;
          } else if (clusteredEntities.length >= 30) {
            cluster.billboard.image = pin30;
          } else if (clusteredEntities.length >= 20) {
            cluster.billboard.image = pin20;
          } else if (clusteredEntities.length >= 10) {
            cluster.billboard.image = pin10;
          } else {
            cluster.billboard.image =
              singleDigitPins[clusteredEntities.length - 2];
          }
        }
      );
    }
 
    // force a re-cluster with the new styling
    const pixelRange = dataSource.clustering.pixelRange;
    dataSource.clustering.pixelRange = 0;
    dataSource.clustering.pixelRange = pixelRange;
  }
})
    
  };
  return {
    createCesium,
    handleDrawPoint,
    handleDrawLine,
    handleDrawFace,
    handleCleanUp,
    handleContour,handlePolymerization
  };
};
