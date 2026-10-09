<template>
  <div v-if="text" class="pda-warn" :class="{ 'is-ok': tone === 'ok' }">
    <span class="pda-warn__icon">
      <img :src="iconSrc" width="16" height="16" alt="" />
    </span>
    <p>{{ text }}</p>
  </div>
</template>

<script>
import iconWarn from '@/assets/figma/icon-warn.png'
import iconOk from '@/assets/figma/icon-success-fill.svg'

export default {
  name: 'PdaWarnBanner',
  props: {
    text: { type: String, default: '' },
    tone: { type: String, default: 'warn' }
  },
  data() {
    return { iconWarn, iconOk }
  },
  computed: {
    iconSrc() {
      return this.tone === 'ok' ? this.iconOk : this.iconWarn
    }
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

.pda-warn.is-ok {
  background: rgba(18, 179, 93, 0.1);
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

.pda-warn.is-ok p {
  color: #12b35d;
}
</style>
