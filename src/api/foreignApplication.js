import request from "@/utils/request";
export function queryForeignApplicationListPage(data) {
  return request({
    url: "/foreign/findForeignApplicationListPage",
    method: "post",
    data
  });
}

export function queryForeignApplicationList(data) {
  return request({
    url: "/foreign/findForeignApplicationList",
    method: "post",
    data
  });
}

export function getForeignApplicationDetail(data) {
  return request({
    url: `/foreign/getForeignApplicationById?id=${id}`,
    method: "post",
    data
  });
}

export function getForeignApplicationCacheById(data) {
  return request({
    url: `/foreign/getForeignApplicationCacheById?id=${id}`,
    method: "post",
    data
  });
}

export function addForeignApplication(data) {
  return request({
    url: "/foreign/addForeignApplication",
    method: "post",
    data
  });
}

export function updateForeignApplication(data) {
  return request({
    url: "/foreign/addForeignApplication",
    method: "post",
    data
  });
}

export function deleteForeignApplication(data) {
  return request({
    url: `/foreign/deleteForeignApplication?id=${id}`,
    method: "post",
    data
  });
}
