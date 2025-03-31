import { ref, watch, computed } from 'vue';
import { LayerGroup, Layer } from '@/composables/useLayerGroup.js';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { CesiumIonLoader } from '@loaders.gl/3d-tiles';
import { CesiumION_TOKEN } from '@/env.js';
import { data } from '@/loaders/buildings.data.js';

import { useBuildingStore } from '@/stores/buildingStore.js';

const buildingStore = useBuildingStore()

const selectedBuilding = computed(() => {
  return buildingStore.selectedBuilding
})

// export const selectedBuilding = ref(null);

const ION_ASSET_ID = 3262885;
const ION_TOKEN = CesiumION_TOKEN;
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const ION_ASSET_ID_2 = 3253855;
const TILESET_URL2 = `https://assets.ion.cesium.com/${ION_ASSET_ID_2}/tileset.json`;

// 3D Tiles图层组
export const layerGroup = new LayerGroup([
  new Layer('tile-3d-layer', 1.0, true, Tile3DLayer, {
    pointSize: 3,
    pickable: false,
    data: TILESET_URL,
    loader: CesiumIonLoader,
    loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
    material: {
      ambient: 0.5,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [255, 255, 255]
    }
  }),

  new Layer('Point-Cloud-layer', 1.0, true, Tile3DLayer, {
    pointSize: 3,
    pickable: false,
    data: TILESET_URL2,
    loader: CesiumIonLoader,
    loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
    material: {
      ambient: 0.5,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [255, 255, 255]
    }
  }),

  new Layer('geojson-layer', 1.0, true, GeoJsonLayer, {
    data: data,
    pickable: true,
    filled: true,
    extruded: true,
    getFillColor: [140, 170, 180, 20],
    getElevation: (f) => f.properties.height || 80,
    onClick: ({object}) => {
      buildingStore.updateSelectedBuilding(object);
    },
  }),

  // 高亮图层初始化为空
  new Layer('highlight-layer', 1.0, true, GeoJsonLayer, {
    data: [],
    pickable: true,
    filled: true,
    extruded: true,
    getFillColor: [155, 0, 0, 100],
    getElevation: (f) => f.properties.height || 80,
  })
]);

// 监听selectedBuilding变化，更新高亮图层数据
watch(selectedBuilding, (newBuilding) => {
  const highlightLayer = layerGroup.layers.find(l => l.id === 'highlight-layer');
  if (highlightLayer) {
    highlightLayer.props.data = newBuilding ? [newBuilding] : [];
  }
});