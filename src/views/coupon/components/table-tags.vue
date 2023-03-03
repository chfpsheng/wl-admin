<template>
  <el-popover placement="top" trigger="hover" popper-class="popper-tag">
    <div class="tag-view">
      <el-tag v-for="(item, index) in tags" :key="index" class="tag pa-el-tag">{{
        item
      }}</el-tag>
    </div>
    <div slot="reference">
      <el-tag v-for="(item, index) in previewData" :key="index" class="tag pa-el-tag">{{
        item
      }}</el-tag>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    previewData() {
      const result = [];
      const showLimit = 3;
      const length = this.tags.length;
      const showNum = Math.min(length, showLimit);
      const moreNum = length - showLimit;
      if (!length) {
        return result;
      }
      for (let i = 0; i < showNum; i++) {
        const item = this.tags[i];
        // 截取每项前5个字符展示
        result.push(item.substring(0, 5));
      }
      if (moreNum > 0) {
        result.push(`+ ${moreNum}`);
      }

      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 8px;
}
.tag-view {
  max-width: 600px;
  max-height: 450px;
  overflow: auto;
  .tag {
    margin-top: 8px;
  }
}
::v-deep .popper-tag {
  padding-top: 0;
}
</style>
