import request from "@/utils/request";
// 优惠券列表
export function queryProductListPage(data) {
  return request({
    url: "/product/findProductListPage",
    method: "post",
    data
  });
}

export function queryProductList(data) {
  return request({
    url: "/product/findProductList",
    method: "post",
    data
  });
}

export function getProductDetail(data) {
  return request({
    url: `/product/getProductById?id=${id}`,
    method: "get",
    data
  });
}

export function getProductCacheById(data) {
  return request({
    url: `/product/getProductCacheById?id=${id}`,
    method: "get"
  });
}

export function addProduct(data) {
  return request({
    url: "/product/addProduct",
    method: "post",
    data
  });
}

export function updateProduct(data) {
  return request({
    url: "/product/updateProduct",
    method: "post",
    data
  });
}

export function deleteProduct(id) {
  return request({
    url: `/product/deleteProduct?id=${id}`,
    method: "post"
  });
}
