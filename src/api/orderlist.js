import request from '@/utils/request'

export function fetchOrderList(data) {
  return request({
    url: '/cloud-hmall/order/query',
    method: 'post',
    data
  })
}

export function orderExport(params) {
  return request({
    url: `/cloud-hmall/order/export${params}`,
    responseType: 'blob',
    method: 'get'
  })
}
export function orderUpdate(data) {
  return request({
    url: '/cloud-hmall/order/update',
    method: 'post',
    data
  })
}

// 获取科室列表
export function departmentQuery(data) {
  return request({
    url: '/department/query',
    method: 'post',
    data: data
  })
}

export function orderQuery(id) {
  return request({
    url: '/cloud-hmall/order/get?id=' + id,
    method: 'post'
  })
}
export function getOrderDetail(id) {
  return request({
    url: '/cloud-hmall/order/getNoMark?id=' + id,
    method: 'post'
  })
}
export function getOrderDetailWithMark(id) {
  return request({
    url: '/cloud-hmall/order/getWithMark?id=' + id,
    method: 'post'
  })
}

