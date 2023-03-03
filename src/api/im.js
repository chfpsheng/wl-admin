import request from '@/utils/request'

// 获取在线管家
export function getOnlineKeeper(data) {
  return request({
    url: '/cloud-user/sysUser/showOnLineManagers',
    method: 'post',
    data: data
  })
}

// 会话转接
export function chatSessionTransfer(data) {
  return request({
    url: '/cloud-im/chatSession/transfer',
    method: 'post',
    data: data
  })
}

// 会话转接
export function chatSessionEnd(data) {
  return request({
    url: '/cloud-im/chatSession/finish',
    method: 'post',
    data: data
  })
}

// 会话转接
export function chatSessionAssign(imKeeperId) {
  return request({
    url: '/cloud-im/chatSession/assign?imKeeperId=' + imKeeperId,
    method: 'post'
  })
}

// IM上线
export function ImOnlineMethod(imUserId) {
  return request({
    url: '/cloud-im/user/online?imUserId=' + imUserId,
    method: 'post'
  })
}

// IM下线
export function ImOffline(imUserId) {
  return request({
    url: '/cloud-im/user/offline?imUserId=' + imUserId,
    method: 'post'
  })
}

// 发送群消息
export function sendGroupMsg(data) {
  return request({
    url: '/cloud-im/message/sendGroupMsg',
    method: 'post',
    data: data
  })
}

/**
 *撤回消息
 *
 * @export
 * @param {*} data
 * @return {*} 
 */
export function revokeMsg(data) {
  return request({
    url: '/cloud-im/message/revoke',
    method: 'post',
    data: data
  })
}


/**
 *产生秘钥
 *
 * @export
 * @param {*} data
 * @return {*} 
 */
 export function getImUserSig(data) {
  return request({
    url: '/cloud-im/user/genSign',
    method: 'post',
    data: data
  })
}

export function beginForKeeper(data) {
  return request({
    url: '/cloud-im/chatSession/beginForKeeper',
    method: 'post',
    data: data,
    headers: {
      hideMessageCodes: [5007,5017]
    }
  })
}






