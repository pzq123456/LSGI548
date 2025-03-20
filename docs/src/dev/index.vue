<template>
    <div>
        <div class="button-group">
            <button @click="currentComponent = myApp">Example 1 默认绘制</button>
            <button @click="currentComponent = myApp2">Example 2 光照模拟</button>
        </div>
        <component :is="currentComponent" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import myApp from '@/dev/dev1.vue'
import myApp2 from '@/dev/dev2.vue'

const currentComponent = ref(myApp) // 默认使用 myApp 组件
</script>

<style scoped>
.button-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}
</style>
