import { createI18n } from 'vue-i18n'
import { LangEnum, StorageEnum } from '../enum'
import { global as globalLang } from '../lang'
import storage from '../utils/storage'

const lang = storage.getLocal(StorageEnum.Lang) as LangEnum
const en = { ...globalLang.en }
const zh = { ...globalLang.zh }

export default createI18n({
  legacy: false,
  locale: lang || LangEnum.Zh,
  messages: { en, zh }
})
