<template>
  <div class="user-edit">
    <el-form
      :model="modelForm"
      ref="editForm"
      class="ivu-form-no-margin-bottom"
      :rules="rule"
      label-width="120px"
    >
      <el-row :gutter="20" class="code-row-bg">
        <el-col span="12" style="border: none">
          <el-form-item prop="platformName" label="应用平台名称">
            <pa-select
              class="form-item-content"
              :value.sync="modelForm.platformName"
              :options="platformNameList"
              :clearable="false"
            ></pa-select>
            <!-- <Select
              v-model="modelForm.platformName"
              clearable
              filterable
              placeholder="请选择应用平台名称"
              transfer
            >
              <Option
                v-for="item in platformNameList"
                :key="item.vsiKey"
                :value="item.vsiValue"
                >{{ item.vsiValue }}</Option
              >
            </Select> -->
          </el-form-item>
        </el-col>
        <el-col span="12" style="border: none">
          <el-form-item prop="foreignAppCode" label="注册应用编码">
            <el-input
              v-model="modelForm.foreignAppCode"
              maxlength="50"
              @keyup.native="
                modelForm.foreignAppCode = modelForm.foreignAppCode.replace(
                  /[^A-Za-z0-9_]/g,
                  ''
                )
              "
              clearable
              placeholder="请输入注册应用编码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="code-row-bg">
        <el-col span="12" style="border: none">
          <el-form-item label="注册应用名称" prop="foreignAppName">
            <el-input
              v-model="modelForm.foreignAppName"
              maxlength="50"
              clearable
              placeholder="请输入注册应用名称"
            />
          </el-form-item>
        </el-col>
        <el-col span="12" style="border: none">
          <el-form-item prop="registerMaxNum" label="注册设备最大值">
            <el-inputNumber
              v-model="modelForm.registerMaxNum"
              :min="1"
              placeholder="请输入注册设备最大值"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="code-row-bg">
        <el-col span="12" style="border: none">
          <el-form-item prop="ecsCommPortId" label="端口">
            <!-- <Select
              v-model="modelForm.ecsCommPortId"
              clearable
              filterable
              placeholder="请选择端口"
              transfer
              @on-change="onPortChange()"
            >
              <Option
                v-for="item in portList"
                :key="item.id"
                :value="item.id"
                >{{ getPortStr(item) }}</Option
              >
            </Select> -->
            <pa-select
              class="form-item-content"
              :value.sync="modelForm.ecsCommPortId"
              :options="portList"
              :clearable="false"
            ></pa-select>
          </el-form-item>
        </el-col>
        <el-col span="12" style="border: none">
          <el-form-item prop="registerNum" label="已注册设备数">
            <el-inputNumber
              v-model="modelForm.registerNum"
              :min="1"
              placeholder="请输入已注册设备数"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <component
        :is="currentComponent"
        :modelForm="currentModelForm"
      ></component>
      <el-row v-if="currentComponent === ''" :gutter="20" class="code-row-bg">
        <el-col span="24" style="border: none">
          <el-form-item prop="authenticationInfo" label="认证JSON">
            <el-input
              v-model="modelForm.authenticationInfo"
              type="textarea"
              maxlength="1000"
              show-word-limit
              readonly
              @on-focus="onBitFocus()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="code-row-bg">
        <el-col span="24" style="border: none">
          <el-form-item prop="remark" label="备注">
            <el-input
              v-model="modelForm.remark"
              type="textarea"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  getForeignApplicationDetail,
  updateForeignApplication,
  addForeignApplication,
} from "@/api/foreignApplication.js";
import { getValueSet } from "@/api/valueSet.js";
import { queryCommPortList } from "@/api/port.js";
import { queryCommPatternList } from "@/api/pattern.js";
import AppOC from "./foreignApplicationOc.vue";
import AppAEP from "./foreignApplicationAep.vue";
import JsonInput from "@/components/JsonInput/index.vue";
export default {
  components: { AppOC, AppAEP },
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      portList: [],
      patternList: [],
      platformNameList: [], //应用平台名称
      //json
      currentComponent: "",
      currentModelForm: {},
      //电信OC平台JSON
      ocJson: {
        appSecret: "", // 应用密钥
        model: "", //  产品模型型号
        protocolType: "", //  产品模型协议类型
        method: "", //  产品模型命令
        serviceId: "", //  产品模型服务Id
        deviceType: "", //  产品模型设备类型
        manufacturerId: "", //  产品模型厂商ID
        manufacturerName: "", //  产品模型厂商名称
        cmdMode: "", //  命令模式
        cmdWord: "", //  命令码
      },
      //电信AEP平台JSON
      aepJson: {
        masterKey: "", //  Master-APIkey
        autoObserver: "", //  自动发现
        productId: "", //  产品ID
        operator: "", //  操作员
        method: "", //  产品模型服务方法
        serviceId: "", //  产品模型服务Id
        ttl: "", //  ttl
        level: "", //  设备等级
      },
      modelForm: {
        id: this.id,
        ecsCommPortId: "",
        commCode: null,
        foreignAppCode: "",
        foreignAppName: "",
        platformName: "",
        authenticationInfo: "",
        registerMaxNum: null,
        registerNum: 0,
        remark: "",
        ocJson: {
          appSecret: "", // 应用密钥
          model: "", //  产品模型型号
          protocolType: "", //  产品模型协议类型
          method: "", //  产品模型命令
          serviceId: "", //  产品模型服务Id
          deviceType: "", //  产品模型设备类型
          manufacturerId: "", //  产品模型厂商ID
          manufacturerName: "", //  产品模型厂商名称
          cmdMode: "", //  命令模式
          cmdWord: "", //  命令码
        },
        aepJson: {
          masterKey: "", //  Master-APIkey
          autoObserver: "", //  自动发现
          productId: "", //  产品ID
          operator: "", //  操作员
          method: "", //  产品模型服务方法
          serviceId: "", //  产品模型服务Id
          ttl: "", //  ttl
          level: "", //  设备等级
        },
      },
      rule: {
        platformName: [
          { required: true, message: "请选择应用平台名称", trigger: "change" },
        ],
        foreignAppCode: [
          { required: true, message: "请选输入册应用编码", trigger: "blur" },
        ],
        foreignAppName: [
          { required: true, message: "请输入注册应用名称", trigger: "blur" },
        ],
        commCode: [
          { required: true, message: "请选择通信方式编码", trigger: "change" },
        ],
        ecsCommPortId: [
          { required: true, message: "请选择端口", trigger: "change" },
        ],
        authenticationInfo: [
          { required: true, message: "请输入认证JSON", trigger: "blur" },
        ],
        registerMaxNum: [
          {
            required: true,
            type: "number",
            message: "请输入非负数值",
            trigger: "blur",
          },
        ],
        //oc json
        "ocJson.appSecret": [
          { required: true, message: "请输入应用密钥", trigger: "blur" },
        ],
        "ocJson.model": [
          { required: true, message: "请输入产品模型型号", trigger: "blur" },
        ],
        "ocJson.protocolType": [
          {
            required: true,
            message: "请输入产品模型协议类型",
            trigger: "blur",
          },
        ],
        "ocJson.method": [
          { required: true, message: "请输入产品模型命令", trigger: "blur" },
        ],
        "ocJson.serviceId": [
          { required: true, message: "请输入产品模型服务Id", trigger: "blur" },
        ],
        "ocJson.deviceType": [
          {
            required: true,
            message: "请输入产品模型设备类型",
            trigger: "blur",
          },
        ],
        "ocJson.manufacturerId": [
          { required: true, message: "请输入产品模型厂商Id", trigger: "blur" },
        ],
        "ocJson.manufacturerName": [
          {
            required: true,
            message: "请输入产品模型厂商名称",
            trigger: "blur",
          },
        ],
        "ocJson.cmdMode": [
          { required: true, message: "请输入命令模式", trigger: "blur" },
        ],
        "ocJson.cmdWord": [
          { required: true, message: "请输入命令码", trigger: "blur" },
        ],
        //aep json
        "aepJson.masterKey": [
          { required: true, message: "请输入Master-APIkey", trigger: "blur" },
        ],
        "aepJson.autoObserver": [
          { required: true, message: "请输入自动发现", trigger: "blur" },
        ],
        "aepJson.productId": [
          { required: true, message: "请输入产品Id", trigger: "blur" },
        ],
        "aepJson.operator": [
          { required: true, message: "请输入操作员", trigger: "blur" },
        ],
        "aepJson.method": [
          {
            required: true,
            message: "请输入产品模型服务方法",
            trigger: "blur",
          },
        ],
        "aepJson.serviceId": [
          { required: true, message: "请输入产品模型服务Id", trigger: "blur" },
        ],
        "aepJson.ttl": [
          { required: true, message: "请输入ttl", trigger: "blur" },
        ],
        "aepJson.level": [
          { required: true, message: "请输入设备等级", trigger: "blur" },
        ],
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
    this.getPortList();
    this.getPatternList();
    this.getPlatformNameList();
  },
  watch: {
    "modelForm.platformName": {
      handler(val) {
        if (val.includes("OC")) {
          this.currentComponent = "AppOC";
          this.currentModelForm = this.modelForm.ocJson;
        } else if (val.includes("AEP")) {
          this.currentComponent = "AppAEP";
          this.currentModelForm = this.modelForm.aepJson;
        } else {
          this.currentComponent = "";
          this.currentModelForm = {};
        }
      },
    },
  },
  methods: {
    onBitFocus() {
      this.jsonDataAreaModel = new this.$pageModal(
        JsonInput,
        {
          props: {
            jsonDataArea: this.modelForm.authenticationInfo,
          },
        },
        (data) => {
          this.jsonDataAreaModel = null;
          if (data) {
            this.modelForm.authenticationInfo = data;
          }
        }
      );
    },
    getPortStr(item) {
      return `${item.commCode}(${item.ipAddress}:${item.serverPort})`;
    },
    onPortChange() {
      let port = this.portList.find((item) => {
        return item.id === this.modelForm.ecsCommPortId;
      });
      if (!!port) {
        this.modelForm.commCode = port.commCode;
      }
    },
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑外部应用");
      } else {
        this.$emit("SetTitle", "新增外部应用");
      }
      this.$emit("SetPageWidth", 700);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        getForeignApplicationDetail(this.id).then((res) => {
          this.modelForm = res.data;
          this.modelForm.registerNum = !!res.data.registerNum
            ? parseInt(res.data.registerNum)
            : "";
          this.modelForm.registerMaxNum = !!res.data.registerMaxNum
            ? parseInt(res.data.registerMaxNum)
            : "";
          this.initAuthenticationInfoJson();
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          this.buildAuthenticationInfoJson();
          if (this.id) {
            updateForeignApplication(this.modelForm)
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
            addForeignApplication(this.modelForm)
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
    //生成modelForm.authenticationInfo
    buildAuthenticationInfoJson() {
      if (this.modelForm.platformName.includes("OC")) {
        this.modelForm.authenticationInfo = JSON.stringify(
          this.modelForm.ocJson
        );
      } else if (this.modelForm.platformName.includes("AEP")) {
        this.modelForm.authenticationInfo = JSON.stringify(
          this.modelForm.aepJson
        );
      }
    },
    //初始化modelForm.authenticationInfo
    initAuthenticationInfoJson() {
      if (this.modelForm.platformName.includes("OC")) {
        this.currentComponent = "AppOC";
        this.modelForm.ocJson = JSON.parse(this.modelForm.authenticationInfo);
        //下面2行,为了解决数字和字符串校验的问题:接口取出的是数字或字符串(造成2种类型可能是由于字段的类型变化),前端判断的是字符串
        this.modelForm.ocJson.cmdMode = String(this.modelForm.ocJson.cmdMode);
        this.modelForm.ocJson.cmdCode = String(this.modelForm.ocJson.cmdCode);
      } else if (this.modelForm.platformName.includes("AEP")) {
        this.currentComponent = "AppAEP";
        this.modelForm.aepJson = JSON.parse(this.modelForm.authenticationInfo);
        //下面4行,为了解决数字和字符串校验的问题:接口取出的是数字或字符串(造成2种类型可能是由于字段的类型变化),前端判断的是字符串
        this.modelForm.aepJson.autoObserver = String(
          this.modelForm.aepJson.autoObserver
        );
        this.modelForm.aepJson.productId = String(
          this.modelForm.aepJson.productId
        );
        this.modelForm.aepJson.ttl = String(this.modelForm.aepJson.ttl);
        this.modelForm.aepJson.level = String(this.modelForm.aepJson.level);
      }
    },
    getPortList() {
      queryCommPortList({}).then((res) => {
        this.portList = res.data;
      });
    },
    getPatternList() {
      queryCommPatternList({}).then((res) => {
        this.patternList = res.data;
      });
    },
    getPlatformNameList() {
      getValueSet({ vsCode: "PLATFORM_NAME" }).then((res) => {
        this.platformNameList = res.data;
      });
    },
  },
};
</script>
