import request from "@/utils/request";

export function queryTenantListPage(data) {
  return request({
    url: "/tenant/findTenantListPage",
    method: "post",
    data
  });
}
export function queryTenantList(id) {
  return request({
    url: `/tenant/findTenantList`,
    method: "post"
  });
}

export function getTenantDetail(id) {
  return request({
    url: `/tenant/getTenantById?id=${id}`,
    method: "get"
  });
}

export function addTenant(data) {
  return request({
    url: `/tenant/addTenant`,
    method: "post",
    data
  });
}

export function updateTenant(data) {
  return request({
    url: `/tenant/updateTenant`,
    method: "post",
    data
  });
}

export function deleteTenant(id) {
  return request({
    url: `/tenant/deleteTenant?id=${id}`,
    method: "post"
  });
}
