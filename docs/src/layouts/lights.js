import { LightGroup, LightEffect } from '@/composables/useLightGroup.js';
import { AmbientLight, DirectionalLight } from '@deck.gl/core';

// 创建响应式光照组
export const lightGroup = new LightGroup([
  new LightEffect(
    'Ambient',
    [255, 255, 255], // color
    3,               // intensity
    [-0.5, -1, -0.5], // direction
    true,            // visible
    AmbientLight,    // type
    {}               // props
  ),
  new LightEffect(
    'Directional',
    [255, 255, 255], // color
    3,             // intensity
    [-0.5, -1, -0.5], // direction
    true,            // visible
    DirectionalLight, // type
    {
      _shadow: true  // props
    }
  ),
]);