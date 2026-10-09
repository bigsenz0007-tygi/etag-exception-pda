function getScanSdk() {
  if (typeof window === 'undefined') return null
  const candidates = [window.JMESDK, window.jme, window.jd]
  for (let i = 0; i < candidates.length; i++) {
    const sdk = candidates[i]
    if (sdk && typeof sdk.scanCode === 'function') return sdk
  }
  return null
}

function readContent(res) {
  if (!res) return ''
  if (typeof res === 'string') return res.trim()
  return String((res.content || (res.result && res.result.content) || '')).trim()
}

export function nativeScan() {
  const sdk = getScanSdk()
  if (!sdk) return Promise.reject(new Error('NO_NATIVE_SCAN'))

  return new Promise((resolve, reject) => {
    let settled = false
    const done = (err, value) => {
      if (settled) return
      settled = true
      if (err) reject(err)
      else resolve(value)
    }

    try {
      const ret = sdk.scanCode({
        onlyCamera: false,
        scanType: ['barCode', 'qrCode'],
        success(res) {
          const content = readContent(res)
          if (content) done(null, content)
          else done(new Error('EMPTY'))
        },
        fail(err) {
          done(err || new Error('SCAN_FAIL'))
        }
      })
      if (ret && typeof ret.then === 'function') {
        ret
          .then((res) => {
            const content = readContent(res)
            if (content) done(null, content)
            else done(new Error('EMPTY'))
          })
          .catch((err) => done(err || new Error('SCAN_FAIL')))
      }
    } catch (err) {
      done(err)
    }
  })
}

export function isScanCanceled(err) {
  const msg = String((err && (err.errMsg || err.message)) || err || '')
  return /cancel|canceled|cancelled|取消|EMPTY/i.test(msg)
}
