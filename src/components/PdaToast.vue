<template>
  <div v-if="visible" class="pda-toast" :class="'is-' + type">
    <span class="pda-toast__icon">
      <img
        v-if="type !== 'success'"
        :src="iconWarn"
        width="16"
        height="16"
        alt=""
      />
    </span>
    <span class="pda-toast__text">{{ message }}</span>
  </div>
</template>

<script>
import iconWarn from '@/assets/figma/icon-warn.png'

export default {
  name: 'PdaToast',
  props: {
    visible: { type: Boolean, default: false },
    message: { type: String, default: '' },
    type: { type: String, default: 'success' }
  },
  data() {
    return { iconWarn }
  }
}
</script>

<style scoped>
.pda-toast {
  width: 100%;
  min-height: 36px;
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  opacity: 1;
}

.pda-toast__text {
  font-size: 14px;
  line-height: 20px;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pda-toast__icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pda-toast__icon img {
  display: block;
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.pda-toast.is-success {
  background: #e8f8ef;
  color: #12b35d;
}

.pda-toast.is-success .pda-toast__icon {
  background: #12b35d;
}

.pda-toast.is-success .pda-toast__icon::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 3px;
  width: 6px;
  height: 8px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
  box-sizing: border-box;
}

.pda-toast.is-error,
.pda-toast.is-warn {
  background: #fff3e6;
  color: #ff7700;
}
</style>
