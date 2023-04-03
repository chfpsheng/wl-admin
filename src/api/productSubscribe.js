import request from "@/utils/request";
// 优惠券列表
export function queryProductSubscribeListPage(data) {
  return request({
    url: "/product/findProductSubscribeListPage",
    method: "post",
    data
  });
}

export function queryProductSubscribeList(data) {
  return request({
    url: "/product/findProductSubscribeList",
    method: "post",
    data
  });
}

export function getProductSubscribeDetail(data) {
  return request({
    url: `/product/getProductSubscribeById?id=${id}`,
    method: "get",
    data
  });
}

export function getProductSubscribeCacheById(data) {
  return request({
    url: `/product/getProductSubscribeCacheById?id=${id}`,
    method: "get"
  });
}

export function addProductSubscribe(data) {
  return request({
    url: "/product/addProductSubscribe",
    method: "post",
    data
  });
}

export function updateProductSubscribe(data) {
  return request({
    url: "/product/updateProductSubscribe",
    method: "post",
    data
  });
}

export function deleteProductSubscribe(id) {
  return request({
    url: `/product/deleteProductSubscribe?id=${id}`,
    method: "post"
  });
}
