<template>
  <div class="pa-special-form-item">
    <div class="pa-special-item-label">{{ label }}: </div>
    <div class="pa-special-item-value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    label: {
      type: String,
      default: '标题'
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped>
</style>
