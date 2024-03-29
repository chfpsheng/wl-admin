<template>
  <div :class="classObj" class="app-wrapper">
    <pa-header />
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Sidebar, TagsView, PaHeader } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import { ACTION } from "@/utils/trtcCustomMessageMap";

export default {
  name: "Layout",
  components: {
    PaHeader,
    AppMain,
    Navbar,
    // RightPanel,
    // Settings,
    Sidebar,
    TagsView,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      currentUserProfile: (state) => state.userIm.currentUserProfile,
      currentConversation: (state) => state.conversation.currentConversation,
      videoCall: (state) => state.conversation.videoCall,
      audioCall: (state) => state.conversation.audioCall,
      isLogin: (state) => state.userIm.isLogin,
      isSDKReady: (state) => state.userIm.isSDKReady,
      imOnline: (state) => parseInt(state.user.imOnline, 10),
      isBusy: (state) => state.video.isBusy,
      userID: (state) => state.user.imUserId,
      userSig: (state) => state.userIm.userSig,
      sdkAppID: (state) => state.userIm.sdkAppID,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: false,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  created() {
    const userData = this.$local.get("userData");
    // 线上运营管家才有im账号，需要登录
    if (userData.duty === "4") {
      //this.login();
    }
  },
  methods: {
    login() {
      getImUserSig().then((res) => {
        console.log("getImUserSig", res);
        this.tim
          .login({
            userID: this.userID,
            userSig: res.data,
          })
          .then(() => {
            this.$store.commit("updateLogin", true);
            this.$store.commit("startComputeCurrent");
            // this.$store.commit('showMessage', {
            //   type: 'success',
            //   message: 'IM登录成功'
            // })

            this.$store.commit({
              type: "GET_USER_INFO",
              userID: this.imUserId,
              userSig: res.data,
              sdkAppID: process.env.VUE_APP_SDKAPPID,
            });
            // this.$store.commit('showMessage', {
            //   type: 'success',
            //   message: '登录成功'
            // })
          })
          .catch((error) => {
            this.loading = false;
            this.$store.commit("showMessage", {
              message: "登录失败：" + error.message,
              type: "error",
            });
          });
      });
    },
    closePatientEdit(val) {
      this.editVisible = val;
    },
    onReceiveMessage({ data: messageList }) {
      this.handleVideoMessage(messageList);

      this.handleQuitGroupTip(messageList);

      this.handleCloseGroupLive(messageList);

      // 收到新消息之前要进行处理
      messageList.forEach((item) => {
        if (item.from === "administrator") {
          item.flow = "out";
        }
      });

      this.$store.commit("pushCurrentMessageList", messageList);
      this.$store.commit("pushAvChatRoomMessageList", messageList);
      //检查是否有type等于90的自定义消息，如果有，通知消息列表去刷新
      console.log("onReceiveMessage", item);
      let index = messageList.findIndex((item) => {
        return JSON.parse(item.payload.data).type === "90";
      });

      if (index > -1) {
        this.$bus.$emit("refreshConversationList");
      }
    },

    onError({ data }) {
      if (data.message !== "Network Error") {
        this.$store.commit("showMessage", {
          message: data.message,
          type: "error",
        });
      }
    },
    onMessageReadByPeer() {},
    onReadyStateUpdate({ name }) {
      const isSDKReady = name === this.TIM.EVENT.SDK_READY;
      this.$store.commit("toggleIsSDKReady", isSDKReady);

      if (isSDKReady) {
        this.tim
          .getMyProfile()
          .then(({ data }) => {
            this.$store.commit("updateCurrentUserProfile", data);
          })
          .catch((error) => {
            this.$store.commit("showMessage", {
              type: "error",
              message: error.message,
            });
          });
        this.$store.dispatch("getBlacklist");
        // 登录trtc calling
        this.trtcCalling.login({
          sdkAppID: this.sdkAppID,
          userID: this.userID,
          userSig: this.userSig,
        });
      }
    },
    kickedOutReason(type) {
      switch (type) {
        case this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return "由于多实例登录";
        case this.TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return "由于多设备登录";
        case this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return "由于 userSig 过期";
        default:
          return "";
      }
    },
    checkoutNetState(state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          return { message: "已接入网络", type: "success" };
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          return { message: "当前网络不稳定", type: "warning" };
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: "当前网络不可用", type: "error" };
        default:
          return "";
      }
    },
    onNetStateChange(event) {
      this.$store.commit(
        "showMessage",
        this.checkoutNetState(event.data.state)
      );
    },
    onKickOut(event) {
      this.$store.commit("showMessage", {
        message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: "error",
      });
      this.$store.commit("toggleIsLogin", false);
      this.$store.commit("reset");
      this.$router.push(`/login`);
    },
    onUpdateConversationList(event) {
      this.$store.commit("updateConversationList", event.data);
      this.$store.commit("updateConversationListFlag", true);
    },
    onUpdateGroupList(event) {
      this.$store.commit("updateGroupList", event.data);
    },
    onReceiveGroupSystemNotice(event) {
      const isKickedout = event.data.type === 4;
      const isCurrentConversation =
        `GROUP${event.data.message.payload.groupProfile.groupID}` ===
        this.currentConversation.conversationID;
      // 在当前会话被踢，需reset当前会话
      if (isKickedout && isCurrentConversation) {
        this.$store.commit("resetCurrentConversation");
      }
      Notification({
        title: "新系统通知",
        message: translateGroupSystemNotice(event.data.message),
        duration: 3000,
        onClick: () => {
          const SystemConversationID = "@TIM#SYSTEM";
          this.$store.dispatch("checkoutConversation", SystemConversationID);
        },
      });
    },

    selectConversation(conversationID) {
      if (conversationID !== this.currentConversation.conversationID) {
        this.$store.dispatch("checkoutConversation", conversationID);
      }
    },
    isJsonStr(str) {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    },
    handleVideoMessage(messageList) {
      const videoMessageList = messageList.filter(
        (message) =>
          message.type === this.TIM.TYPES.MSG_CUSTOM &&
          this.isJsonStr(message.payload.data)
      );
      if (videoMessageList.length === 0) return;
      const videoPayload = JSON.parse(videoMessageList[0].payload.data);
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
        if (this.isBusy) {
          this.$bus.$emit("busy", videoPayload, videoMessageList[0]);
          return;
        }
        this.$store.commit("GENERATE_VIDEO_ROOM", videoPayload.room_id);
        this.selectConversation(videoMessageList[0].conversationID); // 切换当前会话页
        if (videoMessageList[0].from !== this.userID) {
          this.$bus.$emit("isCalled");
        }
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
        this.$bus.$emit("missCall");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
        this.$bus.$emit("isRefused");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
        this.$bus.$emit("missCall");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
        this.$bus.$emit("isAccept");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
        this.$bus.$emit("isHungUp");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
        this.$bus.$emit("isRefused");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
        this.$bus.$emit("isRefused");
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe(message) {
      // 需检测浏览器支持和用户授权
      if (!("Notification" in window)) {
        return;
      } else if (window.Notification.permission === "granted") {
        this.handleNotify(message);
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission().then((permission) => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === "granted") {
            this.handleNotify(message);
          }
        });
      }
    },
    handleNotify(message) {
      const notification = new window.Notification("有人提到了你", {
        icon: "https://webim-1252463788.file.myqcloud.com/demo/img/logo.dc3be0d4.png",
        body: message.payload.text,
      });
      notification.onclick = () => {
        window.focus();
        this.$store.dispatch("checkoutConversation", message.conversationID);
        notification.close();
      };
    },
    handleLinkClick() {
      MTA.clickStat("link_two", { click: "true" });
    },
    /**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
    handleQuitGroupTip(messageList) {
      // 筛选出当前会话的退群/被踢群的 groupTip
      const groupTips = messageList.filter((message) => {
        return (
          this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_GRP_TIP &&
          (message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_QUIT ||
            message.payload.operationType ===
              this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
        );
      });
      // 清理当前会话的群成员列表
      if (groupTips.length > 0) {
        groupTips.forEach((groupTip) => {
          if (
            Array.isArray(groupTip.payload.userIDList) ||
            groupTip.payload.userIDList.length > 0
          ) {
            this.$store.commit(
              "deleteGroupMemberList",
              groupTip.payload.userIDList
            );
          }
        });
      }
    },
    /**
     * 收到结束直播自定义消息，派发事件关闭组件
     * @param {Message[]} messageList
     */
    handleCloseGroupLive(messageList) {
      messageList.forEach((message) => {
        if (
          this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_CUSTOM
        ) {
          let data = {};
          try {
            data = JSON.parse(message.payload.data);
          } catch (e) {
            data = {};
          }
          if (data.roomId && Number(data.roomStatus) === 0) {
            this.$bus.$emit("close-group-live");
          }
        }
      });
    },
    checkoutActive(name) {
      this.active = name;
    },
    handleClick(event) {
      switch (event.target.id) {
        case activeName.CONVERSATION_LIST:
          this.checkoutActive(activeName.CONVERSATION_LIST);
          break;
        case activeName.GROUP_LIST:
          this.checkoutActive(activeName.GROUP_LIST);
          break;
        case activeName.FRIEND_LIST:
          this.checkoutActive(activeName.FRIEND_LIST);
          break;
        case activeName.BLACK_LIST:
          this.checkoutActive(activeName.BLACK_LIST);
          break;
        case activeName.GROUP_LIVE:
          this.groupLive();
          break;
      }
    },
    handleRefresh() {
      switch (this.active) {
        case activeName.CONVERSATION_LIST:
          this.tim.getConversationList().catch((error) => {
            this.$store.commit("showMessage", {
              type: "error",
              message: error.message,
            });
          });
          break;
        case activeName.GROUP_LIST:
          this.getGroupList();
          break;
        case activeName.FRIEND_LIST:
          this.getFriendList();
          break;
        case activeName.BLACK_LIST:
          this.$store.dispatch("getBlacklist");
          break;
      }
    },
    getGroupList() {
      this.tim
        .getGroupList()
        .then(({ data: groupList }) => {
          this.$store.dispatch("updateGroupList", groupList);
        })
        .catch((error) => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        });
    },
    getFriendList() {
      this.tim
        .getFriendList()
        .then(({ data: friendList }) => {
          this.$store.commit("upadteFriendList", friendList);
        })
        .catch((error) => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        })
        .catch((error) => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        });
    },
    groupLive() {
      this.$store.commit("updateGroupLiveInfo", {
        groupID: 0,
        anchorID: this.userID,
      });
      this.$bus.$emit("open-group-live", { channel: 2 });
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.main-container,
.sidebar-container {
  padding-top: 48px;
  height: 100%;
  overflow: auto;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #edf1f7;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
