import request from "@/utils/request";
export const deviceApi = {
  queryDeviceListPage: data => {
    return request({
      url: "/device/findDeviceListPage",
      method: "post",
      data
    });
  },
  queryDeviceList: data => {
    return request({
      url: "/device/findDeviceList",
      method: "post",
      data
    });
  },
  getDeviceDetail: id => {
    return request({
      url: `/device/getDeviceById?id=${id}`,
      method: "get"
    });
  },
  addDevice: data => {
    return request({
      url: "/device/addDevice",
      method: "post",
      data
    });
  },
  updateDevice: data => {
    return request({
      url: "/device/updateDevice",
      method: "post",
      data
    });
  },
  refreshDeviceCache: data => {
    return request({
      url: `/device/refreshDeviceCache?id=${id}`,
      method: "get"
    });
  },
  getDeviceCache: uniqueDeviceIdentifier => {
    return request({
      url: `/device/getDeviceCache?uniqueDeviceIdentifier=${uniqueDeviceIdentifier}`,
      method: "get"
    });
  },
  deleteDevice: id => {
    return request({
      url: `/device/deleteDevice?id=${id}`,
      method: "post"
    });
  },

  upgradeDevice: (ids, firmwareId) => {
    return request({
      url: `/device/deleteDevice?ids=${ids}&firmwareId=${firmwareId}`,
      method: "post"
    });
  },
  getDevicePropertyByDeviceId: data => {
    return request({
      url: `/device/getDevicePropertyByDeviceId?id=${id}`,
      method: "get"
    });
  },
  getCommCodeSelect: data => {
    return request({
      url: "/device/getCommCodeSelect",
      method: "get",
      data
    });
  }
};
