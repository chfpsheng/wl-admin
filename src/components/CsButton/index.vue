<template>
  <div class="cs-btn">
    <span class="cs-title">{{ title }}</span>
    <i class="el-icon-close" @click="delItem" />
  </div>
</template>
<script>
export default {
  name: 'CsButton',
  props: {
    title: {
      type: String,
      default: '按钮'
    }
  },
  data() {
    return {
    }
  },
  created() {},
  methods: {
    delItem() {
      this.$emit('delItem')
    }
  }
}
</script>
<style scoped>
.cs-btn {
  padding: 0 16px;
  border: 1px solid #D8D8D8;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  cursor: pointer;
  margin: 0 8px 8px 0;
}
.cs-btn:hover {
  color: #06c;
  border: 1px solid #06c;
}
.cs-btn .cs-title {
  margin-right: 8px;
}
.cs-btn *{
  font-size: 14px;
}
</style>
