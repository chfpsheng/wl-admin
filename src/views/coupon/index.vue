<template>
  <div class="flex flex-column">
    <div class="page-filters page-content">
      <el-row :gutter="40">
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>发放状态</label>
            <pa-select
              :value.sync="pageQuery.status"
              :options="statusOptions"
            ></pa-select>
          </div>
        </el-col>
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>发放方式</label>
            <pa-select
              :value.sync="pageQuery.mode"
              :options="methodOptions"
            ></pa-select>
          </div>
        </el-col>

        <el-col :span="8" :xl="6">
          <div class="filter-item">
            <label>有效日期</label>
            <date-range-picker
              :pageQuery="pageQuery"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="dateChange"
            ></date-range-picker>
          </div>
        </el-col>
        <el-col :span="8" :xl="6">
          <div class="filter-item">
            <label>优惠券名称</label>
            <el-input
              v-input-trim
              v-model="pageQuery.name"
              class="pa-input"
              placeholder="请输入优惠券名称"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="6" :xl="4">
          <el-button type="primary" class="pa-btn" @click="search">
            <i class="iconfont icon-s_sousuo"></i>
            <span> 查询</span>
          </el-button>
          <el-button class="pa-btn" @click="resetSearch">
            <i class="iconfont icon-s_chongzhi"></i>
            <span> 重置</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="flex-main table-view page-content flex flex-column">
      <div class="table-handler text-right">
        <el-button type="primary" class="pa-btn" @click="createCoupon()">
          <i class="iconfont icon-s_tianjia1"></i>
          <span> 新增优惠券</span>
        </el-button>
      </div>
      <div class="flex-main">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          height="100%"
          class="pa-table"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="优惠券名称"
            prop="coupon.name"
            min-width="200"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column label="发放状态" width="100">
            <template slot-scope="{ row }">
              {{ statusMap[row.coupon.status] }}
            </template>
          </el-table-column>
          <el-table-column label="优惠金额（元）" width="140">
            <template slot-scope="{ row }">
              {{ row.coupon.reduceMoney | currency('') }}
            </template>
          </el-table-column>
          <el-table-column label="使用门槛（元）" width="140">
            <template slot-scope="{ row }">
              {{ row.coupon.thresholdMoney | currency('') }}
            </template>
          </el-table-column>
          <el-table-column label="有效日期" width="220">
            <template slot-scope="{ row }">
              {{ row.coupon.beginTime | parseTimes('{y}-{m}-{d}') }} 至
              {{ row.coupon.endTime | parseTimes('{y}-{m}-{d}') }}
            </template>
          </el-table-column>
          <el-table-column label="限领（张）" width="100">
            <template slot-scope="{ row }">
              {{ row.coupon.everyoneLimit }}
            </template>
          </el-table-column>
          <el-table-column label="发行量（张）" width="120">
            <template slot-scope="{ row }">
              {{ row.coupon.publishCount }}
            </template>
          </el-table-column>
          <el-table-column label="已领取（张）" width="120">
            <template slot-scope="{ row }">
              {{ row.coupon.takeCount }}
            </template>
          </el-table-column>
          <el-table-column label="首页推送" width="100">
            <template slot-scope="{ row }">
              <pa-switch
                v-model="row.coupon.showHome"
                :active-value="1"
                :inactive-value="0"
                :disabled="row.coupon.status === 2"
                @click="showHomeHandler(row)"
              >
              </pa-switch>
            </template>
          </el-table-column>

          <el-table-column label="使用范围" width="400">
            <template slot-scope="{ row }">
              <table-tags :tags="row.productList"></table-tags>
            </template>
          </el-table-column>
          <el-table-column label="发放方式" width="100">
            <template slot-scope="{ row }">
              {{ modeMap[row.coupon.mode] }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="创建时间"
            width="170"
            prop="createTime"
          ></el-table-column> -->
          <el-table-column label="操作" width="280" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" @click="viewDetail(row)"> 查看 </el-button>
              <el-button type="text" @click="provide(row)" :disabled="row.coupon.status !== 0">发放</el-button>
              <el-button type="text" @click="stop(row)"  :disabled="row.coupon.status !== 1">结束</el-button>
              <el-button type="text" @click="deleteRow(row)" :disabled="row.coupon.status !== 2">
                删除
              </el-button>
              <el-button type="text" @click="statistics(row)" :disabled="!row.coupon.status"> 数据 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <table-pagination
        :total="total"
        v-model="pageQuery"
        @change="getTableData"
      ></table-pagination>
    </div>
    <coupon-detail :coupon-id="visibleCouponId" @close="visibleCouponId = null"></coupon-detail>
  </div>
</template>

<script>
import { getCouponList, updateCoupon, deleteCoupon } from '@/api/coupon';
import baseDataMixin from '@/mixins/baseData';
import DateRangePicker from '@/components/Form/date-range-picker.vue';
import TablePagination from '@/components/Table/table-pagination.vue';
import TableTags from './components/table-tags.vue';
import CouponDetail from './coupon-detail.vue';
export default {
  mixins: [baseDataMixin],
  components: {
    DateRangePicker,
    TablePagination,
    TableTags,
    CouponDetail,
  },
  data() {
    return {
      visibleCouponId: null, // 展示优惠券详情
      tableData: [],
      tableLoading: false,
      pageQuery: {
        status: '',
        name: '',
        beginTime: '',
        endTime: '',
        pageSize: 10,
        pageNo: 1,
      },
      total: 0,
      statusMap: {
        0: '待发放',
        1: '领取中',
        2: '已结束',
      },
      modeMap: {
        1: '公开券',
        2: '私发券',
      },
      statusColorMap: {
        0: '#FFB828',
        1: '#0066CC',
        2: '#333333',
      },
      departmentMap: {},
      departmentOptions: [],
    };
  },
  computed: {
    statusOptions() {
      const options = [];
      for (const key in this.statusMap) {
        if (Object.hasOwnProperty.call(this.statusMap, key)) {
          const label = this.statusMap[key];
          options.push({
            label,
            value: key,
          });
        }
      }
      console.log(12221, options)
      return options;
    },
    methodOptions() {
      const options = [];
      for (const key in this.modeMap) {
        if (Object.hasOwnProperty.call(this.modeMap, key)) {
          const label = this.modeMap[key];
          options.push({
            label,
            value: key,
          });
        }
      }
      return options;
    },
  },
  created() {
    // 页面初始化先加载科室数据
    this.getDepartmentOptions().then(() => {
      this.search();
    });
  },
  methods: {
    dateChange(val) {
      console.log(121212, val)
    },
    getDepartmentOptions() {
      return this.deptDataMixins().then((res) => {
        res.forEach((item) => {
          Object.assign(this.departmentMap, {
            [item.value]: item.label,
          });
        });
        this.departmentOptions = [
          {
            label: '全部',
            value: '',
          },
        ].concat(res);
      });
    },
    search() {
      this.pageQuery.pageNo = 1;
      this.getTableData();
    },
    resetSearch() {
      this.pageQuery = {
        status: '',
        name: '',
        beginTime: '',
        endTime: '',
        pageSize: 10,
        pageNo: 1,
      }
      this.search();
    },
    getTableData() {
      this.tableLoading = true;
      // TODO
      const params = {
        ...this.pageQuery,
        mode: parseInt(this.pageQuery.mode),
        status: parseInt(this.pageQuery.status)
      }
      getCouponList(params)
        .then((res) => {
          this.tableData = res.data.rows.map((row) => {
            row.productList = row.productList.map((item) => item.product.name);
            return row;
          });
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    deleteRow(row) {
      this.$confirm('确定删除该优惠券吗？删除后将无法恢复。', '提示', {
        type: 'warning',
      }).then(() => {
        deleteCoupon(row.coupon.id).then((res) => {
          this.$message.success('删除成功！');
          this.getTableData();
        });
      });
    },
    createCoupon() {
      this.$router.push({
        path: '/coupon-create',
      });
    },
    statistics(row) {
      this.$router.push({
        path: '/coupon-statistics',
        query: {
          id: row?.coupon.id,
        },
      });
    },
    provide(row) {
      this.$confirm('确定发放后，用户将立即可以领取该优惠券。', '提示', {
        type: 'warning',
      }).then(() => {
        updateCoupon({ id: row.coupon.id, status: 1 }).then((res) => {
          // console.log(res);
          this.$message.success('操作成功！');
          this.getTableData();
        });
      });
    },
    stop(row) {
      this.$confirm(
        '确定结束后，将停止发行该券，已领取的优惠券可继续使用。',
        '提示',
        {
          type: 'warning',
        }
      ).then(() => {
        updateCoupon({ id: row.coupon.id, status: 2 }).then((res) => {
          // console.log(res);
          this.$message.success('操作成功！');
          this.getTableData();
        });
      });
    },
    showHomeHandler(row) {
      if(row.coupon.status === 2) {
        return
      }
      const params = {
        id: row.coupon.id,
        showHome: row.coupon.showHome === 1 ? 0 : 1
      }
      updateCoupon(params).then((res) => {
        // console.log(res);
        this.$message.success('操作成功！');
        this.getTableData();
      });
    },
    viewDetail(row) {
      // console.log(row);
      this.visibleCouponId = row.coupon.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-filters {
  padding-top: 0;
  margin-bottom: 8px;
  color: #333;
  .search-handler {
    margin-left: 0;
  }
  > .el-row {
    flex: auto;
    > div {
      margin-top: 16px;
    }
  }
}
</style>
