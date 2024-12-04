import Vue from 'vue'
import App from './App'
import router from './router'
import Icon from 'vue-svg-icon/Icon.vue'
import Mint from 'mint-ui'
import store from './store/index'
import axios from './axios/index'
import ElementUI from 'element-ui'
import i18n from './i18n'
import VueClipboard from 'vue-clipboard2'
import state from './event'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mint-ui/lib/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import * as filters from '@/utils/utils'
import animated from 'animate.css'

import '../static/css/public2.css'

Vue.use(animated)
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(Mint)
Vue.component('icon', Icon)
Vue.config.productionTip = false
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$state = state
Vue.prototype.$setgoindex = function () {
  if (window.history.length <= 1) {
    if (location.href.indexOf('?') === -1) {
      window.location.href = location.href + '?goindex=true'
    } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
      window.location.href = location.href + '&goindex=true'
    }
  }
}
// 设置title
router.beforeEach((to, from, next) => {
  store.state.select = to.path
  const language = navigator.language.toLowerCase()
  if (language.includes('cn')) {
    document.title = to.meta.titleCn
  } else if (language.includes('tw')) {
    document.title = to.meta.titleTw
  } else {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  el: '#app',
  store,
  router,
  axios,
  i18n,
  render: h => h(App)
}).$mount('#app')
