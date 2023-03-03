<template>
  <div class="page-view flex flex-column">
    <el-row type="flex" justify="space-between" class="page-title">
      <div class="title">订单分账信息</div>
      <div>
        <el-button
          type="primary"
          @click="retry"
          class="pa-btn"
          v-show="retryVisible"
        >
          <i class="icon iconfont icon-s_chonglai"></i>
          重新分账
        </el-button>
      </div>
    </el-row>
    <div class="page-content flex-main flex flex-column">
      <el-row class="order-info">
        <el-col :span="8" class="info-item">
          <label>订单支付时间：</label>
          <span class="flex-main">{{ orderDetail.payTime }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>订单实付金额：</label>
          <span class="flex-main">{{ orderDetail.sumTotal | currency }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>微信结算费用：</label>
          <span class="flex-main">{{
            orderDetail.commiMoneyTotal | currency
          }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>收款商户：</label>
          <span class="flex-main">{{ orderDetail.mchName }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>收款商户号：</label>
          <span class="flex-main">{{ orderDetail.mchId }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>收款商户实收金额：</label>
          <span class="flex-main">{{ orderDetail.receiveMoneyTotal | currency}}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>总分账金额：</label>
          <span class="flex-main">{{
            orderDetail.shareMoneyTotal | currency
          }}</span>
        </el-col>
        <el-col :span="8" class="info-item">
          <label>已分账金额：</label>
          <span class="flex-main">{{
            orderDetail.doneShareMoneyTotal | currency

          }}</span>
        </el-col>
        <el-col :span="8" class="info-item text-primary">
          <label>待分账金额：</label>
          <span class="flex-main">{{
            orderDetail.notShareMoneyTotal | currency
          }}</span>
        </el-col>
      </el-row>
      <div class="flex-main">
        <el-table
          class="pa-table"
          v-loading="loading"
          :data="tableData"
          height="100%"
        >
          <el-table-column
            label="分账方"
            prop="shareMchName"
            show-overflow-tooltip
            width="300"
          ></el-table-column>
          <el-table-column
            label="分账商户号"
            prop="shareMchAccount"
            width="200"
          ></el-table-column>
          <el-table-column label="分账金额" prop="shareMoney" width="180">
            <template slot-scope="{ row }">
              {{ row.shareMoney | currency }}
            </template>
          </el-table-column>
          <el-table-column label="分账状态" prop="shareStatus" width="150">
            <template slot-scope="{ row }">
              <span
                class="share-status"
                :class="{
                  wait: row.shareStatus === 1,
                  done: row.shareStatus === 2,
                  doing: row.shareStatus === 3,
                  warning: row.shareStatus === 4,
                }"
              >
                {{ statusMap[row.shareStatus] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="分账时间" prop="updateTime" width="170">
          </el-table-column>
          <el-table-column label="分账回退状态" prop="refundTime" width="170">
            <template slot-scope="{ row }">
              {{ transLate(row.refundStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="分账回退时间" prop="refundTime" width="170">
            <template slot-scope="{ row }">
              {{ row.refundTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            show-overflow-tooltip
            prop="remark"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="重新分账确认"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-body">
        <h3 class="title">系统将对以下分账方进行重新分账</h3>
        <el-table
          class="pa-table"
          v-loading="loading"
          :data="reShareTableData"
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column label="分账方" prop="shareMchName"></el-table-column>
          <el-table-column
            label="分账商户号"
            prop="shareMchAccount"
            width="150"
          ></el-table-column>
          <el-table-column label="分账金额" prop="shareMoney">
            <template slot-scope="{ row }">
              {{ row.shareMoney | currency }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dailogClose">取 消</el-button>
        <el-button type="primary" @click="confirmRetry">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/orderlist'
import { orderReShare } from '@/api/account'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      orderDetail: {
        payTime: '',
        sumTotal: 0,
        mchName: '',
        mchId: '',
        commiMoneyTotal: 0, //支付服务费
        shareMoneyTotal: 0, //总分账金额
        notShareMoneyTotal: 0, //已分账金额
        doneShareMoneyTotal: 0, //待分账金额
        receiveMoneyTotal:0, // 收款商户实收金额
      },
      tableData: [],
      order: {},
      statusMap: {
        1: '待分账',
        2: '已分账',
        3: '分账中',
        4: '异常',
      },
      // 分账回退状态
      refundStatusOption: [
        {
          label: '',
          value: 0,
        },
        {
          label: '待回退',
          value: 1,
        },
        {
          label: '回退中',
          value: 2,
        },
        {
          label: '成功',
          value: 3,
        },
        {
          label: '失败',
          value: 4,
        },
        {
          label: '异常',
          value: 5,
        },
      ],
    }
  },
  computed: {
    retryVisible() {
      // // 分账都已经成功，则不显示按钮
      return this.tableData.some((item) => {
        //   // 分账状态 1 待分账 2 已分账 3 分账中 4 异常
        return (
          (item.shareStatus === 1 || item.shareStatus === 4) &&
          (this.order.payStatus == 1 || this.order.payStatus == 6)
        )
      })
      // if(this.order.payStatus == 1 || this.order.payStatus == 6 ){
      //   return true
      // }else{
      //   return false
      // }
    },
    reShareTableData() {
      return this.tableData.filter((item) => {
        return item.shareStatus !== 2
      })
    },
  },
  created() {
    this.getPageData()
  },
  methods: {
    getPageData() {
      const id = this.$route.query.id
      if (id) {
        this.loading = true
        getOrderDetail(id)
          .then((res) => {
            // console.log(res);
            if (res.code === 200) {
              const {
                appMchDTO,
                order,
                orderShareList,
                commiMoneyTotal,
                shareMoneyTotal,
                notShareMoneyTotal,
                doneShareMoneyTotal,
                receiveMoneyTotal
              } = res.data
              const sumTotal = order.sumTotal //订单金额
              Object.assign(this.orderDetail, {
                sumTotal,
                commiMoneyTotal, //结算服务费
                shareMoneyTotal, // 总分账
                notShareMoneyTotal, // 待分账
                doneShareMoneyTotal, // 已分账
                receiveMoneyTotal, // 收款商户实收金额
                payTime: order.payTime,
                mchName: appMchDTO.mchName,
                mchId: appMchDTO.mchId,
              })
              if (orderShareList) {
                this.tableData = orderShareList
                this.tableData.forEach((item,index)=>{
                  if(item.mainType == 1){
                    this.tableData.splice(index,1)
                  }
                })
              }
              if (order) {
                this.order = order
              }
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    retry() {
      this.dialogVisible = true
    },
    dailogClose() {
      this.dialogVisible = false
    },
    // 分账回退状态转化
    transLate(val) {
      let result = ''
      this.refundStatusOption.forEach((item) => {
        if (item.value == val) {
          result = item.label
        }
      })
      return result
    },
    confirmRetry() {
      const id = this.$route.query.id
      if (id) {
        orderReShare(id).then((res) => {
          // console.log(res);
          if (res.code === 200) {
            this.getPageData()
            this.dailogClose()
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page-view {
  height: 100%;
  background-color: #fff;
  color: #333;
  .page-title {
    > .title {
      line-height: 32px;
      font-size: 16px;
    }
    padding: 8px 24px;
    border-bottom: 1px solid #ebebeb;
  }
  .page-content {
    padding: 16px 24px 15px 24px;
  }
}
.order-info {
  .info-item {
    font-size: 14px;
    > label {
      display: inline-block;
      width: 126px;
      text-align: right;
      color: inherit;
      font-weight: normal;
    }
  }
}
.text-primary {
  color: #06f;
}
.share-status {
  position: relative;
  padding-left: 10px;
  display: block;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    display: block;
    width: 5px;
    height: 5px;
    margin-top: -3px;
    border-radius: 50%;
  }
  &.wait {
    color: #0066cc;
    &::before {
      background-color: #0066cc;
    }
  }
  &.done {
    color: #333333;
    &::before {
      background-color: #333333;
    }
  }
  &.doing {
    color: #ffb828;
    &::before {
      background-color: #ffb828;
    }
  }
  &.warning {
    color: #f26334;
    &::before {
      background-color: #f26334;
    }
  }
}
.dialog-body {
  padding: 0 24px;
  margin-bottom: 16px;
  .title {
    margin: 0;
    margin-bottom: 16px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
}
</style>
