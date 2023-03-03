<!-- 备份以后用，误删 -->
<template>
  <div class="app-container">
    <div class="list-container">
      <div class="list-content">
        <el-form :model="model" ref="form" class="content-container">
          <div class="thead-contanier">
            <div
              class="thead-warp"
              v-for="(item1, index1) in tableHeadData"
              :key="index1"
              :class="[
                index1 == 0 ? 'thead-warp-first' : '',
                item1.columnType == 'TEXT' ? 'thead-warp-text' : '',
                item1.columnType == 'last' ? 'thead-warp-last' : '',
              ]"
              :style="getCssStyle(item1, index1, tableHeadData.length)"
            >
              <div class="first-column" v-if="index1 == 0">
                <div class="title">{{ item1.columnName }}</div>
                <el-button
                  class="pa-btn"
                  @click="addTemplate"
                  :autofocus="true"
                >
                  <i class="el-icon-plus" />
                  新增产检
                </el-button>
              </div>
              <div class="title" v-else>
                {{ item1.columnName }}
              </div>
            </div>
          </div>
          <div
            class="tr-contanier"
            v-for="(item0, index0) in model.list"
            :key="item0.uuid"
          >
            <div
              class="td-warp"
              v-for="(item, index) in tableHeadData"
              :key="index"
              :style="getCssStyle(item, index, tableHeadData.length)"
              :class="[
                index == 0 ? 'td-warp-first' : '',
                item.columnType == 'TEXT' ? 'td-warp-text' : '',
                item.columnType == 'date' ? 'td-warp-date' : '',
                item.columnType == 'last' ? 'td-warp-last' : '',
              ]"
            >
              <div
                class="content-warp first-column-content"
                v-if="item.columnType == 'first'"
              >
                <el-form-item
                  class="type-input"
                  :prop="'list.' + index0 + '.' + item.columnCode"
                  :rules="rules[item.columnCode]"
                >
                  <el-select
                    class="pa-select filter-select type-input pregnancy-week-select"
                    v-model="item0[item.columnCode]"
                    placeholder="请选择孕周"
                    @change="pregnancyWeekChange(item0)"
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
                  class="type-input"
                  :prop="'list.' + index0 + '.' + item.columnCode2"
                  :rules="rules[item.columnCode2]"
                >
                  <el-input
                    class="pa-input type-input topic-input"
                    v-model="item0[item.columnCode2]"
                    placeholder="请输入产检主题"
                    maxlength="10"
                  ></el-input>
                </el-form-item>
                <template-text-date
                  v-if="initTemplateHeaderData.length > 0"
                  :value="item0[item.columnCode]"
                  :initPregnancyWeek="initPregnancyWeek"
                />
              </div>
              <div class="content-warp" v-else-if="item.columnType == 'TEXT'">
                <el-form-item
                  :prop="'list.' + index0 + '.' + item.columnCode"
                  :rules="rules[item.columnCode]"
                >
                  <el-input
                    v-model.lazy="item0[item.columnCode]"
                    type="textarea"
                    class="column-textarea"
                    :placeholder="`请输入${item.columnName}`"
                    :maxlength="item.columnLength"
                    resize="none"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
              </div>
              <div class="content-warp" v-else-if="item.columnType == 'IMAGE'">
                <img-list v-model="item0[item.columnCode]" />
              </div>
              <div class="content-warp" v-else-if="item.columnType == 'last'">
                <el-button
                  type="text"
                  class="pa-btn el-button--primary-text"
                  icon="el-icon-delete"
                  @click="delClick(item0)"
                >
                </el-button>
              </div>
              <div class="content-warp" v-else-if="item.columnType == 'date'">
                <el-form-item
                  class="type-date"
                  :prop="'list.' + index0 + '.' + item.columnCode"
                  :rules="rules[item.columnCode]"
                >
                  <el-date-picker
                    :clearable="false"
                    class="pa-input column-date-picker"
                    v-model="item0[item.columnCode]"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="content-warp" v-else></div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import ImgList from "./img-list.vue";
