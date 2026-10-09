<template>
  <div class="page">
    <pda-header title="电子标签异常处置" @back="goBack" />
    <pda-steps :current="2" />
    <pda-toast :visible="toast.visible" :message="toast.message" :type="toast.type" />
    <pda-center-toast :visible="centerToast.visible" :icon="centerToast.icon" :lines="centerToast.lines" />

    <div class="page__body">
      <pda-info-card :rows="materialRows" />

      <section class="card">
        <div class="card__head">
          <h2>{{ statusCardTitle }}</h2>
          <span class="tag">{{ statusText }}</span>
        </div>
        <pda-info-card plain :rows="tagRows">
          <pda-warn-banner v-if="showWarn" :text="warnText" />
        </pda-info-card>
        <pda-radio-group
          v-if="isDamageGroup"
          layout="split"
          v-model="hasTag"
          label="物资上是否有电子标签"
          :error="radioError"
          @input="onHasTagChange"
        />
        <pda-scan-field
          v-if="showPhysicalScan"
          plain
          v-model="physicalTag"
          label="扫描标签"
          placeholder="请扫描或输入"
          :error="scanError"
          :settled="Boolean(verifyText)"
          @scan="scanPhysical"
          @confirm="confirmPhysical"
        />
        <pda-info-card v-if="verifyText" plain :rows="verifyRows" />
      </section>

      <section v-if="showGuide" class="card">
        <div class="card__head">
          <h2>电子标签在哪？</h2>
          <span class="place">{{ guidePlace }}</span>
        </div>
        <div class="photo" aria-hidden="true" />
      </section>
    </div>

    <pda-footer-bar :text="footerText" :disabled="!canBind" @click="submitBind" />

    <pda-scan-sheet
      :visible="sheet === 'tag'"
      title="扫描电子标签"
      :options="tagOptions"
      @close="sheet = ''"
      @pick="pickTag"
    />
    <pda-scan-sheet
      :visible="sheet === 'physical'"
      title="扫描标签"
      :options="physicalOptions"
      @close="sheet = ''"
      @pick="pickPhysical"
    />
  </div>
</template>

<script>
import PdaHeader from '@/components/PdaHeader.vue'
import PdaScanField from '@/components/PdaScanField.vue'
import PdaInfoCard from '@/components/PdaInfoCard.vue'
import PdaFooterBar from '@/components/PdaFooterBar.vue'
import PdaToast from '@/components/PdaToast.vue'
import PdaScanSheet from '@/components/PdaScanSheet.vue'
import PdaSteps from '@/components/PdaSteps.vue'
import PdaWarnBanner from '@/components/PdaWarnBanner.vue'
import PdaRadioGroup from '@/components/PdaRadioGroup.vue'
import PdaCenterToast from '@/components/PdaCenterToast.vue'
import { isScanCanceled, nativeScan } from '@/utils/scan'
import {
  MOCK_PHYSICAL_CODES,
  MOCK_TAG_CODES,
  REASON,
  REASON_LABEL,
  bindTag,
  buildDisposalLog,
  judgePhysicalTag,
  toastDuration,
  validateTag
} from '@/mock/catalog'
import { getContext, getJudgement, getMaterial, setBoundTag, setDisposalLog, setJudgement } from '@/store/session'

