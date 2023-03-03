<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="flex flex-column discount-edit"
    label-width="auto"
  >
    <div class="form-handler flex flex-between title-box">
      <h2 class="page-title">{{ title }}</h2>
      <div>
        <el-button @click="goBack" size="small" class="pa-btn">返回</el-button>
        <el-button type="primary" size="small" @click="save" class="pa-btn"
          >保存</el-button
        >
      </div>
    </div>
    <div class="flex-main page-content">
      <div class="form-body">
        <h3 class="title">基本信息</h3>
        <el-form-item label="所属科室" prop="departmentId">
          <pa-select
            :value.sync="form.departmentId"
            :options="departmentOptions"
            :clearable="false"
          ></pa-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input
            v-input-trim
            size="small"
            v-model="form.name"
            :maxlength="20"
            :minlength="2"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="beginTime">
          <div class="flex">
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              size="small"
              :picker-options="{ disabledDate: beginTimeDisabledDate }"
              placeholder="选择开始日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="flex-main"
              prefix-icon="iconfont icon-s_riqixuanzheqi"
            >
            </el-date-picker>
            <span style="margin: 0 8px;">至</span>
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              size="small"
              :picker-options="{ disabledDate: endTimeDisabledDate }"
              placeholder="选择结束日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="flex-main"
              prefix-icon="iconfont icon-s_riqixuanzheqi"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="活动标签" prop="label" class="tag-box">
          <el-input
            v-input-trim
            size="small"
            v-model="form.label"
            :minlength="2"
            :maxlength="6"
            placeholder="建议输入4个字符"
          ></el-input>
          <span class="tips">该标签用于展示在用户界面</span>
        </el-form-item>
        <el-form-item label="活动预告" prop="noticeMode">
          <div>
            <el-radio
              v-model="form.noticeMode"
              :label="1"
              @change="form.earlyHour = ''"
              >创建成功后进行活动预告</el-radio
            >
          </div>
          <div>
            <el-radio v-model="form.noticeMode" :label="2">
              <span>活动开始前</span>
              <input-number
                v-model="form.earlyHour"
                class="text-inline-input"
                :disabled="form.noticeMode !== 2"
                :minValue="1"
                :maxValue="1000"
              ></input-number>
              <span>小时进行活动预告</span>
            </el-radio>
          </div>
          <div>
            <el-radio
              v-model="form.noticeMode"
              :label="0"
              @change="form.earlyHour = ''"
              >不进行活动预告</el-radio
            >
          </div>
        </el-form-item>
        <div class="title-rule">
          <h3 class="title ">活动规则</h3>
        </div>
        <!-- <el-form-item label="互斥活动" prop="mutex">
          <el-checkbox v-model="form.mutex" :true-label="1" :false-label="0"
            >与优惠券互斥</el-checkbox
          >
        </el-form-item> -->
        <el-form-item label="活动规则" prop="buyLimit">
          <div>
            <el-radio v-model="limited" :label="false" @change="limitedChanged"
              >不限购</el-radio
            >
          </div>
          <div>
            <el-radio v-model="limited" :label="true" @change="limitedChanged">
              <span>每人每种服务限购</span>
              <input-number
                v-if="limited"
                v-model="form.buyLimit"
                :minValue="1"
                :maxValue="99"
                class="text-inline-input"
              ></input-number>
              <input-number
                v-else
                class="text-inline-input"
                disabled
              ></input-number>
              <span>件，超出后无法购买</span>
            </el-radio>
          </div>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import { getDiscount, insertDiscount, updateDiscount } from "@/api/discount";
