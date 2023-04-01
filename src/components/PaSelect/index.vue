<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    class="pa-select"
    :disabled="disabled"
    :clearable="clearable"
    popper-class="select-popper"
    @change="change"
    @clear="clear"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>
<script>
export default {
  name: "PaSelect",
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedValue: "",
    };
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val;
      },
      immediate: true,
    },
    selectedValue: {
      handler(val) {
        this.$emit("update:value", val);
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    change(val) {
      this.$emit("change", val);
    },
    clear() {
      this.$emit("clear");
    },
  },
};
</script>

