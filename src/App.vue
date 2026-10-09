<template>
  <div class="pda-preview-root">
    <div class="pda-shell">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.pda-preview-root {
  min-height: 100vh;
  background: #2a2d33;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pda-shell {
  --pda-primary: #3c6ef0;
  --pda-primary-10: rgba(60, 110, 240, 0.1);
  --pda-text: #23252b;
  --pda-text-2: #525765;
  --pda-muted: #868d9f;
  --pda-placeholder: #868d9f;
  --pda-quaternary: #babec7;
  --pda-border: #e4e5e9;
  --pda-bg: #f1f2f4;
  --pda-card: #ffffff;
  --pda-fill: #f5f5f6;
  --pda-success: #12b35d;
  --pda-success-10: rgba(18, 179, 93, 0.1);
  --pda-warning: #ff7700;
  --pda-warning-10: rgba(255, 119, 0, 0.1);
  --pda-error: #fc3737;
  --pda-error-10: rgba(252, 55, 55, 0.1);
  --pda-header-h: 40px;
  --pda-title: 20px;
  --pda-label: 16px;
  --pda-body: 16px;
  --pda-btn-h: 36px;
  --pda-footer-h: 48px;
  --pda-gutter: 8px;
  --pda-pad: 8px;
  --pda-label-w: 72px;
  --pda-label-gap: 0px;
  --pda-row-py: 0px;
  --pda-radius-card: 8px;
  --pda-radius-input: 8px;
  --pda-radius-btn: 8px;
  --pda-input-h: 32px;
  --pda-icon: 16px;
  --pda-back: 24px;
  width: 320px;
  height: 533px;
  background: var(--pda-bg);
  overflow: hidden;
  position: relative;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--pda-text);
}

@media (max-width: 320px) {
  .pda-preview-root {
    background: var(--pda-bg);
  }

  .pda-shell {
    width: 100vw;
    height: 100vh;
    box-shadow: none;
  }
}
</style>
