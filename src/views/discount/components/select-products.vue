<template>
  <div>
    <el-button class="pa-btn" type="primary" @click="selectProducts">
      <i class="iconfont icon-s_tianjia1"></i>
      <span> 选择服务</span>
    </el-button>
    <el-dialog
      :visible.sync="visible"
      title="选择服务"
      width="884px"
      append-to-body
      custom-class="dialog-lg"
    >
      <el-transfer
        class="product-transfer transfer"
        v-model="selectedProducts"
        filterable
        :titles="['可选服务列表', '已选服务列表']"
        filter-placeholder="请输入服务名称"
        :button-texts="['删除', '添加']"
        :data="productData"
      >
        <div slot-scope="{ option }" class="product-info flex">
          <img :src="option.product.coverImg" alt="" />
          <div class="flex-main">
            <h5 class="text-ellipsis">{{ option.product.name }}</h5>
            <p class="text-ellipsis">{{ option.productSpec.specName }}</p>
            <div class="price">
              {{ option.productSpec.currentPrice | currency }}
            </div>
          </div>
        </div>
      </el-transfer>
      <div slot="footer" class=" text-right">
        <el-button @click="cancelHandler">取消</el-button>
        <el-button type="primary" @click="okHandler">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { find } from "lodash";
import { searchProducts } from "@/api/discount";
export default {
  props: {
    vModel: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      productData: [],
      selectedProducts: []
    };
  },
  model: {
    prop: "vModel",
    type: "change"
  },
  created() {
    console.log(this.vModel);
    this.getProducts();
  },
  methods: {
    selectProducts() {
      this.selectedProducts = this.vModel.map(item => {
        return item.productSpec.id;
      });
      this.visible = true;
    },
    getProducts() {
      searchProducts("").then(res => {
        this.productData = res.data.map(item => {
          return {
            ...item,
            key: item.productSpec.id,
            label: item.product.name
          };
        });
      });
    },
    cancelHandler() {
      this.visible = false;
    },
    okHandler() {
      const result = this.selectedProducts.map(id => {
        const product = find(this.vModel, ["productSpec.id", id]);
        // console.log(product);
        if (product) {
          return product;
        } else {
          const initProduct = find(this.productData, ["productSpec.id", id]);
          initProduct.discountPriceDTO.discountPrice = "";
          return initProduct;
        }
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
          span {
            color: #999;
          }
        }
      }
    } 
    .el-transfer-panel__filter {
      margin: 16px;
      .el-input__inner {
        padding-left: 8px;
        border-radius: 2px;
      }
      .el-input__prefix {
        display: none;
      }
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
        top: 16px;
      }
      .el-checkbox__label {
        color: #333;
        line-height: 20px;
        font-size: 14px;
        .product-info {
          height: 64px;
        }
        img {
          width: 48px;
          height: 48px;
          margin-right: 8px;
        }
        h5 {
          margin: 0;
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
        }
        p {
          line-height: 1;
          margin: 4px 0;
          font-size: 12px;
          color: #666;
          font-weight: normal;
        }
        .price {
          margin-top: 8px;
          color: #ef4f3c;
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
