import request from "@/utils/request";
import store from "../store";
// 获取路由
export const getRouters = () => {
  // let tenantCode = store.state.user.userDetai.telnetCode;
  console.log(12222, store);
  return request({
    // url: `/account/getRouter?tenantCode=${"paltform"}&appCode=IOT`,
    url: "/account/getRouter?tenantCode=platform&appCode=IOT",
    method: "get"
  });
};
