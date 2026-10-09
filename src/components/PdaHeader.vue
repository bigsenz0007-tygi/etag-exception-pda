<template>
  <header class="pda-header">
    <button v-if="showBack" type="button" class="pda-header__back" aria-label="返回" @click="$emit('back')">
      <img
        class="pda-header__back-icon"
        :src="iconBack"
        width="10.5858"
        height="20"
        alt=""
      />
    </button>
    <h1 class="pda-header__title">{{ title }}</h1>
    <span class="pda-header__right">
      <slot name="right" />
    </span>
  </header>
</template>

<script>
import iconBack from '@/assets/figma/icon-back.svg'

export default {
  name: 'PdaHeader',
  props: {
    title: { type: String, default: '' },
    showBack: { type: Boolean, default: true }
  },
  data() {
    return { iconBack }
  }
}
</script>

<style scoped>
.pda-header {
  height: var(--pda-header-h, 40px);
  background: var(--pda-primary, #3c6ef0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.pda-header__back {
  position: absolute;
  left: 12px;
  top: 8px;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.pda-header__back-icon {
  display: block;
  width: 10.5858px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
}

.pda-header__title {
  margin: 0;
  font-size: var(--pda-title, 20px);
  font-weight: 500;
  color: #fff;
  line-height: 28px;
}

.pda-header__right {
  position: absolute;
  right: 12px;
  top: 0;
  height: var(--pda-header-h, 40px);
  display: flex;
  align-items: center;
}
</style>
