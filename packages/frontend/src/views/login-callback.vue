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
import { userLogin } from '@/api/user';

const route = useRoute();
const router = useRouter();

const { userStore } = useGlobalStore();

const msg = ref('登录中');
const isError = ref(false);
const loading = ref(true);

const login = (ticket: string) => {
  loading.value = true;

  userLogin(ticket).then((res) => {
    if (res.data.code !== 0) {
      throw new Error(res.data.msg);
    }

    userStore.login(res.data.data.user);
    localStorage.setItem('PS_TOKEN', `Bearer ${res.data.data.token}`);
    MessagePlugin.success('登陆成功');
    router.push('/')
  }).catch((e) => {
    isError.value = true;
    msg.value = e.message;
  }).finally(() => {
    loading.value = false;
  })
}

onMounted(() => {
  const { code } = route.query;
  if (!code) {
    msg.value = '登录参数缺失';
    isError.value = true;
    return;
  }

  login(code as string);
});
</script>