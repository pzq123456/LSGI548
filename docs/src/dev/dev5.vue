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

const ION_ASSET_ID = 3262885;
const ION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 114.17991663624917,
  longitude: 22.304673905663638,
  pitch: 45,
  zoom: 16
};

const mapRef = ref(null);
const deckMap = shallowRef(null);
const initialViewState = ref(INITIAL_VIEW_STATE);

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 3
});

const directionalLight = new DirectionalLight({
  color: [255, 255, 255],
  intensity: 1.0,

  // direction: [0, -1, 0],
  // 光源在斜上方 45 度
  direction: [-0.5, -1, -0.5],
  _shadow: true
});

const lightingEffect = new LightingEffect({
  ambientLight,
  directionalLight
});

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

const tile3DLayer = new Tile3DLayer({
  id: 'tile-3d-layer',
  pointSize: 3,
  pickable: false,
  data: TILESET_URL,
  loader: CesiumIonLoader,
  loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
  onTilesetLoad,
  material: {
    ambient: 0.5,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [255, 255, 255]
  }
});

async function handleMapLoaded(map) {
  deckMap.value = useDeckOverlay(map);

  deckMap.value.setProps({
    layers: [tile3DLayer],
    effects: [lightingEffect],
    initialViewState: initialViewState.value
  });

}

onUnmounted(() => {
  if (deckMap.value) {
    deckMap.value.finalize();
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
