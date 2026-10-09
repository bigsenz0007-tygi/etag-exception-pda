<template>
  <footer class="pda-footer">
    <button
      type="button"
      class="pda-footer__btn"
      :class="{ 'is-muted': muted }"
      :disabled="disabled"
      @click="$emit('click')"
    >
      {{ text }}
    </button>
  </footer>
</template>

<script>
export default {
  name: 'PdaFooterBar',
  props: {
    text: { type: String, default: '确定' },
    disabled: { type: Boolean, default: false },
    muted: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.pda-footer {
  height: var(--pda-footer-h, 48px);
  padding: 6px 8px;
  box-sizing: border-box;
  background: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 5px rgba(32, 36, 45, 0.2);
}

.pda-footer__btn {
  width: 100%;
  height: var(--pda-btn-h, 36px);
  border: 0;
  border-radius: var(--pda-radius-btn, 8px);
  background: var(--pda-primary, #3c6ef0);
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
}

.pda-footer__btn:disabled,
.pda-footer__btn.is-muted {
  opacity: 0.5;
  color: #fff;
  background: var(--pda-primary, #3c6ef0);
}
</style>
