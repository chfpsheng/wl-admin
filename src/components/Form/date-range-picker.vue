<template>
  <div class="time-box">
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      :clearable="clearable"
      @change="changeTimeData"
      size="small"
      width="100%"
      prefix-icon="iconfont icon-s_riqixuanzheqi"
    >
    </el-date-picker>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  model: {
    prop: "pageQuery",
    event: "change"
  },
  props: {
    pageQuery: {
      beginTime: "",
      endTime: ""
    },
    valueFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: [],
      pickerOptions: {
        // shortcuts: [
        //   {
        //     text: "最近一周",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近一个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近三个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近半年",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近一年",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近三年",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近五年",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 5);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "全部",
        //     onClick(picker) {
        //       const end = "";
        //       const start = "";
        //       picker.$emit("pick", ["", ""]);
        //     }
        //   }
        // ]
      }
    };
  },
  watch: {
    pageQuery: {
      handler: function(oldValue, newValue) {
        this.initValue();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initValue() {
      const { beginTime, endTime } = this.pageQuery;
      // console.log(beginTime, endTime);
      if (this.pageQuery.beginTime === "Invalid Date") {
        this.pageQuery.beginTime = "";
      }
      if (this.pageQuery.endTime === "Invalid Date") {
        this.pageQuery.endTime = "";
      }
      if (beginTime && endTime) {
        this.value = [
          dayjs(this.pageQuery.beginTime).format(this.valueFormat),
          dayjs(this.pageQuery.endTime).format(this.valueFormat)
        ];
      } else {
        this.value = [];
      }
    },
    changeTimeData() {
      if (!this.value) {
        this.pageQuery.beginTime = "";
        this.pageQuery.endTime = "";
        this.$emit("change", this.pageQuery);
        return;
      }
      this.pageQuery.beginTime = this.value[0]
        ? dayjs(this.value[0])
            .startOf("day")
            .format(this.valueFormat)
        : "";
      this.pageQuery.endTime = this.value[1]
        ? dayjs(this.value[1])
            .endOf("day")
            .format(this.valueFormat)
        : "";
      this.$emit("change", this.pageQuery);
    }
  },
  mounted() {
    this.initValue();
  }
};
</script>
<style scoped>
.time-box .el-range-editor.el-input__inner {
  width: 100% !important;
}
::v-deep .el-date-table td.today.start-date span,
::v-deep .el-date-table td.today.end-date span {
  color: #fff !important;
}
</style>
