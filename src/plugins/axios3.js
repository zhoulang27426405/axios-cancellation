import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'

let pendingAjax = []
const fastClickMsg = '数据请求中，请稍后'
const CancelToken = axios.CancelToken
const removePendingAjax = url => {
  const index = pendingAjax.findIndex(i => i.url == url)
  if (index > -1) {
    pendingAjax[index].c(fastClickMsg)
    pendingAjax.splice(index, 1)
  }
}

// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const arr = config.url.split('api/')
    const url = arr[arr.length - 1]
    removePendingAjax(url)
    config.cancelToken = new CancelToken(c => {
      pendingAjax.push({
        url,
        c
      })
    })
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return new Promise((resolve, reject) => {
      const code = +response.data.code
      if (code === 101) {
        const url = window.location.href
        reject(new Error('network error:' + response.data.msg))
        redirect(`//youpinoffice.zhuanzhuan.com/login?redirect=${url}`)
      } else if (code !== 0) {
        reject(new Error('network error:' + response.data.msg))
      } else {
        resolve(response)
      }
    })
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Message.error(error)
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios
