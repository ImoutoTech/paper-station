<template>
  <div class="app-home">
    <div class="banner">
      <h2>Paper Station 动态配置系统</h2>
    </div>

    <div class="content">
      <h3>如何食用</h3>
      <section>
        <t-steps :current="3" readonly theme="dot">
          <t-step-item title="创建站点" content="配置站点域名" />
          <t-step-item title="创建配置" content="创建你的配置文件"/>
          <t-step-item title="完成" content="在你需要的地方使用吧" />
        </t-steps>
      </section>
    </div>
  </div>
</template>
<style lang="scss" scope>
@import '../assets/common.scss';

.app-home {
  .banner {
    @apply tw-h-[500px] tw-flex tw-justify-center tw-items-center tw-bg-slate-100;

    h2 {
      @apply tw-text-3xl tw-opacity-70;
    }
  }

  .content {
    @include content-width;
    @apply tw-my-5;

    h3 {
      @apply tw-text-2xl tw-mb-10;
    }
  }
}
</style>