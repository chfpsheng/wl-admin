<template>
  <div class="app-container">
    <pa-drawer
      title="订单详情"
      :visible.sync="detailVisible"
      :with-footer="false"
      @close="close"
    >
      <div class="detail-container">
        <div class="detail-sub-title">基本信息</div>
        <div class="detail-item">
          <div class="title">订单编号:</div>
          <div class="text">{{ detailInfo.orderCode }}</div>
        </div>
        <!-- <div class="detail-item">
          <div class="title">就诊卡号:</div>
          <div class="text">{{ detailInfo.patient.regCard }}</div>
        </div> -->
        <div class="detail-item">
          <div class="title">姓名:</div>
          <div class="text">{{ detailInfo.patient.name }}</div>
        </div>
        <div class="detail-item">
          <div class="title">年龄:</div>
          <div class="text">{{ detailInfo.patient.age }}</div>
        </div>
        <div class="detail-item">
          <div class="title">性别:</div>
          <div class="text">
            {{ detailInfo.patient.sex === 2 ? '女' : '男' }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">手机号:</div>
          <div class="text">
            <template v-if="detailInfo.patient.mobile">
              {{ detailInfo.patient.mobile }}
              <SensitiveInfoShow
                :id="detailInfo.id"
                type="手机号"
                business="orderList"
                :url="sensitiveInfoInitUrl"
              />
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">身份证号:</div>
          <div class="text">
            <template v-if="detailInfo.patient.idCard">
              {{ detailInfo.patient.idCard }}
              <SensitiveInfoShow
                :id="detailInfo.id"
                type="身份证号"
                business="orderList"
                :url="sensitiveInfoInitUrl"
              />
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">预产期:</div>
          <div class="text">
            {{
              detailInfo.patient.expectedDate
                ? detailInfo.patient.expectedDate.slice(0, 10)
                : ''
            }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">孕周:</div>
          <div class="text">
            {{
              detailInfo.patient.gestationInfo
                ? detailInfo.patient.gestationInfo.totalWeeks +
                  '周' +
                  (detailInfo.patient.gestationInfo.weekDays > 0
                    ? '+' + detailInfo.patient.gestationInfo.weekDays
                    : '')
                : ''
            }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">医生:</div>
          <div class="text">
            {{
              detailInfo.doctor ? detailInfo.doctor.name : detailInfo.doctorName
            }}
          </div>
        </div>
        <!-- TODO:此处后台接口尚未提供返回值 此处代码先屏蔽，等待接口好了联调 -->
        <div
          class="detail-item"
          v-if="detailInfo.order.activityId || detailInfo.order.couponId"
        >
          <div class="title">参与活动:</div>
          <div class="text">
            <span v-show="detailInfo.order.activityId">限时折扣 </span>
            <span v-show="detailInfo.order.couponId">优惠券</span>
          </div>
        </div>
        <!-- ending -->
        <div class="detail-item">
          <div class="title">订单金额:</div>
          <div class="text">
            <span v-if="detailInfo.order.activityId">{{ detailInfo.sumTotal | currencyYuan }}</span>
            <span v-else>{{ detailInfo.currentPrice | currencyYuan }}</span>
          </div>
        </div>
        <!-- 优惠券-优惠金额 -->
        <div
          class="detail-item"
          v-if="detailInfo.order.couponId"
        >
          <div class="title">优惠金额:</div>
          <div class="text">
            {{ detailInfo.discountAmount | currencyYuan }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">实付金额:</div>
          <div class="text">
            {{ detailInfo.order.sumTotal | currencyYuan }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">订单状态:</div>
          <div class="text">
            {{ findLabelByValue(detailInfo.payStatus, orderStatusOptions) }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">服务状态:</div>
          <div class="text">
            <span
              v-if="detailInfo.payStatus !== 2 && detailInfo.payStatus !== 3"
            >
              {{ findLabelByValue(detailInfo.useStatus, serviceStatusOptions) }}
            </span>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">下单时间:</div>
          <div class="text">{{ detailInfo.createTime }}</div>
        </div>
        <div class="detail-item order-remarks">
          <div class="title">用户备注:</div>
          <div class="text">{{ detailInfo.remarks }}</div>
        </div>
        <!-- 商品信息 -->
        <div class="detail-sub-title">商品信息</div>
        <div class="detail-item">
          <div class="title">商品:</div>
          <div class="text product text----product">
            <img
              v-if="detailInfo.product && detailInfo.product.coverImg"
              :src="detailInfo.product.coverImg"
              alt=""
            />
            <span>{{ detailInfo.productName }}</span>
          </div>
        </div>
        <div class="detail-item" v-if="detailInfo.productType === 1">
          <div class="title">商品规格:</div>
          <div class="text">{{ detailInfo.order.productSpecName }}</div>
        </div>
        <!-- <div class="detail-item" v-if="detailInfo.productType === 1">
          <div class="title">商品总价:</div>
          <div class="text">{{ detailInfo.sumTotal | currencyYuan }}</div>
        </div>
        <div class="detail-item" v-if="detailInfo.productType === 1">
          <div class="title">订单金额:</div>
          <div class="text">{{ detailInfo.sumTotal | currencyYuan }}</div>
        </div>

        <div class="detail-item" v-if="detailInfo.productType === 1">
          <div class="title">应付款:</div>
          <div class="text">{{ detailInfo.sumTotal | currencyYuan }}</div>
        </div>

        <div class="detail-item" v-if="detailInfo.productType === 1">
          <div class="title">实付款:</div>
          <div
            v-if="detailInfo.payStatus !== 2 && detailInfo.payStatus !== 3"
            class="text"
          >
            {{ detailInfo.sumTotal | currencyYuan }}
          </div>
        </div> -->

        <!-- 支付信息 -->
        <div v-if="detailInfo.transactionId">
          <div class="detail-sub-title">支付信息</div>
          <div class="detail-item">
            <div class="title">收款商户:</div>
            <span>{{ detailInfo.appMchDTO.mchName }}</span>
          </div>
          <div class="detail-item">
            <div class="title">支付方式:</div>
            <span
              ><img
                class="img-inner"
                src="../../assets/image/wechat-payment.jpeg"
                alt=""
            /></span>
            <span> <div>微信支付</div></span>
          </div>
          <div class="detail-item">
            <div class="title">支付时间:</div>
            <span> {{ detailInfo.payTime }}</span>
          </div>
          <div class="detail-item">
            <div class="title">支付账单:</div>
            <span>{{ detailInfo.transactionId }}</span>
          </div>
        </div>

        <!-- 管家备注 -->
        <div v-if="detailInfo.adminRemark">
          <div class="detail-sub-title">管家备注</div>
          <div v-if="detailInfo.adminRemark" class="detail-item order-remarks">
            <div class="title">管家备注:</div>
            <span class="text">{{ detailInfo.adminRemark }}</span>
          </div>
        </div>
      </div>
    </pa-drawer>
  </div>
</template>
<script>
import SensitiveInfoShow from '@/components/SensitiveInfo/sensitive-info-show.vue'
export default {
  name: 'OrderlistView',
  components: {
    SensitiveInfoShow,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => {},
    },
    detailVisible: Boolean,
  },
  data() {
    return {
      orderStatusOptions: [
        { label: '全部', value: 0 },
        { label: '已支付', value: 1 },
        { label: '待支付', value: 2 },
        { label: '已取消', value: 3 },
        { label: '已退款', value: 4 },
        { label: '退款中', value: 5 },
        { label: '已完成', value: 6 },
      ],
      serviceStatusOptions: [
        { label: '全部', value: 0 },
        { value: 2, label: '待使用' },
        { value: 1, label: '已完成' },
        { value: 3, label: '使用中' },
      ],
      sensitiveInfoInitUrl: '/cloud-hmall/order/getNoMark',
    }
  },
  created() {
    console.log('created', this.detailInfo)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value)
      let label = ''
      arr.forEach((element) => {
        if (element.value === value) {
          label = element.label
        }
      })
      return label
    },
  },
}
</script>
<style scoped lang="scss">
@import url(index.scss);
.detail-item.order-remarks {
  display: flex;
  .text {
    flex: 1;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
