<!--
 * @Author: ycf
 * @Date: 2021-11-01 14:57:02
 * @LastEditTime: 2021-12-13 10:26:21
 * @LastEditors: Please set LastEditors
 * @Description: 体重管理
 * @FilePath: \management-system\src\views\ImDrawer\components\BloodManage.vue
-->
<template>
  <div class="pa-cnt" id="cnt">
    <div v-if=" patientInfo.weight && !loading">
      <el-button
        icon="el-icon-plus"
        class="pa-btn pa-abs-right"
        type="primary"
        v-if="!menuActiveName"
        @click="addWeight"
        >记体重</el-button
      >
      <div class="list-box with-top" style="padding-right: 16px">
        <div class="left-item content-title title-cnt">
          <div>
            <img class="icon-title" src="@/assets/image/baseinfo@2x.png" /><span
              class="title"
              >基本信息</span
            >
          </div>
          <div>
            <span class="view-detail" @click="gotoDetail">查看详情</span
            ><i class="iconfont icon-s_sw2"></i>
          </div>
          <!-- <el-button
            icon="el-icon-plus"
            class="pa-btn pa-abs-right"
            type="primary"
            @click="gotoDetail"
            >查看详情</el-button
          > -->
        </div>
        <div class="base-content-cnt">
          <div class="section-cnt">
            <div class="content-item">
              <span class="lbl-title">孕周：</span
              ><span class="lbl-content">{{
                patientInfo.gestationInfo
                  ? patientInfo.gestationInfo.totalWeeks +
                    "周" +
                    (patientInfo.gestationInfo.weekDays > 0
                      ? "+" + patientInfo.gestationInfo.weekDays
                      : "")
                  : "暂无"
              }}</span>
              <span class="fetus">{{
                patientInfo.fetus === 1 ? "单胎" : "多胎"
              }}</span>
            </div>
            <div class="content-item">
              <span class="lbl-title">孕前体重：</span
              ><span class="lbl-content">{{ patientInfo.weight }}kg</span>
            </div>
            <div class="content-item">
              <span class="lbl-title">孕前身高：</span
              ><span class="lbl-content">{{ patientInfo.height * 100 }}cm</span>
            </div>
            <div class="content-item">
              <span class="lbl-title">孕前BMI：</span
              ><span class="lbl-content">{{ patientInfo.bmi }}</span>
            </div>
          </div>

          <div class="section-cnt">
            <WeightChart
              class="weight-chart"
              :height="300"
              :minData="chartData.minList"
              :maxData="chartData.maxList"
              :recordData="chartData.patientWeightList"
              :startValue="startValue"
              :endValue="endValue"
              :min="min"
              :max="max"
              v-if="showEchart"
            >
              <div class="title content-title" slot="header-left">
                <img
                  class="icon-title"
                  src="@/assets/image/weightchart@2x.png"
                /><span class="title">体重曲线</span>
              </div>
            </WeightChart>
          </div>

          <div class="left-item content-title" v-if="reportList.length > 0">
            <img
              class="icon-title"
              src="@/assets/image/reportlist@2x.png"
            /><span class="title">分析报告</span>
          </div>
          <div class="report-list">
            <div
              v-for="(item, index) in reportList"
              :key="index"
              class="report-item"
            >
              <div class="status">
                <span class="title"> {{ item.reportName }} </span>
                <div class="icon-container">
                  <div class="icon-container">
                    <i
                      class="iconfont icon-daisuifang"
                      style="color: #0066CC"
                      v-show="item.send"
                      title="已推送"
                    ></i>
                    <i class="iconfont icon-fasong" v-show="!item.send" title="未推送"></i>
                    <i
                      class="iconfont icon-weichakan"
                      style="color: #0066CC"
                      v-show="item.view"
                      title="已查看"
                    ></i>
                    <i class="iconfont icon-yulan" v-show="!item.view" title="未查看"></i>
                  </div>
                </div>
              </div>
              <div class="date">
                <span>{{ getDayRange(item) }}</span>
              </div>
              <div class="btn-group">
                <i class="iconfont icon-fasong" v-if="userData.duty === '4'" @click="sendReport(item)"
                  >推送</i
                >
                <i class="iconfont icon-yulan" @click="previewReport(item)">预览</i>
                <i class="iconfont icon-s_xiugai" @click="editReport(item)"
                  >修改</i
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loading" class="loading" v-loading="loading">
      <span>加载中…</span>
    </div>
    <!--- 无数据 -->
    <div class="empty-box" v-if="!patientInfo.weight && !loading">
      <div>
        <img class="empty-image" src="@/assets/image/no-task.png" />
      </div>
      <div class="tips">暂无数据</div>
      <div class="btn-cnt">
        <el-button
          icon="el-icon-plus"
          class="pa-btn"
          type="primary"
          @click="addWeight"
          >记体重</el-button
        >
      </div>
    </div>
    <!-- <add-blood :dlgVisible="addWeightDlg" @closeDlg="closeDlg"></add-blood> -->
    <add-weight
      v-if="addWeightDlg"
      :firstRecord="firstRecord"
      :dlgVisible="addWeightDlg"
      @closeDlg="closeDlg"
      @submitData="submitData"
    ></add-weight>
    <!-- 体重预览 -->
    <preview-dialog
      :reportId="reportId"
      :patientId="defaultPatient.id"
      :dlgVisible="previewDlg"
      :expectedDate="expectedDate"
      @closeDlg="closePreviewDlg"
      v-if="previewDlg"
    ></preview-dialog>
  </div>
