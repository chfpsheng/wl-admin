<template>
  <div class="current-conversation-cnt">
    <div class="current-conversation-wrapper">
      <div
        v-if="showCurrentConversation"
        class="current-conversation"
        @scroll="onScroll"
      >
        <div class="header">
          <!-- <div class="name">
            {{ name }} <div class="dot" /> <span class="admin">机器</span>
          </div> -->
          <i />
          <div class="time">
            {{ activeName === "cur" ? headerText : "聊天记录" }}
          </div>
          <i />
          <!-- <div
            v-show="!currentConversation.conversationID.includes('SYSTEM')"
            class="btn-more-info"
            :class="showConversationProfile ? '' : 'left-arrow'"
            title="查看详细信息"
            @click="showMore"
          />
          <div class="right" /> -->
        </div>
        <div class="content">
          <div class="conversation--tips" v-show="sendImgNum > 0">
            图片上传中
          </div>
          <div ref="message-list" class="message-list" @scroll="onScroll">
            <div v-if="!isCompleted" class="more">
              <el-button
                type="text"
                @click="
                  $store.dispatch(
                    'getMessageList',
                    currentConversation.conversationID
                  )
                "
                >查看更多</el-button
              >
            </div>
            <div v-else class="no-more">没有更多了</div>
            <el-checkbox-group v-if="selectMessage" v-model="checkList">
              <el-checkbox
                v-for="message in currentMessageList"
                :key="message.ID"
                :label="message.ID"
                :disabled="message.status === 'fail'"
              >
                <message-item :message="message" @showPreview="showPreview" />
              </el-checkbox>
            </el-checkbox-group>
            <message-item
              v-for="message in currentMessageList"
              v-else
              :key="message.ID"
              :message="message"
              @showPreview="showPreview"
              @showOrderList="showOrderList"
            />
          </div>
          <div
            v-show="isShowScrollButtomTips"
            class="newMessageTips"
            @click="scrollMessageListToButtom"
          >
            回到最新位置
          </div>
        </div>
        <div v-if="showMessageSendBox" class="footer">
          <div v-if="activeName === 'history'" class="footer--box">
            <span style="color: #06c" v-if="userData.duty !== '4'"
              >您不是线上专属管家，无法发起会话</span
            >
            <el-button
              v-if="userData.duty === '4'"
              type="primary"
              class="pa-btn"
              @click="startConversation"
            >
              发起会话
            </el-button>
          </div>
          <!-- <div v-if="selectMessage" class="merger-btn">
            <div class="relay-btn" @click="singleRelay">
              <img class="relay-icon" src="../../assets/image/sig-relay.png" />
              <span class="relay-title">逐条转发</span>
            </div>
            <div class="relay-btn" @click="mergerRelay">
              <img
                class="relay-icon"
                src="../../assets/image/merger-relay.png"
              />
              <span class="relay-title">合并转发</span>
            </div>
            <div class="relay-btn" @click="closeSelectMessage">
              <img
                class="relay-icon"
                src="@/assets/image/close-relay.png"
              />
              <span class="relay-title">取消</span>
            </div>
          </div> -->
          <message-send-box
            ref="messageSendBox"
            :message-type="messageType"
            @sendCustomMessage="transferCustomMessage"
            @sendImgNumChange="sendImgNumChange"
          />
        </div>
      </div>
      <div>
        <message-relay v-if="isShowConversationList" />
      </div>
      <!-- <div v-if="showConversationProfile" class="profile">
        <conversation-profile />
      </div> -->
      <!-- 群成员资料组件 -->
      <!-- <member-profile-card /> -->
      <el-popover
        ref="dropdown"
        v-model="mergerMessagePop"
        placement="left-start"
        width="700"
      >
        <div class="pop-header">
          <img
            v-if="mergerMessageList.length > 1"
            src="@/assets/image/back.png"
            class="pop-back"
            @click="mergerMessageBack"
          />
          <span class="title">{{ mergerTitle }}</span>
          <img
            src="@/assets/image/close.png"
            class="pop-close"
            @click="closeMessagePop"
          />
        </div>
        <transition
          name="custom-classes-transition"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <message-merger v-if="mergerMessagePop" />
        </transition>
      </el-popover>
    </div>
    <div style="height: 100%">
      <div
        style="width: 100%; height: 48px; background: #fff; border-bottom: 1px solid #ebebeb;"
      >
        <div
          class="toolbar"
          v-if="showCurrentConversation && activeName === 'cur'"
        >
          <el-button
            class="pa-btn el-button--primary-text"
            type="primary"
            size="mini"
            icon="icon iconfont icon-icon-Transfer"
            @click="switchUser()"
          >
            转接
          </el-button>
          <el-button
            class="pa-btn el-button--primary-text"
            type="primary"
            size="mini"
            icon="icon iconfont icon-s_jieshu"
            @click="endUser()"
          >
            结束
          </el-button>
        </div>
      </div>

      <div
        style="width: 100%; height: calc(100% - 48px)"
        v-if="showCurrentConversation"
      >
        <im-drawer
          @sendCustomMessage="transferCustomMessage"
          @showOrderList="showOrderList"
        />
      </div>
    </div>
    <div class="right-panel">
      <online-keeper
        v-if="dlgVisible"
        :dlg-visible="dlgVisible"
        :init-data="initKeeperData"
        @closeDlg="closeDlg"
        @getSwitchUser="getSwitchUser"
      />
    </div>
    <orderlist-view
      v-if="detailVisible"
      :detail-visible="detailVisible"
      :detail-info="detailInfo"
      @close="closeOrderListView"
    />
    <pa-Iframe
      v-if="previewVisbile"
      :visible.sync="previewVisbile"
      :detail="detail"
      :spec-list="specList"
    />
    <div v-if="!showCurrentConversation" class="null-data">
      <img src="@/assets/image/null-data.png" style="width: 210px" />
      <div class="null-data-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import MessageSendBox from "../message/message-send-box";
