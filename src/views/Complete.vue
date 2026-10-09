<template>
  <div class="page">
    <pda-header title="电子标签异常处置" @back="goException" />
    <pda-steps :current="3" />
    <div class="page__body">
      <section class="result">
        <div class="result__icon">
          <img
            class="result__img"
            :src="iconSuccess"
            width="64"
            height="64"
            alt=""
          />
        </div>
        <div class="result__copy">
          <h2>{{ resultTitle }}</h2>
          <p>{{ resultDesc }}</p>
        </div>
      </section>
      <pda-info-card title="处置明细" :rows="resultRows" />
    </div>
    <pda-footer-bar text="继续处理" @click="continueHandle" />
  </div>
</template>

<script>
import PdaHeader from '@/components/PdaHeader.vue'
import PdaInfoCard from '@/components/PdaInfoCard.vue'
import PdaFooterBar from '@/components/PdaFooterBar.vue'
import PdaSteps from '@/components/PdaSteps.vue'
import iconSuccess from '@/assets/figma/icon-success-f4c1f.svg'
import { REASON } from '@/mock/catalog'
import { getBoundTag, getCurrentLog, getJudgement, getMaterial, resetForContinue } from '@/store/session'

export default {
  name: 'Complete',
  components: { PdaHeader, PdaInfoCard, PdaFooterBar, PdaSteps },
  data() {
    return { iconSuccess }
  },
  computed: {
    material() {
      return getMaterial() || {}
    },
    judgedReason() {
      const judgement = getJudgement() || {}
      return judgement.judgedReason || this.material.reason || ''
    },
    isNormal() {
      return this.material.reason === REASON.NONE
    },
    isUnregistered() {
      return this.judgedReason === REASON.UNREGISTERED || this.material.reason === REASON.UNREGISTERED
    },
    resultTitle() {
      if (this.isNormal) return '电子标签状态正常'
      if (this.isUnregistered) return '电子标签处理成功'
      return '电子标签更换成功'
    },
    resultDesc() {
      return this.isNormal
        ? '物资编码与电子标签状态正常，不必处理～'
        : '物资编码与电子标签已绑定'
    },
    resultRows() {
      const material = this.material
      const bound = getBoundTag() || {}
      const log = getCurrentLog() || {}
      if (this.isNormal) {
        return [
          { label: '物资条码', value: material.code },
          { label: '电子标签', value: material.systemTag },
          { label: '绑定状态', value: material.category }
        ]
      }
      if (this.isUnregistered) {
        return [
          { label: '物资条码', value: log.materialCode || material.code },
          { label: '电子标签', value: log.newTag || bound.tagId },
          { label: '绑定状态', value: '待确认', tone: 'warn' }
        ]
      }
      return [
        { label: '物资条码', value: log.materialCode || material.code },
        { label: '原电子标签', value: log.oldTag || material.systemTag },
        { label: '新电子标签', value: log.newTag || bound.tagId },
        { label: '绑定状态', value: '绑定成功', tone: 'ok' }
      ]
    }
  },
  created() {
    if (this.isNormal) return
    if (!getBoundTag()) {
      this.$router.replace({ name: 'exception' })
    }
  },
  methods: {
    goException() {
      resetForContinue()
      this.$router.replace({ name: 'exception', query: {} })
    },
    continueHandle() {
      resetForContinue()
      this.$router.replace({ name: 'exception', query: {} })
    }
  }
}
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--pda-bg, #f1f2f4);
}

.page__body {
  flex: 1;
  overflow: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result {
  background: #fff;
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.result__icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result__img {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.result__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.result h2 {
  margin: 0;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  color: var(--pda-text, #23252b);
}

.result p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--pda-text-2, #525765);
  white-space: nowrap;
}
</style>
