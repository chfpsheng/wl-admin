<template>
  <el-drawer
    class="page-drawer"
    :value="show"
    :mask="false"
    :mask-closable="false"
    :closable="false"
    width="100"
    :title="title"
    @on-close="close"
  >
    <div class="header">
      <el-button size="small" icon="md-arrow-back" @click="close"
        >返回</el-button
      >
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: "page-drawer",
  data() {
    return {
      show: false,
      title: "",
      actions: [],
      height: "80%",
      width: "600px",
    };
  },
  mounted() {
    this.show = true;
    // 计算宽度
    setTimeout(() => {
      this.calcSize();
    }, 0);
    window.onresize = () => {
      this.calcSize();
    };
  },
  methods: {
    calcSize() {
      // 高度
      if (window.__POWERED_BY_QIANKUN__) {
      } else {
        let headerHeight =
          document.querySelector(".main-header-con").clientHeight;
        let tagsHeight = document.querySelector(".tags-pages").clientHeight;
        this.height =
          document.body.clientHeight - headerHeight - tagsHeight - 24 + "px";
        document.querySelector(".ivu-drawer-content").style.height =
          this.height;

        // 宽度
        let menuWidth = document.querySelector(".sidebar-menu-con").clientWidth;
        this.width = document.body.clientWidth - menuWidth - 16 + "px";
        document.querySelector(".ivu-drawer-content").style.width = this.width;

        // 位置
        document.querySelector(".ivu-drawer-content").style.top =
          headerHeight + tagsHeight + 16 + "px";
        document.querySelector(".ivu-drawer-content").style.right = "8px";
      }
    },
    close() {
      this.show = false;
      console.info("sidelippage close");
      console.info(this);
      !!this.callback && this.callback();
      setTimeout(() => {
        try {
          document.body.removeChild(this.$el);
        } catch (e) {
          console.info(e);
        }
      }, 1000);
    },
    setTitle(title) {
      this.title = title;
    },
  },
};
</script>
<style lang="scss">
.page-drawer {
  position: relative;
  transition: 1s;

  .ivu-drawer-content {
    position: fixed;
  }

  .header {
    height: 32px;
    border-bottom: 1px solid var(--grey-6);
  }

  .body {
    height: calc(~"100% - 48px");
    margin-top: 16px;
  }
}
</style>
