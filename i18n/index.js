import VueI18n from 'vue-i18n'
import Vue from 'vue'
// 导入语言资源文件
import zh_CN from './languages/zh_CN'
import zh_TW from './languages/zh_TW'
import en from './languages/en'
Vue.use(VueI18n)

export default new VueI18n({
  locale: 'zh_TW',
  fallbackLocale: 'zh_TW',
  messages: {
    zh_CN,
    zh_TW,
    en,
  },
})
