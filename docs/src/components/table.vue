<template>
    <el-table
      :data="tableData"
      style="width: 100% ; height: 100%;"
      :row-class-name="tableRowClassName"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="code" label="Code" width="120" />
      <el-table-column prop="fclass" label="Class" width="120" />
      <el-table-column prop="type" label="Type" width="120" />
      <el-table-column prop="height" label="Height" width="120" />
      <el-table-column prop="osm_id" label="OSM ID" />
    </el-table>
</template>
  
  <script setup>
  import { computed } from 'vue';
  import { useBuildingStore } from '@/stores/buildingStore.js';
  import { data } from '@/loaders/buildings.data.js';
  
  const buildingStore = useBuildingStore();
  
  // Transform GeoJSON features to table data
  const tableData = computed(() => {
    return data.features.map(feature => ({
      name: feature.properties.name || feature.properties.Name || 'N/A',
      code: feature.properties.code || feature.properties.Code || 'N/A',
      fclass: feature.properties.fclass || feature.properties.Fclass || 'N/A',
      type: feature.properties.type || feature.properties.Type || 'N/A',
      height: feature.properties.height || feature.properties.Height || 'N/A',
      osm_id: feature.properties.osm_id || feature.properties.osm_ID || feature.id || 'N/A',
      rawData: feature // Store the complete feature data
    }));
  });
  
  const handleRowClick = (row) => {
    buildingStore.updateSelectedBuilding(row.rawData);
  };
  
  const tableRowClassName = ({ row }) => {
    const selected = buildingStore.selectedBuilding;
    if (selected && (selected.properties?.osm_id === row.osm_id || selected.id === row.osm_id)) {
      return 'selected-row';
    }
    return '';
  };
  </script>
  
  <style>
  .el-table {
    --el-table-border-color: var(--vp-c-border);
    --el-table-border: 1px solid var(--vp-c-border);
    --el-table-text-color: var(--vp-c-text-1);
    --el-table-header-text-color: var(--vp-c-text-1);
    --el-table-row-hover-bg-color: var(--vp-c-bg-alt);
    --el-table-current-row-bg-color: var(--vp-c-warning-soft);
    background-color: var(--vp-c-bg);

    /* 表头 */
    --el-table-header-bg-color: var(--vp-c-bg-alt);
    --el-table-header-text-color: var(--vp-c-text-1);
    --el-table-header-border-color: var(--vp-c-border);
  }
  
  .el-table th {
    background-color: var(--vp-c-bg-alt);
  }
  
  .el-table tr {
    background-color: var(--vp-c-bg);
  }
  
  .el-table .selected-row {
    --el-table-tr-bg-color: var(--vp-c-warning-soft);
  }
  </style>