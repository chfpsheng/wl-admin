import request from "@/utils/request";
import { getAesString } from "@/utils/aesUtil";

export function login(username, password, code, uuid) {
  console.log("new");
  const data = {
    username,
    password,
    captcha: code,
    uuid
  };
  const aesString = getAesString(
    JSON.stringify(data),
    "hj7x89H$yuBI0456",
    "NIfb&95GUY86Gfgh"
  );
  console.log("aesString", aesString);
  const postData = { ciphertext: aesString };
  return request({
    url: "/qauth/account/login",
    method: "post",
    headers: {
      isToken: false
    },
    data: postData
  });
}

// export function getInfo(token) {
//   return request({
//     url: "/vue-element-admin/user/info",
//     method: "get",
//     params: { token }
//   });
// }

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/qauth/account/getLoginUser",
    method: "get"
  });
}

export function logout() {
  return request({
    url: "/logout",
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

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/qauth/captchaImage",
    headers: {
      isToken: false
    },
    method: "get",
    timeout: 20000
  });
}
