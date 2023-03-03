<template>
  <pa-drawer
    :visible.sync="visible"
    title="查看优惠券详情"
    :size="820"
    :with-footer="false"
    @closed="$emit('close')"
  >
    <div class="coupon-detail">
      <h3 class="title">基本信息</h3>
      <div class="info-item">
        <label>优惠券类型：</label>
        <span class="info-content">{{ typeMap[coupon.type] }}</span>
      </div>
      <div class="info-item">
        <label>所属科室：</label>
        <span class="info-content">{{ departmentName }}</span>
      </div>
      <div class="info-item">
        <label>优惠券名称：</label>
        <span class="info-content">{{ coupon.name }}</span>
      </div>
      <div class="info-item">
        <label>优惠券状态：</label>
        <span class="info-content">{{ statusMap[coupon.status] }}</span>
      </div>
      <div class="info-item">
        <label>发布方式：</label>
        <span class="info-content">{{ modeMap[coupon.mode] }}</span>
      </div>
      <div class="info-item">
        <label>有效日期：</label>
        <span class="info-content"
          >{{ coupon.beginTime | parseTimes("{y}-{m}-{d}") }} 至
          {{ coupon.endTime | parseTimes("{y}-{m}-{d}") }}</span
        >
      </div>
      <div class="info-item">
        <label>首页推送：</label>
        <span class="info-content">{{ coupon.showHome ? "是" : "否" }}</span>
      </div>
      <h3 class="title title2">使用信息</h3>
      <div class="info-item">
        <label>优惠金额：</label>
        <span class="info-content"
          >{{ coupon.reduceMoney | filterPrice }}元</span
        >
      </div>
      <div class="info-item">
        <label>使用门槛：</label>
        <span class="info-content">满{{coupon.thresholdMoney | filterPrice}}元使用</span>
      </div>
      
      <div class="info-item">
        <label>发行张数：</label>
        <span class="info-content">{{coupon.publishCount}}张</span>
      </div>
      
      <div class="info-item">
        <label>每人限领：</label>
        <span class="info-content">{{coupon.everyoneLimit}}张</span>
      </div>
      
      <div class="info-item pa--dsc">
        <label>使用规则：</label>
        <span class="info-content">{{coupon.roleDescription}}</span>
      </div>
      
      <div class="info-item">
        <label>服务范围：</label>
      </div>

      <div class="info-item-table">
        
      <el-table
        :key="tableKey"
        :data="productList"
        class="pa-table"
        border
      >
        <el-table-column label="序号" type="index" width="64" />
        <el-table-column label="服务名称" prop="name" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.product.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="108" prop="name" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.totalStock}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本价（元）" width="202" prop="name" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{row.productPrice.costPriceList | filterPriceList}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价（元）" width="202" prop="name" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{row.productPrice.currentPriceList | filterPriceList}}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
  </pa-drawer>
</template>

<script>
import baseDataMixin from "@/mixins/baseData";
import { getCoupon } from "@/api/coupon";
import { find } from "lodash";
export default {
  mixins: [baseDataMixin],
  props: {
    couponId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      coupon: {},
      productList: [],
      typeMap: {
        1: "满减券"
      },
      statusMap: {
        0: "待发放",
        1: "领取中",
        2: "已结束"
      },
      modeMap: {
        1: "公开券",
        2: "私发券"
      },
      departmentOptions: [],
      tableKey: 0,
      tableData: [
        {
          name: 'Hello'
        }
      ]
    };
  },
  filters: {
    filterPrice(val) {
      const price = val / 100
      return price
    },
    filterPriceList(list) {
      if(list.length > 1) {
        const min = (list[0] / 100).toFixed(2)
        const max = (list[1] / 100).toFixed(2)
        return `${min} - ${max}`
      } else {
        const val = (list[0] / 100).toFixed(2)
        return val
      }
    }
  },
  computed: {
    statusStyle() {
      const statusColorMap = {
        0: "#FFB828",
        1: "#0066CC",
        2: "#333333"
      };
      return {
        color: statusColorMap[this.coupon.status]
      };
    },
    departmentName() {
      return find(this.departmentOptions, { value: this.coupon.departmentId })
        ?.label;
    }
  },
  watch: {
    couponId: {
      handler: function() {
        this.init();
      }
    }
  },
  created() {
    this.deptDataMixins().then(res => {
      this.departmentOptions = res;
    });
  },
  methods: {
    init() {
      if (!this.couponId) {
        this.visible = false;
        return;
      }
      this.visible = true;
      // 获取活动信息
      getCoupon(this.couponId).then(res => {
        this.$set(this, "coupon", res.data.coupon);
        this.productList = res.data.productList;
        console.log('服务', this.productList)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-detail {
  height: 100%;
  padding: 16px 24px;
  overflow-y: auto;
  .title {
    height: 14px;
    padding-left: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    color: #333;
    margin: 8px 0 16px 0;
    border-left: 2px solid #0066cc;
  }
  .title2 {
    margin-top: 24px;
  }
  .info-item {
    display: flex;
    margin-bottom: 8px;
    line-height: 20px;
    color: #333;
    padding-left: 5px;
    > label {
      width: 84px;
      flex-shrink: 0;
      color: #666666;
      font-weight: normal;
    }
    .info-content {
      flex: 1;
      &.danger {
        color: #ef4f3c;
      }
    }
  }
}

::v-deep .el-table th > .cell{
  padding-left: 16px !important;
}

::v-deep .el-table td > .cell{
  padding-left: 16px !important;
}

</style>
