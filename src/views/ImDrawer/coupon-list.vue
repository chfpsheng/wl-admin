<template>
  <div class="pa-im-box-container">
    <div class="header-handle-box">
      <div class="title">
        <i class="el-icon-close close-icon" @click="closeCoupon" />
        优惠券
      </div>
    </div>
    <div class="search-box">
      <el-input v-model.trim="pageQuery.name" placeholder="请输入查询内容" class="pa-input pa-im-coupon-input" clearable @keyup.enter.native="handleIconClick">
        <i class="el-icon-search el-input__icon" slot="prefix"  @click="handleIconClick" />
      </el-input>
    </div>
    <div class="list-box">
      <ul class="infinite-list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="distance"
        style="overflow: auto"
      >
        <li v-for="(item, index) in listData" :key="index" class="infinite-list-item">
          <div :class="couponTag(item.takeCount, item.publishCount, item.enableTake)">
            <div :class="couponClass(item.takeCount, item.publishCount, item.enableTake)" @dblclick="sendCoupon(item, index)">
              <div class="left">
                <i class="small-circle small-circle-left" />
                <div class="price-box">
                  <span class="yen">&yen;</span>
                  <span class="price">{{item.reduceMoney | filterPrice}}</span>
                </div>
                <span class="price-text">满{{item.thresholdMoney | filterPrice}}元可用</span>
              </div>
              <div class="right">
                <i class="small-circle small-circle-right" />
                <div class="coupon-dsc-box">
                  <div class="title">
                    {{item.name}}
                  </div>
                  <span class="time" :style="{color: filterColor(item.endTime)}">{{filterDate(item.beginTime, item.endTime)}}</span>
                </div> 
                <span class="rule-title">
                  使用规则
                  <el-tooltip popper-class="coupon-list-rule-item" effect="dark" :content="item.roleDescription" placement="bottom">
                    <i class="el-icon-question rule-icon" />
                  </el-tooltip>
                </span>
              </div>
            </div>
            <div class="coupon-tag">
              {{couponStatus(item.takeCount, item.publishCount, item.enableTake)}}
            </div>
          </div>
        </li>
        <div v-if="loading" class="tips-text">加载中...</div>
        <div v-if="noMore" class="tips-text">没有更多了</div>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getPrivateCouponList, collectCoupon } from '@/api/coupon';
