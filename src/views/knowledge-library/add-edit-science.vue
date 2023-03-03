<template>
  <div class="add-edit-science">
    <div class="header">
      <div class="title">{{ pageTitle }}</div>
      <div class="btn-group">
        <el-button class="pa-btn" @click="linkList">取消</el-button>
        <el-button
          type="primary"
          class="pa-btn"
          :loading="comfirmLoading"
          @click="submitForm"
          >确定</el-button
        >
      </div>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="form-conatianer"
    >
      <el-form-item label="科普类型" required>
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="0">图文</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="知识标题" prop="title">
        <el-input
          class="pa-input fixed-width"
          placeholder="请输入标题"
          maxlength="30"
          v-model="ruleForm.title"
          style="width: 220px"
        ></el-input>
        <span class="knowledge-info">不能输入超过30个字</span>
      </el-form-item>
      <el-form-item label="所属科室" prop="depetNum">
        <el-select
          class="pa-select fixed-width"
          v-model="ruleForm.depetNum"
          placeholder="请选择科室"
        >
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属分类" prop="categories">
        <el-cascader
          class="pa-select fixed-width"
          v-model="ruleForm.categories"
          :options="categoryOptions"
          :props="{ checkStrictly: true }"
          placeholder="请选择分类"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="适用孕周 " prop="gestationalWeek">
        <div class="align-center-flex">
          <pa-select
            :value.sync="ruleForm.gestationalWeek[0]"
            :options="gestationalWeekStartOptions"
            class="form-select"
            @change="gestationalWeekStartChange"
          />
          <div class="center-flex center-text">至</div>
          <pa-select
            :value.sync="ruleForm.gestationalWeek[1]"
            :options="gestationalWeekEndOptions"
            class="form-select"
          />
        </div>
        <!-- <el-select
          class="pa-select gestational-week"
          v-model="ruleForm.gestationalWeek[0]"
          placeholder="请选择孕周"
        >
          <el-option
            v-for="(item, index) in gestationalWeekOptions"
            :key="index"
            :label="item.itemName"
            :value="item.itemCode"
          />
        </el-select>
        <span class="gestational-week-devide">至</span>
        <el-select
          class="pa-select gestational-week"
          v-model="ruleForm.gestationalWeek[1]"
          placeholder="请选择孕周"
        >
          <el-option
            v-for="(item, index) in gestationalWeekOptions"
            :key="index"
            :label="item.itemName"
            :value="item.itemCode"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="知识封面" prop="coverImg">
        <span class="form-item-tips"
          >上传png、jpg、jpeg格式图片，1M以内大小，只能上传一张；建议尺寸690*580</span
        >
        <upload-img
          :limit="1"
          :img-list="coverImgList"
          @fileChange="coverImgChange"
        />
      </el-form-item>
      <el-form-item label="知识简介" prop="introduce">
        <el-input
          class="fixed-width"
          type="textarea"
          rows="8"
          placeholder="输入内容描述"
          maxlength="50"
          show-word-limit
          v-model="ruleForm.introduce"
        ></el-input>
      </el-form-item>
      <el-form-item label="知识标签" prop="labels" class="knowledge-tabs">
        <div class="pa-patient-tabs--box pa-special-form-item">
          <div v-if="labelList && labelList.length <= 4">
            <el-tag
              v-for="(item, index) in labelList"
              :key="index"
              class="pa-el-tag"
            >
              {{ item.labelName }}
            </el-tag>
          </div>
          <el-popover
            v-if="labelList && labelList.length > 4"
            placement="top-start"
            width="400"
            trigger="hover"
          >
            <div
              style="width: 100%; max-height: 300px; overflow: auto"
              class="pa----patient-tabs"
            >
              <el-tag
                v-for="(item1, index1) in labelList"
                :key="index1"
                class="pa-el-tag"
              >
                {{ item1.labelName }}
              </el-tag>
            </div>
            <div slot="reference">
              <el-tag
                v-for="(item, index) in labelList.slice(0, 3)"
                :key="index"
                class="pa-el-tag"
              >
                {{ item.labelName }}
              </el-tag>
              <el-tag class="pa-el-tag"> + {{ labelList.length - 3 }} </el-tag>
            </div>
          </el-popover>
          <i
            class="iconfont icon-xiugaiiconbeifen1 icon-error iconsize"
            @click="viewItemLabel()"
          />
        </div>
      </el-form-item>
      <el-form-item label="正文编辑" prop="content">
        <tinymce class="tinymces" v-model="ruleForm.content" :height="321" />
      </el-form-item>
    </el-form>
    <label-select
      v-if="dlgVisible"
      :dlg-visible="dlgVisible"
      :init-data="initLableData"
      @closeDlg="closeDlg"
      @updateLabelList="updateLabelList"
    />
  </div>
