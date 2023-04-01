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
export function findMetadataPageList(data) {
  return request({
    url: "/metadata/findMetadataPageList",
    method: "post",
    data
  });
}

export function addMetadata(data) {
  return request({
    url: "/metadata/addOrUpdateMetadata",
    method: "post",
    data: data
  });
}

export function deleteMetadata(id) {
  return request({
    url: "/metadata/deleteObjectData?id=${id}",
    method: "post",
    data: data
  });
}