export default {
  name: 'CouponList',
  data() {
    return {
      distance: 10,
      pageQuery: {
        name: '',
        pageSize: 10,
        pageNo: 1,
        status: 1,
      },
      loading: false,
      listData: [],
      total: 0,
    }
  },
  filters: {
    filterPrice(val) {
      const price = val / 100
      return price
    }
  },
  computed: {
    noMore () {
      return !(this.listData.length < this.total)
    },
    disabled () {
      return this.loading || this.noMore
    },
    ...mapState({
      defaultPatient: (state) => state.defaultPatient.patient,
    }),
  },
  watch: {
    defaultPatient: {
      handler(val) {
        console.log(789789789789897, val)
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      console.log(this.loading, this.listData.length)
      this.getData()
    },
    selectedItem(data) {
      // type === '15' 优惠券
      this.$emit('selectedItem', data, '15')
    },
    closeCoupon() {
      this.$emit('closeCoupon', false);
    },
    load () {
      console.log(987654321)
      this.pageQuery.pageNo++
      this.getData()
    },
    getData() {
      this.loading = true
      const params = {
        ...this.pageQuery,
        userId: this.defaultPatient.userId
      }
      getPrivateCouponList(params)
        .then((res) => {
          const list = res.data.rows
          this.listData = this.listData.concat(list)
          console.log(2222, this.listData)
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        });
    },
    handleIconClick() {
      this.pageQuery.pageNo = 1
      this.listData = []
      this.getData()
    },
    filterDate(beginTime, endTime) {
      let day = this.$dayjs(endTime).diff(this.$dayjs(), 'second')
      day = day / 86400
      if(day <= 1) {
        return '今日到期'
      } else if(day > 1 && day <= 7) {
        const surplusDay = Math.ceil(day)
        return `${surplusDay}天后到期`
      } else {
        let begin = beginTime.slice(0, 10)
        begin = begin.replace(/-/g, '.')
        let end = endTime.slice(0, 10)
        end = end.replace(/-/g, '.')
        return `${begin}-${end}`
      }
    },
    filterColor(endTime) {
      let day = this.$dayjs(endTime).diff(this.$dayjs(), 'second')
      day = day / 86400
      if(day <= 1) {
        return '#EF4F3C'
      } else if(day > 1 && day <= 7) {
        return '#EF4F3C'
      } else {
        return '#666'
      }
    },
    // 发送优惠券
    sendCoupon(item, index) {
      if(item.takeCount < item.publishCount && item.enableTake === 1) {
        this.defaultGetCoupon(item, index)
      }
    },
    // 默认领取优惠券
    defaultGetCoupon(item, index) {
      console.log(item, index)
      const params = {
        couponId: item.id,
        userId: this.defaultPatient.userId
      }
      collectCoupon(params).then((res) => {
        console.log(res)
        this.$emit('sendCustomMessage', item, '15')
        this.$message.success("发放成功")
      }).catch((err) => {
        console.log(453534535, err)
      }).finally(() => {
        this.listData = []
        this.pageQuery.pageNo = 1
        this.getData()
      })
    },
    // 优惠券状态
    couponStatus(takeCount, publishCount, enableTake) {
      let status = ''
      if(takeCount >= publishCount) {
        status = '已发完'
      } else {
        status = enableTake === 1 ? '' : '已领完'
      }
      return status
    },
    couponClass(takeCount, publishCount, enableTake) {
      let status = ''
      if(takeCount >= publishCount) {
        status = 'item-box item-box3'
      } else {
        status = enableTake === 1 ? 'item-box item-box1' : 'item-box item-box2'
      }
      return status
    },
    couponTag(takeCount, publishCount, enableTake) {
      let status = ''
      if(takeCount >= publishCount) {
        status = 'coupon-box coupon-box3'
      } else {
        status = enableTake === 1 ? 'coupon-box coupon-box1' : 'coupon-box coupon-box2'
      }
      return status
    },
  }
}
</script>
<style scoped>
.list-box {
  width: 100%;
  height: calc(100% - 112px);
  overflow: hidden;
  padding-bottom: 15px;
}
.infinite-list {
  width: 100%;
  height: 100%;
}
.tips-text {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666666;
}
.list-item {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ececec;
  padding: 16px 0;
  cursor: pointer;
}
.img-box {
  width: 78px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
.img-type {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 90px);
  height: 64px;
}
.pa-abs-type {
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.header-handle-box {
  width: 100%;
  height: 48px;
  position: relative;
}
.header-handle-box .title {
  position: absolute;
  top: 0;
  left: -16px;
  width: 114px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #dfe4ed;
  border-right: 1px solid #dfe4ed;
  color: #06c;
}
.close-icon {
  position: absolute;
  right: 8px;
  font-size: 14px;
  color: #979797;
  top: 18px;
  cursor: pointer;
}
.coupon-box {
  width: 100%;
  height: 94px;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
  border-radius: 2px;
}
.item-box {
  width: 100%;
  height: 100%;
  display: flex;
  margin-bottom: 8px;
  cursor: pointer;
}
.item-box2 {
  opacity: 0.5;
}
.item-box .left {
  width: 100px;
  height: 100%;
  background: #1a83f2;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item-box3 .left {
  background: #999;
}
.item-box1:hover .left {
  background: #06c;
}
.small-circle {
  width: 8px;
  height: 16px;
  position: absolute;
  top: 50%;
  margin-top: -8px;
  background: #fff;
}
.small-circle-left {
  left: 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.small-circle-right {
  width: 9px;
  right: -0.5px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border: 1px solid #dddddd;
  border-right: none;
}
.item-box1:hover .small-circle-right {
  border: 1px solid #06c;
  border-right: none;
}
.item-box .right {
  width: calc(100% - 100px);
  height: 100%;
  background: #fff;
  border: 1px solid #dddddd;
  border-left: none;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 12px 4px 8px;
}
.item-box1:hover .right {
  border: 1px solid #06c;
  border-left: none;
}
.search-box {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.price-box * {
  color: #fff;
  line-height: 32px;
}
.price-box .yen {
  font-size: 12px;
  margin-right: 2px;
}
.price-box .price {
  font-size: 24px;
}
.price-text {
  line-height: 18px;
  font-size: 12px;
  color: #fff;
  opacity: 0.8;
}
.right .title {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}
.right .time {
  font-size: 12px;
  line-height: 18px;
}
.right .rule-title {
  font-size: 12px;
  line-height: 18px;
  color: #666;
}
.right .rule-icon {
  color: #faad14;
  font-size: 12px;
  cursor: pointer;
}
.coupon-dsc-box {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.coupon-box .coupon-tag {
  width: 160px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -2px;
  left: -66px;
  font-size: 20px;
  color: #fff;
  transform: scale(0.5) rotate(-45deg);
}
.coupon-box1 .coupon-tag {
  display: none;
}
.coupon-box2 .coupon-tag {
  background: #FAAD14;
}
.coupon-box3 .coupon-tag {
  background: #EF4F3C;
}
</style>
