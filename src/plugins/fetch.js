import Vue from 'vue'

let pendingAjax = []
let removePendingAjax = function (url) {
  const index = pendingAjax.findIndex(i => i.url === url)
  if (index > -1) {
    pendingAjax[index].controller.abort()
    pendingAjax.splice(index, 1)
  }
}

Vue.prototype.$fetch = function (url) {
  let controller = new AbortController()
  let { signal } = controller
  removePendingAjax(url)
  pendingAjax.push({
    url,
    controller
  })
  return fetch(url, {
    signal
  })
  .then(function(response) {
    return response.json()
  })
}