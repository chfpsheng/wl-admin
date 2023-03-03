<template>
  <div class="list-container pa--list--container" v-if="refresh">
    <div class="header-bar">
      <!-- <button title="刷新列表" @click="handleRefresh">
        <i class="tim-icon-refresh" />
      </button>
      <button title="创建会话" @click="handleAddButtonClick">
        <i class="tim-icon-add" />
      </button> -->
      <el-tabs v-model="activeName" class="pa-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabPaneList"
          :key="index"
          :label="item.label === '当前会话' ? `${item.label}(${currentNum})` : item.label"
          :name="item.value"
          :disabled="tabsDisabled"
        />
      </el-tabs>
    </div>
    <div class="pa----input----box">
      <el-input v-model.trim="patientName" class="pa-input" placeholder="患者姓名" clearable @keydown.enter.native="handleSearch" @clear="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="handleSearch" />
      </el-input>
    </div>
    <div class="scroll-container" style="width: 100%; height: calc(100% - 128px); overflow: auto" v-show="activeName === 'cur'">
      <conversation-item
        v-for="(item, index) in newConversationListCur"
        :key="index"
        :conversation="item"
        :active-name="activeName"
      />
    </div>
    <div class="scroll-container" style="width: 100%; height: calc(100% - 128px); overflow: auto" v-show="activeName !== 'cur'">
      <conversation-item
        v-for="(item, index) in newConversationListHistory"
        :key="index"
        :conversation="item"
        :active-name="activeName"
      />
    </div>
  </div>
</template>

