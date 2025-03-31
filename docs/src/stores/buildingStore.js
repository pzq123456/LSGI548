// stores/buildingStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBuildingStore = defineStore('cityStore', () => {
  const selectedBuilding = ref(null);

  function updateSelectedBuilding(building) {
    selectedBuilding.value = building;
    console.log('Clicked building:', building);
  }

  return {
    selectedBuilding,
    updateSelectedBuilding
  };
});
