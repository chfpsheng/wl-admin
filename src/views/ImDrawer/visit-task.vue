<template>
  <div class="pa-im-box-container">
    <div class="followup-cnt">
      <div class="pa-item list-box fix-line">
        <div class="left-item flex-box">
          <div class="title-cnt">
              <span class="title">当日任务</span>
          </div>
          <div class="follow-date-picker-cnt">
            <follow-date-picker
                ref="followDatePicker"
                :value.sync="date"
                :limitDay = "false"
                @change="dateChange"
                :patientId="defaultPatient.id"
                class="pa-form-select"
            />
            <div class="today" v-if="isToday">
              今
            </div>
          </div>
          <div class="op-bar">
            <i
                class="icon iconfont icon-item icon-s_tianjia"
                @click="addTask"
                title="新增"
            />
            <i
                class="icon iconfont icon-item  icon-s_genjinrenwu"
                v-if="listData && listData.followUpPlanTaskList && listData.followUpPlanTaskList.length > 0"
                @click="followUpTask"
                title="随访跟进"
            />
            <i
                class="iconfont  icon-item  icon-xiugaiiconbeifen1 edit-icon"
                v-if="listData && !listData.isHasExpireded && !listData.isHasFinished"
                @click="editTask"
                title="编辑"
            />
          </div>
        </div>
      </div>

      <div class="scroll-cnt">
        <div class="list-item">
          <visit-task-list v-if="listData && listData.followUpPlanTaskList && listData.followUpPlanTaskList.length > 0" :itemData="listData.followUpPlanTaskList"></visit-task-list>
        </div>
      
      <div class="pa-item list-box with-top" v-if="listData && listData.followUpContent">
        <div class="left-item content-title">
          <span class="title">随访结果</span>
        </div>
        <div class="content switch-line">{{listData.followUpContent}}</div>
      </div>

      <div class="pa-item list-box with-top" v-if="listData && listData.url  && listData.url.length > 0">
       
        <div class="left-item content-title">
          <span class="title">附件图片</span>
        </div>
        <upload-imgs class="img-list" :limit="3" :img-list="listData.url" :disabled="true"  />
        <!-- <div v-for="(img,index) in listData.url" :key="index">
            <img class="img-item" :src="img" />
        </div> -->
      </div>
      </div>
    </div>

    <div class="empty-box" v-if="!listData || (listData && listData.followUpPlanTaskList && listData.followUpPlanTaskList.length === 0)">
      <div>
        <img class="empty-image" src="@/assets/image/no-task.png" />
      </div>
      <div class="tips">暂无随访任务</div>
    </div>

    <visit-follow-up v-if="detailVisible" @closeDlg="closeDlg" ref="visitFollowUpDrawer" :listData="listData" :detailVisible="detailVisible"></visit-follow-up>
    <!-- 随访跟进 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import ScheduleItem from "./components/ScheduleItem.vue";
