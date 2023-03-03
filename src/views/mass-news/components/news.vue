<template>
  <div class="app-container">
    <!-- head -->
    <div class="header">
      <div class="header-left">
        <div class="inner">选择收件人</div>
        <div class="triangle" />
      </div>
      <div class="header-right">
        <div class="triangle" />
        <div class="inner">发送内容</div>
        <div class="triangle" />
      </div>
    </div>
    <!-- content -->
    <div class="content-main">
      <div class="choice">
        <div class="head">
          <span>已选择</span>
          <span>{{ dataList.length }}人</span>
          <span @click="deleteAll">清空</span>
        </div>
        <div class="content" :style="styleObject">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="content-item"
          >
            <div>
              <span v-if="item.name.length<10">{{ item.name }}</span>
              <el-tooltip v-else effect="dark" :content="item.name" placement="top">
                <span>{{item.name.substr(0,5)+'...'}}</span>
              </el-tooltip>
              <span>{{ item.age }}岁</span>
              <span>{{ showGestationInfo(item.gestationInfo) }}</span>
              <!-- <span>10周+2</span> -->
            </div>
            <span><i
              class="el-icon-close"
              @click="deleteItem(item.id)"
            /></span>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="double">
          <div>双击选择话术</div>
          <el-button
            class="pa-btn recipient"
            type="primary"
            @click="sendOut"
          >
            发送
          </el-button>
        </div>
        <div class="bottom">
          <WordsBox
            :style="styleObject"
            class="bottom-left"
            @sendCustomMessage="sendCustomMessage"
          />
          <!-- content -->
          <div class="send_content">
            <div class="content">
              <div class="right">
                <div class="out">
                  <div class="title"><span style="color:red;">*</span>发送内容</div>
                  <div class="select">最多可选3张图片,1个链接</div>
                </div>
                <!-- lianjie -->
                <div v-if="links&&links.id" class="links">
                  <!-- box -->
                  <div class="inner">
                    <el-image v-if="links.url" :src="links.url" fit="fit" />
                    <img v-else src="@/assets/image/speechArtLinkDefault.png" alt="">
                    <span>{{ links.tittle }}</span>
                    <i class="el-icon-delete" @click="deleteLinks" />
                  </div>
                  
                </div>
                <!-- image -->
                <div v-if="pothoList && pothoList.length" class="potho">
                  <div class="inner">
                    <div
                      v-for="(item, index) in pothoList"
                      :key="index"
                      class="rel"
                      @mouseleave="mouseleave(index)"
                      @mouseenter="mouseenter(index)"
                    >
                      <el-image :src="item.content" fit="fit" />
                      <div v-if="currentIndex === index" class="mask">
                        <i class="el-icon-delete" @click="deleteImg(item.id)" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text">
                  <el-input
                    v-model="textarea"
                    type="textarea"
                    :rows="2"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入内容"
                  />
                </div>
              </div>
            </div>
            <div class="time">
              <div class="title"><span style="color:red;">*</span>发送时间</div>
              <div class="send-type">
                <div class="left">
                  <div style="margin-top:0px">
                    <el-radio v-model="param.isNow" label="1">立即推送</el-radio>
                  </div>
                  <div class="set-time-push">
                    <el-radio v-model="param.isNow" label="0">定时推送</el-radio>
                    <div v-if="param.isNow === '0'" class="right">
                      <el-date-picker
                        
                        v-model="value1"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        @change="changePicker"
                        class="select-date pa-datepicker"
                        size="small"
                      />

                      <el-time-picker
                        v-model="value2"
                        value-format="HH:mm:ss"
                        type="time"
                        :picker-options="pickerOption"
                        placeholder="任意时间点"
                        class="selecttime pa-datepicker"
                        @focus="focusTime"
                        size="small"
                      />
                      <div class="transmitting" />
                    </div>
                  </div>
                  
                </div>
                
              </div>
            </div>
          </div>
          <!-- time -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WordsBox from './words-box.vue'

