<!-- 备份以后用，误删 -->
<template>
  <div class="app-container">
    <div class="list-container">
      <el-button type="primary" class="pa-btn" @click="addTemplate">
        <i class="el-icon-plus" />
        新增产检
      </el-button>
      <div class="list-content">
        <el-form :model="model" ref="form">
          <el-table :data="model.list" style="width: 100%">
            <el-table-column
              v-for="(item, index) in tableHeadData"
              :key="index"
              :label="item.columnName"
              :fixed="getFixedParams(item.columnType)"
              min-width="150"
              :width="item.columnType == 'IMAGE' ? '400' : ''"
            >
              <template slot-scope="scope">
                <!-- <el-form-item
                :prop="'list.' + scope.$index + '.' + item.name"
                :rules="scope.row.isEdit ? rules[item.name] : {}"
              >
              </el-form-item> -->
                <div v-if="item.columnType == 'first'">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.' + item.columnCode"
                    :rules="rules[item.columnCode]"
                  >
                    <el-select
                      v-model="scope.row[item.columnCode]"
                      placeholder="请选择孕周"
                    >
                      <el-option
                        v-for="(item, index) in gestationalWeekOptions"
                        :key="index"
                        :label="item.itemName"
                        :value="item.itemCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :prop="'list.' + scope.$index + '.' + item.columnCode2"
                    :rules="rules[item.columnCode2]"
                  >
                    <el-input
                      v-model="scope.row[item.columnCode2]"
                      placeholder="请输入产检主题"
                    ></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="item.columnType == 'TEXT'">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.' + item.columnCode"
                    :rules="rules[item.columnCode]"
                  >
                    <el-input
                      v-model="scope.row[item.columnCode]"
                      type="textarea"
                      :rows="4"
                      :placeholder="`请输入${item.columnName}`"
                      :maxlength="item.columnLength"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div v-else-if="item.columnType == 'IMAGE'">
                  <img-list v-model="scope.row[item.columnCode]" />
                </div>
                <div v-else-if="item.columnType == 'last'">
                  <el-button
                    type="text"
                    class="pa-btn el-button--primary-text"
                    @click="delClick(scope.row)"
                    >删除 {{scope.$index+1}}</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import ImgList from "./img-list.vue";
const validatorGestationalWeek = function (rule, value, callback) {
  // 多个输入是否有重复名
  const formNames = this.model.list.map((f) => {
    return f[this.tableHeadFirstData[0].columnCode];
  });
  let count = 0;
  for (let i = 0; i < formNames.length; i++) {
    if (value === formNames[i]) {
      count++;
    }
  }
  const isRepeat = count > 1;
  if (isRepeat) {
    callback(new Error("孕周不能重复，请重新选择"));
  } else {
    callback();
  }
};
export default {
  name: "DeliveryTemplate",
  components: {
    ImgList,
  },
  data() {
    return {
      // list数据
      /*  {
        concernCore:'',//关注重点
        inspectCore:'',//检查重点
        attention:'',//注意事项
        commonInspect:'',//常规检查
        specialInspect:'',//特殊检查
        treatmentProcess:'',//就诊流程
      } */
      model: {
        list: [],
      },
      tableHeadFirstData: [], // 第一列的数据
      tableHeadData: [],
      tableHeadLastData: [], // 最后一列的数据
      gestationalWeekOptions: [], //孕周
      initTableRowData: {}, //初始化模板数据
      rules: {},//校验规则
    };
  },
  mounted() {
    this.tableHeadFirstData = [
      {
        columnName: "",
        columnType: "first",
        columnCode: "gestationalWeek",
        columnCode2: "pregnancyTestName",
      },
    ];
    this.tableHeadLastData = [
      {
        columnName: "操作",
        columnType: "last",
        columnCode: "lastValue",
      },
    ];
    // 初始化数据
    this.model.list = [
      {
        gestationalWeek: "", //孕周
        pregnancyTestName: "", //产检名称
      },
    ];
    this.initData();
    this.queryTableHeader();
    this.queryGestationalWeek();
  },
  methods: {
    initData() {},

    // 模板新增一行数据
    addTemplate() {
      // this.initTableRowData.id = Date.now();
      this.model.list.push({ ...this.initTableRowData });
      //this.saveList()
    },

    // 获取表头数据
    async queryTableHeader() {
      const params = {
        deptId: 1,
        deptTableCode: "pregnancy",
      };
      const result = await this.$requestPost(
        `/cloud-consult/tableColumn/queryByDeptTableCode?deptId=${params.deptId}&deptTableCode=${params.deptTableCode}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.tableHeadData = [
            ...this.tableHeadFirstData,
            ...result.data,
            ...this.tableHeadLastData,
          ];
          // this.initTableRowData['id'] = Date.now();
          this.initTableRowData[this.tableHeadFirstData[0].columnCode] = "";
          this.initTableRowData[this.tableHeadFirstData[0].columnCode2] = "";
          console.log(this);
          this.rules[this.tableHeadFirstData[0].columnCode] = [
            { required: true, message: "请选择孕周", trigger: "change" },
            {
              required: true,
              validator: validatorGestationalWeek.bind(this),
              trigger: "blur",
            },
          ];
          this.rules[this.tableHeadFirstData[0].columnCode2] = [
            { required: true, message: "请输入产检主题", trigger: "blur" },
          ];
          console.log(this.tableHeadFirstData[0].columnCode);
          console.log(this.initTableRowData);
          [...result.data].forEach((item) => {
            //console.log(item);
            this.initTableRowData[item.columnCode] = "";
            // if (item.columnType == "TEXT") {
            //   this.rules[item.columnCode] = [
            //     {
            //       required: true,
            //       message: `请输入${item.columnName}`,
            //       trigger: "blur",
            //     },
            //   ];
            // }
          });
          this.model.list = [{ ...this.initTableRowData }];
          // console.log(this.model.list);
        }
      }
    },

    // 获取孕周数据
    async queryGestationalWeek() {
      const params = {
        dicType: "pregnancy",
      };
      let _url = "/cloud-baseinfo/sysDictionary/queryByType";
      const result = await this.$requestPost(
        `${_url}?dicType=${params.dicType}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.gestationalWeekOptions = result.data;
        }
      }
    },
    // 保存
    saveList() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("success");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除数据
    delClick(item) {
      this.$confirm(`删除后数据将无法恢复，请谨慎操作`, "确认删除", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let index = this.model.list.indexOf(item);
        if (index !== -1) {
          this.model.list.splice(index, 1);
        }
      });
    },

    // 获取table的fixed参数
    getFixedParams(val) {
      if (val == "first") {
        return "left";
      } else if (val == "last") {
        return "right";
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.list-container {
  background-color: #ffffff;
}
</style>