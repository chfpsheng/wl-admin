<template>
  <div class="pa-im-box-container">
    <div class="header-handle-box">
      <div class="title">
        <i class="el-icon-close close-icon" @click="closeService" />
        服务套餐
      </div>
    </div>
    <div class="list-box">
      <div v-for="(item, index) in listData" :key="index" class="list-item" @dblclick="selectedItem(item)">
        <div class="img-box">
          <img :src="item.coverImg" class="img-type">
        </div>
        <div class="text-box">
          <div class="pa-abs-type">{{ item.name }}</div>
          <div class="pa-abs-type">{{ item.introduction }}</div>
          <span class="pa-price-type">￥{{ item.currentPrice }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceList',
  data() {
    return {
      listData: []
    }
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getList()
    },
    async getList() {
      const params = {
        status: 1,
        pageNo: 1,
        pageSize: 300,
        type: 1,
      }
      const result = await this.$requestPost(
        '/cloud-hmall/product/queryForMng',
        params
      )
      if (result && result.code === 200) {
        this.listData = (result.data.rows || []).map(item => {
          // 销售价格
          let specListPrice = (item.specList || []).map(item => {
            item = item.currentPrice / 100
            return item
          })
          if (specListPrice.length === 0) {
            specListPrice = 0.00
          } else if (specListPrice.length === 1) {
            specListPrice = specListPrice[0].toFixed(2)
          } else {
            const max = Math.max(...specListPrice)
            const min = Math.min(...specListPrice)
            specListPrice = min === max ? max.toFixed(2) : min.toFixed(2) + '~' + max.toFixed(2)
          }
          item = {
            ...item,
            ...item.product,
            currentPrice: specListPrice
          }
          return item
        })
        
      }
    },
    selectedItem(data) {
      this.$emit('sendCustomMessage', data, '4')
    },
    closeService() {
      this.$emit('closeService', false);
    }
  }
}
</script>
<style scoped>
.list-box {
  width: 100%;
  height: calc(100% - 48px);
  overflow-y: auto;
  overflow-x: hidden;
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
</style>
