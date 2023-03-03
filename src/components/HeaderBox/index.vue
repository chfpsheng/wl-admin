<template>
  <div class="header-box">
    <div class="header-wrapper">
      <span class="title">
        {{ title }}<i v-if="required">*</i>
      </span>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderBox',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    required: {
      typeof: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {},
  mounted() {
  },
  methods: {}
}
</script>
<style scoped>
.title i{
  color: #ff4949;
  margin-left: 4px;
}
</style>
