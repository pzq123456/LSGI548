<template>
    <div v-if="selectedBuilding" class="info-panel">
        <h3>{{ selectedBuilding.properties.name }}</h3>
        <div class="info-grid">
        <template v-for="(value, key) in selectedBuilding.properties" :key="key">
            <div class="info-key">{{ key }}:</div>
            <div class="info-value">{{ value }}</div>
        </template>
        </div>
    </div>
</template>
  
<script setup>
    defineProps({
        selectedBuilding: {
            type: Object,
            default: null
        }
    })
</script>

<style scoped>
    /* 信息面板样式 */
    .info-panel {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: var(--vp-c-bg-alt); /* 添加背景色 */
        border: 1px solid var(--vp-c-border);
        padding: 15px;
        color: var(--vp-c-text-1);
        border-radius: 5px;
        max-width: 350px;
        z-index: 100;
    }

    .info-panel h3 {
        margin-top: 0;
        color: var(--vp-c-text-1);
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px solid var(--vp-c-border);
        padding-bottom: 8px;
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 5px; /* 添加网格间距 */
        margin-top: 10px; /* 添加上边距 */
    }

    .info-key {
        font-weight: bold;
        color: var(--vp-c-text-1);
        background-color: var(--vp-c-bg-soft); /* 添加背景色 */
        border-radius: 5px; /* 添加圆角 */
        border: 1px solid var(--vp-c-border); /* 添加边框 */
        padding: 3px; /* 添加内边距 */
    }

    .info-value {
        color: var(--vp-c-text-2);
        word-break: break-word;
        background-color: var(--vp-c-bg-alt); /* 添加背景色 */
        border-radius: 5px; /* 添加圆角 */
        border: 1px solid var(--vp-c-border); /* 添加边框 */
        padding: 3px; /* 添加内边距 */
    }
</style>