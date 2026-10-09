<template>
  <div class="page">
    <pda-header title="电子标签异常处置" :show-back="true" @back="onBack" />
    <pda-steps :current="1" />
    <pda-toast :visible="toast.visible" :message="toast.message" :type="toast.type" />
    <pda-center-toast :visible="centerToast.visible" :icon="centerToast.icon" :lines="centerToast.lines" />

    <div class="page__body">
      <pda-info-card size="sm" :rows="contextRows" />

      <div class="card">
        <div class="scan-head">
          <p class="scan-head__title">扫描物资条码</p>
          <div class="hint">{{ scanHint }}</div>
        </div>
        <pda-scan-field
          plain
          v-model="materialCode"
          label="物资条码"
          placeholder="请扫描或输入"
          @scan="scanMaterial"
          @confirm="onConfirmMaterial"
        />
        <pda-scan-field
          plain
          readonly
          :value="categoryText"
          label="设备分类"
          placeholder="扫描后自动录入"
        />
        <pda-scan-field
          v-if="isNormal"
          plain
          readonly
          :value="tagText"
          label="电子标签"
        />
        <pda-warn-banner
          v-if="isNormal"
          tone="ok"
          text="当前设备电子标签状态正常，不必处理～"
        />
      </div>
    </div>

    <pda-footer-bar :text="footerText" @click="onFooterClick" />

    <pda-scan-sheet
      :visible="sheet"
      title="扫描物资条码"
      :options="materialOptions"
      @close="sheet = false"
      @pick="pickMaterial"
    />
  </div>
</template>

<script>
import PdaHeader from '@/components/PdaHeader.vue'
import PdaScanField from '@/components/PdaScanField.vue'
import PdaInfoCard from '@/components/PdaInfoCard.vue'
import PdaFooterBar from '@/components/PdaFooterBar.vue'
import PdaToast from '@/components/PdaToast.vue'
import PdaCenterToast from '@/components/PdaCenterToast.vue'
import PdaScanSheet from '@/components/PdaScanSheet.vue'
import PdaSteps from '@/components/PdaSteps.vue'
import PdaWarnBanner from '@/components/PdaWarnBanner.vue'
import {
  MOCK_MATERIAL_CODES,
  REASON,
  REASON_LABEL,
  queryMaterial,
  toastDuration
} from '@/mock/catalog'
import { applyCallerQuery, getContext, getJudgement, getMaterial, setJudgement, setMaterial } from '@/store/session'
import { isScanCanceled, nativeScan } from '@/utils/scan'

