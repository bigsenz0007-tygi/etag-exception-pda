<template>
  <div v-if="text" class="pda-warn">
    <span class="pda-warn__icon">
      <img :src="iconWarn" width="16" height="16" alt="" />
    </span>
    <p>{{ text }}</p>
  </div>
</template>

<script>
import iconWarn from '@/assets/figma/icon-warn.png'

export default {
  name: 'PdaWarnBanner',
  props: {
    text: { type: String, default: '' }
  },
  data() {
    return { iconWarn }
  }
}
</script>

<style scoped>
.pda-warn {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 4px;
  background: rgba(255, 119, 0, 0.1);
}

.pda-warn__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pda-warn__icon img {
  display: block;
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.pda-warn p {
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
  color: #ff7700;
}
</style>
