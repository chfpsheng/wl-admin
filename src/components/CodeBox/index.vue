<template>
  <div id="app">
    <highlightjs autodetect :code="formatCode(code)" />
  </div>
</template>

<script>
import hljs from "highlight.js";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/default.css";
export default {
  name: "codeBox",
  components: {
    highlightjs: hljsVuePlugin.component,
  },
  props: {
    code: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$emit("SetTitle", "查看代码");
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", [
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ]);
      //高亮代码
      hljs.initHighlightingOnLoad();
    },
    formatCode(code) {
      //格式化代码
      return JSON.stringify(code, null, 2);
    },
  },
};
</script>

<style scoped>
#app {
  max-height: 700px;
  /* overflow: scroll; */
}
</style>