</template>
<script>
import baseDataMixin from "@/mixins/baseData";
import Tinymce from "@/components/Tinymce";
import LabelSelect from "@/components/LabelSelect";
// import { labelUpdateOnly } from "@/api/patient";
export default {
  name: "AddEditScience",
  mixins: [baseDataMixin],
  components: { Tinymce, LabelSelect },
  data() {
    const validateGestationalWeek = (rule, value, callback) => {
      console.log("请选择孕周", value);
      if (value[0] === "") {
        callback(new Error("请选择适用孕周"));
      } else if (value[1] === "") {
        callback(new Error("请选择适用孕周"));
      } else if (Number(value[0]) >= Number(value[1])) {
        callback(new Error("后面的孕周需大于前面的孕周"));
      }
      callback();
    };
    const validateCategories = (rule, value, callback) => {
      console.log(value);
      if (value && value.length == 0) {
        callback(new Error("请选择所属分类"));
      }
      callback();
    };
    return {
      type: "add", //add、edit
      editId: "", //编辑时的id
      pageTitle: "新增科普知识", //页面标题
      deptOptions: [], //科室下拉
      gestationalWeekOptions: [], //孕周数据
      coverImgList: [],
      comfirmLoading: false,
      ruleForm: {
        type: 0, //科普类型:0图文、1视频、2链接
        title: "", //知识标题
        depetNum: "", //所属科室
        categories: [], //所属分类
        gestationalWeek: ["", ""],
        introduce: "", //知识简介
        labels: "", //标签
        content: "", //正文
        coverImg: "",
      },
      rules: {
        title: [{ required: true, message: "请输入知识标题", trigger: "blur" }],
        depetNum: [
          { required: true, message: "请选择所属科室", trigger: "change" },
        ],
        categories: [
          { required: true, validator: validateCategories, trigger: "change" },
        ],
        gestationalWeek: [
          {
            required: true,
            validator: validateGestationalWeek,
            trigger: "change",
          },
        ],
        content: [
          { required: true, message: "请输入正文编辑", trigger: "blur" },
        ],
      },
      dlgVisible: false,
      initLableData: [],
      labelList: [], //知识标签
      categoryOptions: [], //所属分类
      allCategory: [], //完整分类
      gestationalWeekStartOptions: [],
      gestationalWeekEndOptions: []
    };
  },
  created() {
    let categoryId = this.$route?.query?.categoryId;
    this.initData(categoryId);
    this.type = this.$route?.query?.type;
    if (this.type == "add") {
      // 新增
      this.pageTitle = '新增科普知识'
      this.ruleForm.categories = this.$session.get('nodeArr')
    } else if (this.type == "edit") {
      // 编辑
      this.pageTitle = '编辑科普知识'
      this.editId = this.$route?.query?.id;
      this.getEditData(this.editId);
    }
  },
  methods: {
    async initData(categoryId) {
      console.log("categoryId", categoryId);
      // this.ruleForm.categories = this.getCategoryArr(categoryId);
      // 所属分类
      await this.getClassify();

      // 所属科室
      this.deptOptions = await this.deptDataMixins();
      this.queryGestationalWeek();
    },
    // 查询所属分类数据
    getCategoryArr(categoryId) {
      let _arr = [];
      let _parentId = this.getAllParentId(this.allCategory, categoryId);
      console.log("----_parentId----", _parentId);
      _parentId.pop();
      _parentId.pop();
      _parentId.reverse();
      _arr = [..._parentId];
      if (categoryId) {
        let _categoryId = Number(categoryId);
        _arr.push(_categoryId);
      }
      return _arr;
    },
    // 获取孕周数据
    async queryGestationalWeek() {
      this.gestationalWeekStartOptions = this.$lodash.cloneDeep(this.$gestationalWeeks)
      this.gestationalWeekEndOptions = this.$lodash.cloneDeep(this.$gestationalWeeks)
      this.ruleForm.gestationalWeek[0] ? this.gestationalWeekStartChange(this.ruleForm.gestationalWeek[0]) : ''
      /* const params = {
        dicType: "pregnancy",
      };
      let _url = "/cloud-baseinfo/sysDictionary/queryByType";
      const result = await this.$requestPost(
        `${_url}?dicType=${params.dicType}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.gestationalWeekOptions = result.data;
        }
      } */
    },
    gestationalWeekStartChange(val) {
      this.gestationalWeekEndOptions = this.gestationalWeekEndOptions.map(item => {
        item = {
          ...item,
          disabled: parseInt(item.value) <= parseInt(val)
        };
        return item;
      });
      if (this.ruleForm.gestationalWeek[1] && parseInt(this.ruleForm.gestationalWeek[1]) <= parseInt(val)) {
        this.ruleForm.gestationalWeek[1] = ''
      }
    },
    // 关闭标签选择
    closeDlg() {
      this.dlgVisible = false;
    },
    // 更新标签
    updateLabelList(labellist) {
      console.log("标签选择", labellist);
      this.labelList = [...labellist];
      this.closeDlg();
    },
    viewItemLabel() {
      this.dlgVisible = true;
    },
    // 图片
    coverImgChange(data) {
      this.ruleForm.coverImg = data.join(",");
      this.validateCoverImg();
    },
    validateCoverImg() {
      this.$refs.ruleForm.validateField("coverImg", (err) => {
        if (!err) {
          return true;
        } else {
          return false;
        }
      });
    },
    //提交
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.addAndEditApi();
        } else {
          return false;
        }
      });
    },
    // 新增和更新
    async addAndEditApi() {
      this.comfirmLoading = true;
      let _url = "";
      let _labels = []
      if(this.labelList) {
        _labels = this.labelList.map((item) => {
          item = item.id
          return item
        });
      }
      console.log(_labels);
      const params = {
        type: this.ruleForm.type,
        title: this.ruleForm.title,
        depetNum: this.ruleForm.depetNum,
        categories: [
          this.ruleForm.categories[this.ruleForm.categories.length - 1],
        ],
        gestationStart: this.ruleForm.gestationalWeek[0],
        gestationEnd: this.ruleForm.gestationalWeek[1],
        coverPath: this.ruleForm.coverImg,
        introduce: this.ruleForm.introduce,
        labels: _labels,
        content: this.ruleForm.content,
      };
      console.log(params);
      if (this.type == "add") {
        _url = "/cloud-consult/coupe/insert";
      } else if (this.type == "edit") {
        _url = "/cloud-consult/coupe/update";
        params["id"] = this.editId;
      }
      const result = await this.$requestPost(_url, params);
      this.comfirmLoading = false;
      if (result && result.code === 200) {
        this.$message({
          message: `${this.type == "add" ? "新增" : "编辑"}成功`,
          type: "success",
        });
        this.JumpToList();
      }
    },
    // 编辑时根据id获取数据
    async getEditData(id) {
      const result = await this.$requestPost(
        `/cloud-consult/coupe/get?id=${id}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.ruleForm.title = result.data.title;
          this.ruleForm.depetNum = result.data.depetNum;
          this.ruleForm.gestationalWeek = [
            result.data.gestationStart,
            result.data.gestationEnd,
          ];
          this.ruleForm.introduce = result.data.introduce;
          this.ruleForm.categories = this.getCategoryArr(
            result.data.categories[0].id
          );
          this.labelList = result.data.labels ? result.data.labels : [];
          this.initLableData = result.data.labels ? result.data.labels : [];
          this.ruleForm.content = result.data.content;
          this.ruleForm.coverImg = result.data.coverPath;
          if(this.ruleForm.coverImg) {
            const coverImgArr = this.ruleForm.coverImg.split(",");
            this.coverImgList = coverImgArr.map((item) => {
              item = {
                url: item,
              };
              return item;
            });
          } else {
            this.coverImgList = []
          }
          console.log(111111, this.ruleForm.coverImg, this.coverImgList)
        }
      }
    },
    // 获取所属分类
    async getClassify() {
      const params = {
        pageNo: 1,
        pageSize: 1000,
      };
      let _url = "/cloud-consult/category/query";
      const result = await this.$requestPost(_url, params);
      if (result && result.code === 200) {
        if (result.data) {
          this.allCategory = result.data.rows;
          let _tree = this.getTreeData(result.data.rows, 0); // 获取层次为1的数组
          this.categoryOptions = _tree[0].children;
          console.log(this.categoryOptions);
        }
      }
    },
    //递归寻找父级id
    getAllParentId(data, id) {
      const parentId = [];
      data.forEach((item) => {
        if (id != 0 && item.id == id) {
          parentId.push(item.parentId);
          if (item.parentId != 0) {
            let _parentId = this.getAllParentId(data, item.parentId);
            parentId.push(..._parentId);
          }
        }
      });
      return parentId;
    },
    // 所属分类转化为树形结构
    getTreeData(tempData, parentId) {
      const treeData = [];
      tempData.forEach((item) => {
        if (item.parentId === parentId) {
          let _children = this.getTreeData(tempData, item.id);
          let _item = {
            value: item.id,
            parentId: item.parentId,
            label: item.typeName,
          };
          if (_children.length > 0) {
            _item["children"] = _children;
          }
          treeData.push(_item);
        }
      });
      return treeData;
    },
    // 返回列表
    JumpToList() {
      this.$router.push({
        path: "/knowledge/index",
      });
    },
    linkList() {
      this.resetForm();
      this.JumpToList();
    },
    // 重置表单
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
.add-edit-science {
  background-color: #ffffff;
  padding-bottom: 32px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 24px 12px 24px;
    border-bottom: 1px solid #ebebeb;
    .title {
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
    .btn-group {
      .el-button + .el-button {
        margin-left: 24px;
      }
    }
  }
  ::v-deep.form-conatianer {
    padding-left: 16px;
    margin-top: 24px;
    .el-form-item {
      margin-bottom: 16px;
    }
    .el-form-item__label {
      line-height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
      .el-cascader {
        line-height: 32px;
      }
    }
    .knowledge-info {
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      margin-left: 8px;
    }
    .fixed-width {
      width: 500px !important;
    }
    .gestational-week {
      width: 239px;
    }
    .form-item-tips {
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
    .img--disupload {
      ul {
        display: flex;
        li {
          margin: 0;
        }
      }
    }
    .el-upload--picture-card {
      height: 90px!important;
      width: 90px!important;
      line-height: 90px;
      background-color: #fff;
      border: 1px dashed #ddd;
      border-radius: 2px;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      height: 90px!important;
      width: 90px!important;
    }
    .el-upload--picture-card i {
      font-size: 14px;
      color: #999;
    }
    .tinymce-container.tinymces {
      width: 600px !important;
    }
  }
}
.gestational-week-devide {
  margin: 0 4px;
}
::v-deep .el-form-item__label {
  padding-right: 8px;
}
::v-deep .el-input__inner {
  padding-left: 8px;
}
::v-deep .el-input__suffix {
  right: 0;
}
::v-deep .el-radio__label {
  padding-left: 4px;
}
::v-deep .el-radio {
  display: flex;
}
::v-deep .knowledge-tabs {
  display: flex;
  align-items: center;
}
.knowledge-tabs ::v-deep .el-form-item__content {
  margin-left: 0!important;
}
.knowledge-tabs ::v-deep .iconfont {
  color: #06c;
}
::v-deep .patient-info * {
  color: #333;
}
</style>