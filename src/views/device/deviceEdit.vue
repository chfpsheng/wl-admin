<template>
  <el-form :model="modelForm" ref="editForm" :rules="rule" label-width="100">
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="protocolCode" label="协议名称">
          <el-select
            v-model="modelForm.protocolCode"
            @on-change="protocolChange"
            :disabled="isEdit"
            clearable
            filterable
            placeholder="请选择协议名称"
            transfer
          >
            <el-option
              v-for="item in protocolList"
              :key="item.protocolCode"
              :value="item.protocolCode"
              :label="item.protocolName"
              >{{ item.protocolName }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="ecsProductId" label="产品名称">
          <el-select
            v-model="modelForm.ecsProductId"
            :disabled="isEdit"
            clearable
            filterable
            placeholder="请选择产品名称"
            transfer
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :value="item.id"
              :label="item.productName"
              >{{ item.productName }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="factoryCode" label="厂家名称">
          <el-select
            v-model="modelForm.factoryCode"
            :disabled="isEdit"
            clearable
            filterable
            placeholder="请选择厂家名称"
            transfer
          >
            <el-option
              v-for="item in factoryList"
              :key="item.value"
              :value="item.value"
              :label="item.name"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceType" label="设备类型">
          <el-select
            v-model="modelForm.deviceType"
            :disabled="isEdit"
            clearable
            filterable
            placeholder="请选择设备类型"
            transfer
          >
            <el-option
              v-for="item in deviceTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.name"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceNumber" label="设备编码">
          <el-input
            v-model="modelForm.deviceNumber"
            @input="inputDeviceNumer"
            :disabled="isEdit"
            clearable
            class="dlg-edit-input"
            placeholder="请输入设备编码"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceName" label="设备名称">
          <el-input
            v-model="modelForm.deviceName"
            clearable
            class="dlg-edit-input"
            placeholder="请输入设备名称"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="commCode" label="通信方式">
          <el-select
            v-model="modelForm.commCode"
            @on-change="commCodeChange"
            clearable
            filterable
            placeholder="请选择通信方式"
            transfer
          >
            <el-option
              v-for="item in commCodeList"
              :key="item.value"
              :value="item.value"
              :label="item.name"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="currentKey" label="当前密钥">
          <el-input
            v-model="modelForm.currentKey"
            clearable
            class="dlg-edit-input"
            placeholder="请输入当前密钥"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg" v-if="modelForm.deviceType == 1">
      <el-col :span="12" style="border: none">
        <el-form-item prop="parentDeviceNumber" label="上级设备编号">
          <el-input
            v-model="modelForm.parentDeviceNumber"
            clearable
            placeholder="请输入上级设备编号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="groupId" label="集中器分组ID">
          <el-input
            v-model="modelForm.groupId"
            clearable
            placeholder="输入集中器分组ID"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="onlineMode" label="在线方式">
          <el-select
            v-model="modelForm.onlineMode"
            clearable
            filterable
            placeholder="请选择在线方式"
            transfer
          >
            <el-option
              v-for="item in onlineModeList"
              :key="item.value"
              :value="item.value"
              :lable="item.name"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="dataModelId" label="数据模型">
          <el-select
            v-model="modelForm.dataModelId"
            clearable
            filterable
            placeholder="请选择运数据模型"
            transfer
          >
            <el-option
              v-for="item in dataModelList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceServerIp" label="设备连接IP">
          <el-input
            v-model="modelForm.deviceServerIp"
            clearable
            class="dlg-edit-input"
            placeholder="请输入设备连接IP"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceServerPort" label="设备连接端口">
          <el-input
            v-model="modelForm.deviceServerPort"
            clearable
            class="dlg-edit-input"
            placeholder="请输入设备连接端口"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="24" style="border: none">
        <el-form-item prop="extend" label="扩展JSON">
          <el-input
            v-model="modelForm.extend"
            type="textarea"
            maxlength="200"
            show-word-limit
            clearable
            placeholder="请输入扩展JSON"
            @focus="onBitFocus()"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { deviceApi } from "@/api/device.js";
import { queryProductList } from "@/api/product.js";
import { protocolApi } from "@/api/protocol.js";
import { getValueSet } from "@/api/valueSet.js";
import { dataModelApi } from "@/api/dataModel.js";
import JsonInput from "@/components/JsonInput/index.vue";

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
    return {
      jsonDataAreaModel: null,
      factoryList: [], //厂家列表
      productList: [], //产品列表
      protocolList: [], //协议列表
      deviceTypeList: [], //设备类型
      onlineStatusList: [], //在线状态
      onlineModeList: [], //在线方式
      commCodeList: [], //通信方式
      dataModelList: [], //数据模型
      isEdit: false,
      // showNB:false,
      modelForm: {
        id: this.id,
        protocolCode: "",
        // protocolName: '',
        ecsProductId: "",
        productName: "",
        deviceNumber: "",
        parentDeviceNumber: "",
        deviceName: "",
        factoryCode: "",
        factoryName: "",
        onlineStatus: "",
        onlineMode: "",
        currentKey: "",
        oldKey: "",
        foreignDeviceId: "",
        deviceType: "",
        foreignAppCode: "",
        extend: "",
        createUserName: "",
        updateUserName: "",
        commCode: "",
        groupId: "",
        deviceServerIp: "",
        deviceServerPort: "",
        dataModelId: "",
        dataModelName: "",
      },
      rule: {
        protocolCode: [
          { required: true, message: "请选择协议名称", trigger: "change" },
        ],
        ecsProductId: [
          { required: true, message: "请选择产品名称", trigger: "change" },
        ],
        factoryCode: [
          { required: true, message: "请选择厂家名称", trigger: "change" },
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        deviceNumber: [
          { required: true, message: "请选择设备编码", trigger: "blur" },
        ],
        currentKey: [
          { required: true, message: "请输入当前密钥", trigger: "blur" },
        ],
        commCode: [
          { required: true, message: "请选择通信方式", trigger: "blur" },
        ],
        groupId: [{ required: true, message: "请输入分组ID", trigger: "blur" }],
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
    this.getProductList();
    this.getProtocolList();
    this.getDeviceTypeList();
    this.getOnlineStatusList();
    this.getOnlineModeList();
    this.getFactoryList();
    this.getCommCodeList();
    this.getDataModelList();
    this.init();
  },
  methods: {
    inputDeviceNumer(val) {
      if (!this.modelForm.deviceName) {
        this.modelForm.deviceName = val;
        return;
      }
      if (this.modelForm.deviceName == val.substr(0, val.length - 1)) {
        this.modelForm.deviceName = val;
      }
    },
    protocolChange(val) {
      console.log("protocolChange");
      return;
      //和何侨确认，暂时不要，先去掉这层关系
      if (!!val) {
        let param = { protocolCode: val };
        console.log(val);
        protocolApi.getProtocolProductRef(param).then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.productList = res.data;
          }
        });
      }
    },
    commCodeChange(val) {
      //   let index = ['1','2','3','4','5'].indexOf(val);
      // this.showNB = index > -1;
    },
    onBitFocus() {
      console.log("onBitFocus");
      this.jsonDataAreaModel = new this.$pageModal(
        JsonInput,
        {
          props: {
            jsonDataArea: this.modelForm.extend,
          },
        },
        (data) => {
          this.jsonDataAreaModel = null;
          if (data) {
            this.modelForm.extend = data;
          }
        }
      );
    },
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑设备信息");
      } else {
        this.$emit("SetTitle", "新增设备信息");
      }
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        this.isEdit = true;
        deviceApi.getDeviceDetail(this.id).then((res) => {
          this.modelForm = res.data;
          //协议回显 没有protocolCode 通过协议id获取
          if (!this.modelForm.protocolCode) {
            this.modelForm.protocolCode = this.protocolList.find((item) => {
              return item.id === res.data.ecsProtocolId;
            }).protocolCode;
          }
          this.protocolChange(this.modelForm.protocolCode);
        });
        // if(!!this.modelForm.commCode){
        // let index = ['1','2','3','4','5'].indexOf(this.modelForm.commCode);
        // this.showNB = index > -1;
        // }
      }
    },
    save() {
      //IP格式校验
      if (this.modelForm.deviceServerIp) {
        if (!this.isValidIP(this.modelForm.deviceServerIp)) {
          this.$Message.error({
            content: "设备连接IP格式不正确",
            duration: 3,
          });
          return false;
        }
      }
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          // this.modelForm.protocolName = this.protocolList.find(item => {
          //   return item.id === this.modelForm.ecsProtocolId
          // }).protocolName
          this.modelForm.productName = this.productList.find((item) => {
            return item.id === this.modelForm.ecsProductId;
          }).productName;
          console.log("11111111", this.factoryList, this.modelForm.factoryCode);
          this.modelForm.factoryName = this.factoryList.find((item) => {
            return item.value === this.modelForm.factoryCode;
          }).name;
          if (this.modelForm.dataModelId && this.modelForm.dataModelId > 0) {
            this.modelForm.dataModelName = this.dataModelList.find((item) => {
              return item.id === this.modelForm.dataModelId;
            }).name;
          }
          console.log("22222222", this.modelForm);
          if (this.id) {
            deviceApi
              .updateDevice(this.modelForm)
              .then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$message({
                    message: "保存失败",
                    type: "error",
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          } else {
            deviceApi
              .addDevice(this.modelForm)
              .then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
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
    //产品列表
    getProductList() {
      queryProductList({}).then((res) => {
        this.productList = res.data;
      });
    },
    //协议列表
    getProtocolList() {
      protocolApi.queryProtocolList({}).then((res) => {
        this.protocolList = res.data;
      });
    },
    //设备类型
    getDeviceTypeList() {
      getValueSet({ vsCode: "DEVICE_TYPE" }).then((res) => {
        this.deviceTypeList = res["DEVICE_TYPE"];
      });
    },
    //在线状态
    getOnlineStatusList() {
      getValueSet({ vsCode: "ONOFFLINE" }).then((res) => {
        this.onlineStatusList = res["ONLINE_MODE"];
      });
    },
    //在线状态
    getOnlineModeList() {
      getValueSet({ vsCode: "ONLINE_MODE" }).then((res) => {
        console.log("getOnlineModeList", res);
        this.onlineModeList = res["ONLINE_MODE"];
      });
    },
    //厂家列表
    getFactoryList() {
      getValueSet({ vsCode: "FACTORY_CODE" }).then((res) => {
        this.factoryList = res["FACTORY_CODE"];
      });
    },
    //运营商 todo
    getCommCodeList() {
      deviceApi.getCommCodeSelect().then((res) => {
        this.commCodeList = res.data;
      });
    },
    getDataModelList() {
      // dataModelApi.queryDataModelList({ ecsProtocolId: this.modelForm.ecsProtocolId }).then((res) => {
      //   this.dataModelList = res.data;
      // });
      dataModelApi.queryDataModelList({}).then((res) => {
        this.dataModelList = res.data;
      });
    },
    isValidIP(ip) {
      let reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      return reg.test(ip);
    },
  },
};
</script>
<style scoped>
.dlg-edit-input {
  width: 210px;
}
</style>
