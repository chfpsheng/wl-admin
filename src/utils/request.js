/*
 * @Author: your name
 * @Date: 2021-10-28 15:58:43
 * @LastEditTime: 2021-10-29 10:28:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \management-system\src\utils\request.js
 */
import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
console.log('process.env.VUE_APP_BASE_API', process.env.VUE_APP_BASE_API)
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== 200) {
      const {
        hideMessageCodes
      } = response.config.headers
      if (!hideMessageCodes || !hideMessageCodes.includes(res.code)) { //如果头部不含hideMessageCodes，则直接调用后端的message提示，否则，接口调用的时候自行判断处理
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      if (res.code === 401) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'Error') // 错误结果返回
      //return new Error(res || 'Error')  //之前是为了处理message不需要取后端返回的情况，现在用hideMessageCodes处理
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || '网络请求超时',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
    //return new Error(res || 'Error')
  }
)

export default service
