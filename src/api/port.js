import request from "@/utils/request";

export function queryCommPortListPage(data) {
  return request({
    url: "/port/findCommPortListPage",
    method: "post",
    data
  });
}

export function queryCommPortList(data) {
  return request({
    url: `/productCategory/findCommPortList`,
    method: "post",
    data
  });
}

export function getCommPortDetail(id) {
  return request({
    url: `/port/getCommPortById?id=${id}`,
    method: "get"
  });
}

export function getCommPortCacheById(id) {
  return request({
    url: `/port/getCommPortCacheById?id=${id}`,
    method: "get"
  });
}

export function addCommPort(param) {
  return request({
    url: `/port/addCommPort`,
    method: "post",
    data: param
  });
}

export function updateCommPort(param) {
  return request({
    url: `/port/updateCommPort`,
    method: "post",
    data: param
  });
}

export function deleteCommPort(id) {
  return request({
    url: `/port/deleteCommPort?id=${id}`,
    method: "post"
  });
}
