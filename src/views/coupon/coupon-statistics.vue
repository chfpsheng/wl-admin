<template>
  <div class="flex flex-column">
    <div class="page-header page-content flex flex-between">
      <h2>优惠券数据</h2>
      <el-button class="pa-btn" type="primary" @click="goBack">返回</el-button>
    </div>
    <div class="preview">
      <el-row type="flex" :gutter="16">
        <el-col class="preview-item">
          <div>
            <div>
              <strong>{{statisticalData.publishCount || 0}}</strong>
              <p>发行数量（张）</p>
            </div>
            <span class="icon">
              <i class="iconfont icon-iconyouhuiquanfahangzhangshu"></i>
            </span>
          </div>
        </el-col>
        <el-col class="preview-item">
          <div>
            <div>
              <strong>{{statisticalData.takeCount || 0}}</strong>
              <p>领取数量（张）</p>
            </div>
            <span class="icon">
              <i class="iconfont icon-iconyouhuiquanlingquzhangshu"></i>
            </span>
          </div>
        </el-col>
        <el-col class="preview-item">
          <div>
            <div>
              <strong>{{statisticalData.useCount || 0}}</strong>
              <p>使用数量（张）</p>
            </div>
            <span class="icon">
              <i class="iconfont icon-iconyouhuiquanshiyongzhangshu"></i>
            </span>
          </div>
        </el-col>
        <el-col class="preview-item">
          <div>
            <div>
              <strong>{{statisticalData.takePersonCount || 0}}</strong>
              <p>领取人数（人）</p>
            </div>
            <span class="icon">
              <i class="iconfont icon-youhuiquanlingqurenshu"></i>
            </span>
          </div>
        </el-col>
        <el-col class="preview-item">
          <div>
            <div>
              <strong>{{statisticalData.usePersonCount || 0}}</strong>
              <p>使用人数（人）</p>
            </div>
            <span class="icon">
              <i class="iconfont icon-youhuiquanshiyongrenshu"></i>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="page-query page-filters">
      <div class="filter-item">
        <label>使用状态</label>
        <div class="search-input">
          <pa-select
            :value.sync="pageQuery.useStatus"
            :options="statusOptions"
          ></pa-select>
        </div>
      </div>
      <el-button class="pa-btn ml-16" @click="search">
        <i class="iconfont icon-s_sousuo"></i>
        <span> 查询</span>
      </el-button>
    </div>
    <div class="flex-main table-view">
      <el-table
        :data="tableData"
        class="table-common table-border"
        border
        height="100%"
        size="small"
      >
        <el-table-column label="序号" type="index" width="64"></el-table-column>
        <el-table-column label="用户">
          <template slot-scope="{row}">
            {{row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="使用订单号">
          <template slot-scope="{row}">
            {{row.orderCode}}
          </template>
        </el-table-column>
        <el-table-column label="领券时间">
          <template slot-scope="{row}">
            {{row.takeTime}}
          </template>
        </el-table-column>
        <el-table-column label="使用时间">
          <template slot-scope="{row}">
            {{row.useTime}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            {{useStatusFilters(row.useStatus)}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <table-pagination
      class="bg-white"
      :total="total"
      v-model="pageQuery"
      @change="getData"
    ></table-pagination>
  </div>
</template>

<script>
import TablePagination from "@/components/Table/table-pagination.vue";
import { getCouponData, getCouponDataList } from '@/api/coupon';
export default {
  components: {
    TablePagination
  },
  data() {
    return {
      pageQuery: {
        couponId: '',
        useStatus: null,
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],
      total: 0,
      statusOptions: [
        {
          value: 0,
          label: '未使用'
        },
        {
          value: 1,
          label: '已使用'
        },
        {
          value: 2,
          label: '已失效'
        },
      ],
      statisticalData: {}, // 统计数据
    };
  },
  created() {
    this.pageQuery.couponId = this.$route.query.id
    this.initData()
    this.getData()
  },
  methods: {
    initData() {
      const params = {
        id: this.$route.query.id
      }
      getCouponData(params).then((res) => {
        this.statisticalData = {
          ...res.data
        }
      })
    },
    getData() {
      const params = {
        ...this.pageQuery
      }
      getCouponDataList(params).then((res) => {
        console.log(1111, res)
        this.total = res.data.total
        this.tableData = res.data.rows || []
        console.log(2222, this.tableData)
      })
    },
    search() {
      this.pageQuery.pageNo = 1;
      this.getData();
    },
    goBack() {
      this.$router.push("/coupon");
    },
    useStatusFilters(useStatus) {
      let str = ''
      str = useStatus === 0 ? '未使用' : (useStatus === 1 ? '已使用' : '已失效')
      return str
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-white {
  background-color: #fff;
}
.page-header {
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  color: #333;
  > h2 {
    margin: 0;
    font-size: 14px;
    line-height: 1;
    font-weight: 400;
  }
}
.preview {
  @extend .bg-white;
  padding: 24px;
  .preview-item {
    > div {
      display: flex;
      height: 106px;
      padding: 24px 16px 24px 24px;
      border: 1px solid #ebebeb;
      > div {
        flex: 1;
      }
      strong {
        font-size: 18px;
        color: #333;
        font-weight: 400;
      }
      p {
        font-size: 12px;
        color: #666;
      }
      .icon {
        display: block;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        line-height: 58px;
        text-align: center;
        color: #fff;
        > .iconfont {
          font-size: 58px;
        }
      }
    }
  }
  .preview-item:nth-child(1) .iconfont {
    color: #76b5f7;
  }
  .preview-item:nth-child(2) .iconfont {
    color: #f59170;
  }
  .preview-item:nth-child(3) .iconfont {
    color: #98ce75;
  }
  .preview-item:nth-child(4) .iconfont {
    color: #bf8fd2;
  }
  .preview-item:nth-child(5) .iconfont {
    color: #f6a6c2;
  }
}
.page-query {
  padding-top: 0;
  @extend .bg-white;
}
.table-view {
  @extend .bg-white;
}
.pagination-common {
  padding: 24px;
}
.ml-16 {
  margin-left: 16px;
}
::v-deep .table-common.el-table .el-table__empty-block .el-table__empty-text {
  margin-top: 0;
}
.search-input {
  width: 387px!important;
}
.search-input .pa-select {
  width: 100%;
}
.icon-s_sousuo{ 
  font-size:14px;
}
</style>
