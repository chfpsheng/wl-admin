<template>
  <div style="display: inline-block">
    <el-button class="pa-btn" type="primary" @click="selectProducts">
      <i class="iconfont icon-s_tianjia1"></i>
      <span> 添加服务</span>
    </el-button>
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="选择服务"
      width="884px"
      append-to-body
      custom-class="dialog-lg"
    >
      <el-transfer
        class="product-transfer transfer"
        v-model="selectedProducts"
        filterable
        :titles="['可选服务列表2', '已选服务列表']"
        filter-placeholder="请输入服务名称"
        :button-texts="['删除', '添加']"
        :data="productData"
      >
        <div slot-scope="{ option }" class="product-info">
          <div class="flex">
            <h5 class="text-ellipsis flex-main name">
              {{ option.product.name }}
            </h5>
            <span class="stock">库存：{{ option.totalStock }}</span>
            <!-- <div class="price">
              {{ option.product.currentPrice | currency }}
            </div> -->
          </div>
          <div class="cost">
            成本价：{{ option.productPrice.costPriceList | formatPriceRate }}
          </div>
          <div class="price">
            销售价：{{ option.productPrice.currentPriceList | formatPriceRate }}
          </div>
        </div>
      </el-transfer>
      <div slot="footer" class="text-right">
        <el-button @click="cancelHandler">取消</el-button>
        <el-button type="primary" @click="okHandler">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { find } from "lodash";
import { searchProducts } from "@/api/coupon";
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    departmentId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      productData: [],
      selectedProducts: []
    };
  },
  watch: {
    departmentId: {
      handler: function() {
        this.getProducts();
      }
    }
  },
  model: {
    prop: "value",
    type: "change"
  },
  created() {
    // console.log(this.value);
    this.getProducts();
  },
  methods: {
    selectProducts() {
      this.selectedProducts = this.value.map(item => {
        return item.product.id;
      });
      this.visible = true;
    },
    getProducts() {
      // TODO 后续可能会根据科室过滤可选商品服务，组件通过prop传递科室id进来即可
      searchProducts({ departmentId: this.departmentId }).then(res => {
        this.productData = res.data.rows.map(item => {
          return {
            ...item,
            key: item.product.id,
            label: item.product.name
          };
        });
      });
    },
    cancelHandler() {
      this.visible = false;
    },
    okHandler() {
      const limit = 100;
      if (this.selectedProducts.length > limit) {
        this.$message.warning(`一张商品优惠券最多可以选择${limit}个指定商品。`);
        return;
      }
      const result = this.selectedProducts.map(id => {
        return find(this.productData, ["product.id", id]);
      });
      // console.log(result);
      this.$emit("change", result);
      this.cancelHandler();
      // console.log(result);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body{
  overflow-y: hidden;
}
::v-deep .product-transfer.el-transfer {
  display: flex;
  padding: 0 24px;
  height: 100%;
  > .el-transfer-panel {
    flex: auto;
    flex-direction: column;
    border-radius: 0;
    .el-transfer-panel__body {
      flex: auto;
      height: 100%;
    }
    .el-transfer-panel__header {
      height: 48px;
      line-height: 48px;
      background-color: #fff;
      flex-shrink: 0;
      .el-checkbox {
        height: 48px;
        line-height: 48px;
        .el-checkbox__label {
          color: #333;
          font-size: 14px;
          padding-left: 4px;
          span{
            color: #999999;
          }
        }
      }
      
    }
    .el-transfer-panel__filter {
      margin: 16px;
      .el-input__inner {
        border-radius: 2px;
      }
      // .el-input__prefix {
      //   display: none;
      // }
    }
  }
  .el-transfer-panel__list {
    height: calc(100% - 120px);
    padding: 0 16px;
    .el-transfer-panel__item {
      border: 1px solid #ebebeb;
      padding: 16px;
      height: auto;
      margin-right: 0;
      margin-bottom: 8px;
      &.is-checked {
        border-color: #06c;
      }
      .el-checkbox__input {
        top: 19px;
      }
      .el-checkbox__label {
        color: #333;
        line-height: 20px;
        font-size: 14px;
        padding-left: 18px;
        .product-info {
          
          height: 68px;
          .name {
            margin: 0;
            font-size: 14px;
            font-weight: 400;
          }
          .stock {
            width: 80px;
            font-size: 12px;
            color: #666;
            text-align: right;
            font-weight: 400;
          }
          .cost {
            margin-top: 4px;
            color: #666;
            font-weight: 400;
          }
          .price {
            margin-top: 8px;
            color: #ef4f3c;
            font-weight: 400;
          }
        }
      }
    }
  }
  > .el-transfer__buttons {
    width: 78px;
    padding: 0;
    margin: 0 24px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    .el-button {
      min-width: 78px;
      display: block;
      margin: 8px 0;
      width: 78px;
      height: 32px;
      padding: 0;
      overflow: hidden;
      line-height: 32px;
      border-radius: 2px;
      .el-icon-arrow-left {
        font-family: "iconfont" !important;
        &::before {
          content: "\e6c1";
        }
      }
      .el-icon-arrow-right {
        font-family: "iconfont" !important;
        margin-left: 4px;
        &::before {
          content: "\e6c2";
        }
      }
    }
  }
}
</style>
