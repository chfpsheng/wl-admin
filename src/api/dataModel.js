import request from "@/utils/request";

export const dataModelApi = {
  queryDataModelList: data => {
    return request({
      url: "/dataModel/findProtocolList",
      method: "post",
      data
    });
  }
};
