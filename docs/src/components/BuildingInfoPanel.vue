<template>
    <div v-if="selectedBuilding && !isClosed" class="info-panel">
        <div class="panel-header">
            <h3>{{ selectedBuilding.properties.name }}</h3>
            <button class="close-btn" @click="closePanel">×</button>
        </div>
        <div class="info-grid">
            <template v-for="(value, key) in selectedBuilding.properties" :key="key">
                <div class="info-key">{{ key }}:</div>
                <div class="info-value">{{ value }}</div>
            </template>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    selectedBuilding: {
        type: Object,
        default: null
    }
});

const isClosed = ref(false);

const closePanel = () => {
    isClosed.value = true;
};

watch(() => props.selectedBuilding, (newVal) => {
    if (newVal) {
        isClosed.value = false;
    }
});
</script>

<style scoped>
    /* 信息面板样式 */
    .info-panel {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: var(--vp-c-bg-alt);
        border: 1px solid var(--vp-c-border);
        padding: 15px;
        color: var(--vp-c-text-1);
        border-radius: 5px;
        max-width: 350px;
        z-index: 2;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* 固定在头部位置 */
        position: sticky;
        top: 0;
        background-color: var(--vp-c-bg-alt);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--vp-c-text-2);
        padding: 0 5px;
        line-height: 1;
    }

    .close-btn:hover {
        color: var(--vp-c-text-1);
    }

    .info-panel h3 {
        margin: 0;
        color: var(--vp-c-text-1);
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 8px;
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 5px;
        margin-top: 10px;
    }

    .info-key {
        font-weight: bold;
        color: var(--vp-c-text-1);
        background-color: var(--vp-c-bg-soft);
        border-radius: 5px;
        border: 1px solid var(--vp-c-border);
        padding: 3px;
    }

    .info-value {
        color: var(--vp-c-text-2);
        word-break: break-word;
        background-color: var(--vp-c-bg-alt);
        border-radius: 5px;
        border: 1px solid var(--vp-c-border);
        padding: 3px;
    }

    /* 移动端适配 */
    @media (max-width: 600px) {
        .info-panel {
            max-width: calc(100% - 20px);
            left: 10px;
            right: 10px;
            top: auto;
            bottom: 10px;
            max-height: 200px;
            overflow-y: auto;
        }

        .info-grid {
            grid-template-columns: 1fr;
        }

        .info-key, .info-value {
            width: 100%;
        }
    }
</style>