export default {
  name: 'BindTag',
  components: {
    PdaHeader,
    PdaScanField,
    PdaInfoCard,
    PdaFooterBar,
    PdaToast,
    PdaScanSheet,
    PdaSteps,
    PdaWarnBanner,
    PdaRadioGroup,
    PdaCenterToast
  },
  data() {
    return {
      tagId: '',
      validTag: null,
      hasTag: '',
      physicalTag: '',
      judgedReason: '',
      judgedReasonLabel: '',
      sheet: '',
      toast: { visible: false, message: '', type: 'success' },
      centerToast: { visible: false, icon: 'error', lines: [] },
      tagOptions: MOCK_TAG_CODES,
      physicalOptions: MOCK_PHYSICAL_CODES,
      scanError: false,
      radioError: false,
      bindFailed: false,
      toastTimer: null
    }
  },
  computed: {
    material() {
      return getMaterial()
    },
    isDamageGroup() {
      return this.material && this.material.reason === REASON.DAMAGE_GROUP
    },
    showPhysicalScan() {
      return this.isDamageGroup && this.hasTag === 'yes'
    },
    rejectTagId() {
      return this.material && this.material.systemTag ? this.material.systemTag : ''
    },
    materialRows() {
      const material = this.material || {}
      return [
        { label: '物资条码', value: material.code },
        { label: '设备分类', value: material.category }
      ]
    },
    tagRows() {
      const material = this.material || {}
      const rows = [
        { label: '异常原因', value: this.groupReasonLabel }
      ]
      if (material.systemTag) {
        rows.push({ label: '标签编码', value: material.systemTag })
      }
      if (material.reason === REASON.LOW_BATTERY) {
        rows.push({ label: '当前电量', value: material.battery + '%' })
      }
      return rows
    },
    groupReasonLabel() {
      if (!this.material) return '—'
      if (this.material.reason === REASON.DAMAGE_GROUP) return REASON_LABEL.DAMAGE_GROUP
      return this.judgedReasonLabel || REASON_LABEL[this.material.reason] || '—'
    },
    warnText() {
      return this.material && this.material.warnText ? this.material.warnText : ''
    },
    showWarn() {
      if (!this.warnText) return false
      if (this.hasTag === 'yes' && this.verifyText) return false
      return true
    },
    statusCardTitle() {
      return '电子标签状态'
    },
    showGuide() {
      return Boolean(this.material && this.material.guideImage && this.material.guidePlace)
    },
    guidePlace() {
      return this.material && this.material.guidePlace ? this.material.guidePlace : ''
    },
    verifyText() {
      if (!this.isDamageGroup) return ''
      if (this.hasTag === 'no') return REASON_LABEL.DETACHED
      if (this.judgedReason === REASON.MISBOUND) return REASON_LABEL.MISBOUND
      if (this.judgedReason === REASON.DAMAGED) return this.judgedReasonLabel
      return ''
    },
    verifyRows() {
      return [{ label: '核验结果', value: this.verifyText, tone: 'error' }]
    },
    statusText() {
      if (this.material && this.material.reason === REASON.UNREGISTERED) return '未绑定'
      return '异常'
    },
    canBind() {
      if (!this.material) return false
      if (!this.isDamageGroup) return true
      return Boolean(this.verifyText)
    },
    footerText() {
      if (this.bindFailed) return '重新绑定电子标签'
      if (!this.material) return '绑定电子标签'
      if (this.material.reason === REASON.UNREGISTERED) return '绑定电子标签'
      if (this.judgedReason === REASON.MISBOUND) return '重新扫描电子标签'
      if (this.material.reason === REASON.LOW_BATTERY) return '绑定新电子标签'
      if (this.verifyText) return '绑定新电子标签'
      return '绑定电子标签'
    }
  },
  created() {
    const material = this.material
    const judgement = getJudgement()
    if (!material || material.reason === REASON.NONE) {
      this.$router.replace({ name: 'exception' })
      return
    }
    this.hasTag = judgement.hasTag || ''
    this.physicalTag = judgement.physicalTag || ''
    this.judgedReason = judgement.judgedReason || ''
    this.judgedReasonLabel = judgement.judgedReasonLabel || ''
    if (material.reason === REASON.UNREGISTERED) {
      this.judgedReason = REASON.UNREGISTERED
      this.judgedReasonLabel = REASON_LABEL.UNREGISTERED
    } else if (material.reason === REASON.LOW_BATTERY) {
      this.judgedReason = REASON.LOW_BATTERY
      this.judgedReasonLabel = REASON_LABEL.LOW_BATTERY
    } else if (material.reason === REASON.DAMAGE_GROUP && this.hasTag === 'no') {
      this.syncDetached()
    } else if (material.reason === REASON.DAMAGE_GROUP && this.physicalTag) {
      this.applyPhysicalResult(this.physicalTag, { silent: true })
    }
    this.persistJudgement()
  },
  beforeDestroy() {
    if (this.toastTimer) clearTimeout(this.toastTimer)
  },
  methods: {
    goBack() {
      this.persistJudgement()
      this.$router.back()
    },
    persistJudgement() {
      setJudgement({
        reason: this.judgedReason,
        label: this.judgedReasonLabel,
        physicalTag: this.physicalTag,
        hasTag: this.hasTag
      })
    },
    showToast(message, type) {
      this.centerToast.visible = false
      this.toast = { visible: true, message: message, type: type || 'success' }
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.toast.visible = false
      }, toastDuration(message))
    },
    showCenterToast(icon, lines) {
      this.toast.visible = false
      this.centerToast = { visible: true, icon: icon || 'error', lines: lines || [] }
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.centerToast.visible = false
      }, toastDuration((lines || []).join('')))
    },
    showBindError(result) {
      this.bindFailed = true
      if (result && result.error === 'IN_USE') {
        this.showCenterToast('warn', ['当前标签已被使用', '请重新绑定'])
        return
      }
      if (result && result.error === 'SAME_OLD') {
        this.showCenterToast('error', ['不可绑定原标签', '请重新绑定'])
        return
      }
      this.showToast((result && result.message) || '电子标签不存在', result && result.error === 'EMPTY' ? 'warn' : 'error')
    },
    async openScan(kind) {
      try {
        const code = await nativeScan()
        if (!code) return
        if (kind === 'physical') this.pickPhysical(code)
        else this.pickTag(code)
      } catch (err) {
        if (err && err.message === 'NO_NATIVE_SCAN') {
          this.sheet = kind === 'physical' ? 'physical' : 'tag'
          return
        }
        if (!isScanCanceled(err)) this.showToast('扫码失败', 'error')
      }
    },
    scanPhysical() {
      this.openScan('physical')
    },
    scanNewTag() {
      this.openScan('tag')
    },
    onHasTagChange() {
      this.physicalTag = ''
      this.judgedReason = ''
      this.judgedReasonLabel = ''
      this.validTag = null
      this.tagId = ''
      this.scanError = false
      this.radioError = false
      this.bindFailed = false
      if (this.hasTag === 'no') this.syncDetached()
      this.persistJudgement()
    },
    syncDetached() {
      this.judgedReason = REASON.DETACHED
      this.judgedReasonLabel = REASON_LABEL.DETACHED
    },
    pickPhysical(code) {
      this.sheet = ''
      this.physicalTag = code
      this.confirmPhysical()
    },
    applyPhysicalResult(code, options) {
      const silent = options && options.silent
      const result = judgePhysicalTag(code, this.material)
      if (!result.ok) {
        if (!silent) this.showToast(result.message || '请扫描实物的电子标签', 'error')
        return false
      }
      this.judgedReason = result.reason
      this.judgedReasonLabel = result.label
      this.scanError = false
      this.toast.visible = false
      this.persistJudgement()
      return true
    },
    confirmPhysical() {
      if (!this.material || this.hasTag !== 'yes') return false
      const ok = this.applyPhysicalResult(this.physicalTag)
      this.scanError = !ok
      return ok
    },
    pickTag(code) {
      this.sheet = ''
      this.tagId = code
      if (!this.confirmTag()) return
      this.doBind()
    },
    confirmTag() {
      this.validTag = null
      const result = validateTag(this.tagId, { rejectTagId: this.rejectTagId })
      if (!result.ok) {
        this.showBindError(result)
        return false
      }
      this.validTag = result.data
      return true
    },
    ensureJudged() {
      if (!this.isDamageGroup) return true
      if (!this.hasTag) {
        this.radioError = true
        this.showToast('请选择物资上是否有电子标签', 'error')
        return false
      }
      this.radioError = false
      if (this.hasTag === 'no') {
        this.syncDetached()
        this.persistJudgement()
        return true
      }
      if (this.judgedReason === REASON.DAMAGED || this.judgedReason === REASON.MISBOUND) return true
      this.scanError = true
      this.showToast('请扫描实物的电子标签', 'error')
      return false
    },
    submitBind() {
      if (!this.material) return
      if (!this.ensureJudged()) return
      if (!this.validTag) {
        this.scanNewTag()
        return
      }
      this.doBind()
    },
    doBind() {
      if (!this.material || !this.validTag) return
      const result = bindTag(this.material.code, this.validTag.id, { rejectTagId: this.rejectTagId })
      if (!result.ok) {
        this.showBindError(result)
        return
      }
      const ctx = getContext()
      const log = buildDisposalLog({
        materialCode: this.material.code,
        category: this.material.category,
        reason: this.judgedReason,
        reasonLabel: this.judgedReasonLabel,
        oldTag: this.material.systemTag || '',
        newTag: result.data.tagId,
        erp: ctx.erp,
        siteCode: ctx.siteCode,
        siteName: ctx.siteName
      })
      this.persistJudgement()
      setBoundTag(result.data)
      setDisposalLog(log)
      this.$router.replace({ name: 'complete' })
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
  position: relative;
}

.page__body {
  flex: 1;
  overflow: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
}

.card__head h2 {
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: var(--pda-text-2, #525765);
}

.tag {
  padding: 4px;
  border-radius: 4px;
  background: rgba(255, 119, 0, 0.1);
  color: #ff7700;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  flex-shrink: 0;
}

.place {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--pda-primary, #3c6ef0);
}

.photo {
  width: 100%;
  height: 120px;
  background: #e4e5e9;
  border-radius: 8px;
  flex-shrink: 0;
}
</style>
