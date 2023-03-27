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

const state = {
  token: getToken(),
  duty: userData && userData.duty,
  imUserId: userData && userData.imUserId,
  name: "",
  avatar: "",
  introduction: "",
  userDetail: "",
  permissions: "",
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
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_UserDetail: (state, userDetail) => {
    state.userDetail = userDetail;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password, offline } = userInfo;
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password })
  //       .then(response => {
  //         //localStorage.setItem('userData', JSON.stringify(response.data))
  //         // local.get('userData') ? local.remove('userData') : ''
  //         // local.set('userData', response.data)
  //         local.get("userData") ? local.remove("userData") : "";
  //         local.set("userData", response.data);

  //         const data = response.data;

  //         commit("SET_TOKEN", data.token);

  //         commit("SET_ROLES", [data.userCode]); // 增加角色的设置
  //         setToken(data.token);

  //         commit("premission/SET_ROUTES", asyncRoutes, { root: true });

  //         this.state.permission.routes = deepClone([
  //           ...constantRoutes,
  //           ...asyncRoutes
  //         ]);
  //         // const routes = deepClone([...constantRoutes, ...asyncRoutes])
  //         // router.addRoutes(asyncRoutes)
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });

  //   // commit('SET_TOKEN', '')
  //   // commit('SET_ROLES', 'admin') // 增加角色的设置
  //   // setToken('')
  // },
  login({ commit }, userInfo) {
    const username = userInfo.username.trim();
    const password = userInfo.password;
    const code = userInfo.code;
    const uuid = userInfo.uuid;
    return new Promise((resolve, reject) => {
      login(username, password, code, uuid)
        .then(res => {
          console.log("setToken", res);
          setToken(res.token);
          commit("SET_TOKEN", res.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token)
  //       .then(response => {
  //         const { data } = response;

  //         if (!data) {
  //           reject("Verification failed, please Login again.");
  //         }

  //         const { roles, name, avatar, introduction } = data;

  //         // roles must be a non-empty array
  //         if (!roles || roles.length <= 0) {
  //           reject("getInfo: roles must be a non-null array!");
  //         }

  //         commit("SET_ROLES", roles);
  //         commit("SET_NAME", name);
  //         commit("SET_AVATAR", avatar);
  //         commit("SET_INTRODUCTION", introduction);
  //         resolve(data);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },
  // 获取用户信息
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(res => {
          const user = res.data;
          const avatar = require("@/assets/image/defaultImg.png");
          //(user.avatar == "" || user.avatar == null) ? require("@/assets/images/defaultImg.png") : process.env.VUE_APP_BASE_API + user.avatar;
          /*  if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
           commit('SET_ROLES', res.roles)
           commit('SET_PERMISSIONS', res.permissions)
         } else {
           commit('SET_ROLES', ['ROLE_DEFAULT'])
         } */
          commit("SET_UserDetail", user);
          commit("SET_NAME", user.nickName);
          commit("SET_AVATAR", avatar);
          resolve(res);
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
          commit("SET_PERMISSIONS", []);
          removeToken();
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
