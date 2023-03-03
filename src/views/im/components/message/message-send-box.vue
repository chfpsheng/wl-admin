<template>
  <div id="message-send-box-wrapper" :style="focus ? {'backgroundColor': 'white'} : {}" @drop="dropHandler">
    <div class="send-header-bar">
      <!-- <el-popover placement="top" width="400" trigger="click">
        <div class="emojis">
          <div v-for="item in emojiName" :key="item" class="emoji" @click="chooseEmoji(item)">
            <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px">
          </div>
        </div>
        <i slot="reference" class="iconfont icon-smile" title="发表情" />
      </el-popover> -->
      <div>
        <i class="icon iconfont icon-a-icon-Sendpictures icon-item" title="发图片" @click="handleSendImageClick" />
      </div>

      <!-- <i class="el-icon-camera" title="发视频" @click="handleSendVideoClick" />
      <i class="iconfont icon-wenjian" title="发文件" @click="handleSendFileClick" /> -->
      <!-- <i class="iconfont icon-zidingyi" title="发自定义消息" @click="sendCustomDialogVisible = true" />
      <i class="iconfont icon-diaocha" title="小调查" @click="surveyDialogVisible = true" />
      <el-dropdown>
        <span class="el-dropdown-link">
          <i v-if="toAccount !== userID" class="el-icon-phone-outline" title="语音通话" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="trtcCalling('video')">视频通话</el-dropdown-item>
          <el-dropdown-item @click.native="trtcCalling('audio')">语音通话</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-if="currentConversationType === TIM.TYPES.CONV_GROUP && groupProfile.type !== 'AVChatRoom'" class="group-live-icon-box" title="群直播" @click="groupLive">
        <i class="group-live-icon" />
        <i class="group-live-icon-hover" />
      </div> -->
      <!-- 根据不同权限控制 -->
      
      
      <div class="right-bar">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i v-if="defaultPatient && defaultPatient.id" class="icon iconfont icon-a-Messagereminder-Icon" title="提醒" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-if="showCalendar" @click.native="notice('9')"><i class="icon iconfont icon-s_riqixuanzheqi" title="产检日程表" />产检日程表</el-dropdown-item>
            <el-dropdown-item  v-if="showCalendar" @click.native="notice('10')"><i class="icon iconfont icon-s_yuyuetixing" title="预约提醒" />预约提醒</el-dropdown-item>
            <el-dropdown-item  v-if="showCalendar" @click.native="notice('7')"><i class="icon iconfont icon-s_jiuzhentixing" title="就诊提醒" />就诊提醒</el-dropdown-item>
            <el-dropdown-item @click.native="notice('11')"><i class="icon iconfont icon-xietang" title="血糖监测" />血糖监测</el-dropdown-item>
            <el-dropdown-item @click.native="notice('12')"><i class="icon iconfont icon-tizhong" title="体重监测" />体重监测</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="icon-item" @click="sendRegisterLink"><i class="icon iconfont icon-a-Informationsupplement-Icon" title="信息补充" /><span class="info"></span></div>
      </div>
    </div>
    <el-dialog title="发自定义消息" :visible.sync="sendCustomDialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="data">
          <el-input v-model="form.data" />
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="extension">
          <el-input v-model="form.extension" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendCustomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCustomMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="对IM Web demo的建议和使用感受" :visible.sync="surveyDialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="评分">
          <div class="block">
            <el-rate v-model="rate" :colors="colors" show-text />
          </div>
        </el-form-item>
        <el-form-item label="建议">
          <el-input
            v-model="suggestion"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="surveyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSurvey">确 定</el-button>
      </span>
    </el-dialog>
    <div class="bottom">
      <!-- <el-input
          v-model="messageContent"
          type="textarea"
          placeholder="输入发送消息"
          maxlength="600"
          resize="false"
          show-word-limit
          class="text-input"
          :autosize="{ minRows: 4, maxRows: 4}"
          @focus.native="focus = true"
          @blur.native="focus = false"
          @input="inputChange"
          @keydown.native.enter.exact.prevent="handleEnter"
          @keyup.native.ctrl.enter.prevent.exact="handleLine"
          @keydown.native.up.stop="handleUp"
          @keydown.native.down.stop="handleDown"
        /> -->
      <textarea
        id="textInput"
        ref="text-input"
        v-model="messageContent"
        rows="4"
        maxlength="600"
        resize="false"
        class="text-input"
        @focus="focus = true"
        @blur="focus = false"
        @input="inputChange"
        @keydown.enter.exact.prevent="handleEnter"
        @keyup.ctrl.enter.prevent.exact="handleLine"
        @keydown.up.stop="handleUp"
        @keydown.down.stop="handleDown"
      />
      <el-tooltip
        class="item"
        effect="dark"
        content="按Enter发送消息，Ctrl+Enter换行"
        placement="left-start"
      >
        <div class="btn-send" @click="sendTextMessage">
          <!-- <div class="tim-icon-send" /> -->
          <el-button :disabled="messageContent.length === 0" class="pa-btn" type="primary">发送</el-button>
        </div>
      </el-tooltip>
    </div>
    <input
      id="imagePicker"
      ref="imagePicker"
      type="file"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      style="display:none"
      @change="sendImage"
    >
    <input id="filePicker" ref="filePicker" type="file" style="display:none" @change="sendFile">
    <input id="videoPicker" ref="videoPicker" type="file" style="display:none" accept=".mp4" @change="sendVideo">
    <!-- <div v-if="currentConversationType === TIM.TYPES.CONV_GROUP && showCallingMember" class="calling-member-list">
      <calling-member-list :type="listTpye" @getList="getList" />
      <div class="calling-list-btn">
        <span class="calling-btn" @click="cancelCalling">取消</span>
        <span class="calling-btn" @click="callingHandler">确定</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import callingMemberList from './trtc-calling/group-member-list'
