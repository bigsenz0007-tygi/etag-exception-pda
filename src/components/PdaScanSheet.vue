<template>
  <div v-if="visible" class="pda-scan-mock">
    <header class="pda-scan-mock__head">
      <button type="button" class="pda-scan-mock__back" aria-label="关闭" @click="$emit('close')">
        <span class="pda-scan-mock__chevron" />
      </button>
      <h2>扫一扫</h2>
      <span class="pda-scan-mock__head-space" />
    </header>

    <div class="pda-scan-mock__stage">
      <div class="pda-scan-mock__finder" aria-hidden="true">
        <span class="pda-scan-mock__corner is-tl" />
        <span class="pda-scan-mock__corner is-tr" />
        <span class="pda-scan-mock__line" />
        <span class="pda-scan-mock__corner is-bl" />
        <span class="pda-scan-mock__corner is-br" />
      </div>
      <p class="pda-scan-mock__tip">将条码放入框内，即可自动扫描</p>
    </div>

    <section class="pda-scan-mock__demo">
      <p class="pda-scan-mock__demo-title">{{ subtitle }}</p>
      <button
        v-for="item in options"
        :key="item.code"
        type="button"
        class="pda-scan-mock__item"
        @click="$emit('pick', item.code)"
      >
        <span class="pda-scan-mock__code">{{ item.code }}</span>
        <span v-if="item.hint" class="pda-scan-mock__hint">{{ item.hint }}</span>
      </button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PdaScanSheet',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '扫描' },
    options: { type: Array, default: () => [] }
  },
  computed: {
    subtitle() {
      return this.title ? '演示扫码 · ' + this.title : '演示扫码，点击下方条码模拟结果'
    }
  }
}
</script>

<style scoped>
.pda-scan-mock {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: #1a1c20;
  display: flex;
  flex-direction: column;
}

.pda-scan-mock__head {
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.pda-scan-mock__head h2 {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  color: #fff;
}

.pda-scan-mock__back,
.pda-scan-mock__head-space {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.pda-scan-mock__back {
  border: 0;
  background: transparent;
  padding: 0;
  position: relative;
}

.pda-scan-mock__chevron {
  position: absolute;
  left: 8px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
}

.pda-scan-mock__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 4px;
}

.pda-scan-mock__finder {
  width: 148px;
  height: 148px;
  position: relative;
}

.pda-scan-mock__corner {
  position: absolute;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border-color: #3c6ef0;
  border-style: solid;
}

.pda-scan-mock__corner.is-tl {
  top: 0;
  left: 0;
  border-width: 2px 0 0 2px;
}

.pda-scan-mock__corner.is-tr {
  top: 0;
  right: 0;
  border-width: 2px 2px 0 0;
}

.pda-scan-mock__corner.is-bl {
  bottom: 0;
  left: 0;
  border-width: 0 0 2px 2px;
}

.pda-scan-mock__corner.is-br {
  bottom: 0;
  right: 0;
  border-width: 0 2px 2px 0;
}

.pda-scan-mock__line {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 16px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3c6ef0, transparent);
  animation: pda-scan-line 1.6s ease-in-out infinite;
}

@keyframes pda-scan-line {
  0% { top: 12px; opacity: 0.35; }
  50% { opacity: 1; }
  100% { top: 132px; opacity: 0.35; }
}

.pda-scan-mock__tip {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #868d9f;
}

.pda-scan-mock__demo {
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 10px 8px 10px;
  max-height: 58%;
  overflow: auto;
  flex-shrink: 0;
}

.pda-scan-mock__demo-title {
  margin: 0 4px 8px;
  font-size: 12px;
  line-height: 16px;
  color: #868d9f;
}

.pda-scan-mock__item {
  width: 100%;
  text-align: left;
  border: 0;
  background: #f1f2f4;
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pda-scan-mock__item:last-child {
  margin-bottom: 0;
}

.pda-scan-mock__code {
  font-size: 16px;
  line-height: 22px;
  color: #23252b;
}

.pda-scan-mock__hint {
  font-size: 12px;
  line-height: 16px;
  color: #868d9f;
}
</style>
