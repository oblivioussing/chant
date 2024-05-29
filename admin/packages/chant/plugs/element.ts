import { ElMessageBox, type MessageBoxState } from 'element-plus'
import { base } from '../utils'
import vuei18n from './i18n'

const { t: gt } = vuei18n.global

// 确认消息
export async function confirm(
  msg: string,
  options?: { confirm?: string; cancel?: string; title?: string }
) {
  try {
    const confirmButtonText = options?.confirm || gt('button.confirm')
    const cancelButtonText = options?.cancel || gt('button.cancel')
    const ret = await ElMessageBox.confirm(msg, options?.title, {
      confirmButtonText,
      cancelButtonText,
      type: 'warning'
    })
    return !!ret
  } catch (error) {
    return false
  }
}
// prompt
export async function prompt(
  callback: (instance: MessageBoxState, done: Function) => void,
  config?: {
    tips?: string
    title?: string
    confirmText?: string
    cancelText?: string
    inputPattern?: RegExp
    error?: string
    inputType?: 'textarea'
    required?: boolean
  }
) {
  let pattern = config?.inputPattern
  let error = config?.error
  if (config?.required) {
    pattern = /\S/
    error = error || base.i18nJoint([config?.title || '', gt('tips.required')])
  }
  try {
    ElMessageBox.prompt(config?.tips, config?.title, {
      confirmButtonText: config?.confirmText || gt('button.confirm'),
      cancelButtonText: config?.cancelText || gt('button.cancel'),
      inputPattern: pattern,
      inputErrorMessage: error,
      inputType: config?.inputType,
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          callback(instance, done)
        } else {
          done()
        }
      }
    })
  } catch (_) {
    return
  }
}
