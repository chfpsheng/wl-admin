<template>
  <div class="header-box">
    <div class="item-box left-box">
      <img
        data-v-37dfd6fc=""
        src="static/img/logo-huarun.f732efa8.png"
        alt=""
        class="logoImg"
        width="104px"
        height="36px"
      />
      <span class="header-title"> 物联网云平台 </span>
    </div>
    <div class="item-box right-box">
      <i
        v-if="duty === '4'"
        class="icon iconfont"
        :class="imOnline === 1 ? 'icon-on-line-icon1' : 'icon-off-line-icon1'"
        style="color: #fff"
      />
      <img src="../../../assets/image/touxiang.png" class="user-avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userName }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="onReset">
            <span style="display: block">账户设置</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="onLogout">
            <span style="display: block">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PaHeader",
  data() {
    return {
      userName: "",
      userData: "",
      interval: 60000,
      heartbeat: null,
    };
  },
  computed: {
    ...mapState({
      imOnline: (state) => parseInt(state.user.imOnline, 10),
      duty: (state) => state.user.duty,
      imUserId: (state) => state.user.imUserId,
    }),
  },
  watch: {},
  mounted() {
    this.userName = this.$local.get("userData").displayName;
    this.userData = this.$local.get("userData");

    if (this.imOnline && this.userData.duty === "4") {
      this.userData && this.userData.imUserId ? this.heartbeatFn() : "";
      this.heartbeat = setInterval(() => {
        this.userData && this.userData.imUserId ? this.heartbeatFn() : "";
      }, this.interval);
    }
  },
  destroyed() {
    clearInterval(this.heartbeat);
  },
  methods: {
    async heartbeatFn() {
      const result = await this.$requestPost(
        `/cloud-im/user/online?imUserId=${this.userData.imUserId}`,
        {}
      );
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    // 退出登录
    onLogout() {
      this.$confirm("确认退出当前账号吗？", "安全退出", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.logout();
          clearInterval(this.heartbeat);
        })
        .catch(() => {
          this.logout();
          clearInterval(this.heartbeat);
        });
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$message({
        message: "退出成功",
        type: "success",
      });
      setTimeout(() => {
        this.$router.push(`/login`);
      }, 1000);
    },
    // 账户设置
    onReset() {
      this.$router.push("/mine/reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.pa-logo {
  color: #fff !important;
}
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  padding: 0 16px;
  background: url("../../../assets/image/bg2.png") 0 0 / cover no-repeat;
}
.item-box {
  display: flex;
  align-items: center;
}
.header-title {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
.user-avatar {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.el-dropdown {
  font-size: 14px;
  color: #fff;
}
.el-icon--right {
  margin-left: 8px;
}
.el-dropdown-link {
  cursor: pointer;
}

.icon-off-line-icon,
.icon-on-line-icon {
  color: #fff;
}
</style>
