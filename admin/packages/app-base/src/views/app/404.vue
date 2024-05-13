<template>
  <div class="not-found">
    <img class="img" src="/image/404.png" />
    <div>
      <!-- 返回上一页 -->
      <el-button style="width: 100px" type="primary" @click="onPrevious">
        {{ t('backToPrevious') }}
      </el-button>
      <!-- 返回首页 -->
      <el-button style="width: 100px" type="primary" @click="onIndex">
        {{ t('backToIndex') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { app } from '@app-base/lang'

// use
const { t } = useI18n({ messages: app })
const router = useRouter()

// 返回上一页
function onPrevious() {
  router.go(-1)
}
// 返回首页
function onIndex() {
  router.push('/')
}
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10vh;
  .img {
    width: 40%;
  }
}
</style>
