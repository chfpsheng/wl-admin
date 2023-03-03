<template>
  <div class="app-container">
    <pa-drawer
      title="选择收件人"
      size="65%"
      :with-footer="false"
      :visible.sync="dialogForm"
      @closed="closed"
    >
      <el-tabs v-model="activeName" class="el-tabs" @tab-click="handleClick">
        <el-tab-pane label="患者列表" name="first" />
        <el-tab-pane label="未转化" name="second" />
      </el-tabs>
      <div style="padding: 0 24px">
        <el-row>
          <el-col :span="6">
            <filter-daterang-picker
              :value.sync="listQuery.datetime"
              title="选择时间"
              @change="pickerChange"
            />
          </el-col>
          <el-col :span="6">
            <filter-select
              :value.sync="listQuery.gestationStatus"
              :options="statusOptions"
              title="怀孕状态"
            />
          </el-col>
          <el-col :span="6">
            <filter-select
              :value.sync="listQuery.assignKeeper"
              :options="housekeeperOptions"
              title="专属管家"
            />
          </el-col>
          <el-col :span="6">
            <div class="filter-item">
              <span class="filter-select-title"> 患者标签 </span>
              <el-select
                v-el-select-loadmore="loadmore"
                v-model="listQuery.labelIds"
                multiple
                filterable
                remote
                :remote-method="remoteMethodSelectLabel"
                :multiple-limit="4"
                collapse-tags
                style="margin-left: 20px; width: 200px"
                class="pa-select filter-select"
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
          </el-col>
          <el-col :span="6">
            <filter-select
              :value.sync="listQuery.intention"
              :options="degreeStatus"
              title="意向度"
            />
          </el-col>
          <el-col :span="6">
            <filter-select
              :value.sync="listQuery.bornChildStatus"
              :options="proStatus"
              title="生产状态"
            />
          </el-col>
          <el-col :span="6">
            <filter-input
              class="keywork-input"
              :value.sync="listQuery.keywork"
              placeholder="患者名称"
              title="患者名称"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              v-waves
              class="filter-item pa-btn"
              type="primary"
              icon="el-icon-search"
              style="margin-left: 50px"
              @click="handleFilter"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              v-waves
              class="filter-item pa-btn"
              type="primary"
              icon="iconfont icon-zhongzhi"
              style="margin-left: 15px"
              @click="handleReset"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="filter-container filter-box filter-boxs">
        <div class="filter-wrapper">
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
          <div class="filter-item ">
            <span class="filter-select-title"> 患者标签 </span>
            <el-select
              v-model="listQuery.labelIds"
              multiple
              collapse-tags
              style="margin-left: 20px;width:200px"
              class="pa-select filter-select"
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
          <div>
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
              class="keywork-input"
              :value.sync="listQuery.keywork"
              placeholder="患者名称 | 就诊卡号"
              title="患者搜索"
            />

            <el-button
              v-waves
              class="filter-item pa-btn"
              type="primary"
              icon="el-icon-search"
              style="margin-left: 50px;"
              @click="handleFilter"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              v-waves
              class="filter-item pa-btn"
              type="primary"
              icon="iconfont icon-zhongzhi"
              style="margin-left: 15px;"
              @click="handleReset"
            >
              重置
            </el-button>
          </div>
        </div>
      </div> -->
      <div class="table-box">
        <!-- :height="tableHeight" -->
        <el-table
          ref="table"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          class="pa-table"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
          style="overflow: scroll-y"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />

          <el-table-column label="序号" type="index" width="80" />
          <!-- <el-table-column
            v-if="activeName === 'first'"
            label="就诊卡号"
            width="150px"
            prop="card"
          >
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

          <el-table-column label="手机号" min-width="160px">
            <template slot-scope="{ row }">
              <!-- <span>{{ row.mobile }}</span> -->
              <template v-if="row.mobile">
                {{ row.mobile }}
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
              </div>
              <!-- <div
                class="label-list-cnt"
                v-html="showLabelList(row.labelList)"
              /> -->
              <!--  <i
                class="iconfont icon-xiugaiiconbeifen1 icon-error iconsize"
              /> -->
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
                row.expectedDate ? row.expectedDate.slice(0, 10) : 0
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

          >
        </el-table>
        <pa-pagination
          :current-page="listQuery.pageNo"
          :page-size="listQuery.pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        />
        <div slot="footer" class="dialog-footer1">
          <div class="left">
            <el-button
              class="filter-item pa-btn"
              type="primary"
              @click="selectAll()"
              >全选当前联系人</el-button
            >
          </div>
          <div class="right">
            <el-button @click="cancel()">取 消</el-button>
            <el-button
              class="filter-item pa-btn"
              type="primary"
              @click="determine()"
              >确 定</el-button
            >
          </div>
        </div>
      </div>
    </pa-drawer>
  </div>
