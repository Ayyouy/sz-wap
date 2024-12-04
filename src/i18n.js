import Vue from 'vue'
import VueI18n from 'vue-i18n'
// element内置语言包
import ElementLocale from 'element-ui/lib/locale'
// element语言文件
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
// 自定义语言文件
import en from '../static/lang/en'
import zh from '../static/lang/zh'
import tw from '../static/lang/tw'

// 配置语言
const messages = {
  en: {
    ...enLocale, // element ui 英文包
    ...en // 自定义
  },
  zh: {
    ...zhLocale, // element ui 简体包
    ...zh // 自定义
  },
  tw: {
    ...twLocale, // element ui 繁体包
    ...tw // 自定义
  }
}

Vue.use(VueI18n)
const language = navigator.language.toLowerCase()
let currentLanguage = ''
if (language.includes('en')) {
  currentLanguage = 'en'
} else if (language.includes('cn')) {
  currentLanguage = 'zh'
} else if (language.includes('tw')) {
  currentLanguage = 'tw'
} else {
  currentLanguage = 'en'
}
const i18n = new VueI18n({
  locale: currentLanguage, // 如果lang不存在，则使用默认语言 en
  messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