import dayjs from "dayjs";
import baseDataMixin from "@/mixins/baseData";
import InputNumber from "@/components/Form/input-number.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    InputNumber
  },
  data() {
    const timeValidator = (rule, value, cb) => {
      if (!this.form.beginTime) {
        return cb(new Error("请设置活动时间"));
      }
      if (dayjs(this.form.beginTime).isBefore(dayjs())) {
        return cb(new Error("活动开始时间必须晚于当前时间"));
      }
      if (!this.form.endTime) {
        return cb(new Error("请设置活动时间"));
      }
      if (!dayjs(this.form.endTime).isAfter(dayjs(this.form.beginTime))) {
        return cb(new Error("活动结束时间必须晚于开始时间"));
      }
      cb();
    };
    const inputRule = {
      pattern: /^[a-zA-z0-9\u4e00-\u9fa5]+$/,
      message: "只可填文字数字字母",
      trigger: "blur"
    };
    return {
      limited: false, //是否限购，默认不限购
      form: {
        departmentId: "", //科室
        name: "", //活动名称
        label: "", // 活动标签
        beginTime: "",
        endTime: "",
        noticeMode: "", //活动预告,0表示不进行活动预告，1表示创建后就进行活动预告，2表示活动前进行活动预告
        earlyHour: "", // 提前多少小时活动预告
        mutex: 0, // 是否互斥
        buyLimit: -1 // 限购数量，-1不限制
      },
      rules: {
        departmentId: [{ required: true, message: "请选择科室" }],
        name: [
          { required: true, message: "请填写活动名称", trigger: "change" },
          { min: 2, max: 20, message: "2-20个字", trigger: "change" }
        ],
        label: [
          { required: true, message: "请填写活动标签", trigger: "change" },
          { min: 2, max: 6, message: "2-6个字", trigger: "change" }
        ],
        noticeMode: [{ required: true }],
        buyLimit: [
          {
            required: true,
            message: "请输入限购数量",
            trigger: "blur"
          }
        ],
        beginTime: [
          { required: true, message: "请设置活动时间", trigger: "change" },
          {
            validator: timeValidator,
            trigger: "change"
          }
        ]
      },
      departmentOptions: []
    };
  },
  computed: {
    title() {
      return this.$route.query.id ? "编辑折扣活动" : "新增折扣活动";
    }
  },
  created() {
    this.init();
  },
  methods: {
    beginTimeDisabledDate(date) {
      // console.log(date);
      if (dayjs(date).isBefore(dayjs().startOf("day"))) {
        return true;
      }
      if (dayjs(date).isAfter(dayjs().add(365, "days"))) {
        return true;
      }
      return false;
    },
    endTimeDisabledDate(date) {
      // 已设置开始时间
      if (this.form.beginTime) {
        // 不能早于开始时间
        if (dayjs(date).isBefore(dayjs(this.form.beginTime).startOf("day"))) {
          return true;
        }
        // 不能大于开始时间+1年
        if (dayjs(date).isAfter(dayjs(this.form.beginTime).add(365, "days"))) {
          return true;
        }
      } else {
        if (dayjs(date).isBefore(dayjs().startOf("day"))) {
          return true;
        }
        if (dayjs(date).isAfter(dayjs().add(365, "days"))) {
          return true;
        }
      }
      return false;
    },
    init() {
      const getDepartmentDataPromise = this.deptDataMixins().then(res => {
        this.departmentOptions = res;
        return res;
      });
      // console.log(getDepartmentDataPromise);
      // console.log(this.$route.query);
      if (this.$route.query.id) {
        // 修改
        getDiscount(this.$route.query.id).then(res => {
          // console.log(res);
          Object.assign(this.form, res.data, {
            earlyHour: res.data.earlyHour ? res.data.earlyHour : null
          });

          this.limited = this.form.buyLimit !== -1;
        });
      } else {
        // 新增
        this.form.noticeMode = 1;
        getDepartmentDataPromise.then(res => {
          this.form.departmentId = res[0]?.value;
        });
      }
    },
    save() {
      console.log(this.form);
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.form.id) {
          updateDiscount(this.form)
            .then(this.saveSuccessCallback)
            .catch(this.saveErrorCallBack);
        } else {
          insertDiscount(this.form).then(this.saveSuccessCallback);
        }
      });
    },
    saveErrorCallBack(res) {
      // [月子餐 -7天；月子餐-14天；月子餐-14天；月子餐-14天；月子餐-14天；]等n个服务已在重叠的时间段参加了限时折扣活动，请处理后保存。
      const { code, data } = res;
      if (code === 4020) {
        const total = data.length;
        const activity = data
          .splice(0, 5)
          .map(item => `${item.productName}-${item.specName}`)
          .join("; ");
        this.$message({
          message: `[${activity}]等${total}个服务已在重叠的时间段参加了限时折扣活动，请处理后保存。`,
          type: "warning"
          // duration: 5000
        });
      }
    },
    saveSuccessCallback() {
      this.$message.success(`${this.form.id ? "编辑" : "新增"}成功！`);
      this.goBack();
    },
    goBack() {
      this.$router.push("/discount");
    },
    limitedChanged() {
      if (this.limited) {
        this.form.buyLimit = "";
      } else {
        this.form.buyLimit = -1;
        this.$refs.form.validateField("buyLimit");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.discount-edit {
  background-color: #fff;
  color: #333;
  .title-box {
    margin-bottom: 5px;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 12px;
    align-items: flex-end;
  }
  .title {
    margin: 0 0 16px;
    height: 14px;
    padding-left: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    color: #06c;
    border-left: 2px solid #06c;
  }
  .title-rule {
    padding-top: 21px;
    border-top: 1px solid #ebebeb;
  }
}
.form-handler {
  padding: 16px 24px;
  border-bottom: 1px solid #ebebeb;
  .page-title {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
  }
  button + button {
    margin-left: 24px;
  }
}
.form-body {
  height: 100%;
  overflow-y: auto;
  .el-form-item {
    width: 580px;
    .el-select {
      width: 100%;
    }
  }
}
::v-deep .el-radio {
  color: #333;
  .el-radio__label {
    font-weight: normal;
  }
}
::v-deep .el-checkbox__label {
  font-weight: normal;
  color: #333;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label,
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #333;
}
.text-inline-input {
  width: 80px;
  margin: 0 8px;
}
.tag-box{
  position: relative;
  .tips{
    color: #999;
    position: absolute;
    right: -176px;
    bottom: 0;
  }
}
</style>
