<template>
  <div class="app-container">
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button
          type="primary"
          class="pa-btn"
          icon="el-icon-plus"
          @click="addClick"
        >
          服务规格
        </el-button>
      </div>
      <el-table v-loading="listLoading" class="pa-table" :data="tableData" :height="tableHeight">
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column
          v-for="(item, index) in columnsData"
          :key="index"
          show-overflow-tooltip
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="规格" width="1500" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="display: flex">
              <el-tag v-for="(item1, index1) in scope.row.specValues" :key="index1" class="pa-tag">{{ item1.name }}</el-tag>
            </div>
            <!-- {{scope.row.specValues}} -->
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="130">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="editClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="delClick(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pa-pagination
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
    <pa-drawer
      :title="title"
      size="480px"
      :closable="true"
      :visible.sync="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOK"
      @cancel="handleCancel"
    >
      <specs-create
        v-if="visible"
        ref="specsCreate"
        :dept-options="deptOptions"
        :visible="visible"
        :title="title"
        @submitFinish="submitFinish"
        @confirmStatus="confirmStatus"
      />
    </pa-drawer>
  </div>
</template>

<script>
import SpecsCreate from './components/specs-create.vue'
import baseDataMixin from '@/mixins/baseData'
export default {
  name: 'RoleSetting',
  components: {
    SpecsCreate
  },
  mixins: [baseDataMixin],
  data() {
    return {
      title: '',
      tableHeight: 500,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columnsData: [
        {
          prop: 'specName',
          label: '服务规格名称',
          width: '140px'
        },
        {
          prop: 'departmentName',
          label: '所属科室',
          width: '140px'
        }
      ],
      tableData: [],
      visible: false,
      confirmLoading: false,
      listLoading: false, // 列表加载中
      deptOptions: [] // 所属科室
    }
  },
  created() {},
  mounted() {
    this.initData()
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(216)
    })
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(216)
    }
  },
  destroyed(){
    window.onresize = null;
  },
  methods: {
    async initData() {
      this.listLoading = true
      this.deptOptions = await this.deptDataMixins() // 科室
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const params = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      }
      const result = await this.$requestPost(
        '/cloud-hmall/serviceSpec/query',
        params
      )
      this.listLoading = false
      this.tableData = result.data.rows.map((item) => {
        const department = this.deptOptions.find(val => val.value === item.departmentId)
        const specValues = JSON.parse(item.specValues).sort((n1, n2) => {
          return n1.num - n2.num
        })
        item = {
          ...item,
          departmentName: department ? department.label : '',
          specValues
        }
        return item
      })
      
      this.pagination.total = result.data.total
    },
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.pagination.pageNo = val
      this.getList()
    },
    // 弹窗方法
    showDrawer() {
      this.visible = true
    },
    handleOK() {
      this.confirmLoading = true
      this.$refs.specsCreate.submitForm()
    },
    submitFinish(v1, v2) {
      
      this.confirmLoading = v1
      this.visible = v2
      !v1 && !v2 ? this.getList() : ''
    },
    confirmStatus(v) {
      this.confirmLoading = v
    },
    handleCancel() {
      this.visible = false
    },
    delClick(row) {
      this.$confirm(`是否确认删除服务规格？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delItem(row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消删除`
          })
        })
    },
    async delItem(row) {
      const result = await this.$requestPost(
        `/cloud-hmall/serviceSpec/delete?id=${row.id}`,
        {}
      )
      result && result.code === 200
        ? this.$message({
          message: '删除成功',
          type: 'success'
        })
        : ''
      this.getList()
    },
    addClick() {
      const val = this.$session.get('specsData')
      val ? this.$session.remove('specsData') : ''
      this.title = '新增服务规格'
      this.showDrawer()
    },
    editClick(row) {
      const val = this.$session.get('specsData')
      val ? this.$session.remove('specsData') : ''
      this.$session.set('specsData', row)
      this.title = '编辑服务规格'
      this.showDrawer()
    }
  }
}
</script>
<style scoped>
</style>
