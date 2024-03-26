import { createI18n } from 'vue-i18n'
import { LangEnum, StorageEnum } from '../enum'
import globalLang from '../lang/global'
import routerLang from '../lang/router'
import storage from '../utils/storage'

const lang = storage.getLocal(StorageEnum.Lang) as LangEnum
const en = { ...globalLang.en, router: { ...routerLang.en } }
const zh = { ...globalLang.zh, router: { ...routerLang.zh } }

export default createI18n({
  legacy: false,
  locale: lang || LangEnum.Zh,
  messages: { en, zh }
})
