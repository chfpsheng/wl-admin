<template>
  <div class="log-preview flex flex-column">
    <div class="log-header flex flex-between">
      <span>{{ patient.name }}的跟进日志</span>
      <i
        v-if="duty === '4'"
        class="icon iconfont icon-s_tianjia icon-handler"
        @click="addLog"
      ></i>
    </div>
    <div class="flex-main" @scroll="scrollHandler">
      <ul v-if="logList.length" class="log-list">
        <li
          class="log-item"
          v-for="(item, index) in logList"
          :key="index"
          @click="viewDetail(item)"
        >
          <div
            class="item-header flex flex-between"
            :class="{ 'is-log': isLog(item) }"
          >
            <div>
              <span v-if="isLog(item)">客户日志</span>
              <template v-else>
                <span>随访</span>
                <span
                  class="status"
                  :class="{
                    finish: item.status === 1,
                    todo: item.status === 0
                  }"
                  >{{ statusMap[item.status] }}</span
                >
              </template>
            </div>
            <i
              class="icon iconfont icon-xiugaiiconbeifen1 icon-handler"
              v-if="isLog(item) && duty === '4'"
              @click.stop="editLog(item)"
            ></i>
          </div>
          <div class="item-content">
            <div class="content-text" v-if="isLog(item)">
              {{ item.followUpPlan.followUpContent }}
            </div>
            <template v-else>
              <div class="content-text" v-if="item.status === 1">
                {{ item.followUpPlan.followUpContent }}
              </div>
              <ul v-else class="content-task">
                <li
                  v-for="(task, index) in item.followUpPlanTaskList"
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
                  <span> {{ taskTypeMap[task.taskType] }}： </span>
                  <el-tooltip
                    :content="task.taskContent"
                    placement="top"
                    :disabled="task.taskContent.length < 7"
                    popper-class="tooltip-popper"
                  >
                    <span class="flex-main text-ellipsis">
                      {{ task.taskContent }}
                    </span>
                  </el-tooltip>
                </li>
              </ul>
            </template>
          </div>
          <div class="item-footer flex flex-between">
            <div class="user">
              <img
                :src="item.followUpUser.photo"
                alt=""
                v-if="item.followUpUser.photo"
              />
              <img v-else src="../../assets/image/avatar-user.png" alt="" />
              <span>{{ item.followUpUser.displayName }}</span>
            </div>
            <span>{{ item.followUpPlan.followUpTime }}</span>
          </div>
        </li>
      </ul>
      <div v-else class="empty-box" v-show="!loading">
        <img class="empty-image" src="@/assets/image/no-task.png" />
        <div class="tips">暂无数据</div>
      </div>
      <div v-show="loading" class="loading" v-loading="loading">
        <span>加载中…</span>
      </div>
      <div v-show="logList.length && isEnd" class="no-more">
        <span>没有更多了</span>
      </div>
    </div>
    <el-drawer
      :visible.sync="visible"
      :title="title"
      :wrapper-closable="!editting"
      :close-on-press-escape="!editting"
      :size="400"
    >
      <log-edit
        v-if="visible && editting"
        :id="logId"
        @close="editCloseHandler"
      ></log-edit>
      <log-detail
        v-if="visible && !editting"
        :id="logId"
        :taskTypeMap="taskTypeMap"
        @close="editCloseHandler"
      ></log-detail>
    </el-drawer>
  </div>
</template>

