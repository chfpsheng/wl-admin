import request from "@/utils/request";

export const commonBaseApi = {
  getCommCodeSelectVO: data => {
    return request({
      url: "/commonBase/getCommCodeSelectVO",
      method: "post",
      data
    });
  }
};
