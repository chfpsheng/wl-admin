<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-add"
        @click="handleAdd"
      >
        {{ $t("table.add") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="calc(100vh - 190px)"
    >
      <el-table-column label="员工编号" width="150px" prop="employeeNum">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.jobType === 1 ? "医生" : "护士" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="150px">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="editItem(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="deleteItem(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 订单详情 start -->
    <el-drawer title="员工信息" :visible.sync="detailVisible">
      <el-form
        ref="ruleForm"
        :model="detailInfo"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="detailInfo.name" />
        </el-form-item>
        <el-form-item label="所属科室" prop="department">
          <el-select
            v-model="detailInfo.departmentId"
            placeholder="所属科室"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="jobType">
          <el-select
            v-model="detailInfo.jobType"
            placeholder="所属科室"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in positionOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="detailInfo.mobile" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="detailInfo.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">确定</el-button>
          <el-button @click="cancleAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  fetchEmployeeList,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/api/employee";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const { deepClone } = require("../../utils");

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      isAdd: true,
      detailInfo: {},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      detailVisible: false, // 是否显示详情弹框
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        type: undefined,
        sortField: "createTime", // 排序字段
        // asc: true // 是否升序
      },
      showReviewer: false,
      pvData: [],
      departmentOptions: [
        { label: "新生儿科", key: 0 },
        { label: "儿科", key: 1 },
        { label: "重症医学科", key: 2 },
        { label: "产科", key: 3 },
      ],
      positionOptions: [
        { label: "医生", key: 1 },
        { label: "护士", key: 2 },
      ],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 36,
            message: "长度在 3 到 36 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
          //   { validator: validatePassword, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList(false);
  },
  methods: {
    editItem(item) {
      this.isAdd = false;
      this.detailInfo = deepClone(item);
      this.detailVisible = true;
    },
    deleteItem(item) {
      const data = {
        id: item.id,
      };
      deleteEmployee(data).then((response) => {
        // 重新请求表格数据
        this.getList(false);
      });
    },
    submitForm() {
      delete this.detailInfo.department;
      if (this.isAdd) {
        addEmployee(this.detailInfo).then((response) => {
          // 重新请求表格数据
          this.detailVisible = false;
          this.getList(false);
        });
      } else {
        updateEmployee(this.detailInfo).then((response) => {
          this.detailVisible = false;
          // 重新请求表格数据
          this.getList(false);
        });
      }
    },
    cancleAdd() {
      this.detailVisible = false;
    },
    handleAdd() {
      this.detailInfo = {};
      this.isAdd = true;
      this.detailVisible = true;
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value);
      let label = "";
      arr.forEach((element) => {
        if (element.key === value) {
          label = element.label;
        }
      });
      return label;
    },

    // 获取订单列表
    getList(search = true) {
      this.listLoading = true;
      let data = {};
      if (search) {
        // 带查询条件
        data = this.listQuery;
      } else {
        // 查询表格数据不带查询条件
        data = {
          sortField: this.listQuery.sortField,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        };
      }
      fetchEmployeeList(data).then((response) => {
        this.list = response.data.rows || [];
        // 数据重置
        this.list.forEach((item) => {
          item.useStatus = String(item.useStatus);
          item.patient = item.patient || {};
          item.doctor = item.doctor || {};
        });
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    // 查看/详情
    onDetail(row) {
      this.detailVisible = true;
      this.detailInfo = row || {};
    },

    // 导出
    onExport() {
      // 请求api地址
      const base = process.env.VUE_APP_BASE_API;
      const params = this.setParams();
      location.href = `${base}/order/export${params}`;
    },

    // 搜索
    handleFilter() {
      // 当搜索时间选择时，必须要输入时间
      if (
        this.listQuery &&
        this.listQuery.timeType &&
        !this.listQuery.datetime
      ) {
        this.$message({
          message: "起止时间不能为空",
          type: "warning",
        });
        return;
      }
      if (this.listQuery.datetime && !this.listQuery.timeType) {
        this.$message({
          message: "时间查询类型不能为空",
          type: "warning",
        });
        return;
      }
      if (this.listQuery && this.listQuery.datetime) {
        this.listQuery.startTime = this.listQuery.datetime[0] + " 00:00:00";
        this.listQuery.endTime = this.listQuery.datetime[1] + " 23:59:59";
      }
      this.listQuery.pageNo = 1;
      this.getList();
    },

    // 设置get请求参数url
    setParams() {
      const token = getToken();
      let result = "";
      let item;
      // 请求参数 + token
      const obj = Object.assign(this.listQuery, { token: token });
      for (item in obj) {
        if (obj[item] && String(obj[item])) {
          result += `&${item}=${obj[item]}`;
        }
      }
      if (result) {
        result = "?" + result.slice(1);
      }
      return result;
    },

    // 保留两位小数
    setDecimal(value) {
      if (!value) {
        return;
      }
      return value.toFixed(2);
    },
  },
};
</script>
<style scoped>
.detail-item {
  display: flex;
  margin-bottom: 16px;
}
.detail-item .title {
  width: 120px;
}
.detail-item .text {
  color: #333;
}
.detail-sub-title {
  font-weight: bold;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
  margin-bottom: 16px;
}
.detail-item .product img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}
.detail-container {
  font-size: 14px;
  padding-left: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
  margin-right: -20px;
}
.export-btn {
  margin-left: 0;
}
.empty img {
  width: 98px;
  height: 64px;
}
</style>
