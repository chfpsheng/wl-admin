<template>
  <el-cascader
    class="pa-select filter-select"
    :show-all-levels="false"
    v-model="value"
    :options="options"
    @change="handleChange"
  ></el-cascader>
</template>
<script>
export default {
  name: "PatientSelectTemplate",
  props: {
    selectValue: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      value: [],
      options: [],
    };
  },
  watch: {
    selectValue: {
      handler(val) {
        this.value = [...val];
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getSelectTemplate();
  },
  methods: {
    handleChange(value) {
      //console.log(value);
      let oldValue = [...this.selectValue];
      this.$emit("changeValue", value, oldValue);
    },
    // 获取级联数据
    async getSelectTemplate() {
      const result = await this.$requestPost(
        `/cloud-consult/pregnancyTemplate/queryAllGroupByDepartment`
      );
      if (result && result.code === 200) {
        if (result.data) {
          let _data = JSON.parse(JSON.stringify(result.data));
          if (_data) {
            this.options = [];
            _data.forEach((element) => {
              if (element.templateList.length > 0) {
                let _item = {
                  value: element.department.id,
                  label: element.department.name,
                };
                let _itemChildren = [];
                element.templateList.forEach((element1) => {
                  _itemChildren.push({
                    value: element1.id,
                    label: element1.templateName,
                  });
                });
                _item.children = [..._itemChildren];
                this.options.push(_item);
              }
            });
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-select {
  width: 200px;
  line-height: 32px;
}
</style>