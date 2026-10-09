<template>
  <nav class="pda-steps" aria-label="处置步骤">
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="pda-steps__item"
      :class="itemClass(index)"
    >
      <div class="pda-steps__rail">
        <span class="pda-steps__line is-prev" />
        <span class="pda-steps__node">
          <img
            v-if="index + 1 < current"
            class="pda-steps__done"
            :src="iconDone"
            width="20"
            height="20"
            alt=""
          />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span class="pda-steps__line is-next" />
      </div>
      <p class="pda-steps__text">{{ step }}</p>
    </div>
  </nav>
</template>

<script>
import iconDone from '@/assets/figma/step-done-full.svg'

export default {
  name: 'PdaSteps',
  props: {
    current: { type: Number, default: 1 }
  },
  data() {
    return {
      iconDone,
      steps: ['扫描物资条码', '绑定电子标签', '处置完成']
    }
  },
  methods: {
    itemClass(index) {
      const step = index + 1
      if (step < this.current) return 'is-done'
      if (step === this.current) return 'is-active'
      return 'is-pending'
    }
  }
}
</script>

<style scoped>
.pda-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 4px 12px;
  flex-shrink: 0;
  min-width: 320px;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}

.pda-steps__item {
  width: 100px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px 0;
}

.pda-steps__rail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20px;
}

.pda-steps__line {
  flex: 1 0 0;
  min-width: 1px;
  height: 1px;
  background: #e4e5e9;
}

.pda-steps__item:first-child .pda-steps__line.is-prev,
.pda-steps__item:last-child .pda-steps__line.is-next {
  background: transparent;
}

.pda-steps__node {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  color: #fff;
}

.pda-steps__item.is-pending .pda-steps__node {
  background: #868d9f;
}

.pda-steps__item.is-active .pda-steps__node {
  background: var(--pda-primary, #3c6ef0);
}

.pda-steps__item.is-done .pda-steps__node {
  background: transparent;
}

.pda-steps__done {
  display: block;
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.pda-steps__text {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.pda-steps__item.is-done .pda-steps__text {
  color: #babec7;
}

.pda-steps__item.is-active .pda-steps__text {
  color: var(--pda-primary, #3c6ef0);
}

.pda-steps__item.is-pending .pda-steps__text {
  color: var(--pda-muted, #868d9f);
}
</style>