import { mapState } from 'vuex'
//import waves from '@/directive/waves' // waves directive
import { addMessage } from '@/api/news'
import moment from "moment";
export default {
  name: 'News',
  components: {
    WordsBox
  },
  directives: {
    //waves
  },
  data() {
    return {
      currentIndex: -1,
      links: {}, // 链接
      pothoList: [], // 图片
      textarea: '', // 内容
      param: {
        sysUserId: '', // 创建人ID
        sysUserName: '', //	创建人名
        sendNum: '', //	发送人数
        contentType: '', // 1 文本 2 图片 3 链接
        isNow: '1', // 0定时 1立刻
        patientIds: '', // 发送人id
        sendTime: '', //
        url: '', // 链接
        pushContent: '', // content
        imContent: '' // im
      },
      logo: './logo.png',
      dataList: [],
      styleObject: {
        height: '200px',
        overflow:'scroll-y'
      },
      value2: '',
      nowTime: [],
      gestationInfoArr: ['', '孕早期', '孕中期', '孕晚期', '产后'],
      dialogFormVisible: false,
      radio: '1',
      value1: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now() // 禁止选择以前的时间
        }
      },
      pickerOption: {
        //selectableRange: this.nowTime
        selectableRange: this.getRangeTime()
        // disabledDate: this.disabledDate
      }
    }
  },
  computed: {
    ...mapState({
      selectList: (state) => state.mass.selectList
    })
  },
  watch: {
    selectList(val) {
      this.dataList = val
    }
  },

  mounted() {
    // 302+
    this.param.sysUserId = this.$local.get('userData').userId
    this.param.sysUserName = this.$local.get('userData').name
    this.$nextTick(() => {
      this.styleObject.height = this.$computeHeight(332) + 'px'
      
    })
  },
  methods: {
    changePicker(){
       this.pickerOption = {
        selectableRange: this.getRangeTime()
      }
      this.value2 = ''
    },
    getRangeTime(){
      let _time = moment().format('HH:mm:ss');
      if(new Date(this.value1)>new Date()){
        _time = "00:00:00"
      }
      return `${_time} - 23:59:59`
    },
    focusTime() {
      const hh =
        new Date().getHours() < 10
          ? '0' + new Date().getHours()
          : new Date().getHours()
      const mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      const ss =
        new Date().getSeconds() < 10
          ? '0' + new Date().getSeconds()
          : new Date().getSeconds()
      // this.nowTime =
      const time = hh + ':' + mf + ':' + ss + ' - 23:59:59'
      
      const arr = []
      arr.push(time)
      this.nowTime = arr
      
    },
    // disabledDate(time) {
    //     return time.getTime() < Date.now() - 8.64e7
    // },
    deleteImg(id) {
      this.currentIndex = -1
      this.pothoList = this.pothoList.filter((item) => item.id !== id)
    },
    mouseenter(index) {
      this.currentIndex = index
      
    },
    mouseleave(index) {
      this.currentIndex = -1
    },
    replace() {
      let content = this.textarea
      content = content.replace(/\[患者姓名\]/g, '[patientName]') // 全局替换
      content = content.replace(/\[孕周\]/g, '[gestation]') // 全局替换
      content = content.replace(/\[预产期\]/g, '[dueDate]') // 全局替换
      return content
    },

    sendOut() {
      this.param.sendNum = this.dataList.length
      if (this.param.sendNum === 0) {
        this.$message({
          type: 'error',
          message: '请先选择患者!'
        })
        return
      }
      if (!this.links.tittle && !this.pothoList.length && !this.textarea) {
        this.$message({
          type: 'error',
          message: '请先选择话术!'
        })
        return
      }
      if(this.param.isNow==='0'){
          if(!this.value1&&!this.value2){
               this.$message({
              type: 'error',
             message: '请先选择日期时间!'
               })
          return
        }
        if(!this.value1&&this.value2){
             this.$message({
              type: 'error',
             message: '请先选择日期!'
         })
          return
        }
         if(this.value1&&!this.value2){
             this.$message({
              type: 'error',
             message: '请先选择时间!'
         })
          return
        }
      }
      if (this.param.isNow === '0') {
        this.param.sendTime = this.value1 + ' ' + this.value2
      } else {
        this.param.sendTime = ''
      }
      this.param.patientIds = this.getPatientIds(this.dataList)
      // dataList
      // 链接
      const params = {
        sysUserId: this.param.sysUserId,
        sysUserName: this.param.sysUserName,
        sendNum: this.param.sendNum,
        isNow: this.param.isNow,
        patientIds: this.param.patientIds,
        sendTime: this.param.sendTime
      }

      if (this.links && this.links.tittle) {
        params.urlTitle = this.links.tittle
        params.imUrlContent = JSON.stringify({
          data: JSON.stringify(this.getImContent(3, this.links))
        })
      }
      // 图片
      if (this.pothoList && this.pothoList.length) {
        params.imPicContentList = this.getImContent(2)
      }
      // 文本
      if (this.textarea) {
        let sendTextarea = this.replace()
        params.pushContent = sendTextarea
        params.imTextContent = JSON.stringify(
          this.getImContent(1, sendTextarea)
        )
      }
      addMessage(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.links = {}
          this.pothoList = []
          this.textarea = ''
          this.param.isNow = '1'
          this.value1 = ''
          this.value2 = ''
        } else {
          this.$message({
            type: 'error',
            message: '发送失败'
          })
        }
      })
    },
    getImContent(type, data) {
      // text
      if (type === 1) {
        return {
          text: data
        }
      }
      if (type === 2) {
        const List = []
        for (const data of this.pothoList) {
          List.push({
            picTitle: data.tittle,
            picContent: JSON.stringify({
              uuid: data.id,
              imageFormat: this.getimgType(data),
              imageInfoArray: [
                {
                  sizeType: 1,
                  type: 0, // 原图
                  size: 0,
                  width: 0,
                  height: 0,
                  url: data.content
                },
                {
                  sizeType: 3,
                  type: 1, // 大图
                  size: 0,
                  width: 0,
                  height: 0,
                  url: data.content + '?imageMogr2/thumbnail/!50'
                },
                {
                  sizeType: 2,
                  type: 2, // 缩量图
                  size: 0,
                  width: 0,
                  height: 0,
                  url: data.content + '?imageMogr2/thumbnail/!80'
                }
              ]
            })
          })
        }
        return List
      }
      // links
      if (type === 3) {
        
        return {
          img: data.url || null,
          link: data.content,
          name: data.tittle,
          type: '3'
        }
      }
    },
    getimgType(data) {
      const imgType = data.content.toUpperCase().split('.') // JPG/JPEG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255
      let imageFormat = 255
      if (
        imgType.length > 1 &&
        (imgType[imgType.length - 1] === 'JPG' ||
          imgType[imgType.length - 1] === 'JPEG')
      ) {
        imageFormat = 1
      } else if (imgType.length > 1 && imgType[imgType.length - 1] === 'GIF') {
        imageFormat = 2
      } else if (imgType.length > 1 && imgType[imgType.length - 1] === 'PNG') {
        imageFormat = 3
      } else if (imgType.length > 1 && imgType[imgType.length - 1] === 'BMP') {
        imageFormat = 4
      }
      return imageFormat
    },
    getPatientIds(arr) {
      const array = []
      for (const item of arr) {
        array.push(item.id)
      }
      return array
    },
    sendCustomMessage(val) {
      
      if (val.classifyType === 1) {
        let _textareaContent = this.textarea + val.content;
        _textareaContent.replace(/\[patientName\]/g, '[患者姓名]')
          .replace(/\[gestation\]/g, '[孕周]')
          .replace(/\[dueDate\]/g, '[预产期]');
        if(_textareaContent.length>200){
          this.$message({
            message: '添加内容总长度不能超过200',
            type: 'warning'
          });
        }else{
          this.textarea = _textareaContent;
        }
      }
      if (val.classifyType === 2) {
        if (this.pothoList.length < 3) {
          this.pothoList.push(val)
        } else {
          // 提示
        }
        // this.pothoList.push(val.)
      }
      if (val.classifyType === 3) {
        if(this.links.id)return
        this.links = val
      }
    },
    deleteLinks() {
      this.links = {}
    },
    deleteItem(payload) {
      this.$store.dispatch('deleteSelect', payload)
    },
    deleteAll() {
      this.$store.commit('deleteAllSelect')
    },
    handleAdd() {
      this.dialogFormVisible = true
    },
    showGestationInfo(gestationInfo) {
      if (!gestationInfo) {
        return '其他'
      } else {
        if (gestationInfo.status === 4) {
          return '其他'
        }

        if (gestationInfo && gestationInfo.weekDays === 0) {
          return (
            this.gestationInfoArr[gestationInfo.status] +
            '(' +
            gestationInfo.totalWeeks +
            '周' +
            ')'
          )
        } else {
          return (
            this.gestationInfoArr[gestationInfo.status] +
            '(' +
            gestationInfo.totalWeeks +
            '周+' +
            gestationInfo.weekDays +
            ')'
          )
        }
      }
    },
  },
  destroyed () {
    this.$store.commit('addSelectList', [])
  }
}
</script>
<style scoped lang="scss">
.header {
  display: flex;
}
.header-left .inner {
  width: 276px;
  height: 48px;
  background-color: #0066cc;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.header-left {
  display: flex;
}
.header-left .triangle {
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-left: 24px solid #0066cc;
  border-bottom: 24px solid transparent;
}
.header-right {
  flex: 1;
  height: 48px;
}
.app-container {
  padding-right: 24px;
}
.header-right {
  display: flex;
  position: relative;
}
.header-right .inner {
  background-color: #f4f4f4;
  flex: 1;
  padding-left: 24px;
  text-align: center;
  line-height: 48px;
  font-size: 16px;
  color: #333;
}
.header-right div:nth-child(1) {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-left: 24px solid #fff;
  border-bottom: 24px solid transparent;
}
.header-right div:nth-child(3) {
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-left: 24px solid #f4f4f4;
  border-bottom: 24px solid transparent;
}
.choice {
  margin-top: 17px;
  background-color: #fff;
  width: 300px;
  border: 1px solid #ebebeb;
  border-bottom: none;
  border-radius: 3px;
  min-width: 300px !important;
}
.choice .head {
  height: 48px;
  border-bottom: 1px solid #ebebeb;
  line-height: 48px;
  padding: 0 24px;
  display: flex;
  span {
    color: #333333;
  }
  span:nth-child(2) {
    margin-left: 16px;
    flex: 1;
  }
  span:nth-child(3) {
    color: #0066cc;
    cursor: pointer;
  }
}
.content-item {
  display: flex;
  height: 48px;
  border-bottom: 1px solid #ebebeb;
  line-height: 48px;
  padding: 0 14px 0 24px;
  
  div {
    flex: 1;
    span:nth-child(2n) {
      margin: 0 16px;
    }
  }
}
.content {
  overflow: scroll;
  .right div:nth-child(1) .select {
    font-size: 12px;
    color: #999;
  }
  .out {
    display: flex;
    align-items: center;
  }
}

