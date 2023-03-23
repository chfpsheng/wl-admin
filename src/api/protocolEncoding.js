import request from "@/utils/request";

export function queryProtocolEncodingListPage(data) {
  return request({
    url: "/protocolencoding/findProtocolEncodingListPage",
    method: "post",
    data
  });
}

export function queryProtocolEncodingList(id) {
  return request({
    url: `/protocolencoding/getProtocolEncodingById?id=${id}`,
    method: "post"
  });
}

export function addProtocolEncoding(param) {
  return request({
    url: `/protocolencoding/addProtocolEncoding`,
    method: "post",
    data: param
  });
}

export function updateProtocolEncoding(param) {
  return request({
    url: `/protocolencoding/updateProtocolEncoding`,
    method: "post",
    data: param
  });
}

export function deleteProtocolEncoding(id) {
  return request({
    url: `/protocolencoding/deleteProtocolEncoding?id=${id}`,
    method: "post"
  });
}
