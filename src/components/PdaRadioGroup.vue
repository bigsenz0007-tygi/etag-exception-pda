<template>
  <div class="pda-radio" :class="{ 'is-split': layout === 'split', 'is-error': error }">
    <p v-if="label" class="pda-radio__label" :class="{ 'is-spread': isSpread }">{{ label }}</p>
    <div class="pda-radio__row">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="pda-radio__item"
        :class="{ 'is-active': value === opt.value }"
        @click="onPick(opt.value)"
      >
        <img
          class="pda-radio__icon"
          :src="iconSrc(opt.value)"
          width="20"
          height="20"
          alt=""
        />
        <span>{{ opt.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import iconOn from '@/assets/figma/radio-on.svg'
import iconOff from '@/assets/figma/radio-off.svg'
import iconOffError from '@/assets/figma/radio-off-error.svg'

export default {
  name: 'PdaRadioGroup',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    layout: { type: String, default: 'split' },
    error: { type: Boolean, default: false },
    options: {
      type: Array,
      default: () => [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]
    }
  },
  data() {
    return { iconOn, iconOff, iconOffError }
  },
  computed: {
    isSpread() {
      return String(this.label || '').length === 2
    }
  },
  methods: {
    onPick(optValue) {
      this.$emit('input', this.value === optValue ? '' : optValue)
    },
    iconSrc(optValue) {
      if (this.value === optValue) return this.iconOn
      return this.error ? this.iconOffError : this.iconOff
    }
  }
}
</script>

<style scoped>
.pda-radio {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.pda-radio.is-split {
  justify-content: space-between;
  width: 100%;
}

.pda-radio__label {
  margin: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 22px;
  color: var(--pda-text-2, #525765);
}

.pda-radio__row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pda-radio__item {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
  color: var(--pda-text, #23252b);
}

.pda-radio__icon {
  display: block;
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
</style>
