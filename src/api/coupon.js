/*
 * @Author: your name
 * @Date: 2021-12-17 09:36:55
 * @LastEditTime: 2021-12-20 17:50:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\api\coupon.js
 */
import request from '@/utils/request'
// 优惠券列表
export function getCouponList(data) {
  return request({
    url: '/cloud-hmall/coupon/query',
    method: 'post',
    data,
  })
}

// 优惠券私发券列表
export function getPrivateCouponList(data) {
  return request({
    url: '/cloud-hmall/coupon/queryPrivateCoupon',
    method: 'post',
    data,
  })
}


// 商品列表查询
export function searchProducts(query) {
  return request({
    url: `/cloud-hmall/product/queryForMng`,
    method: 'post',
    data: {
      pageNo: 1,
      pageSize: 300,
      type: 1, 
      status: 1, 
      ...query
    },
  })
}

// 领取优惠券

export function collectCoupon(data) {
  return request({
    url: `/cloud-hmall/coupon/take`,
    method: 'post',
    data
  })
}


// 查看
export function getCoupon(id) {
  return request({
    url: `/cloud-hmall/coupon/get?id=${id}`,
    method: 'post',
  })
}
// 删除
export function deleteCoupon(id) {
  return request({
    url: `/cloud-hmall/coupon/delete?id=${id}`,
    method: 'post',
  })
}
// 新增
export function insertCoupon(data) {
  return request({
    url: `/cloud-hmall/coupon/insert`,
    method: 'post',
    data
  })
}
// 推送、发放、结束等更新操作
export function updateCoupon(data) {
  return request({
    data,
    url: `/cloud-hmall/coupon/update`,
    method: 'post',
    headers: {
      hideMessageCodes: [4020]
    }
  })
}
// 优惠券数据
export function getCouponData(data) {
  return request({
    url: `/cloud-hmall/coupon/getStats?id=${data.id}`,
    method: 'post'
  })
}

export function getCouponDataList(data) {
  return request({
    url: `/cloud-hmall/coupon/queryCouponUser`,
    method: 'post',
    data
  })
}