<template>
  <div class="profile-set-manage searchAdapt-OneTwo">
    <el-form
      :model="searchForm"
      ref="searchForm"
      slot="search-bar"
      label-position="left"
      :label-width="72"
      class="ivu-form-no-margin-bottom"
      inline
    >
      <template>
        <el-row :gutter="45">
          <el-col span="6">
            <el-form-item prop="ecsTenantId" label="租户名称">
              <el-select
                v-model="searchForm.ecsTenantId"
                clearable
                filterable
                placeholder="请选择租户名称"
                transfer
              >
                <el-option
                  v-for="item in tenantList"
                  :key="item.id"
                  :value="item.id"
                  name
                  >{{ item.tenantName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item prop="applicationCode" label="应用编码">
              <el-input
                type="text"
                :maxlength="50"
                v-model.trim="searchForm.applicationCode"
                @on-enter="search"
                clearable
                placeholder="请输入应用编码"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item prop="applicationName" label="应用名称">
              <el-input
                type="text"
                :maxlength="50"
                v-model.trim="searchForm.applicationName"
                @on-enter="search"
                clearable
                placeholder="请输入应用名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col span="6" class="handle-bar-one">
            <el-form-item prop="button" :label-width="0">
              <div>
                <el-button @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="onAdd"
      >
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :height="tableHeight"
      v-loading="listLoading"
      class="pa-table"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        label="序号"
        type="index"
        width="80"
        fixed="left"
      ></el-table-column>

      <el-table-column prop="tenantName" label="租户名称" width="180">
      </el-table-column>
      <el-table-column prop="applicationCode" label="应用编码" width="180">
      </el-table-column>
      <el-table-column
        prop="applicationName"
        label="应用名称"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column label="应用描述" prop="description"> </el-table-column>
      <el-table-column prop="certification" label="证书" sortable width="180">
      </el-table-column>

      <el-table-column prop="remark" label="备注" width="180">
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="updateUserName" label="更新人" width="180">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180">
      </el-table-column>

      <el-table-column prop="remark" label="备注" width="180">
      </el-table-column>
      <el-table-column label="操作" min-width="150px" fixed="right">
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top" effect="light">
            <i class="el-icon-edit mouse-pointer" @click="onEdit(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-delete mouse-pointer" @click="onDelete(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pa-pagination
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="pagination.total"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>
import {
  queryApplicationListPage,
  deleteApplication,
} from "@/api/application.js";
import { queryTenantList } from "@/api/tenant.js";
import { valueSetApi } from "@/api/valueSet.js";
import applicationEdit from "./applicationEdit";

export default {
  name: "ecs-application-manage",
  data() {
    return {
      isloading: false,
      showMore: false,
      selectedIdList: [],
      tenantList: [],
      // accessModeList: [], //接入方式
      searchForm: {
        id: "",
        ecsTenantId: "",
        applicationCode: "",
        applicationName: "",
        description: "",
        certification: "",
        accessMode: "",
        remark: "",
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        condition: {},
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      listLoading: false, // 列表加载中
      tableData: [],
      tableHeight: 500,
    };
  },
  mounted() {
    // this.getTenantList();
    // this.getAccessModeList();
    this.getList();
  },
  methods: {
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      queryApplicationListPage(this.listQuery).then((res) => {
        this.tableData = res.data && res.data.records;
        this.listLoading = false;
        this.tableData = res.data.records;
        this.pagination.total = res.data.total;
      });
    },
    // responseProcess为InnerPageTable提供的回调函数，会自动处理返回的数据
    // param会自动将searchForm中的参数注入
    loadData({ responseProcess, param }) {
      queryApplicationListPage(param).then((res) => responseProcess(res.data));
    },

    reset() {
      this.$refs["searchForm"].resetFields();
      this.search(1);
    },
    onAdd() {
      new this.$pageModal(
        applicationEdit,
        {
          props: {},
        },
        (data) => {
          if (data) {
            this.search();
          }
        }
      );
    },
    onEdit() {
      if (this.selectedIdList.length !== 1) {
        this.$Message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      const id = this.selectedIdList[0];
      new this.$pageModal(
        applicationEdit,
        {
          props: {
            id: id,
          },
        },
        (data) => {
          if (data) {
            this.search();
          }
        }
      );
    },
    onDelete() {
      if (this.selectedIdList.length === 0) {
        this.$Message.warning({
          content: "请选择要删除的数据",
          duration: 3,
        });
        return;
      }

      new $confirm("确认删除？", this).then(() => {
        this.isloading = true;
        deleteApplication(this.selectedIdList)
          .then((res) => {
            if (res.code === 0) {
              this.$Message.success({
                content: "删除成功",
                duration: 3,
              });
            } else {
              this.$Message.error({
                content: res.msg,
                duration: 3,
              });
            }
            this.search();
          })
          .finally(() => {
            this.isloading = false;
          });
      });
    },
    onSelectionChange(selectArr) {
      this.selectedIdList = selectArr.map((item) => {
        return item.id;
      });
    },
    getTenantList() {
      queryTenantList({}).then((res) => {
        this.tenantList = res.data;
      });
    },
    //获取接入方式
    // getAccessModeList() {
    //   valueSetApi.getValueSet({ vsCode: "ACCESS_MODE" }).then((res) => {
    //     this.accessModeList = res.data;
    //   });
    // },
    //根据key获取接入方式名称
    // getAccessModeName(key){
    //   const accessMode =  this.accessModeList.find(item=> item.vsiKey === key)
    //   if (accessMode) {
    //     return accessMode.vsiValue
    //   } else {
    //     return ''
    //   }
    // }
  },
};
</script>