</template>

<script>
import {
  patientQuery,
  addEmployee,
  updateEmployee,
  queryAssigner,
  labelQuery,
  labelUpdateOnly,
  deleteEmployee,
  listByUserId,
} from '@/api/patient'
//import waves from '@/directive/waves' // waves directive
import LabelSelect from '@/components/LabelSelect'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import baseDataMixin from '@/mixins/baseData'
const { deepClone } = require('../../../utils')
import { mapState } from 'vuex'
import _ from 'lodash'
import defaultPatientImg from '@/assets/image/default-patient.png'
import SensitiveInfoShow from '@/components/SensitiveInfo/sensitive-info-show.vue'
const limitNum = 1000 // 限制好友添加个数1000
export default {
  name: 'ComplexTable',
  components: {
    LabelSelect,
    SensitiveInfoShow,
  },
  directives: {
    //waves,
    'el-select-loadmore': {
      //滚加载更多数据
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      },
    },
  },
  mixins: [baseDataMixin],
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
  },
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
      gestationInfoArr: ['', '孕早期', '孕中期', '孕晚期', '产后'],
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
      isEdit: false,
      isAdd: true,
      detailInfo: {},
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
      selectList: [],
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
      downloadLoading: false,
      labelPageNum: 0, //患者标签接口返回页数
      labelLoadNum: 3, //滚动加载次数
      sensitiveInfoInitUrl: '/cloud-baseinfo/patient/get', //敏感信息弹框显示
    }
  },
  computed: {
    disabled() {
      return this.total === 0
    },
    dialogForm: {
      get() {
        return this.dialogFormVisible
      },
      set(val) {
        // grants_改变由父组件控制
        this.$emit('dialogForm', val)
      },
    },
    ...mapState({
      selectx: (state) => state.mass.selectList,
    }),
  },
  watch: {
    activeName(val) {
      ;(this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime',
      }),
        val === 'first'
          ? (this.listQuery.changed = 1)
          : (this.listQuery.changed = 0)
      this.getList()
    },
  },
  created() {
    // 获取管家的数据
    // this.housekeeperOptions
    this.getList(false)
    this.initData()
    this.getLabelData()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(450)
    })
  },
  methods: {
    handleReset() {
      ;(this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime',
      }),
        this.getList()
    },
    handleClick(tab, event) {
      this.activeName = tab.name
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
        pageSize: 20,
      }).then((res) => {
        this.labelOptions = res.data.rows || []
        res.data.rows.map((item) => {
          item.label = item.labelName
          item.value = item.id
        })
        this.labelPageNum = Math.ceil(res.data.total / 10)
      })
    },
    selectAll() {
      /* ------代码分割----- */
      if (this.selectx && this.selectx.length) {
        if (this.selectx.length + this.total > limitNum) {
          this.$message({
            message: `收件人超过${limitNum}人，请重新选择`,
            type: 'warning',
          })
          return
        }
      }
      this.dialogForm = false
      this.$refs['table'].clearSelection()
      this.listLoading = true
      let data = {}
      data = {
        sortField: this.listQuery.sortField,
        pageNo: 1,
        //pageSize: this.total
        pageSize: limitNum,
      }
      if (this.activeName === 'first') {
        data.changed = 1
      } else {
        data.changed = 0
      }
      this.listQuery.gestationStatus
        ? (data.gestationStatus = this.listQuery.gestationStatus)
        : null
      this.listQuery.assignKeeper
        ? (data.assignKeeper = this.listQuery.assignKeeper)
        : null
      this.listQuery.bornChildStatus
        ? (data.bornChildStatus = this.listQuery.bornChildStatus)
        : null
      this.listQuery.keywork ? (data.keywork = this.listQuery.keywork) : null
      this.listQuery.labelIds ? (data.labelIds = this.listQuery.labelIds) : null
      this.listQuery.intention
        ? (data.intention = this.listQuery.intention)
        : null
      this.listQuery.datetime?.length > 0
        ? ((data.startTime = this.listQuery.datetime[0] + ' 00:00:00'),
          (data.endTime = this.listQuery.datetime[1] + ' 23:59:59'))
        : null
      patientQuery(data).then((response) => {
        this.list = response.data.rows || []
        this.listLoading = false
        let _recipienterData = this.$store.state.mass.selectList
        let _addSelectList = this.mergeRecipients(_recipienterData, this.list)
        this.$store.commit('addSelectList', _addSelectList)
        this.listQuery = {
          pageNo: 1,
          pageSize: 10,
        }
        this.getList()
      })
    },
    // 全选后和已添加的收件人合并去重然后再提交
    mergeRecipients(recipienterData, queryData) {
      const _recipienterData = recipienterData ? recipienterData : []
      const _queryData = queryData ? queryData : []
      let _union = _.unionBy(_queryData, _recipienterData, 'id')
      return _union
    },
    messaging() {},
    closeDlg() {
      this.dlgVisible = false
    },
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      this.selectList = val
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
        pageSize: limitNum,
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
    /* showLabelList(labelList, showAll = false) {
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
    }, */
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
      this.isEdit = false
      this.detailInfo = deepClone(item)
      const data = {
        userId: this.detailInfo.id,
        pageNo: 1,
        pageSize: 50,
        payStatus: 0,
      }
      listByUserId(data).then((res) => {
        if (res.code === 200) {
          this.packageList = res.data.rows
        }
      })
      this.detailVisible = true
    },
    editItem(item) {
      // 暂存localstorage
      localStorage.setItem('patient_info', JSON.stringify(item))
      this.$router.push({
        path: '/edit',
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
    follow(row) {},
    determine() {
      let select = [...this.selectList, ...this.selectx]

      if (select && select.length > limitNum) {
        this.$message({
          message: `收件人超过${limitNum}人，请重新选择`,
          type: 'warning',
        })
        return
      }
      const newobj = {}
      select = select.reduce((preVal, curVal) => {
        newobj[curVal.id] ? '' : (newobj[curVal.id] = preVal.push(curVal))
        return preVal
      }, [])
      this.$store.commit('addSelectList', select)
      this.dialogForm = false
      this.$refs['table'].clearSelection()
    },
    cancel() {
      this.dialogForm = false
      this.$refs['table'].clearSelection()
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
    closed() {
      this.dialogFormVisible = false
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
        this.list = (response.data.rows || []).map((item) => {
          item = {
            ...item,
          }
          return item
        })

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
    remoteMethodSelectLabel(query) {
      if (query !== '') {
        labelQuery({
          labelName: query,
          pageNo: 1,
          pageSize: 20,
        }).then((res) => {
          let _data = res.data.rows || []
          _data.map((item) => {
            item.label = item.labelName
            item.value = item.id
          })

          this.labelOptions = [..._data]
          this.labelPageNum = Math.ceil(res.data.total / 10)
        })
      }
    },
    loadmore() {
      if (this.labelPageNum.length > 2) {
        this.labelPageNum = this.labelPageNum - 2
      }
      if (this.labelPageNum == 0) {
        return
      }

      labelQuery({
        pageNo: this.labelLoadNum,
        pageSize: 10,
      }).then((res) => {
        this.labelLoadNum = this.labelLoadNum + 1
        this.labelPageNum = this.labelPageNum - 1

        let _data = res.data.rows || []
        _data.map((item) => {
          item.label = item.labelName
          item.value = item.id
        })
        this.labelOptions = [...this.labelOptions, ..._data]
      })
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
  margin-bottom: 16px !important;
}

.keywork-input >>> .filter-input {
  width: 200px !important;
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
  width: 120px;
  flex-shrink: 0;
}

.detail-item .text {
  color: #333;
  display: flex;
  flex-wrap: wrap;
}

.detail-sub-title {
  font-weight: bold;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
  margin-bottom: 16px;
}

.detail-item .product img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}

.detail-container {
  width: 100%;
  font-size: 14px;
  padding: 24px;
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

.filter-box .filter-item {
  /* margin-right: 34px; */
  margin-right: 0;
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

.el-tabs {
  padding-left: 24px;
}
.el-tabs ::v-deep .el-tabs__item {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.el-dialog ::v-deep .el-table {
  overflow: scroll;
}
.el-dialog ::v-deep .table-box {
  width: 100%;
  padding: 40px 24px !important;
  background: #fff;
}
/* .table-box{
  position: relative;
} */
/* .selectAll{
  position: absolute;
  bottom: 50px;
  left:30px;
  background-color:pink;
  width: 100px;
  height: 100px;
} */
.pa-pagination {
  width: 100%;
  height: 64px;
  position: absolute;
  bottom: 70px;
  left: 0px;
  z-index: 2000;
  padding: 0px 16px;
}
.table-box ::v-deep .sel-table {
  overflow: scroll-y;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow: auto !important;
}
.dialog-footer1 {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 24px;
}
.table-box {
  position: relative;
  padding-bottom: 150px;
}

::v-deep.filter-item {
  margin-bottom: 16px;
  .filter-select-title {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
  .filter-select,
  .filter-input,
  .el-date-editor {
    width: calc(100% - 85px) !important;
  }
}
</style>
