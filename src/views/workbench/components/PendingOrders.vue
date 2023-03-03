<template>
  <div class="workbench-box">
    <div class="filter-container filter-box filter-boxs">
      <div class="filter-wrapper filter---multiline---wrapper" ref="filterWrapper">
        <filter-daterang-picker :value.sync="filter.date" title="日期范围" />
        <filter-select :value.sync="filter.status" :options="statusOptions" title="专属管家" />
        <filter-select :value.sync="filter.status" :options="statusOptions" title="状态" />
        <filter-input :value.sync="filter.name" placeholder="患者名称" title="患者名称" />
        <el-button type="primary" class="pa-btn">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="服务名称" prop="name" />
        <el-table-column label="患者" />
        <el-table-column label="孕周" />
        <el-table-column label="医生" />
        <el-table-column label="订单金额" />
        <el-table-column label="订单状态" />
        <el-table-column label="服务状态" />
        <el-table-column label="专属管家" />
        <el-table-column label="下单时间" />
        <el-table-column label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button type="text" class="pa-btn el-button--primary-text" @click="allotKeeper(scope.row)">分配管家</el-button>
            <el-button type="text" class="pa-btn el-button--primary-text">开启服务</el-button>
            <el-button type="text" class="pa-btn el-button--primary-text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pa-pagination
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
    />
    <!-- @sizeChange="sizeChange"
    @currentChange="currentChange" -->
  </div>
</template>
<script>
export default {
  name: 'PendingOrders',
  props: {
    /* deptOptions: {
      type: Array,
      default: () => []
    },
    visible: Boolean,
    title: {
      type: String,
      default: '标题'
    } */
  },
  data() {
    return {
      filter: {
        date: '',
        status: '',
        name: ''
      },
      searchVal: {},
      statusOptions: [],
      listLoading: false,
      tableData: [
        {
          name: '服务一'
        }
      ],
      tableHeight: 500,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    }
  },
  watch: {
    /* visible: {
      handler(val) {
        if (val) {
          const data = this.$session.get('specsData')
          this.initData(data)
        }
      },
      immediate: true
    } */
  },
  mounted() {
    this.initFun()
  },
  destroyed(){
    window.onresize = null;
  },
  methods: {
    // 计算表格高度
    initFun() {
      window.onresize = () => {
        this.countHeight()
      }
      this.$nextTick(() => {
        this.countHeight()
      })
    },
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight
      const num = 232 + h
      this.tableHeight = this.$computeHeight(num)
    },
    // 分配管家
    allotKeeper(row) {
      console.log('分配管家', row)
    }
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
</style>
