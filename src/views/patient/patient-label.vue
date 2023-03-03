<template>
  <div class="app-container">
    <div class="left-part">
      <ly-tree
        ref="lyTree"
        @updateNodeInfo="updateNodeInfo"
        @initData="initData"
      />
    </div>
    <div class="pa-right-part">
      <div class="filter-container filter-box">
        <div class="filter-wrapper">
          <filter-select
            title="标签类型"
            :value.sync="listQuery.tagType"
            placeholder="标签类型"
            :options="tagTypeOptions"
          ></filter-select>
          <filter-input
            class="keywork-input"
            :value.sync="listQuery.labelName"
            placeholder="标签名称"
            title="标签搜索"
          />
          <!-- <el-input
          v-model="listQuery.labelName"
          placeholder="输入标签名称查找"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        /> -->
          <el-button
            v-waves
            class="pa-btn"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            查询
          </el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-filter">
          <i />
          <el-button
            v-waves
            :disabled="typeNode.level <= 1"
            class="pa-btn"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >
            新增标签
          </el-button>
        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          :height="tableHeight"
          class="pa-table"
        >
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="编号" min-width="120px">
            <template slot-scope="{ row }">
              <span>{{ row.labelCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="标签名称"
            min-width="170px"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.labelName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权重" min-width="70px">
            <template slot-scope="{ row }">
              <span>{{ row.weight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="100px">
            <template slot-scope="{ row }">
              <span>{{ (row.tagType ? "自动" : "手动") + "标签" }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="排序" width="100px">
            <template slot-scope="{ row }">
              <span>{{ row.displayOrder }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="是否启用" min-width="100px">
            <!-- <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="activeValue"
              :inactive-value="inactiveValue"
              @change="updateStatus(row)"
            />
          </template> -->
            <template slot-scope="scope">
              <pa-switch
                :active-value="activeValue"
                :inactive-value="inactiveValue"
                :value.sync="scope.row.status"
                @click="updateStatus(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column label="创建时间" min-width="170px">
            <template slot-scope="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="根类目"
            min-width="100px"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ getCategoryName(row.labelTypeId) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="200px" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="124px">
            <template slot-scope="{ row }">
              <el-button
                class="pa-btn el-button--primary-text"
                type="primary"
                size="mini"
                @click="editItem(row)"
              >
                编辑
              </el-button>
              <el-button
                class="pa-btn el-button--primary-text"
                type="primary"
                size="mini"
                @click="deleteItem(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pa-pagination
          :current-page="listQuery.pageNo"
          :page-size="listQuery.pageSize"
          :total="listQuery.total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        />
      </div>
    </div>

    <!-- 订单详情 start -->
    <pa-drawer
      :title="title"
      :visible.sync="detailVisible"
      @ok="submitForm"
      @cancel="cancleAdd"
    >
      <div class="drawer-content">
        <el-form
          label-position="top"
          ref="ruleForm"
          :model="detailInfo"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="所属分类" prop="labelTypeId">
            <el-input class="pa-input" v-model="categoryName" disabled />
          </el-form-item>
          <el-form-item label="标签名称" prop="labelName">
            <el-input
              class="pa-input"
              v-model.trim="detailInfo.labelName"
              maxlength="10"
              placeholder="输入标签名称最多10个字"
            />
          </el-form-item>
          <el-form-item label="编号" prop="labelCode">
            <el-input
              class="pa-input"
              v-model="detailInfo.labelCode"
              maxlength="10"
              placeholder="请输入编号"
              :disabled="!isAdd"
            />
          </el-form-item>
          <!-- <el-form-item label="排序" prop="displayOrder">
            <input-number
              class="pa-input"
              v-model="detailInfo.displayOrder"
              maxlength="5"
            />
          </el-form-item> -->
          <el-form-item label="状态" prop="status">
            <div slot="label" class="status-container">
              <div class="title">状态</div>
              <el-switch
                class="switch"
                v-model="detailInfo.status"
                :active-value="activeValue"
                :inactive-value="inactiveValue"
              />
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              v-model="detailInfo.description"
              type="textarea"
              placeholder="输入备注"
              maxlength="100"
              show-word-limit
              class="pa-input form-input textarea"
              :autosize="{ minRows: 4, maxRows: 16 }"
            />
          </el-form-item>
          <el-form-item label="权重" prop="weight">
            <input-number
              v-model="detailInfo.weight"
              :minValue="-100"
              :maxValue="100"
              placeholder="-100至100之间的整数"
            ></input-number>
          </el-form-item>
          <el-form-item label="标签类型" label-width="100px">
            <div slot="label">
              <span>标签类型</span>
              <el-radio-group v-model="detailInfo.tagType" :disabled="!isAdd">
                <el-radio :label="0" class="radio">手动标签</el-radio>
                <el-radio :label="1" class="radio">自动标签</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <div class="conditions" v-if="detailInfo.tagType === 1">
            <div class="condition-title">条件设置</div>
            <div class="condition-form">
              <div>
                <el-checkbox
                  v-model="detailInfo.conditions[0].type"
                  :true-label="1"
                  @change="conditionTypeChange(detailInfo.conditions[0])"
                ></el-checkbox>
                <span>孕周</span>
              </div>
              <div class="input-select flex">
                <el-form-item
                  prop="conditions[0].operator"
                  :rules="[
                    {
                      required: detailInfo.conditions[0].type,
                      message: '请选择',
                      trigger: 'change'
                    }
                  ]"
                  style="width: 90px"
                >
                  <pa-select
                    :value.sync="detailInfo.conditions[0].operator"
                    :options="operatorOptions"
                    style="width: 90px"
                    placeholder="请选择"
                    :clearable="false"
                  >
                  </pa-select>
                </el-form-item>
                <el-form-item
                  class="flex-main"
                  prop="conditions[0].gestation"
                  :rules="[
                    {
                      required: detailInfo.conditions[0].type,
                      message: '请输入孕周',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <input-number
                    placeholder="请输入1-40"
                    v-model="detailInfo.conditions[0].gestation"
                    :minValue="1"
                    :maxValue="40"
                  >
                  </input-number>
                </el-form-item>
                <span>周</span>
              </div>
              <el-form-item
                prop="conditions[1].dicCode"
                :rules="[
                  {
                    required: detailInfo.conditions[1].type,
                    message: '请选择用户年龄',
                    trigger: 'change'
                  }
                ]"
              >
                <div slot="label">
                  <el-checkbox
                    v-model="detailInfo.conditions[1].type"
                    :true-label="2"
                    @change="conditionTypeChange(detailInfo.conditions[1])"
                  ></el-checkbox>
                  <span>用户年龄</span>
                </div>
                <pa-select
                  :value.sync="detailInfo.conditions[1].dicCode"
                  :options="ageOptions"
                  placeholder="请选择用户年龄"
                  :clearable="false"
                  class="pa-form-select"
                >
                </pa-select>
              </el-form-item>
              <el-form-item
                prop="conditions[2].productId"
                :rules="[
                  {
                    required: detailInfo.conditions[2].type,
                    message: '请选择已购服务包',
                    trigger: 'change'
                  }
                ]"
              >
                <div slot="label">
                  <el-checkbox
                    v-model="detailInfo.conditions[2].type"
                    :true-label="3"
                    @change="conditionTypeChange(detailInfo.conditions[2])"
                  ></el-checkbox>
                  <span>已购服务包</span>
                </div>
                <pa-select
                  :value.sync="detailInfo.conditions[2].productId"
                  :options="productOptions"
                  placeholder="请选择服务包名"
                  :clearable="false"
                  class="pa-form-select"
                >
                </pa-select>
              </el-form-item>
              <el-form-item
                prop="conditions[3].dicCode"
                :rules="[
                  {
                    required: detailInfo.conditions[3].type,
                    message: '请选择最近消费时间',
                    trigger: 'change'
                  }
                ]"
              >
                <div slot="label">
                  <el-checkbox
                    v-model="detailInfo.conditions[3].type"
                    :true-label="4"
                    @change="conditionTypeChange(detailInfo.conditions[3])"
                  ></el-checkbox>
                  <span>最近消费时间</span>
                </div>
                <pa-select
                  :value.sync="detailInfo.conditions[3].dicCode"
                  :options="dateOptions"
                  placeholder="请选择最近消费时间"
                  :clearable="false"
                  class="pa-form-select"
                >
                </pa-select>
              </el-form-item>
              <el-form-item
                prop="conditions[4].dicCode"
                :rules="[
                  {
                    required: detailInfo.conditions[4].type,
                    message: '请选择最近访问时间',
                    trigger: 'change'
                  }
                ]"
              >
                <div slot="label">
                  <el-checkbox
                    v-model="detailInfo.conditions[4].type"
                    :true-label="5"
                    @change="conditionTypeChange(detailInfo.conditions[4])"
                  ></el-checkbox>
                  <span>最近访问时间</span>
                </div>
                <pa-select
                  :value.sync="detailInfo.conditions[4].dicCode"
                  :options="dateOptions"
                  placeholder="请选择最近访问时间"
                  :clearable="false"
                  class="pa-form-select"
                >
                </pa-select>
              </el-form-item>
              <div>
                <el-checkbox
                  v-model="detailInfo.conditions[5].type"
                  :true-label="6"
                  @change="conditionTypeChange(detailInfo.conditions[5])"
                ></el-checkbox>
                <span>累计订单金额</span>
              </div>
              <div class="flex form-items">
                <el-form-item
                  class="flex-main"
                  prop="conditions[5].totalMin"
                  :rules="[
                    {
                      validator: totalMinValidator,
                      trigger: 'blur'
                    }
                  ]"
                >
                  <input-number
                    v-model="detailInfo.conditions[5].totalMin"
                    @change="
                      $refs.ruleForm.validateField('conditions[5].totalMax')
                    "
                    :maxLength="8"
                    :minValue="0"
                  ></input-number>
                </el-form-item>
                <span> - </span>
                <el-form-item
                  class="flex-main"
                  prop="conditions[5].totalMax"
                  :rules="[
                    {
                      validator: totalMaxValidator,
                      trigger: 'blur'
                    }
                  ]"
                >
                  <input-number
                    v-model="detailInfo.conditions[5].totalMax"
                    :minValue="0"
                    :maxLength="8"
                    @change="
                      $refs.ruleForm.validateField('conditions[5].totalMin')
                    "
                  ></input-number>
                </el-form-item>
                <span>元</span>
              </div>
            </div>
          </div>
          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
            <el-button @click="cancleAdd">取消</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </pa-drawer>
  </div>
