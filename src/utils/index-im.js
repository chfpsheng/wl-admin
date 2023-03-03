
export function throttle(func, wait) {
  let timeout
  return function() {
    const that = this
    const args = arguments

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(that, args)
      }, wait)
    }
  }
}

/**
 * 利用 document.title 做新消息提示
 * @export
 * @param {Number} count
 */
export function titleNotify(count) {
  const hasNewMessage = count > 0
  if (hasNewMessage) {
    if (document.title.search(/\((.*?)\)/) >= 0) {
      document.title = document.title.replace(/\((.*?)\)/, `(${count > 99 ? '99+' : count})`)
    } else {
      document.title = `(${count})${document.title}`
    }
  } else {
    document.title = document.title.replace(/\((.*?)\)/, '')
  }
}

// 发送消息方法-发送后端服务器
export function saveMessage(form, vm) {
  console.log('saveMessage', vm, process.env.VUE_APP_BASE_API)
  const url = '/cloud-im/message/insert'
  form.lastSendTime = getLastSenderMessageFromKeeper(vm)
  //改成连续发送三次，
  vm.$request({
    url: url,
    method: 'post',
    data: form
  }).catch()
}

// 获取管家端会话中最后一次发送消息的时间
export function getLastSenderMessageFromKeeper(vm) {
  let lastTime = 0
  //console.log('getLastSenderMessageFromKeeper', vm.$store.state.conversation.currentMessageList)
  const tempArr = vm.$lodash.cloneDeep(vm.$store.state.conversation.currentMessageList)
  tempArr.forEach(item => {
    console.log('getLastSenderMessageFromKeeper', item)
    // 只查管家端的消息
    if (item.flow === 'out') {
      lastTime = item.time
    }
    //console.log('getLastSenderMessageFromKeeper2222', lastTime)
  })
  //console.log('Last getLastSenderMessageFromKeeper', lastTime)
  return lastTime
}
