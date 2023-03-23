import request from "@/utils/request";

export function queryCommControlList(data) {
  return request({
    url: "/control/findCommControlListPage",
    method: "post",
    data
  });
}
export function getCommControlDetail(id) {
  return request({
    url: `/control/getCommControlById?id=${id}`,
    method: "get"
  });
}

export function startServer(id) {
  return request({
    url: `/control/startServer?id=${id}`,
    method: "post"
  });
}

export function stopServer(id) {
  return request({
    url: `/control/stopServer?id=${id}`,
    method: "post"
  });
}
