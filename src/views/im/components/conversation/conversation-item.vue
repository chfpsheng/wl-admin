<template>
  <div
    class="conversation-item-container"
    :class="{
      choose:
        conversation.conversationID === currentConversation.conversationID,
    }"
    @click="selectConversation"
  >
    <!-- <div class="close-btn">
      <span class="tim-icon-close" title="删除会话" @click="deleteConversation" />
    </div> -->
    <div class="warp">
      <avatar 
        :src="conversation.patient
          ? (conversation.patient.headUrl ? conversation.patient.headUrl : 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png')
          : 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png'"
        :type="conversation.type"
      />
      <div class="content">
        <div class="row-1">
          <div class="name">
            <div class="text-ellipsis">
              <span
                v-if="conversation.type === TIM.TYPES.CONV_C2C"
                :title="conversation.patient ? conversation.patient.name : ''"
                >{{ conversation.patient ? conversation.patient.name : '' }}
              </span>
              <span
                v-else-if="conversation.type === TIM.TYPES.CONV_GROUP"
                :title="conversation.patient ? conversation.patient.name : ''"
                >{{ conversation.patient ? conversation.patient.name : '' }}
              </span>
              <span v-else-if="conversation.type === TIM.TYPES.CONV_SYSTEM"
                >系统通知
              </span>
            </div>
            <div class="star-tips" v-show="conversation.patient ? conversation.patient.intention > 0 : false">
              {{ conversation.patient ? conversation.patient.intention : 0 }} 星
            </div>
          </div>
          <div class="date">
            {{ date ? date : (conversation.assignTime ? conversation.assignTime.slice(11, 16) : '') }}
          </div>
        </div>
        <div class="row-2">
          <div class="summary">
            <div v-if="conversation.lastMessage" class="text-ellipsis">
              <span v-if="hasMessageAtMe" class="remind">{{
                messageAtMeText
              }}</span>
              <span
                class="text"
                :title="conversation.lastMessage.messageForShow"
              >
              
                {{ messageForShow }}
              </span>
            </div>
          </div>
          <div v-if="showUnreadCount" class="unread-count">
            <div class="badge">
              {{
                conversation.unreadCount > 99 ? "99+" : conversation.unreadCount
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isToday, getDate, getTime } from "@/utils/date";
export default {
  name: "ConversationItem",
  // props: ['conversation', 'activeName'],
  props: {
    conversation: {
      type: Object,
      default: () => ({}),
    },
    activeName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      popoverVisible: false,
      showMessageAtMe_text: "",
    };
  },
  computed: {
    hasMessageAtMe() {
      return (
        this.currentConversation.conversationID !==
          this.conversation.conversationID &&
        this.conversation.groupAtInfoList &&
        this.conversation.groupAtInfoList.length > 0
      );
    },
    messageAtMeText() {
      let text = "";
      if (this.conversation.groupAtInfoList.length > 0) {
        this.conversation.groupAtInfoList.forEach((item) => {
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ME) {
            text.indexOf("[@所有人]") !== -1
              ? (text = "[@所有人][有人@我]")
              : (text = "[有人@我]");
          }
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ALL) {
            text.indexOf("[有人@我]") !== -1
              ? (text = "[有人@我][@所有人]")
              : (text = "[@所有人]");
          }
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ALL_AT_ME) {
            text = "[@所有人][有人@我]";
          }
        });
      }
      return text;
    },
    showUnreadCount() {
      if (this.$store.getters.hidden) {
        return this.conversation.unreadCount > 0;
      }
      // 是否显示未读计数。当前会话和未读计数为0的会话，不显示。
      return (
        this.currentConversation.conversationID !==
          this.conversation.conversationID && this.conversation.unreadCount > 0
      );
    },
    date() {
      let date = ''
      if (!this.conversation.lastMessage || !this.conversation.lastMessage.lastTime) {
        if(this.conversation.assignTime) {
          date = new Date(this.conversation.assignTime);
        } else {
          return ''
        }
      } else {
        date = new Date(this.conversation.lastMessage.lastTime * 1000);
      }
      if (isToday(date)) {
        return getTime(date);
      }
      return getDate(date);
    },
    avatar: function () {
      switch (this.conversation.type) {
        case "GROUP":
          return this.conversation.groupProfile
            ? this.conversation.groupProfile.avatar
            : "";
        case "C2C":
          return this.conversation.userProfile
            ? this.conversation.userProfile.avatar
            : "";
        default:
          return "";
      }
    },
    conversationName: function () {
      if (this.conversation.type === this.TIM.TYPES.CONV_C2C) {
        return (
          this.conversation.userProfile.nick ||
          this.conversation.userProfile.userID
        );
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_GROUP) {
        return (
          this.conversation.groupProfile.name ||
          this.conversation.groupProfile.groupID
        );
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_SYSTEM) {
        return "系统通知";
      }
      return "";
    },
    showGrayBadge() {
      if (this.conversation.type !== this.TIM.TYPES.CONV_GROUP) {
        return false;
      }
      return (
        this.conversation.groupProfile.selfInfo.messageRemindType ===
        "AcceptNotNotify"
      );
    },
    messageForShow() {
      if (this.conversation.lastMessage.isRevoked) {
        if(this.activeName !== 'cur') {
          return ''
        }
        if (this.conversation.lastMessage.fromAccount === this.currentUserProfile.userID) {
          return "你撤回了一条消息";
        }
        if (this.conversation.type === this.TIM.TYPES.CONV_C2C) {
          return "对方撤回了一条消息";
        }
        return `${this.conversation.lastMessage.fromAccount}撤回了一条消息`;
      }
      if (this.conversation.lastMessage.messageForShow === "[自定义消息]") {
        if (this.conversation.lastMessage) {
          const data = JSON.parse(this.conversation.lastMessage.payload.data);
          console.log(111222, data.type)
          let msg = "";
          if (data.type === "2") {
            msg = "[图片]";
          } else if (data.type === "3") {
            msg = `[链接]${data.name}`;
          } else if (data.type === "4") {
            msg = `[服务套餐]${data.name}`;
          } else if (data.type === "5") {
            msg = `[订单]${data.name}`;
          } else if (data.type === "6") {
            msg = `[信息补充]`;
          } else if (data.type === "7") {
            msg = `[就诊提醒]`;
          } else if (data.type === "9") {
            msg = `[产检日程表]`;
          } else if (data.type === "10") {
            msg = `[预约提醒]`;
          } else if (data.type === "11") {
            msg = `[血糖监测]`;
          } else if (data.type === "12") {
            msg = `[体重监测]`;
          } else if (data.type === "13") {
            msg = `[报告]`;
          } else if (data.type === "14") {
            msg = `[报告]`;
          }
          return msg;
        }
      }
      if(this.conversation.lastMessage.type === 'TIMGroupTipElem') {
        return '';
      }
      return this.conversation.lastMessage.messageForShow;
    },
    ...mapState({
      currentConversation: (state) => state.conversation.currentConversation,
      currentUserProfile: (state) => state.userIm.currentUserProfile,
    }),
    ...mapGetters(["toAccount"]),
  },
  mounted() {},
  methods: {
    async selectConversation() {
      this.$store.state.selectedConversation.selectedConversationId = ''
      if (this.activeName === "cur") {
        const userData = this.$local.get("userData");
        const params = {
          imConversationId: this.conversation.conversationID,
          imKeeperId: userData.imUserId,
        };
        const result = await this.$requestPost(
          "/cloud-im/chatSession/beginForKeeper",
          params
        );
        
        // debugger
        if (result && result.code === 200) {
          if (
            this.conversation.conversationID !==
            this.currentConversation.conversationID
          ) {
            this.$store.dispatch(
              "checkoutConversation",
              this.conversation.conversationID
            );
          }
        } else if (result && result.code === 5007) {
          this.$message.error("当前患者已有管家正在对接");
        } else if (result && result.code === 5011) {
          this.$message.error("不能发起会话");
        }
      } else {
        if (
          this.conversation.conversationID !==
          this.currentConversation.conversationID
        ) {
          this.$store.dispatch(
            "checkoutConversation",
            this.conversation.conversationID
          );
        }
      }
      // this.$bus.$emit("patient", this.conversation.patient);
      this.$store.commit('updateDefaultPatient', this.conversation.patient)
      this.$bus.$emit("handleTime", this.conversation);
    },
    deleteConversation(event) {
      // 停止冒泡，避免和点击会话的事件冲突
      event.stopPropagation();
      this.tim
        .deleteConversation(this.conversation.conversationID)
        .then(() => {
          this.$store.commit("showMessage", {
            message: `会话【${this.conversationName}】删除成功!`,
            type: "success",
          });
          this.popoverVisible = false;
          this.$store.commit("resetCurrentConversation");
        })
        .catch((error) => {
          this.$store.commit("showMessage", {
            message: `会话【${this.conversationName}】删除失败!, error=${error.message}`,
            type: "error",
          });
          this.popoverVisible = false;
        });
    },
    showContextMenu() {
      this.popoverVisible = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.conversation-item-container {
  padding: 8px 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
  border-bottom: 1px solid #ebebeb;
  &:hover {
    background-color: $background;

    .close-btn {
      right: 3px;
    }
  }

  .close-btn {
    position: absolute;
    right: -20px;
    top: 3px;
    color: $font-dark;
    transition: all 0.2s ease;

    &:hover {
      color: $danger;
    }
  }

  .warp {
    display: flex;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    overflow: hidden;

    .row-1 {
      display: flex;
      line-height: 21px;

      .name {
        color: $font-light;
        flex: 1;
        min-width: 0px;
      }
    }

    .row-2 {
      display: flex;
      font-size: 12px;
      padding-top: 3px;
      align-items: center;

      .summary {
        flex: 1;
        overflow: hidden;
        min-width: 0px;
        color: $secondary;

        .remind {
          color: $danger;
        }
      }
    }
  }
}

.date {
  padding-left: 10px;
  flex-shrink: 0;
  text-align: right;
  color: #999;
  font-size: 12px;
}

.unread-count {
  padding-left: 10px;
  flex-shrink: 0;
  color: $font-dark;
  font-size: 12px;

  .badge {
    border-radius: 8px;
    color: #EF4F3C;
    border: 1px solid #EF4F3C;
    font-size: 12px;
    height: 16px;
    max-width: 40px;
    padding: 0 6px;
    display: flex;
    align-items: center;
  }
}

.context-menu-button {
  padding: 10px;
  border: 2px solid $primary;
  border-radius: 8px;
}

.name {
  display: flex;
  align-items: center;
  font-size: 16px;

  .text-ellipsis {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.star-tips {
  background: #FFB828;
  padding: 0 8px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-left: 8px;
  color: #fff;
}
</style>
