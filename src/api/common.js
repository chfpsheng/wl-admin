import request from "@/utils/request";

export function computeHeight(Num) {
  const bodyHeight = document.body.clientHeight;
  const tableHeight = bodyHeight - Num;
  return tableHeight;
}

// 优惠券列表
export function getValueSet(param) {
  let { vsCode } = param;
  const codeTypes = vsCode;
  return request({
    url: "/cloud-hmall/coupon/query",
    method: "post",
    codeTypes: codeTypes
  }).then(res => {
    if (res && res.data) {
      const tempData = res.data.data;
      let newData = new Array();
      for (let key in tempData) {
        let codeList = tempData[key];
        if (codeList && codeList.length) {
          codeList.map(child => {
            let { name, value } = child;
            newData.push({ vsCode: key, vsiValue: name, vsiKey: value });
          });
        }
      }
      return { ...res.data, data: newData };
    }
  });
  return request({
    url: "/cloud-hmall/coupon/query",
    method: "post",
    data
  });
}
