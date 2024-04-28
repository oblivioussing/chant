import { ElMessageBox } from 'element-plus'
import vuei18n from './i18n'

const { t } = vuei18n.global

// 确认消息
export async function confirm(
  msg: string,
  options?: { confirm?: string; cancel?: string; title?: string }
) {
  try {
    const confirmButtonText = options?.confirm || t('button.confirm')
    const cancelButtonText = options?.cancel || t('button.cancel')
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
