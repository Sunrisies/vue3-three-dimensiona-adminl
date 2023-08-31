import { Cartesian3, Entity, ScreenSpaceEventType } from 'cesium'

export interface commonType {
  root?: any
  position?: Cartesian3
  type?: string | undefined
}
export interface PointType extends commonType {
  color?: any
  trailImage?: string
  duration?: number
}
export interface flyToType extends commonType {
  durationL?: number
}
export interface zoomToType extends commonType {
  entity: Entity
}

export type getLonAndLatReturn = {
  lon: string | undefined | null
  lat: string | undefined | null
  type: string | undefined
}

export interface entitiesAddPolylineType extends commonType {
  polylinePointArr: Cartesian3[]
}
export interface screenSpaceEventType extends commonType {
  eventType: ScreenSpaceEventType
}
