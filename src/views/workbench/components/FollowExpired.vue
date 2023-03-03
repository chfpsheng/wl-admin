<template>
  <div class="workbench-box">
    <div class="filter-container filter-box">
      <div class="filter-wrapper">
        <filter-select :value.sync="filter.followUpUser" :options="followUpUserOptions" title="随访人" />
        <el-button type="primary" class="pa-btn" @click="searchData">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="content-box">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="(item, index) in listData" :key="index" :name="item.followUpUser">
          <template slot="title">
            <div class="el-collapse-title-box">
              <i class="iconfont icon-s_guanjia el-collapse-title-icon" />
              <span>{{item.followUpUserName}}</span>
              <span class="el-collapse-title-num el-collapse-title-num2">{{item.list.length}}</span>
            </div>
          </template>
          <div class="follow-box">
            <follow-item
              v-for="(item2, index2) in item.list"
              :key="index2"
              :baseData="item2"
              type="expired"
              activeName="timeout"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="listData.length === 0" class="pa-null-data">
        <img src="@/assets/image/null-data.png" style="width: 210px" />
        <div class="null-data-text">暂无过期随访</div>
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
  name: 'FollowExpired',
  mixins: [baseDataMixin],
  components: {
    FollowItem
  },
  data() {
    return {
      filter: {
        followUpUser: '',
      },
      followUpUserOptions: [],
      activeNames: [],
      listData: [],
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
      this.getkeeperData()
      this.searchData()
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
    // 查询数据
    searchData() {
      const params = {
        ...this.filter
      }
      getFollowLists(params).then((res) => {
        const timeOutPlanList = res.data.timeOutPlanList // 过期数据
        if(timeOutPlanList && timeOutPlanList.length > 0) {
          let followUpUserArr = timeOutPlanList.map(item => {
            item = {
              followUpUser: item.followUpUser,
              followUpUserName: item.followUpUserName
            }
            return item
          })
          let obj = {}
          followUpUserArr = followUpUserArr.reduce((cur,next) => {
            if(!obj[next.followUpUser]) {
              obj[next.followUpUser] = true
              cur.push(next)
            }
            return cur;
          }, [])
          console.log('查询数据followUpUserArr', followUpUserArr)
          this.listData = followUpUserArr.map(item => {
            item = {
              ...item,
              list: timeOutPlanList.filter(ii => ii.followUpUser === item.followUpUser)
            }
            return item
          })
          this.activeNames = []
          this.activeNames.push(this.listData[0].followUpUser)
        } else {
          this.listData = []
        }
        console.log('查询数据', this.listData)
      })
    },
    handleChange(val) {
      console.log(val);
    },
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
</style>
