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
    
    <!-- 添加信息面板 -->
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
import {GeoJsonLayer} from '@deck.gl/layers';

import { data } from '@/loaders/buildings.data.js';

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

// 基础图层
const baseLayer = new GeoJsonLayer({
  id: 'geojson-layer',
  data: data,
  pickable: true,
  filled: true,
  extruded: true,
  getFillColor: [200, 200, 180, 100],
  getElevation: (f) => 50,
  // 点击高亮
  onClick: ({object}) => {
    selectedBuilding.value = object;
    console.log('Clicked building:', object);
  },
});

// 高亮第一个建筑物
if (data.features.length > 0) {
  selectedBuilding.value = data.features[0];
  console.log('Selected building:', selectedBuilding.value);
}

// 高亮图层
const highLightLayer = new GeoJsonLayer({
  id: 'highlight-layer',
  data: selectedBuilding.value ? [selectedBuilding.value] : [],
  pickable: true,
  filled: true,
  extruded: true,
  getFillColor: [255, 0, 0, 200],
  getElevation: (f) => f.properties.height || 50,
});

// 初始图层
const layers = [baseLayer, highLightLayer];

// 处理地图加载
async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);

  deckMap.setProps({
    layers,
    initialViewState: initialViewState.value,
    getTooltip: ({object}) => object && {
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
        getFillColor: [255, 0, 0, 200],
        getElevation: (f) => f.properties.height || 50,
      });
      
      deckMap.setProps({
        layers: [baseLayer, updatedHighlightLayer]
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