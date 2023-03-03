<template>
  <div class="app-container refund">
    <div class="filter-container filter-box filter-boxs">
      <div
        class="filter-wrapper filter---multiline---wrapper"
        ref="filterWrapper"
      >
        <filter-select
          :value.sync="listQuery.status"
          :options="refundStatusOptions"
          title="退款状态"
        />
        <filter-daterang-picker
          :value.sync="listQuery.datetime"
          title="申请时间"
        />
        <div class="flex specalBox">
          <span style="line-height: 32px; color: #333">订单编号</span>
          <el-input
            v-model.trim="listQuery.orderCode"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="请输入订单编号"
            style="padding: 0 40px 0 8px; width: 53.5%; color: #333"
          />
          <el-button type="primary" class="pa-btn" @click="handleFilter(false)">
            <i class="el-icon-search" />
            查询
          </el-button>
          <!-- TODO：先隐藏，系统其他地方没有重置按钮，暂时保持一致 -->
          <el-button
            class="pa-btn"
            icon="iconfont icon-zhongzhi"
            style="margin: 0 16px 16px 16px; padding-left: 16px"
            @click="refresh"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="listData"
        :height="tableHeight"
         style="width: 100%"
        class="pa-table"
      >
        <el-table-column label="序号" type="index" width="60px">
        </el-table-column>
        <el-table-column
          label="订单编号"
          width="170px"
          prop="orderCode"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.order.orderCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="服务名称"
          min-width="125px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span class="service">{{ row.order.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="patientName"
          label="患者"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span class="service"
              >{{ row.patient.name }}
              <span style="padding-left: 5px">{{
                row.patient.sex === 2 ? '女' : '男' || '未知'
              }}</span>
              | {{ row.patient.age }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="sumTotal"
          label="实付金额(元)"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span class="service">{{ row.order.sumTotal | currencyYuan }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sumMoney"
          label="申请退款金额(元)"
          min-width="140"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span class="service">{{
              row.refund.sumMoney | currencyYuan
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          show-overflow-tooltip
          min-width="170px"
        >
          <template slot-scope="{ row }" show-overflow-tooltip>
            <span class="service">{{ row.refund.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="useStatus"
          label="服务状态"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span :class="getUseStatus(row)">{{
              translate(row.order.useStatus, serveStatusOptions)
            }}</span>
          </template>
        </el-table-column>
        <!-- TODO：暂时隐藏下版本做 -->
        <el-table-column prop="status" label="发票状态" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span :class="getInvoiceClass(row)">
              <!-- {{
              translate(row.order.status, invoiceStatusOptions)
            }} -->
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payStatus"
          label="退款状态"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span :class="getPayStatuClass(row)">{{
              translate(row.refund.status, refundStatusOptions)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundReason"
          label="退款原因"
          show-overflow-tooltip
          min-width="130px"
        >
          <template slot-scope="{ row }">
            <span class="service">{{ row.refund.refundReason }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.actions')"
          width="130"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <!-- 待处理 和 退款失败 显示处理按钮 -->
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="openDraw(true, row)"
              :disabled="row.refund.status !== 1 && row.refund.status !== 5"
            >
              处理
            </el-button>
            <!-- 买家已取消、管家已拒绝、退款中、退款失败、退款成功显示详情 -->
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="openDraw(false, row)"
              :disabled="
                row.refund.status != 2 &&
                row.refund.status != 3 &&
                row.refund.status != 4 &&
                row.refund.status != 5 &&
                row.refund.status != 6
              "
            >
              详情
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
    <div class="rightDraw">
      <el-drawer
        :title="isDisabled ? '处理详情' : '退款详情'"
        :visible.sync="isModify"
        :direction="'rtl'"
        :size="400"
        :wrapperClosable="false"
        v-if="isModify"
      >
        <div
          :style="
            isDisabled
              ? 'padding: 16px 24px 100px 24px; overflow: scroll; height: 100%'
              : 'padding: 16px 24px; overflow: scroll; height: 100%'
          "
        >
          <!-- // 订单信息 -->
          <div class="orderMation">
            <div class="content">
              <el-form
                ref="ruleForm"
                :model="form"
                :rules="rules"
                align="left"
                class="diaBox"
              >
                <div
                  :class="!isDisabled ? 'title titleOne' : 'title'"
                  v-if="!isDisabled"
                >
                  <label>处理详情</label>
                </div>
                <div v-if="!isDisabled">
                  <div>
                    <el-form-item label="处理结果:">
                      <span :class="getPayStatuClass(form)">{{
                        translate(form.refund.status, refundStatusOptions)
                      }}</span>
                    </el-form-item>
                    <el-form-item
                      label="失败原因:"
                      v-if="form.refund.status == 5"
                    >
                      {{ form.refund.errCodeDes }}
                    </el-form-item>
                    <el-form-item label="处理时间:">
                      {{ form.refund.updateTime }}
                    </el-form-item>
                    <el-form-item label="退款金额:">
                      <span v-if="form.refund.refundMoney">
                        {{ form.refund.refundMoney | currencyYuan }}</span
                      >
                    </el-form-item>
                    <el-form-item label="退款类型:">
                      {{ translate(form.refund.type, reBackOptions) }}
                    </el-form-item>
                    <el-form-item label="对外说明:">
                      {{ form.refund.adminRemark }}
                    </el-form-item>
                  </div>
                </div>
                <div :class="isDisabled ? 'title titleOne' : 'title'">
                  <label>订单信息</label>
                </div>
                <div>
                  <div>
                    <el-form-item label="订单编号:">
                      {{ form.order.orderCode }}
                    </el-form-item>
                    <el-form-item label="订单套餐:">
                      {{ form.order.productName }}
                    </el-form-item>
                    <el-form-item label="下单时间:">
                      {{ form.order.createTime }}
                    </el-form-item>
                    <el-form-item label="订单状态:">
                      <span :class="getOrderPayStatuClass(form)">{{
                        translate(form.order.payStatus, orderStatusOptions)
                      }}</span>
                    </el-form-item>
                    <el-form-item label="服务状态:">
                      <span :class="getUseStatus(form)">{{
                        translate(form.order.useStatus, serveStatusOptions)
                      }}</span>
                    </el-form-item>
                    <el-form-item label="订单金额:">
                      <span v-if="form.productSpec ? form.productSpec.currentPrice : ''">
                        {{ form.productSpec.currentPrice | currencyYuan }}
                      </span>
                    </el-form-item>
                    <el-form-item label="优惠金额:" v-if="form.order.couponId">
                      <span>
                        {{ form.order.discountAmount | currencyYuan }}
                      </span>
                    </el-form-item>
                    <el-form-item label="实付金额:">
                      <span v-if="form.order ? form.order.sumTotal : ''">
                        {{ form.order.sumTotal | currencyYuan }}
                      </span>
                    </el-form-item>
                    <el-form-item label="买家姓名:">
                      {{ form.patient.name }}
                    </el-form-item>
                    <el-form-item label="手机号码:">
                      {{ form.patient.mobile }}
                    </el-form-item>
                    <!-- TODO：先隐藏，下版本做发票 -->
                    <el-form-item
                      label="发票状态:"
                      :class="getInvoiceClass(form)"
                    >
                      <!-- {{ translate(form.patient.status, invoiceStatusOptions) }} -->
                    </el-form-item>
                    <el-form-item label="支付账单:">
                      {{ form.order.transactionId }}
                    </el-form-item>
                    <el-form-item label="收款商户:">
                      {{ form.appMchName }}
                    </el-form-item>
                  </div>
                </div>
                <div class="title">
                  <label>{{ '申请详情' }}</label>
                </div>
                <div>
                  <div>
                    <el-form-item label="退款原因:">
                      {{ form.refund.refundReason }}
                    </el-form-item>
                    <el-form-item label="申请金额:">
                      <span class="status-refund">{{
                        form.refund.sumMoney | currencyYuan
                      }}</span>
                    </el-form-item>
                    <el-form-item label="申请时间:">
                      {{ form.refund.createTime }}
                    </el-form-item>
                    <el-form-item label="退款方式:">
                      <span class="status-refund">{{
                        translate(form.refund.way, backTypeOptions)
                      }}</span>
                    </el-form-item>
                    <el-form-item label="退款说明:">
                      <span class="textSolve">
                        <span slot="reference">{{ form.refund.remark }}</span>
                      </span>
                    </el-form-item>
                  </div>
                </div>
                <div class="title" v-if="isDisabled">
                  <label>处理详情</label>
                </div>
                <div v-if="isDisabled" class="specialTab">
                  <el-form-item label="处理意见:">
                    <div v-if="statusRadio">
                      <el-radio-group v-model="statusRadio">
                        <el-radio
                          v-model="statusRadio"
                          :label="3"
                          :disabled="!isDisabled"
                          >同意</el-radio
                        >
                        <el-radio
                          v-model="statusRadio"
                          :label="6"
                          :disabled="!isDisabled"
                          >拒绝</el-radio
                        >
                      </el-radio-group>
                    </div>
                  </el-form-item>
                  <el-form-item label="退款金额:" v-if="statusRadio == '3'">
                    <span
                      class="status-refund"
                      v-if="form.refund ? form.refund.refundMoney : ''"
                      >{{ form.refund.refundMoney | currencyYuan }}</span
                    >
                  </el-form-item>
                  <el-form-item
                    label="退款类型:"
                    v-if="statusRadio == '3'"
                    class="status-refund"
                  >
                    <span class="status-refund">{{
                      translate(form.refund.type, reBackOptions)
                    }}</span>
                  </el-form-item>
                  <el-form-item
                    label="对外说明:"
                    prop="refund.adminRemark"
                    :rules="[
                      {
                        required: statusRadio === 6,
                        message: '请输入说明',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      type="textarea"
                      v-model="form.refund.adminRemark"
                      v-input-trim
                      maxlength="200"
                      show-word-limit
                      class="textarea pa-input"
                      :disabled="!isDisabled"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <div slot="footer" class="dialog-footer" v-if="isDisabled">
            <el-button @click="isModify = false" class="pa-btn"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="submit()"
              style="margin-left: 24px"
              class="pa-btn"
              >确 定</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="showEditMyProfile"
        :close-on-click-modal="false"
        :show-close="!showLoading"
        width="30%"
      >
        <div style="min-height: 120px; margin: 0 24px">
          <div v-if="!showLoading">
            <i
              class="icon iconfont icon-jinggao"
              style="padding-right: 8px; line-height: 60px"
            ></i
            >您即将发起全额退款,请确定操作
          </div>
          <div
            v-if="showLoading"
            v-loading="showLoading"
            style="min-height: 40px; margin-top: 30px; padding-bottom: 10px"
          ></div>
          <div v-if="showLoading" style="text-align: center">
            正在退款中,请稍后......
            <span id="daoji">({{ countDown + 's' }})</span>
          </div>
          <span slot="footer" class="dialog-footer" v-if="!showLoading">
            <el-button @click="cancelEditMyProfile">取 消</el-button>
            <el-button type="primary" @click="editMyProfile">确 定</el-button>
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRefundList,
  getOrderUpdate,
  getOrderStatus,
} from '@/api/refundManagement'
export default {
  name: 'refund',
  data() {
    return {
      rules: {},
      tableKey: 0,
      tableHeight: 500,
      listData: null, // 表格数据源
      total: 0,
      listLoading: false,
      isModify: false,
      isDisabled: false,
      // 弹窗数据源
      form: [],
      statusRadio: 3, // 同意拒绝
      // 详情信息
      listQuery: {
        pageNo: 1, // 页码
        pageSize: 10, // 分页大小
        status: 0,
        orderCode: '', //订单编号
        start: '',
        end: '',
        timeType: '',
      },
      // 退款状态  1 待处理 2 买家已取消 3 退款中 4 退款成功 5 退款失败 6 管家已拒绝
      refundStatusOptions: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '待处理',
          value: 1,
        },
        {
          label: '买家已取消',
          value: 2,
        },
        {
          label: '退款中',
          value: 3,
        },
        {
          label: '退款成功',
          value: 4,
        },
        {
          label: '退款失败',
          value: 5,
        },
        {
          label: '管家已拒绝',
          value: 6,
        },
      ],
      countDown: 10,
      showLoading: false,
      showEditMyProfile: false,
      // 服务状态  * 1 已完成 2 待使用 3 使用中 4 未购买
      serveStatusOptions: [
        {
          label: '已完成',
          value: 1,
        },
        {
          label: '待使用',
          value: 2,
        },
        {
          label: '使用中',
          value: 3,
        },
        {
          label: '未购买',
          value: 4,
        },
      ],
      // * 订单状态 1 已支付 2 待支付 3 已取消 4 已退款 5 退款中 6 已完成
      orderStatusOptions: [
        {
          label: '已支付',
          value: 1,
        },
        {
          label: '待支付',
          value: 2,
        },
        {
          label: '已取消',
          value: 3,
        },
        {
          label: '已退款',
          value: 4,
        },
        {
          label: '退款中',
          value: 5,
        },
        {
          label: '已完成',
          value: 6,
        },
      ],
      // 发票状态  * 1 已开票 2 未开票 3 开票中
      invoiceStatusOptions: [
        {
          label: '已开票',
          value: 1,
        },
        {
          label: '未开票',
          value: 2,
        },
        {
          label: '开票中',
          value: 3,
        },
      ],
      reBackOptions: [
        {
          label: '全额退款',
          value: 1,
        },
      ],
      // 退款方式
      backTypeOptions: [
        {
          label: '原路退回',
          value: 1,
        },
      ],
    }
  },
  computed: {},
  created() {},
  mounted() {
    // 首次进入关闭校验
    this.handleFilter()
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
    refresh() {
      ;(this.listQuery = {
        pageNo: 1, // 页码
        pageSize: 10, // 分页大小
        status: null,
        orderCode: '', //订单编号
        start: '',
        end: '',
      }),
        (this.isModify = false)
      this.showLoading = false
      this.showEditMyProfile = false
      this.handleFilter(false)
    },
    // 改变服务状态的色值
    getUseStatus(row) {
      if (row.order.useStatus == 3) {
        return 'using'
      } else if (row.order.useStatus == 2) {
        return 'not-use'
      } else {
        return ''
      }
    },
    getInvoiceClass() {
      return ''
    },
    // 改变退款状态的色值
    getPayStatuClass(row) {
      if (row.refund.status === 1) {
        return 'stauts-yellow'
      } else if (row.refund.status === 5) {
        return 'status-refund'
      } else {
        return ''
      }
    },
    // 改变订单状态的色值
    getOrderPayStatuClass(row) {
      if (row.order.status === 1) {
        return 'status-success'
      } else if (row.order.status === 5) {
        return 'status-refund'
      } else {
        return ''
      }
    },
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight
      const num = 200 + h
      this.tableHeight = this.$computeHeight(num)
    },
    sizeChange(val) {
      this.listQuery.pageSize = val
      this.handleFilter()
    },
    currentChange(val) {
      this.listQuery.pageNo = val
      this.handleFilter(true)
    },
    // 转换表格显示内容
    translate(val, listData) {
      let result = ''
      listData.forEach((item) => {
        if (val === item.value) {
          result = item.label
        }
      })
      return result
    },
    // 点击某一行操作，打开弹窗 'true'是编辑 'false'是查看详情 用type接收
    openDraw(type, data) {
      this.isModify = true
      this.isDisabled = type
      this.form = this.$lodash.cloneDeep(data)
    },
    // TODO：补充该功能
    // 点击确定按钮后，请求接口，直接倒计时，根据接口返回展示不同状态
    editMyProfile() {
      const params = {
        id: this.form.refund.id,
        orderCode: this.form.order.orderCode,
        status: this.statusRadio,
        type: this.form.refund?.type,
        adminRemark: this.form?.refund?.adminRemark,
      }
      getOrderUpdate(params)
        .then((response) => {
          this.start()
        })
        .catch((res) => {
          this.$message.error(res.msg)
          this.refresh()
          this.handleFilter()
        })
    },
    start() {
      this.showLoading = true
      this.countDown = 10
      const timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--
        } else {
          clearInterval(timer)
          // 查询订单退款的状态

          getOrderStatus(this.form.refund.id)
            .then((response) => {
              //  1 待处理 2 买家已取消 3 退款中 4 退款成功 5 退款失败 6 管理已拒绝
              if (response.data.refund.status == 1) {
                this.$message.error('退款失败，请重新操作')
              }
              if (response.data.refund.status == 2) {
                this.$message.error('买家已取消退款申请，请核对后再操作')
              }
              if (response.data.refund.status == 5) {
                this.$message.error(response.data.refund.errCodeDes)
              }
              if (response.data.refund.status == 4) {
                this.$message.success('该订单已成功退款')
              }
              if (response.data.refund.status == 3) {
                this.$message.error('该订单尚在退款中，请稍后')
              }
              if (response.data.refund.status == 6) {
                this.$message.error('管家已拒绝退款申请，请核对后再操作')
              }
            })
            .catch(() => {})
          this.refresh()
          this.handleFilter()
        }
      }, 1000)
    },
    cancelEditMyProfile() {
      this.showEditMyProfile = false
      this.showLoading = false
    },
    // 点击确定按钮触发
    submit() {
      if (this.statusRadio === 3) {
        this.showEditMyProfile = true
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const params = {
              id: this.form.refund.id,
              orderCode: this.form.order.orderCode,
              status: this.statusRadio,
              type: this.form.refund?.type,
              adminRemark: this.form?.refund?.adminRemark,
            }
            getOrderUpdate(params).then((response) => {
              this.refresh()
              this.handleFilter()
            })
          }
        })
      }
    },
    // 查询订单列表
    handleFilter(val) {
      this.$nextTick(() => {
        this.tableHeight = this.$computeHeight(240)
      })
      if (this.listQuery && this.listQuery.datetime) {
        this.listQuery.start = this.listQuery.datetime[0] + ' 00:00:00'
        this.listQuery.end = this.listQuery.datetime[1] + ' 23:59:59'
      }
      if (!val) this.listQuery.pageNo = 1
      const params = this.listQuery
      // 请求接口并给tableData赋值
      this.listLoading = true
      getRefundList(params).then((response) => {
        this.listData = response.data.rows || []
        this.total = response.data.total
        this.listLoading = false
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import url(index.scss);
.filter-boxs {
  margin-bottom: 0;
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
.diaBox .el-form-item {
  margin-bottom: 0;
}
.textSolve {
  display: -webkit-box;
  word-break: break-all;
}
.dialog-footer {
  display: flex;
  justify-content: end;
  position: absolute;
  bottom: 0px;
  left: 0px;
  background: #fff;
  width: 100%;
  justify-content: end;
  box-sizing: border-box;
  padding: 20px 24px;
  border-top: 1px solid #ddd;
}
.title {
  border-left: 2px solid #0066cc;
  padding-left: 4px;
  height: 14px;
  line-height: 14px;
  margin: 16px 0 8px 0;
}
.title-head {
  margin: 0 0 8px 0;
}
.not-use {
  color: #ffb828;
}

.using {
  color: #ef4f3c;
}
.status-success {
  color: #0066cc;
}

.status-refund {
  color: #ef4f3c;
}
.stauts-yellow {
  color: #ffb828;
}
.orderNo >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.title label {
  color: #333;
}
.filter-item span {
  color: #333;
}
.table-box {
  margin-top: 8px;
  padding-top: 8px;
}
.orderMation .el-form-item__label {
  padding: 0 4px 0 0;
}
.titleOne {
  margin-top: 4px;
}
.iconfont.icon-jinggao {
  color: #faad14;
}
.error-box {
  border-bottom: 1px solid #ebebeb;
  .iconfont.icon-jinggao {
    margin-right: 8px;
    color: inherit;
    font-size: 12px;
  }
}
</style>
