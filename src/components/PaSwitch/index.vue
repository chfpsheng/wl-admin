<template>
  <div class="switch-box">
    <el-switch
      v-model="switchValue"
      class="pa-switch"
      :disabled="disabled"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      @change="change"
    />
    <div class="switch-mask" @click.stop="click" />
  </div>
</template>
<script>
export default {
  name: 'PaSWitch',
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeValue: {
      type: [String, Number, Boolean, Array],
      default: true
    },
    inactiveValue: {
      type: [String, Number, Boolean, Array],
      default: false
    }
  },
  data() {
    return {
      switchValue: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.switchValue = val
      },
      immediate: true
    },
    switchValue: {
      handler(val) {
        this.$emit('update:value', val)
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    change(val) {
      this.$emit('change', val)
    },
    click() {
      this.$emit('click')
    }
  }
}
</script>
<style scoped>
.switch-box {
  position: relative;
}
.switch-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 100%;
  cursor: pointer;
}
</style>