.content-main {
  display: flex;
}
.content-right {
  flex: 1;
  margin-left: 20px;
}
.el-button {
  background-color: #0066cc;
}
.double {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.double div:nth-child(1) {
  color: #333;
  font-size: 14px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  color: #333333;
  display: flex;
  align-items: center;
}
.double {
  height: 48px;
  border: 1px solid #ebebeb;
  padding: 0 16px 0 12px;
  border-radius: 3px;
}
.content-right {
  margin-top: 17px;
}
.double div:nth-child(1)::before {
  content: "";
  display: block;
  width: 2px;
  height: 14px;
  background-color: #0066cc;
  margin-right: 8px;
}
.bottom-left {
  width: 233px;
  border: 1px solid #ebebeb;
  border-top: none;
  overflow-y: scroll;
  border-bottom: none;
  padding: 16px 0;
}
.bottom {
  display: flex;
}
.send_content {
  flex: 1;
  border-right: 1px solid #ebebeb;
  padding: 16px;
  .content {
    display: flex;
    align-items: center;
    width: 100%;
    .right{
      width: 100%;
    }
    .title {
      padding-right: 8px;
      box-sizing: border-box;
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
    }
  }
  .time{
    .title{
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
    }
  }
  .links .inner {
    width: 100%;
    height: 90px;
    box-sizing: border-box;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    padding: 23px 16px 19px 24px;
    display: flex;
    align-items: center;
    .el-image {
      width: 48px;
      height: 48px;
    }
    span {
      margin-left: 24px;
    }
  }
  .links {
    display: flex;
    align-items: center;
    margin-top: 24px;
    position: relative;
    i {
      font-size: 14px;
      color: #ebebeb;
      position: absolute;
      right: 24px;
    }
    &:hover{
      cursor: pointer;
      i{
        color: #0066cc;
      }
    }
  }
  .potho {
    margin-top: 24px;
    .rel {
      margin-right: 16px;
      width: 90px;
      height: 90px;
    }
    .rel .el-image {
      width: 100%;
      height: 100%;
    }
  }
}
.text ::v-deep .el-textarea__inner {
  width: 100%;
  height: 160px;
  margin-top: 24px;
}
.mask {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 118px;
  height: 118px;
  left: 0;
  top: 0;
  z-index: 11;
  padding: 10px;
  transition: opacity 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask .iconfont {
  display: inline-block;
  font-size: 16px;
  color: #fff;
  margin-right: 10px;
  font-weight: 700;
}
.mask .iconfont:hover {
  opacity: 1;
}
.time div:nth-child(1) {
  margin-top: 16px;
}
.select-date {
  margin-right: 24px;
}
.potho .inner {
  display: flex;
}
.send-type {
  .left{
    margin-top: 8px !important;
  }
  .right {
    display: flex;
    align-items: center;
    .select-date {
      margin-right: 20px;
    }
  }
}
.potho .inner .rel {
  position: relative;
}
.potho .inner .mask {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  .el-icon-delete {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
}
.selecttime {
  margin-top: 20px;
}
.set-time-push{
  display: flex;
  align-items: center;
  height: 40px;
  margin-top: 8px;
  .right{
    .el-date-editor {
      margin-top: 0px;
    }
  }
}
</style>
