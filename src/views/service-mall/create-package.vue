<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="132px"
      class="pa-ruleForm"
    >
      <!-- <header-box title="基本信息" /> -->
      <div class="form-box">
        <el-form-item label="套餐名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="输入套餐名称30字以内"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="套餐首图" prop="coverImg">
          <span class="form-item-tips"
            >上传png、jpg、jpeg格式图片，1M以内大小，只能上传一张；建议尺寸690*580</span
          >
          <upload-img
            :limit="1"
            :img-list="coverImgList"
            @fileChange="coverImgChange"
          />
        </el-form-item>
        <el-form-item label="套餐图片" prop="posterImgs">
          <span class="form-item-tips"
            >上传png、jpg、jpeg格式图片，10M以内大小，最多上传3张；建议尺寸700*750</span
          >
          <upload-imgs
            :limit="3"
            :img-list="posterImgsList"
            @fileChange="posterImgsChange"
          />
        </el-form-item>
        <el-form-item label="所属科室" prop="departmentId">
          <pa-select
            :value.sync="ruleForm.departmentId"
            :options="deptOptions"
            class="form-long-select"
            placeholder="选择所属科室"
            @change="departmentChange"
          />
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input-number
            v-model="ruleForm.displayOrder"
            :min="1"
            :step="1"
            step-strictly
            :controls="false"
            class="pa-input form-input form--number-input"
          />
        </el-form-item>
        <el-form-item label="服务期限" prop="serviceStart">
          <div class="align-center-flex">
            <pa-select
              :value.sync="ruleForm.serviceStart"
              :options="serviceStartOptions"
              class="form-select"
              @change="serviceStartChange"
            />
            <div class="center-flex center-text">至</div>
            <pa-select
              :value.sync="ruleForm.serviceEnd"
              :options="serviceEndOptions"
              class="form-select"
            />
          </div>
        </el-form-item>
        <el-form-item label="适用孕妇" prop="suitableStart">
          <div class="align-center-flex">
            <pa-select
              :value.sync="ruleForm.suitableStart"
              :options="suitableStartOptions"
              class="form-select"
              @change="suitableStartChange"
            />
            <div class="center-flex center-text">至</div>
            <pa-select
              :value.sync="ruleForm.suitableEnd"
              :options="suitableEndOptions"
              class="form-select"
            />
          </div>
        </el-form-item>
        <el-form-item label="套餐简介" prop="introduction">
          <el-input
            v-model="ruleForm.introduction"
            type="textarea"
            placeholder="输入套餐简介"
            maxlength="50"
            show-word-limit
            class="pa-input form-input"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </el-form-item>
      </div>
      <header-box title="规格与分账" />
      <split-account v-model="ruleForm"></split-account>
      <!-- <div class="from-box">
        <el-form-item label="服务规格" prop="serviceSpecId">
          <pa-select
            :value.sync="ruleForm.serviceSpecId"
            :options="serviceSpecOptions"
            class="form-long-select"
            @change="serviceSpecChange"
          />
        </el-form-item>
        <el-form-item label="收款模式" prop="receiveMoneyMode">
          <pa-select
            :value.sync="ruleForm.receiveMoneyMode"
            :options="receiveMoneyModeOptions"
            class="form-long-select"
            @change="receiveMoneyModeChange"
          />
        </el-form-item>
        <div v-if="specTableShow" class="table-box" style="padding: 0 32px">
          <el-table class="pa-table" :data="ruleForm.specList">
            <el-table-column
              v-if="ruleForm.serviceSpecId !== 0"
              prop="specName"
              label="规格"
            />
            <el-table-column prop="originalPrice" label="原价">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`specList.${scope.$index}.originalPrice`"
                  :rules="[ValidateRules.InputOriginalPriceRequired]"
                  class="table-form-item"
                >
                  <el-input-number
                    v-model="scope.row.originalPrice"
                    :min="0.01"
                    :max="999999.99"
                    :step="0.01"
                    step-strictly
                    size="medium"
                    :controls="false"
                    class="pa-input-number"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="currentPrice" label="销售价">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`specList.${scope.$index}.currentPrice`"
                  :rules="[ValidateRules.InputSalePriceRequired]"
                  class="table-form-item"
                >
                  <el-input-number
                    v-model="scope.row.currentPrice"
                    :min="0.01"
                    :max="999999.99"
                    :step="0.01"
                    step-strictly
                    size="medium"
                    :controls="false"
                    class="pa-input-number"
                    @change="currentPriceChange(scope.$index)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="ruleForm.receiveMoneyMode === 3"
              prop="groupMoney"
              label="医管分账金额"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`specList.${scope.$index}.groupMoney`"
                  :rules="[ValidateRules.InputGroupMoneyRequired]"
                  class="table-form-item"
                >
                  <el-input-number
                    v-model="scope.row.groupMoney"
                    :min="0"
                    size="medium"
                    :controls="false"
                    class="pa-input-number"
                    disabled
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="ruleForm.receiveMoneyMode === 3"
              prop="hospitalMoney"
              label="罗湖医院分账金额"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`specList.${scope.$index}.hospitalMoney`"
                  :rules="[ValidateRules.InputGroupMoneyRequired]"
                  class="table-form-item table--form--item"
                >
                  <el-input-number
                    v-model="scope.row.hospitalMoney"
                    :min="0"
                    size="medium"
                    :controls="false"
                    class="pa-input-number"
                    disabled
                  />
                  <el-popover
                    v-model="scope.row.popVisible"
                    placement="top"
                    width="480"
                    @show="popShow(scope.$index)"
                  >
                    <el-table
                      :ref="`popTable${scope.$index}`"
                      :data="projectData"
                      class="pa-table"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column type="selection" width="56" />
                      <el-table-column property="name" label="项目名称" />
                      <el-table-column property="code" label="项目编号" />
                      <el-table-column property="price" label="项目价格" />
                    </el-table>
                    <div style="text-align: right; padding: 8px 0">
                      <el-button
                        class="pa-btn"
                        @click="scope.row.popVisible = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        class="pa-btn"
                        @click="popConfirm(scope.$index)"
                        >确定</el-button
                      >
                    </div>
                    <div
                      slot="reference"
                      class="table--form--item-selected"
                      @click="popClick(scope.$index)"
                    >
                      选择
                    </div>
                  </el-popover>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="stockAmount" label="库存">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`specList.${scope.$index}.stockAmount`"
                  :rules="[ValidateRules.InputStockRequired]"
                  class="table-form-item"
                >
                  <el-input-number
                    v-model="scope.row.stockAmount"
                    :min="0"
                    :max="9999"
                    size="medium"
                    :controls="false"
                    class="pa-input-number"
                    :disabled="scope.row.stockStatus"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="stockStatus" width="100px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.stockStatus" class="pa-checkbox"
                  >不限</el-checkbox
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
      <header-box title="服务详情" :required="true" />
      <div class="from-box" style="width: 746px">
        <el-form-item label="" prop="detail" class="special-item">
          <tinymce v-model="ruleForm.detail" :height="321" />
        </el-form-item>
      </div>
      <header-box title="购买须知" :required="true" />
      <div class="form-box">
        <el-form-item label="" prop="buyAttention" class="special-item">
          <el-input
            v-model="ruleForm.buyAttention"
            type="textarea"
            placeholder="输入购买须知"
            maxlength="200"
            show-word-limit
            class="pa-input form-input"
            :autosize="{ minRows: 8, maxRows: 16 }"
            style="width: 680px"
          />
        </el-form-item>
      </div>
      <header-box title="服务使用说明" />
      <div class="form-box">
        <span class="form-tips" style="margin: 0 0 8px 66px"
          >选择下方参数，则会自动替换成对应用户信息</span
        >
        <el-input
          id="useDescription"
          v-model="ruleForm.useDescription"
          type="textarea"
          class="pa-input form-input"
          autosize
          style="margin: 0 0 8px 66px; width: 680px"
          maxlength="30"
          @blur="useDescriptionBlur"
        />
        <el-radio-group
          v-model="ruleForm.useDescriptionType"
          style="margin: 0 0 8px 66px"
          @change="useDescriptionTypeChange"
        >
          <el-radio-button :label="1" border class="pa-radio-button"
            >预产期</el-radio-button
          >
          <el-radio-button :label="2" border class="pa-radio-button"
            >孕周</el-radio-button
          >
        </el-radio-group>
      </div>
      <header-box title="管家服务内容" />
      <div class="from-box" style="width: 746px">
        <el-form-item label="" prop="" class="special-item">
          <tinymce v-model="ruleForm.keeperDescription" :height="321" />
        </el-form-item>
      </div>
    </el-form>
    <div class="footer-box">
      <el-button
        type="primary"
        class="pa-btn"
        :loading="comfirmLoading"
        @click="submitForm"
        >提交</el-button
      >
      <el-button class="pa-btn" @click="previewFn">详情预览</el-button>
      <el-button class="pa-btn" @click="linkList">返回</el-button>
    </div>
    <!-- <pa-preview :visible.sync="previewVisbile" /> -->
    <!-- PaIframe -->
    <pa-Iframe
      :visible.sync="previewVisbile"
      :detail="detail"
      :spec-list="specList"
    />
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import SplitAccount from "./components/split-account";
import baseDataMixin from "@/mixins/baseData";
export default {
  name: "CreatePackage",
  components: { Tinymce, SplitAccount },
  mixins: [baseDataMixin],
  data() {
    // 校验序号
    var validateSN = (rule, value, callback) => {
      if (value && value < 1) {
        return callback(new Error("序号不能小于1"));
      } else if (value && value > 99999) {
        callback(new Error("序号最大为5位数字"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: "",
        name: "",
        coverImg: "", // 套餐首图
        posterImgs: "", // 套餐图片
        departmentId: "", // 科室ID
        departmentName: "",
        displayOrder: 1,
        serviceStart: "",
        serviceEnd: "",
        suitableStart: "",
        suitableEnd: "",
        introduction: "",
        // 服务定价
        receiveMchId: "", // 收款商户ID
        specList: [], // 服务规格表格
        // serviceSpecId: 0, // 服务规格
        // receiveMoneyMode: 1, // 收款模式
        detail: "", // 服务详情
        useDescription: "", // 使用服务说明
        useDescriptionType: "",
        keeperDescription: "", // 管家服务内容
        buyAttention: "", // 购买须知
        iframesTime: null
      },
      rules: {
        name: [
          this.ValidateRules.InputProNameRequired,
          this.ValidateRules.LengthThirty
        ],
        departmentId: [this.ValidateRules.SelectDepartmentRequired],
        // serviceSpecId: [this.ValidateRules.SelectSpecRequired],
        receiveMoneyMode: [this.ValidateRules.SelectMoneyModeRequired],
        coverImg: [this.ValidateRules.ImgRequired],
        posterImgs: [this.ValidateRules.ImgRequired],
        buyAttention: [this.ValidateRules.InputbuyAttentionRequired],
        detail: [this.ValidateRules.InputServiceDetailRequired],
        displayOrder: [{ validator: validateSN, trigger: "blur" }]
      },
      specList: [],
      currentSpec: {},
      deptOptions: [],
      serviceStartOptions: [],
      serviceEndOptions: [],
      suitableStartOptions: [],
      suitableEndOptions: [],
      serviceSpecOptions: [],
      // receiveMoneyModeOptions: [],
      specTableShow: false,
      cursurPosition: 0, // 光标位置
      coverImgList: [],
      posterImgsList: [],
      comfirmLoading: false,
      previewVisbile: false,
      detail: {},
      projectData: [], // 可选项目
      selectedIndex: "",
      selectedArr: [] // 临时选择的项目
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.$nextTick(() => {
      this.initIframe();
    });
  },
  methods: {
    initIframe() {
      let iframes = document.body.getElementsByTagName("iframe");
      if (!iframes || iframes.length === 0) {
        this.iframesTime = setInterval(() => {
          this.initIframe();
        }, 1000);
      } else {
        this.iframesTime ? clearInterval(this.iframesTime) : "";
      }
      iframes.forEach(item => {
        let body = item.contentWindow.document.body;
        body.style.lineHeight = 0.6;
      });
    },
    // currentPriceChange(i) {
    //   if (this.ruleForm.receiveMoneyMode === 3) {
    //     this.ruleForm.specList[i].groupMoney =
    //       this.ruleForm.specList[i].currentPrice -
    //       this.ruleForm.specList[i].hospitalMoney;
    //   }
    // },
    // popClick(index) {
    //   this.selectedIndex = index;
    // },
    // popConfirm(i) {
    //   const totalPrice = this.selectedArr.reduce((acc, cur) => {
    //     return acc + cur.price;
    //   }, 0);
    //   if (totalPrice <= this.ruleForm.specList[i].currentPrice) {
    //     const hisProjectCode = this.selectedArr.map(item => {
    //       item = item.code;
    //       return item;
    //     });
    //     this.ruleForm.specList[i].hospitalMoney = totalPrice;
    //     this.ruleForm.specList[i].groupMoney =
    //       this.ruleForm.specList[i].currentPrice - totalPrice;
    //     this.ruleForm.specList[i].hisProjectCode = JSON.stringify(
    //       hisProjectCode
    //     );
    //     this.ruleForm.specList[i].popVisible = false;
    //   } else {
    //     this.$message.error("医院分账金额不能大于销售价");
    //   }
    // },
    // popShow(i) {
    //   const popTable = "popTable" + i;
    //   this.$refs[popTable].clearSelection();

    //   if (this.ruleForm.specList[i].hisProjectCode) {
    //     const hisProjectCode = JSON.parse(
    //       this.ruleForm.specList[i].hisProjectCode
    //     );
    //     const row = this.projectData.filter(item =>
    //       hisProjectCode.includes(item.code)
    //     );

    //     row.forEach(row => {
    //       this.$refs[popTable].toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs[popTable].clearSelection();
    //   }
    // },
    handleSelectionChange(val) {
      this.selectedArr = val;
    },
    async initData() {
      this.deptOptions = await this.deptDataMixins(); // 科室
      this.serviceStartOptions = this.$lodash.cloneDeep(this.$pregnantCycle);
      this.serviceEndOptions = this.$lodash.cloneDeep(this.$pregnantCycle);
      this.serviceEndOptions = this.serviceEndOptions.map(item => {
        item = {
          ...item,
          disabled: item.value <= 0
        };
        return item;
      });
      this.suitableStartOptions = this.$lodash.cloneDeep(this.$pregnantCycle);
      this.suitableEndOptions = this.$lodash.cloneDeep(this.$pregnantCycle);
      this.suitableEndOptions = this.suitableEndOptions.map(item => {
        item = {
          ...item,
          disabled: item.value <= 0
        };
        return item;
      });
      const serviceSpec = await this.serviceSpecs();
      this.serviceSpecOptions = serviceSpec.data.rows.map(item => {
        item = {
          value: item.id,
          label: item.specName,
          specValues: JSON.parse(item.specValues)
        };
        return item;
      });
      this.serviceSpecOptions.unshift({
        value: 0,
        label: "无规格",
        specValues: [
          {
            name: "无规格",
            num: 1
          }
        ]
      });
      // this.receiveMoneyModeOptions = this.$lodash.cloneDeep(
      //   this.$receiveMoneyModes
      // );
      this.$route.query.id ? this.initEdit() : this.initAdd();
      this.getProjectData();
    },
    initAdd() {
      // this.serviceSpecChange(0);
      // this.receiveMoneyModeChange(1);
    },
    // 项目选择表
    async getProjectData() {
      const params = {
        pageNo: 1,
        pageSize: 300
      };
      const result = await this.$requestPost(
        `/cloud-hmall/hisProject/query`,
        params
      );
      if (result && result.code === 200) {
        this.projectData = result.data.rows.map(item => {
          item = {
            ...item,
            price: item.price / 100
          };
          return item;
        });
      }
    },
    // 编辑初始化
    async initEdit() {
      const result = await this.$requestPost(
        `/cloud-hmall/product/get?id=${this.$route.query.id}`,
        {}
      );

      if (result && result.code === 200) {
        this.ruleForm = {
          ...result.data.product,
          specList: result.data.specList
          // specList: result.data.specList.map(item => {
          //   item = {
          //     ...item,
          //     originalPrice: item.originalPrice / 100,
          //     currentPrice: item.currentPrice / 100,
          //     groupMoney: item.groupMoney / 100,
          //     hospitalMoney: item.hospitalMoney / 100,
          //     stockStatus: item.stockAmount === -1
          //   };
          //   return item;
          // })
        };
        // 排序
        this.ruleForm.specList = this.ruleForm.specList.sort((n1, n2) => {
          return n1.num - n2.num;
        });
        // this.specTableShow = true;
        const coverImgArr = this.ruleForm.coverImg.split(",");
        this.coverImgList = coverImgArr.map(item => {
          item = {
            url: item
          };
          return item;
        });
        const posterImgsArr = this.ruleForm.posterImgs.split(",");
        this.posterImgsList = posterImgsArr.map(item => {
          item = {
            url: item
          };
          return item;
        });
        if (this.$route.query.showPreview) {
          this.previewDetail();
        }
      }
    },
    // 服务规格
    async serviceSpecs() {
      const params = {
        pageNo: 1,
        pageSize: 100
      };
      const result = await this.$requestPost(
        "/cloud-hmall/serviceSpec/query",
        params
      );
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    },
    departmentChange(val) {
      const obj = this.deptOptions.find(item => item.value === val);

      this.ruleForm.departmentName = obj.label;
    },
    serviceStartChange(val) {
      this.serviceEndOptions = this.serviceEndOptions.map(item => {
        item = {
          ...item,
          disabled: item.value <= val
        };
        return item;
      });
      if (this.ruleForm.serviceEnd && this.ruleForm.serviceEnd <= val) {
        this.ruleForm.serviceEnd = "";
      }
    },
    suitableStartChange(val) {
      this.suitableEndOptions = this.suitableEndOptions.map(item => {
        item = {
          ...item,
          disabled: item.value <= val
        };
        return item;
      });
      if (this.ruleForm.suitableEnd && this.ruleForm.suitableEnd <= val) {
        this.ruleForm.suitableEnd = "";
      }
    },
    // serviceSpecChange(val) {
    //   let itemVal = this.serviceSpecOptions.find(item => item.value === val);
    //   itemVal = itemVal.specValues;

    //   // debugger
    //   this.ruleForm.specList = itemVal.map(item => {
    //     item = {
    //       specName: item.name,
    //       originalPrice: 0.01,
    //       currentPrice: 0.01,
    //       groupMoney: 0,
    //       hospitalMoney: 0,
    //       stockAmount: 0,
    //       stockStatus: false,
    //       num: item.num
    //     };
    //     return item;
    //   });
    //   // 排序
    //   this.ruleForm.specList = this.ruleForm.specList.sort((n1, n2) => {
    //     return n1.num - n2.num;
    //   });
    // },
    // receiveMoneyModeChange(val) {
    //   // this.specTableShow = false;

    //   if (val !== 3) {
    //     this.ruleForm.specList = this.ruleForm.specList.map(item => {
    //       item = {
    //         ...item,
    //         groupMoney: 0,
    //         hospitalMoney: 0
    //       };
    //       return item;
    //     });
    //   } else {
    //     this.ruleForm.specList = this.ruleForm.specList.map(item => {
    //       item = {
    //         ...item,
    //         groupMoney: item.currentPrice - item.hospitalMoney
    //       };
    //       return item;
    //     });
    //   }
    //   setTimeout(() => {
    //     this.specTableShow = true;
    //   }, 10);
    // },
    useDescriptionBlur() {
      const txt = document.getElementById("useDescription");
      this.cursurPosition = 0;
      this.cursurPosition = txt.selectionStart; // 得到光标下标位置
    },
    useDescriptionTypeChange(val) {
      const sVal = val === 1 ? "[预产期]" : "[孕周]";
      this.ruleForm.useDescription = this.insertStr(
        this.ruleForm.useDescription,
        this.cursurPosition,
        sVal
      );
    },
    insertStr(str, start, newStr) {
      return str.slice(0, start) + newStr + str.slice(start);
    },
    // handleImgChang(data) {
    //   this.ruleForm.coverImg = data
    //   this.validateCoverImg()
    // },
    coverImgChange(data) {
      this.ruleForm.coverImg = data.join(",");
      this.validateCoverImg();
    },
    posterImgsChange(data) {
      this.ruleForm.posterImgs = data.join(",");
      this.validatePosterImgs();
    },
    validateCoverImg() {
      this.$refs.ruleForm.validateField("coverImg", err => {
        if (!err) {
          return true;
        } else {
          return false;
        }
      });
    },
    validatePosterImgs() {
      this.$refs.ruleForm.validateField("posterImgs", err => {
        if (!err) {
          return true;
        } else {
          return false;
        }
      });
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addData();
        } else {
          return false;
        }
      });
    },
    async addData() {
      this.comfirmLoading = true;
      !this.$route.query.id ? delete this.ruleForm.id : "";
      const postUrl = !this.$route.query.id
        ? "/cloud-hmall/product/insert"
        : "/cloud-hmall/product/update";
      const params = {
        ...this.ruleForm
        // TODO 元转分
        // specList: this.ruleForm.specList.map(item => {
        //   item = {
        //     ...item,
        //     originalPrice: item.originalPrice * 100,
        //     currentPrice: item.currentPrice * 100,
        //     groupMoney:
        //       this.ruleForm.receiveMoneyMode === 3
        //         ? item.groupMoney * 100
        //         : this.ruleForm.receiveMoneyMode === 1
        //         ? item.currentPrice * 100
        //         : 0,
        //     hospitalMoney:
        //       this.ruleForm.receiveMoneyMode === 3
        //         ? item.hospitalMoney * 100
        //         : this.ruleForm.receiveMoneyMode === 2
        //         ? item.currentPrice * 100
        //         : 0,
        //     stockAmount: item.stockStatus ? -1 : item.stockAmount
        //   };
        //   return item;
        // })
      };
      const result = await this.$requestPost(postUrl, params);
      if (result && result.code === 200) {
        this.$message({ message: "提交成功", type: "success" });
        this.linkList();
      }
      this.comfirmLoading = false;
    },
    linkList() {
      this.$router.push({
        path: "/serviceMall"
      });
    },
    previewFn() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.previewDetail();
        } else {
          this.$message.error("预览前，请先补充必填项");
          return false;
        }
      });
    },
    previewDetail() {
      const detailData = this.$lodash.cloneDeep(this.ruleForm);
      this.detail = detailData;
      detailData.posterImgs = detailData.posterImgs
        ? detailData.posterImgs.split(",")
        : [];

      this.specList = detailData.specList || [];
      if (this.specList.length > 0) {
        // 默认选中第一个
        this.currentSpec = this.specList[0];
        this.detail.currentPrice = this.currentSpec.currentPrice;
        this.detail.originalPrice = this.currentSpec.originalPrice;
        this.detail.productSpecName = this.currentSpec.specName;
        this.detail.productSpecId = this.currentSpec.id;
        // 规格列表中售价最小的项
        const min = this.specList.reduce(function(prev, current) {
          return prev.currentPrice > current.currentPrice ? current : prev;
        });
        // 最小售价
        this.detail.minCurrentPrice = min.currentPrice;
        // 最小售价的原价
        this.detail.minOriginalPrice =
          Math.min.apply(
            Math,
            this.specList.map(o => o.originalPrice)
          );
        // 最达售价
        this.detail.maxCurrentPrice =
          Math.max.apply(
            Math,
            this.specList.map(o => o.currentPrice)
          );
      }

      this.previewVisbile = true;
    }
  }
};
</script>
<style scoped>
.app-container {
  background: #fff;
  overflow: auto;
}
.pa-ruleForm {
  background: #fff;
  padding-bottom: 24px;
}
.form-item-tips {
  display: inline-block;
  color: #999;
  margin-bottom: 4px;
}
.form--number-input {
  width: 500px;
}
</style>