<script>
import ConversationItem from './conversation-item'
import { mapState } from 'vuex'
export default {
  name: 'ConversationList',
  components: { ConversationItem },
  data() {
    return {
      patientName: '',
      activeName: 'cur', // 激活的tab选项
      isHouseKeeper: false, // 是否专属管家
      showDialog: false,
      userID: '',
      isCheckouting: false, // 是否正在切换会话
      tabPaneList: [],
      timeout: null,
      newConversationList: [],
      newConversationListCur: [],
      newConversationListHistory: [],
      currentList: [], // 当前会话列表
      historyList: [], // 历史会话列表
      refresh: true,
      tabsDisabled: false,
      first: true,
      routeConversationID: '',
      iTime: null, // 统计列表条数只统计一秒内最后一次
      currentNum: 0,  // 统计列表条数
    }
  },
  computed: {
    ...mapState({
      imUserId: state => state.user.imUserId,
      duty: state => state.user.duty,
      conversationList: state => state.conversation.conversationList,
      currentConversation: state => state.conversation.currentConversation, // 当前会话
      conversationID: state => state.conversation.currentConversation.conversationID,
      isSDKReady: state => state.userIm.isSDKReady,
      conversationListFlag: state => state.conversation.conversationListFlag,
      selectedConverSationId: state => state.selectedConversation.selectedConversationId,
    }),
    totolUnreadMessages() {
      // 获取所有未读消息数的总和
     
      return this.conversationList.length
      // let sum = 0
      // sum = this.conversationList.reduce((total, currentValue, currentIndex, arr)=>{
      //   return total + currentValue.unreadCount;
      // })
      // return sum;
    }
  },
  watch: {
    activeName: {
      handler(val) {
        this.$store.commit('updateActiveName', val)
      },
      immediate: true
    },
    conversationList: {
      handler(val) {
        console.log(2223331919, val)
        if(this.currentConversation.conversationID && this.duty === '4' && this.isSDKReady) {
          this.tim.setMessageRead({conversationID: this.currentConversation.conversationID}).then((imResponse) => {
           
          }).catch((imError) => {
            this.$message.error(imError)
          })
        }
        if(this.isSDKReady || this.duty !== '4') {
          console.log(2223331111, this.isSDKReady)
          this.initConversationList(val)
        }
      },
      deep: true,
      immediate: true
    },
    newConversationList: {
      handler(val) {
        // console.log(99998, val, this.conversationID)
        if(!this.conversationID) {
          this.initSelected(val)
        }
      },
      deep: true,
      immediate: true
    },
    isSDKReady: {
      handler(val) {
        val ? this.initConversationList(this.conversationList) : ''
      }
    },
    /* conversationListFlag: {
      handler(val) {
       
      },
      immediate: true
    } */
  },
  mounted() {
    // 获取当前用户角色，然后根据角色
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const dutyCode = user && user.duty
    console.log('conversationList', this.conversationList)
    // 如果不是专属管家，则只能看到历史会话
    this.isHouseKeeper = (dutyCode === '4')
    if (this.duty === '4') {
      this.activeName = 'cur'
      this.tabPaneList = [
        {
          label: '当前会话',
          value: 'cur'
        },
        {
          label: '历史会话',
          value: 'history'
        }
      ]
    } else {
      this.activeName = 'history'
      this.tabPaneList = [
        {
          label: '历史会话',
          value: 'history'
        }
      ]
    }
    console.log('mounted', this.tabPaneList)
    // 刷新历史和当前会话-结束/转接
    this.$bus.$on('refreshConversationList', (val) => {
      // this.first = val === 'end' ? true : false
      this.activeName === 'cur' ? this.getConversationList(1) : this.getConversationList(0)
    })
    // 监听是否由历史会话发起会话
    this.$bus.$on('startConversation', (e) => {
      if (e) {
        console.log(99999123123123, e)
        this.activeName = 'cur'
        this.getConversationList(1)
      }
    })
    // 获取当前会话列表
    window.addEventListener('keydown', this.handleKeydown)
    this.activeName === 'cur' ? this.getConversationList(1) : this.getConversationList(0)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown)
    this.$bus.$off('startConversation')
    // 重置当前会话
    this.$store.commit('resetCurrentConversation')
  },
  methods: {
    // 查询会话列表
    async getConversationList(status, name) {
      this.first = true
      const params = {
        name: name || '',
        imUserId: this.duty === '4' ? this.imUserId : null,
        status: status,
        pageNo: 1,
        pageSize: 300
      }
      this.currentList = []
      this.historyList = []
      const result = await this.$requestPost(
        '/cloud-im/conversation/query',
        params
      )
      if (result && result.code === 200) {
        this.currentList = []
        this.historyList = []
        if(status === 1){
          this.currentList = result.data.rows
        } else {
          this.historyList = result.data.rows
        }
        this.first = false
        console.log(9999654321, status, this.historyList, result.data.rows)
        this.initConversationList(this.conversationList)
      }
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    // 初始化会话列表
    initConversationList(val) {
      if(this.first) {
        return
      }
      // console.log(9999123456, this.first, this.historyList)
      if (this.currentList && this.currentList.length > 0) {
        this.currentList = this.currentList.map(item => {
          const ii = val.find(i => i.conversationID === item.imConversationId)
          item = {
            ...item,
            conversationID: item.imConversationId,
            unreadCount: ii ? ii.unreadCount : 0,
            lastMessage: ii ? ii.lastMessage : null,
            groupProfile: ii ? ii.groupProfile : null
          }
          return item
        })
      } else {
        this.currentList = []
      }
      if (this.historyList && this.historyList.length > 0) {
        console.log(9999899911, this.historyList)
        this.historyList = this.historyList.map(item => {
          const ii = val.find(i => i.conversationID === item.imConversationId)
          item = {
            ...item,
            conversationID: item.imConversationId,
            unreadCount: ii ? ii.unreadCount : 0,
            lastMessage: ii ? ii.lastMessage : null,
            groupProfile: ii ? ii.groupProfile : null
          }
          return item
        })
      } else {
        console.log(9999899912, this.historyList)
        this.historyList = []
      }
      console.log(222333213, this.isSDKReady)
      // 只有监听到腾讯的会话列表请求完后执行
      if(this.isSDKReady || this.duty !== '4') {
        let listData = this.activeName === 'cur' ? this.$lodash.cloneDeep(this.currentList) : this.$lodash.cloneDeep(this.historyList)
        this.newConversationList = listData.sort((a, b) => {
          const res1 = a.lastMessage ?  a.lastMessage.lastTime : new Date(a.assignTime).getTime() / 1000
          const res2 = b.lastMessage ? b.lastMessage.lastTime : new Date(b.assignTime).getTime() / 1000
          return res2 - res1
        })
        if(this.activeName === 'cur') {
          this.newConversationListCur = this.newConversationList
          clearTimeout(this.iTime)
          this.iTime = setTimeout(() => {
            this.currentNum = this.newConversationListCur.length
          }, 300)
        } else {
          this.newConversationListHistory = this.newConversationList
        }
        this.$forceUpdate()
        this.$store.commit('updateNewConversationList', this.newConversationList)
      }
    },
    // 初始化选择
    initSelected() {
      this.$nextTick(() => {
        if(this.selectedConverSationId && this.activeName === 'cur') {
          console.log(9999100)
          // 处理患者列表-跳转默认选择
          let index = this.newConversationList.findIndex(item => item.conversationID === this.selectedConverSationId)
          
          // 初始化默认选项
          if(this.newConversationList.length > 0 && this.newConversationList[index].conversationID) {
            this.$store.dispatch('checkoutConversation', this.newConversationList[index].conversationID)
            this.$bus.$emit("handleTime", this.newConversationList[index])
            /* setTimeout(() => {
              this.first = false
              this.$store.state.selectedConversation.selectedConversationId = ''
              // this.routeConversationID = ''
            }, 0) */
            this.newConversationList[index].patient ? this.$store.commit('updateDefaultPatient', this.newConversationList[index].patient) : ''
          }
        } else {
          console.log(9999101)
          // 初始化默认选项
          if(this.newConversationList.length > 0 && this.newConversationList[0].conversationID) {
            console.log(9999102, this.newConversationList[0].conversationID)
            this.$store.dispatch('checkoutConversation', this.newConversationList[0].conversationID)
            this.newConversationList[0].patient ? this.$store.commit('updateDefaultPatient', this.newConversationList[0].patient) : ''
            this.$bus.$emit("handleTime", this.newConversationList[0])
          }
        }
      })
    },   
    handleClick() {
      this.patientName = ''
      // console.log('handleClick', val)
      // 重置当前会话
      this.$store.commit('resetCurrentConversation')
      console.log(9999456789, this.conversationID, this.activeName)
      this.tabsDisabled = true
      let listData = this.activeName === 'cur' ? this.$lodash.cloneDeep(this.currentList) : this.$lodash.cloneDeep(this.historyList)
      this.newConversationList = listData.sort((a, b) => {
        const res1 = a.lastMessage ? new Date(a.lastMessage.lastTime) : new Date(a.assignTime).getTime() / 1000
        const res2 = b.lastMessage ? new Date(b.lastMessage.lastTime) : new Date(b.assignTime).getTime() / 1000
        return res2 - res1
      })
      if(this.activeName === 'cur') {
        this.newConversationListCur = this.newConversationList
        clearTimeout(this.iTime)
        this.iTime = setTimeout(() => {
          this.currentNum = this.newConversationListCur.length
        }, 300)
      } else {
        this.newConversationListHistory = this.newConversationList
      }
      console.log(2223331, this.newConversationList)
      this.$store.commit('updateNewConversationList', this.newConversationList)
      // this.$store.commit('updateActiveName', this.activeName) // 存储当前会话/历史会话
      this.activeName === 'cur' ? this.getConversationList(1) : this.getConversationList(0)
      setTimeout(() => {
        this.tabsDisabled = false
      }, 600)
    },
    handleRefresh() {
      this.refreshConversation()()
    },
    refreshConversation() {
      const that = this
      return function() {
        if (!that.timeout) {
          that.timeout = setTimeout(() => {
            that.timeout = null
            that.tim.getConversationList().then(() => {
              that.$store.commit('showMessage', {
                message: '刷新成功',
                type: 'success'
              })
            })
          }, 1000)
        }
      }
    },
    handleAddButtonClick() {
      this.showDialog = true
    },
    handleSearch() {
      // 根据搜索值查找会话
      console.log('handleSearch', this.patientName)
      if(this.activeName === 'cur') {
        this.getConversationList(1, this.patientName)
      } else {
        this.getConversationList(0, this.patientName)
      }
    },
    handleConfirm() {
      if (this.userID !== '@TIM#SYSTEM') {
        this.$store
          .dispatch('checkoutConversation', `C2C${this.userID}`)
          .then(() => {
            this.showDialog = false
          }).catch(() => {
            this.$store.commit('showMessage', {
              message: '没有找到该用户',
              type: 'warning'
            })
          })
      } else {
        this.$store.commit('showMessage', {
          message: '没有找到该用户',
          type: 'warning'
        })
      }
      this.userID = ''
    },
    handleKeydown(event) {
      if (event.keyCode !== 38 && event.keyCode !== 40 || this.isCheckouting) {
        return
      }
      const currentIndex = this.conversationList.findIndex(
        item => item.conversationID === this.currentConversation.conversationID
      )
      if (event.keyCode === 38 && currentIndex - 1 >= 0) {
        this.checkoutPrev(currentIndex)
      }
      if (
        event.keyCode === 40 &&
        currentIndex + 1 < this.conversationList.length
      ) {
        this.checkoutNext(currentIndex)
      }
    },
    checkoutPrev(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex - 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    },
    checkoutNext(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex + 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    }
  }
}
</script>

<style scoped>
  >>>.el-tabs__item.is-disabled {
    color: #333;
  }
</style>