<!--
 * @Author: ycf
 * @Date: 2021-11-01 14:57:02
 * @LastEditTime: 2021-12-13 09:57:37
 * @LastEditors: Please set LastEditors
 * @Description: 血糖管理
 * @FilePath: \management-system\src\views\ImDrawer\components\BloodManage.vue
-->
<template>
  <div class="pa-cnt">
    <div v-show="loading" class="loading" v-loading="loading">
        <span>加载中…</span>
    </div>
    <div v-if="!firstRecord && !loading">
      <el-button
        icon="el-icon-plus"
        class="pa-btn pa-abs-right"
        type="primary"
        v-if="!menuActiveName"
        @click="addWeight"
        >记血糖</el-button
      >
      <div class="list-box with-top">
        <div class="left-item content-title  title-cnt">
          <div>
            <img class="icon-title" src="@/assets/image/baseinfo@2x.png" /><span
              class="title"
              >基本信息</span
            >
          </div>
          <div>
            <span class="view-detail" @click="gotoDetail"
              >查看详情<i
                class="iconfont icon-s_sw2"
              ></i
            ></span>
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
              <span class="lbl-title" style="color: #666">孕周：</span
              ><span class="lbl-content" style="color: #666">{{
                patientInfo.gestationInfo
                  ? patientInfo.gestationInfo.totalWeeks +
                    "周" +
                    (patientInfo.gestationInfo.weekDays > 0
                      ? "+" + patientInfo.gestationInfo.weekDays
                      : "")
                  : "暂无"
              }}</span>
              <span v-if="patientInfo.diabetes && patientInfo.diabetes != 0" class="fetus">{{patientInfo.diabetes === 1 ? '糖尿病合并妊娠' : '妊娠期糖尿病'}}</span>
            </div>
          </div>
          
          <div class="section-cnt">
            <BloodSugarTable :tableData="tableData" class="blood-sugar-warp">
              <div class="head-subtitle blood-label-before" slot="label-before">
                <img
              class="icon-title"
              src="@/assets/image/xuetang@2x.png"
            />血糖监测表
              </div>
            </BloodSugarTable>
          </div>

          <div class="left-item content-title"  v-if="reportList.length > 0">
            <img class="icon-title" src="@/assets/image/reportlist@2x.png" /><span
              class="title"
              >分析报告</span
            >
          </div>
          <div class="report-list">
            <div
              v-for="(item, index) in reportList"
              :key="index"
              class="report-item"
            >
              <div class="status">
                <span class="title"> {{ item.reportName }}  </span>
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
              <div class="date">
                <span>{{getDayRange(item)}}</span>
              </div>
              <div class="btn-group">
                <i class="iconfont icon-fasong" v-if="userData.duty === '4'" @click="sendReport(item)">推送</i>
                <i class="iconfont icon-yulan"   @click="previewReport(item)">预览</i>
                <i class="iconfont icon-s_xiugai" @click="editReport(item)">修改</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--- 无数据 -->
    <div class="empty-box"  v-if="firstRecord && !loading">
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
          >记血糖</el-button
        >
      </div>
    </div>

    <!-- <add-blood :dlgVisible="addWeightDlg" @closeDlg="closeDlg"></add-blood> -->
    <add-blood v-if="addWeightDlg" :dlgVisible="addWeightDlg"  @closeDlg="closeDlg" @submitData="submitData"></add-blood>
    <!-- <preview-dialog src="http://192.168.223.58:8080/#/weight/report" :dlgVisible="previewDlg" @closeDlg="closePreviewDlg"></preview-dialog> -->
    <preview-dialog
      :reportId="reportId"
      :patientId="defaultPatient.id"
      :dlgVisible="previewDlg"
      @closeDlg="closePreviewDlg"
      v-if="previewDlg"
    >
    </preview-dialog>
    
  </div>
</template>

<script>
import BloodSugarTable from "@/views/health-manage/components/blood-sugar-table.vue";
import PreviewDialog from "@/views/health-manage/components/blood-sugar-preview.vue";
import {
  getNewPatientById, getReportList, patientUpdate,
  bloodItemInsert, getBloodTable, getSugarList, sendHealthReport
} from "@/api/patient";

