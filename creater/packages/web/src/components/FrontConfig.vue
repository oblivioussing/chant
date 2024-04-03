<template>
  <div class="config-box">
    <!-- required -->
    <div class="config-item">
      <div class="label">required:</div>
      <el-select v-model="row.required" clearable size="small">
        <el-option label="true" :value="1"></el-option>
        <el-option label="false" :value="0"></el-option>
      </el-select>
    </div>
    <!-- search -->
    <div class="config-item">
      <div class="label">search:</div>
      <el-select v-model="row.search" clearable size="small">
        <el-option label="true" :value="1"></el-option>
        <el-option label="false" :value="0"></el-option>
      </el-select>
    </div>
    <!-- hideInPages -->
    <div class="config-item">
      <div class="label">hideInPages:</div>
      <el-select v-model="row.hideInPages" clearable multiple size="small">
        <el-option label="list" value="list"></el-option>
        <el-option label="add" value="add"></el-option>
        <el-option label="edit" value="edit"></el-option>
      </el-select>
    </div>
    <!-- type -->
    <div class="config-item">
      <div class="label">type:</div>
      <el-select v-model="row.type" clearable size="small">
        <el-option
          v-for="item in typeList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <!-- datepickerType -->
    <div v-if="row.type === 'date-picker'" class="config-item">
      <div class="label">datepickerType:</div>
      <el-select v-model="row.datepickerType" clearable size="small">
        <el-option
          v-for="item in datepickerTypeList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <!-- inputType -->
    <div v-if="row.type === 'input'" class="config-item">
      <div class="label">inputType:</div>
      <el-select v-model="row.inputType" clearable size="small">
        <el-option label="password" value="password"></el-option>
        <el-option label="text" value="text"></el-option>
        <el-option label="textarea" value="textarea"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
// props
defineProps<{
  row: any
}>()
// var
const typeList = [
  'date-picker',
  'input',
  'input-number',
  'input-number-range',
  'radio',
  'select',
  'time-picker',
  'upload'
]
const datepickerTypeList = [
  'year',
  'month',
  'date',
  'dates',
  'week',
  'datetime',
  'datetimerange',
  'daterange',
  'monthrange'
]
</script>

<style scoped lang="scss">
@import '../style/index.scss';
</style>
