<template>
  <div class="pa-cnt">
      <el-tabs
        v-model="rightActiveName"
        class="pa-im-tabs pa-im-sub-tabs"
      >
        <el-tab-pane label="体重" name="weight">
           <weight-manage :menuActiveName="menuActiveName" @sendCustomMessage="sendCustomMessage" v-if=" rightActiveName === 'weight' "></weight-manage>
        </el-tab-pane>
        <el-tab-pane label="血糖" name="bloodSugar">
          <blood-manage :menuActiveName="menuActiveName" @sendCustomMessage="sendCustomMessage" v-if=" rightActiveName === 'bloodSugar' "></blood-manage>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import WeightManage from "./WeightManage.vue";
import BloodManage from "./BloodManage.vue";
export default {
  components: {
    WeightManage,
    BloodManage
  },
  name: "VisitTaskList",
  props: {
    menuActiveName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
        rightActiveName: 'weight',

    };
  },
  created() {},
  mounted() {},
  methods: {
    sendCustomMessage(data, type){
      this.$emit("sendCustomMessage", data, type);
    }
  }
};
</script>
<style scoped>
.pa-cnt {
  position: relative;
  padding: 0px 0px 0px 0px;
}

.pa-rel-right{
  position: absolute;
  right:0px;
}

.finished .status {
  color: #999999;
}

.finished .content {
  color: #666666;
}

.ing .status {
  color: #0066cc;
}

.ing .content {
  color: #333333;
}

.expired .status {
  color: #f26334;
}

.expired .content {
  color: #f26334;
}

.status {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.content {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 22px;
  width: 209px;
  word-break: break-all;
  flex-grow: 1;
  /* overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;*/
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: #06c;
}

.finished .dot {
  background-color: #999999;
}

.expired .dot {
  background-color: #f26334;
}

.pa-im-tabs.pa-im-sub-tabs >>> .el-tabs__content {
  padding-left: 0px;
  overflow: visible;
}

.pa-im-tabs.pa-im-sub-tabs >>> .el-tabs__header {
 margin-bottom: 16px;
}

.pa-im-tabs.pa-im-sub-tabs >>> .el-tab-pane{
  overflow: visible;
}

.pa-im-tabs.pa-im-sub-tabs >>> .el-tabs__item:nth-child(1){
  padding-left: 0px;
}


</style>
