<template>
  <message-bubble class="custom-element" :is-mine="isMine" :message="message">
    <!-- {{text}} -->
    <div class="custom-element-wrapper">
      <div v-if="text.type === '4'" class="title">
        {{ isMine ? "为您推荐:" : "你正在咨询服务:" }}
      </div>
      <div v-if="text.type === '5'" class="title">
        {{ isMine ? "您已成功购买服务:" : "你正在咨询订单:" }}
      </div>
      <div v-if="text.type === '5'" class="code">
        订单编号: {{ text.orderCode }}
      </div>
      <div
        v-if="text.type === '4' || text.type === '5'"
        class="custom-box"
        :class="text.type === '4' || text.type === '5' ? '' : 'words'"
        @click="onDetail(text.id)"
      >
        <div class="figure"><img :src="text.img" alt="" /></div>
        <div class="main">
          <div class="name">{{ text.name }}</div>
          <div v-show="text.desc" class="desc">
            {{ text.desc }}
          </div>
          <div class="bill">
            <div class="spec">
              <span class="ellipsis product-spec-name">{{
                text.productSpecName
              }}</span>
              <span v-if="text.product" class="price">
                &yen;{{ text.currentPrice }}
              </span>
              <span v-if="!text.product" class="price">
                &yen;{{ text.currentPrice | amount }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="text.type === '5'" class="ellipsis user">
        使用人：<span class="ellipsis username"> {{ text.userName }} </span> |
        {{ text.mobile }}
      </div>
      <!-- 链接 -->
      <div
        v-if="text.type === '3'"
        class="custom-box"
        @click="jumpLink(text.link)"
      >
        <div class="figure">
          <img
            :src="
              text.img ? text.img : require('@/assets/image/defaultLink.png')
            "
            alt=""
          />
        </div>
        <div class="main">
          <div class="name">{{ text.name }}</div>
          <div v-if="text.desc" class="desc">{{ text.desc }}</div>
        </div>
      </div>

      <!-- 登记信息的链接,只显示，不需要动作 -->
      <div v-if="text.type === '6'" class="custom-box">
        <div class="main">
          <div class="name">信息补充</div>
          <div class="desc">您可以先完善一下信息，方便准确沟通哦~</div>
        </div>
      </div>

      <!-- type === '7' 下次产检（未预约） -->

      <div class="custom-supple" v-if="text.type === '7'">
        <div class="title">
          {{ text.pregnancyPatient.pregnancyTestName }}（孕{{
            text.pregnancyPatient.gestationalWeek
          }}周）
        </div>

        <div class="sub">
          亲，您下次的产检时间是{{
            text.pregnancyPatient &&
              text.pregnancyPatient.pregnancyTime &&
              $dayjs(text.pregnancyPatient.pregnancyTime.slice(0, 10)).format(
                "YYYY年M月DD日"
              )
          }}
          ({{
            text.pregnancyPatient &&
              text.pregnancyPatient.pregnancyTime &&
              text.pregnancyPatient.pregnancyTime | getWeekday
          }})，有没有预约好呀？
        </div>
      </div>
      <!-- type === '8' 下次产检（已预约） -->
      <div class="custom-supple" v-if="text.type === '8'">
        <div>第二次产检（孕16周）</div>

        <div class="sub">2021-09-30 15:50 - 17:40</div>

        <div class="sub">周云 主任医师 | 妇产科</div>

        <div class="sub">罗湖人民医院</div>

        <div class="footer">
          <a href="javascript: void(0)">检查重点</a>
          <a href="javascript: void(0)">注意事项</a>
          <a href="javascript: void(0)">检查项目</a>
          <a href="javascript: void(0)">就诊流程</a>
        </div>
      </div>
      <!-- type === '9' 产检日程表 -->

      <div class="custom-supple" v-if="text.type === '9'">
        <div class="title">{{ text.name }} 孕期产检日程表</div>

        <div class="sub schedule-box link-right">
          <img class="icon-schedule" src="@/assets/image/xiaoan.png" alt="" />

          <span class="content">小安给您制定了产检日程表，请查收哦！</span>
        </div>
      </div>
      <!-- type === '10' 预约提醒 -->
      <div class="custom-supple" v-if="text.type === '10'">
        <div class="title">
          {{
            text.pregnancyPatient && text.pregnancyPatient.pregnancyTestName
          }}（孕{{
            text.pregnancyPatient && text.pregnancyPatient.gestationalWeek
          }}周）
        </div>

        <div class="sub">
          亲，您下次的产检时间是{{
            text.pregnancyPatient &&
              text.pregnancyPatient.pregnancyTime &&
              $dayjs(text.pregnancyPatient.pregnancyTime.slice(0, 10)).format(
                "YYYY年M月DD日"
              )
          }}
          ({{
            text.pregnancyPatient &&
              text.pregnancyPatient.pregnancyTime &&
              text.pregnancyPatient.pregnancyTime | getWeekday
          }})，有没有预留好时间呀？现在已经放号了，可以提前预约挂号一下哦！
        </div>

        <div class="reserve">
          <el-button class="pa-btn" type="primary">去预约</el-button>
        </div>
      </div>
      <!-- type === '11' 血糖检查提醒 -->
      <div class="custom-supple" v-if="text.type === '11'">
        <div class="title">
          血糖记录时间到：
        </div>

        <div class="sub">
          要测个血糖啦，看看最近控制得怎么样~~
        </div>

        <div class="reserve">
          <el-button class="pa-btn" type="primary">血糖记录</el-button>
        </div>
      </div>
      <!-- type === '12' 体重检查提醒 -->
      <div class="custom-supple" v-if="text.type === '12'">
        <div class="title">
          体重记录时间到：
        </div>

        <div class="sub">
          
          来，该上个称啦！看看这段时间长了多少斤~ 别长太快哦！
        </div>

        <div class="reserve">
          <el-button class="pa-btn" type="primary">体重记录</el-button>
        </div>
      </div>
      <!-- type === '13' 血糖报告提醒 -->
      <div class="custom-supple" v-if="text.type === '13'">
        <div class="title">
        {{ text.name }}  血糖管理报告：
        </div>

        <div class="sub">
          
          根据你这段时间的血糖数据，营养师给你做了分析报告和建议，点开认真看看哦
        </div>
      </div>
      <!-- type === '13' 体重报告提醒 -->
      <div class="custom-supple" v-if="text.type === '14'">
        <div class="title">
        {{ text.name }}  体重管理报告：
        </div>

        <div class="sub">
          
          根据你这段时间的体重数据，营养师给你做了分析报告和建议，点开认真看看哦
        </div>
      </div>
      <!-- type === '15'优惠券 -->
      <div class="custom-supple" v-if="text.type === '15'">
        <div class="sub">
          亲爱的{{currentConversation.name}}，小安给您发送了一张【满{{ text.thresholdMoney/100 }}减{{ text.reduceMoney/100 }}】的专属优惠券，有效日期{{ timeFilters(text.beginTime) }}至{{ timeFilters(text.endTime) }}哦，快快下单使用吧！
        </div>
      </div>
      <!-- type === '16'知识库 -->
      <div class="custom-supple" v-if="text.type === '16'">
        <div class="sub">
          <div v-if="text.coverPath">
            <img :src="text.coverPath" />
          </div>
          <div class="content" v-html="text.content">
          </div>
        </div>
      </div>
    </div>
  </message-bubble>
</template>

<script>
import { mapState } from "vuex";
import MessageBubble from "../message-bubble";
// import { Rate } from 'element-ui'
// import MessageGroupLiveStatus from '../message-group-live-status'

export default {
  name: "CustomElement",
  components: {
    MessageBubble
    // ElRate: Rate,
    // MessageGroupLiveStatus
  },
  props: {
    payload: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      currentUserProfile: state => state.userIm.currentUserProfile,
      currentConversation: state => state.conversation.currentConversation, // 当前会话
    }),
    text() {
      return this.translateCustomMessage(this.payload);
    },
    rate() {
      return parseInt(this.payload.description);
    }
  },
  watch: {
    /* text: {
      handler(val) {
        console.log(12313132, val)
      },
      immediate: true
    },
    currentConversation: {
      handler(val) {
        console.log(4564564, val)
      },
      immediate: true
    }, */
  },
  methods: {
    timeFilters(time) {
      return time.slice(0, 10)
    },
    jumpLink(link) {
      window.open(link);
    },
    // 编辑初始化
    async isUsing(id) {
      const result = await this.$requestPost(
        `/cloud-hmall/product/get?id=${id}`,
        {}
      );

      if (result && result.code === 200) {
        const status = result.data.product.status;
        if (status === 0) {
          return false;
        }
        return true;
      }
      return true;
    },
    // 订单详情
    async onDetail(id) {
      // 服务包
      if (this.text.type === "4") {
        // 需要先检查服务的状态，如果已经删除需要提示
        //console.log('onDetail', window.location)
        const isUsing = await this.isUsing(id);

        if (isUsing) {
          // const url =
          //   window.location.protocol +
          //   '//' +
          //   window.location.host +
          //   '/#' +
          //   `/edit-package?id=${id}&showPreview=true`
          // window.open(url)
          this.$emit("showPreview", this.text);
        } else {
          this.$message({
            message: "服务套餐已被删除",
            type: "error"
          });
        }
      } else if (this.text.type === "5") {
        // 订单详情
        this.$emit("showOrderList", this.text);
      }
    },
    translateCustomMessage(payload) {
      let videoPayload = {};
      try {
        videoPayload = JSON.parse(payload.data);
      } catch (e) {
        videoPayload = {};
      }
      if (payload.data === "group_create") {
        return `${payload.extension}`;
      }
      if (videoPayload.roomId) {
        videoPayload.roomId = videoPayload.roomId.toString();
        videoPayload.isFromGroupLive = 1;
        return videoPayload;
      }
      if (payload.text) {
        return payload.text;
      } else if (payload.data) {
        const messageObj = JSON.parse(payload.data);

        return messageObj;
      } else {
        return "[自定义消息]";
      }
    }
  }
};
</script>