</template>

<script>
import AddWeight from "../components/AddWeight.vue";
import WeightChart from "@/views/health-manage/components/weight-chart.vue";
import PreviewDialog from "@/views/health-manage/components/weight-preview.vue";
import {
  getNewPatientById,
  getReportList,
  patientUpdate,
  weightItemInsert,
  weightQueryLinechart,
  sendHealthReport
} from "@/api/patient";

import { updateWeightInfo } from "@/api/weight";

import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  components: {
    WeightChart,
    AddWeight,
    PreviewDialog
  },
  name: "WeightManage",
  props: {
    menuActiveName: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    }
  },
  data() {
    return {
      startValue:0,
      endValue:0,
      userData:{},
      min: 0, //折线图y坐标的最小最大值
      max: 0,
      expectedDate: "", // 预产期
      showEchart: false,
      src: "",
      reportId: "",
      previewDlg: false,
      loadingInstance: {},
      firstRecord: true,
      addWeightDlg: false,
      reportList: [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }],
      patientInfo: {
        gestationInfo: {
          totalWeeks: 16,
          weekDays: 5
        },
        weight: "",
        height: "",
        bmi: "",
        fetus: 1 //1:单胎    2：多胎
      },
      chartData: {
        maxList: [],
        minList: [],
        patientWeightList: []
      }
    };
  },
  created() {
    let prefixUrl = "https://iservice.paglobalphysicians.com/";
    if (process.env.NODE_ENV === "production") {
      prefixUrl = "https://iservice.paglobalphysicians.com/";
    } else if (process.env.NODE_ENV === "uat") {
      prefixUrl = "https://iuat.paglobalphysicians.com/";
    } else {
      prefixUrl = "https://itest.paglobalphysicians.com/";
    }
    this.src = prefixUrl + "#/weight/report";
  },
  mounted() {
    this.userData = this.$local.get('userData')
  },
  computed: {
    ...mapState({
      defaultPatient: state => state.defaultPatient.patient //患者信息
    }),
  },
  watch: {
    "defaultPatient.id": {
      handler(val) {
        if (val) {
          this.firstRecord = true;
          this.showEchart = false;
          this.getPatientBaseInfo(val);
          this.getPatientReportList(val);
          this.getLinechartData(val);
        }
      },
      immediate: true
    },
    
  },
  methods: {
    getStartValue(){
      //防止患者信息接口还没有取到，从本地缓存取
      const imPatientInfo = JSON.parse(
          localStorage.getItem("im-patient-info")
        );
      console.log("getStartValue", imPatientInfo.gestationInfo)
      if(!imPatientInfo.gestationInfo){
         return 0
      }
      if(typeof imPatientInfo.gestationInfo === 'undefied'){
         return 0
      }
      return imPatientInfo.gestationInfo.totalWeeks - 7 >= 0 ? imPatientInfo.gestationInfo.totalWeeks - 7 : 0
    },
    getEndValue(){
      return this.startValue + 6 > 40 ? 40 : this.startValue + 6;
    },
    editReport(item) {
      //跳转到报告详情页面
      //跳转到报告详情页面
      this.$router.push({
        path: "/im/weightReport",
        query: {
          id: item.id,
          patientId: this.patientInfo.id
        }
      });
    },
    // 预览
    previewReport(item) {
      this.reportId = item.id
      this.expectedDate = this.patientInfo.expectedDate || ''
      this.previewDlg = true;
    },
    // 推送血糖接口
    async sendHealthReport(item) {
      await sendHealthReport({
        patientId: this.defaultPatient.id,
        reportId: item.id,
        status: 1
      }).then(() => {
        // 执行完接口，发送im消息
        this.$emit(
          "sendCustomMessage",
          {
            name: this.defaultPatient.name,
            reportName: item.name || "体重管理报告",
            // weight: this.patientInfo.weight,
            // height: this.patientInfo.height,
            id: item.id || 1
          },
          "14"
        );
      });
    },
    sendReport(item) {
      this.sendHealthReport(item);
      // this.$emit(
      //   "sendCustomMessage",
      //   {
      //     name: this.defaultPatient.name,
      //     reportName: item.name || "体重管理报告",
      //     // weight: this.patientInfo.weight,
      //     // height: this.patientInfo.height,
      //     id: item.id || 1
      //   },
      //   "14"
      // );
    },
    getDayRange(item) {
      return (
        this.$dayjs(item.reportStartTime).format("YYYY-MM-DD") +
        " - " +
        this.$dayjs(item.reportEndTime).format("YYYY-MM-DD")
      );
    },
    isAlready(item) {
      return item === 1 ? "already" : "";
    },
    submitData(weightItem) {
      if (this.firstRecord) {
        //调用两个接口
        updateWeightInfo({
          patientId: this.defaultPatient.id,
          height: weightItem.height / 100,
          weight: weightItem.weightBefore,
          fetus: weightItem.fetus,
          recordDate:
            this.$dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss") ||
            weightItem.recordDate,
          recordType: 2
        }).then(() => {
          weightItemInsert({
            patientId: this.defaultPatient.id,
            weight: weightItem.weight,
            recordDate: weightItem.recordDate,
            recordType: 2
          }).then(() => {
            this.getPatientBaseInfo(this.defaultPatient.id);
            this.getPatientReportList(this.defaultPatient.id);
            this.getLinechartData(this.defaultPatient.id);
          });
        });
      } else {
        weightItemInsert({
          patientId: this.defaultPatient.id,
          weight: weightItem.weight,
          recordDate: weightItem.recordDate,
          recordType: 2
        }).then(() => {
          this.getPatientBaseInfo(this.defaultPatient.id);
          this.getPatientReportList(this.defaultPatient.id);
          this.getLinechartData(this.defaultPatient.id);
        });
      }

      this.addWeightDlg = false;
    },
    closeDlg() {
      this.addWeightDlg = false;
    },
    closePreviewDlg() {
      this.previewDlg = false;
    },
    addWeight() {
      //判断当前患者有没有预产期，没有预产期，则提示
      if (!this.patientInfo.expectedDate) {
        this.$message.error("当前用户没有预产期，无法记体重");
        return;
      }
      this.addWeightDlg = true;
    },
    gotoDetail() {
      this.$router.push({
        path: "/im/weightDetail",
        query: {
          id: this.defaultPatient.id
        }
      });
    },
    getPatientBaseInfo(id) {
      this.loading = true;
      getNewPatientById(id).then(res => {
        this.loading = false;
        // this.$nextTick(() => {
        //   this.loadingInstance.close();
        // });
        this.patientInfo = res.data;
        if (this.patientInfo.weight) {
          this.firstRecord = false;
        }
        if (this.patientInfo.weight && this.patientInfo.height)
          this.patientInfo.bmi = (
            this.patientInfo.weight /
            (this.patientInfo.height * this.patientInfo.height)
          ).toFixed(2);
      });
    },
    getPatientReportList(id) {
      getReportList({
        patientId: id,
        reportType: 1
      }).then(res => {
        this.reportList = res.data;
      });
    },
    getLinechartData(id) {
      weightQueryLinechart({
        patientId: id
      }).then(res => {
        this.chartData = res.data;
        //数据调整成chart需要的数据格式
        this.chartData.minList = this.chartData.minList.map(item => {
          return item.weight;
        });
        this.min = Math.min(...this.chartData.minList);
        this.chartData.maxList = this.chartData.maxList.map(item => {
          return item.weight;
        });
        this.max = Math.max(...this.chartData.maxList);
        this.chartData.patientWeightList = this.chartData.patientWeightList.map(
          item => {
            if (item.weight) {
              //比较更新最大最小值
              if (item.weight < this.min) {
                this.min = item.weight;
              }
              if (item.weight > this.max) {
                this.max = item.weight;
              }
              return [item.week - 3, item.weight];
            } else {
            }
          }
        );
        this.chartData.patientWeightList = this.chartData.patientWeightList.filter(
          item => {
            if (typeof item === "undefined") {
              return false;
            } else {
              return true;
            }
          }
        );
        this.min = parseInt(this.min - 2 > 0 ? this.min - 2 : 0, 10);
        this.max = parseInt(this.max + 2, 10);
        //重新计算开始和结束值
        this.startValue = this.getStartValue()
        this.endValue = this.getEndValue()
        console.log("this.chartData", this.chartData, this.min, this.max, this.startValue, this.endValue);
        this.$nextTick(() => {
          this.showEchart = true;
        });
      });
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep.report-list {
  padding-left: 16px;
  padding-top: 0px;
  margin-bottom: 24px;
  .report-item {
    height: 109px;
    border: 1px solid #ebebeb;
    background-color: #ffffff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    .status {
      display: flex;
      justify-content: space-between;
      padding: 16px 16px 8px 16px;
      .title {
        font-size: 14px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
      }
      .icon-container {
        .iconfont {
          font-size: 12px;
        }
        i {
          margin-left: 16px;
        }
      }
    }
    .date {
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
      padding: 0 16px 16px 16px;
    }
    .btn-group {
      border-top: 1px solid #ebebeb;
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 16px;
      .iconfont {
        cursor: pointer;
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #0066cc;
      }
      .iconfont:not(:last-child) {
        margin-right: 16px;
      }
      .iconfont::before {
        margin-right: 2px;
      }
    }
  }
}

.pa-cnt {
  position: relative;
}

.pa-abs-right {
  position: absolute;
  right: 14px;
  top: -46px;
  z-index: 99999;
}

.empty-box {
  text-align: center;
  padding-top: 100px;
}
.empty-image {
  width: 164px;
  height: 84px;
  opacity: 1;
}
.tips {
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  margin-bottom: 16px;
}

.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.title-cnt {
  justify-content: space-between;
}

.view-detail {
  color: #0066cc;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
}

.icon-s_sw2 {
  font-size: 12px;
  color: #0066cc;
  margin-left: 2px;
}

.icon-title {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

.title {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 20px;
}

.base-content-cnt {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
}

.content-item {
  margin-bottom: 8px;
  padding-left: 18px;
}

.already {
  color: #0066cc;
}

.fetus {
  background: rgba(242, 99, 52, 0.1);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #f26334;
  line-height: 17px;
  display: inline-block;
  width: 54px;
  text-align: center;
  vertical-align: middle;
  padding: 3px 15px;
  margin-left: 16px;
}

::v-deep .loading {
  height: 80px;
  width: 100%;
  color: #06c;
  align-items: end;
  .el-loading-mask {
    background-color: transparent;
  }
}

.lbl-title {
  width: 70px;
  display: inline-block;
}

.section-cnt {
  margin-bottom: 16px;
}
</style>
