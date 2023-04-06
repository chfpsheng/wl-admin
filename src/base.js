import Vue from "vue";
Vue.prototype.$bus = new Vue();
Vue.prototype.$systemCode = "600000";
// 缓存
const session = {
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  }
};
Vue.prototype.$session = session;
// 缓存
const local = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
Vue.prototype.$local = local;

// 收款模式
const receiveMoneyModes = [
  {
    value: 1,
    label: "医管集团"
  }
  // {
  //   value: 2,
  //   label: '罗湖医院'
  // },
  // {
  //   value: 3,
  //   label: '多方分账'
  // }
];
Vue.prototype.$receiveMoneyModes = receiveMoneyModes;

// 服务包状态
const servicePackStatus = [
  {
    value: 0,
    label: "已删除"
  },
  {
    value: 1,
    label: "销售中"
  },
  {
    value: 2,
    label: "仓库中"
  }
];
Vue.prototype.$servicePackStatus = servicePackStatus;

// 预览
const previewPath =
  process.env.VUE_APP_PREVIEW_BASE_API + "/#/service/detail?id=";
Vue.prototype.$previewPath = previewPath;

// 图片上传路径
const uploadUrl =
  process.env.VUE_APP_BASE_API + "/cloud-baseinfo/fileUploadInfo/fileUpload";
Vue.prototype.$uploadUrl = uploadUrl;

// 孕周期
const pregnantCycle = [
  {
    value: 0,
    label: "孕3周"
  },
  {
    value: 4,
    label: "孕4周"
  },
  {
    value: 5,
    label: "孕5周"
  },
  {
    value: 6,
    label: "孕6周"
  },
  {
    value: 7,
    label: "孕7周"
  },
  {
    value: 8,
    label: "孕8周"
  },
  {
    value: 9,
    label: "孕9周"
  },
  {
    value: 10,
    label: "孕10周"
  },
  {
    value: 11,
    label: "孕11周"
  },
  {
    value: 12,
    label: "孕12周"
  },
  {
    value: 13,
    label: "孕13周"
  },
  {
    value: 14,
    label: "孕14周"
  },
  {
    value: 15,
    label: "孕15周"
  },
  {
    value: 16,
    label: "孕16周"
  },
  {
    value: 17,
    label: "孕17周"
  },
  {
    value: 18,
    label: "孕18周"
  },
  {
    value: 19,
    label: "孕19周"
  },
  {
    value: 20,
    label: "孕20周"
  },
  {
    value: 21,
    label: "孕21周"
  },
  {
    value: 22,
    label: "孕22周"
  },
  {
    value: 23,
    label: "孕23周"
  },
  {
    value: 24,
    label: "孕24周"
  },
  {
    value: 25,
    label: "孕25周"
  },
  {
    value: 26,
    label: "孕26周"
  },
  {
    value: 27,
    label: "孕27周"
  },
  {
    value: 28,
    label: "孕28周"
  },
  {
    value: 29,
    label: "孕29周"
  },
  {
    value: 30,
    label: "孕30周"
  },
  {
    value: 31,
    label: "孕31周"
  },
  {
    value: 32,
    label: "孕32周"
  },
  {
    value: 33,
    label: "孕33周"
  },
  {
    value: 34,
    label: "孕34周"
  },
  {
    value: 35,
    label: "孕35周"
  },
  {
    value: 36,
    label: "孕36周"
  },
  {
    value: 37,
    label: "孕37周"
  },
  {
    value: 38,
    label: "孕38周"
  },
  {
    value: 39,
    label: "孕39周"
  },
  {
    value: 40,
    label: "孕40周"
  },
  {
    value: 9001,
    label: "产后"
  },
  {
    value: 9007,
    label: "产后7天"
  },
  {
    value: 9042,
    label: "产后42天"
  },
  {
    value: 9090,
    label: "产后3个月"
  }
];
Vue.prototype.$pregnantCycle = pregnantCycle;

// 知识库孕周
const gestationalWeeks = [
  {
    value: "3",
    label: "孕3周"
  },
  {
    value: "4",
    label: "孕4周"
  },
  {
    value: "5",
    label: "孕5周"
  },
  {
    value: "6",
    label: "孕6周"
  },
  {
    value: "7",
    label: "孕7周"
  },
  {
    value: "8",
    label: "孕8周"
  },
  {
    value: "9",
    label: "孕9周"
  },
  {
    value: "10",
    label: "孕10周"
  },
  {
    value: "11",
    label: "孕11周"
  },
  {
    value: "12",
    label: "孕12周"
  },
  {
    value: "13",
    label: "孕13周"
  },
  {
    value: "14",
    label: "孕14周"
  },
  {
    value: "15",
    label: "孕15周"
  },
  {
    value: "16",
    label: "孕16周"
  },
  {
    value: "17",
    label: "孕17周"
  },
  {
    value: "18",
    label: "孕18周"
  },
  {
    value: "19",
    label: "孕19周"
  },
  {
    value: "20",
    label: "孕20周"
  },
  {
    value: "21",
    label: "孕21周"
  },
  {
    value: "22",
    label: "孕22周"
  },
  {
    value: "23",
    label: "孕23周"
  },
  {
    value: "24",
    label: "孕24周"
  },
  {
    value: "25",
    label: "孕25周"
  },
  {
    value: "26",
    label: "孕26周"
  },
  {
    value: "27",
    label: "孕27周"
  },
  {
    value: "28",
    label: "孕28周"
  },
  {
    value: "29",
    label: "孕29周"
  },
  {
    value: "30",
    label: "孕30周"
  },
  {
    value: "31",
    label: "孕31周"
  },
  {
    value: "32",
    label: "孕32周"
  },
  {
    value: "33",
    label: "孕33周"
  },
  {
    value: "34",
    label: "孕34周"
  },
  {
    value: "35",
    label: "孕35周"
  },
  {
    value: "36",
    label: "孕36周"
  },
  {
    value: "37",
    label: "孕37周"
  },
  {
    value: "38",
    label: "孕38周"
  },
  {
    value: "39",
    label: "孕39周"
  },
  {
    value: "40",
    label: "孕40周"
  },
  {
    value: "9001",
    label: "产后"
  }
];
Vue.prototype.$gestationalWeeks = gestationalWeeks;
// base64转化
export function decryptBase64(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
Vue.prototype.$decryptBase64 = decryptBase64;
