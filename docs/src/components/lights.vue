<template>
  <div class="light-container">
    <div class="header-controls">
      <el-tooltip content="Expand all light controls" placement="top">
        <el-icon @click="toggleAllDetails"><Switch /></el-icon>
      </el-tooltip>

      <el-tooltip content="Expand Light Controls" placement="top">
        <el-icon @click="toggleLightControls" :class="{ 'expanded' : !isLightControlsVisible }">
          <ArrowUpBold />
        </el-icon>
      </el-tooltip>
    </div>

    <div class="light-list" ref="el" v-show="isLightControlsVisible">
      <div
        v-for="light in lightGroup.effects"
        :key="light.id"
        class="light-item"
        :class="{ 'disabled-light': !light.enabled }"
        :style="{ border: light.enabled ? '1px solid var(--vp-c-brand-2)' : '1px solid var(--vp-c-default-3)' }"
      >
        <!-- 光照标题和开关 -->
        <div class="light-header" @click="toggleExpand(light.id)">
          <el-icon><Lightning /></el-icon>
          <el-switch
            v-model="light.enabled"
            @click.stop
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
          <span class="light-title">{{ getLightTitle(light.type) }}</span>
          <el-icon :class="{ 'expanded': light.isExpanded }"><ArrowDownBold /></el-icon>
        </div>

        <Transition>
          <div v-show="light.isExpanded" class="light-details">
            <!-- 环境光控制 -->
            <div v-if="light.type === AmbientLight" class="light-params">
              <div class="param-row">
                <span class="param-label">Intensity</span>
                <el-slider
                  v-model="light.props.intensity"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                />
                <el-input-number
                  v-model="light.props.intensity"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                  size="small"
                />
              </div>

              <div class="param-row">
                <span class="param-label">Color</span>
                <el-color-picker
                  v-model="light.props.colorString"
                  :disabled="!light.enabled"
                  @change="light.updateColor"
                  show-alpha
                />
              </div>
            </div>

            <!-- 方向光控制 -->
            <div v-if="light.type === DirectionalLight" class="light-params">
              <div class="param-row">
                <span class="param-label">Intensity</span>
                <el-slider
                  v-model="light.props.intensity"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                />
                <el-input-number
                  v-model="light.props.intensity"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                  size="small"
                />
              </div>

              <div class="param-row">
                <span class="param-label">Color</span>
                <el-color-picker
                  v-model="light.props.colorString"
                  :disabled="!light.enabled"
                  @change="light.updateColor"
                  show-alpha
                />
              </div>

              <div class="param-row">
                <span class="param-label">Direction X</span>
                <el-slider
                  v-model="light.props.direction[0]"
                  :min="-1"
                  :max="1"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                />
              </div>

              <div class="param-row">
                <span class="param-label">Direction Y</span>
                <el-slider
                  v-model="light.props.direction[1]"
                  :min="-1"
                  :max="1"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                />
              </div>

              <div class="param-row">
                <span class="param-label">Direction Z</span>
                <el-slider
                  v-model="light.props.direction[2]"
                  :min="-1"
                  :max="1"
                  :step="0.1"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                />
              </div>

              <div class="param-row">
                <el-checkbox
                  v-model="light.props._shadow"
                  :disabled="!light.enabled"
                  @change="updateLightEffects"
                >
                  Enable Shadows
                </el-checkbox>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Check, Close } from '@element-plus/icons-vue';
import { AmbientLight, DirectionalLight } from '@deck.gl/core';
import { LightGroup } from '@/composables/useLightGroup';

const props = defineProps({
  lightGroup: {
    type: LightGroup,
    required: true
  },
  onUpdated: {
    type: Function,
    default: () => {}
  }
});

const { lightGroup, onUpdated } = props;
const isLightControlsVisible = ref(true);

// 初始化展开状态
lightGroup.effects.forEach(light => {
  light.isExpanded = false;
});

const getLightTitle = (type) => {
  if (type === AmbientLight) return 'Ambient Light';
  if (type === DirectionalLight) return 'Directional Light';
  return 'Light Source';
};

const toggleExpand = (id) => {
  const light = lightGroup.effects.find(item => item.id === id);
  if (light) {
    light.isExpanded = !light.isExpanded;
  }
};

const toggleLightControls = () => {
  isLightControlsVisible.value = !isLightControlsVisible.value;
};

const toggleAllDetails = () => {
  const allExpanded = lightGroup.effects.every(light => light.isExpanded);
  lightGroup.effects.forEach(light => {
    light.isExpanded = !allExpanded;
  });
};

const updateLightEffects = () => {
  if (onUpdated) {
    onUpdated();
  }
};

// 监听光照参数变化
watch(
  () => lightGroup.effects.map(light => ({ 
    enabled: light.enabled,
    props: { ...light.props }
  })),
  () => {
    updateLightEffects();
  },
  { deep: true }
);
</script>

<style scoped>
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
}

.light-item.disabled-light {
  opacity: 0.6;
  background-color: var(--vp-c-default-soft);
}

.light-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.light-title {
  font-weight: bold;
  color: var(--vp-c-text-1);
  flex-grow: 1;
}

.light-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.light-params {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.param-label {
  min-width: 80px;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.expanded {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, height 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  height: 0;
}
</style>