import {
  Form,
  FormItem,
  Input,
  Dialog,
  // Popover,
  Tooltip,
  Rate
} from 'element-ui'
import { emojiMap, emojiName, emojiUrl } from '@/utils/emojiMap'
import { saveMessage } from '@/utils/index-im'
import { getPatientNextPregnancy,getPatientTaskList } from "@/api/patient";
import { sendGroupMsg } from '@/api/im'
var timer = null
export default {
  name: 'MessageSendBox',
  components: {
    // callingMemberList: callingMemberList,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    // ElPopover: Popover,
    ElTooltip: Tooltip,
    ElRate: Rate
  },
  props: ['scrollMessageListToButtom', 'messageType'],
  data() {
    return {
      showCalendar: true,
      callingList: [],
      groupAtList: [],
      cos: {}, // 腾讯云图片对象存储
      listTpye: '',
      callingType: '',
      groupAt: false,
      showCallingMember: false,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      messageContent: '',
      isSendCustomMessage: false,
      sendCustomDialogVisible: false,
      surveyDialogVisible: false,
      form: {
        data: '',
        description: '',
        extension: ''
      },
      rate: 5, // 评分
      suggestion: '', // 建议
      file: '',
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      showAtGroupMember: false,
      atUserID: '',
      focus: false,
      sendImgNum: 0,
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      duty: (state) => state.user.duty,
      memberList: state => state.group.currentMemberList,
      userID: state => state.userIm.userID,
      currentConversation: state => state.conversation.currentConversation,
      groupProfile: state => state.conversation.currentConversation.groupProfile,
      defaultPatient: (state) => state.defaultPatient.patient, //患者信息
    }),
    // 用户信息是否等级完整
    isRegisterFinished() {
     
      const patient = this.currentConversation.patient
      return (patient.idCard !== '' && patient.mobile !== '' && patient.name !== '')
    }
  },
  watch: {
    'defaultPatient.id': {
      handler(val) {
        console.log("defaultPatient.id", val);
        if(!val){
          return
        }
        //根据id去拿对应的日程表,如果没有,则不显示,修改showCalendar
          getPatientTaskList({
              patientId: val,
              date: this.defaultPatient.expectedDate
          }).then(res=>{
              
              console.log("getPatientTaskList", res.data)
              if(res.data &&  res.data.length > 0){
                this.showCalendar = true
              }else{
                this.showCalendar = false
              }
          })
      },
      immediate: true
    },
    sendImgNum: {
      handler(val) {
        this.$emit('sendImgNumChange', val); // 监听图片上传数
      },
      immediate: true
    }
  },
  mounted() {
    console.log(123123, this.defaultPatient, this.$local.get('userData'))
    this.$refs['text-input'].addEventListener('paste', this.handlePaste)
    this.$bus.$on('updatePatientSchedule', this.updateShowCalendar)
    this.$bus.$on('reEditMessage', this.reEditMessage)
    this.initCOS()
    timer = setInterval(() => {
      this.initCOS()
    }, 1000 * 60 * 29)
  },
  beforeDestroy() {
    this.$refs['text-input'].removeEventListener('paste', this.handlePaste)
    // 清除定时器
    clearInterval(timer)
    timer = null
  },
  methods: {
    updateShowCalendar(flag){
      this.showCalendar = flag
    },
    initCOS() {
      const _this = this // 改下指向，不然下面methods(){}内的cos.xxx找不到
      let config = {}
      const url = process.env.VUE_APP_BASE_API + '/cloud-baseinfo/fileUploadInfo/getTmpCredential'
      _this.$request({
        method: 'post',
        url: url
      }).then(res => {
       
        config = res.data || {}
        this.cosConfig = config
        _this.cos = new COS({
          // 必选参数
          getAuthorization: function(options, callback) {
           
            callback({
              TmpSecretId: config.credentials.tmpSecretId,
              TmpSecretKey: config.credentials.tmpSecretKey,
              SecurityToken: config.credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: config.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: config.expiredTime // 时间戳，单位秒，如：1580000900
            })
          }
        })
       
      })
      
    },
    pushMessageContent(str) {
      this.messageContent += str
      this.$refs['text-input'].focus()
    },
    // pushCustomHtml(data) {
    //   //图片
    //   if(this.messageType === '2') {
    //     return "<img :src="data" />"
    //   }
    // },
    getList(value) {
      this.callingList = value.map((item) => {
        const obj = JSON.parse(item)
        return obj.userID
      })
      this.groupAtList = value.map((item) => {
        const data = JSON.parse(item)
        return data.nick
      })
    },
    cancelCalling() {
      this.showCallingMember = false
    },
    callingHandler() {
      if (this.callingList.length < 1) {
        this.$store.commit('showMessage', {
          type: 'warning',
          message: '请选择成员'
        })
        return
      }
      if (this.listTpye === 'groupAt') {
        this.groupAtList.forEach((item, index) => {
          if (index === 0) {
            this.messageContent += `${item} `
          } else {
            this.messageContent += `@${item} `
          }
        })
        this.showCallingMember = false
        this.$refs['text-input'].focus()
        return
      }
      if (this.listTpye === 'calling') {
        const callingData = {
          memberList: this.callingList,
          type: this.TIM.TYPES.CONV_GROUP
        }
        this.$store.commit('setCallingList', callingData)
        if (this.callingType === 'video') {
          this.$bus.$emit('video-call')
        }
        if (this.callingType === 'audio') {
          this.$bus.$emit('audio-call')
        }
        this.showCallingMember = false
      }
    },
    trtcCalling(type) {
      this.listTpye = 'calling'
      if (type === 'video') {
        this.callingType = 'video'
      }
      if (type === 'audio') {
        this.callingType = 'audio'
      }
      // 呼叫方设置
      if (this.currentConversationType === 'C2C') {
        const member = [this.toAccount]
        const callingData = {
          memberList: member,
          type: 'C2C'
        }
        this.$store.commit('setCallingList', callingData)
        this.$bus.$emit(`${type}-call`)
        return
      }
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP) {
        this.showCallingMember = true
      }
      // this.$store.commit('pushCurrentMessageList', true)
    },
    handleEmojiShow() {
      this.emojiShow = true
      this.bigEmojiShow = false
    },
    handleBigEmojiShow(index) {
      const elm = document.getElementById('bigEmojiBox')
      elm && (elm.scrollTop = 0)
      this.curItemIndex = index
      this.curBigEmojiItemList = this.bigEmojiList[index].list
      this.emojiShow = false
      this.bigEmojiShow = true
    },
    chooseBigEmoji(item) {
      this.popoverVisible = false
      const message = this.tim.createFaceMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          index: this.curItemIndex + 1,
          data: `${item}@2x`
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
    },
    reEditMessage(payload) {
      this.messageContent = payload
      this.$refs['text-input'].focus()
    },
    handleUp() {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index - 1 < 0) {
        return
      }
      this.atUserID = this.memberList[index - 1].userID
    },
    handleDown() {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index + 1 >= this.memberList.length) {
        return
      }
      this.atUserID = this.memberList[index + 1].userID
    },
    handleEnter() {
      this.sendTextMessage()
    },
    inputChange(value) {
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP && value.data === '@') {
        this.groupAt = true
        this.listTpye = 'groupAt'
        this.showCallingMember = true
      }
      if (value.data === ' ' && this.messageContent.indexOf('@ ') !== -1) {
        this.groupAt = false
        this.listTpye = ''
        this.showCallingMember = false
      }
    },
    handleLine(e, a) {
      console.log("handleLine", e, a, document.getElementById("textInput").selectionStart)
      let messageContentArr = this.messageContent.split("");
      console.log("handleLine2", messageContentArr)
      if(messageContentArr && messageContentArr.length > 0 && document.getElementById("textInput").selectionStart && document.getElementById("textInput").selectionStart > 0){
        messageContentArr.splice(document.getElementById("textInput").selectionStart, 0, '\n')
        this.messageContent = messageContentArr.join("")
      }
      // this.messageContent = 
      // this.messageContent = this.messageContent.split("").splice(document.getElementById("textInput").selectionStart, 0, '\n')
      // this.messageContent += '\n'
    },
    handlePaste(e) {
      const clipboardData = e.clipboardData
      let file
      if (
        clipboardData &&
        clipboardData.files &&
        clipboardData.files.length > 0
      ) {
        file = clipboardData.files[0]
      }

      if (typeof file === 'undefined') {
        return
      }
      this.sendImage(e, file)
      // // 1. 创建消息实例，接口返回的实例可以上屏
      // const message = this.tim.createImageMessage({
      //   to: this.toAccount,
      //   conversationType: this.currentConversationType,
      //   payload: {
      //     file: file
      //   },
      //   onProgress: percent => {
      //     this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
      //   }
      // })
      // this.$store.commit('pushCurrentMessageList', message)

      // // 2. 发送消息
      // const promise = this.tim.sendMessage(message)
      // promise.catch(error => {
      //   this.$store.commit('showMessage', {
      //     type: 'error',
      //     message: error.message
      //   })
      // })
    },
    dropHandler(e) {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      let message = {}
      if (file.type === 'video/mp4') {
        message = this.tim.createVideoMessage({
          to: this.toAccount,
          conversationType: this.currentConversationType,
          payload: {
            file: file
          },
          onProgress: percent => {
            this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
          }
        })
      } else {
        message = this.tim.createFileMessage({
          to: this.toAccount,
          conversationType: this.currentConversationType,
          payload: {
            file: file
          },
          onProgress: percent => {
            this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
          }
        })
      }
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.videoPicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendRegisterLink() {
      this.$emit('sendCustomMessage', {}, '6')
    },
    sendTextMessage() {
      const vm = this
      if (
        this.messageContent === '' ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = ''
        // this.$store.commit('showMessage', {
        //   message: '不能发送空消息哦！',
        //   type: 'info'
        // })
        return
      }
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP && this.groupAt) {
        const message = this.tim.createTextAtMessage({
          to: this.toAccount,
          conversationType: this.TIM.TYPES.CONV_GROUP,
          payload: {
            text: this.messageContent,
            atUserList: this.callingList // 'denny' 'lucy' 都是 userID，而非昵称
          }
        })
       
        this.$store.commit('pushCurrentMessageList', message)
        this.$bus.$emit('scroll-bottom')
        const vm = this
        this.tim.sendMessage(message).then(res => {
         
          // 腾讯云发送成功后，再调用自己服务
          const form = Object.assign({}, res.data.message)
          form.payload = JSON.stringify(form.payload)
          form.senderRole = vm.duty
          saveMessage(form, vm)
        }).catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
        this.messageContent = ''
        this.groupAt = false
        return
      }
      const message = this.tim.createTextMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: { text: this.messageContent }
      })
     
      this.$store.commit('pushCurrentMessageList', message)
      this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).then(res => {
       
        // 腾讯云发送成功后，再调用自己服务
        const form = Object.assign({}, res.data.message)
        form.payload = JSON.stringify(form.payload)
        form.senderRole = vm.duty
        saveMessage(form, vm)
      }).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      this.messageContent = ''
    },
    notice(type){
      //
      let data = {}
      console.log("notice", type)
      //   产检日程表
      if(type === '9'){
        data = {
          type: type,
          name: this.defaultPatient.name
        }
        console.log("notice", data, type)
        this.$emit('sendCustomMessage', data, type)
      }
      else if(type === '7' || type === '10'){
        console.log("this.defaultPatient.gestationInfo", this.defaultPatient.gestationInfo)
        if(!this.defaultPatient.gestationInfo){
          this.$message.error('产检已完成，暂无下次产检');
          return;
        }
        getPatientNextPregnancy({
          patientId:this.defaultPatient.id,
          week:this.defaultPatient.gestationInfo && this.defaultPatient.gestationInfo.totalWeeks,
          date:this.defaultPatient.expectedDate.slice(0, 10) ,
        }).then(res=>{
          console.log("getPatientNextPregnancy", res)
          if(!res.data.dayOfWeek && !res.data.pregnancyPatient){
            this.$message.error('产检已完成，暂无下次产检')
            return;
          }
          data = {
            type: type,
            ...res.data
          }
          this.$emit('sendCustomMessage', data, type)
        })
      }else{
        this.$emit('sendCustomMessage', data, type)
      }
      // if(type === '7'){
      //   data = {
      //     type: type,
      //     name: this.defaultPatient.name
      //   }
      //   this.$emit('sendCustomMessage', data, type)
      // }
      
    },
    sendCustomMessage() {
      if (
        this.form.data.length === 0 &&
        this.form.description.length === 0 &&
        this.form.extension.length === 0
      ) {
        this.$store.commit('showMessage', {
          message: '不能发送空消息',
          type: 'info'
        })
        return
      }
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
     
      const vm = this
      this.tim.sendMessage(message).then(result => {
        // 腾讯云发送成功后，再调用自己服务
        const form = Object.assign({}, result.data.message)
        form.payload = JSON.stringify(form.payload)
        form.senderRole = vm.duty
        saveMessage(form, this)
      }).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.sendCustomDialogVisible = false
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    sendSurvey() {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: 'survey',
          description: String(this.rate),
          extension: this.suggestion
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.tim
        .sendMessage(message)
        .then(() => {
          Object.assign(this, {
            rate: 5,
            suggestion: ''
          })
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
      this.surveyDialogVisible = false
    },
    chooseEmoji(item) {
      this.messageContent += item
    },
    handleSendImageClick() {
      this.$refs.imagePicker.click()
    },
    handleSendFileClick() {
      this.$refs.filePicker.click()
    },
    handleSendVideoClick() {
      this.$refs.videoPicker.click()
    },
    groupLive() {
      this.$store.commit('updateGroupLiveInfo', {
        groupID: this.toAccount,
        anchorID: this.userID
      })
      this.$bus.$emit('open-group-live', { channel: 1 })
    },
    // 发送图片
    sendImage(event, fileVal) {
      this.sendImgNum++
      console.log(112111, event, fileVal)
      // console.log(112112, document.getElementById(`imagePicker`), document.getElementById(`imagePicker`).files[0])
      // 图片上传中
      let message = this.tim.createImageMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        senderRole: '', // 为空代表客户端
        payload: {
          file: fileVal ? fileVal : document.getElementById(`imagePicker`) // 或者用event.target
        }
      })
      // console.log('message创建成功', message)
      // this.$store.commit('pushCurrentMessageList', message)  // 假图片
      let _this = this
      // im图片发送成功调用腾讯云对象存储
      let file = fileVal ? fileVal : document.getElementById(`imagePicker`).files[0];
      // 文件上传new
      // 保证参数不会跟着切换用户变化
      // 对象深拷贝
      let base = ''
      if(process.env.VUE_APP_BASE_API.indexOf('http://124.196.4.5:8080') > -1) {
        base = 'dev'
      } else if (process.env.VUE_APP_BASE_API.indexOf('https://uat-api.paglobalphysicians.com') > -1) {
        base = 'uat'
      } else if (process.env.VUE_APP_BASE_API.indexOf('https://test-api.paglobalphysicians.com') > -1) {
        base = 'test'
      }
      const imUserId = `${base}WxUser@${_this.defaultPatient.userId}` || ''  // 患者imUserId
      const userData = _this.$local.get('userData')
      const fromId = userData.imUserId || ''
      let form = {
        imGroupId: imUserId,
        type: 'TIMImageElem',
        from: fromId,
        payload: {
          imageFormat: 1
        },
        senderRole: '4',
        nick: userData.name,
        avatar: userData.url
      }

      this.cos.putObject({
        Bucket: this.cosConfig.bucketName, /* 必须 */
        Region: this.cosConfig.region, /* 存储桶所在地域，必须字段 */
        Key: `chat${new Date().getTime()}.jpg`, /* 必须 */
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: function(percent) {
          if(percent.percent === 1) {
            _this.$set(message, 'progress', percent)
            // _this.$set(message, 'status', 'success') // 手动给message 实例加个响应式属性: progress
          }
        }
      }, function(err, data) {
        console.log('图片上传成功', data, err)
        // 图片上传成功
        // _this.$set(message, 'isLoading', false)
        // _this.$set(message, 'isFinish', true)
        // 腾讯云图片保存成功后，再调用自己服务
        form.payload.imageInfoArray = [
          {
            sizeType: 1,
            type: 0, // 原图
            size: 0,
            width: 0,
            height: 0,
            url: `https://${data.Location}`
          },
          {
            sizeType: 2,
            type: 2, // 小图
            size: 0,
            width: 0,
            height: 0,
            url: `https://${data.Location}?imageMogr2/quality/10`
            // url: `https://${data.Location}?imageMogr2/thumbnail/!30p`
          },
          {
            sizeType: 3,
            type: 1, // 大图
            size: 0,
            width: 0,
            height: 0,
            url: `https://${data.Location}?imageMogr2/quality/70`
            // url: `https://${data.Location}?imageMogr2/thumbnail/!80p`
          }
        ]
        form.payload = JSON.stringify(form.payload)
        sendGroupMsg(form).then((res) => {
          console.log(111222, form)
          _this.sendImgNum > 0 ? _this.sendImgNum-- : _this.sendImgNum = 0
        }) // 发送群消息-成功
      });
      this.$refs.imagePicker.value = null
    },
    sendFile() {
      const message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('filePicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then((res) => {
         
          this.$refs.filePicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendVideo() {
      const message = this.tim.createVideoMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('videoPicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.videoPicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
#message-send-box-wrapper {
  box-sizing: border-box;
  overflow: hidden;
  padding: 3px 16px 16px 16px;
}

.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.emoji {
  height: 40px;
  width: 40px;
  box-sizing: border-box;
}

.send-header-bar {
  box-sizing: border-box;
  padding: 3px 0 0 0;
  display:flex;
  justify-content: space-between;
}

.send-header-bar i {
  cursor: pointer;
  font-size: 14px;
  color: #333;
  margin: 0 16px 0 0;
}

.send-header-bar i.icon-a-Informationsupplement-Icon{
  margin-right:8px;
}

.send-header-bar i:hover {
  color: $black;
}

textarea {
  resize: none;
}

.text-input {
  font-size: 16px;
  width: 100%;
  box-sizing: box-sizing;
  border: none;
  outline: none;
  background-color: transparent;
}

.block {
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.bottom {
  padding-top: 10px;
  position: relative;

  .btn-send {
    cursor: pointer;
    position: absolute;
    color: $primary;
    font-size: 30px;
    right: 0;
    bottom: -5px;
    padding: 6px 6px 4px 4px;
    border-radius: 50%;
  }
}
.group-live-icon-box {
    display inline-block
    position relative
    top 3px
    width 25px
    height 25px
    margin-right 12px
    .group-live-icon {
      display inline-block
      position absolute
      top 0
      left 0
      width 25px
      height 25px
      background url('../../assets/image/live-icon.png') center no-repeat
      background-size cover
      z-index 2
    }
    .group-live-icon-hover {
      display inline-block
      position absolute
      top 0
      left 0
      width 25px
      height 25px
      background url('../../assets/image/live-icon-hover.png') center no-repeat
      background-size cover
      z-index 1
    }
}
.group-live-icon-box:hover {
  .group-live-icon {
    z-index 1
  }
  .group-live-icon-hover{
    z-index 2
  }
}
.calling-member-list {
  position absolute
  top 50px
  background #fff
  margin-right 20px
  .calling-list-btn {
    width 140px
    display flex
    float right
    margin 10px 0
    .calling-btn {
      cursor pointer
      padding 6px 12px
      background #00A4FF
      color #ffffff
      font-size 14px
      border-radius 20px
      margin-left 13px
    }
  }
}
.el-popover {
  padding: 12px 0 0 0 !important;
}

.float-right{
  float: right;
}

.icon-item span{
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 20px;
  vertical-align: middle;
}

.icon-item{
  display: flex;
  align-items: center;
  cursor: pointer;
}

.right-bar{
  display: flex;
  align-items: center;
}

.icon-item span.info{
  position:relative;
  top:-2px;
}

.icon-a-Messagereminder-Icon{
  position: relative;
  top:-1px;
}
</style>
