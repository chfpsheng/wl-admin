<template>
  <div class="blood-sugar-report">
    <div class="header">
      <div class="title">{{title}}</div>
      <div class="btn-group">
        <el-button class="pa-btn go-back" @click="goBackBtn">返回 </el-button>
        <el-button type="primary" class="pa-btn" @click="onSave" :disabled="isSubmit">
          保存
        </el-button>
      </div>
    </div>
    <div class="patient-warp">
      <div class="patient-info">
        <img
          class="patient-avatar"
          :src="patientInfo.headUrl ? patientInfo.headUrl : defaultPatientImg"
          alt="头像"
        />
        <span class="patient-name">{{ patientInfo.name }}</span>
        <span class="sex-age"
          >{{ patientInfo.sex == 1 ? "男" : "女" }} <span style="color:#ebebeb">|</span>
          {{ patientInfo.age }}</span
        >
        <span class="gestation-weeks-title" v-if="patientInfo.gestationInfo"
          >孕周：</span
        >
        <span class="gestation-weeks-date" v-if="patientInfo.gestationInfo">
          {{
            patientInfo.gestationInfo
              ? patientInfo.gestationInfo.totalWeeks +
                "周" +
                (patientInfo.gestationInfo.weekDays > 0
                  ? "+" + patientInfo.gestationInfo.weekDays
                  : "")
              : ""
          }}
        </span>
      </div>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="form-content"
    >
      <el-form-item label="报告名称：">
        <span>血糖管理报告</span>
      </el-form-item>
      <el-form-item label="制定人：">
        <span>{{ report.createName }}</span>
      </el-form-item>
      <el-form-item label="血糖测量时间：" required>
        <el-date-picker
          class="pa-datepicker"
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-value="dateRange"
          :picker-options="pickerOptions"
          :clearable="false"
          @change="onChangeDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="对应孕周：">
        <span v-show="weeks.start">孕{{ weeks.start }}周</span>
        <span v-show="!weeks.start">暂无</span>
        <i> - </i>
        <span v-show="weeks.end">孕{{ weeks.end }}周</span>
        <span v-show="!weeks.end">暂无</span>
      </el-form-item>
    </el-form>
    <!-- 孕期基础数据 -->
    <div class="head-subtitle">孕期基础数据</div>
    <div class="base-data">
      <div class="item">
        <span class="title">孕前体重：</span>
        <span class="value" v-show="patientInfo.weight"
          >{{ patientInfo.weight }} kg</span
        >
      </div>
      <div class="item">
        <span class="title">身高：</span>
        <span class="value" v-show="patientInfo.height"
          >{{ patientInfo.height && patientInfo.height * 100 }} cm</span
        >
      </div>
      <div class="item">
        <span class="title">孕前BMI：</span>
        <span class="value">{{
          calcBMI(patientInfo.height, patientInfo.weight)
        }}</span>
      </div>
      <div class="item">
        <span class="title">糖尿病类型：</span>
        <span class="value">{{ patientInfo.diabetes | diabetes }}</span>
      </div>
    </div>
    <!-- 孕期血糖数据 -->
    <div class="head-subtitle" v-if="result">孕期血糖数据</div>
    <div class="blood-target" v-if="result">
      <el-row :gutter="16">
        <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
          <div class="item">
            <div class="number">
              <span>{{ result.count || 0 }}</span>
              <b class="total">
                <i class="iconfont icon-zongjilucishu"></i>
              </b>
            </div>
            <div class="title">总记录次数（次）</div>
          </div>
        </el-col>
        <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
          <div class="item">
            <div class="number">
              <span>{{ result.midCount || 0 }}</span>
              <b class="reach">
                <i class="iconfont icon-dabiao"></i>
              </b>
            </div>
            <div class="title">达标次数</div>
            <div class="title-sub">
              达标率{{ (result.minRatio * 100).toFixed(0) || 0 }}%
            </div>
          </div>
        </el-col>
        <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
          <div class="item">
            <div class="number">
              <span>{{ result.lowCount || 0 }}</span>
              <b class="low">
                <i class="iconfont icon-piandi"></i>
              </b>
            </div>
            <div class="title">偏低次数</div>
            <div class="title-sub">
              偏低率{{ (result.lowRatio * 100).toFixed(0) || 0 }}%
            </div>
          </div>
        </el-col>
        <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
          <div class="item">
            <div class="number">
              <span>{{ result.highCount || 0 }}</span>
              <b class="high">
                <i class="iconfont icon-piangao"></i>
              </b>
            </div>
            <div class="title">偏高次数</div>
            <div class="title-sub">
              偏高率{{ (result.highRatio * 100).toFixed(0) || 0 }}%
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <BloodSugarTable class="blood-sugar-warp" :tableData="tableData">
      <div class="head-subtitle no-before blood-label-before" slot="label-before">
        血糖表
      </div>
    </BloodSugarTable>
    <pa-pagination
      :current-page="query.pageNo"
      :page-size="query.pageSize"
      :total="query.total"
      @sizeChange="onPagesize"
      @currentChange="onPageCurrent"
    />
    <div class="head-subtitle  no-before">孕期血糖管理建议</div>
    <div class="weight-suggest">
      <el-input
        type="textarea"
        v-model="report.managerSuggestion"
        placeholder="请输入相关建议"
        rows="12"
        maxlength="500"
        show-word-limit
      >
      </el-input>
    </div>
    <div class="import-excel">
      <div class="head-subtitle  no-before">孕期食谱建议</div>
      <el-button class="pa-btn" @click="onImport">
        <i class="iconfont icon-daoru"></i>
        导入
      </el-button>
    </div>
    <!-- 建议食谱 -->
    <div class="recipes-warp">
      <Recipes ref="recipe" :foodData="report.suggestionList" />
    </div>
    <!-- 导入食谱 -->
    <RecipesImport
      :foodData="foodData"
      :importShow="importShow"
      @close="importShow = false"
      @upload="onFile"
    />
    <!-- 导入表单 -->
    <form enctype="multipart/form-data" method="post">
      <input
        ref="upload"
        type="file"
        style="display: none"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple="multiple"
        @change="uploadFile"
      >
    </form>
  </div>
