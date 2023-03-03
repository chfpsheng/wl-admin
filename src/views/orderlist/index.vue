<template>
  <div class="app-container">
    <div class="filter-container filter-box filter-boxs">
      <div
        class="filter-wrapper filter---multiline---wrapper"
        ref="filterWrapper"
      >
        <filter-select
          :value.sync="listQuery.timeType"
          :options="sortOptions"
          title="时间类型"
        />
        <filter-daterang-picker
          :value.sync="listQuery.datetime"
          title="日期范围"
        />
        <filter-select
          :value.sync="listQuery.payStatus"
          :options="orderStatusOptions"
          title="订单状态"
        />
        <filter-select
          :value.sync="listQuery.useStatus"
          :options="serviceStatusOptions"
          title="服务状态"
        />
        <filter-select
          :value.sync="listQuery.productType"
          :options="shopTypeOptions"
          title="商品类型"
        />
        <filter-input
          :value.sync="listQuery.queryText"
          placeholder="订单编号,姓名"
          title="字段查询"
        />
        <el-button type="primary" class="pa-btn" @click="handleFilter">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button
          v-waves
          type="primary"
          :disabled="disabled"
          :loading="downloadLoading"
          class="pa-btn"
          @click="onExport"
        >
          <i class="iconfont icon-daoru" />
          导出Excel
        </el-button>
        <!-- <el-button type="primary" class="pa-btn" @click="addItem">创建套餐服务</el-button> -->
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        :height="tableHeight"
        class="pa-table"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="订单编号" width="170px" prop="orderCode">
          <template slot-scope="{ row }">
            <span>{{ row.order.orderCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="服务名称"
          min-width="180px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span class="service">{{ row.order.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者" min-width="180px" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="service">
              <span style="margin-right: 10px">
                {{
                  row.orderPackageDTO &&
                  row.orderPackageDTO.patient &&
                  row.orderPackageDTO.patient.name
                    ? row.orderPackageDTO.patient.name
                    : ''
                }}
              </span>
              <span class="gender">
                {{
                  row.orderPackageDTO &&
                  row.orderPackageDTO.patient &&
                  row.orderPackageDTO.patient.sex
                    ? row.orderPackageDTO.patient.sex === 1
                      ? '男'
                      : '女'
                    : ''
                }}
              </span>
              <span class="gender space-gender"> | </span>
              <span class="gender">
                {{
                  row.orderPackageDTO && row.orderPackageDTO.patient
                    ? row.orderPackageDTO.patient.age
                    : ''
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime"
          width="180px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.order.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="100px">
          <template slot-scope="{ row }">
            <span :class="getPayStatuClass(row)">{{
              findLabelByValue(row.order.payStatus, orderStatusOptions)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务状态" width="150px">
          <template slot-scope="{ row }">
            <el-select
              v-show="row.order.payStatus === 1 || row.order.payStatus === 6"
              v-model="row.order.useStatus"
              @change="onChangeUseStatus($event, row)"
            >
              <el-option label="待使用" value="2" />
              <el-option label="已完成" value="1" />
              <el-option label="使用中" value="3" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" prop="sumTotal" min-width="110px">
          <template slot-scope="{ row }">
            <span>{{ setDecimal(row.order.sumTotal) }}</span>
          </template>
        </el-table-column>
        <!-- TODO：参与活动 活动后台暂时没有做  -->
        <el-table-column
          label="参与活动"
          min-width="150px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span v-show="row.order.activityId">限时折扣 </span>
            <span v-show="row.order.couponId">优惠券</span>
          </template>
        </el-table-column>
        <el-table-column label="收款商户" min-width="150px">
          <template slot-scope="{ row }">
            <span v-if="row.appMchDTO">
              {{ row.appMchDTO.mchName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="预产期" width="120px">
          <template slot-scope="{ row }">
            <span>{{
              (row.orderPackageDTO && row.orderPackageDTO.patient
                ? row.orderPackageDTO.patient.expectedDate
                : '') | parseTimes('{y}-{m}-{d}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="孕周" min-width="120px">
          <template slot-scope="{ row }">
            <span>{{
              row.orderPackageDTO &&
              row.orderPackageDTO.patient &&
              row.orderPackageDTO.patient.gestationInfo
                ? row.orderPackageDTO.patient.gestationInfo.totalWeeks +
                  '周' +
                  (row.orderPackageDTO.patient.gestationInfo.weekDays > 0
                    ? '+' + row.orderPackageDTO.patient.gestationInfo.weekDays
                    : '')
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医生" min-width="90px">
          <template slot-scope="{ row }">
            <span>{{
              row.orderPackageDTO && row.orderPackageDTO.doctor
                ? row.orderPackageDTO.doctor.name
                : ''
            }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="收费模式" min-width="150px">
          <template slot-scope="{ row }">
            <span
              v-if="row.orderPackageDTO.product.receiveMoneyMode === 1"
            >医管集团</span>
            <span
              v-else-if="row.orderPackageDTO.product.receiveMoneyMode === 2"
            >罗湖医院</span>
            <span v-else>多方分账</span>
          </template>
        </el-table-column>
        <el-table-column label="医管分账金额" min-width="120px">
          <template slot-scope="{ row }">
            <span>
              {{ setDecimal(row.orderPackageDTO.productSpec.groupMoney) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="罗医分账金额" min-width="120px">
          <template slot-scope="{ row }">
            <span>
              {{ setDecimal(row.orderPackageDTO.productSpec.hospitalMoney) }}
            </span>
          </template>
        </el-table-column> -->

        <el-table-column
          label="商品类型"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.order.productType | shopTypeText }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          width="240"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="onDetail(row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="orderMark(row)"
            >
              管家备注
            </el-button>
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              :disabled="
                !(
                  (row.order.payStatus === 1 ||
                    row.order.payStatus === 6 ||
                    row.order.payStatus === 5 ||
                    row.order.payStatus === 4) &&
                  row.orderShareList
                )
              "
              @click="viewOrderAccount(row)"
            >
              分账信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pa-pagination
        :current-page="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />
    </div>
    <!-- 订单详情 start -->

    <orderlist-view
      v-if="detailVisible"
      :detail-visible="detailVisible"
      :detail-info="detailInfo"
      @close="detailVisible = false"
    />
    <!-- 订单详情 end -->
    <!-- 订单备注 start -->
    <order-mark
      v-if="orderMarkVisible"
      :visible="orderMarkVisible"
      :initInfo="orderMarkInitInfo"
      @save-success="orderMarkSuccess"
      @close="orderMarkVisible = false"
    />
    <!-- 订单备注 end -->
  </div>
</template>

<script>
import {
  fetchOrderList,
  orderUpdate,
  getOrderDetailWithMark,
} from '@/api/orderlist'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
import OrderlistView from './orderlist-view.vue'
import OrderMark from './order-mark.vue'
import shopTypeMixin from '@/mixins/shopType'
export default {
  name: 'ComplexTable',
  components: {
    OrderlistView,
    OrderMark,
  },
  mixins: [shopTypeMixin],
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      information: false, // 是否显示支付信息
      tableKey: 0,
      tableHeight: 500,
      list: null,
      total: 0,
      listLoading: false,
      detailVisible: false, // 是否显示详情弹框
      detailInfo: {
        patient: {
          gestationInfo: {},
        },
        doctor: {},
        product: {},
      },
      detailOrder: {}, // 对象详情order
      // 详情信息
      listQuery: {
        datetime: '',
        pageNo: 1, // 页码
        pageSize: 10, // 分页大小
        type: undefined,
        timeType: '', // 查询时间类型
        payStatus: 0, // 订单状态
        start: '',
        end: '',
        useStatus: 0, // 服务状态
        queryText: '', // 订单编号
        sortField: '', // 排序字段
        asc: false, // 是否升序
        productType: null, //商品类型
        // asc: true // 是否升序
      },
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
      // { label: '支付时间', value: 2 },
      sortOptions: [
        { label: '按下单时间查询', value: 1 },
        { label: '按预产期查询', value: 3 },
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
      },
      pvData: [],
      downloadLoading: false,
      orderMarkVisible: false,
      orderMarkInitInfo: null,
      shopTypeOptions: [
        {
          value: null,
          label: '全部',
        },
        {
          value: 0,
          label: '免费商品',
        },
        {
          value: 1,
          label: '普通商品',
        },
      ],
    }
  },
  computed: {
    disabled() {
      return this.total === 0
    },
  },
  created() {
    this.getList(false)
  },
  mounted() {
    window.onresize = () => {
      this.countHeight()
    }
    this.$nextTick(() => {
      this.countHeight()
    })
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight
      const num = 240 + h
      this.tableHeight = this.$computeHeight(num)
    },
    sizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    /**
     * @description: 获取不同状态对应的class类
     * @param {*} row：行数据
     * @return {*} class值： status-success:已支付   status-refund：退款中
     */
    getPayStatuClass(row) {
      if (row.order.payStatus === 1) {
        return 'status-success'
      } else if (row.order.payStatus === 5) {
        return 'status-refund'
      } else {
        return ''
      }
    },
    getUseStatus(row) {
      if (row.order.useStatus == 3) {
        return 'using'
      } else if (row.order.useStatus == 2) {
        return 'not-use'
      } else {
        return ''
      }
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
    createTime(order) {
      if (!order) {
        return ''
      } else {
        return parseTime(order.createTime, '{y}-{m}-{d} {hh}:{mm}:{ss}')
      }
    },
    // 获取订单列表
    getList(search = true) {
      this.listLoading = true

      let data = {}
      if (search) {
        // 带查询条件
        data = this.listQuery
      } else {
        // 查询表格数据不带查询条件
        data = {
          payStatus: 0,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        }
      }
      fetchOrderList(data).then((response) => {
        this.list = response.data.rows || []
        // 数据重置
        this.list.forEach((item) => {
          item.order.useStatus = String(item.order.useStatus)
          item.patient = item.patient || {}
          item.doctor = item.doctor || {}
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },

    // 查看/详情
    onDetail(row) {
      // 详情是公用组件，需要拼成相同的数据
      getOrderDetailWithMark(row.id ? row.id : row.order.id).then((res) => {
        this.detailInfo = res.data.order
        this.detailInfo.appMchDTO = res.data.appMchDTO // 收款商户信息
        this.detailInfo.activity = res.data.activity
        this.detailInfo.order = res.data.order
        this.detailInfo.discount = res.data.discount
        this.detailInfo.patient = JSON.parse(
          this.detailInfo.orderPackage
        ).patient
        this.detailInfo.product = JSON.parse(
          this.detailInfo.orderPackage
        ).product
        this.detailInfo.currentPrice = row.productSpec.currentPrice // 订单金额
        this.detailInfo.discountAmount = JSON.parse(this.detailInfo.orderPackage).discountAmount || 0 // 优惠券优惠金额
        this.detailVisible = true
      })
    },
    viewOrderAccount(row) {
      // console.log(row);
      this.$router.push({
        name: 'orderAccount',
        query: {
          id: row.order.id,
        },
      })
    },

    // 改变使用状态
    onChangeUseStatus(value, row) {
      const form = {
        id: row.order.id,
        useStatus: Number(value),
      }
      orderUpdate(form)
        .then((response) => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
        .finally(() => {
          this.getList()
        })
    },
    getNowFormatDate(Date) {
      var Y = Date.getFullYear()
      var M = Date.getMonth() + 1
      M = M < 10 ? '0' + M : M // 不够两位补充0
      var D = Date.getDate()
      D = D < 10 ? '0' + D : D
      var H = Date.getHours()
      H = H < 10 ? '0' + H : H
      var Mi = Date.getMinutes()
      Mi = Mi < 10 ? '0' + Mi : Mi
      var S = Date.getSeconds()
      S = S < 10 ? '0' + S : S
      return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S
    },
    // 导出
    onExport() {
      // 请求api地址
      const base = process.env.VUE_APP_BASE_API
      const params = this.setParams()
      const token = getToken()
      const fileName = '订单列表-' + this.getNowFormatDate(new Date()) + '.xls'
      // downloadExcel
      this.downloadExcel(
        base + '/cloud-hmall/order/export',
        params,
        fileName,
        token
      )
      // this.downloadExcel(base + '/order/export', params, token)

      return
    },

    // 搜索
    handleFilter() {
      this.$nextTick(() => {
        this.tableHeight = this.$computeHeight(336)
      })
      // 当搜索时间选择时，必须要输入时间
      if (
        this.listQuery &&
        this.listQuery.timeType &&
        !this.listQuery.datetime
      ) {
        this.$message({
          message: '起止时间不能为空',
          type: 'warning',
        })
        return
      }
      if (this.listQuery.datetime && !this.listQuery.timeType) {
        this.$message({
          message: '时间查询类型不能为空',
          type: 'warning',
        })
        return
      }
      if (this.listQuery && this.listQuery.datetime) {
        this.listQuery.start = this.listQuery.datetime[0] + ' 00:00:00'
        this.listQuery.end = this.listQuery.datetime[1] + ' 23:59:59'
      }
      this.listQuery.pageNo = 1
      this.getList()
    },

    // 设置get请求参数url
    setParams() {
      const temp = {
        pageSize: this.total,
      }
      const obj = {
        ...this.listQuery,
        ...temp,
      }
      return obj
      // let result = ''
      // let item
      // // 请求参数 + token
      // const obj = Object.assign(this.listQuery, { token: token })
      // for (item in obj) {
      //   if (obj[item] && String(obj[item])) {
      //     result += `&${item}=${obj[item]}`
      //   }
      // }
      // if (result) {
      //   result = '?' + result.slice(1)
      // }
      // return result
    },

    // 保留两位小数
    setDecimal(value) {
      if (!value) {
        return
      }
      return (value / 100).toFixed(2)
    },
    // 订单备注btn
    orderMark(row) {
      this.orderMarkInitInfo = row
      this.orderMarkVisible = true
    },
    // 订单备注成功更新列表
    orderMarkSuccess() {
      this.getList()
    },
  },
}
</script>
<style scoped lang="scss">
@import url(index.scss);
.filter-boxs {
  margin-bottom: 8px;
  padding-bottom: 0;
}
.filter-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.filter---multiline---wrapper .filter-item {
  margin-right: 40px;
  margin-bottom: 16px !important;
}
.filter---multiline---wrapper .el-button--primary {
  margin-bottom: 16px !important;
}
.detail-item {
  display: flex;
  margin-bottom: 16px;
}
.detail-item .title {
  width: 70px;
  padding-right: 8px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: right;
  color: #999999;
}
.detail-item .text {
  color: #333;
}
.detail-item .product img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}
.detail-container {
  font-size: 14px;
  overflow-y: scroll;
  padding: 24px;
  .detail-sub-title {
    margin-bottom: 16px;
    //border-left: 2px solid #0066CC;
    //padding-left: 8px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
  }
}
.export-btn {
  margin-left: 0;
}
.empty img {
  width: 98px;
  height: 64px;
}
.gender {
  color: #666;
  font-size: 12px;
}
.space-gender {
  margin: 0;
}
.text----product {
  display: flex;
  flex-direction: column;
}

.pa-table th,
.pa-table td .status-success {
  color: #0066cc;
}

.pa-table th,
.pa-table td .status-refund {
  color: #ef4f3c;
}

.not-use ::v-deep .el-input__inner {
  color: #0066cc !important;
}

.using ::v-deep .el-input__inner {
  color: #ef4f3c !important;
}
</style>
