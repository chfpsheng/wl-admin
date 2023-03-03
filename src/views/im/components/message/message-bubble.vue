<template>
  <div class="chat-bubble" @mousedown.stop @contextmenu.prevent>
    <el-dropdown v-if="!message.isRevoked" ref="dropdown" trigger="" placement="bottom-start" @command="handleCommand">
      <div style="display: flex">
        <div v-if="isMine && messageReadByPeer" class="message-status">
          <span>{{ messageReadByPeer }}</span>
        </div>
        <div class="message-content" :class="bubbleStyle">
          <slot />
        </div>
      </div>
      <el-dropdown-menu v-if="isMine&&!isTimeout" slot="dropdown">
        <el-dropdown-item v-if="isMine&&!isTimeout" command="revoke">撤回</el-dropdown-item>
        <!-- <el-dropdown-item v-show="message.status !=='fail'" command="relay">转发</el-dropdown-item>
        <el-dropdown-item v-show="message.status !=='fail'" command="merger">多选</el-dropdown-item> -->
      </el-dropdown-menu>
      
      <el-dropdown-menu v-else class="no-content" slot="dropdown"></el-dropdown-menu> 
        
    </el-dropdown>
    <div v-if="message.isRevoked" class="group-tip-element-wrapper">
      {{ text }}
      <el-button v-show="isEdit" type="text" size="mini" class="edit-button" @click="reEdit">&nbsp;重新编辑</el-button>
    </div>
  </div>
</template>

