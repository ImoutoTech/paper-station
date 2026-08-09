<template>
  <div class="tw-h-[800px] tw-w-screen tw-flex tw-justify-center tw-items-center">
    <div class="tw-flex tw-flex-col">
      <div class="tw-text-center">
        <UnhappyIcon v-if="isError" class="tw-text-[64px] tw-text-red-600"/>
        <CatIcon v-if="!isError" class="tw-text-[64px]"/>
      </div>
      <t-card :bordered="false" class="tw-w-[400px] tw-mt-4 tw-text-center">
        <p class="tw-leading-[24px]"><LoadIcon v-if="loading" class="tw-animate-spin tw-mb-1 tw-mr-2"/>{{ msg }}</p>
        <t-button v-if="isError" class="tw-mt-2" block @click="router.push('/')">返回</t-button>
      </t-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next';
import { UnhappyIcon, CatIcon, LoadIcon } from 'tdesign-icons-vue-next'
import { useGlobalStore } from '@/stores/store';
import { getUserData } from '@/api/user';

const route = useRoute();
const router = useRouter();

const { userStore } = useGlobalStore();

const msg = ref('登录中');
const isError = ref(false);
const loading = ref(true);

const errorMessages: Record<string, string> = {
  oidc_cancelled: '登录已取消',
  oidc_invalid_callback: '登录回调无效或已过期',
  oidc_unavailable: '登录服务暂时不可用'
}

const safeReturnTo = (value: unknown) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

const login = () => {
  loading.value = true;

  getUserData().then((res) => {
    if (res.data.code !== 0) {
      throw new Error(res.data.msg);
    }

    userStore.login(res.data.data);
    MessagePlugin.success('登陆成功');
    router.replace(safeReturnTo(route.query.returnTo))
  }).catch(() => {
    isError.value = true;
    msg.value = '登录态建立失败，请重试';
  }).finally(() => {
    loading.value = false;
  })
}

onMounted(() => {
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  if (error) {
    msg.value = errorMessages[error] || '登录失败，请重试';
    isError.value = true;
    loading.value = false;
    return;
  }

  login();
});
</script>
