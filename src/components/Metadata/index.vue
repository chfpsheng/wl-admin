<template>
  <div class="header-box">
    <el-tabs v-model="activeName" class="el-tabs">
      <el-tab-pane label="属性定义" name="property">
        <news v-show="activeName === 'news'"></news>
        <span class="recipient" :class="{ exceed: disabled }" @click="handleAdd"
          >添加</span
        >
        <!-- <i  class="el-icon-circle-plus-outline "></i> -->
      </el-tab-pane>
      <el-tab-pane label="发送记录" name="record">
        <record v-if="activeName === 'record'"></record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PaHeader",
  props: {
    dlgVisible: {
      type: Boolean,
      default: false,
    },
    initData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: 1,
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
    this.userName = this.$local.get("userData")
      ? this.$local.get("userData").displayName
      : "";
    this.userData = this.$local.get("userData");
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
