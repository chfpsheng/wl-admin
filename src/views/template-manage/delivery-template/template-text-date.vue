<template>
  <div class="pregnancy-time">{{ date }}</div>
</template>
<script>
export default {
  name: "TemplateTextDate",
  props: {
    value: {
      type: String | Number,
      default: "",
    },
    // 初始化模板孕周数据(患者消息产检日程表才会有这个)
    initPregnancyWeek: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      date: "",
    };
  },
  mounted() {
    this.getDate(this.value);
  },
  watch: {
    value: {
      handler(val) {
        this.getDate(val);
      },
      deep:true,
      immediate: true,
    },
    initPregnancyWeek:{
      handler(val) {
        this.getDate(this.value);
      },
      deep:true,
      immediate: true,
    }
  },
  methods: {
    getDate(value) {
      if (value && this.initPregnancyWeek.length > 0) {
        this.initPregnancyWeek.forEach((item) => {
          if ((item.pregnancyWeek+'') == value) {
            this.date = item.date;
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pregnancy-time {
  width: 113px;
  height: 20px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  text-align: left;
  padding-left: 4px;
}
</style>