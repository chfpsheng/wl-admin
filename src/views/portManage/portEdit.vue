
<template>
  <el-form :model="modelForm" ref="editForm" :rules="rule" :label-width="110">
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="commPatternId" label="通信方式代码">
          <Select
            v-model="modelForm.commPatternId"
            filterable
            placeholder="请选择通信方式代码"
            transfer
          >
            <Option
              v-for="item in patternList"
              :key="item.id"
              :value="item.id"
              >{{ item.commCode }}</Option
            >
          </Select>
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="masterSlave" label="主从方式">
          <Select
            v-model.trim="modelForm.masterSlave"
            clearable
            filterable
            placeholder="请选择主从方式"
            transfer
          >
            <Option key="1" value="1">Master</Option>
            <Option key="2" value="2">slave</Option>
          </Select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ipAddress" label="IP地址/调用地址">
          <el-input
            v-model.trim="modelForm.ipAddress"
            clearable
            placeholder="请输入IP地址/调用地址"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="serverPort" label="通信端口">
          <el-inputNumber
            v-model.trim="modelForm.serverPort"
            :min="1"
            placeholder="请输入通信端口"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="24" style="border: none">
        <el-form-item prop="ecsProtocolIdList" label="关联协议">
          <Select
            v-model="modelForm.ecsProtocolIdList"
            multiple
            clearable
            filterable
            placeholder="请选择关联协议"
            transfer
          >
            <Option
              v-for="item in protocolList"
              :key="item.id"
              :value="item.id"
              >{{ item.protocolName }}</Option
            >
          </Select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="24" style="border: none">
        <el-form-item prop="callbackUri" label="回调地址URI">
          <el-input
            v-model.trim="modelForm.callbackUri"
            clearable
            placeholder="请输入回调地址URI"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="24" style="border: none">
        <el-form-item prop="remark" label="备注">
          <el-input
            v-model.trim="modelForm.remark"
            type="textarea"
            maxlength="200"
            show-word-limit
            clearable
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { getCommPortDetail } from "@/api/port.js";
import { queryCommPatternList } from "@/api/pattern.js";
import { getValueSet } from "@/api/common.js";
import { protocolApi } from "@/api/protocol.js";

export default {
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    const validateIpOrUri = (rule, value, callback) => {
      const ipReg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      const uriReg =
        /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      if (ipReg.test(value) || uriReg.test(value)) {
        callback();
      } else {
        callback(new Error("IP地址/调用地址格式不正确"));
      }
    };
    const validateIpAddress = (rule, value, callback) => {
      let reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("IP地址/调用地址格式不正确"));
      } else {
        callback();
      }
    };
    const validateCallbackUri = (rule, value, callback) => {
      const reg =
        /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      if (!!value && !reg.test(value)) {
        callback(new Error("回调地址URI格式不正确"));
      } else {
        callback();
      }
    };
    return {
      patternList: [], //通信方式
      masterSlaveList: [],
      protocolList: [], //协议版本列表
      modelForm: {
        id: this.id,
        commPatternId: null,
        serverPort: null,
        ipAddress: "",
        callbackUri: "",
        remark: "",
        masterSlave: "",
        commCode: null,
      },
      rule: {
        commPatternId: [
          { required: true, message: "请输入通信方式代码", trigger: "change" },
        ],
        ipAddress: [
          { required: true, message: "请输入IP地址/调用地址", trigger: "blur" },
          { validator: validateIpOrUri, trigger: "blur" },
        ],
        serverPort: [
          {
            required: true,
            message: "请输入通信端口",
            trigger: "blur",
            type: "number",
          },
        ],
        masterSlave: [
          { required: true, message: "请输入主从方式", trigger: "change" },
        ],
        ecsProtocolIdList: [
          { required: true, message: "请选择协议名称", type: "array" },
        ],
        callbackUri: [{ validator: validateCallbackUri, trigger: "blur" }],
      },
      actions: [
        {
          text: "保存",
          theme: "primary",
          handle: () => {
            this.save();
          },
          loading: false,
        },
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ],
    };
  },
  mounted() {
    this.init();
    this.getPatternList();
    this.getMasterSlaveList();
    this.getProtocolList();
  },
  methods: {
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑通信端口信息");
      } else {
        this.$emit("SetTitle", "新增通信端口信息");
      }
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        commPortApi.getCommPortDetail(this.id).then((res) => {
          this.modelForm = res.data;
          this.getCmaProtocolIdList();
        });
      }
    },
    //把后端的格式转换成前端需要的
    getCmaProtocolIdList() {
      this.modelForm.ecsProtocolIdList = [];
      if (Array.isArray(this.modelForm.protocolList)) {
        this.modelForm.protocolList.map((item, index) => {
          this.modelForm.ecsProtocolIdList.push(item.id);
        });
      }
    },
    //组成后端需要的格式。。。
    getProtocolIdList() {
      this.modelForm.protocolList = [];
      if (Array.isArray(this.modelForm.ecsProtocolIdList)) {
        this.modelForm.ecsProtocolIdList.map((item, index) => {
          this.modelForm.protocolList.push({ id: item });
        });
      }
    },
    getCommCode() {
      this.patternList.map((item, index) => {
        if (item.id === this.modelForm.commPatternId) {
          this.modelForm.commCode = item.commCode;
        }
      });
    },
    save() {
      this.getProtocolIdList();
      this.getCommCode();
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.id) {
            commPortApi
              .updateCommPort(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: "保存成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
                    content: "修改失败，" + res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          } else {
            commPortApi
              .addCommPort(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: "新增成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
                    content: "新增失败，" + res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          }
        }
      });
    },
    getPatternList() {
      queryCommPatternList({}).then((res) => {
        this.patternList = res.data;
      });
    },
    //获取主从方式
    getMasterSlaveList() {
      getValueSet({ vsCode: "MASTER_SLAVE" }).then((res) => {
        this.masterSlaveList = res.data;
      });
    },
    getProtocolList() {
      protocolApi.queryProtocolList({}).then((res) => {
        this.protocolList = res.data;
      });
    },
  },
};
</script>
