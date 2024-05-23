<template>
  <t-dialog
    :header="`${actionText}站点`"
    :visible="visible"
    :width="isMobile ? '90%' : 564"
    :footer="!readonly"
    :confirm-btn="{
      loading,
    }"
    @close="emits('update:visible', false)"
    @confirm="handleConfirm"
  >
    <t-form ref="formRef" :data="siteData" :disabled="readonly" :rules="formRules" label-align="top">
      <t-form-item label="站点名" name="name">
        <t-input v-model="siteData.name"></t-input>
      </t-form-item>

      <t-form-item label="关联配置" name="configs">
        <t-transfer v-model="siteData.configs" class="config-transfer" :disabled="configLoading" :data="configOptions" :operation="['移除', '加入']" :search="true">
          <template #title="props">
            <div>{{ props.type === 'target' ? '已关联' : '未关联' }}</div>
          </template>
        </t-transfer>
      </t-form-item>

      <t-form-item label="域名" name="domains">
        <t-tag-input v-model="siteData.domains"></t-tag-input>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { SiteItem } from '@/types';
import { computed, ref, reactive, watch, onUnmounted } from 'vue';
import { useConfigList } from '@/hooks/useConfigList';
import { createSite, updateSite } from '@/api/site';
import { MessagePlugin } from 'tdesign-vue-next';
import { useGlobalStore } from '@/stores/store';

defineOptions({
  name: 'SiteEdit',
})

const props = withDefaults(defineProps<{
  site?: SiteItem;
  readonly?: boolean;
  visible: boolean;
  isCreate?: boolean;
}>(), {
  readonly: false,
  visible: false,
  isCreate: false,
});

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm'): void;
}>();

const { configList, configLoading, refreshConfigList } = useConfigList();

const { isMobile } = useGlobalStore()

const configOptions = computed(() => configList.value.map((c) => ({
  label: c.name,
  value: c._id,
})))

const actionText = computed(() => props.isCreate ? '创建' : '编辑');

const siteData = reactive({
  domains: [] as string[],
  configs: [] as string[],
  name: '',
});

const formRules = {
  name: [
    {
      required: true,
      message: '请填写站点名',
      type: 'error'
    }
  ],
  domains: [
    {
      required: true,
      message: '请先完成此项',
      type: 'error',
      trigger: 'blur'
    },
  ],
  configs: [
    {
      required: true,
      message: '请先完成此项',
      type: 'error',
      trigger: 'blur'
    },
  ],
};

const formRef = ref();
const loading = ref(false);

const initSiteData = () => {
  if (props.isCreate) {
    siteData.name = ''
    siteData.configs = []
    siteData.domains = []
  } else {
    siteData.name = props.site?.name || '';
    siteData.domains = props.site?.domains || [];
    siteData.configs = props.site?.configs || [];
  }
}

const unwatch = watch(
  () => props.visible,
  async (val) => {
    if (val) {
      initSiteData()
      refreshConfigList()
      await formRef.value.clearValidate();
    }
  }
);

const handleConfirm = async () => {
  const isValidate = await formRef.value.validate();
  if (isValidate !== true) {
    return;
  }

  loading.value = true;
  const result = props.isCreate ?
    createSite({...siteData}) :
    updateSite((props.site as SiteItem)._id, {...siteData});

  result.then((res) => {
    if (res.data.code === 0) {
      MessagePlugin.success('操作成功')
      emits('confirm')
      emits('update:visible', false)
    } else {
      throw new Error(res.data.msg)
    }
  }).catch((e) => {
    MessagePlugin.error(e.message);
  }).finally(() => {
    loading.value = false;
  })
}

onUnmounted(unwatch);
</script>
<style lang="scss" scoped>
.config-transfer {
  @media (max-width: 768px) {
    flex-direction: column;
    row-gap: 10px;
    width: 100%;
  }
}
</style>