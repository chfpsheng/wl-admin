import request from "@/utils/request";

export function getValueSet(param) {
  let { vsCode } = param;
  const codeTypes = vsCode;
  return request({
    url: `/standardCodeList/combo?codeTypes=${codeTypes}`,
    method: "get"
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
}