import { mapState } from "vuex";
import AddBlood from './AddBlood.vue';
import treeVue from '@/components/Tree/src/tree.vue';
export default {
  components: {
    BloodSugarTable,
    PreviewDialog,
    AddBlood
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
      userData:{},
      src:"",
      reportId: "",
      firstRecord: true, 
      loading:false,
      addWeightDlg:false,
      previewDlg:false,
      reportList: [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }],
      patientInfo: {
        gestationInfo: {
          totalWeeks: 16,
          weekDays: 5
        },
        weight: "",
        height: "",
        bmi: '',
        fetus: 1 //1:单胎    2：多胎
      },
      tableData: [], // 血糖表数据
      chartData:{
        maxList:[],
        minList:[],
        patientWeightList:[]
      }
    };
  },
  created() {
    let prefixUrl = "https://iservice.paglobalphysicians.com/"
    if (process.env.NODE_ENV === 'production') {
      prefixUrl = "https://iservice.paglobalphysicians.com/"
    }else if(process.env.NODE_ENV === 'uat') {
      prefixUrl = "https://iuat.paglobalphysicians.com/"
    }else{
      prefixUrl = "https://itest.paglobalphysicians.com/"
    }
    this.src = prefixUrl + "#/weight/report"
  },
  mounted() {
    this.userData = this.$local.get('userData')
  },

  computed: {
    ...mapState({
      defaultPatient: state => state.defaultPatient.patient //患者信息
    })
  },
  watch: {
    "defaultPatient.id": {
      handler(val) {
        if (val) {
          this.initRequest(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    editReport(item){
      //跳转到报告详情页面
      this.$router.push({
        path: '/im/sugarReport',
        query: {
          id: item.id,
          patientId: this.defaultPatient.id
        }
      })
    },
    previewReport(item){
      this.reportId = item.id
      this.previewDlg = true
    },
    sendReport(item){
      this.sendHealthReport(item)
      console.log("sendCustomMessage")
    },

    // 推送血糖接口
    async sendHealthReport (item) {
      console.log(item)
      await sendHealthReport({
        patientId: this.defaultPatient.id,
        reportId: item.id,
        status: 1
      }).then(() => {
        // 执行完接口，发送im消息
        this.$emit("sendCustomMessage", {
          name:this.defaultPatient.name,
          reportName:item.name || "血糖管理报告",
          // weight: this.patientInfo.weight,
          // height: this.patientInfo.height,
          id: item.id || 1,
        }, "13");
      })
    },

    initRequest(val){
      this.getSugarListInfo({
            patientId:val
          })
      this.getPatientBaseInfo(val);
      this.getPatientReportList(val);
      this.getBloodTableData(val);
    },
    getDayRange(item) {
      return this.$dayjs(item.reportStartTime).format('YYYY-MM-DD') + " - " +  this.$dayjs(item.reportEndTime).format('YYYY-MM-DD')
    },
    isAlready(item) {
      return item === 1 ? 'already' : '';
    },
    submitData({recordTime, sugarType, sugarValue}){
      console.log("bloodItemInsert")
      bloodItemInsert({
        patientId: this.defaultPatient.id,
        recordTime:recordTime,
        sugarType:sugarType,
        sugarValue:sugarValue,
      }).then(()=>{
        this.initRequest(this.defaultPatient.id)
      })

      this.addWeightDlg = false
    },
    closeDlg(){
      this.addWeightDlg = false
    },
    closePreviewDlg(){
      this.previewDlg = false
    },
    addWeight() {
      console.log("addWeight")
      this.addWeightDlg = true
    },
    gotoDetail(){
      this.$router.push({
        path:"/im/sugarDetail",
        query:{
          id:this.defaultPatient.id,
        }
      })
    },
    getSugarListInfo({patientId}){
      getSugarList({
        patientId:patientId,
        pageNo:1,
        pageSize:300,
      }).then(res => {
        if(res.data.length > 0){
          this.firstRecord = false
          
        }
        this.loading = false
      });
    },
    getPatientBaseInfo(id) {
      this.loading = true
      getNewPatientById(id).then(res => {
        this.patientInfo = res.data;
      });
    },
    getPatientReportList(id) {
      getReportList({
        patientId: id,
        reportType: 2
      }).then(res => {
        this.reportList = res.data;
      });
    },
    //获取血糖的表格数据，
    getBloodTableData(id) {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      const beginTime = this.$dayjs(start).format('YYYY-MM-DD')
      getBloodTable({
        pageNo: 1,
        pageSize: 7,
        patientId: id,
        beginTime: beginTime,
        endTime: this.$dayjs(new Date()).format('YYYY-MM-DD'), //
      }).then(res => {
        this.tableData = res.data.rows || []
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
  width: 294px;
  // border-bottom: 1px solid #ebebeb;
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
  padding-right: 16px!important;
}

.pa-abs-right {
  position: absolute;
  right: 16px;
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
  color: #333;
}

.content-item {
  margin-bottom: 8px;
  padding-left: 18px;
}

.already{
  color:#0066cc
}

.fetus{
  background: rgba(242,99,52,0.10);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #f26334;
  line-height: 17px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  padding: 3px 15px;
  margin-left: 16px;
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


.view-detail{
  color:#0066cc;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
}

.icon-s_sw2{
  font-size: 12px;
  margin-left: 2px;
}
::v-deep.blood-sugar-warp .el-table__header, .el-table__body, .el-table__footer{
  table-layout: auto !important;
}

::v-deep.blood-sugar-warp table{
  width:294px !important;
}

::v-deep.blood-sugar-warp .el-table__body col{
  width:29px !important;
}
::v-deep.blood-sugar-warp .el-table__body-wrapper col:nth-child(1) {
  width:38px !important;
}
::v-deep.blood-sugar-warp .el-table__body-wrapper col:nth-child(2) {
  width:37.8px !important;
}
::v-deep.blood-sugar-warp .el-table__body-wrapper col:nth-child(9) {
  width:38px !important;
}

::v-deep.blood-sugar-warp .el-table .cell{
  word-break:keep-all;
  white-space: nowrap;
  padding: 0;
  font-weight: normal;
  font-size: 12px;
}

::v-deep.blood-sugar-warp .pa-table.el-table th, .pa-table.el-table td{
  height: 28px;
}

::v-deep.blood-sugar-warp  .pa-table.el-table td.el-table__cell > .cell{
  padding-left: 0px
}

.title-cnt {
  justify-content: space-between;
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

.section-cnt {
  margin-bottom: 16px;
}
::v-deep .chat-wrapper .el-tabs__item::before {
  width: 1px!important;
}
::v-deep .el-tabs__item {
  color: #333;
}
::v-deep .el-table thead.is-group th {
  background: #F7F9FC;
}
</style>