<template>
  <el-dropdown>
    <el-icon class="dropdown"><More /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <slot></slot>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { More } from '@element-plus/icons-vue'
</script>

<style lang="scss">
.dropdown {
  color: var(--main-color);
  cursor: pointer;
  font-size: 16px;
  margin-left: 5px;
}
</style>
