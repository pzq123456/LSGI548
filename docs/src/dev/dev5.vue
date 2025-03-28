<template>
  <div ref="mapContainer" style="width: 100%; height: 80vh;">
    <MapComponent
      ref="mapRef"
      :center="[initialViewState.latitude, initialViewState.longitude]"
      :zoom="initialViewState.zoom"
      :pitch="initialViewState.pitch"
      width="100%"
      height="100%"
      @map-loaded="handleMapLoaded"
    />
  </div>
</template>

<script setup>
import { ref, onUnmounted, shallowRef } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { CesiumIonLoader } from '@loaders.gl/3d-tiles';

const ION_ASSET_ID = 3260849; // 建筑白模
const ION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 114.17991663624917,
  longitude: 22.304673905663638,
  pitch: 60,
  zoom: 16,
  bearing: 30,
};

const mapRef = ref(null);
const deckMap = shallowRef(null);
const initialViewState = ref(INITIAL_VIEW_STATE);

function onTilesetLoad(tileset) {
  const { cartographicCenter, zoom } = tileset;

  initialViewState.value = {
    ...INITIAL_VIEW_STATE,
    longitude: cartographicCenter[0],
    latitude: cartographicCenter[1],
    zoom
  };

  if (deckMap.value) {
    deckMap.value.setProps({
      initialViewState: initialViewState.value
    });
  }
}

// 3D 瓦片图层（优化光照和视觉效果）
const tile3DLayer = new Tile3DLayer({
  id: 'tile-3d-layer',
  data: TILESET_URL,
  loader: CesiumIonLoader,
  loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
  opacity: 0.8,  

  // 增加光照配置
  _lighting: 'object', // 使用对象级光照
  material: {
    ambient: [255, 255, 255], // 环境光颜色
    diffuse: [255, 255, 255], // 漫反射光颜色
    shininess: 32, // 光泽度
    specular: [255, 255, 255], // 镜面反射光颜色
    emissive: [10, 10, 10] // 自发光颜色
  },
  
  // 增强光照效果
  parameters: {
    // 启用深度测试和混合
    depthTest: true,
    blend: true,
    blendFunc: [770, 771, 1, 771]
  },

  onTilesetLoad
});

async function handleMapLoaded(map) {
  deckMap.value = useDeckOverlay(map);
  deckMap.value.setProps({
    layers: [tile3DLayer],
    initialViewState: initialViewState.value,
    // 全局光照设置
    parameters: {
      lighting: {
        lights: [
          {
            type: 'directional',
            color: [255, 255, 255],
            intensity: 2.0,  // 增加光照强度
            direction: [1, 1, -1]  // 调整光照方向
          },
          {
            type: 'ambient',
            color: [255, 255, 255],
            intensity: 1.0  // 增加环境光
          }
        ]
      }
    }
  });
}

onUnmounted(() => {
  if (deckMap.value) {
    deckMap.value.finalize();
  }
});
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>