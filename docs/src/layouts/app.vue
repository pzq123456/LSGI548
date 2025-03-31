<template>
    <el-container>
      <!-- 侧边栏折叠按钮（仅在侧边栏折叠时显示） -->
      <div v-if="isSidebarCollapsed" class="sidebar-collapse-button" @click="toggleSidebar">
        <el-icon :size="20">
          <Expand />
        </el-icon>
      </div>
  
      <!-- 侧边栏 -->
      <el-aside 
        v-if="!isFullScreen" 
        :width="isSidebarCollapsed ? '0px' : '250px'" 
        class="sidebar"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >
        <!-- 侧边栏内容 -->
        <div class="sidebar-content">
          <SidebarControls
            :is-full-screen="isFullScreen"
            :is-drawer-visible="visible"
            :is-collapsed="isSidebarCollapsed"
            @toggle-fullscreen="toggleFullScreen"
            @toggle-drawer="toggleDrawer"
            @toggle-collapse="toggleSidebar"
          />

          <layers :layerGroup="layerGroup" :onUpdated="updateDeckLayers" />
          <!-- <lights :lightGroup="lightGroup" :onUpdated="onLightUpdated" /> -->
        </div>
      </el-aside>
  
      <el-main style="padding: 2px;">
        <MapComponent
          :center="[initialViewState.longitude, initialViewState.latitude]"
          :zoom="initialViewState.zoom"
          :pitch="initialViewState.pitch"
          width="100%"
          height="80vh"
          @map-loaded="handleMapLoaded"
        />
        <BuildingInfoPanel :selectedBuilding="selectedBuilding" />
      </el-main>
    </el-container>
  
    <el-drawer 
      v-model="visible" 
      :show-close="true" 
      :with-header="false" 
      direction="btt" 
      :class="'myDrawer'"
      :size="'50%'"
       >
      <Table></Table>
    </el-drawer>

  </template>
  
  <script setup>
import { ref, watch, computed } from 'vue'
import MapComponent from '@/components/map.vue'
import { useDeckOverlay } from '@/composables/useDeckOverlay.js'
import layers from '@/components/layers.vue';
import SidebarControls from '@/components/SidebarControls.vue'
import { layerGroup } from "@/layouts/layers.js";

import BuildingInfoPanel from '@/components/BuildingInfoPanel.vue';
import Table from '@/components/table.vue'

import { useBuildingStore } from '@/stores/buildingStore.js'


const buildingStore = useBuildingStore()

const selectedBuilding = computed(() => {
  return buildingStore.selectedBuilding
})

// 常量定义
const INITIAL_VIEW_STATE = {
  latitude: 22.304673905663638,
  longitude: 114.17991663624917,
  pitch: 45,
  zoom: 16
}

// 响应式状态
const initialViewState = ref(INITIAL_VIEW_STATE)
const visible = ref(false)
const isFullScreen = ref(false)
const isSidebarCollapsed = ref(false)
let deckMap = null

// 方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

const toggleDrawer = () => {
  visible.value = !visible.value
}

const handleMapLoaded = (map) => {
  deckMap = useDeckOverlay(map)
  updateDeckLayers()
}

const updateDeckLayers = () => {
  if (deckMap) {
    deckMap.setProps({
      layers: layerGroup.getLayers(),
    })
  }
}

// 监听selectedBuilding变化，更新高亮图层
watch(selectedBuilding, (newBuilding) => {
  const highlightLayer = layerGroup.layers.find(l => l.id === 'highlight-layer');
  if (highlightLayer) {
    highlightLayer.props.data = newBuilding ? [newBuilding] : [];
    updateDeckLayers(); // 手动触发图层更新
  }
})
  </script>
  
  <style>
  .myDrawer {
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
  }
  
  .sidebar {
    transition: width 0.3s ease;
    overflow: hidden;
    position: relative;
  }
  
  .sidebar-collapsed {
    width: 0 !important;
  }
  
  .sidebar-content {
    width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-collapse-button {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background-color: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-left: none;
    border-radius: 0 4px 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
  }
  
  .sidebar-collapse-button:hover {
    background-color: var(--vp-c-bg-alt);
  }
  </style>