<style scoped>
.custom-element-wrapper {
  overflow: hidden;
}

.text {
  font-weight: bold;
}

.title {
  color: #999999;
  font-size: 14px;
  padding: 0px 8px 8px 0px;
  font-weight: 600;
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 8px;
}

.survey {
  background-color: white;
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.suggestion {
  padding-top: 10px;
  font-size: 14px;
}

.custom-box {
  display: flex;
}

.custom-box.words {
  align-items: center;
}

.custom-box .figure {
  width: 58px;
  height: 46px;
  opacity: 1;
  background: #ebebeb;
  border-radius: 2px;
  margin-right: 8px;
}

.custom-box .figure img {
  width: 58px;
  height: 46px;
}

.custom-box .name {
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 20px;
}

.bill {
  margin-top: 8px;
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  display: flex;
}

.price {
  color: #666666;
  margin-right: 16px;
}

.spec {
  color: #999999;
  /* padding-left:8px; */
}

.custom-box .desc {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.code {
  height: 25px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 20px;
}

.custom-element >>> .message-content {
  width: 340px;
}

.main {
  max-width: 240px;
  text-overflow: ellipsis;
}

.chat-bubble .message-send.administrator .user {
  color: #333333;
}

.ellipsis {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.specname {
  top: -5px;
  position: relative;
}

.product-spec-name {
  max-width: 80px;
  margin-right: 8px;
}

.username {
  max-width: 90px;
  top: 5px;
  position: relative;
  padding-left: 8px;
}

.price {
  top: -5px;
  position: relative;
}

.schedule-box {
  display: flex;
  align-items: center;
}

.icon-schedule {
  width: 21px;
  height: 21px;
  margin-right: 8px;
}

.reserve {
  margin-top: 8px;
  border-top: 1px solid #ebebeb;
  text-align: right;
  padding-top: 16px;
}

.reserve-btn {
  height: 30px;
  background: #876eff;
  border-radius: 30px;
  color: #ffffff;
  font-size: 14px;
}
</style>
