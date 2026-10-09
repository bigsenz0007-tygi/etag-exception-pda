export const REASON = {
  UNREGISTERED: 'UNREGISTERED',
  LOW_BATTERY: 'LOW_BATTERY',
  DAMAGE_GROUP: 'DAMAGE_GROUP',
  DAMAGED: 'DAMAGED',
  MISBOUND: 'MISBOUND',
  DETACHED: 'DETACHED',
  NONE: 'NONE'
}

export const REASON_LABEL = {
  UNREGISTERED: '电子标签未注册',
  LOW_BATTERY: '电子标签电量低于5%',
  DAMAGE_GROUP: '电子标签损坏、脱落或绑错',
  DAMAGED: '电子标签损坏，需绑新标签',
  DAMAGED_SHORT: '电子标签损坏',
  MISBOUND: '电子标签绑错',
  DETACHED: '电子标签脱落，需绑新标签',
  NONE: '无异常'
}

export const WARN = {
  UNREGISTERED: '扫描围板箱正面右上角标签的条码，确认与当前物资绑定。',
  UNREGISTERED_HINT: '请确保该标签为物资实物电子标签，确定绑定后系统将绑定该标签信息。',
  LOW_BATTERY: '当前电量低于5%，需扫描新的电子标签并建立新的绑定关系。',
  DAMAGE_CHECK: '请检查实物的物资编码和实物电子标签与系统信息是否一致。',
  DETACHED: '请扫描新的电子标签，替换当前异常标签并建立新的绑定关系。',
  DAMAGED: '需绑定新标签，替换当前异常标签并建立新的绑定关系。',
  DAMAGED_CONFIRMED: '需绑定新标签。替换当前异常标签并建立新的绑定关系。',
  MISBOUND: '请确保当前标签为对应物资的实物电子标签，点击确定绑定后会替换系统原标签。'
}

const GUIDE = {
  scanHint: WARN.UNREGISTERED,
  guidePlace: '围板箱 | 正面右上角',
  guideImage: true
}

function material(code, extra) {
  return Object.assign({
    code: code,
    category: '围板箱',
    battery: null,
    systemTag: '',
    warnText: '',
    guidePlace: GUIDE.guidePlace,
    guideImage: GUIDE.guideImage
  }, extra)
}

const MATERIALS = {
  WZUNREG001: material('WZUNREG001', {
    reason: REASON.UNREGISTERED,
    warnText: WARN.UNREGISTERED
  }),
  WZLOW001: material('WZLOW001', {
    reason: REASON.LOW_BATTERY,
    battery: 3,
    systemTag: 'ESL-0817-6352',
    warnText: WARN.LOW_BATTERY
  }),
  WZDAM001: material('WZDAM001', {
    reason: REASON.DAMAGE_GROUP,
    battery: 68,
    systemTag: 'ESL-0817-6352',
    warnText: WARN.DAMAGE_CHECK
  }),
  CSL22010533608938: material('CSL22010533608938', {
    reason: REASON.DAMAGE_GROUP,
    battery: 68,
    systemTag: 'ESL-0817-6352',
    warnText: WARN.DAMAGE_CHECK
  }),
  WZOK001: material('WZOK001', {
    reason: REASON.NONE,
    battery: 86,
    systemTag: 'ESL-OK-001',
    warnText: '',
    guidePlace: '',
    guideImage: false
  })
}

const TAGS = {
  'TAG-NEW-001': { id: 'TAG-NEW-001', status: 'ok' },
  'TAG-NEW-002': { id: 'TAG-NEW-002', status: 'ok' },
  'TAG-USED-001': { id: 'TAG-USED-001', status: 'used' },
  'ESL-0817-6352': { id: 'ESL-0817-6352', status: 'ok' },
  'ESL-WRONG-001': { id: 'ESL-WRONG-001', status: 'ok' },
  'ESL-OK-001': { id: 'ESL-OK-001', status: 'ok' }
}

let logSeq = 1

function pad(value) {
  return String(value).padStart(2, '0')
}

export function toastDuration(message) {
  const length = String(message || '').length
  if (length <= 10) return 2500
  if (length <= 15) return 3000
  return 3500
}

