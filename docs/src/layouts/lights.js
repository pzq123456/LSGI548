import { reactive } from 'vue';
import { LightGroup, LightEffect } from '@/composables/useLightGroup';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';

// 创建响应式光照组
export const lightGroup = new LightGroup([
  new LightEffect(
    'ambient-light',
    AmbientLight,
    {
      color: [255, 255, 255],
      intensity: 3
    },
    true
  ),
  new LightEffect(
    'directional-light',
    DirectionalLight,
    {
      color: [255, 255, 255],
      intensity: 1.0,
      direction: [-0.5, -1, -0.5],
      _shadow: true
    },
    true
  )
]);

// 响应式光照效果
export const lightingEffect = reactive({
  instance: null,
  update() {
    const enabledEffects = lightGroup.getEnabledEffects();
    const effects = enabledEffects.map(effect => {
      return new effect.type(effect);
    });
    this.instance = new LightingEffect(...effects);
    return this.instance;
  }
});

// 初始化光照效果
lightingEffect.update();

// 如果需要，可以导出一些便捷方法
export function useLightEffects() {
  return {
    lightGroup,
    lightingEffect,
    // 获取当前光照效果实例
    getLightingEffect: () => lightingEffect.instance,
    // 更新光照效果
    updateLighting: () => lightingEffect.update(),
    // 便捷方法：切换环境光
    toggleAmbientLight: (enabled) => {
      lightGroup.setEffectEnabled('ambient-light', enabled);
      lightingEffect.update();
    },
    // 便捷方法：切换方向光
    toggleDirectionalLight: (enabled) => {
      lightGroup.setEffectEnabled('directional-light', enabled);
      lightingEffect.update();
    }
  };
}

