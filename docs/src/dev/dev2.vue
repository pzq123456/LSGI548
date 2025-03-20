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
  import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
  
  const ION_ASSET_ID = 3242856;
  const ION_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
  const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;
  
  const INITIAL_VIEW_STATE = {
    latitude: 114.17991663624917,
    longitude: 22.304673905663638,
    pitch: 45,
    zoom: 16
  };
  
  // Vue 响应式引用
  const mapRef = ref(null);
  const deckMap = shallowRef(null);
  const initialViewState = ref(INITIAL_VIEW_STATE);
  
  // 创建光照效果
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 0.3 // 环境光强度
  });
  
  const directionalLight = new DirectionalLight({
    color: [255, 255, 255],
    intensity: 2.0, // 太阳光强度
    direction: [-1, -1, -1], // 初始光照方向
    _shadow: true // 启用阴影
  });
  
  const lightingEffect = new LightingEffect({
    ambientLight,
    directionalLight
  });
  
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
  
  // 3D 瓦片图层
  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 3,
    pickable: false,
    data: TILESET_URL,
    loader: CesiumIonLoader,
    loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
    onTilesetLoad,
    material: {
      ambient: 0.3,  // 环境光
      diffuse: 0.6,  // 漫反射
      shininess: 32, // 高光反射
      specularColor: [255, 255, 255] // 反射颜色
    }
  });
  
  // 处理地图加载
  async function handleMapLoaded(map) {
    deckMap.value = useDeckOverlay(map);
  
    deckMap.value.setProps({
      layers: [tile3DLayer],
      effects: [lightingEffect], // 添加光照效果
      initialViewState: initialViewState.value
    });
  
    startSunSimulation(); // 开启太阳模拟
  }
  
  // 太阳光动态变化（模拟白天到夜晚的光照）
  let sunAngle = 0;
  function startSunSimulation() {
    setInterval(() => {
      sunAngle += 0.01;
      directionalLight.direction = [
        Math.cos(sunAngle) * -1,
        Math.sin(sunAngle) * -1,
        -0.5
      ];
      deckMap.value?.setProps({ effects: [lightingEffect] });
    }, 100);
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
  