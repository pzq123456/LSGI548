<template>
  <div ref="mapContainer" style="width: 100%; height: 80vh; position: relative;">
    <MapComponent
      ref="mapRef"
      :center="[initialViewState.latitude, initialViewState.longitude]"
      :zoom="initialViewState.zoom"
      :pitch="initialViewState.pitch"
      width="100%"
      height="100%"
      @map-loaded="handleMapLoaded"
      @click="handleMapClick"
    />
    
    <!-- 建筑信息卡片 -->
    <div v-if="selectedBuilding" class="building-info-card">
      <button class="close-button" @click="clearSelection">×</button>
      <h3>{{ selectedBuilding.properties.name || '未命名建筑' }}</h3>
      <div v-if="selectedBuilding.properties.description" class="info-item">
        <strong>描述: </strong>{{ selectedBuilding.properties.description }}
      </div>
      <div v-if="selectedBuilding.properties.height" class="info-item">
        <strong>高度: </strong>{{ selectedBuilding.properties.height }}米
      </div>
      <div v-if="selectedBuilding.properties.area" class="info-item">
        <strong>面积: </strong>{{ selectedBuilding.properties.area }}平方米
      </div>
      <!-- 可以添加更多建筑信息字段 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, shallowRef } from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import {GeoJsonLayer} from '@deck.gl/layers';
import { data } from '@/loaders/buildings.data.js';

const DATA_URL = 'polyu_building.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 114.17991663624917,
  longitude: 22.304673905663638,
  pitch: 60,
  zoom: 16,
  bearing: 30,
};

// Vue 响应式引用
const mapRef = shallowRef(null);
const deckMap = shallowRef(null);
const initialViewState = ref(INITIAL_VIEW_STATE);
const selectedBuilding = ref(null);
const highlightedLayerId = 'highlighted-layer';

// 基础图层
const baseLayer = new GeoJsonLayer({
  id: 'geojson-layer',
  data: data,
  pickable: true,
  filled: true,
  extruded: true,
  lineWidthScale: 20,
  lineWidthMinPixels: 2,
  getLineColor: [160, 160, 180],
  getFillColor: [140, 170, 180, 200],
  getPointRadius: 100, // Change from getRadius to getPointRadius
  getLineWidth: 1,
  getElevation: (f) => f.properties.height || 50,
  onClick: (info) => handleBuildingClick(info.object)
});

// 高亮图层
const highlightedLayer = new GeoJsonLayer({
  id: highlightedLayerId,
  data: null,
  pickable: false,
  filled: true,
  extruded: true,
  lineWidthScale: 20,
  lineWidthMinPixels: 2,
  getLineColor: [255, 255, 0],
  getFillColor: [255, 255, 0, 150],
  getRadius: 100,
  getLineWidth: 3,
  getElevation: (f) => (f?.properties?.height || 50) + 1 // 比普通建筑高一点
});

// 初始图层
const layers = [baseLayer];

// 处理地图加载
async function handleMapLoaded(map) {
  deckMap.value = useDeckOverlay(map);

  deckMap.value.setProps({
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
}

// 处理建筑点击
function handleBuildingClick(building) {
  if (!building) return;

  selectedBuilding.value = building;
  
  // Update the highlighted layer with the selected building
  highlightedLayer.data = [building]; // Pass selected building to the highlighted layer
  
  // Update layers to reflect the new highlighted building
  const newLayers = [
    baseLayer,
    highlightedLayer // Use the updated highlightedLayer
  ];
  
  deckMap.value.setProps({
    layers: newLayers
  });
}



// 处理地图点击
function handleMapClick(event) {
  // 如果点击的是空白区域，清除选择
  if (!event.features?.length) {
    clearSelection();
  }
}

// 清除选择
function clearSelection() {
  selectedBuilding.value = null;
  deckMap.value.setProps({
    layers: [baseLayer]
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
.building-info-card {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  z-index: 100;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 5px;
}

.info-item {
  margin: 8px 0;
}

.tooltip {
  padding: 4px 8px;
}
</style>