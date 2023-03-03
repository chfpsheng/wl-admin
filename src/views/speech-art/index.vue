<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="el----tabs">
      <el-tab-pane label="文本" name="version">
        <version v-if="activeName === 'version'" />
      </el-tab-pane>
      <el-tab-pane label="图片" name="photograph">
        <photograph v-if="activeName === 'photograph'" />
      </el-tab-pane>
      <el-tab-pane label="链接" name="links">
        <links v-if="activeName === 'links'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import version from "./components/version.vue";
import photograph from "./components/photograph.vue";
import links from "./components/links.vue";
// import {
//   labelTypeQuery
// } from '@/api/textTree'
export default {
  name: "SpeechArt",
  components: {
    version,
    photograph,
    links
  },
  data() {
    return {
      activeName: "version"
    };
  }
};
</script>
<style scoped lang="scss">
.app-container {
  background-color: #fff;
}
.el----tabs {
  padding-left: 24px;
  width: 100%;
  height: 100%;
}
::v-deep .el-tabs .el-tabs__content {
  height: calc(100% - 40px);
}
.el-tabs ::v-deep .el-tabs__item {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
::v-deep .el-tabs__header {
  margin-bottom: 0px !important;
}
::v-deep.el----tabs .el-tabs__content{
  height: calc(100% - 38px);
}
</style>
