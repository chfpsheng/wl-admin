<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="pa-ruleForm discount-edit"
    label-position="right"
    label-width="90px"
    size="small"
  >
    <div class="form-handler flex flex-between title-box">
      <h2 class="page-title">{{ title }}</h2>
      <div>
        <el-button @click="goBack" size="small" class="pa-btn">返回</el-button>
        <el-button type="primary" size="small" @click="save" class="pa-btn">
          确定
        </el-button>
      </div>
    </div>
    <div class="flex-main page-content form-body">
      <h3 class="title">基本信息</h3>
      <el-form-item label="优惠券类型" prop="departmentId" label-position="right">
        <pa-select
          class="form-item-content"
          :value.sync="form.type"
          :options="typeOptions"
          :clearable="false"
        ></pa-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="departmentId" label-position="right">
        <pa-select
          class="form-item-content"
          :value.sync="form.departmentId"
          :options="departmentOptions"
          :clearable="false"
        ></pa-select>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name" label-position="right">
        <el-input
          class="form-item-content"
          v-input-trim
          size="small"
          v-model="form.name"
          :maxlength="10"
          :minlength="2"
          placeholder="请输入优惠券名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="发放方式" prop="mode" required label-position="right">
        <el-radio-group v-model="form.mode">
          <el-radio :label="1">公开券</el-radio>
          <el-radio :label="2">私发券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效日期" prop="beginTime" label-position="right">
        <div class="flex form-item-content">
          <el-date-picker
            v-model="form.beginTime"
            type="date"
            size="small"
            :picker-options="{ disabledDate: beginTimeDisabledDate }"
            placeholder="起始日期"
            :value-format="datefomat"
            class="flex-main"
            prefix-icon="iconfont icon-s_riqixuanzheqi"
          >
          </el-date-picker>
          <span style="margin: 0 8px">至</span>
          <el-date-picker
            v-model="form.endTime"
            type="date"
            size="small"
            :picker-options="{ disabledDate: endTimeDisabledDate }"
            placeholder="结束日期"
            :value-format="datefomat"
            class="flex-main"
            prefix-icon="iconfont icon-s_riqixuanzheqi"
            @change="endTimeChange"
          >
          </el-date-picker>
        </div>
        <span class="tips">最长可提前60天创建，有效期不能超过60天</span>
      </el-form-item>
      <el-form-item label="首页推送" prop="showHome" required label-position="right">
        <el-radio-group v-model="form.showHome">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="title-rule">
        <h3 class="title">使用信息</h3>
      </div>
      <el-form-item label="优惠金额" prop="reduceMoney" label-position="right">
        <input-amount
          class="form-item-content"
          v-model="form.reduceMoney"
          :decimal="0"
          :maxValue="1000"
          placeholder="请输入优惠金额"
          @change="reduceMoneyChange"
        ></input-amount>
        <span class="unit">元</span>
        <span class="tips">请输入整数金额，面额不得超过1000元</span>
      </el-form-item>
      <el-form-item
        label="使用门槛"
        prop="thresholdMoney"
        class="form-item-amout"
        label-position="right"
      >
        <span class="mr-8">满</span>
        <input-amount
          v-model="form.thresholdMoney"
          placeholder="使用门槛需高于优惠金额"
          style="width: 479px"
        ></input-amount>
        <span class="unit">元</span>
      </el-form-item>
      <el-form-item label="发行数量" prop="publishCount" label-position="right">
        <input-number
          class="form-item-content"
          v-model="form.publishCount"
          :max-value="99999999"
          placeholder="需大于等于1"
        ></input-number>
        <span class="unit">张</span>
      </el-form-item>
      <el-form-item label="每人限领" prop="everyoneLimit" label-position="right">
        <input-number
          class="form-item-content"
          v-model="form.everyoneLimit"
          :max-value="100"
          placeholder="需大于等于1"
        ></input-number>
        <span class="unit">张</span>
      </el-form-item>
      <el-form-item label="使用规则" prop="roleDescription" label-position="right">
        <el-input
          v-input-trim
          class="form-item-content textarea"
          type="textarea"
          v-model="form.roleDescription"
          maxlength="500"
          show-word-everyoneLimit
          placeholder="请输入使用规则"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务范围" required style="margin-bottom: 8px" label-position="right">
        <div class="flex flex-between">
          <div>
            <select-products
              :value.sync="productList"
              @change="selectProductChanged"
            ></select-products>
            <span class="tips">一张商品优惠券最多可以选择100个指定商品。</span>
          </div>
        </div>
        <div style="flex-grow:1">
          <el-button
              class="pa-btn right"
              :disabled="!tableSelection.length"
              @click="deleteMultipleProducts"
            >
              <i class="iconfont icon-s_shanchu1"></i>
              <span> 批量删除</span>
            </el-button>
          </div>
      </el-form-item>
      <el-form-item label-width="auto" prop="productIds">
        <el-table
          class="table-common table-border"
          :data="productList"
          border
          width="100%"
          size="small"
          @selection-change="tableSelectionChange"
        >
          <el-table-column type="selection" width="60" align="center">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="72"
          ></el-table-column>
          <el-table-column
            label="服务名称"
            prop="product.name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="totalStock" label="库存" width="150">
            <template slot-scope="{ row }">
              {{ row.totalStock === -1 ? "不限" : row.totalStock }}
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="成本价（元）">
            <template slot-scope="{ row }">
              {{ row.productPrice.costPriceList | formatPriceRate }}
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="销售价（元）">
            <template slot-scope="{ row }">
              {{ row.productPrice.currentPriceList | formatPriceRate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="{ $index }">
              <el-button type="text" @click="deleteProduct($index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { insertCoupon } from "@/api/coupon";
import dayjs from "dayjs";
import baseDataMixin from "@/mixins/baseData";
import InputNumber from "@/components/Form/input-number.vue";
import InputAmount from "@/components/Form/input-amount.vue";
import SelectProducts from "./components/select-products.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    InputNumber,
    InputAmount,
    SelectProducts
  },
  data() {
    const timeValidator = (rule, value, cb) => {
      if (!this.form.beginTime) {
        return cb(new Error("请选择时间|最长可提前60天创建|有效日期不能超过60天"));
      }
      if (dayjs(this.form.beginTime).isBefore(dayjs().startOf("day"))) {
        return cb(new Error("优惠券开始时间必须晚于当前时间"));
      }
      if (!this.form.endTime) {
        return cb(new Error("请选择时间|最长可提前60天创建|有效日期不能超过60天"));
      }
      if (!dayjs(this.form.endTime).isAfter(dayjs(this.form.beginTime))) {
        return cb(new Error("优惠券结束时间必须晚于开始时间"));
      }
      cb();
    };
    const inputRule = {
      pattern: /^[a-zA-z0-9\u4e00-\u9fa5]+$/,
      message: "只可填文字数字字母",
      trigger: "blur"
    };
    const reduceMoneyValidator = (rule, value, callback) => {
      if (value === "") {
        return callback();
      }
      if (value < 1 * 100) {
        return callback(new Error("请输入1-1000内数值"));
      }

      if (this.form.thresholdMoney === "") {
        return callback();
      }
      // *100因为金额单位是分
      if (value > 1000 * 100) {
        return callback(new Error("优惠券金额不得大于1000"));
      }
      if (value >= this.form.thresholdMoney) {
        return callback(new Error("优惠金额需小于使用门槛"));
      }
      // TODO 再触发较验门槛会导致无限循环BUG
      // this.$refs.form.validateField('thresholdMoney')
      return callback();
    };
    const thresholdMoneyValidator = (rule, value, callback) => {
      if (value === "") {
        return callback();
      }
      // *100因为金额单位是分
      if (value < 0.01 * 100 || value > 999999 * 100) {
        return callback(new Error("请输入0.01-999999内数值"));
      }
      if (this.form.reduceMoney && value <= this.form.reduceMoney) {
        return callback(new Error("使用门槛需大于优惠金额"));
      }
      this.$refs.form.validateField("reduceMoney");
      return callback();
    };
    return {
      datefomat: "yyyy-MM-dd HH:mm:ss",
      form: {
        type: 1, //类型
        departmentId: "", // 所属科室
        name: "", //优惠券名称
        mode: 1, // 发放方式
        beginTime: "",
        endTime: "",
        mutex: 1, // 是否互斥
        showHome: 0, //是否推送
        reduceMoney: "", // 金额
        thresholdMoney: "", // 门槛
        publishCount: "", // 发行量
        everyoneLimit: "", // 每人限领数量
        roleDescription: "", // 使用规则
        productIds: [] // 服务列表
      },
      rules: {
        departmentId: [{ required: true, message: "请选择科室" }],
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { min: 2, max: 10, message: "2-10个字", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "请设置有效日期", trigger: "change" },
          {
            validator: timeValidator,
            trigger: "change"
          }
        ],
        reduceMoney: [
          { required: true, message: "请输入优惠券金额", trigger: "blur" },
          { validator: reduceMoneyValidator, trigger: "blur" }
        ],
        thresholdMoney: [
          { required: true, message: "请输入使用门槛", trigger: "blur" },
          { validator: thresholdMoneyValidator, trigger: "blur" }
        ],
        publishCount: [
          { required: true, message: "请输入发行张数", trigger: "blur" },
          {
            validator: this.ValidateRules.checkNumber(1, 99999999),
            trigger: "blur"
          }
        ],
        everyoneLimit: [
          { required: true, message: "请输入每人限领张数", trigger: "blur" }
        ],
        roleDescription: [
          { required: true, message: "请输入使用规则", trigger: "blur" }
        ],
        productIds: [
          { required: true, message: "请先添加服务信息", trigger: "change" }
        ]
      },
      typeOptions: [
        {
          label: "满减券",
          value: 1
        }
      ],
      departmentOptions: [],
      productList: [],
      tableSelection: []
    };
  },
  computed: {
    title() {
      return this.$route.query.id ? "编辑优惠券" : "新增优惠券";
    }
  },
  watch: {
    productList: {
      handler: function() {
        console.log(this.productList);
        this.form.productIds = this.productList.map(item => item.product.id);
        this.checkproductIdsValidate();
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    reduceMoneyChange() {
      this.$refs.form.validateField('thresholdMoney')
    },
    init() {
      this.deptDataMixins().then(res => {
        this.departmentOptions = res;
        this.form.departmentId = res[0]?.value;
      });
    },
    save() {
      // console.log(this.form);
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        // TODO confirm确认
        this.$confirm("提交后需手动开启优惠券发放状态，优惠券信息不可修改，请确认是否提交", "提示", {
          type: "warning"
        }).then(() => {
          insertCoupon(this.form).then(this.saveSuccessCallback);
        });
      });
    },
    saveSuccessCallback() {
      this.$message.success(`${this.form.id ? "编辑" : "新增"}成功！`);
      this.goBack();
    },
    goBack() {
      this.$router.push("/coupon");
    },
    tableSelectionChange(data) {
      console.log(data);
      this.tableSelection = data;
    },
    // 批量删除
    deleteMultipleProducts() {
      this.$confirm("确认删除已选服务？", "提示", {
        type: "warning"
      }).then(() => {
        this.productList = this.productList.filter(product => {
          return !this.tableSelection.some(item => {
            return item.product.id === product.product.id;
          });
        });
        this.tableSelection = [];
        // this.checkproductIdsValidate();
      });
    },
    deleteProduct(index) {
      this.$confirm("确认删除此服务？", "提示", {
        type: "warning"
      }).then(() => {
        this.productList.splice(index, 1);
        // this.checkproductIdsValidate();
      });
    },
    endTimeChange(value) {
      // console.log(value);
      this.form.endTime = dayjs(value)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    },
    beginTimeDisabledDate(date) {
      // console.log(date);
      if (dayjs(date).isBefore(dayjs().startOf("day"))) {
        return true;
      }
      if (dayjs(date).isAfter(dayjs().add(60, "days"))) {
        return true;
      }
      return false;
    },
    endTimeDisabledDate(date) {
      // 已设置开始时间
      if (this.form.beginTime) {
        // 不能早于开始时间
        if (dayjs(date).isBefore(dayjs(this.form.beginTime).startOf("day"))) {
          return true;
        }
        // 不能大于开始时间+60天
        if (dayjs(date).isAfter(dayjs(this.form.beginTime).add(60, "days"))) {
          return true;
        }
      } else {
        if (dayjs(date).isBefore(dayjs().startOf("day"))) {
          return true;
        }
        if (dayjs(date).isAfter(dayjs().add(60, "days"))) {
          return true;
        }
      }
      return false;
    },
    selectProductChanged(value) {
      console.log(value);
      this.productList = value;
      // this.checkproductIdsValidate();
    },
    checkproductIdsValidate() {
      this.$refs.form.validateField("productIds");
    }
  }
};
</script>