</template>

<script>
import {
  labelQuery,
  labelInsert,
  labelUpdate,
  labelDelete,
  getLabel
} from "@/api/patient";
import { dicData } from "@/mixins/request";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const { deepClone } = require("../../utils");
import LyTree from "@/components/Tree/src/tree.vue";
import InputNumber from "@/components/Form/input-number.vue";
import { find, cloneDeep } from "lodash";

export default {
  components: { LyTree, InputNumber },
  directives: { waves },
  data() {
    const regular = {
      num: /^[0-9]*$/ // 密码
    };
    var validateNum = (rule, value, callback) => {
      if (value && !regular.num.test(value)) {
        return callback(new Error("序号只能是数字"));
      } else {
        callback();
      }
    };
    const alphanumeric = {
      alp: /^[A-Za-z0-9]{1,30}$/
    };
    var validateLetter = (rule, value, callback) => {
      if (value && !alphanumeric.alp.test(value)) {
        return callback(new Error("只能输入数字及字母"));
      } else {
        callback();
      }
    };
    const totalMaxValidator = (rule, value, callback) => {
      if (!this.detailInfo.conditions[5].type) {
        callback();
        return;
      }
      console.log(value);
      if (
        value !== "" &&
        value !== null &&
        value < this.detailInfo.conditions[5].totalMin
      ) {
        callback(
          new Error(`必须大于或等于最小值`)
          // new Error(`不能小于${this.detailInfo.conditions[5].totalMin}`)
        );
      } else {
        callback();
      }
    };
    const totalMinValidator = (rule, value, callback) => {
      if (!this.detailInfo.conditions[5].type) {
        callback();
        return;
      }
      if (this.detailInfo.conditions[5].totalMax === "" && value === "") {
        callback(new Error(`请输入金额`));
        return;
      }
      if (
        this.detailInfo.conditions[5].totalMax &&
        value > this.detailInfo.conditions[5].totalMax
      ) {
        callback(
          new Error(`必须小于或等于最大值`)
          // new Error(`不能大于${this.detailInfo.conditions[5].totalMax}`)
        );
      } else {
        callback();
      }
    };

    return {
      totalMinValidator,
      treeData: [],
      totalMaxValidator,
      title: "",
      typeNode: {},
      tableHeight: 0,
      activeValue: 1,
      inactiveValue: 0,
      labelTypeId: 1, // 当前选中的label标签分类
      isAdd: true,
      detailInfo: {
        labelTypeId: "", // 标签分类
        status: 1,
        weight: "",
        tagType: 0,
        displayOrder: 1,
        conditions: []
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      detailVisible: false, // 是否显示详情弹框
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        tagType: "", // 0手动标签，1自动标签
        sortField: "createTime" // 排序字段
        // asc: true // 是否升序
      },
      showReviewer: false,
      // pvData: [],
      tagTypeOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "手动标签",
          value: "0"
        },
        {
          label: "自动标签",
          value: "1"
        }
      ],
      // departmentOptions: [
      //   { label: "新生儿科", key: 0 },
      //   { label: "儿科", key: 1 },
      //   { label: "重症医学科", key: 2 },
      //   { label: "产科", key: 3 }
      // ],
      // positionOptions: [
      //   { label: "医生", key: 1 },
      //   { label: "护士", key: 2 }
      // ],
      rules: {
        // displayOrder: [{ validator: validateNum, trigger: "blur" }],
        labelName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度不能超过10个字符",
            trigger: "blur"
          }
          // {
          //   pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/g,
          //   message: "只能输入中英文数字",
          //   trigger: "blur"
          // }
        ],
        labelCode: [
          { validator: validateLetter, trigger: "blur" },
          { required: true, message: "请输入编号", trigger: "blur" }
        ],
        labelTypeId: [
          { required: true, message: "请选择标签类型", trigger: "change" }
        ],
        weight: [
          {
            required: true,
            message: "请填写-100至100之间的整数",
            trigger: "blur"
          }
        ]
      },
      downloadLoading: false,
      operatorOptions: [],
      ageOptions: [],
      dateOptions: [],
      productOptions: [] // 产品服务下拉
    };
  },
  computed: {
    categoryName() {
      // console.log(this.typeNode);
      if (!this.detailInfo.labelTypeId) {
        return "";
      }
      const category = find(this.treeData, { id: this.detailInfo.labelTypeId });
      if (category) {
        return category.typeName;
      } else {
        return "";
      }
    }
  },
  watch: {
    labelTypeId(val) {
      // console.log(val);
      // if(this.$refs.lyTree.isEdit) return;
      this.handleFilter();
    }
  },
  created() {
    // 获取字典数据
    this.dicData("operator"); // 字典：操作符
    this.dicData("age"); // 字典：年龄
    this.dicData("date"); // 字典：时间
    this.getProducts();

    this.getList(false);
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(292);
    });
  },
  methods: {
    dicData(dicType) {
      dicData(dicType).then(res => {
        if (res.data) {
          this[dicType + "Options"] = res.data.map(item => {
            return {
              label: item.itemName,
              value: item.itemCode
            };
          });
        }
      });
    },
    getProducts() {
      this.$requestPost("/cloud-hmall/product/queryForMng", {
        pageNo: 1,
        pageSize: 300
      }).then(res => {
        // console.log(res);
        if (res.data && res.data.rows) {
          this.productOptions = res.data.rows.map(item => {
            return {
              label: item.product.name,
              value: item.product.id
            };
          });
        }
      });
    },
    initData(data) {
      // 找到根节点数据
      //this.typeNode = data[0]
      this.treeData = data.data;
      // console.log(data);
      this.typeNode = data.treeData[0];
      if (data.editorName && data.editorName.length > 0) {
        this.labelTypeId = data.editorName[0].id;
        this.typeNode = data.editorName[0];
      } else {
        this.labelTypeId = this.typeNode.id;
      }
      this.getList();
    },

    updateNodeInfo(node) {
      this.typeNode = node;
      console.log(node);
      //this.labelTypeId = node.id
      //this.detailInfo.labelTypeId = node.id
      this.labelTypeId = node?.id ? node.id : 0;
      // this.detailInfo.labelTypeId = node?.id ? node.id : 0;
      // this.detailInfo.labelTypeName = node.name;
    },
    // 分页器方法
    sizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    // getlabelType() {
    //   // 通过id查找名字
    //   return "";
    // },
    updateStatus(item) {
      const text = item.status === 1 ? "禁用" : "启用";
      this.$confirm(`是否${text}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        item.status = item.status === 1 ? 0 : 1;
        labelUpdate(item).then(res => {
          // 重新请求表格数据
          if (res.code === 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "更新成功!"
            });
          } else {
            item.status = item.status === 1 ? 0 : 1;
            this.$message({
              type: "error",
              message: "更新失败!"
            });
          }
        });
      });
    },
    editItem(item) {
      // console.log(item);
      getLabel(item.id).then(res => {
        // console.log(res);
        if (!res.data) {
          return;
        }

        this.detailInfo = Object.assign(res.data, {
          conditions: this.mergeConditions(res.data.conditions)
        });
        this.isAdd = false;
        this.title = "编辑标签";
        this.detailVisible = true;
      });
    },
    deleteItem(item) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            id: item.id
          };

          labelDelete(data).then(response => {
            // 重新请求表格数据
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });
        });
    },
    submitForm() {
      console.log(this.detailInfo);
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        const data = cloneDeep(this.detailInfo);
        if (this.detailInfo.tagType === 1) {
          data.conditions = data.conditions.filter(item => item.type);
          if (!data.conditions.length) {
            this.$message({
              type: "error",
              message: "自动标签必须至少设置一项条件"
            });
            return;
          }
        }

        if (this.isAdd) {
          labelInsert(data).then(response => {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            // 重新请求表格数据
            this.detailVisible = false;
            this.getList();
          });
        } else {
          if (data.used) {
            this.$confirm("该标签正在使用，是否确认编辑？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.lableUpdate(data);
            });
          } else {
            this.lableUpdate(data);
          }
        }
      });
    },
    lableUpdate(data) {
      labelUpdate(data).then(response => {
        this.$message({
          type: "success",
          message: "编辑成功!"
        });

        this.detailVisible = false;
        // 重新请求表格数据
        this.getList();
      });
    },
    cancleAdd() {
      this.$refs["ruleForm"].resetFields();
      this.detailVisible = false;
    },
    handleAdd() {
      this.detailInfo = {
        status: 1,
        weight: "",
        tagType: 0,
        displayOrder: 1,
        conditions: this.mergeConditions()
      };
      this.isAdd = true;
      this.title = "新增标签";
      this.detailVisible = true;
      this.detailInfo.labelTypeId = this.labelTypeId;
    },
    conditionTypeChange(condition) {
      // 自动标签条件
      if (!condition.type) {
        Object.assign(condition, {
          type: "",
          operator: "",
          gestation: "",
          productId: "",
          dicCode: "",
          totalMin: "",
          totalMax: ""
        });
      }
    },
    mergeConditions(conditions) {
      const result = new Array(6).fill("").map((item, index) => {
        const initCondition = {
          type: "",
          operator: "",
          gestation: "",
          productId: "",
          dicCode: "",
          totalMin: "",
          totalMax: ""
        };
        if (!conditions) {
          return initCondition;
        }
        const condition = find(conditions, { type: index + 1 });
        if (!condition) {
          return initCondition;
        }
        Object.assign(initCondition, condition);
        return initCondition;
      });
      return result;
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value);
      let label = "";
      arr.forEach(element => {
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
        data.labelTypeId = this.labelTypeId;
      } else {
        // 查询表格数据不带查询条件
        data = {
          labelTypeId: this.labelTypeId,
          ...this.listQuery
          // sortField: this.listQuery.sortField,
          // pageNo: this.listQuery.pageNo,
          // pageSize: this.listQuery.pageSize
        };
      }
      labelQuery(data)
        .then(response => {
          this.list = response.data.rows || [];

          // 数据重置
          this.listQuery.total = response.data.total;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(e => {});
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
    getCategoryName(categoryId) {
      const category = find(this.treeData, { id: categoryId });
      if (category) {
        return category.typeName;
      } else {
        return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.keywork-input >>> .filter-input {
  width: 200px !important;
}

>>> .pa-pagination {
  padding: 0px;
}

.app-container {
  display: flex;
}
.pa-right-part {
  overflow: hidden;
  flex-grow: 1;
  margin-left: 8px;
  position: relative;
  .filter-box{
    margin-bottom: 0px;
    border-bottom: 1px solid #ebebeb;
  }
}
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
  margin-bottom: 15px;
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
.form-input.el-textarea {
  width: 100%;
}
.drawer-content {
  padding: 0 24px;
}
::v-deep.status-container {
  display: flex;
  align-items: center;
  .switch {
    margin-left: 10px;
  }
}
.left-part {
  min-width: 350px;
  overflow: scroll;
  height: 100% !important;
  background: #fff;
}
::v-deep.left-part .ly-tree-container {
  height: 100% !important;
}
::v-deep.pa-pagination {
  position: unset !important;
}
::v-deep.ly-tree {
  height: 100%;
  .el-card {
    height: 100%;
  }
}
.el-radio-group {
  margin-left: 16px;
}
::v-deep .radio {
  .el-radio__input.is-checked + .el-radio__label,
  .el-radio__label {
    color: #333;
  }
}
::v-deep .pa-drawer .drawer-body {
  width: 100%;
  height: calc(100% - 144px);
  overflow: hidden;
  color: #333;
}
.form-items {
  margin-top: 10px;
  span + .el-form-item,
  .el-form-item + span {
    margin-left: 8px;
  }
  .el-form-item {
    overflow: visible;
  }
  > span {
    line-height: 32px;
    margin-bottom: 18px;
  }
}
::v-deep .el-form .el-checkbox {
  margin-right: 4px;
}
.input-select {
  margin-top: 10px;
  position: relative;
  .el-form-item {
    overflow: visible;
  }
  > span {
    position: absolute;
    right: 8px;
    top: 0px;
    line-height: 32px;
  }
}
::v-deep .conditions {
  position: relative;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  margin-bottom: 24px;
  &::before {
    content: "";
    position: absolute;
    left: 180px;
    top: -8px;
    width: 16px;
    height: 16px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    background-color: #f8f8f8;
    z-index: 1;
    transform: rotate(45deg);
  }
  > .condition-title {
    padding: 0 16px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
  }
  > .condition-form {
    padding: 16px 16px 0;
    .el-form-item.is-required:not(.is-no-asterisk)
      > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk)
      .el-form-item__label-wrap
      > .el-form-item__label:before {
      display: none;
    }
  }
}
::v-deep .filter-wrapper{
  .filter-select,.filter-input{
    width: 220px !important;
  }
}
</style>