export default {
  name: 'ExceptionHandle',
  components: {
    PdaHeader,
    PdaScanField,
    PdaInfoCard,
    PdaFooterBar,
    PdaToast,
    PdaCenterToast,
    PdaScanSheet,
    PdaSteps,
    PdaWarnBanner
  },
  data() {
    return {
      materialCode: '',
      material: null,
      sheet: false,
      toast: { visible: false, message: '', type: 'success' },
      centerToast: { visible: false, icon: 'warn', lines: [] },
      materialOptions: MOCK_MATERIAL_CODES,
      toastTimer: null
    }
  },
  computed: {
    contextRows() {
      const ctx = getContext()
      return [
        { label: '登录人', value: ctx.erp },
        { label: '所属场地', value: ctx.siteName }
      ]
    },
    categoryText() {
      return this.material ? this.material.category : ''
    },
    tagText() {
      return this.material && this.material.systemTag ? this.material.systemTag : ''
    },
    isNormal() {
      return Boolean(this.material && this.material.reason === REASON.NONE)
    },
    scanHint() {
      return '扫描围板箱正面右上角标签的条码，确认与当前物资绑定。'
    },
    footerText() {
      if (!this.material) return '扫描物资条码'
      if (this.isNormal) return '继续处理'
      return '去绑定电子标签'
    }
  },
  created() {
    applyCallerQuery(this.$route.query)
    if (this.$route.query.preset) {
      this.applyPreset(this.$route.query.preset)
      return
    }
    this.restoreSession()
  },
  watch: {
    '$route.query.preset'(val) {
      this.applyPreset(val)
    }
  },
  beforeDestroy() {
    if (this.toastTimer) clearTimeout(this.toastTimer)
  },
  methods: {
    onBack() {
      if (window.history.length > 1) this.$router.back()
    },
    restoreSession() {
      const saved = getMaterial()
      if (!saved) return
      this.materialCode = saved.code
      this.material = saved
    },
    applyPreset(preset) {
      if (!preset) return
      this.materialCode = String(preset)
      this.confirmMaterial({ silent: true, goBind: true })
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
      this.centerToast = { visible: true, icon: icon || 'warn', lines: lines || [] }
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.centerToast.visible = false
      }, toastDuration((lines || []).join('')))
    },
    async scanMaterial() {
      this.toast.visible = false
      this.centerToast.visible = false
      try {
        const code = await nativeScan()
        if (code) this.pickMaterial(code)
      } catch (err) {
        if (err && err.message === 'NO_NATIVE_SCAN') {
          this.sheet = true
          return
        }
        if (!isScanCanceled(err)) this.showToast('扫码失败', 'error')
      }
    },
    pickMaterial(code) {
      this.sheet = false
      this.materialCode = code
      this.confirmMaterial({ goBind: true })
    },
    onConfirmMaterial() {
      this.confirmMaterial({ goBind: true })
    },
    persistReason() {
      if (!this.material || this.material.reason === REASON.NONE) {
        setJudgement({ reason: '', label: '', physicalTag: '', hasTag: '', tagId: '' })
        return
      }
      if (this.material.reason === REASON.UNREGISTERED) {
        setJudgement({
          reason: REASON.UNREGISTERED,
          label: REASON_LABEL.UNREGISTERED,
          physicalTag: '',
          hasTag: '',
          tagId: ''
        })
        return
      }
      if (this.material.reason === REASON.LOW_BATTERY) {
        setJudgement({
          reason: REASON.LOW_BATTERY,
          label: REASON_LABEL.LOW_BATTERY,
          physicalTag: '',
          hasTag: '',
          tagId: ''
        })
        return
      }
      const prev = getMaterial()
      const same = prev && prev.code === this.material.code
      const saved = getJudgement()
      setJudgement({
        reason: same ? (saved.judgedReason || '') : '',
        label: same ? (saved.judgedReasonLabel || '') : '',
        physicalTag: same ? (saved.physicalTag || '') : '',
        hasTag: same ? (saved.hasTag || '') : '',
        tagId: same ? (saved.tagId || '') : ''
      })
    },
    goBind() {
      if (!this.material || this.material.reason === REASON.NONE) return
      setMaterial(this.material)
      this.persistReason()
      this.$router.push({ name: 'bind' })
    },
    confirmMaterial(options) {
      const silent = options && options.silent
      const goBind = options && options.goBind
      this.toast.visible = false
      this.centerToast.visible = false
      const prevCode = this.material && this.material.code
      this.material = null
      const result = queryMaterial(this.materialCode)
      if (!result.ok) {
        if (!silent) {
          if (result.error === 'NOT_FOUND') {
            this.showCenterToast('warn', result.lines || ['物资编码不正确', '请重新扫描'])
          } else {
            this.showToast(result.message || '请先扫描物资编码', result.error === 'EMPTY' ? 'warn' : 'error')
          }
        }
        setMaterial(null)
        this.persistReason()
        return
      }
      this.material = result.data
      if (prevCode && prevCode !== result.data.code) {
        setJudgement({ reason: '', label: '', physicalTag: '', hasTag: '', tagId: '' })
      }
      setMaterial(result.data)
      this.persistReason()
      if (result.data.reason === REASON.NONE) return
      if (goBind) this.goBind()
    },
    resetToIdle() {
      this.materialCode = ''
      this.material = null
      setMaterial(null)
      setJudgement({ reason: '', label: '', physicalTag: '', hasTag: '', tagId: '' })
    },
    onFooterClick() {
      if (!this.material) {
        this.scanMaterial()
        return
      }
      if (this.material.reason === REASON.NONE) {
        this.resetToIdle()
        return
      }
      this.goBind()
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

.scan-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scan-head__title {
  margin: 0;
  height: 28px;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: var(--pda-text-2, #525765);
}

.hint {
  padding: 4px;
  border-radius: 4px;
  background: rgba(60, 110, 240, 0.1);
  font-size: 14px;
  line-height: 20px;
  color: var(--pda-primary, #3c6ef0);
}
</style>
