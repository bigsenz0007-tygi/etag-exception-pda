const DEFAULT_CONTEXT = {
  erp: 'DONGDONG02',
  siteCode: 'BJ-YZ-001',
  siteName: '北京亦庄仓'
}

const state = {
  erp: DEFAULT_CONTEXT.erp,
  siteCode: DEFAULT_CONTEXT.siteCode,
  siteName: DEFAULT_CONTEXT.siteName,
  material: null,
  judgedReason: '',
  judgedReasonLabel: '',
  physicalTag: '',
  hasTag: '',
  boundTag: null,
  currentLog: null,
  logs: []
}

function clearSessionWork() {
  state.material = null
  state.judgedReason = ''
  state.judgedReasonLabel = ''
  state.physicalTag = ''
  state.hasTag = ''
  state.boundTag = null
  state.currentLog = null
}

export function applyCallerQuery(query) {
  if (!query) return
  if (query.erp) state.erp = String(query.erp)
  if (query.siteCode) state.siteCode = String(query.siteCode)
  if (query.siteName) state.siteName = decodeURIComponent(String(query.siteName))
}

export function getContext() {
  return {
    erp: state.erp,
    siteCode: state.siteCode,
    siteName: state.siteName
  }
}

export function setMaterial(material) {
  state.material = material ? Object.assign({}, material) : null
}

export function getMaterial() {
  return state.material
}

export function setJudgement(payload) {
  const data = payload || {}
  state.judgedReason = data.reason || ''
  state.judgedReasonLabel = data.label || ''
  state.physicalTag = data.physicalTag || ''
  state.hasTag = data.hasTag == null ? '' : String(data.hasTag)
}

export function getJudgement() {
  return {
    judgedReason: state.judgedReason,
    judgedReasonLabel: state.judgedReasonLabel,
    physicalTag: state.physicalTag,
    hasTag: state.hasTag
  }
}

export function setBoundTag(tag) {
  state.boundTag = tag ? Object.assign({}, tag) : null
}

export function getBoundTag() {
  return state.boundTag
}

export function setDisposalLog(log) {
  state.currentLog = log ? Object.assign({}, log) : null
  if (log) state.logs.unshift(Object.assign({}, log))
}

export function getCurrentLog() {
  return state.currentLog
}

export function resetForContinue() {
  clearSessionWork()
}
