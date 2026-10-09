<template>
  <section
    class="pda-card"
    :class="{ 'is-plain': plain, 'is-sm': size === 'sm', 'has-title': Boolean(title) }"
  >
    <h2 v-if="title" class="pda-card__title">{{ title }}</h2>
    <div
      v-for="(row, index) in rows"
      :key="row.key || index"
      class="pda-card__item"
    >
      <span
        class="pda-card__label"
        :class="labelClass(row.label)"
      >{{ row.label }}</span>
      <span
        class="pda-card__value"
        :class="{
          'is-warn': row.tone === 'warn',
          'is-ok': row.tone === 'ok',
          'is-error': row.tone === 'error'
        }"
      >
        {{ row.value || '—' }}
      </span>
    </div>
    <slot />
  </section>
</template>

<script>
export default {
  name: 'PdaInfoCard',
  props: {
    title: { type: String, default: '' },
    rows: { type: Array, default: () => [] },
    plain: { type: Boolean, default: false },
    size: { type: String, default: 'default' }
  },
  methods: {
    labelLen(text) {
      return String(text || '').length
    },
    labelClass(text) {
      const n = this.labelLen(text)
      if (this.size === 'sm') {
        return {
          'is-spread': n === 2,
          'is-4': n === 4
        }
      }
      return {
        'is-spread': n === 2,
        'is-2': n === 2,
        'is-4': n === 4,
        'is-5': n === 5,
        'is-7': n === 7
      }
    }
  }
}
</script>

<style scoped>
.pda-card {
  background: var(--pda-card, #fff);
  border-radius: var(--pda-radius-card, 8px);
  padding: 8px;
}

.pda-card.is-plain {
  background: transparent;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.pda-card__title {
  margin: 0;
  height: 28px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: var(--pda-text-2, #525765);
  display: flex;
  align-items: center;
}

.pda-card.has-title .pda-card__title {
  margin-bottom: 4px;
}

.pda-card.has-title .pda-card__item + .pda-card__item {
  margin-top: 4px;
}

.pda-card__item {
  display: flex;
  align-items: center;
  gap: var(--pda-label-gap, 8px);
  height: 32px;
  min-height: 32px;
  padding: 0;
  box-sizing: border-box;
}

.pda-card__label {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--pda-text-2, #525765);
  white-space: nowrap;
}

.pda-card__label.is-2,
.pda-card__label.is-4 {
  width: 64px;
}

.pda-card__label.is-5 {
  width: 80px;
}

.pda-card__label.is-7 {
  width: 112px;
}

.pda-card__label.is-spread {
  text-align: justify;
  text-align-last: justify;
}

.pda-card__value {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  line-height: 24px;
  color: var(--pda-text, #23252b);
  word-break: break-all;
}

.pda-card.is-sm .pda-card__item {
  min-height: 28px;
  height: 28px;
  gap: 4px;
}

.pda-card.is-sm .pda-card__label {
  width: auto;
  font-size: 14px;
  line-height: 28px;
  height: 28px;
  letter-spacing: 0;
}

.pda-card.is-sm .pda-card__label.is-4 {
  width: 60px;
}

.pda-card.is-sm .pda-card__value {
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pda-card__value.is-warn {
  color: var(--pda-warning, #ff7700);
}

.pda-card__value.is-ok {
  color: var(--pda-success, #12b35d);
}

.pda-card__value.is-error {
  color: var(--pda-error, #fc3737);
}
</style>