<script>
import { getFollowUpLogList, getTaskTypeOptions } from "@/api/workbench";
import { mapState } from "vuex";
import dayjs from "dayjs";
import LogEdit from "./components/log-edit.vue";
import LogDetail from "./components/log-detail.vue";
export default {
  components: {
    LogEdit,
    LogDetail
  },
  data() {
    return {
      title: "新增日志",
      editting: false,
      visible: false,
      logId: 0,
      dataParams: {
        patientId: "",
        followUpBeginTime: "",
        limitSize: 10
      },
      loading: false,
      isEnd: false,
      logList: [],
      taskStatusMap: {
        "0": "待办",
        "1": "已完成",
        "-1": "已过期"
      },
      statusMap: {
        "0": "待随访",
        "1": "已完成",
        "-1": "已过期"
      },
      taskTypeMap: {}
    };
  },
  computed: {
    ...mapState({
      duty: state => state.user.duty,
      patient: state => state.defaultPatient.patient
    })
  },
  watch: {
    "patient.id": {
      handler() {
        this.init();
      }
    }
  },
  created() {
    // console.log(this.patient);
    this.getTaskType();
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.logList = [];
      this.loading = false;
      this.isEnd = false;
      this.dataParams.patientId = this.patient.id;
      this.dataParams.followUpBeginTime = null;
      // this.dataParams.followUpBeginTime =
      //   dayjs().format("YYYY-MM-DD") + " 23:59:59";
      this.getLogData();
    },
    addLog() {
      this.title = "新增日志";
      this.logId = 0;
      this.visible = true;
      this.editting = true;
    },
    editLog(data) {
      // console.log(data);
      this.title = "编辑日志";
      this.logId = data.followUpPlan.id;
      this.visible = true;
      this.editting = true;
    },
    viewDetail(data) {
      // console.log(data);
      this.title =
        data.followUpPlan.planType === "LOG" ? "日志详情" : "随访详情";
      this.logId = data.followUpPlan.id;
      this.editting = false;
      this.visible = true;
    },
    scrollHandler(e) {
      // console.log(e);
      const { scrollHeight, scrollTop, offsetHeight } = e.target;
      if (scrollHeight <= scrollTop + offsetHeight) {
        console.log("loading data");
        this.getLogData();
      }
    },
    getTaskType() {
      getTaskTypeOptions().then(res => {
        if (res.code === 200) {
          const result = {};
          res.data.forEach(item => {
            result[item.itemCode] = item.itemName;
          });
          this.taskTypeMap = result;
          console.log(this.taskTypeMap);
        }
      });
    },
    getLogData() {
      if (this.isEnd || this.loading) {
        return;
      }
      this.loading = true;
      getFollowUpLogList(this.dataParams)
        .then(res => {
          // this.logList.push(res.data)
          if (res.code !== 200 || !res.data) {
            return;
          }
          // Array.prototype.push.apply(this.logList, res.data);
          this.logList = this.logList.concat(res.data);
          // 取最后一条数据时间为查询时间
          const len = this.logList.length;
          if (len > 0) {
            const endLog = this.logList[len - 1];
            if (this.isLog(endLog)) {
              this.dataParams.followUpBeginTime =
                endLog.followUpPlan.createTime;
            } else {
              this.dataParams.followUpBeginTime =
                endLog.followUpPlan.updateTime;
            }
          }
          console.log(this.logList);
          if (this.dataParams.limitSize > res.data.length) {
            this.isEnd = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    isLog(item) {
      return item.followUpPlan.planType === "LOG";
    },
    editCloseHandler(refresh) {
      if (refresh) {
        this.init();
      }
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.log-preview {
  height: 100%;
  > .log-header,
  > .flex-main {
    padding-right: 16px;
  }
}
.icon-handler {
  color: #06f;
  cursor: pointer;
}
.content-task {
  .task-status {
    margin-right: 12px;
    width: 42px;
  }
  .task-item {
    position: relative;
    padding-left: 8px;
    color: #f26334;
    margin-bottom: 4px;
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -2px;
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
}
.log-list {
  margin-top: 8px;
  .log-item {
    margin-bottom: 16px;
    padding: 16px 16px 0;
    border: 1px solid #ebebeb;
    cursor: pointer;
    .item-header {
      color: #333;
      background-image: url("../../assets/image/icon-task.png");
      background-size: 14px 15px;
      background-repeat: no-repeat;
      background-position: left center;
      padding-left: 20px;
      &.is-log {
        background-image: url("../../assets/image/icon-log.png");
      }
      .status {
        margin-left: 8px;
        padding: 4px 8px;
        border-radius: 2px;
        line-height: 1;
        font-size: 12px;
        color: #f26334;
        background: rgba(242, 99, 52, 0.12);
        &.finish {
          color: #666;
          background: rgba(204, 204, 204, 0.3);
        }
        &.todo {
          color: #1a83f2;
          background: rgba(26, 131, 242, 0.12);
        }
      }
    }
    .item-content {
      padding: 8px 0;
      border-bottom: 1px solid #ebebeb;
      font-size: 14px;
      color: #666;
      line-height: 20px;
      word-wrap: break-word;
      word-break: break-word;
      white-space: pre-line;
    }
    .item-footer {
      padding: 8px 0;
      font-size: 12px;
      color: #999;
      .user {
        > img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
          border-radius: 50%;
          vertical-align: middle;
        }
        > span {
          vertical-align: middle;
        }
      }
    }
  }
}
.no-more {
  margin-bottom: 16px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
::v-deep .loading {
  height: 80px;
  width: 100%;
  color: #06c;
  align-items: end;
  .el-loading-mask {
    background-color: transparent;
  }
}
.empty-box {
  text-align: center;
  padding-top: 100px;
  > .empty-image {
    width: 60%;
  }
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
