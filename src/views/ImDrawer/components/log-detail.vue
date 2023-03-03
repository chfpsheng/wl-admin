<template>
  <div class="detail">
    <div class="pa-special-form-item" style="align-items: center;">
      <div class="pa-special-item-label">患者信息:</div>
      <div class="pa-special-item-value">
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
          <span class="sex">{{ defaultPatient.sex === 1 ? "男" : "女" }}</span>
          <span class="age" v-if="defaultPatient.age"
            >| {{ defaultPatient.age }}岁</span
          >
        </div>
      </div>
    </div>

    <form-item :label="type + '时间'" :value="form.followUpTime"></form-item>
    <form-item
      :label="type + '方式'"
      :value="typeMap[form.followUpMode]"
    ></form-item>
    <form-item
      v-if="!isLog"
      :label="type + '人'"
      :value="form.followUpUserName"
    ></form-item>
    <div class="pa-special-form-item" v-if="!isLog" style="margin-bottom: 8px;">
      <div class="pa-special-item-label">随访任务:</div>
    </div>
    <ul v-if="!isLog" class="content-task">
      <li
        v-for="(task, index) in form.followUpPlanTaskList"
        :key="index"
        class="flex task-item"
        :class="{
          finish: task.taskStatus === 1,
          todo: task.taskStatus === 0
        }"
      >
        <span class="task-status">
          {{ taskStatusMap[task.taskStatus] }}
        </span>
        <span class="flex-main task-detail">
          {{ taskTypeMap[task.taskType] }}：
          {{ task.taskContent }}
        </span>
      </li>
    </ul>
    <form-item
      :label="isLog ? '日志内容' : '随访结果'"
      :value="form.followUpContent"
    ></form-item>
    <div class="pa-special-form-item">
      <div class="pa-special-item-label">附件图片:</div>
      <div class="pa-special-item-value">
        <upload-images v-model="form.url" disabled></upload-images>
      </div>
    </div>
    <form-item :label="'创建人'" :value="form.createUserName"></form-item>
    <form-item :label="'创建时间'" :value="form.createTime"></form-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
import { getEditFollowUpData } from "@/api/workbench";
import UploadImages from "@/components/UploadImgs/upload-images.vue";
import FormItem from "./FormItem.vue";
export default {
  components: {
    FormItem,
    UploadImages
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    taskTypeMap: {
      type: Object,
      default: () => ({})
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
        planType: "",
        url: "",
        followUpPlanTaskList: []
      },
      typeMap: {
        "1": "管家咨询im",
        "2": "电话",
        "3": "面谈",
        "4": "微信",
        "5": "其他"
      },
      taskStatusMap: {
        "0": "待办",
        "1": "已完成",
        "-1": "已过期"
      }
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.imUserId, // 登陆者的im ID
      defaultPatient: state => state.defaultPatient.patient
    }),
    isLog() {
      return this.form.planType === "LOG";
    },
    type() {
      return this.isLog ? "日志" : "随访";
    }
  },
  created() {
    // console.log(this.defaultPatient);
    this.init();
  },
  mounted() {},
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
      }
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
  height: 100%;
  padding: 24px 16px 24px 24px;
  overflow-y: auto;
}
::v-deep .pa-special-form-item {
  padding: 0;
  margin-bottom: 16px;
  .pa-special-item-label {
    flex-shrink: 1;
    text-align: left;
  }
  .pa-special-item-value {
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-line;
    color: #333;
  }
}
.user-info {
  display: flex;
  align-items: center;
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
.content-task {
  margin-left: 12px;
  margin-bottom: 16px;
  .task-status {
    margin-right: 12px;
    width: 42px;
  }
  .task-item {
    position: relative;
    padding-left: 7px;
    color: #f26334;
    margin-bottom: 8px;
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 8px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #f26334;
    }
    &.finish {
      color: #666;
      &::before {
        background-color: #999;
      }
      .task-status {
        color: #999;
      }
    }
    &.todo {
      color: #333;
      &::before {
        background-color: #0066cc;
      }
      .task-status {
        color: #0066cc;
      }
    }
  }
  .task-detail {
    word-break: break-all;
    white-space: pre-line;
  }
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 80px !important;
  height: 80px !important;
}
</style>