<style lang="scss" scoped>
.discount-edit {
  background-color: #fff;
  color: #333;
  .title-box {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 15px;
    align-items: flex-end;
  }
  .title {
    margin: 0 0 16px;
    height: 14px;
    padding-left: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    color: #333;
    border-left: 2px solid #06c;
  }
  .title-rule {
    padding-top: 21px;
    border-top: 1px solid #ebebeb;
  }
}
.form-handler {
  padding: 16px 24px;
  border-bottom: 1px solid #ebebeb;
  .page-title {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
  }
  button + button {
    margin-left: 24px;
  }
}
.form-body {
  height: 100%;
  overflow-y: auto !important;
  padding: 24px;
  .el-form-item {
    .form-item-content {
      width: 500px;
    }
    .unit {
      margin-left: 8px;
    }
    .tips {
      margin-left: 8px;
      color: #999;
    }
  }
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 24px;
}
::v-deep .el-form-item__label {
  // text-align: left;
  padding-right: 8px;
}

::v-deep .el-radio {
  color: #333;
  .el-radio__label {
    font-weight: normal;
  }
}
::v-deep .el-checkbox__label {
  font-weight: normal;
  color: #333;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label,
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #333;
}
.text-inline-input {
  width: 80px;
  margin: 0 8px;
}
::v-deep .el-table__empty-block {
  display: none;
}
::v-deep .form-item-amout {
  .el-form-item__error {
    margin-left: 24px;
  }
}
::v-deep .el-form-item__label-wrap {
  margin-left: 0!important;
}
::v-deep .el-radio__input.is-checked .el-radio__inner {
  background: #fff;
}
::v-deep .el-radio__input.is-checked .el-radio__inner::after {
  background-color: #06c;
  width: 5px;
  height: 5px;
}
::v-deep .el-radio-group {
  display: flex;
  align-items: center;
  height: 32px;
}
::v-deep .el-radio {
  margin-right: 40px;
  display: flex;
  align-items: center;
}
::v-deep .el-radio__label {
  padding-left: 4px;
}
::v-deep .el-form-item__content {
  display: flex!important;
}

.right{
  float: right;
}
</style>
