<template>
    <div>
        <div class="button-group">
            <button @click="currentComponent = myApp">Example 1</button>
            <button @click="currentComponent = myApp2">Example 2</button>
            <button @click="currentComponent = myApp3">Example 3</button>
            <button @click="currentComponent = myApp4">Example 4</button>
            <button @click="currentComponent = myApp5">Example 5</button>
        </div>
        <component :is="currentComponent" />
    </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import myApp from '@/dev/dev1.vue'
import myApp2 from '@/dev/dev2.vue'
import myApp3 from '@/dev/dev3.vue'
import myApp4 from '@/dev/dev4.vue'
import myApp5 from '@/dev/dev5.vue'

const currentComponent = shallowRef(myApp5) // 默认使用 myApp 组件
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
