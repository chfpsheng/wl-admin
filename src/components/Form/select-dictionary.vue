<template>
  <el-select
    v-model="value"
    class="selection"
    :disabled="disabled"
    :clearable="clearable"
    @change="changeHandler"
    size="small"
  >
    <el-option v-if="showAll" value="" label="全部"></el-option>
    <el-option
      v-for="(item, index) in selection"
      :key="index"
      :value="item.itemCode"
      :label="item.itemValue"
    >
    </el-option>
  </el-select>
</template>

<script>
import { getSysDictionary } from "@/api/patient";
export default {
  props: {
    showAll: {
      type: Boolean,
      default: false
    },
    dictionaryKey: {
      type: String,
      default: ""
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: "",
      selection: []
    };
  },
  model: {
    prop: "vModel",
    type: "change"
  },
  watch: {
    vModel: {
      handler: function() {
        this.value = this.vModel;
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    // console.log(this.hospital)
    this.value = this.vModel;
  },
  methods: {
    getSelection() {
      if (!this.dictionaryKey) {
        return;
      }
      getSysDictionary(this.dictionaryKey).then(res => {
        console.log(res);
        this.selection = res.data;
      });
    },
    changeHandler() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.selection {
}
</style>
