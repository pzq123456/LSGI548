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

const ION_ASSET_ID = 3253855; // 新增 Z 座
const ION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 114.17991663624917,
  longitude: 22.304673905663638,
  pitch: 60, // 视觉优化：提高俯仰角，使 3D 更明显
  zoom: 16,
  bearing: 30, // 视觉优化：增加旋转角度，增强立体感
};

// Vue 响应式引用
const mapRef = ref(null);
const deckMap = shallowRef(null);
const initialViewState = ref(INITIAL_VIEW_STATE);

// 处理 Tileset 加载
function onTilesetLoad(tileset) {
  const { cartographicCenter, zoom } = tileset;

  // 更新地图视图
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

// 3D 瓦片图层（优化拾取和视觉效果）
const tile3DLayer = new Tile3DLayer({
  id: 'tile-3d-layer',
  data: TILESET_URL,
  loader: CesiumIonLoader,
  loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
  pointSize: 2, // 视觉优化：调整点大小
  pickable: true, // 启用拾取
  opacity: 0.8, // 视觉优化：增加透明度，柔和显示
  getColor: d => [255, 140, 0, 180], // 视觉优化：增强颜色对比

  onTilesetLoad,

  // // 交互优化：点击点时打印信息
  // onClick: ({ object, x, y }) => {
  //   if (object) {
  //     console.log(`📍 点击点坐标：(${x}, ${y})`, object);
  //   }
  // },

  // // 交互优化：鼠标悬停时高亮
  // onHover: ({ object, picked }) => {
  //   if (picked) {
  //     console.log("✨ 悬停点信息：", object);
  //   }
  // }
});

// 处理地图加载
async function handleMapLoaded(map) {
  deckMap.value = useDeckOverlay(map);
  deckMap.value.setProps({
    layers: [tile3DLayer],
    initialViewState: initialViewState.value
  });
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (deckMap.value) {
    deckMap.value.finalize();
  }
});
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
