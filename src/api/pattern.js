import request from "@/utils/request";

export function queryCommPatternListPage(data) {
  return request({
    url: "/pattern/findCommPatternListPage",
    method: "post",
    data
  });
}

export function queryCommPatternList(data) {
  return request({
    url: `/pattern/findCommPatternList`,
    method: "post",
    data
  });
}

export function getCommPatternDetail(id) {
  return request({
    url: `/pattern/getCommPatternById?id=${id}`,
    method: "get"
  });
}

export function addCommPattern(param) {
  return request({
    url: `/pattern/addCommPattern`,
    method: "post",
    data: param
  });
}

export function updateCommPattern(param) {
  return request({
    url: `/pattern/updateCommPattern`,
    method: "post",
    data: param
  });
}

export function deleteCommPattern(id) {
  return request({
    url: `/pattern/deleteCommPattern?id=${id}`,
    method: "post"
  });
}
