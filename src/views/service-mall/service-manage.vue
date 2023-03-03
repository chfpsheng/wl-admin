<template>
  <div class="app-container">
    <div class="filter-container filter-box filter-boxs">
      <div
        class="filter-wrapper filter---multiline---wrapper"
        ref="filterWrapper"
      >
        <filter-daterang-picker
          :value.sync="filter.date"
          title="日期范围"
          @change="pickerChange"
        />
        <filter-select
          :value.sync="filter.departmentId"
          :options="departmentOptions"
          title="所属科室"
        />
        <filter-select
          :value.sync="filter.status"
          :options="statusOptions"
          title="状态"
        />
        <filter-select
          :value.sync="filter.type"
          :options="shopTypeOptions"
          title="商品类型"
        />
        <filter-input
          :value.sync="filter.name"
          placeholder="商品名称"
          title="商品名称"
        />
        <el-button type="primary" class="pa-btn" @click="searchData">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button type="primary" class="pa-btn" @click="addItem">
          <i class="el-icon-plus" />
          创建套餐服务
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="套餐编号" prop="id" width="100" />
        <el-table-column label="套餐首图" width="100px">
          <template slot-scope="scope">
            <div class="img-box">
              <img :src="scope.row.coverImg" class="img-type" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="服务套餐名称"
          show-overflow-tooltip
          prop="name"
          width="120"
        />
        <el-table-column label="商品类型" width="100px">
          <template slot-scope="scope">
            {{ scope.row.type | shopTypeText }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columnsData"
          :key="index"
          show-overflow-tooltip
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            {{
              getValue(row, item.prop) != null ? getValue(row, item.prop) : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              :disabled="scope.row.type == 0"
              @click="preview(scope.row)"
              >预览</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="updateClick(scope.row)"
              >{{ scope.row.status === 1 ? "下架" : "上架" }}</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              :disabled="scope.row.type == 0"
              @click="QRcode(scope.row)"
              >二维码</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              :disabled="scope.row.status !== 2"
              @click="delClick(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pa-pagination
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
    <pa-Iframe
      v-if="previewVisbile"
      :visible.sync="previewVisbile"
      :detail="detail"
      :spec-list="specList"
    />
    <el-dialog title="服务二维码" :visible.sync="dialogVisible" width="550px">
      <div class="QR-box">
        <div class="QR-img" id="QRCanvas">
          <img :src="QRData.src" style="width: 100%; height: 100%" />
        </div>
        <span class="QR-name">{{ QRData.name }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="download">下载图片</el-button>
      </span>
    </el-dialog>
    <div id="poster_container"></div>
  </div>
</template>

<script>
import { getProductDiscount } from "@/api/discount";
import baseDataMixin from "@/mixins/baseData";
import shopTypeMixin from "@/mixins/shopType";
import { get } from "lodash";
export default {
  name: "ServiceManage",
  mixins: [baseDataMixin, shopTypeMixin],
  data() {
    return {
      detail: {
        posterImgs: ""
      },
      specList: [],
      currentSpec: {},
      filter: {
        startTime: "",
        endTime: "",
        departmentId: "",
        status: "",
        name: "",
        type: null
      },
      searchVal: {},
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      departmentOptions: [],
      shopTypeOptions: [
        {
          value: null,
          label: "全部"
        },
        {
          value: 0,
          label: "免费商品"
        },
        {
          value: 1,
          label: "普通商品"
        }
      ],
      statusOptions: [
        {
          value: 1,
          label: "销售中"
        },
        {
          value: 2,
          label: "仓库中"
        }
      ],
      columnsData: [
        {
          prop: "departmentName",
          label: "所属科室",
          width: "120px"
        },
        {
          prop: "currentPrice",
          label: "销售价格(元)",
          width: "120px"
        },
        {
          prop: "stockAmountNum",
          label: "库存数量",
          width: "120px"
        },
        {
          prop: "appMch.mchName",
          label: "收款商户",
          width: "160px"
        },
        {
          prop: "statusName",
          label: "状态",
          width: "120px"
        },
        {
          prop: "saleAmount",
          label: "累计销售数量",
          width: "120px"
        },
        {
          prop: "displayOrder",
          label: "排序",
          width: "120px"
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: "220px"
        }
      ],
      tableData: [],
      previewVisbile: false,
      listLoading: false, // 列表加载中
      tableHeight: 500,
      pathUrl: "",
      dialogVisible: false,
      QRData: {}
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.searchData();
    window.onresize = () => {
      this.countHeight();
    };
    this.$nextTick(() => {
      this.countHeight();
    });
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight;
      const num = 240 + h;
      this.tableHeight = this.$computeHeight(num);
    },
    async initData() {
      this.departmentOptions = await this.deptDataMixins(); // 科室
    },
    searchData() {
      this.searchVal = { ...this.filter };
      this.pagination.pageNo = 1;
      this.getList();
    },
    pickerChange(data) {
      this.filter.startTime = data ? data[0] : "";
      this.filter.endTime = data ? data[1] : "";
      this.filter = { ...this.filter };
    },
    async getList() {
      this.searchVal.startTime = this.filter.startTime
        ? `${this.filter.startTime} 00:00:00`
        : "";
      this.searchVal.endTime = this.filter.endTime
        ? `${this.filter.endTime} 23:59:59`
        : "";
      const params = {
        ...this.searchVal,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };

      this.listLoading = true;
      const result = await this.$requestPost(
        "/cloud-hmall/product/queryForMng",
        params
      );
      this.listLoading = false;
      if (result && result.code === 200) {
        this.pagination.total = result.data.total;
        if (!result?.data?.rows) {
          this.tableData = [];
          return;
        }
        this.tableData = result.data.rows.map(item => {
          const receiveMoneyMode = this.$receiveMoneyModes.find(
            val => val.value === item.product.receiveMoneyMode
          );
          const status = this.$servicePackStatus.find(
            val => val.value === item.product.status
          );
          // 销售价格
          let specListPrice = (item.specList || []).map(item => {
            item = item.currentPrice / 100;
            return item;
          });
          if (specListPrice.length === 0) {
            specListPrice = 0;
          } else if (specListPrice.length === 1) {
            specListPrice = specListPrice[0];
          } else {
            const max = Math.max(...specListPrice);
            const min = Math.min(...specListPrice);
            specListPrice = min === max ? max : min + "~" + max;
          }
          // 库存数量
          let specListAmount = (item.specList || []).map(item => {
            item = item.stockAmount;
            return item;
          });
          if (specListAmount.length === 0) {
            specListAmount = 0;
          } else {
            const infinite = specListAmount.find(item => item === -1);
            specListAmount = infinite
              ? "不限"
              : specListAmount.reduce((pre, cur) => {
                  return pre + cur;
                }, 0);
          }
          item = {
            appMch: item.appMch, //商户信息
            specList: item.specList,
            ...item.product,
            receiveMoneyModeName: receiveMoneyMode
              ? receiveMoneyMode.label
              : "",
            statusName: status ? status.label : "",
            stockAmountNum: specListAmount,
            currentPrice: specListPrice,
            originalPrice: item.originalPrice / 100,
            groupMoney: item.groupMoney / 100,
            hospitalMoney: item.hospitalMoney / 100
          };
          return item;
        });
      }
    },
    preview(row) {
      this.detail = this.$lodash.cloneDeep(row);
      this.specList = this.detail.specList || [];
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
        this.detail.minOriginalPrice = Math.min.apply(
          Math,
          this.specList.map(o => o.originalPrice)
        );
        // 最达售价
        this.detail.maxCurrentPrice = Math.max.apply(
          Math,
          this.specList.map(o => o.currentPrice)
        );
      }
      if (Array.isArray(row.posterImgs)) {
        this.detail.posterImgs = row.posterImgs || [];
      } else {
        this.detail.posterImgs = row.posterImgs.split(",") || [];
      }
      this.previewVisbile = true;
    },
    editItem(row) {
      console.log(row);
      this.$router.push({
        path: "/edit-package",
        query: {
          id: row.id,
          type: row.type
        }
      });
    },
    addItem() {
      this.$router.push({
        path: "/create-package"
      });
    },
    delClick(row) {
      this.$confirm(`删除后数据将无法恢复，请谨慎操作`, "确认删除", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delItem(row);
      });
    },
    async delItem(row) {
      const result = await this.$requestPost(
        `/cloud-hmall/product/delete?id=${row.id}`,
        {}
      );
      if (result && result.code === 200) {
        this.$message({
          message: `删除成功`,
          type: "success"
        });
      }
      this.getList();
    },
    async checkProductInActivity(row) {
      if (row.status === 2) {
        return false;
      }
      const res = await getProductDiscount(row.id);
      console.log(res);
      return !!res.data;
    },
    async updateClick(row) {
      const tips = row.status === 1 ? "下架" : "上架";
      const productInActivity = await this.checkProductInActivity(row);
      if (productInActivity) {
        this.$confirm(`该服务正在参加活动，请谨慎操作！`, "提示", {
          confirmButtonText: "仍要下架",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.updateItem(row);
        });
      } else {
        this.$confirm(`是否确定${tips}商品？`, "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.updateItem(row);
        });
      }
    },
    async updateItem(row) {
      const status = row.status === 1 ? 2 : 1;
      const params = {
        id: row.id,
        status
      };
      const result = await this.$requestPost(
        "/cloud-hmall/product/updateStatus",
        params
      );
      if (result && result.code === 200) {
        this.$message({
          message: `${row.status === 1 ? "下架" : "上架"}成功`,
          type: "success"
        });
      }
      this.getList();
    },
    async QRcode(row) {
      const result = await this.$requestPost(
        `/cloud-baseinfo/wxQrCodeWithLogo/getByProductId?productId=${row.id}`,
        {}
      );
      console.log(row, result);
      if (result && result.code === 200) {
        this.dialogVisible = true;
        this.QRData = {
          src: "data:image/jpg;base64," + result.data,
          name: row.name
        };
      }
    },
    download() {
      // 下载
      const imgUrl = this.QRData.src;
      const fileName = this.QRData.name;
      if (window.navigator.msSaveOrOpenBlob) {
        // IE
        var bstr = window.atob(imgUrl.split(",")[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, fileName + "." + "jpg");
      } else {
        var a = document.createElement("a");
        a.setAttribute("href", imgUrl);
        a.setAttribute("download", fileName + "." + "jpg");
        var box = document.querySelector("#poster_container");
        box.appendChild(a);
        a.click();
        box.removeChild(a);
      }
      this.dialogVisible = false;
    },
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.getList();
    },
    getValue(obj, key) {
      return get(obj, key);
    }
  }
};
</script>
<style scoped>
.filter-boxs {
  margin-bottom: 8px;
  padding-bottom: 0;
}
.filter-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.filter---multiline---wrapper .filter-item {
  margin-right: 40px;
  margin-bottom: 16px !important;
}
.filter---multiline---wrapper .el-button--primary {
  margin-bottom: 16px !important;
}
.img-box {
  width: 48px;
  height: 48px;
  padding: 8px 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.img-box .img-type {
  max-width: 32px;
  max-height: 32px;
}
.edit-btn-margin {
  margin-left: 50px;
}
.el-button.pa-btn.delete-btn-margin {
  margin-left: 90px;
}
</style>
