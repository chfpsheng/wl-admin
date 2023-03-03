import request from '@/utils/request'

export function getRefundList(data) {
  return request({
    url: '/cloud-hmall/refund/query',
    method: 'post',
    data
  })
}
export function getOrderUpdate(data) {
  return request({
    url: '/cloud-hmall/refund/updateAdv',
    method: 'post',
    data
  })
}
export function getOrderStatus(id) {
  return request({
    url: '/cloud-hmall/refund/result/query?id=' + id,
    method: 'post',
  })
}

