<template>
  <div class="avatar" :class="shape === 'circle' ? 'shape-circle' : ''">
    <img :src="avatarSrc">
  </div>
</template>

<script>
import systemAvatar from '@/assets/image/system.png'
import defaultPatientImg from '@/assets/image/default-patient.png'
export default {
  props: {
    src: String,
    type: {
      type: String,
      default: 'C2C'
    },
    shape: {
      type: String,
      default: 'circle'
    }
  },
  data() {
    return {
      defaultPatientImg:defaultPatientImg,
    }
  },
  computed: {
    avatarSrc: function() {
      const src = this.src
      if (/^(https:|http:|\/\/)/.test(src)) {
        return src
      } else {
        return this.defaultSrc
      }
    },
    defaultSrc: function() {
      switch (this.type) {
        case 'C2C':
          // 个人头像
          return defaultPatientImg
        case 'GROUP':
          // 群默认头像
          return 'https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-3.png'
        case this.TIM.TYPES.CONV_SYSTEM:
          return systemAvatar
        default:
          // 默认头像
          return 'https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-1.png'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar
  background-color $first
  text-align center
  width 100%
  height 100%
  overflow hidden
  img
    width 100%
    height 100%
.shape-circle
  border-radius 50%
</style>
