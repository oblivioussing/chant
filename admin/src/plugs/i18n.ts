import { createI18n } from 'vue-i18n'
import { LangEnum, StorageEnum } from '../enum'
import messages from '../lang/global'
import storage from '../utils/storage'

const lang = storage.getLocal(StorageEnum.Lang) as LangEnum

export default createI18n({
  legacy: false,
  locale: lang || LangEnum.Zh,
  messages
})
