<template>
  <div ref="mapContainer" style="width: 100%; height: 80vh; position: relative;">
    <MapComponent
      ref="mapRef"
      :center="[initialViewState.longitude, initialViewState.latitude]"
      :zoom="initialViewState.zoom"
      :pitch="initialViewState.pitch"
      width="100%"
      height="100%"
      @map-loaded="handleMapLoaded"
    />
    
    <!-- 信息面板 -->
    <div v-if="selectedBuilding" class="info-panel">
      <h3>{{ selectedBuilding.properties.name }}</h3>
      <div class="info-grid">
        <template v-for="(value, key) in selectedBuilding.properties" :key="key">
          <div class="info-key">{{ key }}:</div>
          <div class="info-value">{{ value }}</div>
        </template>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onUnmounted, shallowRef, watch } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { CesiumIonLoader } from '@loaders.gl/3d-tiles';

import { data } from '@/loaders/buildings.data.js';

// 3D Tiles 配置
const ION_ASSET_ID = 3253855;
const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 22.304673905663638,
  longitude: 114.17991663624917,
  pitch: 60,
  zoom: 16,
  bearing: 30,
};

const mapRef = shallowRef(null);
let deckMap;

const initialViewState = ref(INITIAL_VIEW_STATE);
const selectedBuilding = ref(null);

// 3D 点云图层 - 不可点选
const tile3DLayer = new Tile3DLayer({
  id: 'tile-3d-layer',
  data: TILESET_URL,
  loader: CesiumIonLoader,
  loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
  pointSize: 2,
  pickable: false, // 禁用点选
  opacity: 1,
});

// 几何建筑图层 - 可点选
const baseLayer = new GeoJsonLayer({
  id: 'geojson-layer',
  data: data,
  pickable: true,
  filled: true,
  extruded: true,
  getFillColor: [140, 170, 180, 20],
  getElevation: (f) => f.properties.height || 80,
  onClick: ({object}) => {
    selectedBuilding.value = object;
    console.log('Clicked building:', object);
  },
});

// 初始图层组合
const layers = [tile3DLayer, baseLayer];

// 处理地图加载
async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);

  deckMap.setProps({
    layers,
    initialViewState: initialViewState.value,
    getTooltip: ({object}) => object && object.layer && object.layer.id === 'geojson-layer' && {
      html: `<div class="tooltip">${object.properties.name || '建筑'}</div>`,
      style: {
        backgroundColor: '#333',
        color: '#fff',
        fontSize: '12px'
      }
    }
  });

  // 监听selectedBuilding变化，更新高亮图层
  watch(selectedBuilding, (newBuilding) => {
    if (deckMap) {
      const updatedHighlightLayer = new GeoJsonLayer({
        id: 'highlight-layer',
        data: newBuilding ? [newBuilding] : [],
        pickable: true,
        filled: true,
        extruded: true,
        getFillColor: [155, 0, 0, 100],
        getElevation: (f) => f.properties.height || 80,
      });
      
      deckMap.setProps({
        layers: [tile3DLayer, baseLayer, updatedHighlightLayer]
      });
    }
  });
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (deckMap) {
    deckMap.finalize();
  }
});
</script>

<style scoped>
.info-item {
  margin: 8px 0;
}

.tooltip {
  padding: 4px 8px;
}

/* 信息面板样式 */
.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  padding: 15px;
  color: var(--vp-c-text-1);
  border-radius: 5px;
  max-width: 300px;
  z-index: 100;
}

.info-panel h3 {
  margin-top: 0;
  color: var(--vp-c-text-2);
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
}

.info-key {
  font-weight: bold;
  color: var(--vp-c-text-2);
}

.info-value {
  color: var(--vp-c-text-3);
  word-break: break-word;
}
</style>