<script>
import { revokeMsg } from '@/api/im'
import {
  sendHealthReport
} from "@/api/patient";
export default {
  name: 'MessageBubble',
  components: {
  },
  props: {
    isMine: {
      type: Boolean
    },
    isNew: {
      type: Boolean
    },
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isTimeout: false,
      showConversationList: false,
      relayMessage: {},
      selectedConversation: [],
      testMergerMessage: {}
    }
  },
  computed: {
    bubbleStyle() {
      let classString = ''
      if (this.isMine) {
        classString += 'message-send'
        if (this.message.from === 'administrator') {
          classString += ' administrator'
        }
      } else {
        classString += 'message-received'
      }
      if (this.isNew) {
        classString += 'new'
      }

      return classString
    },
    text() {
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && !this.isMine) {
        return '对方撤回了一条消息'
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_GROUP && !this.isMine) {
        return `${this.message.from}撤回了一条消息`
      }
      return '你撤回了一条消息'
    },
    messageReadByPeer() {
      if (this.message.status !== 'success') {
        return false
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && this.message.isPeerRead) {
        return '已读'
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && !this.message.isPeerRead) {
        return '未读'
      }
      return ''
    },
    isEdit() {
      if (!this.isMine) {
        return false
      }
      if (this.message.type !== this.TIM.TYPES.MSG_TEXT) {
        return false
      }
      if (this.isTimeout) {
        return false
      }
      return true
    }
  },
  created() {
    this.isTimeoutHandler()
  },
  mounted() {
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.addEventListener('mousedown', this.handleDropDownMousedown)
    }
  },
  beforeDestroy() {
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.removeEventListener('mousedown', this.handleDropDownMousedown)
    }
  },
  updated() {
  },
  methods: {
    handleDropDownMousedown(e) {
      if (e.buttons === 2) {
        if (this.$refs.dropdown.visible) {
          this.$refs.dropdown.hide()
        } else {
          this.$refs.dropdown.show()
        }
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'revoke':
          // console.log("revokeMessage", this.message)
          // let mes = JSON.parse(window.localStorage.getItem('lastMessage'))
          // mes.payload = JSON.parse(mes.payload)
          // this.tim.revokeMessage(Object.assign(this.message, JSON.parse(window.localStorage.getItem('lastMessage')))).then((data) => {
          this.tim.revokeMessage(this.message).then((data) => {
            revokeMsg({
              conversationId: this.message.conversationID,
              msgSeq:this.message.sequence
            }).then(res=>{
              if(!this.message.ID){
                this.$store.dispatch('checkoutConversation', this.message.conversationID)
              }
              
              
              console.log("revokeMessage this.message", this.message)
              //如果是撤回体重和血糖报告，还需要去修改报告的状态
              let payload = JSON.parse(this.message.payload.data)
              if(payload.type === '13' || payload.type === '14'){
                
                sendHealthReport({
                  patientId: this.$store.state.defaultPatient.patient.id,
                  reportId: payload.id,
                  status: 0
                }).then(()=>{

                })    
              }
              // this.$store.dispatch('checkoutConversation', this.message.conversationID)
            })
            this.isTimeoutHandler()
          }).catch((err) => {
            // this.$store.commit('showMessage', {
            //   message: err,
            //   type: 'warning'
            // })
            this.$message({
              message: '不是你发的消息无法撤回',
              type: 'error'
            })
          })
          break
        case 'relay':
          this.showConversationList = true
          this.$store.commit('setRelayType', 1)
          this.$store.commit('showConversationList', true)
          this.$store.commit('setRelayMessage', this.message)
          break
        case 'merger':
          this.$bus.$emit('mergerSelected', true)
          break
        default:
          break
      }
    },
    isTimeoutHandler() { // 从发送消息时间开始算起，两分钟内可以编辑
      const now = new Date()
      if (parseInt(now.getTime() / 1000) - this.message.time > 2 * 60) {
        this.isTimeout = true
        return
      }
      setTimeout(this.isTimeoutHandler, 1000)
    },
    reEdit() {
      this.$bus.$emit('reEditMessage', this.message.payload.text)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .conversation-container {
    position absolute
    top 0
    left 0px
    width 100%
    background-color #fff
    z-index 999
  }
  .conversation-list-btn {
    width 140px
    display flex
    float right
    margin 10px 0
    .conversation-btn {
      cursor pointer
      padding 6px 12px
      background #00A4FF
      color #ffffff
      font-size 14px
      border-radius 20px
      margin-left 13px
    }
  }
.chat-bubble
  /*position relative*/
  .message-status
    display: flex;
    min-width: 25px;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #6e7981;
  .message-content
    outline: none
    font-size 14px
    position relative
    max-width 340px
    word-wrap break-word
    word-break break-all
    padding 10px
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
    /*overflow hidden*/
    span
      white-space break-spaces
      margin 0
      text-shadow $regular 0 0 0.05em
    img
      vertical-align bottom
  .message-received
    background-color $white
    margin-left 15px
    border-radius 0 4px 4px 4px
    &::before
      left -10px
      transform scaleX(-1)
      color $white
    &.new
      transform: scale(0);
      transform-origin: top left;
      animation: bounce 500ms linear both;
  .message-send
    background-color $light-primary
    margin-right 15px
    padding:16px
    border-radius 4px 0 4px 4px
    color $white
    &::before
      right: -10px
      color $light-primary
    &.new
      transform: scale(0);
      transform-origin: top right;
      animation: bounce 500ms linear both;
  .el-dropdown {
    vertical-align: top;
    display flex
    outline none
    border none
    /deep/ .focusing {
      outline none
      border none
    }
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  /deep/ .el-dropdown .el-dropdown-selfdefine:focus:active, .el-dropdown .el-dropdown-selfdefine:focus:not(.focusing) {
    outline-width: 0;
  }
.group-tip-element-wrapper
  background $white
  padding 4px 15px
  border-radius 3px
  color $secondary
  font-size 12px
  // text-shadow $secondary 0 0 0.05em
.edit-button
  padding-top 4px
  height 20px
  font-size 10px
@keyframes bounce {
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}

.chat-bubble .message-send.administrator .text-box{
  color:#0066cc !important;
}

.no-content{
  display none
}
</style>
