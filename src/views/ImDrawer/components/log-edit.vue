<template>
  <el-form
    :model="form"
    class="flex flex-column pa-ruleForm"
    ref="form"
    :rules="rules"
  >
    <div class="flex-main log-form form-box">
      <el-form-item label="患者" prop="patientId" :rules="[{ required: true }]">
        <div class="user-info">
          <img
            :src="
              defaultPatient.headUrl
                ? defaultPatient.headUrl
                : 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png'
            "
            class="img-avatar"
          />
          <span class="name">{{ defaultPatient.name }}</span>
          <span class="sex">{{ defaultPatient.sex === 1 ? "男" : "女" }} </span>
          <span class="age" v-if="defaultPatient.age">
            &nbsp;| {{ defaultPatient.age }}岁
          </span>
        </div>
      </el-form-item>
      <el-form-item
        label="日志时间"
        prop="followUpTime"
        :rules="[{ required: true }]"
      >
        <el-date-picker
          v-model="form.followUpTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          size="small"
          style="width: 100%"
          disabled
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="日志方式" prop="followUpMode">
        <pa-select
          :value.sync="form.followUpMode"
          :options="typeOptions"
          :clearable="false"
          class="pa-form-select"
          placeholder="选择日志方式"
        />
      </el-form-item>
      <el-form-item
        label="创建人"
        prop="followUpUser"
        :rules="[{ required: true }]"
      >
        <pa-select
          :value.sync="form.followUpUser"
          :options="userOptions"
          :clearable="false"
          class="pa-form-select"
          placeholder="选择创建人"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="日志内容"
        prop="followUpContent"
        :rules="[
          { required: true, message: '请输入日志内容', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="form.followUpContent"
          type="textarea"
          rows="4"
          :maxlength="500"
          show-word-limit
          class="textarea"
          placeholder="请输入日志内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <span>图片</span>
          <small>上传png、jpg、jpeg格式图片,1M以内大小,最多上传3张</small>
        </template>
        <upload-images v-model="form.url"></upload-images>
      </el-form-item>
    </div>
    <div class="drawer-footer">
      <el-button @click="cancel" class="pa-btn">取 消</el-button>
      <el-button type="primary" @click="save" class="pa-btn">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
import {
  getEditFollowUpData,
  addFollowPlan,
  editFollowPlan
} from "@/api/workbench";
import UploadImages from "@/components/UploadImgs/upload-images.vue";
export default {
  components: {
    UploadImages
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {
        followUpMode: "",
        followUpUser: "",
        followUpTime: "",
        followUpContent: "",
        patientId: "",
        planType: "LOG",
        url: "",
        followUpPlanTaskInsertParamDTOList: []
      },
      typeOptions: [
        {
          label: "管家咨询im",
          value: "1"
        },
        {
          label: "电话",
          value: "2"
        },
        {
          label: "面谈",
          value: "3"
        },
        {
          label: "微信",
          value: "4"
        },
        {
          label: "其他",
          value: "5"
        }
      ],
      rules: {
        followUpMode: [
          {
            required: true,
            message: "请选择日志方式",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.imUserId, // 登陆者的im ID
      defaultPatient: state => state.defaultPatient.patient
    }),
    userOptions() {
      const user = this.$local.get("userData");
      return [
        {
          label: user.displayName,
          value: Number(user.userId)
        }
      ];
    }
  },
  created() {
    // console.log(this.defaultPatient);
    this.init();
  },
  mounted() {
    this.$refs.form.clearValidate();
  },
  methods: {
    init() {
      // console.log(this.id);
      if (this.id) {
        // 编辑，获取数据
        getEditFollowUpData(this.id).then(res => {
          // console.log(res);
          if (res.code === 200) {
            Object.assign(this.form, res.data);
          }
        });
      } else {
        // 创建，初始化数据
        const user = this.$local.get("userData");
        this.form.followUpUser = Number(user.userId);
        this.form.patientId = this.defaultPatient.id;
        this.form.followUpMode = "1"; //默认为管家咨询im
        this.form.followUpTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }
    },
    save() {
      console.log(this.form);
      this.$refs.form.validate(valid => {
        // console.log(valid);
        if (!valid) {
          return;
        }
        if (this.form.id) {
          // 编辑
          editFollowPlan(this.form).then(res => {
            console.log(res);
            this.saveCallback();
          });
        } else {
          // 新建
          addFollowPlan(this.form).then(res => {
            console.log(res);
            this.saveCallback();
          });
        }
      });
    },
    saveCallback() {
      this.$emit("close", true);
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.log-form {
  padding: 24px 16px 24px 24px;
}
.user-info {
  display: flex;
  align-items: center;
  padding-left: 4px;
  .img-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .name {
    margin-right: 16px;
  }
  .age {
    margin-left: 4px;
  }
}
::v-deep .el-form-item__label {
  text-align: left;
  padding: 0;
  small {
    margin-left: 4px;
    font-size: 12px;
    color: #999;
  }
}
::v-deep.pa-ruleForm .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 80px !important;
  height: 80px !important;
}
</style>