import VisitTaskList from "./components/VisitTaskList.vue";
import VisitFollowUp from "./components/visitFollowUp.vue";
import FollowDatePicker from '../workbench/components/FollowDatePicker'
import { getFollowUpPlan } from "@/api/patient";
export default {
  name: "ServiceList",
  components: {
    FollowDatePicker,
    ScheduleItem,
    VisitTaskList,
    VisitFollowUp,
  },
  data() {
    return {
        detailVisible: false,
        date:this.$dayjs(new Date()).format('YYYY-MM-DD'),
        listData:{},
    };
  },
  created() {
    console.log("this.$route.query.followUpTime")
    if(this.$route.query.followUpTime){
        this.date = this.$route.query.followUpTime
    }
    
  },
  mounted() {
    this.getListData()
  },

  computed: {
    ...mapState({
      defaultPatient: (state) => state.defaultPatient.patient, //患者信息
    }),
    dateProps() {
      //如果日期小于今天,则将今天的值传递过去
      let isAfter = this.$dayjs(this.date).isAfter(this.$dayjs(), 'day')
      if(!isAfter){
        return this.$dayjs().format('YYYY-MM-DD') 
      }else{
        return  this.date
      }
    },
    isToday: function() {
      let isSame = this.$dayjs().isSame(this.date, 'day')
      console.log("isSame", isSame)
      return isSame
    },
  },
  watch: {
    "defaultPatient.id": {
      handler(val) {
        console.log("defaultPatient.id", val, this.date);
        const user = JSON.parse(localStorage.getItem('userData') || '{}')
        if (val) {
          this.loading = true;
          getFollowUpPlan({
            patientId: val + "",
            followUpTime:this.date,
            followUpUser:user.userId,
          }).then((res) => {
            this.loading = false;
            console.log("getFollowUpPlan", res.data);
            this.listData = res.data
            if(!this.listData){
                return;
            }
            if(!this.listData.url){
                this.listData.url =  []
            }else{
                this.listData.url =  this.listData.url.split(",").map(item => {
                    return {
                        url: item
                    }
                })
            }
            this.listData.isHasFinished = false
            this.listData.isHasExpireded = false
            this.listData.followUpPlanTaskList.forEach(item => {
              if(item.taskStatus === 1){  //已完成
                this.listData.isHasFinished =  true
              }
              if(item.taskStatus === -1){  //过期
                this.listData.isHasExpireded =  true
              }
            });
            console.log("getFollowUpPlan", this.listData);
          });
        }
      },
      immediate: false,
    },
    // date: {
    //   handler(val) {
    //     console.log("defaultPatient.id", val);
    //     const user = JSON.parse(localStorage.getItem('userData') || '{}')
    //     if (val) {
    //       this.loading = true;
    //       getFollowUpPlan({
    //         patientId: this.defaultPatient.id,
    //         followUpTime:val,
    //         followUpUser:user.userId,
    //       }).then((res) => {
    //         this.loading = false;
    //         console.log("getFollowUpPlan", res.data);
    //         this.listData = res.data
    //       });
    //     }
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    refreshFollowDatePicker(){
      this.$refs.followDatePicker.initData()
      this.$refs.followDatePicker.getPatientFollowPlanData()
    },
    isAfterToday() {
      let isAfter = this.$dayjs(this.date).isAfter(this.$dayjs(), 'day')
      console.log("isAfter", isAfter)
      return isAfter
    },
    dateChange(val){
        console.log("dateChange", val)
        this.getListData()
    },
    getListData(){
        const user = JSON.parse(localStorage.getItem('userData') || '{}')
        if (this.defaultPatient.id) {
          this.loading = true;
          getFollowUpPlan({
            patientId: this.defaultPatient.id,
            followUpTime:this.date,
            followUpUser:user.userId,
          }).then((res) => {
            this.loading = false;
            console.log("getFollowUpPlan", res.data);
            this.listData = res.data
            if(!this.listData){
                return;
            }
            if(!this.listData.url){
                this.listData.url =  []
            }else{
                this.listData.url =  this.listData.url.split(",").map(item => {
                    return {
                        url: item
                    }
                })
            }
            this.listData.isHasFinished = false
            this.listData.isHasExpireded = false
            this.listData.followUpPlanTaskList.forEach(item => {
              if(item.taskStatus === 1){  //已完成
                this.listData.isHasFinished =  true
              }
              if(item.taskStatus === -1){  //过期
                this.listData.isHasExpireded =  true
              }
            });
            console.log("getFollowUpPlan", this.listData);
          });
        }
    },
    closeDlg(refresh){
        console.log("closeDlg")
        this.detailVisible = false;
        if(refresh){
            this.getListData()
        }
    },
    followUpTask() {
      this.detailVisible = true;
    //   this.$refs["visitFollowUpDrawer"].showDrawer()
      console.log("followUpTask");
    },
    addTask() {
      console.log("addTask", this.listData);
      this.$emit("addTask", true, {date:this.dateProps}) 
    },
    editTask() {
      console.log("editTask");
      this.$emit("addTask", false, {date:this.date, planId: this.listData.id})
    },
  },
};
</script>
<style scoped>
.pa-item{
  display: block;
}
.pa-im-box-container{
    padding-right: 0px;
}
.pa-im-box-container .list-box .list-item:not(:last-child) {
  margin-bottom: 1px solid #ebebeb;
  
}


/* .list-box  .list-item{
  display: block;
} */
.detail-container .detail-sub-title {
  padding-left: 8px;
  margin-bottom: 16px !important;
  position: relative;
}
.detail-container .detail-sub-title:before {
  display: block;
  content: " ";
  height: 14px;
  width: 2px;
  background-color: #0066cc;
  position: absolute;
  left: 0px;
  top: 3px;
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

.img-item{
    width:48px;
    height:48px;
    margin-right: 8px;
}

.flex-box{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
            
.pa-form-select{
    width:auto !important;
    width:140px !important;
}

.pa-form-select{
    width:auto !important;
    width:120px !important;
}


.follow-date-picker-cnt >>> .el-input--prefix .el-input__inner{
  padding-right: 0px !important;
}

.pa-im-tabs >>> .el-tabs__content{
    padding-right: 16px;
}

/* .pa-item .left-item.flex-box::before{
    top:8px;
} */

.left-item{
    margin-bottom: 16px;
}

.pa-im-box-container .pa-item .left-item::before{
  top: 10px;
}

.edit-icon{
  color: #06c;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}

.today{
  position: relative;
  top:-30px;
  right:-100px;
  background-color: #F26334;
  width: 16px;
  height: 16px;
  border-radius: 7px;
  font-size: 9px;
  color: #fff;
  text-align: center;
}

.follow-date-picker-cnt{
  display: flex;
}

.op-bar{
  flex-grow: 1;
  text-align: right;
}

.title-cnt{
  margin-right:16px;
}

.content{
  word-break: break-all;
}

 .img-list >>> .el-upload.el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
.img-list >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 80px !important;
    height: 80px !important;
    margin: 0 8px 0 0;
    display: inline-block;
  }

.op-bar .icon-item:not(:last-child){
  margin-left:8px;
  margin-right:8px;
  color: #06f;
  cursor: pointer;
}

.op-bar .icon-item:last-child{
  margin-left:8px;
  color: #06f;
  cursor: pointer;
}

.pa-im-box-container .pa-item .left-item.content-title::before{
  top:3px;
}

.with-top{
  border-top: 1px solid #ebebeb;
  padding-top: 16px;
  padding-bottom: 16px;
}

.followup-cnt{
  height: 100%;
  overflow: hidden;
}
.scroll-cnt{
  padding-bottom: 32px;
  height: 100%;
  overflow: auto;
  padding-right: 16px;
}

.pa-im-box-container{
  overflow: hidden;
}

.switch-line{
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-line;
}

.fix-line{
  padding-right: 16px;
}
</style>
