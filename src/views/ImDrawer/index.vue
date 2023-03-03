<template>
  <div class="app-container">
    <div class="pa-im-box">
      <div class="pa-im-drawer-box">
        <el-tabs v-model="rightActiveName" :class="classFilters(rightActiveName)" @tab-click="handleClick">
          <el-tab-pane label="用户资料" name="one">
            <user-data @showOrderList="showOrderList" />
          </el-tab-pane>
          <el-tab-pane label="跟进日志" name="two">
            <log-follow v-if="rightActiveName === 'two'"></log-follow>
            <!-- <words-box v-if="rightActiveName === 'two'" @sendCustomMessage="sendCustomMessage" /> -->
          </el-tab-pane>
          <el-tab-pane label="随访任务" name="three">
            <!-- <service-list v-if="rightActiveName === 'three'" @sendCustomMessage="sendCustomMessage" /> -->
            <visit-task ref="visitTask" v-if="rightActiveName === 'three'" @addTask="addTask"></visit-task>
          </el-tab-pane>
          <el-tab-pane label="产检日程" name="four">
            <!-- <service-list v-if="rightActiveName === 'four'" @sendCustomMessage="sendCustomMessage" /> -->
            <prenatal-schedule v-if="rightActiveName === 'four'"></prenatal-schedule>
          </el-tab-pane>
          <el-tab-pane label="健康管理" name="five">
            <health-manage :menuActiveName="menuActiveName" @sendCustomMessage="sendCustomMessage"  v-if="rightActiveName === 'five'"> test </health-manage>
          </el-tab-pane>
        </el-tabs>
        <div class="pa-im-content-box" v-if="menuActiveName && activeName === 'cur'">
          <words-box @sendCustomMessage="sendCustomMessage" @closeWords="closeWords" v-if="menuActiveName === 'words'" />
          <service-list @sendCustomMessage="sendCustomMessage" @closeService="closeService" v-if="menuActiveName === 'service'" />
          <coupon-list @sendCustomMessage="sendCustomMessage" @closeCoupon="closeCoupon" v-if="menuActiveName === 'coupon'" />
          <kownledge-list @sendCustomMessage="sendCustomMessage" @closeCoupon="closeKownledge" v-if="menuActiveName === 'kownledge'" />
        </div>
        <div class="pa-im-menu-box" v-if="activeName === 'cur'">
          <div v-if="showMenuShow" class="pa-im-menu-item-cnt">
            <div class="pa-im-menu-item" @click="changeMenuShow('words')"><i class="iconfont icon-iconhuashu1"></i>话术</div>
            <div class="pa-im-menu-item" @click="changeMenuShow('service')"><i class="iconfont icon-a-iconfuwubao1"></i>服务包</div>
            <div class="pa-im-menu-item" @click="changeMenuShow('coupon')"><i class="iconfont icon-a-iconfuwubao1"></i>优惠券</div>
            <div class="pa-im-menu-item" @click="changeMenuShow('kownledge')"><i class="iconfont icon-a-iconfuwubao1"></i>知识库</div>
            <div class="pa-im-menu-item" @click="hideMenuShow()"><i class="iconfont icon-shouqi1"></i>收起</div>
          </div>
          <div v-else class="pa-im-menu-item-collapse-box">
            <div class="pa-im-menu-item-collapse" @click="collapseMenuShow()"><i class="iconfont icon-zhankai1"></i></div>
          </div>
          <!-- <div class="pa-im-menu-item" @click="addPlan">随访计划</div> -->
        </div>
      </div>
    </div>
    <!-- 新增或者编辑随访任务 -->
    <follow-plan :defaultDay="defaultDay" :planId="planId"  ref="followPlan" :title="title" :type="type" :parentVisible.sync="parentVisible" v-if="parentVisible"   @success="refreshTaskList"/>
  </div>
</template>

