<template>
  <section class="pda-card" :class="{ 'is-plain': plain, 'is-sm': size === 'sm' }">
    <h2 v-if="title" class="pda-card__title">{{ title }}</h2>
    <div
      v-for="(row, index) in rows"
      :key="row.key || index"
      class="pda-card__item"
    >
      <span class="pda-card__label" :class="{ 'is-spread': isSpread(row.label) }">{{ row.label }}</span>
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
    isSpread(text) {
      const len = String(text || '').length
      return len === 2 || len === 3
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
  min-width: 64px;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 22px;
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
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  font-size: 14px;
  line-height: 28px;
  height: 28px;
}

.pda-card.is-sm .pda-card__value {
  font-size: 14px;
  line-height: 28px;
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