</template>
<script>
// 最近一年
var nowDate = new Date();
var lastYear = nowDate.setTime(nowDate.getTime() - 3600 * 1000 * 24 * 366);
import BloodSugarTable from "./components/blood-sugar-table.vue";
import Recipes from "./components/recipes.vue";
import defaultPatientImg from "@/assets/image/default-patient.png";
import RecipesImport from "./components/recipes-import.vue";
import {
  queryBloodAnalaysis,
  getBloodTable,
  addReport,
  updateReport,
  getReport,
  getDays,
  importCookbook
} from "@/api/patient";
export default {
  name: "BloodSugarReport",
  props: {
    patientId: {
      type: Number | String,
      default: "141"
    }
  },
  components: {
    BloodSugarTable,
    Recipes,
    RecipesImport
  },
  data() {
    return {
      title:'',
      dateRange: "",
      importShow: false,
      isSubmit: false, // 是否提交中
      query: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      report: {
        reportType: 2,
        reportName: "血糖管理报告",
        managerSuggestion: "",
        createName: "",
        suggestionList: []
      }, // 报告详情
      weeks: {
        start: 0,
        end: 0
      },
      result: null, // 孕期血糖数据
      ruleForm: {},
      rules: {},
      foodData: [],
      defaultPatientImg: defaultPatientImg,
      patientInfo: {}, //患者信息
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime() || v.getTime() < lastYear;
        }
      },
      tableData: [] //血糖表数据
    };
  },
  created() {
    const patientId = this.$route?.query?.patientId || this.patientId;
    // id存在表示为编辑
    const id = this.$route.query.id || "";

    if (!id) {
      this.title = "新增血糖报告"
      //新增报告
      const end = new Date();
      const start = new Date();
      // 过去30天
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
      this.dateRange = [start, end];
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      this.report.createName = user.name || "";
    }
    else{
      //编辑报告
      this.title = "编辑血糖报告"
    }
    this.getPatientInfo(patientId, id);
  },
  methods: {
    // 查询患者信息
    async getPatientInfo(patientId, reportId) {
      const baseId = window.btoa(patientId);
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.patientInfo = result.data;
          this.patientInfo.name = decodeURIComponent(
            escape(window.atob(result.data.name))
          );
          // 编辑
          if (reportId) {
            this.getReport(reportId);
          } else {
            // 新增
            this.getGestWeeks(this.patientInfo.expectedDate, 0);
            this.getGestWeeks(this.patientInfo.expectedDate, 1);
            this.getTableList(this.patientInfo.id);
            this.getResult(this.patientInfo.id);
          }
        }
      }
    },

    // 计算BMI
    calcBMI(height, weight) {
      if (height > 0) {
        // BMI= 孕前体重(kg) / 孕前身高²(m²)
        return (weight / (height * height)).toFixed(2);
      } else {
        return "";
      }
    },

    // 选择时间
    onChangeDate() {
      this.query.pageNo = 1
      this.getTableList(this.patientInfo.id);
      this.getResult(this.patientInfo.id);
      this.getGestWeeks(this.patientInfo.expectedDate, 0);
      this.getGestWeeks(this.patientInfo.expectedDate, 1);
    },

    // 获取报告详情
    async getReport(id) {
      await getReport(id).then(res => {
        this.report = res.data || {};
        this.dateRange = [
          this.report.reportStartTime,
          this.report.reportEndTime
        ];
        this.getTableList(this.patientInfo.id);
        this.getResult(this.patientInfo.id);
        this.getGestWeeks(this.patientInfo.expectedDate, 0);
        this.getGestWeeks(this.patientInfo.expectedDate, 1);
      });
    },

    // 获取测量时间对应我孕期
    async getGestWeeks(expectedDate, flag) {
      if (expectedDate) {
        const recordDate = this.$dayjs(this.dateRange[flag]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        await getDays({
          pregnancyDate: expectedDate, // 预产期
          recordDate: recordDate // 测量时间
        }).then(res => {
          if (flag === 1) {
            if (res.data.week > 40 || res.data.week < 0) {
              this.weeks.end = 0;
            } else {
              this.weeks.end = res.data.week;
            }
          } else {
            if (res.data.week > 40 || res.data.week < 0) {
              this.weeks.start = 0;
            } else {
              this.weeks.start = res.data.week;
            }
          }
        });
      }
    },

    // 获取血糖分析结果
    async getResult(patientId) {
      const beginTime = this.$dayjs(this.dateRange[0]).format("YYYY-MM-DD");
      const endTime = this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD");
      await queryBloodAnalaysis({
        patientId: patientId,
        beginTime: beginTime,
        endTime: endTime
      }).then(res => {
        this.result = res.data || null;
      });
    },

    // 获取血糖表数据
    async getTableList(patientId) {
      this.query.beginTime = this.$dayjs(this.dateRange[0]).format(
        "YYYY-MM-DD"
      );
      this.query.endTime = this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD");
      this.query.patientId = patientId;
      await getBloodTable(this.query).then(res => {
        this.tableData = res.data.rows || {};
        this.query.total = res.data.total || 0;
      });
    },

    // 保存
    onSave() {
      // 报告时间
      this.report.reportStartTime = this.$dayjs(this.dateRange[0]).format("YYYY-MM-DD") + ' 00:00:00';
      this.report.reportEndTime = this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD") + ' 23:59:59';
      const patientId = this.$route.query.patientId || this.patientId;
      const id = this.$route.query.id;
      // 建议食谱
      const foodList = this.$refs.recipe.tableData || [];
      foodList.forEach(item => {
        (item.reportId = id),
          (item.patientId = patientId),
          (item.reportType = 2); // 血糖
      });
      this.report.suggestionList = foodList || [];
      this.isSubmit = true
      if (id) {
        // 编辑
        this.updateReport();
      } else {
        // 新增
        this.report.patientId = patientId;
        this.addReport();
      }
    },

    // 新增报告
    async addReport() {
      await addReport(this.report).then(res => {
        this.isSubmit = false
        this.$message.success("保存成功");
        window.history.go(-1);
      }).catch(() => {
        this.isSubmit = false
      });
    },

    // 编辑报告
    async updateReport() {
      await updateReport(this.report).then(res => {
        this.isSubmit = false
        this.$message.success("保存成功");
        window.history.go(-1);
      }).catch(() => {
        this.isSubmit = false
      });
    },

    // 导入
    onImport() {
      this.foodData = this.$refs.recipe.catchFood()
      this.importShow = true;
    },
    onFile () {
      this.$refs.upload.click()
    },
    // 导入
    async uploadFile (e) {
      let file = this.$refs.upload.files[0]
      let formData = new FormData()
      formData.append('file', file)
      await importCookbook(formData).then(res => {
        e.target.value = ''
        let list = res.data || []
        list.forEach(item =>{
          item.freCode = this.setCode(item.frequency)
        })
        this.report.suggestionList = list
        res.msg && this.$message.error(res.msg)
      }).catch(() => {
        e.target.value = ''
      })
    },

    // 编译成code
    setCode (name) {
      let arr = ['早餐', '早点', '午餐', '午点', '晚餐', '晚点']
      let index = arr.indexOf(name)
      return String(index + 1)
    },

    // 返回btn
    goBackBtn() {
      this.$router.push({
        path: "/im/sugarDetail",
        query: {
          id: this.patientInfo.id
        }
      });
    },

    onPagesize(val) {
      this.query.pageSize = val;
      this.getTableList(this.patientInfo.id);
    },

    onPageCurrent(val) {
      this.query.pageNo = val;
      this.getTableList(this.patientInfo.id);
    }
  }
};
</script>
<style lang="scss" scoped>
.form-content,
.head-subtitle,
.recipes-warp,
.blood-target,
.blood-sugar-table {
  padding: 0 24px;
}
.recipes-warp{
  padding-bottom: 24px;
}
.head-subtitle {
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  &::before {
    margin-right: 4px;
    font-family: "iconfont";
    content: "";
    border-left: 2px solid #0066cc;
  }
}
.patient-warp {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
}
.blood-sugar-report {
  background-color: #ffffff;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #ebebeb;
    .title {
      font-size: 16px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
    }
    .btn-group {
      .el-button + .el-button {
        margin-left: 24px;
      }
    }
  }
  .patient-info {
    display: flex;
    align-items: center;
    width: 100%;
    .patient-avatar {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
    .patient-name {
      min-width: 42px;
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin: 0 8px;
    }
    .gestation-weeks-date {
      margin-right: 24px;
    }
    .gestation-weeks-title,
    .gestation-weeks-date {
      height: 17px;
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
    }
    .sex-age {
      font-size: 12px;
      color:#333333
    }
    .pa-patient-tabs--box {
      width: unset;
    }
    .btn-group {
      align-self: flex-end;
    }
  }
  ::v-deep.form-content {
    .el-form-item {
      display: inline-flex;
      margin-right: 40px;
    }
  }
  .import-excel {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0px 24px 8px;
    .head-subtitle {
      padding: 0;
      margin: 0;
    }
  }
  .base-data {
    display: flex;
    padding: 16px 30px 24px;
    *{
      color:#333333;
    }
    .item {
      margin-right: 100px;
      .title {
        color: #333;
      }
      .value {
        font-weight: 400;
      }
    }
  }
  .weight-data {
    ul {
      display: flex;
      padding: 32px 24px;
      li {
        margin-right: 100px;
        div {
          display: flex;
          flex-direction: column;
          span {
            text-align: center;
          }
        }
      }
    }
  }
  .blood-target {
    padding-top: 16px;
    padding-bottom: 24px;
    .item {
      height: 120px;
      background: #ffffff;
      border: 1px solid #ebebeb;
      display: flex;
      flex-direction: column;
      padding: 16px 14px 8px 16px;
      .number {
        height: 58px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        span {
          font-size: 24px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
        }
        b {
          display: inline-block;
          width: 58px;
          height: 58px;
          background: #76b5f7;
          border-radius: 50%;
          text-align: center;
          line-height: 58px;
          font-weight: normal;
          &.total {
            background: #bf8fd2;
          }
          &.reach {
            background: #98ce75;
          }
          &.low {
            background: #f59170;
          }
          &.high {
            background: #f6a6c2;
          }
          i {
            color: #fff;
            display: inline-block;
            font-size: 48px;
            padding-top: 5px;
            padding-left: 13px;
          }
        }
      }
      .title {
        height: 20px;
        font-size: 14px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      .title-sub {
        height: 16px;
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }
    }
  }
  .blood-table-title {
    padding: 16px;
    font-size: 18px;
  }
  .weight-suggest {
    padding: 8px 24px 24px;
  }
}
::v-deep.blood-sugar-warp {
  .label-warp {
    margin-bottom: 8px;
  }
  .blood-label-before {
    margin: 0;
    padding: 0;
  }
}
::v-deep.el-form {
  .el-form-item__label {
    padding: 0;
  }
}
.pa-pagination {
  position: static;
  padding: 0px;
  .pa-pagination-box {
    padding: 0px;
  }
}
.gestation-weeks-title {
  margin-left: 24px;
}
::v-deep .el-table__header, ::v-deep .el-table__body {
  width: 100%!important;
  td{
    height: 48px !important;
  }
}
::v-deep .el-form-item * {
  color: #333;
}

::v-deep .patient-info * {
  color: #333;
}

::v-deep .head-subtitle.no-before::before{
  border-left: 2px solid #fff !important;
}
</style>
