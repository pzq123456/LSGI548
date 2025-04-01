<!-- lights.js -->
<template>
  <div class="light-container">
    <div class="header-controls">
      <el-tooltip content="Expand all lights" placement="top">
        <el-icon @click="toggleAllDetails">
          <component :is="lightGroup.layers.every(light => light.isExpanded) ? 'Minus' : 'Plus'" />
        </el-icon>
      </el-tooltip>

      <!-- layers -->
       <span class="name"> Light Control </span>

      <el-tooltip content="Expand Light List" placement="top">
        <el-icon @click="toggleLightList" :class="{ 'expanded' : !isLightListVisible }"><ArrowUpBold /></el-icon>
      </el-tooltip>
    </div>

    <div class="light-list" ref="el" v-show="isLightListVisible">
      <div
        v-for="light in lightGroup.layers"
        :key="light.id"
        class="light-item"
        :class="{ 'hidden-light': !light.visible }"
        :style="{ border: light.visible ? '1px solid var(--vp-c-brand-2)' : '1px solid var(--vp-c-default-3)' }"
      >
        <div class="light-header" @click="toggleExpand(light.id)">
          <el-icon><Rank /></el-icon>
          <el-icon @click.stop="toggleVisibility(light)">
            <component :is="light.visible ? 'View' : 'Hide'" />
          </el-icon>
          <span class="light-id">{{ light.id }}</span>
          <el-icon :class="{ 'expanded': light.isExpanded }"><ArrowDownBold /></el-icon>
        </div>

        <Transition>
          <div v-show="light.isExpanded" class="light-details">
            <!-- 颜色选择器 -->
            <div class="control-row">
              <span>Color:</span>
              <el-color-picker 
                v-model="light.colorString"
                :disabled="!light.visible"
              />
            </div>

            <!-- 强度调节 -->
            <div class="control-row">
              <span>Intensity:</span>
              <el-slider 
                v-model="light.intensity" 
                :min="0" 
                :max="5" 
                :step="0.1" 
                :show-tooltip="true"
                :disabled="!light.visible"
              />
            </div>

            <!-- 方向调节 (仅对方向光有效) -->
            <div v-if="light.id === 'Directional'" class="control-row">
              <span>Direction:</span>
              <div class="direction-controls">
                <el-input-number 
                  v-model="light.direction[0]" 
                  :min="-1" 
                  :max="1" 
                  :step="0.05"
                  :disabled="!light.visible"
                  size="small"
                />
                <el-input-number 
                  v-model="light.direction[1]" 
                  :min="-1" 
                  :max="1" 
                  :step="0.05"
                  :disabled="!light.visible"
                  size="small"
                />
                <el-input-number 
                  v-model="light.direction[2]" 
                  :min="-1" 
                  :max="1" 
                  :step="0.05"
                  :disabled="!light.visible"
                  size="small"
                />
              </div>
            </div>

            <!-- 可见性开关 -->
            <div class="control-row">
              <span>Visibility:</span>
              <el-checkbox v-model="light.visible" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useDraggable } from 'vue-draggable-plus';

import pkg from 'lodash';
const { throttle } = pkg;

const props = defineProps({
  lightGroup: {
    type: Object, // LightGroup 实例
    required: true,
  },
  onUpdated: {
    type: Function,
    default: () => {},
  },
});

const { lightGroup, onUpdated } = props;
const isLightListVisible = ref(true);

// 颜色转换
lightGroup.layers.forEach(light => {
  light.colorString = computed({
    get: () => `rgb(${light.color[0]}, ${light.color[1]}, ${light.color[2]})`,
    set: (newColor) => {
      const rgbaRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/;
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      if (rgbaRegex.test(newColor)) {
        const match = newColor.match(rgbaRegex);
        light.color = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      } else if (hexRegex.test(newColor)) {
        const hex = newColor.replace('#', '');
        light.color = [
          parseInt(hex.substring(0, 2), 16),
          parseInt(hex.substring(2, 4), 16),
          parseInt(hex.substring(4, 6), 16),
        ];
      }
    }
  });
});

const throttledUpdate = throttle(() => {
  onUpdated();
}, 200);

watch(
  () => lightGroup.layers.map(light => ({ 
    id: light.id, 
    color: light.color,
    intensity: light.intensity,
    direction: light.direction,
    visible: light.visible,
    props: light.props
  })),
  () => {
    throttledUpdate();
  },
  { deep: true }
);

const toggleExpand = (id) => {
  const light = lightGroup.layers.find(item => item.id === id);
  if (light) {
    light.isExpanded = !light.isExpanded;
  }
};

const toggleVisibility = (light) => {
  light.visible = !light.visible;
};

const toggleLightList = () => {
  isLightListVisible.value = !isLightListVisible.value;
};

const toggleAllDetails = () => {
  const allExpanded = lightGroup.layers.every(light => light.isExpanded);
  lightGroup.layers.forEach(light => {
    light.isExpanded = !allExpanded;
  });
};

const el = ref();
const draggable = useDraggable(el, lightGroup.layers, {
  animation: 150,
  ghostClass: 'ghost',
  onUpdate() {
    if (onUpdated) {
      onUpdated();
    }
  }
});
</script>

<style scoped>

.name{  
  font-size: 1rem;
  color: var(--vp-c-text-3);
}

.name:hover {
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.light-container {
  margin: 1px;
  display: flex;
  flex-direction: column;
  width: 99%;
  border-radius: 8px;
  transition: background-color 0.3s ease, border-radius 0.3s ease;
  border: 1px solid var(--vp-c-border);
  overflow: hidden;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--vp-c-bg);
  border-radius: 8px 8px 0 0;
}

.header-controls .el-icon {
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease, transform 0.3s ease;
}

.light-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  height: auto;
  margin: auto;
  background-color: var(--vp-c-bg);
  border-radius: 0 0 8px 8px;
}

.light-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  cursor: move;
  color: var(--vp-c-text-2);
}

.light-item.hidden-light {
  opacity: 0.6;
  background-color: var(--vp-c-default-soft);
}

.light-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.light-id {
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.light-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.direction-controls {
  display: flex;
  gap: 0.25rem;
  /* 纵向排列 */
  flex-direction: column;
  /* 水平居中对齐 */
  align-items: center;
}

.expanded {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.ghost {
  opacity: 0.2;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>