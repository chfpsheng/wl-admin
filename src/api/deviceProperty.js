import request from "@/utils/request";

export const dataModelApi = {
  queryDevicePropertyListPage: data => {
    return request({
      url: "/deviceProperty/findDevicePropertyListPage",
      method: "post",
      data
    });
  },
  queryDevicePropertyList: data => {
    return request({
      url: "/deviceProperty/findDevicePropertyList",
      method: "post",
      data
    });
  },
  addDeviceProperty: id => {
    return request({
      url: `/deviceProperty/getDevicePropertyById?id=${id}`,
      method: "get",
      data
    });
  },
  queryDevicePropertyListPage: data => {
    return request({
      url: "/deviceProperty/findDevicePropertyListPage",
      method: "post",
      data
    });
  }
};

export const devicePropertyApi = {
  queryDevicePropertyListPage: param => {
    return $http
      .post(
        `${window.RPConfig.baseURL}/deviceProperty/findDevicePropertyListPage`,
        param
      )
      .then(res => res && res.data);
  },
  queryDevicePropertyList: param => {
    return $http
      .post(
        `${window.RPConfig.baseURL}/deviceProperty/findDevicePropertyList`,
        param
      )
      .then(res => res && res.data);
  },
  getDevicePropertyDetail: id => {
    return $http
      .get(
        `${window.RPConfig.baseURL}/deviceProperty/getDevicePropertyById?id=${id}`
      )
      .then(res => res && res.data);
  },
  addDeviceProperty: param => {
    return $http
      .post(
        `${window.RPConfig.baseURL}/deviceProperty/addDeviceProperty`,
        param
      )
      .then(res => res && res.data);
  },
  updateDeviceProperty: param => {
    return $http
      .post(
        `${window.RPConfig.baseURL}/deviceProperty/updateDeviceProperty`,
        param
      )
      .then(res => res && res.data);
  },
  deleteDeviceProperty: id => {
    return $http
      .post(
        `${window.RPConfig.baseURL}/deviceProperty/deleteDeviceProperty?id=${id}`
      )
      .then(res => res && res.data);
  }
};
