<template>
  <div class="pa-special-list-item">
    <div class="pa-space-between" style="margin-bottom: 8px">
      <div class="order----type">
        <span>订单编号: {{ itemData.order.orderCode }}</span>
        <span :style="{ color: filterColor(itemData.order.payStatus) }">{{itemData.order.payStatus | filterPayStatus}}</span>
      </div>
    </div>
    <div class="pa-special-list-flex">
      <div class="img-box">
        <img :src="itemData.product.coverImg" class="img-type">
      </div>
      <div class="pa-special-list-flex-column">
        <div class="pa-space-between order----title">
          <div class="order----name">{{ itemData.order.productName }}</div>
          <span>￥{{ (itemData.order.sumTotal / 100).toFixed(2) }}</span>
        </div>
        <div class="order----dsc">{{ itemData.product.introduction }}</div>
        <div class="order----spec">
          <span v-show="itemData.orderPackage.productSpec.specName !== '无规格'">
            {{itemData.orderPackage.productSpec.specName}}
          </span>
        </div>
      </div>
    </div>
    <div class="order----time">下单时间: {{ itemData.order.createTime }}</div>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeColor: '#333'
    }
  },
  filters: {
    filterPayStatus(status) {
      let val = ''
      if(status === 1) {
        val = '已支付'
      } else if(status === 2) {
        val = '待支付'
      } else if(status === 3) {
        val = '已取消'
      } else if(status === 4) {
        val = '已退款'
      } else if(status === 5) {
        val = '退款中'
      }else if(status === 6) {
        val = '已完成'
      }else {
        val = '已退款'
      }
      return val
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    filterColor(status) {
      let val = ''
      if(status === 1) {
        val = '#333333'
      } else if(status === 2) {
        val = '#0066cc'
      } else if(status === 3) {
        val = '#333333'
      } else {
        val = '#ef4f3c'
      }
      return val
    }
  }
}
</script>
<style scoped>
.pa-special-list-item {
  width: 100%;
  border: 1px solid #e8e8e8;
  padding: 8px;
  border-radius: 2px;
  margin-bottom: 16px;
  cursor: pointer;
}
.pa-special-list-item .img-box {
  width: 48px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pa-special-list-item .img-type {
  max-width: 48px;
  max-height: 40px;
}
.pa-special-list-flex {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.pa-special-list-flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding-left: 8px;
}
.pa-special-list-item *{
  font-size: 12px;
}
.pa-space-between * {
  color: #333;
}
.pa-special-list-flex-column span {
  line-height: 20px;
}
.order----type {
  width: 100%;
  color: #999;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  justify-content: space-between;
}
.order----title span {
  color: #333;
  font-size: 14px;
}
.order----time {
  width: 100%;
  padding-top: 8px;
  border-top: 1px solid #ebebeb;
  color: #999;
}
.order----dsc {
  width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-size: 12px;
}
.order----name {
  width: 160px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order----spec {
  color: #666;
}
</style>
