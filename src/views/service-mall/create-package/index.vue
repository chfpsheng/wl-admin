<template>
  <div class="create-package-container">
    <header-box title="基本信息" />
    <div class="shop-type">
      <div class="title"><span class="star">*</span>商品类型</div>
      <el-checkbox-group
        class="shop-checkbox-group"
        :disabled="disabledCheckbox"
        v-model="checkList"
        @change="checkBoxChange"
      >
        <el-checkbox :label="1">普通商品类型</el-checkbox>
        <el-checkbox :label="0">免费领取类型</el-checkbox>
      </el-checkbox-group>
    </div>
    <CreatePackage v-if="checkList[0] == 1" />
    <FreePackage v-else-if="checkList[0] == 0" />
  </div>
</template>
<script>
import CreatePackage from "../create-package.vue";
import FreePackage from "./free-package.vue";
export default {
  name: "index",
  components: {
    FreePackage,
    CreatePackage,
  },
  data() {
    return {
      checkList: [1],
      checkListCache: [1],
      disabledCheckbox: false,
    };
  },
  created() {
    if (this.$route?.query?.id) {
      this.disabledCheckbox = true;
    }
    if (this.$route?.query?.type == 0) {
      this.checkList = [0];
    }
  },
  methods: {
    checkBoxChange(val) {
      if (this.checkList.length > 1) {
        this.checkList.splice(0, 1);
        this.checkListCache = [...this.checkList];
      } else if (this.checkList.length == 0) {
        this.checkList = [...this.checkListCache];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.create-package-container {
  height: 100%;
  background-color: #ffffff;
  .shop-type {
    display: flex;
    align-items: center;
    margin: 32px 0;
    .title {
      width: 132px;
      text-align: right;
      padding-right: 12px;
      font-weight: normal;
      color: #333;
      font-size: 14px;
      .star {
        color: #ff4949;
        margin-right: 4px;
      }
    }
  }
}
::v-deep.shop-checkbox-group {
  .el-checkbox__input.is-checked + .el-checkbox__label,
  .el-checkbox__label {
    color: #333333;
  }
  .el-checkbox__input.is-checked {
    .el-checkbox__inner {
      background-color: #0066cc;
      border-color: #0066cc;
    }
  }
}
::v-deep.app-container {
  overflow: unset;
}
::v-deep .header-box {
  height: 50px;
  .header-wrapper {
    .title {
      height: 20px;
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #0066cc;
      line-height: 20px;
      padding-left: 10px;
      &::after {
        width: 2px;
        height: 14px;
        background: #0066cc;
        top:3px;
      }
    }
  }
}
</style>