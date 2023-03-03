<template>
  <el-form ref="form" :model="form" class="flex flex-column">
    <div
      class="flex flex-between page-content page-header"
      :style="headerStyle"
    >
      <div class="flex-main info">
        <div class="flex flex-center">
          <div class="info-item" style="width: 220px">
            <label>活动名称：</label>
            <el-tooltip
              :content="discountInfo.name"
              :disabled="discountInfo.name && discountInfo.name.length < 10"
            >
              <span class="text-ellipsis">{{ discountInfo.name }}</span>
            </el-tooltip>
          </div>
          <div class="info-item">
            <label>开始时间：</label>
            <span>{{ discountInfo.beginTime }}</span>
          </div>
          <div class="info-item">
            <label>结束时间：</label>
            <span>{{ discountInfo.endTime }}</span>
          </div>
          <div class="info-item">
            <label>状态：</label>
            <span :style="statusStyle">{{
              statusMap[discountInfo.status]
            }}</span>
          </div>
        </div>
        <div class="flex flex-center" v-if="!editable">
          <div class="info-item" style="width: 220px">
            <label>成交额：</label>
            <span>{{
              discountInfo.activitySumInfo.orderSumMoney | currency
            }}</span>
          </div>
          <div class="info-item" style="width: 212px">
            <label>付款订单数：</label>
            <span>{{ discountInfo.activitySumInfo.orderCount }}</span>
          </div>
          <div class="info-item">
            <label>付款人数：</label>
            <span>{{ discountInfo.activitySumInfo.userCount }}</span>
          </div>
        </div>
      </div>
      <div class="form-handler">
        <el-button
          @click="goBack"
          size="small"
          class="pa-btn"
          :type="editable ? 'default' : 'primary'"
          >返回</el-button
        >
        <el-button
          v-show="editable"
          type="primary"
          size="small"
          @click="save"
          class="pa-btn"
          >保存</el-button
        >
      </div>
    </div>
    <div class="table-handler page-content" v-if="editable">
      <select-products
        v-model="form.discountList"
        @change="discountListChange"
      ></select-products>
    </div>

    <div class="flex-main page-content" style="padding-top: 8px;">
      <el-table
        :data="form.discountList"
        class="pa-table table-form"
        height="100%"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
          fixed="left"
        ></el-table-column>
        <el-table-column
          label="服务名称-规格"
          show-overflow-tooltip
          min-width="200"
          fixed="left"
        >
          <template slot-scope="{ row }">
            {{ row.product.name }}-{{ row.productSpec.specName }}
          </template>
        </el-table-column>
        <el-table-column label="库存" width="120">
          <template slot-scope="{ row }">
            {{
              row.productSpec.stockAmount === -1
                ? "不限"
                : row.productSpec.stockAmount
            }}
          </template>
        </el-table-column>
        <el-table-column label="成本价(元)" width="120">
          <template slot-scope="{ row }">
            {{ row.productSpec.costPrice | currency("") }}
          </template>
        </el-table-column>
        <el-table-column label="原价(元)" width="120">
          <template slot-scope="{ row }">
            {{ row.productSpec.originalPrice | currency("") }}
          </template>
        </el-table-column>
        <el-table-column label="销售价(元)" width="120">
          <template slot-scope="{ row }">
            {{ row.productSpec.currentPrice | currency("") }}
          </template>
        </el-table-column>
        <el-table-column label="折扣价范围(元)" min-width="200">
          <template slot-scope="{ row }">
            {{ row.discountPriceDTO.discountMinPrice | currency("") }} -
            {{ row.discountPriceDTO.discountMaxPrice | currency("") }}
          </template>
        </el-table-column>
        <el-table-column label="折扣价格(元)" min-width="150">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="
                'discountList[' + $index + '].discountPriceDTO.discountPrice'
              "
              :rules="[
                { required: true, message: '请输入折扣价格', trigger: 'blur' },
                {
                  validator: ValidateRules.checkNumber(
                    row.discountPriceDTO.discountMinPrice / 100,
                    row.discountPriceDTO.discountMaxPrice / 100,
                    true
                  ),
                  trigger: 'blur'
                }
              ]"
            >
              <input-amount
                v-model="
                  form.discountList[$index].discountPriceDTO.discountPrice
                "
                v-if="editable"
              ></input-amount>
              <span v-else style="color: #EF4F3C;">{{
                row.discountPriceDTO.discountPrice | currency("")
              }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- <el-table-column label="优惠金额(元)" width="120">
          <template slot-scope="{ row }">
            {{
              (row.productSpec.originalPrice -
                row.discountPriceDTO.discountPrice)
                | currency("")
            }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="80" v-if="editable">
          <template slot-scope="{ $index }">
            <el-button type="text" @click="deleteRow($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>

<script>
// import "text-tooltip";
// import "text-tooltip/dist/text-tooltip.css";
// console.log(TextTooltop);
import {
  getDiscount,
  getDiscountProducts,
  saveDiscountProducts
} from "@/api/discount";
import SelectProducts from "./components/select-products.vue";
export default {
  components: {
    SelectProducts
  },
  props: {},
  data() {
    return {
      discountInfo: {
        status: 0,
        activitySumInfo: {}
      },
      form: {
        discountList: []
      },
      statusMap: {
        0: "未开始",
        1: "已开始",
        2: "已结束"
      }
    };
  },
  computed: {
    editable() {
      // return !!this.$route.query.editable;
      return this.discountInfo.status === 0;
    },
    statusStyle() {
      const statusColorMap = {
        0: "#FFB828",
        1: "#0066CC",
        2: "#333333"
      };
      return {
        color: statusColorMap[this.discountInfo.status]
      };
    },
    headerStyle() {
      if (this.editable) {
        return {
          "border-bottom": "1px solid #ebebeb"
        };
      } else {
        return {
          "margin-bottom": "8px"
        };
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const id = this.$route.query.id;
      if (!id) {
        this.goBack();
        return;
      }
      this.form.activityId = id;
      // const loading = this.$loading()
      // 获取活动信息
      getDiscount(id).then(res => {
        // console.log(res.data);
        this.$set(this, "discountInfo", res.data);
        // Object.assign(this.discountInfo, res.data);
        // console.log(this.discountInfo);
        // loading.close()
      });
      getDiscountProducts(id).then(res => {
        // console.log(res);
        this.form.discountList = res.data;
      });
    },
    save() {
      this.$refs.form.validate(valid => {
        // console.log(valid);
        if (!valid) {
          return;
        }
        if (!this.form.discountList.length) {
          this.$message({
            message: "请选择服务商品。",
            type: "warning"
          });
          return;
        }
        const data = {
          activityId: Number(this.form.activityId)
        };
        data.discountList = this.form.discountList.map(item => {
          return {
            productId: item.product.id,
            specId: item.productSpec.id,
            discountPrice: item.discountPriceDTO.discountPrice
          };
        });
        saveDiscountProducts(data)
          .then(res => {
            // console.log(res);
            this.$message.success("保存成功！");
            this.goBack();
          })
          .catch(res => {
            // [月子餐 -7天；月子餐-14天；月子餐-14天；月子餐-14天；月子餐-14天；]等n个服务已在重叠的时间段参加了限时折扣活动，请处理后保存。
            const { code, data } = res;
            if (code === 4020) {
              const total = data.length;
              const activity = data
                .splice(0, 5)
                .map(item => `${item.productName}-${item.specName}`)
                .join("; ");
              this.$message({
                message: `[${activity}]等${total}个服务已在重叠的时间段参加了限时折扣活动，请处理后保存。`,
                type: "warning"
                // duration: 5000
              });
              return;
            }
          });
      });
      // console.log(this.form.discountList);
    },
    goBack() {
      this.$router.push("/discount");
    },
    discountListChange(data) {
      // console.log(data);
      this.form.discountList = data;
    },
    deleteRow(index) {
      this.form.discountList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  > div {
    flex-wrap: wrap;
    line-height: 32px;
    & + div {
      margin-top: 8px;
    }
  }

  .info-item {
    color: #333;
    font-size: 14px;
    margin: 0 40px 0 0;
    display: flex;
    > label {
      flex-shrink: 0;
      font-weight: normal;
    }
    > span {
      flex: auto;
      overflow: hidden;
    }
  }
}
.form-handler {
  .el-button + .el-button {
    margin-left: 24px;
  }
}
.table-handler.page-content {
  padding: 8px 24px 0;
  text-align: right;
}
</style>
