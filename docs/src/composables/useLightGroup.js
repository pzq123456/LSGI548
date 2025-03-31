import { reactive } from 'vue';

export class LightEffect {
  constructor(id, color = [255, 255, 255], intensity = 1, direction = [-0.5, -1, -0.5], visible = true, type, props = {}) {
    if (!id) throw new Error('LightEffect requires an id');
    if (!type) throw new Error('LightEffect requires a type');
    
    this.id = id;
    this.type = type;
    this.props = props;
    
    this.state = reactive({
      visible: Boolean(visible),
      color: [...color],
      direction: reactive([...direction]), // 使方向数组响应式
      intensity: Number(intensity),
    });
  }

  get visible() {
    return this.state.visible;
  }

  set visible(value) {
    this.state.visible = Boolean(value);
  }

  get color() {
    return this.state.color;
  }

  set color(value) {
    if (!Array.isArray(value) || value.length !== 3) {
      throw new Error('Color must be an array of 3 numbers');
    }
    this.state.color = value;
  }

  get direction() {
    return this.state.direction; // 直接返回响应式数组
  }

  set direction(value) {
    if (!Array.isArray(value) || value.length !== 3) {
      throw new Error('Direction must be an array of 3 numbers');
    }
    this.state.direction[0] = value[0];
    this.state.direction[1] = value[1];
    this.state.direction[2] = value[2];
  }

  get intensity() {
    return this.state.intensity;
  }

  set intensity(value) {
    const num = Number(value);
    if (num < 0) {
      throw new Error('Intensity must be a positive number');
    }
    this.state.intensity = num;
  }
}

import { LightingEffect } from '@deck.gl/core';

export class LightGroup {
  constructor(layers = []) {
    this.layers = reactive(layers);
  }

  // 添加图层
  addLayer(layer) {
    if (!(layer instanceof LightEffect)) {
      throw new Error('Only LightEffect instances can be added to LightGroup');
    }
    this.layers.push(layer);
  }

  // 移除图层
  removeLayer(layerId) {
    const index = this.layers.findIndex(l => l.id === layerId);
    if (index !== -1) {
      this.layers.splice(index, 1);
    } else {
      console.warn(`Layer with id ${layerId} not found`);
    }
  }

  // 更新图层的可见性
  setVisibility(layerId, visible) {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.visible = Boolean(visible);
    } else {
      console.warn(`Layer with id ${layerId} not found`);
    }
  }

  // 更新光照强度
  setIntensity(layerId, intensity) {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.intensity = intensity;
    } else {
      console.warn(`Layer with id ${layerId} not found`);
    }
  }

  // 更新光照颜色
  setColor(layerId, color) {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.color = color;
    } else {
      console.warn(`Layer with id ${layerId} not found`);
    }
  }

  // 更新光照方向
  setDirection(layerId, direction) {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.direction = direction;
    } else {
      console.warn(`Layer with id ${layerId} not found`);
    }
  }

  // 设置图层顺序（支持拖拽）
  setLayerOrder(newOrder) {
    if (!Array.isArray(newOrder)) {
      throw new Error('newOrder must be an array');
    }
    
    // 验证所有图层ID都存在
    const existingIds = this.layers.map(l => l.id);
    const invalidIds = newOrder.filter(id => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid layer IDs: ${invalidIds.join(', ')}`);
    }

    // 重新排序
    const newLayers = newOrder.map(id => this.layers.find(l => l.id === id));
    this.layers.length = 0;
    this.layers.push(...newLayers);
  }

  // 根据图层类型和属性生成 DeckGL 光照效果
  getLightingEffect() {
    const lights = {};
    
    this.layers
      .filter(layer => layer.visible)
      .forEach(layer => {
        const LayerType = layer.type;
        lights[layer.id] = new LayerType({
          color: layer.color,
          direction: layer.direction,
          intensity: layer.intensity,
          ...layer.props,
        });
      });

      // 若 lights 为空则返回空数组
      if (Object.keys(lights).length === 0) {
        return [];
      }


    return [new LightingEffect(lights)];
  }
}