export function queryMaterial(code) {
  const key = String(code || '').trim().toUpperCase()
  if (!key) {
    return { ok: false, error: 'EMPTY', message: '请先扫描物资编码' }
  }
  const materialItem = MATERIALS[key]
  if (!materialItem) {
    return {
      ok: false,
      error: 'NOT_FOUND',
      message: '物资编码不正确',
      lines: ['物资编码不正确', '请重新扫描']
    }
  }
  return { ok: true, data: Object.assign({}, materialItem) }
}

export function validateTag(tagId, options) {
  const key = String(tagId || '').trim().toUpperCase()
  if (!key) {
    return { ok: false, error: 'EMPTY', message: '请先扫描电子标签' }
  }
  const tag = TAGS[key]
  if (!tag) {
    return { ok: false, error: 'NOT_FOUND', message: '电子标签不存在' }
  }
  if (tag.status === 'used') {
    return { ok: false, error: 'IN_USE', message: '当前标签已被使用' }
  }
  const rejectId = options && options.rejectTagId ? String(options.rejectTagId).trim().toUpperCase() : ''
  if (rejectId && key === rejectId) {
    return { ok: false, error: 'SAME_OLD', message: '不可绑定原标签' }
  }
  return { ok: true, data: Object.assign({}, tag) }
}

export function judgePhysicalTag(physicalTag, material) {
  const tag = String(physicalTag || '').trim().toUpperCase()
  if (!tag) {
    return { ok: false, error: 'EMPTY', message: '请扫描实物的电子标签' }
  }
  const systemTag = String((material && material.systemTag) || '').trim().toUpperCase()
  if (systemTag && tag === systemTag) {
    return { ok: true, reason: REASON.DAMAGED, label: REASON_LABEL.DAMAGED_SHORT }
  }
  return { ok: true, reason: REASON.MISBOUND, label: REASON_LABEL.MISBOUND }
}

export function buildDisposalLog(payload) {
  const data = payload || {}
  const now = new Date()
  const day = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  return {
    id: `LS${day}${String(logSeq++).padStart(4, '0')}`,
    materialCode: data.materialCode || '',
    category: data.category || '',
    reason: data.reason || '',
    reasonLabel: data.reasonLabel || '',
    oldTag: data.oldTag || '',
    newTag: data.newTag || '',
    erp: data.erp || '',
    siteCode: data.siteCode || '',
    siteName: data.siteName || '',
    boundAt: now.toISOString()
  }
}

export function bindTag(materialCode, tagId, options) {
  const materialResult = queryMaterial(materialCode)
  const rejectTagId = options && options.rejectTagId
  const tag = validateTag(tagId, { rejectTagId })
  if (!materialResult.ok) return materialResult
  if (!tag.ok) return tag
  return {
    ok: true,
    data: {
      materialCode,
      tagId: tag.data.id,
      boundAt: new Date().toISOString()
    }
  }
}

export const MOCK_MATERIAL_CODES = [
  { code: 'CSL22010533608938', hint: '扫后：损坏 / 脱落 / 绑错' },
  { code: 'WZUNREG001', hint: '扫后：电子标签未注册' },
  { code: 'WZLOW001', hint: '扫后：电量低于5%' },
  { code: 'WZDAM001', hint: '扫后：损坏 / 脱落 / 绑错' },
  { code: 'WZOK001', hint: '扫后：无异常，无需处置' },
  { code: 'WZNONE001', hint: '扫后：物资不存在' }
]

export const MOCK_TAG_CODES = [
  { code: 'TAG-NEW-001', hint: '扫后：可绑定' },
  { code: 'TAG-NEW-002', hint: '扫后：可绑定' },
  { code: 'TAG-USED-001', hint: '扫后：当前标签已被使用' },
  { code: 'ESL-0817-6352', hint: '扫后：不可绑定原标签' }
]

export const MOCK_PHYSICAL_CODES = [
  { code: 'ESL-0817-6352', hint: '扫后：核验结果为损坏' },
  { code: 'ESL-WRONG-001', hint: '扫后：核验结果为绑错' }
]
