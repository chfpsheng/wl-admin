import request from "@/utils/request";
// 优惠券列表
export function queryApplicationListPage(data) {
  return request({
    url: "/application/findApplicationListPage",
    method: "post",
    data
  });
}

export function queryApplicationList(data) {
  return request({
    url: "/application/findApplicationList",
    method: "post",
    data
  });
}

export function getApplicationDetail(data) {
  return request({
    url: `/application/getApplicationById?id=${id}`,
    method: "get",
    data
  });
}

export function addApplication(data) {
  return request({
    url: "/application/addApplication",
    method: "post",
    data
  });
}

export function updateApplication(data) {
  return request({
    url: "/application/updateApplication",
    method: "post",
    data
  });
}

export function deleteApplication(id) {
  return request({
    url: `/application/deleteApplication?id=${id}`,
    method: "post"
  });
}
