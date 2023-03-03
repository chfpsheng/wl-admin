import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getAuthRoute, preRoleAuthList } from "@/utils";
import router, { asyncRoutes, constantRoutes, resetRouter } from "@/router";
const { deepClone } = require("../../utils");

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
const userData = JSON.parse(localStorage.getItem("userData"));
const imOnline = localStorage.getItem("imOnline")
  ? parseInt(localStorage.getItem("imOnline"), 10)
  : 1;
console.log("333333333", userData && userData.duty, imOnline);
const state = {
  token: getToken(),
  duty: userData && userData.duty,
  imUserId: userData && userData.imUserId,
  imOnline: imOnline,
  name: "",
  avatar: "",
  introduction: "",
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_DUTY: (state, duty) => {
    state.duty = duty;
  },
  SET_IMUSERID: (state, imUserId) => {
    state.imUserId = imUserId;
  },
  SET_IMONLINE: (state, imOnline) => {
    state.imOnline = imOnline;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, offline } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          //localStorage.setItem('userData', JSON.stringify(response.data))
          // local.get('userData') ? local.remove('userData') : ''
          // local.set('userData', response.data)
          local.get("userData") ? local.remove("userData") : "";
          local.set("userData", response.data);
          local.get("imOnline") ? local.remove("imOnline") : "";

          const data = response.data;

          commit("SET_TOKEN", data.token);

          commit("SET_DUTY", data.duty);
          commit("SET_IMUSERID", data.imUserId);
          commit("SET_IMONLINE", offline ? 0 : 1); //根据登录选择离线还是在线，存储对应的状态
          commit("SET_ROLES", [data.userCode]); // 增加角色的设置
          setToken(data.token);

          // const preAuthRoute = preRoleAuthList(data.funcData)
          // const authRoute = getAuthRoute(asyncRoutes, preAuthRoute, this._vm)
          // // asyncRoutes = this._vm.$lodash.cloneDeep(authRoute)
          commit("premission/SET_ROUTES", asyncRoutes, { root: true });
          // local.get('authRoute') ? local.remove('authRoute') : ''
          // local.set('authRoute', authRoute)
          // 设置IM相关的store数据
          // commit('toggleIsLogin', true)
          // commit('startComputeCurrent')
          // commit({
          //   type: 'GET_USER_INFO',
          //   userID: data.imUserId,
          //   userSig: window.genTestUserSig(this.imUserId).userSig,
          //   sdkAppID: window.genTestUserSig('').SDKAppID
          // })

          this.state.permission.routes = deepClone([
            ...constantRoutes,
            ...asyncRoutes
          ]);
          // const routes = deepClone([...constantRoutes, ...asyncRoutes])
          // router.addRoutes(asyncRoutes)
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });

    // commit('SET_TOKEN', '')
    // commit('SET_ROLES', 'admin') // 增加角色的设置
    // setToken('')
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { roles, name, avatar, introduction } = data;

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject("getInfo: roles must be a non-null array!");
          }

          commit("SET_ROLES", roles);
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          commit("SET_INTRODUCTION", introduction);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
