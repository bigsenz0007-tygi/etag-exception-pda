<template>
  <div v-if="visible" class="pda-center" aria-live="assertive">
    <div class="pda-center__card">
      <img
        class="pda-center__icon"
        :class="{ 'is-flip': icon === 'warn' }"
        :src="iconSrc"
        width="40"
        height="40"
        alt=""
      />
      <p class="pda-center__text">
        <span v-for="(line, index) in lines" :key="index">{{ line }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import iconWarn from '@/assets/figma/toast-used.svg'
import iconError from '@/assets/figma/toast-forbid.svg'

export default {
  name: 'PdaCenterToast',
  props: {
    visible: { type: Boolean, default: false },
    icon: { type: String, default: 'error' },
    lines: { type: Array, default: () => [] }
  },
  data() {
    return { iconWarn, iconError }
  },
  computed: {
    iconSrc() {
      return this.icon === 'warn' ? this.iconWarn : this.iconError
    }
  }
}
</script>

<style scoped>
.pda-center {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.pda-center__card {
  min-width: 160px;
  max-width: 268px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pda-center__icon {
  display: block;
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.pda-center__icon.is-flip {
  transform: scaleY(-1);
}

.pda-center__text {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.pda-center__text span {
  display: block;
}
</style>
