import request from '@/utils/request'

export function getDiscountList(data) {
  return request({
    url: '/cloud-hmall/activity/query',
    method: 'post',
    data,
  })
}
export function searchProducts(name) {
  return request({
    url: `/cloud-hmall/product/search`,
    method: 'post',
    data: {
      name,
      pageNo: 1,
      pageSize: 300
    },
  })
}

export function getProductDiscount(productId) {
  return request({
    url: `/cloud-hmall/product/getDiscount?productId=${productId}`,
    method: 'post',
  })
}

export function getDiscountProducts(id) {
  return request({
    url: `/cloud-hmall/discount/query?activityId=${id}`,
    method: 'post',
  })
}
export function saveDiscountProducts(data) {
  return request({
    data,
    url: `/cloud-hmall/discount/save`,
    method: 'post',
    headers: {
      hideMessageCodes: [4020]
    }
  })
}


export function getDiscount(id) {
  return request({
    url: `/cloud-hmall/activity/get?id=${id}`,
    method: 'post',
  })
}

export function deleteDiscount(id) {
  return request({
    url: `/cloud-hmall/activity/delete?id=${id}`,
    method: 'post',
  })
}
export function finishDiscount(id) {
  return request({
    url: `/cloud-hmall/activity/finish?id=${id}`,
    method: 'post',
  })
}
export function insertDiscount(data) {
  return request({
    url: `/cloud-hmall/activity/insert`,
    method: 'post',
    data
  })
}

export function updateDiscount(data) {
  return request({
    data,
    url: `/cloud-hmall/activity/update`,
    method: 'post',
    headers: {
      hideMessageCodes: [4020]
    }
  })
}
