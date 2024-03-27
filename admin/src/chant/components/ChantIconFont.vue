<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-${props.icon}`"></use>
  </svg>
</template>

<script setup lang="ts">
// props
const props = defineProps<{
  icon: string
}>()
</script>

<style scoped lang="scss">
.icon {
  height: 1.2em;
  fill: currentColor;
  overflow: hidden;
  vertical-align: -0.15em;
  width: 1.2em;
}
</style>
