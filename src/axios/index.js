// 蓝湖的话，暂时用这个账号打开：120563901@qq.com   cxcxx1205
// 手机端：http://www.shehua56.com/wap2.0/
// 账户：15888888888     密码:123456

import axios from 'axios' // 引入axios
// import {Toast} from 'mint-ui'
import qs from 'qs' // 引入qs
import router from '@/router'
import APIUrl from './api.url'

// axios 默认配置  更多配置查看Axios中文文档
axios.defaults.timeout = 50000 // 超时默认值
axios.defaults.baseURL = APIUrl.baseURL // 默认baseURL
axios.defaults.responseType = 'json' // 默认数据响应类型
// axios.defaults.headers.common["Content-Type"] ="application/json;charset=UTF-8";
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true // 表示跨域请求时是否需要使用凭证

const exps = ['/api/user/checkPhone.do', '/code/checkCode.do', '/api/site/getInfo.do', '/api/user/login.do', '/api/user/updatePwd.do', '/api/site/login.do', '/api/site/getInfo.do', '/api/sms/new/sendRegSms.do']
// http request 拦截器
// 在ajax发送之前拦截 比如对所有请求统一添加header token
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('wap-token')
    if (token === undefined || token === null) {
      let url = config.url
      let flag = false
      for (let item of exps) {
        if (item === url) {
          flag = true
          break
        }
      }
      if (!flag) {
        router.push('/openaccount')
      }
    } else {
      config.headers['token'] = token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// http response 拦截器
// ajax请求回调之前拦截 对请求返回的信息做统一处理 比如error为401无权限则跳转到登陆界面
axios.interceptors.response.use(
  (response) => {
    let data = response.data
    if (data instanceof Object) {
      if (data.status === 401) {
        const language = navigator.language.toLowerCase()
        console.log('response:', language)
        if (language.includes('cn')) {
          data.msg = '您还未登录,请先登录'
        } else if (language.includes('tw')) {
          data.msg = '您還未登錄，請先登錄'
        } else {
          data.msg = 'You haven\'t logged in yet, please log in first'
        }
        localStorage.clear()
        router.push('/openaccount')
      }
    }
    return response
  },
  (error) => {
    // Toast('服务异常，请联系管理员')
    localStorage.clear()
    return Promise.reject(error)
  }
)

export default axios // 这句千万不能漏下！！！

/**
 * post 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data = {}, out) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data)).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * get 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: data}).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * 其他delete等的封装类似
 * 可以查看中文文档 自行封装
 */