import MessageItem from "../message/message-item";
// import ConversationProfile from "./conversation-profile.vue";
// import MemberProfileCard from "../group/member-profile-card";
// import MessageMerger from "@/message/merger-message/message-merger";
// import MessageRelay from "../message/merger-message/message-relay";
import close from "@/assets/image/close.png";
import ImDrawer from "@/views/ImDrawer/index";
import { saveMessage } from "@/utils/index-im";
import {
  getOnlineKeeper,
  chatSessionTransfer,
  chatSessionEnd,
  sendGroupMsg,
  beginForKeeper
} from "@/api/im";
import OnlineKeeper from "../OnlineKeeper/index.vue";
import OrderlistView from "@/views/orderlist/orderlist-view.vue";
import { getOrderDetailWithMark } from "@/api/orderlist";
import { getPatientById, wxMsgSend, wxMsgSendHealthy } from "@/api/patient";
export default {
  name: "CurrentConversation",
  components: {
    ImDrawer,
    MessageSendBox,
    MessageItem,
    // ConversationProfile,
    // MemberProfileCard,
    // MessageMerger,
    OnlineKeeper,
    // MessageRelay,
    OrderlistView
  },
  data() {
    return {
      previewVisbile: false,
      detail: {
        posterImgs: ""
      },
      specList: [],
      detailVisible: false, // 显示订单详情
      detailInfo: {}, // 订单详情
      messageType: "", // 存储不同的消息类型
      close: close,
      isShowScrollButtomTips: false,
      preScrollHeight: 0,
      showConversationProfile: false,
      timeout: "",
      checkList: [],
      // selectMessage: false,
      selectedMessageList: [],
      mergerMessagePop: false,
      mergerMessage: null,
      positionX: 0,
      positionY: 0,
      dlgVisible: false,
      initKeeperData: [],
      // activeName: 'cur',
      headerText: "",
      headerTime: null,
      userData: "",
      sendImgNum: 0,
    };
  },
  computed: {
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
      duty: state => state.user.duty,
      imUserId: state => state.user.imUserId, // 登陆者的im ID
      currentUnreadCount: state =>
        state.conversation.currentConversation.unreadCount,
      currentMessageList1: state => state.conversation.currentMessageList,
      isCompleted: state => state.conversation.isCompleted,
      mergerMessageList: state => state.conversation.mergerMessageList,
      isShowConversationList: state => state.conversation.isShowConversationList,
      selectMessage: state => state.conversation.selectMessage,
      isSDKReady: state => state.userIm.isSDKReady,
      activeName: (state) => state.tabsName.activeName,
      defaultPatient: (state) => state.defaultPatient.patient, //患者信息
    }),
    // 会话列表去重
    currentMessageList() {
      let newList = [];
      let idList = [];
      console.log('this.currentMessageList1', this.currentMessageList1)
      this.currentMessageList1.forEach(item => {
        if (item.id && idList.indexOf(item.id) < 0) {
          newList.push(item);
          idList.push(item.id);
        } else if (item.ID && idList.indexOf(item.ID) < 0) {
          newList.push(item);
          idList.push(item.ID);
        }
      });

      return newList;
    },
    ...mapGetters(["toAccount", "hidden", "currentConversationType"]),
    // 是否显示当前会话组件
    showCurrentConversation() {
      return !!this.currentConversation.conversationID;
    },
    name() {
      if (this.currentConversation.type === "C2C") {
        let name = this.currentConversation.userProfile.nick || this.toAccount;
        const list = this.currentMessageList;
        const len = list.length;
        for (let i = len - 1; i >= 0; i--) {
          // C2C 会话对端更新nick时需要更新会话title
          if (list[i].flow === "in" && list[i].nick && name !== list[i].nick) {
            name = list[i].nick;
            break;
          }
        }
        return name;
      } else if (this.currentConversation.type === "GROUP") {
        // if (this.isRegisterFinished()) {
        //   return this.currentConversation.patient.name || this.currentConversation.groupProfile.name || this.toAccount
        // } else {
        //   return this.currentConversation.patient.name || this.currentConversation.groupProfile.name || this.toAccount
        // }
        return (
          this.currentConversation.patient.name ||
          this.currentConversation.groupProfile.name ||
          this.toAccount
        );
      } else if (this.currentConversation.conversationID === "@TIM#SYSTEM") {
        return "系统通知";
      }
      return this.toAccount;
    },
    showMessageSendBox() {
      return this.currentConversation.type !== this.TIM.TYPES.CONV_SYSTEM;
    },
    mergerTitle() {
      if (this.mergerMessage) {
        return this.mergerMessage.payload.title || "聊天记录";
      } else {
        return "聊天记录";
      }
    }
  },
  watch: {
    currentUnreadCount(next) {
      if (!this.hidden && next > 0 && this.isSDKReady) {
        this.tim.setMessageRead({
          conversationID: this.currentConversation.conversationID
        });
      }
    },
    hidden(next) {
      if (!next && this.currentUnreadCount > 0 && this.isSDKReady) {
        this.tim.setMessageRead({
          conversationID: this.currentConversation.conversationID
        });
      }
    },
  },
  mounted() {
    this.userData = this.$local.get("userData");
    /* this.$bus.$on('currentActiveName', (e) => {

      this.activeName = e
    }) */
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.addEventListener("mousedown", this.move);
    }
    this.$bus.$on("image-loaded", this.onImageLoaded);
    this.$bus.$on("scroll-bottom", this.scrollMessageListToButtom);
    this.$bus.$on("mergerSelected", this.mergerSelectedHandler);
    this.$bus.$on("mergerMessageShow", this.mergerShow);
    this.$bus.$on("handleTime", this.timeFn);
    if (this.currentConversation.conversationID === "@TIM#SYSTEM") {
      return false;
    }
  },
  beforeDestroy() {
    // this.$bus.$off('currentActiveName')
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.removeEventListener("mousedown", this.move);
    }
  },
  updated() {
    this.keepMessageListOnButtom();
    // 1. 系统会话隐藏右侧资料组件
    // 2. 没有当前会话时，隐藏右侧资料组件。
    //    背景：退出群组/删除会话时，会出现一处空白区域
    if (
      this.currentConversation.conversationID === "@TIM#SYSTEM" ||
      typeof this.currentConversation.conversationID === "undefined"
    ) {
      this.showConversationProfile = false;
    }
  },
  methods: {
    sendImgNumChange(val) {
      console.log('监听图片上传数', val)
      this.sendImgNum = val
    },
    async showPreview(data) {
      if (!data.product) {
        const result = await this.$requestPost(
          `/cloud-hmall/product/get?id=${data.id}`,
          {}
        );

        this.preview(result.data);
        this.previewVisbile = true;
      } else {
        this.preview(data);
        this.previewVisbile = true;
      }
    },
    preview(row) {
      this.detail = this.$lodash.cloneDeep(row);

      this.detail = Object.assign(this.detail, this.detail.product);
      this.specList = this.detail.specList || [];
      if (this.specList.length > 0) {
        // 默认选中第一个
        this.currentSpec = this.specList[0];
        this.detail.currentPrice = this.currentSpec.currentPrice;
        this.detail.originalPrice = this.currentSpec.originalPrice;
        this.detail.productSpecName = this.currentSpec.specName;
        this.detail.productSpecId = this.currentSpec.id;
        // 规格列表中售价最小的项
        const min = this.specList.reduce(function(prev, current) {
          return prev.currentPrice > current.currentPrice ? current : prev;
        });
        // 最小售价
        this.detail.minCurrentPrice = min.currentPrice;
        // 最小售价的原价
        this.detail.minOriginalPrice = Math.min.apply(
          Math,
          this.specList.map(o => o.originalPrice)
        );
        // 最达售价
        this.detail.maxCurrentPrice = Math.max.apply(
          Math,
          this.specList.map(o => o.currentPrice)
        );
      }
      if (Array.isArray(row.posterImgs)) {
        this.detail.posterImgs = row.product.posterImgs || [];
      } else {
        this.detail.posterImgs = row.product.posterImgs
          ? row.product.posterImgs.split(",")
          : [];
      }
    },
    closeOrderListView() {
      this.detailVisible = false;
    },
    // 用户信息是否补充完整
    async isRegisterFinished(type) {
      const vm = this;
      let messageObj = {};

      const patient = this.currentConversation.patient;
      let finished = false;
      //需要重新去获取患者信息
      const res = await this.$requestPost(
        `/cloud-baseinfo/patient/get?id=${patient.id}`,
        {}
      );

      finished =
        res.data.idCard !== "" &&
        res.data.mobile !== "" &&
        res.data.name !== "";
      if (finished) {
        this.$message({
          message: "患者信息已补全，无需发送",
          type: "error",
          duration: 5000
        });
        return;
      }
      // 商品

      messageObj = {
        type: type,
        name: "信息补充" //增加字段供离线通知使用
      };
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: JSON.stringify(messageObj),
          description: "",
          extension: "custom"
        }
      });
      this.$store.commit("pushCurrentMessageList", message);

      this.tim
        .sendMessage(message)
        .then(result => {
          // 调用自己服务
          // 对象深拷贝
          const form = JSON.parse(JSON.stringify(result.data.message));
          form.payload = JSON.stringify(form.payload);
          form.senderRole = vm.duty;
          saveMessage(form, vm);
        })
        .catch(error => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message
          });
        });
      // getPa tientById(patient.id).then((res=>{
      //   let patient = res.data
      //   finished = (patient.idCard !== '' && patient.mobile !== '' && patient.name !== '')
      // }))
    },
    showOrderList(data) {
      // 显示订单详情抽屉
      // 根据订单id查询订单详情
      getOrderDetailWithMark(data.id ? data.id : data.order.id).then(res => {
        console.log(res);
        this.detailInfo = res.data.order;
        this.detailInfo.appMchDTO = res.data.appMchDTO; // 收款商户信息
        this.detailInfo.activity = res.data.activity
        this.detailInfo.order = res.data.order;
        this.detailInfo.discount = res.data.discount;
        this.detailInfo.patient = JSON.parse(
          this.detailInfo.orderPackage
        ).patient;
        this.detailInfo.product = JSON.parse(
          this.detailInfo.orderPackage
        ).product;
        this.detailInfo.currentPrice = JSON.parse(this.detailInfo.orderPackage).productSpec.currentPrice // 订单金额
        this.detailInfo.discountAmount = JSON.parse(this.detailInfo.orderPackage).discountAmount || 0 // 优惠券优惠金额
        this.detailVisible = true;
      });
    },
    async getTime(val) {
      const imUserId = val.conversationID.replace(/GROUP/g, "");
      const result = await this.$requestPost(
        `/cloud-im/chatSession/getChating?imUserId=${imUserId}`,
        {}
      );
      let beginTime = "";
      if (result && result.code === 200) {
        if (result.data) {
          beginTime = result.data.beginTime ? result.data.beginTime : "";
        } else {
          beginTime = new Date();
        }
      } else {
        beginTime = new Date();
      }
      return new Promise((resolve, reject) => {
        resolve(beginTime);
      });
    },
    async timeFn(val) {
      if (!val) {
        return;
      }
      const beginTime = await this.getTime(val);
      this.countTime(beginTime);
      this.headerTime ? clearInterval(this.headerTime) : "";
      this.headerTime = setInterval(() => {
        this.countTime(beginTime);
      }, 60000);
    },
    countTime(beginTime) {
      const nowTime = new Date();
      const tt = this.$dayjs(nowTime).diff(this.$dayjs(beginTime), "second");
      const h = Math.floor(tt / 3600);
      const m = Math.floor((tt % 3600) / 60);
      this.headerText = `当前会话时长：${h}小时${m}分钟`;
    },
    closeDlg() {
      this.dlgVisible = false;
    },
    getSwitchUser(imUserId) {
      this.imUserId = imUserId;
      this.dlgVisible = false;
      const user = JSON.parse(localStorage.getItem("userData") || "{}");

      // 调用转接接口
      chatSessionTransfer({
        imKeeperId: this.imUserId,
        newImKeeperId: imUserId,
        imUserId: this.currentConversation.conversationID.replace(/GROUP/g, "")
      }).then(res => {
        // 去掉会话列表中当前会话信息
        this.$store.commit("resetCurrentConversation");
        //this.$bus.$emit('startConversation', true)
        this.$bus.$emit("refreshConversationList", "switch");
      });
    },
    switchUser() {
      getOnlineKeeper().then(res => {
        this.initKeeperData = res.data.map(item => {
          item.value = item.imUserId;
          item.label = item.userName;
          return item;
        });
        // 过滤掉当前用户
        const user = JSON.parse(localStorage.getItem("userData") || "{}");

        this.initKeeperData = this.initKeeperData.filter(item => {
          if (item.imUserId === user.imUserId) {
            return false;
          }
          return true;
        });

        if (this.initKeeperData.length === 0) {
          this.$message({
            message: "没有可转接的在线管家",
            type: "error",
            duration: 5000
          });
        } else {
          this.dlgVisible = true;
        }
      });
    },
    endUser() {
      this.$confirm(`是否确定结束本次对话？`, "结束会话", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const user = JSON.parse(localStorage.getItem("userData") || "{}");

        chatSessionEnd({
          imKeeperId: this.imUserId, // imKeeperId
          imUserId:
            this.currentConversation.conversationID &&
            this.currentConversation.conversationID.replace(/GROUP/g, "") // IM用户ID
        }).then(res => {
          this.$store.commit("resetCurrentConversation");
          // this.$bus.$emit('startConversation', true)
          this.$bus.$emit("refreshConversationList", "end");
        });
      });
    },
    sendCustomMessage(data, type) {
      console.log(
        'sendCustomMessagehere',
        data, type
      )
      // 组装不同的格式
      let messageObj = {};
      const tempType = parseInt(type);

      if (type === "3") {
        // 话术链接

        messageObj = {
          type: type,
          link: data.content,
          name: data.tittle,
          img: data.url // 图片链接
        };
      } else if (type === "4") {
        // 商品

        messageObj = {
          ...data,
          type: type,
          img: data.coverImg,
          desc: data.introduction,
          currentPrice: data.currentPrice,
          id: data.id,
          name: data.name,
          originalPrice: data.originalPrice,
          receiveMoneyMode: data.receiveMoneyMode,
          saleAmount: data.saleAmount
        };
      } else if (type === "6") {
        // 如果注册完成，则提示退出
        this.isRegisterFinished(type);
        return;
      } else {  //其余类型
        messageObj = {
          ...data,
          type: type
        }
      }
      console.log(
        "sendCustomMessagehere",
        messageObj,
        this.toAccount,
        this.currentConversationType
      );
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: JSON.stringify(messageObj),
          description: "",
          extension: "custom"
        }
      });
      this.$store.commit("pushCurrentMessageList", message);

      const vm = this;
      this.tim
        .sendMessage(message)
        .then(result => {
          // 调用自己服务
          // 对象深拷贝
          const form = JSON.parse(JSON.stringify(result.data.message))
          form.payload = JSON.stringify(form.payload)
          form.senderRole = vm.duty
          if(type  === '7' || type  === '9' || type  === '10'){ //这些类型还需要调用发送公众号消息的接口
              wxMsgSend({
                type: type  === '9' ? 1 : (type  === '10' ? 2 : 3),
                userId: vm.defaultPatient.userId,
                detailId: data.pregnancyPatient && data.pregnancyPatient.id
              }).then(res=>{
                console.log("wxMsgSend", res)
              })  
          }
          if(type  === '11' || type  === '12' || type  === '13' || type  === '14'){ //这些类型还需要调用发送公众号消息的接口
              console.log("messageObj", messageObj)
              let first,keyword1,keyword2 = ''
              if(type === '11'){
                first = '孕期健康提醒'
                keyword2 = '血糖管理, 要测个血糖啦，看看最近控制得怎么样~~'
              }
              if(type === '12'){
                first = '孕期健康提醒'
                keyword2 = '体重管理, 来，该上个称啦！看看这段时间长了多少斤~ 别长太快哦！'
              }
              if(type === '13'){
                first = '孕期健康提醒'
                keyword2 = '根据你这段时间的血糖数据，营养师给你做了分析报告和建议，点开认真看看哦'
              }
              if(type === '14'){
                first = '孕期健康提醒'
                keyword2 = '根据你这段时间的体重数据，营养师给你做了分析报告和建议，点开认真看看哦'
              }
              keyword1 = vm.defaultPatient.gestationInfo
                ? vm.defaultPatient.gestationInfo.totalWeeks +
                  '周' +
                  (vm.defaultPatient.gestationInfo.weekDays > 0
                    ? '+' + vm.defaultPatient.gestationInfo.weekDays
                    : '')
                : ''
              wxMsgSendHealthy({
                // type: type,
                userId: vm.defaultPatient.userId,
                healthy: {
                  first,
                  keyword1,
                  keyword2
                }
              }).then(res=>{
                console.log("wxMsgSendHealthy", res)
              })  
          }
          if(type  === '16'){ //知识库
            let first,keyword1,keyword2 = ''
              
                first = '孕期健康提醒'
                keyword2 = '根据你这段时间的体重数据，营养师给你做了分析报告和建议，点开认真看看哦'
       
              keyword1 = vm.defaultPatient.gestationInfo
                ? vm.defaultPatient.gestationInfo.totalWeeks +
                  '周' +
                  (vm.defaultPatient.gestationInfo.weekDays > 0
                    ? '+' + vm.defaultPatient.gestationInfo.weekDays
                    : '')
                : ''
              wxMsgSendHealthy({
                // type: type,
                userId: vm.defaultPatient.userId,
                healthy: {
                  first,
                  keyword1,
                  keyword2
                }
              }).then(res=>{
                console.log("wxMsgSendHealthy", res)
              })  
          }
          saveMessage(form, vm)
        })
        .catch(error => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message
          });
        });
    },

    transferCustomMessage(data, type) {
      // 如果是文本，则直接发送，
      // 否则调用自定义发送方法，直接发送
      this.messageType = type
      console.log("transferCustomMessage", data, type)
      if (type === '1') {
        // 话术文本
        const imPatientInfo = JSON.parse(
          localStorage.getItem("im-patient-info")
        );

        const weekdays = imPatientInfo.gestationInfo
          ? ` ${imPatientInfo.gestationInfo.totalWeeks}周+${imPatientInfo.gestationInfo.weekDays}`
          : "[孕周]";

        const str =
          data &&
          data.content &&
          data.content
            .replace(/\[患者姓名\]/g, imPatientInfo.name)
            .replace(
              /\[预产期\]/g,
              imPatientInfo.expectedDate
                ? imPatientInfo.expectedDate.slice(0, 10)
                : ""
            )
            .replace(/\[孕周\]/g, weekdays);

        this.$refs["messageSendBox"].pushMessageContent(str);
      } else if (type === "2") {
        // 话术图片

        const imgType = data.content.toUpperCase().split(".");
        // JPG/JPEG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255

        let imageFormat = 255;
        if (
          imgType.length > 1 &&
          (imgType[imgType.length - 1] === "JPG" ||
            imgType[imgType.length - 1] === "JPEG")
        ) {
          imageFormat = 1;
        } else if (
          imgType.length > 1 &&
          imgType[imgType.length - 1] === "GIF"
        ) {
          imageFormat = 2;
        } else if (
          imgType.length > 1 &&
          imgType[imgType.length - 1] === "PNG"
        ) {
          imageFormat = 3;
        } else if (
          imgType.length > 1 &&
          imgType[imgType.length - 1] === "BMP"
        ) {
          imageFormat = 4;
        }
        const userData = this.$local.get('userData')
        const params = {
          imGroupId: this.currentConversation.conversationID.replace(
            /GROUP/g,
            ""
          ),
          type: "TIMImageElem", // 图片,
          avatar: userData.url,  // this.currentConversation.patient.avatar,
          nick: userData.name, // this.currentConversation.patient.nick,
          senderRole: this.duty,
          payload: {
            uuid: data.id,
            imageFormat: imageFormat,
            imageInfoArray: [
              {
                sizeType: 1,
                type: 0, // 原图
                size: 0,
                width: 0,
                height: 0,
                url: data.content
              },
              {
                sizeType: 3,
                type: 1, // 大图
                size: 0,
                width: 0,
                height: 0,
                url: data.content + "?imageMogr2/quality/10"
                // url: data.content + "?imageMogr2/thumbnail/!80"
              },
              {
                sizeType: 2,
                type: 2, // 缩量图
                size: 0,
                width: 0,
                height: 0,
                url: data.content + "?imageMogr2/quality/50"
                // url: data.content + "?imageMogr2/thumbnail/!30"
              }
            ]
          },
          from: this.imUserId
        };
        params.payload = JSON.stringify(params.payload);
        console.log(112, params, userData, this.currentConversation)
        sendGroupMsg(params)
          .then(res => {})
          .catch(error => {});
      } else {
        this.sendCustomMessage(data, type);
      }
      // 调用自定义的消息去发
    },
    move(e) {
      const odiv = this.$refs.dropdown.$el.children[0]; // e.target        //获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft;
      const disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX;
        const top = e.clientY - disY;

        // 绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;

        // 移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    mergerMessageBack() {
      const index = this.mergerMessageList.length - 2;
      this.$store.commit("updateMergerMessage", this.mergerMessageList[index]);
      // this.mergerMessageList.pop()
    },
    closeMessagePop() {
      this.mergerMessagePop = false;
      this.$store.commit("resetMergerMessage");
    },
    closeSelectMessage() {
      this.$store.commit("resetSelectedMessage", false);
    },
    mergerSelectedHandler() {
      this.selectedMessageList = [];
      this.checkList = [];
      this.$store.commit("setSelectedMessage", true);
    },
    mergerShow(value) {
      this.mergerMessagePop = true;
      this.mergerMessage = value;
      this.$store.commit("setMergerMessage", value);
    },
    mergerRelay() {
      this.selectedMessage();
      this.$store.commit("setRelayType", 3);
    },
    singleRelay() {
      this.selectedMessage();
      this.$store.commit("setRelayType", 2);
    },
    selectedMessage() {
      let messageList = [];
      this.selectedMessageList = [];
      this.checkList.forEach(id => {
        messageList = this.currentMessageList.find(item => {
          return item.ID === id;
        });
        this.selectedMessageList.push(messageList);
      });

      this.$store.commit("showConversationList", true);
      // this.closeSelectMessage() // TODO
      this.$store.commit("setSelectedMessageList", this.selectedMessageList);
    },
    onScroll({ target: { scrollTop } }) {
      const messageListNode = this.$refs["message-list"];
      if (!messageListNode) {
        return;
      }
      if (
        this.preScrollHeight - messageListNode.clientHeight - scrollTop <
        20
      ) {
        this.isShowScrollButtomTips = false;
      }
    },
    // 如果滚到底部就保持在底部，否则提示是否要滚到底部
    keepMessageListOnButtom() {
      const messageListNode = this.$refs["message-list"];
      if (!messageListNode) {
        return;
      }
      // 距离底部20px内强制滚到底部,否则提示有新消息
      if (
        this.preScrollHeight -
          messageListNode.clientHeight -
          messageListNode.scrollTop <
        20
      ) {
        this.$nextTick(() => {
          messageListNode.scrollTop = messageListNode.scrollHeight;
        });
        this.isShowScrollButtomTips = false;
      } else {
        this.isShowScrollButtomTips = true;
      }
      this.preScrollHeight = messageListNode.scrollHeight;
    },
    // 直接滚到底部
    scrollMessageListToButtom() {
      this.$nextTick(() => {
        const messageListNode = this.$refs["message-list"];
        if (!messageListNode) {
          return;
        }
        messageListNode.scrollTop = messageListNode.scrollHeight;
        this.preScrollHeight = messageListNode.scrollHeight;
        this.isShowScrollButtomTips = false;
      });
    },
    showMore() {
      this.showConversationProfile = !this.showConversationProfile;
    },
    onImageLoaded() {
      this.keepMessageListOnButtom();
    },
    async startConversation() {
      console.log("startConversation")
      const userData = this.$local.get("userData");

      // debugger
      if (userData.duty === "4") {
        const params = {
          imConversationId: this.currentConversation.conversationID,
          imKeeperId: userData.imUserId
        };

        // beginForKeeper(params).then((res)=>{
        //   console.log("res", res)
        // })
        const result = await this.$requestPost(
          `/cloud-im/chatSession/beginForKeeper`,
          params
        );
        console.log("222222", result)
        if (result && result.code === 200) {
          this.$bus.$emit("startConversation", true);
        } else if (result && result.code === 5011) {
          this.$message.error("用户没有发起过对话");
        } else if (result && result.code === 5007) {
          this.$message.error("已有管家正在进行对话，请等候");
        }
      } else {
        this.$message.error("暂无权限");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.toolbar{
    background: #fff;
    text-align: right;
    padding-right:16px;
    line-height:48px;
    height:48px;
    border-bottom: 1px solid #ebebeb;
}
/* 当前会话的骨架屏 */
.current-conversation-wrapper {
  height: $height;
  background-color: $background-light;
  color: $base;
  display: flex;
  flex-grow: 1;

  .current-conversation {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: $height;
  }

  .profile {
    height: $height;
    overflow-y: scroll;
    width: 220px;
    border-left: 1px solid $border-base;
    flex-shrink: 0;
  }

  .more {
    display: flex;
    justify-content: center;
    font-size: 12px;
  }

  .no-more {
    display: flex;
    justify-content: center;
    color: $secondary;
    font-size: 12px;
    padding: 10px 10px;
  }
}

.header {
  border-bottom: 1px solid $border-base;
  height: 48px;
  position: relative;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .time {
    font-size: 14px;
  }
  .name {
    height: 20px;
    opacity: 1;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 20px;
    margin-left:24px;
  }

  .btn-more-info {
    position: absolute;
    top: 10px;
    right: -15px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;

    &::before {
      position: absolute;
      right: 0;
      z-index: 0;
      content: '';
      width: 15px;
      height: 30px;
      border: 1px solid $border-base;
      border-radius: 0 100% 100% 0 / 50%;
      border-left: none;
      background-color: $background-light;
    }

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      transition: transform 0.8s;
      border-top: 2px solid $secondary;
      border-right: 2px solid $secondary;
      float: right;
      position: relative;
      top: 11px;
      right: 8px;
      transform: rotate(45deg);
    }

    &.left-arrow {
      transform: rotate(180deg);

      &::before {
        background-color: $white;
      }
    }

    &:hover {
      &::after {
        border-color: $light-primary;
      }
    }
  }
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  .message-list {
    width: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
    padding: 0 20px;
  }

  .newMessageTips {
    position: absolute;
    cursor: pointer;
    padding: 5px;
    width: 120px;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 5px;
    font-size: 12px;
    text-align: center;
    border-radius: 10px;
    border: $border-light 1px solid;
    background-color: $white;
    color: $primary;
  }
}

.footer {
  position: relative;
  border-top: 1px solid $border-base;
  border-left: 1px solid $border-base;
  background-color:#fff;
  .footer--box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(210,210,210,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .merger-btn {
    height: 150px;
    padding: 3px 20px 20px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding-top: 50px;

    .relay-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 50px;

      .relay-icon {
        display: block;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background-color: #ffffff;
        margin-bottom: 5px;
      }

      .relay-title {
        display: block;
        font-size: 13px;
      }
    }
  }
}

.show-more {
  text-align: right;
  padding: 10px 20px 0 0;
}

/deep/ .el-checkbox {
  width: 100%;
  font-weight: 300;
  margin-right: 0;
  white-space: normal;
}

/deep/ .el-checkbox__label {
  width: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}

/deep/ .el-popover {
  cursor: pointer;
  width: 700px;
  position: fixed;
  left: 30vw;
  /* right 0 */
  margin: 0;
  background-color: #fff;
  padding: 0;
  top: 15vh;
}

/deep/ .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

/deep/ .el-checkbox__inner::after {
  height: 8px;
  left: 6px;
  top: 2px;
}

/deep/ .el-checkbox__label {
  line-height: normal;
}

/deep/ .el-checkbox__input {
  position: absolute;
  top: 30px;
  left: -10px;
}

.pop-header {
  /* display flex */
  position: relative;
  /* justify-content space-between */
  margin-bottom: 10px;
  border-bottom: 1px solid #DEDEDE;
  background-color: #F3F3F3;
  padding: 8px 8px;

  & img {
    display: block;
    width: 22px;
    height: 22px;
    cursor: pointer;
    position: absolute;
    top: 8px;
  }

  .title {
    display: block;
    text-align: center;
  }

  .pop-close {
    right: 5px;
  }

  .pop-back {
    left: 5px;
  }
}

.current-conversation-cnt {
  display: flex;
  position: relative;
}
.null-data {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .null-data-text {
    color: #999;
    margin-top: 8px;
  }
}

.dot{
  display:inline-block;
  width: 4px;
  height: 4px;
  opacity: 1;
  background: #0066cc;
  border-radius: 50%;
  margin:0px 8px;
}

.admin{
  height: 17px;
  opacity: 1;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #0066cc;
  line-height: 17px;
}
</style>
