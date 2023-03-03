<template>
  <div class="app-container">
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button type="primary" class="pa-btn" @click="addRole">
          <i class="el-icon-plus" />
          新增角色
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
        :height="tableHeight"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          v-for="(item, index) in columnsData"
          :key="index"
          show-overflow-tooltip
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <span v-if="scope.row.roleSystem === 1">系统固定启用</span>
            <pa-switch v-if="scope.row.roleSystem !== 1" :value.sync="scope.row.status" @click="switchClick(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" class="pa-btn el-button--primary-text" :disabled="scope.row.roleSystem === 1" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" class="pa-btn el-button--primary-text" :disabled="scope.row.roleSystem === 1" @click="delClick(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'RoleSetting',
  data() {
    return {
      tableHeight: 500,
      listLoading: false, // 列表加载中
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      columnsData: [
        {
          prop: 'roleName',
          label: '角色名称'
        },
        {
          prop: 'roleUsers',
          label: '角色成员'
        },
        {
          prop: 'mark',
          label: '角色描述'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: '200px'
        }
      ],
      tableData: []
    }
  },
  created() {
  },
  mounted() {
    this.getList()
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
    async getList() {
      this.listLoading = true
      const params = {}
      const result = await this.$requestPost(
        `/cloud-user/sysRole/queryRoles?pageNo=${this.pagination.pageNo}&pageSize=${this.pagination.pageSize}`,
        params
      )
      this.listLoading = false
      if (result && result.code === 200) {
        this.pagination.total = result.data.total
        this.tableData = result.data.rows.map(item => {
          item = {
            ...item,
            status: !!item.status,
            roleUsers: item.roleUsers ? item.roleUsers : 0
          }
          return item
        })
      }
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
    switchClick(row) {
      const text = row.status ? '禁用' : '启用'
      this.$confirm(`是否${text}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.switchStatus(row)
      })
    },
    async switchStatus(row) {
      const params = {
        // roleId: row.roleId,
        // status: row.status ? 0 : 1
      }
      const result = await this.$requestPost(
        `/cloud-user/sysRole/isEnabledById?roleId=${row.roleId}&status=${row.status ? 0 : 1}`,
        params
      )
      if (result && result.code === 200) {
        this.$message({ message: `${row.status ? '禁用' : '启用'}成功`, type: 'success' })
      }
      
      this.getList()
    },
    delClick(row) {
      this.$confirm(`删除后数据将无法恢复，请谨慎操作`, '确认删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(row)
      })
    },
    async delItem(row) {
      const params = {}
      const result = await this.$requestPost(
        `/cloud-user/sysRole/deleteById?roleId=${row.roleId}&del=1`,
        params
      )
      if (result && result.data) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getList()
      } else if (result && !result.data) {
        this.$message({ message: '该角色下已有用户， 不允许删', type: 'error' })
      }
    },
    editItem(row) {
      this.$router.push({
        path: '/roleEdit',
        query: {
          roleId: row.roleId
        }
      })
    },
    addRole() {
      this.$router.push({ path: '/roleCreate' })
    }
  }
}
</script>
<style scoped>
</style>
