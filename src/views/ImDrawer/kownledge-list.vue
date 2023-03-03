<template>
  <div class="pa-im-box-container">
    <div class="header-handle-box">
      <div class="title">
        <i class="el-icon-close close-icon" @click="closeKownledge" />
        知识库
      </div>
    </div>
    <div class="search-box">
        <!-- <el-tree
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            icon-class="icon iconfont icon-s_shouqi"
            highlight-current
        >
            <span  slot-scope="{ node }">
            <span> {{ node.label }}</span>
            </span>
        </el-tree> -->
      <el-input v-model.trim="pageQuery.name" placeholder="请输入查询内容" class="pa-input pa-im-coupon-input" clearable @keyup.enter.native="handleIconClick">
        <i class="el-icon-search el-input__icon" slot="prefix"  @click="handleIconClick" />
      </el-input>
    </div>
    孕12周知识推荐
    <div class="list-box">
      <ul class="infinite-list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="distance"
        style="overflow: auto"
      >
        <li v-for="(item, index) in listData" :key="index" class="infinite-list-item">
          <div class="">
            <div class="" @dblclick="sendKownledge(item, index)">
                <div class="item-box">
                  <span class="item-title">{{item.title}}</span>
                </div>
                <span class="label-text">{{item.categories[0].typeName}} </span>
                <span class="label-text">{{item.gestationStart}}-{{item.gestationEnd}} </span>
                
                <div class="icon-container">
                  <i
                    class="iconfont icon-daisuifang"
                    style="color: #0066CC"
                    v-show="item.send"
                    title="已推送"
                  ></i>
                  <i
                    class="iconfont icon-daisuifang"
                    style="color: #999"
                    v-show="!item.send"
                    title="未推送"
                  ></i>
                  <i
                    class="iconfont icon-weichakan"
                    style="color: #0066CC"
                    v-show="item.view"
                    title="已查看"
                  ></i>
                  <i
                    class="iconfont icon-weichakan"
                    style="color: #999"
                    v-show="!item.view"
                    title="未查看"
                  ></i>
                </div>
                <div class="coupon-dsc-box">
                  <div class="title">
                    {{item.content}}
                  </div>
                </div>
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
import {
  labelQuery,
} from "@/api/knowledge";
import { labelTypeQuery } from '@/api/patient/'
import {mapState} from 'vuex'
export default {
  name: 'CouponList',
  data() {
    return {
      distance: 10,
      pageQuery: {
        //name: '',
        pageSize: 10,
        pageNo: 1,
        status: 1,
      },
      loading: false,
      listData: [],
      total: 0,
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name',
      },
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
    const data = {
      pageNo: 1,
      pageSize: 1000,
    }
    labelTypeQuery(data).then((res) => {
      this.treeData = this.getTreeData(res.data.rows, 0) // 获取层次为1的数组
    })
  },
  mounted() {
    this.initData()
  },
  methods: {
    getTreeData(tempData, parentId) {
      const treeData = []
      tempData.forEach((item) => {
        // 必须是手动标签才存入
        if (item.parentId === parentId) {
          treeData.push({
            id: item.id,
            parentId: item.parentId,
            level: item.level,
            name: item.typeName,
            $treeNodeId: item.id,
            child: this.getTreeData(tempData, item.id),
          })
        }
      })
      return treeData
    },
    initData() {
      console.log(this.loading, this.listData.length)
      this.getData()
    },
    selectedItem(data) {
      // type === '15' 优惠券
      this.$emit('selectedItem', data, '15')
    },
    closeKownledge() {
      this.$emit('closeKownledge', false);
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
      }
      labelQuery(params)
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
    // 发送知识库
    sendKownledge(item, index) {
      this.$emit('sendCustomMessage', item, '16')
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
