<template>
  <el-input
    v-model="value"
    :disabled="disabled"
    :placeholder="placeholder"
    size="small"
    @blur="blurHandler"
  ></el-input>
</template>

<script>
import Decimal from "decimal.js";
export default {
  props: {
    vModel: {
      type: [Number, String],
      default: null
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    decimal: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: Infinity
    },
    maxLength: {
      type: Number,
      default: 30
    },
    // 转化倍率，金额输入框也可以使用该组件，如金额单位显示元实际保存是分的，可以传:exchangeRate="100"
    exchangeRate: {
      type: Number,
      default: 1
    }
  },
  model: {
    prop: "vModel",
    event: "change"
  },
  data() {
    return {
      value: ""
    };
  },
  watch: {
    value: function(newValue, oldValue) {
      // console.log(newValue);
      // debugger;
      // 去空格
      let value = newValue.replace(" ", "");
      // 数字最前面最多只会有一个0
      value = value.replace(/^0+/, "0");

      this.value = value;
      // 最小值大于0是清除负号
      if (this.minValue >= 0) {
        this.value = value.replace("-", "");
      }
      // 如果不为小数则清除小数点
      if (!this.decimal) {
        this.value = value.replace(".", "");
      }
      // 当只有一个负号时不做处理
      if (newValue == "-") {
        return;
      }

      if (value === "") {
        this.value = "";
        this.$emit("change", this.value);
        return;
      }
      // 非数字输入替换为前一个值
      value = Number(value).toString();
      if (value === "NaN") {
        this.value = oldValue;
      }
      // 设定最大值时，且如当前输入值大于最大值，侧直接替换为最大值
      const maxValue = this.maxValue;
      if (maxValue && Number(value) > maxValue) {
        this.value = maxValue.toString();
      }
      // 不能超出最大长度
      if (value.length > this.maxLength) {
        this.value = oldValue;
      }
      // 小数位数处理
      const index = newValue.indexOf(".");
      if (index > 0 && newValue.length - index - 1 > this.decimal) {
        this.value = oldValue;
      }
      if (this.value !== "") {
        // -、 x.、 x.0+、这三种情况不做处理
        const reg = /[-?]|[\.0?]$/;
        if (reg.test(this.value)) {
          return;
        }
        this.$emit(
          "change",
          new Decimal(this.value).mul(this.exchangeRate).toNumber()
        );
      } else {
        this.$emit("change", "");
      }
    },
    vModel: {
      handler: function(value) {
        // console.log(value);
        if (value !== "") {
          this.value = (value / this.exchangeRate).toString();
        } else {
          this.value = "";
        }
      },
      immediate: true
    }
  },
  created() {
    // console.log(this.vModel)
    // this.value = this.vModel !== null ? this.vModel.toString() : ''
  },
  methods: {
    blurHandler() {
      // console.log(this.value, this.vModel);
      if (this.value !== "") {
        // console.log(this.value);
        // 失焦后处理x.与x.0为x
        if (this.value === "-") {
          this.value = "";
          return this.$emit("change", this.value);
        }
        this.value = Number(this.value).toString();
        this.$emit(
          "change",
          new Decimal(this.value).mul(this.exchangeRate).toNumber()
        );
      }
    }
  }
};
</script>

<style></style>
