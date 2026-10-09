<template>
  <section class="pda-card" :class="{ 'is-plain': plain, 'is-sm': size === 'sm' }">
    <h2 v-if="title" class="pda-card__title">{{ title }}</h2>
    <div
      v-for="(row, index) in rows"
      :key="row.key || index"
      class="pda-card__item"
    >
      <span
        class="pda-card__label"
        :class="{
          'is-spread': isSpread(row.label),
          'is-4': labelLen(row.label) === 4
        }"
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
    isSpread(text) {
      return this.labelLen(text) === 2
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

.pda-card__item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  box-sizing: border-box;
}

.pda-card__label {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0;
  color: var(--pda-text-2, #525765);
}

.pda-card__label.is-spread {
  text-align: justify;
  text-align-last: justify;
}

.pda-card__value {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  line-height: 22px;
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
