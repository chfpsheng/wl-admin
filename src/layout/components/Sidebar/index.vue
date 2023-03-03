<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menuData" :key="route.path" :item="route" :base-path="route.path" :num="num" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem
    // Logo
  },
  data() {
    return {
      num: 0,
      menuData: []
    }
  },
  computed: {
    ...mapState({
      conversationList: state => state.conversation.conversationList,
      currentConversation: state => state.conversation.currentConversation,
      isSDKReady: state => state.userIm.isSDKReady,
    }),
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    conversationList: {
      handler(val) {
       
        if(this.currentConversation.conversationID && this.isSDKReady) {
          this.tim.setMessageRead({conversationID: this.currentConversation.conversationID}).then((imResponse) => {
           
            this.countNum(val)
          }).catch((imError) => {
            this.$message.error(imError)
          })
        } else {
          this.countNum(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initMenuData()
  },
  methods: {
    initMenuData() {
     
      this.menuData = this.$lodash.cloneDeep(this.permission_routes)
    },
    countNum(val) {
      
      let arr = val.filter(item => item.conversationID !== '@TIM#SYSTEM' && item.conversationID !== 'C2Cadministrator')
      this.num = arr.reduce((acc, cur) => {
        return acc + cur.unreadCount
      }, 0)
      this.num = this.num < 100 ? this.num : '99+'
    }
  }
}
</script>
