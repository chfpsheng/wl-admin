<template>
  <div class="workbench-box">
    <div class="filter-container filter-box">
      <div class="filter-wrapper">
        <filter-date-picker :value.sync="filter.followUpTime" title="随访日期" :clearable="false" :editable="false" />
        <filter-select :value.sync="filter.followUpUser" :options="followUpUserOptions" title="随访人" placeholder="请选择随访人" @change="testChange" />
        <el-button type="primary" class="pa-btn" @click="searchData">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="wran-box" v-if="timeOutPlanNum > 0">
        <i class="iconfont icon-s_jinggao icon" />
        <div class="status">已过期</div>
        <span class="status des">您有{{timeOutPlanNum}}个随访计划已过期，请及时处理已过期的随访计划。</span>
        <el-button type="text" class="pa-btn el-button--primary-text" @click="handleFollow">去处理</el-button>
      </div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="first" v-if="listData.unDoPlanList && listData.unDoPlanList.length > 0">
          <template slot="title">
            <div class="el-collapse-title-box">
              <i class="iconfont icon-shijianicon el-collapse-title-icon" />
              <span>待随访</span>
              <span class="el-collapse-title-num">{{this.listData.unDoPlanList.length}}</span>
            </div>
          </template>
          <div class="follow-box">
            <follow-item
              v-for="(item, index) in listData.unDoPlanList"
              :key="index"
              :baseData="item"
              type="follow"
              @success="success"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item name="first" v-if="listData.timeOutPlanList && listData.timeOutPlanList.length > 0">
          <template slot="title">
            <div class="el-collapse-title-box">
              <i class="iconfont icon-s_guanjia el-collapse-title-icon" />
              <span>已过期</span>
              <span class="el-collapse-title-num el-collapse-title-num2">{{this.listData.timeOutPlanList.length}}</span>
            </div>
          </template>
          <div class="follow-box">
            <follow-item
              v-for="(item, index) in listData.timeOutPlanList"
              :key="index"
              :baseData="item"
              type="expired"
              @success="success"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item name="second" v-if="listData.completePlanList && listData.completePlanList.length > 0">
          <template slot="title">
            <div class="el-collapse-title-box">
              <i class="iconfont icon-s_Completed el-collapse-title-icon" />
              <span>已完成</span>
              <span class="el-collapse-title-num el-collapse-title-num3">{{this.listData.completePlanList.length}}</span>
            </div>
          </template>
          <div class="follow-box">
            <follow-item
              v-for="(item, index) in listData.completePlanList"
              :key="index"
              :baseData="item"
              type="completed"
              @success="success"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="nullData" class="pa-null-data">
        <img src="@/assets/image/null-data.png" style="width: 210px" />
        <div class="null-data-text">暂无随访任务</div>
      </div>
    </div>
  </div>
</template>
<script>
import FollowItem from './FollowItem' // 今日随访
import baseDataMixin from '@/mixins/baseData'
import { queryAssigner } from '@/api/patient'
import { getFollowLists } from '@/api/workbench'
export default {
  name: 'FollowToday',
  mixins: [baseDataMixin],
  components: {
    FollowItem, // 一行随访信息
  },
  data() {
    return {
      parentVisible: false,
      filter: {
        followUpTime: '',
        followUpUser: ''
      },
      activeNames: ['first'],
      followUpUserOptions: [], // 随访人
      listData: {
        unDoPlanList: [], // 待办
        completePlanList: [], // 已完成
        timeOutPlanList: [] // 已过期
      },
      timeOutPlanNum: 0,
      nullData: false,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const userData = this.$local.get('userData')
      if(userData.duty === '4') {
        this.filter.followUpUser = parseInt(userData.userId)
      }
      const today = this.$dayjs().format('YYYY-MM-DD')
      this.filter.followUpTime = today
      this.getkeeperData()
      this.searchData()
      this.getUserTimeOutPlanList()
    },
    // 随访人
    async getkeeperData() {
      let dutyOptions = await this.dicDataMixins('duty') // 岗位
      let code = ''
      // 查找随访人的id，再去根据id获取
      dutyOptions.forEach(item => {
        code = item.label === '线上专属管家' ? item.value : ''
      })
      const params = {
        duty: code,
        pageNo: 1,
        pageSize: 1000
      }
      queryAssigner(params).then((res) => {
        this.followUpUserOptions = (res.data.rows || []).map(item => {
          item = {
            label: item.displayName,
            value: item.id
          }
          return item
        })
        console.log('随访人', this.followUpUserOptions)
      })
    },
    handleChange(val) {
      console.log(val);
    },
    handleFollow() {
      this.$emit('activeNameChange', 'third');
    },
    // 单独调接口-登录人已过期随访计划
    getUserTimeOutPlanList() {
      const userData = this.$local.get('userData')
      const params = {
        followUpUser: userData.userId
      }
      getFollowLists(params).then((res) => {
        this.timeOutPlanNum = res.data.timeOutPlanList ? res.data.timeOutPlanList.length : 0
      })
    },
    testChange(val) {
      console.log(val)
    },
    // 查询数据
    searchData() {
      const params = {
        ...this.filter
      }
      getFollowLists(params).then((res) => {
        this.listData = {...res.data}
        console.log('查询数据', this.listData)
        if(!this.listData.unDoPlanList && !this.listData.timeOutPlanList && !this.listData.completePlanList) {
          this.nullData = true
        } else {
          this.nullData = false
          if(this.listData.unDoPlanList.length === 0 && this.listData.timeOutPlanList.length === 0 && this.listData.completePlanList.length > 0) {
            this.activeNames = ['second']
          } else {
            this.activeNames = ['first']
          }
        }
        this.$emit('getData', this.listData);
      })
    },
    // 编辑随访计划成功
    success() {
      this.searchData()
    }
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
</style>
