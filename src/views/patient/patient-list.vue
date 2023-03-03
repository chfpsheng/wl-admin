<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="el-tabs" @tab-click="handleClick">
      <el-tab-pane label="患者列表" name="first" />
      <el-tab-pane label="未转化" name="second" />
    </el-tabs>
    <div class="filter-container filter-box filter-boxs">
      <div
        class="filter-wrapper patient---filter---wrapper---box"
        ref="filterWrapper"
      >
        <filter-daterang-picker
          :value.sync="listQuery.datetime"
          title="选择时间"
          @change="pickerChange"
        />
        <filter-select
          :value.sync="listQuery.gestationStatus"
          :options="statusOptions"
          title="怀孕状态"
        />
        <filter-select
          :value.sync="listQuery.assignKeeper"
          :options="housekeeperOptions"
          title="专属管家"
        />
        <div class="filter-item">
          <span class="filter-select-title"> 患者标签 </span>
          <el-select
            v-model="listQuery.labelIds"
            multiple
            collapse-tags
            class="pa-select filter-select label-slt"
            placeholder="请选择"
          >
            <el-option
              v-for="item in labelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <filter-select
          :value.sync="listQuery.intention"
          :options="degreeStatus"
          title="意向度"
        />
        <filter-select
          :value.sync="listQuery.bornChildStatus"
          :options="proStatus"
          title="生产状态"
        />
        <filter-input
          :value.sync="listQuery.keywork"
          placeholder="患者名称"
          title="患者名称"
        />
        <el-button
          v-waves
          class="filter-item pa-btn"
          type="primary"
          icon="el-icon-search"
          style="margin: 0 16px 16px 0"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          class="filter-item pa-btn"
          type="primary"
          icon="iconfont icon-zhongzhi"
          style="margin: 0 16px 16px 0"
          @click="handleReset"
        >
          重置
        </el-button>

        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item export-btn" icon="el-icon-download" @click="onExport">
          {{ $t('table.export') }}
        </el-button> -->
      </div>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox> -->
    </div>
    <div class="table-box">
      <div class="table-filter">
        <i />
        <div>
          <el-button
            v-if="duty === '4'"
            v-waves
            type="primary"
            class="pa-btn"
            @click="messaging"
          >
            <i class="el-icon-s-promotion" />
            群发消息
          </el-button>
          <el-button
            v-waves
            :disabled="disabled"
            type="primary"
            :loading="downloadLoading"
            class="pa-btn"
            @click="onExport"
          >
            <i class="iconfont icon-daoru" />
            导出Excel
          </el-button>
        </div>

        <!-- <el-button type="primary" class="pa-btn" @click="addItem">创建套餐服务</el-button> -->
      </div>
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        class="pa-table"
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" width="80" />
        <!-- <el-table-column v-if="activeName==='first'" label="就诊卡号" width="150px" prop="card">
          <template slot-scope="{ row }">
            <span>{{ row.regCard }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="患者" width="260px">
          <template slot-scope="{ row }">
            <div class="info-cnt">
              <div class="img-box">
                <img
                  :src="row.headUrl ? row.headUrl : defaultPatientImg"
                  class="img-type"
                />
              </div>
              <span class="name">{{ row.name }} </span>
              <span v-if="activeName === 'first'"
                >{{ row.sex === 1 ? '男' : '女' }} | {{ row.age }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="手机号" min-width="180px">
          <template slot-scope="{ row }">
            <template v-if="row.mobile">
              <span>{{ row.mobile }}</span>
              <SensitiveInfoShow
                :id="row.id"
                type="手机号"
                :url="sensitiveInfoInitUrl"
              />
            </template>
          </template>
        </el-table-column>

        <el-table-column label="患者标签" show-overflow-tooltip width="400px">
          <template slot-scope="{ row }">
            <!-- <div class="label-list-cnt" v-html="showLabelList(row.labelList)" /> -->
            <!-- <el-button class="pa-btn el-button--primary-text" type="primary" size="mini" @click="viewItemLabel(row)">编辑</el-button> -->
            <!-- <i class="iconfont icon-xiugaiiconbeifen1 icon-error iconsize" @click="viewItemLabel(row)" /> -->
            <div class="pa-patient-tabs--box pa-special-form-item">
              <div v-if="row.labelList && row.labelList.length <= 4">
                <el-tag
                  v-for="(item, index) in row.labelList"
                  :key="index"
                  class="pa-el-tag"
                >
                  {{ item.labelName }}
                </el-tag>
              </div>
              <el-popover
                v-if="row.labelList && row.labelList.length > 4"
                placement="top-start"
                width="400"
                trigger="hover"
              >
                <div
                  style="width: 100%; max-height: 300px; overflow: auto"
                  class="pa----patient-tabs"
                >
                  <el-tag
                    v-for="(item1, index1) in row.labelList"
                    :key="index1"
                    class="pa-el-tag"
                  >
                    {{ item1.labelName }}
                  </el-tag>
                </div>
                <div slot="reference">
                  <el-tag
                    v-for="(item, index) in row.labelList.slice(0, 3)"
                    :key="index"
                    class="pa-el-tag"
                  >
                    {{ item.labelName }}
                  </el-tag>
                  <el-tag class="pa-el-tag">
                    + {{ row.labelList.length - 3 }}
                  </el-tag>
                </div>
              </el-popover>
              <i
                class="iconfont icon-xiugaiiconbeifen1 icon-error iconsize"
                @click="viewItemLabel(row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="意向度" show-overflow-tooltip width="100px">
          <template slot-scope="{ row }">
            <span v-if="row.intention">{{ row.intention }}星</span>
          </template>
        </el-table-column>
        <el-table-column label="怀孕状态" min-width="130px">
          <template slot-scope="{ row }">
            <span>{{ showGestationInfo(row.gestationInfo) }}</span>
            <!-- <span>{{ gestationInfoArr[row.gestationInfo && row.gestationInfo.status] }} ()</span> -->
          </template>
        </el-table-column>

        <el-table-column label="预产期" min-width="120px">
          <template slot-scope="{ row }">
            <span>{{
              row.expectedDate ? row.expectedDate.slice(0, 10) : ''
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="生产状态" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ showBirthInfo(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="专属管家" min-width="100px">
          <template slot-scope="{ row }">
            <span>{{ row.assignKeeperName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" min-width="180px">
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" :min-width="optionWidth">
          <template slot-scope="{ row }">
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="viewItem(row)"
            >
              查看
            </el-button>
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="editItem(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="duty === '4'"
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="follow(row)"
            >
              会话
            </el-button>
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="isShow(row)"
              style="margin-right: 24px"
              >用户画像</el-button
            >
            <!--
            <el-button type="primary" size="mini" @click="deleteItem(row)">
              会话
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pa-pagination
        :current-page="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />
    </div>
    <!-- 订单详情 start -->
    <!-- 订单详情 start -->
    <pa-drawer
      title="基本信息"
      :with-footer="false"
      :visible.sync="detailVisible"
    >
      <div v-if="!isEdit" class="detail-container">
        <div class="detail-sub-title">用户信息</div>
        <!-- <div class="detail-item">
          <div class="title">就诊卡号:</div>
          <div class="text">{{ detailInfo.regCard }}</div>
        </div> -->
        <div class="detail-item">
          <div class="title">患者姓名:</div>
          <div class="text">{{ detailInfo.name }}</div>
        </div>
        <div class="detail-item">
          <div class="title">意向度:</div>
          <div class="text">
            <el-rate v-model="detailInfo.intention" disabled />
          </div>
        </div>
        <div class="detail-item">
          <div class="title">年龄:</div>
          <div class="text">{{ detailInfo.age }}</div>
        </div>
        <div class="detail-item">
          <div class="title">怀孕状态:</div>
          <div class="text">
            {{ showGestationInfo(detailInfo.gestationInfo) }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">预产期:</div>
          <div class="text">
            {{
              detailInfo.expectedDate
                ? detailInfo.expectedDate.slice(0, 10)
                : ''
            }}
          </div>
        </div>

        <div class="detail-item">
          <div class="title">生产状态:</div>
          <div class="text">{{ showBirthInfo(detailInfo) }}</div>
        </div>
        <div class="detail-item">
          <div class="title">专属管家:</div>
          <div class="text">{{ detailInfo.assignKeeperName }}</div>
        </div>
        <div class="detail-item">
          <div class="title">身份证号:</div>
          <div class="text">
            <template v-if="detailInfo.idCard">
              {{ detailInfo.idCard }}
              <SensitiveInfoShow
                :id="detailInfo.id"
                type="身份证号"
                :url="sensitiveInfoInitUrl"
              />
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">生产日期:</div>
          <div class="text">
            {{
              detailInfo.bornChildDate
                ? detailInfo.bornChildDate.slice(0, 10)
                : ''
            }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">性别:</div>
          <div class="text">
            {{
              detailInfo.sex === 2
                ? '女'
                : detailInfo.sex === 1
                ? '男'
                : detailInfo.sex === 0
                ? '未知'
                : ''
            }}
          </div>
        </div>
        <div class="detail-item">
          <div class="title">联系电话:</div>
          <div class="text">
            <template v-if="detailInfo.mobile">
              {{ detailInfo.mobile }}
              <SensitiveInfoShow
                :id="detailInfo.id"
                type="手机号"
                :url="sensitiveInfoInitUrl"
              />
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">微信号:</div>
          <div class="text">
            <template v-if="detailInfoMore.mobile">
              {{ detailInfoMore.wechatNo }}
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">胎次:</div>
          <div class="text">
            <template v-if="detailInfoMore.parity">
              {{ translate(detailInfoMore.parity, parityOptions) }}
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">职业:</div>
          <div class="text">
            <template v-if="detailInfoMore.profession">
              {{ translate(detailInfoMore.profession, professionList) }}
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">学历:</div>
          <div class="text">
            <template v-if="detailInfoMore.education">
              {{ translate(detailInfoMore.education, educationList) }}
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title" style="min-width: 85px">家庭年收入:</div>
          <div class="text">
            <template v-if="detailInfoMore.income">
              {{ translate(detailInfoMore.income, incomeList) }}
            </template>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">创建时间:</div>
          <div class="text">{{ detailInfo.createTime }}</div>
        </div>
        <div class="detail-item">
          <div class="title">患者备注:</div>
          <div class="text">{{ detailInfo.description }}</div>
        </div>

        <div class="content">
          <div class="base-info">
            <div
              class="pa-item flex"
              style="margin: 24px 0 16px 0; line-height: 20px"
            >
              <span class="left-item">患者标签</span>
            </div>
            <div class="box-mr">
              <el-form style="padding-top: 8px">
                <el-form-item>
                  <div style="color: #999">手动标签</div>
                  <el-row style="max-height: 85px; overflow: scroll">
                    <el-col
                      v-for="(item, index) in shoudongLabelList"
                      :key="index"
                      class="label-item-slted shoudong sdColor"
                      :span="7"
                    >
                      <div
                        style="
                          min-width: 70px;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        "
                        :title="item.labelName"
                      >
                        {{ item.labelName }}
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <div style="color: #999">自动标签</div>
                  <el-row
                    style="max-height: 85px; overflow: scroll; min-height: 40px"
                  >
                    <el-col
                      v-for="(item, index) in zidongLabelList"
                      :key="index"
                      class="label-item-slted zidong zdColor"
                      :span="7"
                    >
                      <div
                        style="
                          min-width: 70px;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        "
                        :title="item.labelName"
                      >
                        {{ item.labelName }}
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div v-if="packageList && packageList.length">
          <div class="detail-sub-title">订单信息</div>
          <list-item
            v-for="(item, index) in packageList"
            :key="index"
            :item-data="item"
          />
          <div
            class="pa--empty-box"
            v-if="!packageList || packageList.length === 0"
          >
            <div>
              <img class="pa--empty-image" src="@/assets/image/no-task.png" />
            </div>
            <div class="tips">暂无订单</div>
          </div>
          <!-- <div v-for="(item,index) in packageList" :key="index" class="service">
            <div class="service-left">
              <el-image :src="item.coverImg" />
            </div>
            <div class="service-right">
              <div>{{ item.productName }}</div>
              <div>{{ item.introduction }}</div>
              <div>¥ {{ setDecimal(item.sumTotal) }}</div>
            </div>
          </div> -->
        </div>
        <!-- <div class="detail-item">
           <div class="title">商品</div>
          <div class="text product">
            <img :src="detailInfo.coverImg" alt="">
            <span>{{ detailInfo.productName }}</span>
          </div>
        </div> -->
        <!-- <div class="detail-item">
          <div class="title">订单金额</div>
          <div class="text">{{ setDecimal(detailInfo.sumTotal) }} 元</div>
        </div> -->
      </div>
    </pa-drawer>
    <label-select
      v-if="dlgVisible"
      :dlg-visible="dlgVisible"
      :init-data="initLableData"
      @closeDlg="closeDlg"
      @updateLabelList="updateLabelList"
    />
    <SensitiveInfo
      v-if="sensitiveInfoVisible"
      v-model="sensitiveInfoVisible"
      :sensitiveInfoInit="sensitiveInfoInit"
      @updateList="sensitiveInfoUpdateList"
    />
  </div>
</template>

<script>
import ListItem from '@/views/ImDrawer/components/ListItem'
import {
  patientQuery,
  addEmployee,
  updateEmployee,
  queryAssigner,
  labelQuery,
  labelUpdateOnly,
  deleteEmployee,
  listByUserId,
  getOrderList,
  getNewPatientById,
  getSysDictionary,
} from '@/api/patient'
import waves from '@/directive/waves' // waves directive
import defaultPatientImg from '../../assets/image/default-patient.png'
import LabelSelect from '@/components/LabelSelect'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import baseDataMixin from '@/mixins/baseData'
const { deepClone } = require('../../utils')
import { mapState } from 'vuex'
import SensitiveInfo from './sensitive-info.vue'
import SensitiveInfoShow from '@/components/SensitiveInfo/sensitive-info-show.vue'
export default {
  name: 'ComplexTable',
  components: {
    LabelSelect,
    SensitiveInfo,
    SensitiveInfoShow,
    ListItem,
  },
  directives: {
    waves,
  },
  mixins: [baseDataMixin],
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    return {
      // optionWidth:"200px",
      showPa: false,
      showRow: '',
      defaultPatientImg: defaultPatientImg,
      packageList: [],
      value1: 2,
      activeName: 'first',
      initLableData: [],
      patientId: '',
      isEditSingle: false, // 编辑单个条目的标签，用来区分通过整条条目来编辑，看是否要提交。
      dlgVisible: false,
      dutyOptions: [],
      collapseTags: true,
      multiple: true,
      tableHeight: 500,
      shoudongLabelList: [],
      zidongLabelList: [],
      gestationInfoArr: ['', '孕早期', '孕中期', '孕晚期', '产后'],
      // 职业
      professionList: [],
      // 学历
      educationList: [],
      // 年收入
      incomeList: [],
      housekeeperOptions: [
        {
          label: '管家12',
          value: 1,
        },
        {
          label: '管家22',
          value: 2,
        },
      ],
      labelOptions: [
        {
          label: '标签1',
          value: 1,
        },
        {
          label: '标签2',
          value: 2,
        },
      ],
      sortOptions: [
        {
          label: '创建时间',
          value: 1,
        },
        {
          label: '更新时间',
          value: 2,
        },
      ],
      statusOptions: [
        {
          label: '孕早期',
          value: 1,
        },
        {
          label: '孕中期',
          value: 2,
        },
        {
          label: '孕晚期',
          value: 3,
        },
        {
          label: '其他',
          value: 4,
        },
      ],
      proStatus: [
        {
          label: '未生产',
          value: 0,
        },
        {
          label: '已生产',
          value: 1,
        },
      ],
      degreeStatus: [
        {
          label: '1星',
          value: 1,
        },
        {
          label: '2星',
          value: 2,
        },
        {
          label: '3星',
          value: 3,
        },
        {
          label: '4星',
          value: 4,
        },
        {
          label: '5星',
          value: 5,
        },
      ],
      // 胎次
      parityOptions: [
        {
          itemName: '头胎',
          itemCode: 1,
        },
        {
          itemName: '二胎',
          itemCode: 2,
        },
        {
          itemName: '三胎',
          itemCode: 3,
        },
        {
          itemName: '四胎',
          itemCode: 4,
        },
        {
          itemName: '四胎以上',
          itemCode: 5,
        },
      ],
      isEdit: false,
      isAdd: true,
      detailInfo: {},
      detailInfoMore: {
        parity: '',
      },
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true, // 列表加载中
      detailVisible: false, // 是否显示详情弹框
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime', // 排序字段
      },
      showReviewer: false,
      pvData: [],
      departmentOptions: [
        {
          label: '新生儿科',
          key: 0,
        },
        {
          label: '儿科',
          key: 1,
        },
        {
          label: '重症医学科',
          key: 2,
        },
        {
          label: '产科',
          key: 3,
        },
      ],
      positionOptions: [
        {
          label: '医生',
          key: 1,
        },
        {
          label: '护士',
          key: 2,
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 36,
            message: '长度在 3 到 36 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
          //   { validator: validatePassword, trigger: 'blur' },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          },
          {
            validator: validatePhone,
            trigger: 'blur',
          },
        ],
      },
      sensitiveInfoVisible: false, //敏感信息弹框显示
      sensitiveInfoInitUrl: '/cloud-baseinfo/patient/get',
      sensitiveInfoInit: {
        //敏感信息弹框初始化
        title: '修改手机号',
      },
      downloadLoading: false,
    }
  },
  computed: {
    ...mapState({
      duty: (state) => state.user.duty,
    }),
    disabled() {
      return this.total === 0
    },
    optionWidth() {
      if (this.duty === '4') {
        return '260px'
      }
      return '210px'
    },
  },
  watch: {
    activeName(val) {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime',
      }
      val === 'first'
        ? (this.listQuery.changed = 1)
        : (this.listQuery.changed = 0)
      this.getList()
    },
  },
  created() {
    // 获取管家的数据
    // this.housekeeperOptions
    this.activeName = this.$route.query?.active || 'first'
    this.activeName === 'first'
      ? (this.listQuery.changed = 1)
      : (this.listQuery.changed = 0)
    this.getList(false)
    this.initData()
    this.getLabelData()
    // this.activeName = window.sessionStorage.getItem('activeName')||'first'
  },
  mounted() {
    window.onresize = () => {
      this.countHeight()
    }
    this.$nextTick(() => {
      this.countHeight()
      // this.tableHeight = this.$computeHeight(450)
    })
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    isShow(row) {
      this.$router.push({
        path: '/showbox',
        query: {
          id: row.id,
        },
      })
    },
    translate(val, listOptions) {
      let result = ''
      listOptions.forEach((item) => {
        if (item.itemCode == val) {
          result = item.itemName
        }
      })
      return result
    },
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight
      const num = 292 + h
      this.tableHeight = this.$computeHeight(num)
    },
    handleReset() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime',
      }
      this.getList()
    },
    handleClick(tab, event) {
      let newQuery = JSON.parse(JSON.stringify(this.$route.query))
      delete newQuery.active
      this.$router.replace({ query: newQuery })
      this.activeName = tab.name
      // window.sessionStorage.setItem('activeName',tab.name)
      this.$nextTick(() => {
        this.$refs['table'].doLayout() // table的ref为table
      })
    },
    updateLabelList(labellist) {
      // 获取到标签列表
      const tagIds = []
      this.dlgVisible = false
      labellist.forEach((item) => {
        tagIds.push(item.id)
      })
      labelUpdateOnly({
        patientId: this.patientId,
        tagIds: tagIds,
        tagType: 1,
      })
        .then((res) => {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          // 更新后重新获取列表
          this.getList()
        })
        .catch((err) => {})
    },
    getLabelData() {
      labelQuery({
        pageNo: 1,
        pageSize: 300,
      }).then((res) => {
        this.labelOptions = res.data.rows || []
        res.data.rows.map((item) => {
          item.label = item.labelName
          item.value = item.id
        })
      })
    },
    messaging() {
      this.$router.push({
        path: 'news',
      })
    },
    closeDlg() {
      this.dlgVisible = false
    },
    async initData() {
      this.dutyOptions = await this.dicDataMixins('duty') // 岗位

      let code = ''
      // 查找专属管家的id，再去根据id获取
      this.dutyOptions.forEach((item) => {
        if (item.label === '线上专属管家') {
          code = item.value
        }
      })
      queryAssigner({
        duty: code,
        pageNo: 1,
        pageSize: 1000,
      })
        .then((res) => {
          this.housekeeperOptions = []
          const vm = this
          res.data.rows.map((item) => {
            vm.housekeeperOptions.push({
              label: item.displayName,
              value: item.id,
            })
          })
        })
        .catch((error) => {})
      // 查询职业
      await getSysDictionary({
        dicType: 'profession',
      }).then((response) => {
        this.professionList = response.data
      })

      // 查询学历
      await getSysDictionary({
        dicType: 'education',
      }).then((response) => {
        this.educationList = response.data
      })
      // 查询年收入
      await getSysDictionary({
        dicType: 'income',
      }).then((response) => {
        this.incomeList = response.data
      })
    },
    showBirthInfo(obj) {
      if (!obj) {
        return ''
      } else {
        if (obj.bornChildStatus === 0) {
          return '未生产'
        }
        if (obj.bornChildDays === 0) {
          return '已生产(产后1天)'
        }
        return '已生产' + '(' + '产后' + obj.bornChildDays + '天)'
      }
    },
    showGestationInfo(gestationInfo) {
      if (!gestationInfo) {
        return '其他'
      } else {
        if (gestationInfo.status === 4) {
          return '其他'
        }

        if (gestationInfo && gestationInfo.weekDays === 0) {
          return (
            this.gestationInfoArr[gestationInfo.status] +
            '(' +
            gestationInfo.totalWeeks +
            '周' +
            ')'
          )
        } else {
          return (
            this.gestationInfoArr[gestationInfo.status] +
            '(' +
            gestationInfo.totalWeeks +
            '周+' +
            gestationInfo.weekDays +
            ')'
          )
        }
      }
    },
    showLabelList(labelList, showAll = false) {
      if (labelList) {
        const length = labelList.length

        let retString = ''
        if (!showAll) {
          for (let i = 0; i < length && i < 3; i++) {
            retString +=
              "<span class='label-item'>" + labelList[i].labelName + '</span>'
          }
          if (length > 3) {
            retString +=
              "<span class='label-num'>" + '+' + (length - 3) + '</span>'
          }
        } else {
          for (let i = 0; i < length; i++) {
            retString +=
              "<div class='label-item'>" + labelList[i].labelName + '</div>'
          }
        }

        // retString += '<button class="pa-btn el-button--primary-text" type="primary" size="mini" @click="viewItemLabel(row)">编辑</button>'
        return retString
      } else {
        return ''
      }
    },
    // 分页器方法
    sizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    viewItemLabel(item) {
      if (!item.labelList) {
        this.initLableData = []
      } else {
        this.initLableData = deepClone(item.labelList)
      }

      this.isEditSingle = true
      this.patientId = item.id
      this.dlgVisible = true
    },
    viewItem(item) {
      //  根据个人ID 查询扩展信息包含标签信息
      getNewPatientById(item.id).then((response) => {
        this.detailInfoMore = response.data
        this.shoudongLabelList = []
        this.zidongLabelList = []
        this.detailInfoMore.labelList.forEach((item, index) => {
          if (item.tagType === 0) {
            this.shoudongLabelList.push(item)
          }
          if (item.tagType === 1) {
            this.zidongLabelList.push(item)
          }
        })
      })
      this.isEdit = false
      this.detailInfo = deepClone(item)
      const data = {
        userId: this.detailInfo.userId,
        pageNo: 1,
        pageSize: 50,
        payStatus: 0, // 0是全部， 1是已支付
        productType: 1,
      }
      // listByUserId(data).then(res => {
      //   if (res.code === 200) {
      //     this.packageList = res.data.rows
      //   }
      // })
      getOrderList(data).then((res) => {
        this.packageList = (res.data.rows || []).map((item) => {
          item = {
            ...item,
            orderPackage: JSON.parse(item.order.orderPackage),
          }
          return item
        })
      })
      this.detailVisible = true
    },
    editItem(item) {
      // 暂存localstorage
      localStorage.setItem('patient_info', JSON.stringify(item))
      this.$router.push({
        path: '/edit',
        query: {
          active: this.activeName,
        },
      })
    },
    deleteItem(item) {
      const data = {
        id: item.id,
      }
      deleteEmployee(data).then((response) => {
        // 重新请求表格数据
        this.getList()
      })
    },
    async follow(row) {
      // debugger
      const userData = this.$local.get('userData')
      const params = {
        imKeeperId: userData.imUserId,
        patientId: row.id,
      }
      const result = await this.$requestPost(
        `/cloud-im/chatSession/beginForKeeper`,
        params
      )
      if (result && result.code === 200) {
        this.linkConversation(result.data, row.id, row.userId)
      } else if (result && result.code === 5011) {
        this.$message.error('用户未发起咨询，无法发起会话')
      } else if (result && result.code === 5007) {
        this.$message.error('已有管家正在进行对话，请等候')
      }
    },
    linkConversation(conversationId, id, userId) {
      this.$store.state.selectedConversation.selectedConversationId =
        conversationId
      this.$router.push({
        path: '/im/index',
      })
    },
    submitForm() {
      delete this.detailInfo.department
      if (this.isAdd) {
        addEmployee(this.detailInfo).then((response) => {
          // 重新请求表格数据
          this.detailVisible = false
          this.getList()
        })
      } else {
        updateEmployee(this.detailInfo).then((response) => {
          this.detailVisible = false
          // 重新请求表格数据
          this.getList()
        })
      }
    },
    cancleAdd() {
      this.detailVisible = false
    },
    handleAdd() {
      this.detailInfo = {}
      this.isAdd = true
      this.detailVisible = true
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value)
      let label = ''
      arr.forEach((element) => {
        if (element.key === value) {
          label = element.label
        }
      })
      return label
    },

    // 获取订单列表
    getList(search = true) {
      this.listLoading = true
      let data = {}

      if (search) {
        // 带查询条件
        data = this.listQuery
      } else {
        // 查询表格数据不带查询条件
        data = {
          sortField: this.listQuery.sortField,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        }
      }
      if (this.activeName === 'first') {
        data.changed = 1
      } else {
        data.changed = 0
      }
      patientQuery(data).then((response) => {
        this.list = response.data.rows || []
        // list.forEach((item)=>{
        //   item.labelList = item.labelList.reduce((cur, prev) => {

        //   })
        // })

        this.total = response.data.total
        this.listLoading = false
      })
    },

    // 查看/详情
    onDetail(row) {
      this.detailVisible = true
      this.detailInfo = row || {}
    },
    getNowFormatDate(Date) {
      var Y = Date.getFullYear()
      var M = Date.getMonth() + 1
      M = M < 10 ? '0' + M : M // 不够两位补充0
      var D = Date.getDate()
      D = D < 10 ? '0' + D : D
      var H = Date.getHours()
      H = H < 10 ? '0' + H : H
      var Mi = Date.getMinutes()
      Mi = Mi < 10 ? '0' + Mi : Mi
      var S = Date.getSeconds()
      S = S < 10 ? '0' + S : S
      return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S
    },
    // 导出
    onExport() {
      // 请求api地址
      const base = process.env.VUE_APP_BASE_API
      const params = this.setParams()
      const token = getToken()

      const fileName = '患者列表-' + this.getNowFormatDate(new Date()) + '.xls'

      this.downloadExcel(
        base + '/cloud-baseinfo/patient/export',
        params,
        fileName,
        token
      )
      // location.href = `${base}/cloud-hmall/order/export${params}`
    },

    // 搜索
    handleFilter() {
      // 当搜索时间选择时，必须要输入时间
      if (this.listQuery && this.listQuery.datetime) {
        this.listQuery.startTime = this.listQuery.datetime[0] + ' 00:00:00'
        this.listQuery.endTime = this.listQuery.datetime[1] + ' 23:59:59'
      }
      this.listQuery.pageNo = 1
      this.getList()
    },
    setParams() {
      const temp = {
        pageSize: this.total,
      }
      const obj = {
        ...this.listQuery,
        ...temp,
      }
      // if(obj.labelIds && obj.labelIds.length === 0)
      return obj
    },
    // setParams() {
    //   const token = getToken()
    //   let result = ''
    //   let item
    //   const obj = Object.assign(this.listQuery, { token: token })
    //   for (item in obj) {
    //     if (obj[item] && String(obj[item])) {
    //       result += `&${item}=${obj[item]}`
    //     }
    //   }
    //   if (result) {
    //     result = '?' + result.slice(1)
    //   }
    //   return result
    // },

    // 保留两位小数
    setDecimal(value) {
      if (!value) {
        return
      }
      return value.toFixed(2)
    },
    pickerChange(data) {
      this.listQuery.startTime = data ? data[0] : ''
      this.listQuery.endTime = data ? data[1] : ''
      this.listQuery = {
        ...this.listQuery,
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.filter-boxs {
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-box .filter-item {
  margin-right: 40px;
  margin-bottom: 16px !important;
}
.keywork-input >>> .filter-input {
  width: 300px !important;
}

>>> .label-item {
  margin-right: 7px;
  background: #f2f7fc;
  border-radius: 2px;
  padding: 8px 6px;
  word-break: keep-all;
  margin-bottom: 8px;
}

>>> .label-num {
  padding: 8px 6px;
  background: #f2f7fc;
}

>>> .el-select__tags-text {
  display: inline-block;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

>>> .el-select .el-tag__close.el-icon-close {
  top: -7px;
  position: relative;
}

.info-cnt {
  display: flex;
  align-items: center;
}

.name {
  margin-right: 8px;
}

.label-list-cnt {
  display: inline-block;
}

.img-box {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  overflow: hidden;
  display: inline-block;
  align-items: center;
  margin-right: 8px;
}

.img-box .img-type {
  max-width: 32px;
  max-height: 32px;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
}

.detail-item .title {
  flex-shrink: 0;
  width: 70px;
  padding-right: 10px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
}
.patient-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.detail-item .text {
  color: #333;
  display: flex;
  flex-wrap: wrap;
  word-break: break-all;
}
.detail-item .product img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}

.detail-container {
  font-size: 14px;
  overflow-y: scroll;
  padding: 24px;
  .detail-sub-title {
    margin-bottom: 16px;
    //border-left: 2px solid #0066CC;
    //padding-left: 8px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
  }
}

.export-btn {
  margin-left: 0;
}

.empty img {
  width: 98px;
  height: 64px;
}

.el-tabs__header {
  margin: 0;
  background-color: #fff;
}

.app-container {
  background-color: #fff;
}

.el-tabs {
  padding-left: 24px;
}

.service {
  display: flex;
  padding: 8px 11px 5px 16px;
  box-sizing: border-box;
  margin-bottom: 30px;
  width: 360px;
  height: 86px;
  opacity: 1;
  border: 1px solid #ebebeb;
  border-radius: 4px;
}

.service-left {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 13px;
}

.service-left .el-image {
  width: 54px;
  height: 54px;
  border-radius: 50%;
}

.service-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-right div:nth-child(1) {
  font-size: 16px;
  font-weight: 700;
  color: #3e3232;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  // font-family: PingFangSC, PingFangSC-Regular;
}

.service-right div:nth-child(2) {
  font-size: 14px;
  color: #633c3c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 266px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
}

.service-right :nth-child(3) {
  font-size: 16px;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  color: #ef4f3c;
}

::v-deep.el-tabs {
  padding-left: 24px;
  .el-tabs__header {
    margin-bottom: 0px;
  }
}
.el-tabs ::v-deep .el-tabs__item {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
::v-deep.patient-label {
  .label-item {
    width: 72px;
    height: 32px;
    background: #f2f7fc;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
  }
}
.filter-container {
  border-bottom: 1px solid #ebebeb;
}
.phone-icons {
  margin-left: 5px;
  cursor: pointer;
}
.sdColor {
  color: #b565d4;
  background: rgba(223, 199, 232, 0.2);
  min-width: 72px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 2px;
  border: none;
  display: inline-block;
  overflow: hidden;
  margin: 4px;
  font-weight: bold;
}
.zdColor {
  color: #f177a2;
  background: rgba(250, 210, 224, 0.2);
  min-width: 72px;
  height: 32px;
  border: none;
  line-height: 32px;
  text-align: center;
  border-radius: 2px;
  display: inline-block;
  overflow: hidden;
  margin: 4px;
  font-weight: bold;
}
</style>
