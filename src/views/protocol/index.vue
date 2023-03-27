<template>
  <div class="app-container" ref="appContainer">
    <div class="filter-container filter-box filter-boxs">
      <div class="filter-wrapper filter---multiline---wrapper">
        <filter-select
          :value.sync="filter.ecsTenantId"
          :options="tenantList"
          title="租户名称"
        />
        <!-- <filter-select
          :value.sync="filter.role"
      
          :options="roleOptions"
          title="所属角色"
        />  -->
        <filter-input
          :value.sync="filter.applicationCode"
          placeholder="应用编码"
          title="应用编码"
        />
        <filter-input
          :value.sync="filter.applicationName"
          placeholder="应用名称"
          title="应用名称"
        />
        <el-button type="primary" class="pa-btn" @click="search">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button type="primary" class="pa-btn" @click="addEmployee">
          <i class="el-icon-plus" />
          新增员工
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="编号" prop="userCode" show-overflow-tooltip />
        <el-table-column label="员工" prop="userName" show-overflow-tooltip />
        <el-table-column label="手机号" min-width="180px">
          <template slot-scope="{ row }">
            <template v-if="row.phone">
              <span>{{ row.phone }}</span>
              <SensitiveInfoShow
                :id="row.id"
                type="手机号"
                :url="sensitiveInfoInitUrl"
              />
              <!-- <i class="iconfont icon-xiugaiiconbeifen1 phone-icons" @click="modifySensitiveInfo(row,1)" /> -->
            </template>
          </template>
        </el-table-column>
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
            <pa-switch
              :value.sync="scope.row.status"
              @click="switchClick(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="delClick(scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="resetClick(scope.row)"
              >重置密码</el-button
            >
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
    <!-- <SensitiveInfo
      v-if="sensitiveInfoVisible"
      v-model="sensitiveInfoVisible"
      :sensitiveInfoInit="sensitiveInfoInit"
      @updateList="sensitiveInfoUpdateList"
    /> -->
  </div>
</template>

<script>
import baseDataMixin from "@/mixins/baseData";
import { randomPassword, randomBetweenNumber } from "@/utils/tools";
// import SensitiveInfo from "./sensitive-info.vue";
//import SensitiveInfoShow from './sensitive-info-show.vue'
import SensitiveInfoShow from "@/components/SensitiveInfo/sensitive-info-show.vue";
export default {
  name: "ServiceManage",
  mixins: [baseDataMixin],
  // components: {
  //   SensitiveInfo,
  //   SensitiveInfoShow,
  // },
  data() {
    return {
      tableHeight: 500,
      listLoading: false, // 页面加载中
      filter: {
        id: "",
        ecsTenantId: "",
        applicationCode: "",
        applicationName: "",
        description: "",
        certification: "",
        accessMode: "",
        remark: "",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tenantList: [],
      columnsData: [
        {
          prop: "deptName",
          label: "科室",
        },
        {
          prop: "dutyName",
          label: "所属岗位",
        },
        // {
        //   prop: 'roleName',
        //   label: '所属角色'
        // },
        {
          prop: "otherTittle",
          label: "其他职级",
        },
        {
          prop: "mark",
          label: "管家简介",
        },
      ],
      tableData: [],
      dutyOptions: [],
      deptOptions: [],
      roleOptions: [],
      sensitiveInfoVisible: false, //敏感信息弹框显示
      sensitiveInfoInitUrl: "/cloud-user/sysUser/get",
      sensitiveInfoInit: {
        //敏感信息弹框初始化
        title: "修改手机号",
      },
      copyValue: "",
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(288);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(288);
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    queryList() {
      this.pagination.pageNo = 1;
      this.getList();
    },
    async getList() {
      this.listLoading = true;
      const params = {
        ...this.filter,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      const result = await this.$requestPost(
        "/cloud-user/sysUser/queryByCondition",
        params
      );
      this.listLoading = false;
      if (result && result.code === 200) {
        if (result.data) {
          this.pagination.total = result.data.total;
          this.tableData = result.data.rows.map((item) => {
            const deptName = this.deptOptions.find(
              (i) => i.value === parseInt(item.deptCode)
            );
            const dutyName = this.dutyOptions.find(
              (i) => i.value === item.duty
            );
            item = {
              ...item,
              status: !!item.status,
              deptName: deptName.label,
              dutyName: dutyName.label,
            };
            return item;
          });
        } else {
          this.pagination.total = 0;
          this.tableData = [];
        }
      }
    },
    async initData() {
      this.listLoading = true;
      this.roleOptions = await this.roleDataMixins(); // 角色
      this.dutyOptions = await this.dicDataMixins("duty"); // 岗位
      this.deptOptions = await this.deptDataMixins(); // 科室
      this.getList();
    },
    switchChange(val) {},
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.getList();
    },
    switchClick(row) {
      const text = row.status ? "禁用" : "启用";
      this.$confirm(`是否${text}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.switchStatus(row);
      });
    },
    async switchStatus(row) {
      const params = {};
      const result = await this.$requestPost(
        `/cloud-user/sysUser/isEnabledById?id=${row.id}&status=${
          row.status ? 0 : 1
        }`,
        params
      );
      if (result && result.code === 200) {
        this.$message({
          message: `${row.status ? "禁用" : "启用"}成功`,
          type: "success",
        });
      }
      this.getList();
    },
    delClick(row) {
      this.$confirm(`删除后数据将无法恢复，请谨慎操作`, "确认删除", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.delItem(row);
      });
    },
    resetClick(row) {
      // setTimeout(() => {
      //   document.getElementById('pacCopyIcon').addEventListener('click', () => {
      //     this.copyText()
      //   })
      // }, 1000)
      // let password = row.phone.substring(row.phone.length - 6)
      // password = 'Service' + password
      let _between = randomBetweenNumber(8, 16);
      let password = randomPassword(_between);
      this.$confirm(
        `<span>是否确定重置密码，密码重置后，新密码为${password}</span>`,
        "重置密码",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.resetPassword(row, password);
      });
    },
    async resetPassword(row, password) {
      const passwordMd5 = this.$md5(password);
      const params = {
        userId: row.id,
        password: passwordMd5,
      };
      const result = await this.$requestPost(
        `/cloud-user/sysUser/revertPassword?userId=${row.id}&password=${passwordMd5}`
        //params
      );
      if (result && result.code === 200) {
        this.$message.success("重置成功");
      }
    },
    copyText() {
      this.$copyText(this.copyValue, this.$refs.appContainer).then((e) => {});
    },
    async delItem(row) {
      const params = {};
      const result = await this.$requestPost(
        `/cloud-user/sysUser/deleteById?id=${row.id}&del=1`,
        params
      );
      result && result.code === 200
        ? this.$message({
            message: "删除成功",
            type: "success",
          })
        : "";

      this.getList();
    },
    editItem(row) {
      const val = this.$session.get("employeeItem");
      val ? this.$session.remove("employeeItem") : "";
      this.$session.set("employeeItem", row);
      this.$router.push({
        path: "/employeeEdit",
        query: {
          id: row.id,
        },
      });
    },
    addEmployee() {
      this.$router.push({
        path: "/employeeCreate",
      });
    },
    // 修改敏感信息
    modifySensitiveInfo(row, type) {
      if (type == 1) {
        this.sensitiveInfoInit.title = "修改手机号";
      } else if (type == 2) {
        this.sensitiveInfoInit.title = "修改身份证号";
      }
      this.sensitiveInfoInit.data = row;
      this.sensitiveInfoVisible = true;
    },
    // 敏感信息修改完后触发更新列表
    sensitiveInfoUpdateList() {
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-boxs {
  margin-bottom: 8px;
  padding-bottom: 0;
}
.filter-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.filter---multiline---wrapper .filter-item {
  margin-right: 40px;
  margin-bottom: 16px !important;
}
.filter---multiline---wrapper .el-button--primary {
  margin-bottom: 16px !important;
}
.filter-item {
  margin-right: 0;
}
.phone-icons {
  margin-left: 5px;
  cursor: pointer;
}
@media only screen and (max-width: 1645px) and (min-width: 1568px) {
  .filter-wrapper {
    ::v-deep .filter-select,
    .filter-input {
      width: 193px;
    }
  }
}
</style>
