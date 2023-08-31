import { defineStore } from 'pinia'
import { Names } from './storeName'
// import { getLonAndLatReturn } from '@/types/cesiumType'
export const useLeafletStore = defineStore(Names.LEAFLET, {
  state: () => {
    return {
      isActive: ''
      // leftClickLonAndLat: {
      //   lon: null,
      //   lat: null,
      //   type: ''
      // } as getLonAndLatReturn,
      // mouseMoveLonAndLat: {
      //   lon: null,
      //   lat: null,
      //   type: ''
      // } as getLonAndLatReturn
    }
  },
  getters: {
    getIsActive(state): string {
      return state.isActive
    }
    // getLeftClickLonAndLatStore(state): getLonAndLatReturn {
    //   return state.leftClickLonAndLat
    // },
    // getMouseMoveLonAndLatStore(state): getLonAndLatReturn {
    //   return state.mouseMoveLonAndLat
    // }
  },
  actions: {
    setActive(value: string): void {
      this.isActive = value
    }
    // setLeftClickLonAndLatStore(lonAndLat: getLonAndLatReturn): void {
    //   this.leftClickLonAndLat = lonAndLat
    // },
    // setMouseMoveLonAndLatStore(lonAndLat: getLonAndLatReturn): void {
    //   this.mouseMoveLonAndLat = lonAndLat
    // }
  }
})
