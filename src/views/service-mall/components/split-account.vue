<template>
  <div class="aplitAccont">
    <el-form-item
      label="收款商户"
      prop="receiveMchId"
      :rules="[ValidateRules.SelectReceivingAccountRequired]"
    >
      <pa-select
        :value.sync="vModel.receiveMchId"
        :options="accountSelection"
        :disabled="vModel.specList.length >= 1"
        :clearable="false"
        class="form-long-select"
      />

      <span style="padding-left: 8px; color: #999"
        >添加规格后收款商户不可变更，如需变更请先删除规格信息再操作</span
      >
    </el-form-item>
    <div class="spec-list">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <span class="total">总库存：{{ stockTotal }}</span>
        </el-col>
        <el-col>
          <div class="handler">
            <el-button
              type="primary"
              class="pa-btn"
              @click="addSpec()"
              :disabled="vModel.specList.length >= 10"
            >
              <i class="el-icon-plus" />
              添加规格
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-form-item
        prop="specList"
        :rules="[ValidateRules.SpecListRequired, specListValidator]"
        label-width="auto"
      >
        <el-table
          class="pa-table spec-table mt-8"
          :data="vModel.specList"
          ref="specList"
        >
          <el-table-column
            prop="specName"
            label="规格名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="stockAmount" label="库存"></el-table-column>
          <el-table-column prop="originalPrice" label="原价（元）">
            <template slot-scope="{ row }">
              {{ row.originalPrice | currency }}
            </template>
          </el-table-column>
          <el-table-column prop="currentPrice" label="销售价（元）">
            <template slot-scope="{ row }">
              {{ row.currentPrice | currency }}
            </template>
          </el-table-column>
          <el-table-column prop="costPrice" label="成本价（元）">
            <template slot-scope="{ row }">
              {{ row.costPrice | currency }}
            </template>
          </el-table-column>
          <el-table-column prop="tips" label="提示">
            <template slot-scope="{ row }">
              <span v-show="row.invalid">
                <i class="icon iconfont icon-jinggao"></i>
                超过分账比例
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="text" @click="editSpec(row, $index)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteSpec($index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
    <el-dialog
      title="添加规格"
      width="1000px"
      :visible.sync="drawerVisible"
      v-if="drawerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="specForm"
        class="spec-form"
        label-position="left"
        :model="edittingSpec"
        label-width="90px"
      >
        <header-box title="规格设置" />
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              label="规格名称"
              prop="specName"
              :rules="[
                ValidateRules.InputSpecRequired,
                ValidateRules.Between2to20,
                specNameValidator,
              ]"
            >
              <el-input
                class="pa-input"
                min="2"
                v-model="edittingSpec.specName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="规格库存"
              prop="stockAmount"
              :rules="[
                ValidateRules.InputStockRequired,
                ValidateRules.StockValid,
              ]"
            >
              <el-input
                class="pa-input"
                v-model.number="edittingSpec.stockAmount"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="规格成本价"
              prop="costPrice"
              :rules="[
                ValidateRules.InputCostPriceRequired,
                ValidateRules.AccountValid,
              ]"
            >
              <input-amount
                class="pa-input"
                v-model="edittingSpec.costPrice"
              ></input-amount>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              label="规格原价"
              prop="originalPrice"
              :rules="[
                ValidateRules.InputOriginalPriceRequired,
                ValidateRules.AccountValid,
              ]"
            >
              <input-amount
                class="pa-input"
                v-model="edittingSpec.originalPrice"
              ></input-amount>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="规格销售价"
              prop="currentPrice"
              :rules="[
                ValidateRules.InputSalePriceRequired,
                ValidateRules.AccountValid,
              ]"
            >
              <input-amount
                class="pa-input"
                v-model="edittingSpec.currentPrice"
              ></input-amount>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="error-box" :style="errorMsg ? 'padding-bottom:16px;' : ''">
          <el-alert v-show="errorMsg" type="error" :closable="false">
            <template slot="title">
              <i class="icon iconfont icon-jinggao"></i>
              <span>{{ errorMsg }}</span>
            </template>
          </el-alert>
        </div>
        <header-box title="分账设置" />
        <el-row class="isShared">
          <el-col>
            <el-form-item
              label="是否分账:"
              label-width="90px;"
              prop="profitShared"
              :rules="[ValidateRules.RadioSalePriceRequired, radioChange]"
            >
              <el-radio-group
                v-model="edittingSpec.profitShared"
                class="radioGroup"
                @change="changeRadio()"
              >
                <el-radio :label="0">不分账</el-radio>
                <el-radio :label="1" style="color: #333">
                  {{
                    showChange(vModel.receiveMchId) == 1
                      ? '直连分账(平台商户号)'
                      : '特约商户分账(非平台商户号)'
                  }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="accountSetting isSharedT flex mb-10">
          <div>
              <div class="mr-40">
                <span class="islabel">收款商户微信结算费:</span>
                {{ payFee | currency }}
                (费率{{ feeRate | formatPercentage('0.00') }})
              </div>
          </div>
          <div>
              <div class="mr-40"  v-if="edittingSpec.profitShared != 0">
                 <span class="islabel">收款商户对外分账最大比例:</span>
                {{ maxSharePercent | formatPercentage('0.00') }}
              </div>
          </div>
          <div>
              <div  v-if="edittingSpec.profitShared != 0">
                 <span class="islabel">当前剩余可对外分账金额:</span>
                {{ richMoney | currencyThree }}
              </div>
          </div>
        </div>
        <el-row type="flex" justify="space-start">
          <div class="handler" v-if="edittingSpec.profitShared != 0">
            <el-button
              class="pa-btn"
              type="primary"
              @click="addShareAccount"
              :disabled="addShareAccountDisabled"
            >
              <i class="el-icon-plus" />
              添加分账方
            </el-button>
          </div>
        </el-row>
        <el-table
          :style="edittingSpec.profitShared != 0 ? 'margin-top:8px' : ''"
          class="pa-table spec-table table-form"
          :data="profitShareList"
          ref="specList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="55"
          ></el-table-column>
          <el-table-column prop="shareMchId" label="商户号名称">
            <template slot-scope="{ $index }">
              <el-form-item
                label-width="auto"
                :prop="`profitShareList[${$index}].shareMchId`"
                :rules="[
                  {
                    required: true,
                    message: '请选择分账方',
                    trigger: 'change',
                  },
                ]"
              >
                <pa-select
                  :value.sync="edittingSpec.profitShareList[$index].shareMchId"
                  :options="
                    getShareAccountSelection(
                      edittingSpec.profitShareList[$index].shareMchId
                    )
                  "
                  :disabled="$index == 0"
                  :clearable="false"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="specName" label="商户号">
            <template slot-scope="{ row }">
              {{ getAccountMchId(row.shareMchId) }}
            </template>
          </el-table-column>
          <el-table-column prop="sharePercent" label="分账类型">
            <template slot-scope="{ $index }">
              {{ $index == 0 ? '收款商户' : '分账方' }}
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="分账金额（元）">
            <template slot-scope="{ $index }">
              <el-form-item
                label-width="auto"
                :prop="`profitShareList[${$index}].shareMoney`"
                :rules="[
                  {
                    required: true,
                    message: '请输入分账金额',
                    trigger: 'blur',
                  },
                  ValidateRules.AccountValid,
                ]"
              >
                <input-amount
                  class="pa-input"
                  :disabled="$index == 0"
                  v-model="edittingSpec.profitShareList[$index].shareMoney"
                ></input-amount>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sharePercent" label="微信结算费(元)">
            <template slot-scope="{ $index }">
              {{ $index == 0 ? payFee : 0 | currency }}
            </template>
          </el-table-column>
          <el-table-column prop="sharePercent" label="分账比例">
            <template slot-scope="{ row }">
              {{ calcSharePercent(row.shareMoney) | formatPercentage('0.00') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="{ $index }">
              <el-button
                type="text"
                @click="deleteShareAccount($index)"
                :disabled="$index == 0"
                :style="$index == 0 ? 'color:#333' : ''"
              >
                {{ $index == 0 ? '-' : '删除' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawerCancel">取 消</el-button>
        <el-button type="primary" @click="drawerOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import numeral from 'numeral'
import { cloneDeep, find } from 'lodash'
import { getAccount } from '@/api/account'
export default {
  props: {
    vModel: {
      type: Object,
      default: () => ({}),
    },
  },
  model: {
    event: 'change',
    prop: 'vModel',
  },
  data() {
    const specNameValidator = (rule, value, cb) => {
      if (!value) {
        return cb()
      }
      const hasSameName = this.vModel.specList.some((item, index) => {
        return index !== this.edittingIndex && item.specName === value
      })
      if (hasSameName) {
        return cb(new Error('该规格名称已使用'))
      }
      cb()
    }
    const specListValidator = (rule, value, cb) => {
      let n = 0
      value.forEach((item) => {
        if (this.checkSharePercent(item)) {
          this.$set(item, 'invalid', true)
          n++
        } else {
          this.$set(item, 'invalid', false)
        }
      })
      if (n > 0) {
        return cb(
          new Error(
            `以上有${n}个规格的分账比例超过收款商户的分账比例限制，请修改再保存服务！`
          )
        )
      }
      cb()
    }
    const radioValidator = (rule, value, cb) => {
      if (!value) {
        return cb()
      }
      cb()
    }
    return {
      drawerVisible: false,
      feeRate: 0, // 费率
      maxSharePercent: 0,
      accountSelection: [],
      edittingIndex: -1,
      oldValue: '',
      edittingSpec: {
        specName: '',
        currentPrice: '', // 规格销售价
        originalPrice: '', // 规格原价
        costPrice: '', // 规格成本价
        stockAmount: 1000,
        profitShareList: [],
        profitShared: 0,
        edittingSpec: 0,
      },
      splitAccountSelection: [],
      baseShareAccount: {},
      errorMsg: '',
      specNameValidator: {
        validator: specNameValidator,
        trigger: 'blur',
      },
      specListValidator: {
        validator: specListValidator,
        trigger: 'change',
      },
      radioChange: {
        validator: radioValidator,
        trigger: 'change',
      },
    }
  },
  computed: {
    stockTotal() {
      let total = 0
      this.vModel.specList.forEach((item) => {
        if (item.stockAmount > 0) {
          total += item.stockAmount
        }
      })
      return total
    },
    profitShareList() {
      // 分账列表，除去医管
      return this.edittingSpec.profitShareList
    },
    addShareAccountDisabled() {
      return (
        this.profitShareList.length >=
        Math.min(this.splitAccountSelection.length, 20)
      )
    },
    payFee() {
      // 0.004968，千分位4，不够四舍五入到百分位，无需收手续费
      // 0.005022，千分位5，够四舍五入到百分位，收取手续费0.01
      let result = this.edittingSpec.currentPrice * this.feeRate
      if (result) {
        result = Number(numeral(result).format('0'))
      }
      return result
    },
    fenzhangAll() {
      let result = 0
      this.edittingSpec.profitShareList.forEach((item, index) => {
        if (index > 0) {
          result += Number(item.shareMoney)
        }
      })
      return result
    },
    // 当前剩余可对外分账金额(规格销售价-微信结算费）*对外分账最大比例-分账方分账金额总和)，格式¥0.00，默认¥0.00
    richMoney() {
      let result = this.edittingSpec.currentPrice * this.feeRate
      if (result) {
        result = Number(numeral(result).format('0'))
      }
      return (
        (this.edittingSpec.currentPrice - result) * this.maxSharePercent -
        this.fenzhangAll
      )
    },
  },
  watch: {
    edittingSpec: {
      handler: function (newValue) {
        this.checkSharePercent(this.edittingSpec)
      },
      deep: true,
      immediate: true,
    },
    'vModel.receiveMchId': {
      handler: function (newValue) {
        this.accountChanged()
      },
    },
    'edittingSpec.profitShared': {
      handler: function (newValue, oldValue) {
        this.oldValue = oldValue
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getAccountSelection()
  },
  mounted() {},
  methods: {
    // 微信结算费：四舍五入；默认¥0.00(0.60%)；计算公式：规格销售价*微信结算费率
    wechatSettlementFee(price, feeRate) {
      let result = price * feeRate
      if (result) {
        result = Number(numeral(result).format('0'))
      }
      return result
    },
    changeRadio() {
      if (
        this.edittingSpec.profitShared == 0 &&
        this.profitShareList.length > 1
      ) {
        this.$confirm('切换分账方式将删除已配置分账方信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 清空分账商户的信息
            this.profitShareList.splice(1, this.profitShareList.length)
          })
          .catch(() => {
            this.edittingSpec.profitShared = this.oldValue
          })
      }
    },
    // 转换出对应的收款商户类型
    showChange(receiveMchId) {
      let result = ''
      this.accountSelection.forEach((item) => {
        if (item.value == receiveMchId) {
          result = item.platform
        }
      })
      return result
    },
    getAccountSelection() {
      getAccount().then((data) => {
        // 收款账户
        this.accountSelection = []
        // 分账账户
        this.splitAccountSelection = []
        data.forEach((item) => {
          // 是否可用 不可用就返回空
          if (item.status !== 1) {
            return
          }
          // 是否是收款账户
          if (item.payReceive === 1) {
            this.accountSelection.push(item)
          }
          // 服务商无法收钱，帅选服务商 (TODO:和后台同步)
          if (item.type !== 0) {
            this.splitAccountSelection.push(item)
          }
          // 判断为平安医管分账账户
          // if (item.platform === 1) {
          //   this.baseShareAccount = item
          // }

          // 分账基础账号由原来平安医管分账账户改为当前选择的收款商户
          if (item.id === this.vModel.receiveMchId) {
            this.baseShareAccount = item
          }
        })
        if (this.accountSelection.length) {
          if (!this.$route.query.id) {
            this.vModel.receiveMchId = this.accountSelection[0].id
          }
          this.getMaxSharePercent()
          // this.chechSpecListValid();
        }
      })
    },
    accountChanged(value) {
      this.$nextTick(() => {
        this.getMaxSharePercent()
        this.chechSpecListValid()
      })
    },
    getMaxSharePercent() {
      // 根据选择收款账户，计算最大分账比例
      const receiveAccount = find(this.accountSelection, {
        value: this.vModel.receiveMchId,
      })
      if (receiveAccount) {
        this.maxSharePercent = receiveAccount.shareMaxPercent / 100
        this.feeRate = receiveAccount.accountRate / 10000 //费率后台存储的是万分之几
      } else {
        this.maxSharePercent = 0
      }
    },
    addSpec() {
      if (this.vModel.specList.length >= 10) {
        return
      }
      this.accountSelection.forEach((item, index) => {
        if (item.id == this.vModel.receiveMchId) {
          this.baseShareAccount = this.accountSelection[index]
        }
      })
      const baseShareAccount = {
        shareMchId: this.baseShareAccount.id,
        shareMoney: '',
      }
      const spec = {
        specName: '',
        currentPrice: '', // 规格销售价
        originalPrice: '', // 规格原价
        costPrice: '', // 规格成本价
        stockAmount: 1000,
        profitShareList: [baseShareAccount],
        profitShared: this.edittingSpec.profitShared,
      }
      this.editSpec(spec, -1)
    },
    editSpec(row, edittingIndex) {
      this.accountSelection.forEach((item, index) => {
        if (item.id == this.vModel.receiveMchId) {
          this.baseShareAccount = this.accountSelection[index]
        }
      })
      this.edittingIndex = edittingIndex
      if (!row.profitShared) {
        row.profitShared = 0
      }
      this.edittingSpec = cloneDeep(row)
      this.drawerVisible = true
    },
    drawerOK() {
      if (
        this.profitShareList.length > 1 ||
        this.edittingSpec.profitShared == 0
      ) {
        this.$refs.specForm.validate((valid) => {
          if (!valid || this.errorMsg) {
            return
          }
          const specItem = cloneDeep(this.edittingSpec)
          if (this.edittingIndex > -1) {
            // 编辑规格
            this.$set(this.vModel.specList, this.edittingIndex, specItem)
          } else {
            // 新增规格
            this.vModel.specList.push(specItem)
          }
          this.chechSpecListValid()
          this.drawerCancel()
        })
      } else {
        this.$message.error('尚未添加分账方')
      }
    },
    drawerCancel() {
      this.errorMsg = ''
      this.drawerVisible = false
      this.edittingSpec = {
        specName: '',
        currentPrice: '', // 规格销售价
        originalPrice: '', // 规格原价
        costPrice: '', // 规格成本价
        stockAmount: 1000,
        profitShareList: [],
      }
      this.$refs.specForm.clearValidate()
    },
    deleteSpec(index) {
      this.$confirm(`确定删除此规格？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.vModel.specList.splice(index, 1)
        this.chechSpecListValid()
      })
    },
    chechSpecListValid() {
      this.$parent.$parent.$refs.ruleForm.validateField('specList')
    },
    addShareAccount() {
      this.edittingSpec.profitShareList.push({
        shareMchId: '',
        shareMoney: '',
      })
    },
    deleteShareAccount(index) {
      this.$confirm(`确定删除此分账账号？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.edittingSpec.profitShareList.splice(index, 1)
      })
    },
    getShareAccountSelection(currentValue) {
      return this.splitAccountSelection.filter((item) => {
        const isCurrentValue = item.id === currentValue
        if (isCurrentValue) {
          return true
        }
        const itemSelected = this.edittingSpec.profitShareList.some(
          (accountItem) => accountItem.shareMchId === item.id
        )
        return !itemSelected
      })
    },
    calcSharePercent(shareMoney) {
      // 规格销售价
      if (shareMoney && this.edittingSpec.currentPrice) {
        let result = this.edittingSpec.currentPrice * this.feeRate
        if (result) {
          result = Number(numeral(result).format('0'))
        }
        return shareMoney / (this.edittingSpec.currentPrice - result)
      } else {
        return 0
      }
    },
    // 查验分账比例
    checkSharePercent(data) {
      // debugger
      let invalid = false
      const messageArr = []
      const { currentPrice, originalPrice, costPrice, profitShareList } = data
      if (!currentPrice) {
        this.edittingSpec.shareMoney = 0
        return invalid
      }
      //  规格原价 规格销售价
      if (originalPrice && currentPrice > originalPrice) {
        messageArr.push('销售价不能大于原价')
      }
      // 规格成本价 规格销售价
      if (costPrice && currentPrice < costPrice) {
        messageArr.push('销售价不能小于成本价')
      }
      let total = 0
      profitShareList.forEach((item) => {
        if (item.shareMchId !== this.baseShareAccount.id && item.shareMoney) {
          total += item.shareMoney
        }
      })
      // 规格成本价
      // if (costPrice && costPrice < total + this.payFee) {
      //   messageArr.push(
      //     '规格成本价必须大于或等于第三方商户分账金额与结算费用之和'
      //   )
      // }
      const baseShareAccount = find(profitShareList, {
        shareMchId: this.baseShareAccount.id,
      })
      // 规格销售价
      let result = this.edittingSpec.currentPrice * this.feeRate
      if (result) {
        result = Number(numeral(result).format('0') | 0)
      }
      // console.log(baseShareAccount);
      if (baseShareAccount) {
        // 规格销售价
        baseShareAccount.shareMoney = Math.max(0, currentPrice - total - result)
      }
      let shareMoneyTotal = 0
      profitShareList.forEach((item, index) => {
        if (item.shareMchId !== this.vModel.receiveMchId && item.shareMoney) {
          shareMoneyTotal += item.shareMoney
        }
      })
      // 分账比例
      const baseSharePercent = shareMoneyTotal / (currentPrice - result)
      if (baseSharePercent > this.maxSharePercent) {
        messageArr.push(
          `收款商户对外分账比例不能大于${this.maxSharePercent * 100}%`
        )
        invalid = true
      }
      this.errorMsg = messageArr.join('；')
      return invalid
    },
    getAccountMchId(mchId) {
      if (mchId) {
        return find(this.splitAccountSelection, { value: mchId }).mchId
      } else {
        return ''
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.spec-list {
  padding: 0 24px 0 64px;
}
.total {
  color: #999;
}
.text-normal {
  color: #333;
}
.mt-8 {
  margin-top: 8px;
}
.handler {
  text-align: right;
}
::v-deep .spec-table {
  .el-table__empty-block {
    display: none;
  }
}
.spec-form {
  padding: 0 24px;
}
::v-deep .el-dialog__wrapper .el-button--text,
::v-deep .el-dialog__wrapper .el-button--text:focus {
  color: #06f;
}
.iconfont.icon-jinggao {
  color: #faad14;
}
.error-msg {
  flex: auto;
  text-align: center;
  .el-alert {
    display: inline-block;
    width: auto;
  }
}
::v-deep .el-alert {
  padding: 8px;
  .el-alert__title {
    font-size: 12px;
  }
}
.error-box {
  border-bottom: 1px solid #ebebeb;
  .iconfont.icon-jinggao {
    margin-right: 8px;
    color: inherit;
    font-size: 12px;
  }
}
::v-deep .accountSetting .el-form-item__label {
  min-width: 180px;
}
::v-deep .specailLabel .el-form-item__label {
  min-width: 138px;
}
::v-deep .specailLabelT .el-form-item__label {
  min-width: 166px;
}
.header-box {
  padding: 0;
}
.el-dialog .el-dialog__body {
  padding: 0;
}
::v-deep.aplitAccont {
  margin-right: 24px;
  .el-form-item__label {
    padding-right: 8px;
  }
}
::v-deep .radioGroup .el-radio__label {
  color: #333;
}
::v-deep.aplitAccont .el-dialog .el-dialog__body {
  padding: 0;
}
::v-deep.spec-form .header-box {
  margin-bottom: 0;
}
::v-deep.spec-form .header-box .header-wrapper {
  border-bottom: none;
  margin: 8px 0;
}
::v-deep.spec-form .pa-ruleForm .el-form-item {
  margin-bottom: 16px;
}
::v-deep .isShared .pa-ruleForm .el-form-item {
  margin-bottom: 16px;
}
::v-deep .isShared .el-form-item {
  margin-bottom: 4px;
}
::v-deep .isSharedT .el-form-item {
  margin-bottom: 10px;
}
.mr-40{
  margin-right:40px;
}
.mb-10{
  margin-bottom:10px;
}
.islabel{
  padding-right:8px;
  color: #333;
}
</style>
