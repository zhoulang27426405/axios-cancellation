import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'

let pendingAjax = []
const fastClickMsg = '数据请求中，请稍后'
const CancelToken = axios.CancelToken
const removePendingAjax = (url, type) => {
  const index = pendingAjax.findIndex(i => i.url === url)
  if (index > -1) {
    type === 'req' && pendingAjax[index].c(fastClickMsg)
    pendingAjax.splice(index, 1)
  }
}

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const url = config.url
    removePendingAjax(url, 'req')
    config.cancelToken = new CancelToken(c => {
      pendingAjax.push({
        url,
        c
      })
    })
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    removePendingAjax(response.config.url, 'resp')
    return new Promise((resolve, reject) => {
      if (+response.data.code !== 0) {
        reject(new Error('network error:' + response.data.msg))
      } else {
        resolve(response)
      }
    })
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Message.error(error)
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios
