<template>
  <div class="pa-im-box-container" ref="cnt" id="cnt">
    <div id="listBox" class="list-box" v-if="listData.length > 0 && !loading">
      <div class="schedule-titie">
      {{ defaultPatient.name }}日程表
      <i
        class="iconfont icon-xiugaiiconbeifen1 edit-icon icon-item"
        @click="gotoEditSchedule"
      />
      </div>
      <div :id="'item' + index" v-for="(item, index) in listData" :key="index" class="list-item">
        <schedule-item :itemData="item"></schedule-item>
      </div>
    </div>
    <div class="empty-box" v-if="listData.length == 0 && !loading">
      <div>
        <img class="empty-image" src="@/assets/image/no-task.png" />
      </div>
      <div class="tips">暂无产检日程表</div>
      <div class="btn-cnt">
        <el-button icon="el-icon-plus" class="pa-btn" type="primary" @click="gotoAddSchedule"
          >新增产检日程表</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ScheduleItem from "./components/ScheduleItem.vue";
import { getPatientTaskList } from "@/api/patient";
import { Loading } from 'element-ui';

export default {
  name: "ServiceList",
  components: {
    ScheduleItem,
  },
  data() {
    return {
      loadingInstance:{},
      loading: false,
      nextIndex: -1,
      listData: [
        //   {
        //     times: 3,
        //     gestationWeek: 15,
        //     notice:'早孕建册',
        //     date:'2021-09-20',
        //     next:true,
        //     weekday: 0,
        //   },
        //   {
        //     times: 4,
        //     gestationWeek: 16,
        //     notice:'唐氏筛查、NT检查',
        //     date:'2021-09-27',
        //     next:false,
        //     weekday: 2,
        //   },
        //   {
        //     times: 3,
        //     gestationWeek: 15,
        //     notice:'浮肿检查，子痫前症',
        //     date:'2021-09-20',
        //     next:false,
        //     weekday: 0,
        //   },
      ],
    };
  },
  created() {
    
   
    
  },
  mounted() {
    this.$bus.$on('refreshData', this.initData())
    // this.initData()
    this.$nextTick(() => {
      console.log("Loading", document.getElementById("listBox"))
      let options = {
        target:document.getElementById("cnt"),
        lock: true,
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0)'
      }
      this.loadingInstance = Loading.service(options);
    });
    
  },
  computed: {
    ...mapState({
      defaultPatient: (state) => state.defaultPatient.patient, //患者信息
      refresh: (state) => state.patientSchedule.refresh, //患者信息
    }),
  },
  watch: {
    "defaultPatient.id": {
      handler(val) {
        console.log("defaultPatient.id", val);
        //根据id去拿对应的日程表
        let getNextGestationWeek = false;
        
        if (val) {
          this.loading = true;
          getPatientTaskList({
            patientId: val,
            date: this.defaultPatient.expectedDate,
          }).then((res) => {
            this.loading = false;
            this.$nextTick(() => { 
              this.loadingInstance.close();
            });
            console.log("getPatientTaskList", res.data);
            //根据孕周去判断下一次孕检周期，需要先按孕周进行判断
            res.data.sort((a, b) => {
              return (
                a.pregnancyPatient.gestationWeek <
                b.pregnancyPatient.gestationWeek
              );
            });
            console.log("sorted arr1", res.data, this.defaultPatient.gestationInfo);
            this.listData = res.data.map((item, index) => {
              let next = false
              if (!getNextGestationWeek) {
                if (
                  this.defaultPatient.gestationInfo && 
                  (this.defaultPatient.gestationInfo.totalWeeks <
                  item.pregnancyPatient.gestationalWeek)
                ) {
                  this.nextIndex = index
                  next = true  //只有第一次才修改状态
                  getNextGestationWeek = true;
                }
              }
              
              return {
                id:item.pregnancyPatient.id,
                times: item.pregnancyPatient.pregnancyTestName,
                notice: item.pregnancyPatient.concernCore,
                gestationWeek: item.pregnancyPatient.gestationalWeek,
                date: item.pregnancyPatient && item.pregnancyPatient.pregnancyTime,
                next: next,
                weekday: item.dayOfWeek && item.dayOfWeek.week,
              };
              
            });
            this.scrollToPos();
          });
          
        }
      },
      immediate: true,
    },
    "refresh": {
      handler(val) {
        //根据id去拿对应的日程表
        let getNextGestationWeek = false;
        
        if (val) {
          this.loading = true;
          getPatientTaskList({
            patientId: this.defaultPatient.id,
            date: this.defaultPatient.expectedDate,
          }).then((res) => {
            this.loading = false;
            this.$nextTick(() => { 
              this.loadingInstance.close();
            });
            this.$store.commit("updateRefresh", false)
            console.log("getPatientTaskList", res.data);
            //根据孕周去判断下一次孕检周期，需要先按孕周进行判断
            res.data.sort((a, b) => {
              return (
                a.pregnancyPatient.gestationWeek <
                b.pregnancyPatient.gestationWeek
              );
            });
            console.log("sorted arr2", res.data, this.defaultPatient.gestationInfo);
            this.listData = res.data.map((item, index) => {
              console.log("sorted arr", item, index);
              let next = false
              if (!getNextGestationWeek) {
                if (
                  this.defaultPatient.gestationInfo && 
                  (this.defaultPatient.gestationInfo.totalWeeks <
                  item.pregnancyPatient.gestationalWeek)
                ) {
                  this.nextIndex = index
                  next = true  //只有第一次才修改状态
                  getNextGestationWeek = true;
                }
              }
              return {
                id:item.pregnancyPatient.id,
                times: item.pregnancyPatient.pregnancyTestName,
                notice: item.pregnancyPatient.concernCore,
                gestationWeek: item.pregnancyPatient.gestationalWeek,
                date: item.pregnancyPatient && item.pregnancyPatient.pregnancyTime,
                next: next,
                weekday: item.dayOfWeek && item.dayOfWeek.week,
              };
            });
            this.$bus.$emit("updatePatientSchedule", {flag: this.listData && this.listData.length > 0 ? true : false})  //通知message-send-box更新图标状态
            this.scrollToPos();
          });
        }
        
      },
      immediate: true,
    },
  },
  methods: {
    initData(){
       let getNextGestationWeek = false;
        
        if (this.defaultPatient && this.defaultPatient.id) {
          this.loading = true;
          getPatientTaskList({
            patientId: this.defaultPatient.id,
            date: this.defaultPatient.expectedDate,
          }).then((res) => {
            this.loading = false;
            
            console.log("getPatientTaskList", res.data);
            //根据孕周去判断下一次孕检周期，需要先按孕周进行判断
            res.data.sort((a, b) => {
              return (
                a.pregnancyPatient.gestationWeek <
                b.pregnancyPatient.gestationWeek
              );
            });
            console.log("sorted arr", res.data);
            this.listData = res.data.map((item, index) => {
              console.log("sorted arr", item, index);
              let next = false
              if (!getNextGestationWeek) {
                if (
                  this.defaultPatient.gestationInfo && 
                  (this.defaultPatient.gestationInfo.totalWeeks <
                  item.pregnancyPatient.gestationalWeek)
                ) {
                  this.nextIndex = index
                  next = true  //只有第一次才修改状态
                  getNextGestationWeek = true;
                }
              }
              return {
                id:item.pregnancyPatient.id,
                times: item.pregnancyPatient.pregnancyTestName,
                notice: item.pregnancyPatient.concernCore,
                gestationWeek: item.pregnancyPatient.gestationalWeek,
                date: item.pregnancyPatient && item.pregnancyPatient.pregnancyTime,
                next: next,
                weekday: item.dayOfWeek && item.dayOfWeek.week,
              };
            });
          });
        }
    },
    scrollToPos(){
      console.log("scrollToPos", document.body.clientHeight)
      let minHeight = document.body.clientHeight - 64 - 47 - 48 - 15 - 19 - 16 - 35;
      let offset = this.nextIndex * 160;
      console.log("offset", minHeight, this.nextIndex, offset)
      if(minHeight < offset){
        
        
        this.$nextTick(()=>{
          console.log("adjust", this.$refs.cnt, offset - minHeight, this.nextIndex, document.getElementById('item' + this.nextIndex))
            if(document.getElementById('item' + this.nextIndex)){
              document.getElementById('item' + this.nextIndex).scrollIntoView()
              //document.getElementById('itemCnt').scrollTop = offset
            }
            
        })

      }
    },
    gotoAddSchedule() {
      console.log("gotoAddSchedule");
      //如果没有预产期，则不让跳转
      //提示“当前用户没有预产期，无法新增产检日程表”
      if((!this.defaultPatient) || (this.defaultPatient && !this.defaultPatient.expectedDate)){
        this.$message.error("当前用户没有预产期，无法新增产检日程表");
        return;
      }
      // this.$router.push({
      //   path: "/Im/addSchedule",
      //   query:{
      //       id:this.defaultPatient.id,
      //       type:"add"
      //   }
      // });
      this.$bus.$emit('patient_schedule', {
        id:this.defaultPatient.id,
        type:"add"
      })
    },
    gotoEditSchedule() {
      console.log("gotoEditSchedule");
      this.$bus.$emit('patient_schedule', {
          id:this.defaultPatient.id,
          type:"edit"
        })
      // this.$router.push({
      //   path: "/Im/editSchedule",
      //   query:{
      //       id:this.defaultPatient.id,
      //       type:"edit"
      //   }
      // });
    },

    selectedItem(data) {
      this.$emit("sendCustomMessage", data, "4");
    },
  },
};
</script>
<style scoped>
.edit-icon {
  color: #0066cc;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}

.icon-item{
  color: #06f;
  cursor: pointer;
}

.list-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  /* transform: scale(1) */
}
.list-item {
  width: 100%;
  display: flex;
  padding: 16px 0 0px 0px;
}
.img-box {
  width: 78px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
.img-type {
  max-width: 78px;
  max-height: 64px;
}
.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 78px);
  height: 64px;
}
.pa-abs-type {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.schedule-titie{
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  position: relative;
  /* position: fixed; */
}

.btn-cnt >>> .el-button [class*=el-icon-] + span{
  margin-left: 8px;
}

.list-item-cnt{
  overflow: auto;
  height: 100%;
}

>>> .el-loading-spinner .path{
  stroke: #0066cc;
}

>>> .el-loading-spinner .el-loading-text{
  color: #0066cc;
}
</style>
