/*
 * @Author: your name
 * @Date: 2021-12-17 09:36:55
 * @LastEditTime: 2021-12-20 17:50:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\api\coupon.js
 */
import request from "@/utils/request";
// 优惠券列表
export function getProductTypeList(data) {
  return request({
    url: "/productCategory/getProductCategoryList",
    method: "post",
    data
  });
}

// 删除
export function deleteType(id) {
  return request({
    url: `/productCategory/deleteProductCategory?id=${id}`,
    data: {
      id: id
    },
    method: "post"
  });
}
// 新增
export function insertType(data) {
  return request({
    url: `/cloud-hmall/coupon/insert`,
    method: "post",
    data
  });
}

// 新增
export function addType(data) {
  return request({
    url: `/productCategory/addProductCategory`,
    method: "post",
    data
  });
}

// 更新
export function updateType(data) {
  return request({
    url: `/productCategory/updateProductCategory`,
    method: "post",
    data
  });
}