<script>
import UserData from '@/views/ImDrawer/user-data'
import ServiceList from '@/views/ImDrawer/service-list'
import WordsBox from '@/views/ImDrawer/words-box'
import CouponList from '@/views/ImDrawer/coupon-list'
import KownledgeList from '@/views/ImDrawer/kownledge-list'
import HealthManage from '@/views/ImDrawer/components/HealthManage'
import PrenatalSchedule from '@/views/ImDrawer/prenatal-schedule'
import VisitTask from '@/views/ImDrawer/visit-task'
import FollowPlan from '@/views/workbench/components/FollowPlan' // 新建随访计划
import LogFollow from './log-follow.vue'  // 跟进日志
import { mapState } from 'vuex'
export default {
  name: 'ImDrawer',
  components: {
    UserData,
    ServiceList,
    CouponList,
    PrenatalSchedule,
    VisitTask,
    WordsBox,
    FollowPlan,
    HealthManage,
    KownledgeList,
    LogFollow
  },
  data() {
    return {
      showMenuShow: true,
      rightActiveName: 'one',
      menuActiveName: '',
      parentVisible: false,
      type: '',
      title: '',
      defaultDay:'',
      planId:'',
    }
  },
  computed: {
    ...mapState({
      activeName: (state) => state.tabsName.activeName,
    }),
  },
  created() {
    if(this.$route.query.tab){
      this.rightActiveName = this.$route.query.tab
    }
  },
  mounted() {
  },
  methods: {
    classFilters(val) {
      if(val === 'one') {
        return 'pa-im-tabs pa-im-tabs1'
      } else if(val === 'five') {
        return 'pa-im-tabs pa-im-tabs2'
      } else {
        return 'pa-im-tabs'
      }
    },
    hideMenuShow(){
      this.showMenuShow =  false
    },
    collapseMenuShow(){
      this.showMenuShow =  true
    },
    showOrderList(data) {
      this.$emit('showOrderList', data)
    },
    sendCustomMessage(data, type) {
      this.$emit('sendCustomMessage', data, type)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    changeMenuShow(val) {
      this.menuActiveName = val
    },
    closeWords() {
      this.menuActiveName = ''
    },
    closeService() {
      this.menuActiveName = ''
    },
    closeCoupon() {
      this.menuActiveName = ''
    },
    closeKownledge() {
      this.menuActiveName = ''
    },
    //刷新随访任务的数据
    refreshTaskList(){
      console.log("refreshTaskList")
      this.$refs.visitTask.getListData()
      //同时还需要调用日历的更新数据方法
      this.$refs.visitTask.refreshFollowDatePicker()
    },
    // 新建随访计划
    addPlan() {
      this.parentVisible = true
      // this.$refs.followPlan.openDrawer(true)
    },
    addTask(add, {planId, date}){
      // if(add && !planId){//这里还要区分一下是真的新增还是编辑
      if(add){
        this.type = "add"
        this.title = '新增随访计划'
      }else{
        this.type = "edit"
        this.title = '编辑随访计划'
      }
      this.planId = planId
      this.defaultDay = date
      this.parentVisible = true
    },
    // 新建随访计划

  }
}
</script>
<style  scoped>
.pa-im-tabs >>> .el-tabs__item{
  padding:0 15px;
}

.pa-im-tabs >>> .el-tabs__item.is-top:nth-child(2){
  padding-left:15px;
}

.pa-im-tabs >>> .el-tabs__content{
  padding-left: 16px;
}

.pa-im-tabs >>> .el-tabs__header {
  margin: 0 0 16px;
}
::v-deep .el-tabs__nav-next, ::v-deep .el-tabs__nav-prev {
  line-height: 48px;
  padding: 0 2px;
  color: #06c;
}
::v-deep .el-icon-arrow-left:before, ::v-deep .el-icon-arrow-right:before  {
  font-size: 14px;
}
::v-deep .el-tabs__nav-next {
  box-shadow: 2px 2px 4px 4px rgba(0,0,0,0.10);
}
::v-deep .el-tabs__nav-prev {
  box-shadow: 2px 0px 4px 0px rgba(0,0,0,0.10);
}
.pa-im-tabs1 ::v-deep .el-tabs__nav-prev {
  color: #ebebeb;
}
.pa-im-tabs2 ::v-deep .el-tabs__nav-next {
  color: #ebebeb;
}
</style>