import TemplateTextDate from "./template-text-date.vue";
const validatorGestationalWeek = function (rule, value, callback) {
  //多个输入是否有重复名
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
    callback(new Error("孕周不能重复"));
  } else {
    callback();
  }
};
const validatorPregnancyTestName = function (rule, value, callback) {
  // 多个输入是否有重复名
  //console.log(this);
  const formNames = this.model.list.map((f) => {
    return f[this.tableHeadFirstData[0].columnCode2];
  });
  let count = 0;
  for (let i = 0; i < formNames.length; i++) {
    if (value === formNames[i]) {
      count++;
    }
  }
  const isRepeat = count > 1;
  if (isRepeat) {
    callback(new Error("产检主题不能重复"));
  } else {
    callback();
  }
};
export default {
  name: "DeliveryTemplate",
  components: {
    ImgList,
    TemplateTextDate,
  },
  props: {
    // 初始化模板行数据
    initTemplateData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 初始化模板表头列数据
    initTemplateHeaderData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 初始化模板孕周数据(患者消息产检日程表才会有这个)
    initPregnancyWeek: {
      type: Array,
      default: function () {
        return [];
      },
    },
    deptId: {
      type: String | Number,
      default: "",
    },
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
      rules: {}, //校验规则
    };
  },
  async mounted() {
    this.tableHeadFirstData = [
      {
        columnName: "产检",
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
    /* this.model.list = [
      {
        gestationalWeek: "", //孕周
        pregnancyTestName: "", //产检名称
      },
    ]; */

    await this.queryTableHeader();
    await this.queryGestationalWeek();
    //this.initData();
  },
  watch: {
    initTemplateData: {
      handler(val) {
        let _val = JSON.parse(JSON.stringify(val));
        this.model.list = [..._val];
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initData() {
      //this.model.list = this.initTemplateData;
    },

    // 模板新增一行数据
    addTemplate() {
      if (this.model.list.length == this.gestationalWeekOptions.length) {
        this.$message({
          message: `最多只能新增${this.gestationalWeekOptions.length}条数据`,
          type: "warning",
        });
        return;
      }
      let _object = Object.assign({}, this.initTableRowData, {
        uuid: this.guid(),
      });
      this.model.list.push(_object);
    },

    // 获取表头数据
    async queryTableHeader() {
      const params = {
        deptId: this.deptId,
        deptTableCode: "pregnancy",
      };
      const result = await this.$requestPost(
        `/cloud-consult/tableColumn/queryByDeptTableCode?deptId=${params.deptId}&deptTableCode=${params.deptTableCode}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.tableHeadData = [
            ...this.tableHeadFirstData,
            ...this.initTemplateHeaderData,
            ...result.data,
            ...this.tableHeadLastData,
          ];
          // console.log("---tableHeadData---", this.tableHeadData);
          this.initTableRowData[this.tableHeadFirstData[0].columnCode] = "";
          this.initTableRowData[this.tableHeadFirstData[0].columnCode2] = "";
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
            {
              required: true,
              validator: validatorPregnancyTestName.bind(this),
              trigger: "blur",
            },
          ];
          this.rules["pregnancyTime"] = [
            { required: true, message: "请选择产检日期", trigger: "change" },
          ];
          [...result.data, ...this.initTemplateHeaderData].forEach((item) => {
            this.initTableRowData[item.columnCode] = "";
          });
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
      this.$confirm(`是否确定删除本次产检？`, "确定删除", {
        confirmButtonText: "确定",
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
    getCssStyle(item1, index = 0, length = 0) {
      let _index0 = {};
      if (index == length - 1) {
        /* _index0 = {
          position: "absolute",
          "z-index": "1",
          right: "16px",
          "background-color": "#ffffff",
        }; */
      }
      return {
        width: item1.columnType == "IMAGE" ? "240px" : "",
        ..._index0,
      };
    },
    // select孕周改变
    pregnancyWeekChange(item) {
      if (item.hasOwnProperty("pregnancyTime")) {
        item["pregnancyTime"] = this.getPregnancyWeekDate(item.gestationalWeek);
      }
    },
    // 获取孕周所有对应的孕产日期
    getPregnancyWeekDate(gestationalWeek) {
      let _value = "";
      if (this.initPregnancyWeek) {
        this.initPregnancyWeek.forEach((item) => {
          if (item.pregnancyWeek == gestationalWeek) {
            _value = item.date;
          }
        });
      }
      return _value;
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.list-container {
  background-color: #ffffff;
}
.content-container {
  overflow-x: scroll;
  .thead-contanier {
    width: fit-content;
    display: -webkit-box;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    .thead-warp {
      background-color: #f7f9fc;
      border-right: 1px solid #ebebeb;
      width: 234px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      .first-column {
        .title {
          text-align: center;
        }
        .pa-btn {
          color: #2b81d6;
          background-color: #fff;
          border-color: #2b81d6;
          margin-top: 8px;
        }
      }
      .title,
      .first-column .title {
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
    }
    .thead-warp-first {
      width: 144px;
      border-left: 1px solid #ebebeb;
    }
    .thead-warp-text {
      flex: 1;
      min-width: 158px;
    }
    .thead-warp-last {
      width: 60px;
    }
  }
  .tr-contanier {
    width: fit-content;
    display: flex;
    border-bottom: 1px solid #ebebeb;
    .td-warp {
      width: 234px;
      display: flex;
      align-items: center;
      border-right: 1px solid #ebebeb;
      .content-warp {
        text-align: center;
        width: inherit;
      }
      .first-column-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    .td-warp-first {
      border-left: 1px solid #ebebeb;
      width: 144px;
    }
    .td-warp-text {
      flex: 1;
      padding: 8px;
      min-width: 158px;
    }
    .td-warp-last {
      width: 60px;
    }
    .td-warp-date {
      .content-warp {
        display: flex;
        justify-content: center;
      }
    }
  }
}
.type-input {
  width: 113px;
}
::v-deep .pregnancy-week-select{
  .el-input__inner{
    padding-left: 8px;
  }
}
::v-deep .topic-input {
  .el-input__inner {
    padding: 0 8px;
  }
}
::v-deep .column-date-picker {
  width: 180px !important;
  .el-input__inner {
    width: 180px !important;
  }
}
::v-deep .column-textarea {
  .el-textarea__inner {
    height: 156px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
  }
}
::v-deep .pa-select {
  line-height: 32px;
  height: 32px;
}
::v-deep .content-warp {
  .el-form-item {
    margin-bottom: 17px;
  }
}
::v-deep .type-date {
  width: 180px !important;
  .el-form-item__content {
    width: 180px !important;
  }
}
::v-deep .first-column-content {
  padding: 30px 16px;
  .el-form-item {
    height: 32px;
    line-height: 32px;
    margin-bottom: 17px;
    .el-form-item__content {
      height: 32px;
      line-height: 32px;
      .pa-input {
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>