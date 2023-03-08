import request from "@/utils/request";

export function login(data) {
  console.log("new");
  return request({
    url: "/vue-element-admin/user/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/vue-element-admin/user/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/vue-element-admin/user/logout",
    method: "post"
  });
}

export function getUser(params) {
  return request({
    url: "/vue-element-admin/sysRole/queryByUserId",
    method: "post",
    data: params
  });
}

// 修改密码
export function changePassWord(params) {
  return request({
    url: `/vue-element-admin/sysUser/changePassWord?oldPassword=${params.oldPassword}&newPassword=${params.newPassword}&userId=${params.userId}`,
    method: "post"
  });
}
