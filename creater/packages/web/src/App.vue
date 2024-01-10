<template>
  <div>123</div>
  <el-table :data="tableData" :border="true">
    <el-table-column align="center" prop="date" label="字段" />
    <el-table-column align="center" prop="name" label="字段名" />
  </el-table>
  <div>456</div>
</template>

<script setup lang="ts">
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
for (let index = 0; index < 30; index++) {
  tableData.push({
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  })
}
</script>

<style scoped></style>
