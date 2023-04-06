import Vue from "vue";
import inputTrim from "v-input-trim";
Vue.use(inputTrim);
// import Cookies from 'js-cookie'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from "element-ui";
// import './styles/element-variables.scss'

import "@/styles/index.scss"; // global css
import "@/assets/css/index.scss"; // 新的全局样式
import "./assets/icon/iconfont.css";

import App from "./App";
import store from "./store";
import router from "./router";

import i18n from "./lang"; // internationalization
import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log
import request from "@/utils/request";

import * as filters from "./filters"; // global filters
import "./index.js";
import "./base.js";
import { downloadExcel } from "./api/load";
import dayjs from "dayjs";
import {
  MessageBox,
  Row,
  Col,
  Button,
  Input,
  Loading,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  CheckboxGroup,
  Divider,
  Popover
} from "element-ui";
import Avatar from "./components/avatar.vue";
// import Index from './index.vue'

// import TWebLive from 'tweblive'
import VueClipboards from "vue-clipboard2";
// import './assets/icon/iconfont-im.css'
// import './assets/icon/tim.css'
import "./assets/css/animate.css";
import progressive from "progressive-image/dist/vue";
import xss from "xss";
import pageModal from "./components/PageModal";
import sidelipPage from "./components/SidelipPage";
import ElTreeSelect from "el-tree-select";
Vue.use(ElTreeSelect);

//import'progressive-image/dist/index.css'
// import trtcCalling from './trtc-calling'
// import TRTCCalling from 'trtc-calling-js'
Vue.use(progressive, {
  removePreview: true,
  scale: true
});
Vue.use(xss);
Vue.prototype.downloadExcel = downloadExcel;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$xss = xss;
Vue.prototype.$pageModal = pageModal;
Vue.prototype.$sidelipPage = sidelipPage;
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// window.TRTCCalling = TRTCCalling
// window.trtcCalling = trtcCalling
window.store = store;
Vue.prototype.$bus = new Vue(); // event Bus 用于无关系组件间的通信。

// Vue.prototype.TWebLive = TWebLive
Vue.prototype.$store = store;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.trtcCalling = trtcCalling
// Vue.prototype.TRTCCalling = TRTCCalling
Vue.prototype.$request = request;
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(VueClipboards);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Divider);
Vue.use(Popover);
Vue.component("avatar", Avatar);

Vue.use(Element);
// Vue.use(Element, {
//   size: 'small'
// })
// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
