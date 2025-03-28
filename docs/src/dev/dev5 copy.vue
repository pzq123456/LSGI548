<template>
  <div ref="mapContainer" style="width: 100%; height: 80vh;">
    <MapComponent
      ref="mapRef"
      :center="[initialViewState.longitude, initialViewState.latitude]"
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
import { Matrix4 } from 'math.gl';

const ION_ASSET_ID = 3260849; // 建筑白模
const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGFkYWNkOS1jNmRiLTQ1ZmUtODExMi1hN2E2NTNkYTQ2MzgiLCJpZCI6MTQ0NzkwLCJpYXQiOjE2ODYwMjk5MTd9.UQB3F_dFJVONKtmnPBHGoiN3Myd2Ncus9noUj3nQOeo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 22.304673905663638,
  longitude: 114.17991663624917,
  pitch: 60,
  zoom: 16,
  bearing: 30,
};

const mapRef = ref(null);
const deckMap = shallowRef(null);
const initialViewState = ref(INITIAL_VIEW_STATE);



function onTilesetLoad(tileset) {
  const { cartographicCenter, zoom } = tileset;

  // 应用转换到中心点坐标
  const transformMatrix = createTransformMatrix();
  const originalCenter = new Matrix4().translate([cartographicCenter[0], cartographicCenter[1], cartographicCenter[2] || 0]);
  const transformedCenter = originalCenter.multiplyRight(transformMatrix);
  
  initialViewState.value = {
    ...INITIAL_VIEW_STATE,
    longitude: transformedCenter[12], // 转换后的X坐标
    latitude: transformedCenter[13],  // 转换后的Y坐标
    zoom
  };

  if (deckMap.value) {
    deckMap.value.setProps({
      initialViewState: initialViewState.value
    });
  }
}

// 自定义Tile3DLayer以应用坐标转换
class CustomTile3DLayer extends Tile3DLayer {
  _onTileLoad(tileHeader) {
    // 在加载tile时应用坐标转换
    applyCoordinateTransform(tileHeader);
    super._onTileLoad(tileHeader);
  }
}

// 3D 瓦片图层（使用自定义的Tile3DLayer）
const tile3DLayer = new CustomTile3DLayer({
  id: 'tile-3d-layer',
  data: TILESET_URL,
  loader: CesiumIonLoader,
  loadOptions: { 
    'cesium-ion': { accessToken: ION_TOKEN },
    // 添加自定义加载选项
    transforms: [applyCoordinateTransform]
  },
  opacity: 0.8,
  _lighting: 'object',
  material: {
    ambient: [255, 255, 255],
    diffuse: [255, 255, 255],
    shininess: 32,
    specular: [255, 255, 255],
    emissive: [10, 10, 10]
  },
  parameters: {
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
    parameters: {
      lighting: {
        lights: [
          {
            type: 'directional',
            color: [255, 255, 255],
            intensity: 2.0,
            direction: [1, 1, -1]
          },
          {
            type: 'ambient',
            color: [255, 255, 255],
            intensity: 1.0
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