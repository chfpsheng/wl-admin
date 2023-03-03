<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="el-tabs">
      <el-tab-pane v-if="this.$store.state.user.duty==4" label="群发消息" name="news">
          <news v-show="activeName==='news'"></news>
          <span class="recipient" :class="{'exceed':disabled}"   @click="handleAdd">添加</span>
          <!-- <i  class="el-icon-circle-plus-outline "></i> -->
      </el-tab-pane>
      <el-tab-pane label="发送记录" name="record">
          <record v-if="activeName==='record'"></record>
      </el-tab-pane>
      
    </el-tabs>
     
    <patient @determine="determine" @dialogForm="dialogForm" :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible"></patient>
  </div>
</template>
<script>
import patient from './components/patient.vue'
import news from './components/news.vue'
import record from './components/record.vue'
 // import waves from '@/directive/waves' // waves directive
import { mapState } from "vuex";
const limitNum = 1000 // 限制好友添加个数1000
export default {
  name: 'mass-record',
  components: {
    news,
    record,
    patient
  },
   directives: {
     // waves
  },
  data() {
    return {
      activeName: 'news',
      dialogFormVisible:false,
    }
  },
   computed: {
    ...mapState({
      selectList: state => state.mass.selectList
    }),
    disabled(){
      // return true;
      return this.selectList.length >= limitNum ? true :false
    }
  },
  mounted(){
    this.$store.state.user.duty==4?(this.activeName = "news"):(this.activeName = "record")
  },
  methods:{
    handleAdd(){
          if(!this.disabled){
            this.dialogFormVisible = true;
          }
    },
    dialogForm(val){
        this.dialogFormVisible = val;
    },
    determine(val){
    }
  }
}

</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  border-bottom: 1px solid #ebebeb;
}
  .app-container {
    background-color: #fff;
    position: relative;
  }
  .recipient{
    position: absolute;
    display: inline-block;
    top: 80px;
    left: 198px;
    display: inline-block;
    width: 50px;
     cursor:pointer;
     color:#0066cc;
  }
  .exceed{
    color: #999;
  }
  .el-tabs {
    padding-left: 24px;
  }

  .el-tabs ::v-deep .el-tabs__item {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
  }
    .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px !important;
    background-color: #dfe4ed;
    z-index: 1;
}
    .el-tabs ::v-deep .el-tabs__nav-wrap::after {
    height: 0px !important;
}
.app-container{
  position: relative;
}
.app-main{
    // /* height: calc(100% - 56px); */
    height:auto !important;
    width: 100%;
    position: relative;
    overflow: auto;
    padding: 0 16px;
}
</style>
