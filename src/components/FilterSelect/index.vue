<template>
  <div class="filter-item">
    <span class="filter-select-title">
      {{ title }}
    </span>
    <el-select
      v-model="selectedValue"
      :placeholder="placeholder"
      :clearable="clearable"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      class="pa-select filter-select"
      @change="change"
      @clear="clear"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'ServiceManage',
  props: {
    value: {
      type: [String, Number, Boolean, Array]
    },
    options: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '筛选条件'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedValue: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val
      },
      immediate: true
    },
    selectedValue: {
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
    clear() {
      this.$emit('clear')
    }
  }
}
</script>
<style scoped>
</style>
