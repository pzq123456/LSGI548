import { reactive } from 'vue';

export class LightEffect {
  constructor(id, type, props = {}, enabled = true) {
    this.id = id;
    this.state = reactive({ enabled });
    this.type = type;
    this.props = reactive(props);

    // 确保 color 是字符串
    if (Array.isArray(this.props.color)) {
      this.props.colorString = this.rgbArrayToString(this.props.color);
    } else {
      this.props.colorString = this.props.color || 'rgb(255,255,255)';
    }
  }

  get enabled() {
    return this.state.enabled;
  }

  set enabled(value) {
    this.state.enabled = value;
  }

  /**
   * 处理颜色更新，确保 `colorString` 与 `color` 同步
   * @param {string} newColor - 颜色字符串 (rgb 或 hex)
   */
  updateColor(newColor) {
    this.props.colorString = newColor;
    this.props.color = this.colorStringToArray(newColor);
  }

  /**
   * 将 RGB 数组转换为 `rgb(r,g,b)` 字符串
   * @param {number[]} colorArray
   * @returns {string}
   */
  rgbArrayToString(colorArray) {
    return `rgb(${colorArray.join(',')})`;
  }

  /**
   * 将颜色字符串转换为 RGB 数组
   * @param {string} colorString
   * @returns {number[]}
   */
  colorStringToArray(colorString) {
    const match = colorString.match(/\d+/g);
    return match ? match.map(Number) : [255, 255, 255];
  }

  toJSON() {
    return {
      id: this.id,
      enabled: this.state.enabled,
      type: this.type,
      props: { ...this.props, color: this.props.color } // 确保 color 保持数组格式
    };
  }
}

export class LightGroup {
  constructor(effects = []) {
    this.effects = reactive(effects);
  }

  /**
   * 添加光照效果
   * @param {LightEffect} effect 
   */
  addEffect(effect) {
    this.effects.push(effect);
  }

  /**
   * 移除光照效果
   * @param {string} effectId 
   */
  removeEffect(effectId) {
    const index = this.effects.findIndex(e => e.id === effectId);
    if (index !== -1) {
      this.effects.splice(index, 1);
    }
  }

  /**
   * 设置光照效果的启用状态
   * @param {string} effectId 
   * @param {boolean} enabled 
   */
  setEffectEnabled(effectId, enabled) {
    const effect = this.effects.find(e => e.id === effectId);
    if (effect) {
      effect.enabled = enabled;
    }
  }

  /**
   * 更新光照效果的参数
   * @param {string} effectId 
   * @param {object} newProps 
   */
  updateEffectProps(effectId, newProps) {
    const effect = this.effects.find(e => e.id === effectId);
    if (effect) {
      Object.assign(effect.props, newProps);
    }
  }

  /**
   * 获取所有启用的光照效果，用于 DeckGL 的光照系统
   * @returns {Array} 启用的光照效果数组
   */
  getEnabledEffects() {
    return this.effects
      .filter(effect => effect.enabled)
      .map(effect => {
        return {
          id: effect.id,
          type: effect.type,
          ...effect.props
        };
      });
  }

  /**
   * 获取所有光照效果的 JSON 表示
   * @returns {Array} 光照效果的 JSON 数组
   */
  toJSON() {
    return this.effects.map(effect => effect.toJSON());
  }

  /**
   * 从 JSON 数据加载光照效果
   * @param {Array} effectsData 
   */
  loadFromJSON(effectsData) {
    this.effects.length = 0;
    effectsData.forEach(data => {
      this.effects.push(new LightEffect(
        data.id,
        data.type,
        data.props,
        data.enabled
      ));
    });
  }
}