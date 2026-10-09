<template>
  <div class="pda-scan" :class="{ 'is-plain': plain }">
    <div class="pda-scan__row">
      <p v-if="label" class="pda-scan__label" :class="{ 'is-spread': isSpread }">{{ label }}</p>
      <div
        class="pda-scan__box"
        :class="{
          'is-readonly': readonly,
          'is-scan': !readonly,
          'is-error': error,
          'is-settled': settled && !error
        }"
        @click="onBoxClick"
      >
        <input
          class="pda-scan__input"
          :value="value"
          :placeholder="placeholder"
          :readonly="readonly"
          autocomplete="off"
          @input="$emit('input', $event.target.value)"
          @keyup.enter="$emit('confirm', value)"
        />
        <button
          v-if="!readonly"
          type="button"
          class="pda-scan__btn"
          aria-label="扫一扫"
          @click.stop="$emit('scan')"
        >
          <img
            class="pda-scan__icon"
            :src="iconScan"
            width="13.333"
            height="13.333"
            alt=""
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import iconScan from '@/assets/figma/icon-scan.svg'

export default {
  name: 'PdaScanField',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '请扫描或输入' },
    plain: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    settled: { type: Boolean, default: false }
  },
  data() {
    return { iconScan }
  },
  computed: {
    isSpread() {
      return String(this.label || '').length === 2
    }
  },
  methods: {
    onBoxClick() {
      if (this.readonly) return
      this.$emit('scan')
    }
  }
}
</script>

<style scoped>
.pda-scan {
  background: var(--pda-card, #fff);
  border-radius: var(--pda-radius-card, 8px);
  padding: 8px;
}

.pda-scan.is-plain {
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.pda-scan__row {
  display: flex;
  align-items: center;
  height: 32px;
}

.pda-scan__label {
  width: 72px;
  margin: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 32px;
  height: 32px;
  color: var(--pda-text-2, #525765);
  text-align: left;
}

.pda-scan__label.is-spread {
  text-align: justify;
  text-align-last: justify;
}

.pda-scan__box {
  flex: 1;
  min-width: 0;
  height: 32px;
  background: #fff;
  border: 1px solid var(--pda-border, #e4e5e9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
}

.pda-scan__box.is-scan {
  cursor: pointer;
}

.pda-scan__box.is-scan:not(.is-settled):not(.is-error):not(.is-readonly) {
  border-color: var(--pda-primary, #3c6ef0);
}

.pda-scan__box.is-error {
  border-color: #fc3737;
}

.pda-scan__box.is-error:focus-within {
  border-color: #fc3737;
}

.pda-scan__box.is-readonly {
  background: var(--pda-fill, #f5f5f6);
}

.pda-scan__box:focus-within {
  border-color: var(--pda-primary, #3c6ef0);
}

.pda-scan__box.is-settled,
.pda-scan__box.is-settled:focus-within {
  border-color: var(--pda-border, #e4e5e9);
}

.pda-scan__box.is-readonly:focus-within {
  border-color: var(--pda-border, #e4e5e9);
}

.pda-scan__input {
  flex: 1;
  min-width: 0;
  height: 24px;
  border: 0;
  outline: none;
  font-size: 16px;
  line-height: 24px;
  color: var(--pda-text, #23252b);
  background: transparent;
}

.pda-scan__box.is-readonly .pda-scan__input {
  color: var(--pda-muted, #868d9f);
}

.pda-scan__input::placeholder {
  color: var(--pda-muted, #868d9f);
}

.pda-scan__btn {
  width: 16px;
  height: 16px;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
}

.pda-scan__icon {
  display: block;
  width: 13.333px;
  height: 13.333px;
  object-fit: contain;
  flex-shrink: 0;
}
</style>
