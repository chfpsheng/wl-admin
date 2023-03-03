<template>
  <div class="pa-im-box-container">
    <div class="pa-item pa-space-between" style="margin-bottom: 12px">
      <div class="left-item">
        <span class="title">患者信息</span>
        <i
          class="iconfont icon-xiugaiiconbeifen1 edit-icon"
          @click="editItem"
        />
      </div>
      <div class="right-item" style="margin-right: 10px">
        <span class="tip-text">意向度</span>
        <el-rate
          v-model="userData.intention"
          :colors="['#EF4F3C', '#EF4F3C', '#EF4F3C']"
          :iconClasses="[
            'iconfont icon-icon-Star',
            'iconfont icon-icon-Star',
            'iconfont icon-icon-Star',
          ]"
          void-icon-class="iconfont icon-icon-Star-Unchecked"
          @click.native="rateClick(userData.intention)"
        />
      </div>
    </div>
    <div class="pa-item pa-flex-column pa---item---box">
      <form-item label="患者姓名" :value="userData.name" />
      <form-item label="年龄" :value="userData.age" />
      <form-item label="怀孕状态" :value="userData.status" />
      <form-item
        label="预产期"
        :value="userData.expectedDate ? userData.expectedDate.slice(0, 10) : ''"
      />
      <form-item
        label="生产状态"
        :value="showBirthInfo(userData)"
      />
      <form-item label="专属管家" :value="userData.assignKeeperName" />
      <div class="pa-special-form-item">
        <div class="pa-special-item-label">患者备注:</div>
        <div class="pa-special-item-value">
          <el-input
            id="desInput"
            v-show="remarksShow"
            type="textarea"
            :rows="3"
            placeholder="输入患者备注"
            maxlength="200"
            show-word-limit
            class="pa-input pa---input"
            v-model="userData.description"
            @change="desChange"
            @blur="desBlur"
          >
          </el-input>
          <div
            v-show="!isOmit && !remarksShow"
            ref="omitLabel"
            class="pa-omit2---box"
          >
            {{ userData.description }}
            <i
              class="iconfont icon-xiugaiiconbeifen1 edit-icon"
              @click.stop="remarksShow = true"
            />
          </div>
          <el-tooltip
            v-if="isOmit && !remarksShow"
            class="pa-tooltip"
            effect="dark"
            :content="userData.description"
            placement="top"
          >
            <div style="width: 100%">
              <div class="pa-omit2">
                {{ userData.description }}
              </div>
              <i
                class="iconfont icon-xiugaiiconbeifen1 edit-icon"
                @click.stop="remarksShow = true"
              />
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="content" style="margin-top: 16px">
      <div class="base-info">
        <div
          class="pa-item flex"
          style="margin: 24px 0 16px 0; line-height: 20px"
        >
          <span class="left-item">患者标签</span>
          <i
            class="iconfont icon-xiugaiiconbeifen1 edit-icon"
            @click="viewItemLabel()"
          />
        </div>
        <div class="box-mr">
          <el-form>
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
    <div class="pa-item" style="margin: 24px 0 16px 0">
      <div class="left-item">订单信息</div>
    </div>
    <div class="pa-item pa-list-item" style="padding-right: 16px">
      <list-item
        v-for="(item, index) in orderListData"
        :key="index"
        :item-data="item"
        @click.native="showOrderList(item)"
      />
      <div
        class="pa--empty-box"
        v-if="!orderListData || orderListData.length === 0"
      >
        <div>
          <img class="pa--empty-image" src="@/assets/image/no-task.png" />
        </div>
        <div class="tips">暂无订单</div>
      </div>
    </div>
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
import FormItem from './components/FormItem'
import ListItem from './components/ListItem'
import LabelSelect from '@/components/LabelSelect'
import { mapState } from 'vuex'
import SensitiveInfoShow from '@/components/SensitiveInfo/sensitive-info-show.vue'
import { getNewPatientById } from '@/api/patient'
export default {
  name: 'UserData',
  components: {
    FormItem,
    ListItem,
    LabelSelect,
    SensitiveInfoShow,
  },
  data() {
    return {
      starValue: 5,
      userData: {},
      isOmit: false,
      editData: null,
      isEditSingle: false, // 编辑单个条目的标签，用来区分通过整条条目来编辑，看是否要提交。
      patientId: '',
      dlgVisible: false,
      orderListData: [],
      starClick: 0,
      firstLoading: true,
      gestationInfoArr: ['', '孕早期', '孕中期', '孕晚期', '产后'],
      id: '',
      sensitiveInfoInitUrl: '/cloud-baseinfo/patient/get', //敏感信息弹框显示
      remarksShow: false,
      shoudongLabelList: [], // 手动标签
      zidongLabelList: [], // 自动标签
    }
  },
  created() {},
  computed: {
    ...mapState({
      userId: (state) => state.user.imUserId, // 登陆者的im ID
      defaultPatient: (state) => state.defaultPatient.patient,
    }),
  },
  watch: {
    defaultPatient: {
      handler(val) {
        if (val && val.id) {
          this.initDefaultData(val)
        }
      },
      deep: true,
      immediate: true,
    },
    'userData.intention': {
      handler(val) {
        setTimeout(() => {
          this.rateChange(val)
        }, 300)
      },
      deep: true,
      immediate: true,
    },
    remarksShow: {
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            const domObj = document.getElementById('desInput')
            domObj.focus()
            // domObj.setSelectionRange(0, 0)
            // domObj.scrollTop = 0
          }
        })
      },
    },
  },
  mounted() {
    // 监听获取患者id
    /* this.$bus.$on('patient', (val) => {
      this.initDefaultData(val)
    }) */
  },
  destroyed() {
    // this.$bus.$off('patient')
  },
  methods: {
    getHiddenPhone(val) {
      let _phone = ''
      if (!val) return _phone
      _phone =
        val.substring(0, 3) +
        '******' +
        val.substring(val.length - 2, val.length)
      return _phone
    },
    // 初始化默认数据
    initDefaultData(val) {
      // 查询一次
      const id = val.id
      const userId = val.userId
      this.initData(id)
      this.getOrderList(userId)
    },
    // // 根据生产状态匹配对应中文
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
    showOrderList(item) {
      this.$emit('showOrderList', item)
    },
    async rateChange(val) {
      if (this.firstLoading) {
        return
      }
      const params = {
        id: this.userData.id,
        intention: val,
      }
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/updateIntention`,
        params
      )
      if (result && result.code === 200) {
        this.editData.intention = this.userData.intention
        this.$message.success('意向度修改成功')
      } else {
        this.userData.intention = this.editData.intention
      }
    },
    async initData(id) {
      this.id = id
      let baseId = window.btoa(id)
      this.firstLoading = true
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`,
        {}
      )
      if (result && result.code === 200) {
        this.editData = this.$lodash.cloneDeep(result.data)
        let status = this.showGestationInfo(result.data.gestationInfo)
        let tabsList = []
        let tabs = []
        if (result.data.labelList && result.data.labelList.length > 0) {
          tabs = result.data.labelList.map((item) => {
            item = item.labelTypeId
            return item
          })
          tabs = [...new Set(tabs)]
          tabsList = tabs.map((item) => {
            item = {
              labelTypeId: item,
              labelTypeName: result.data.labelList.find(
                (i) => i.labelTypeId === item
              ).labelTypeName,
              children: result.data.labelList.filter(
                (i) => i.labelTypeId === item
              ),
            }
            return item
          })
        } else {
          tabsList = []
        }

        // debugger
        this.userData = {
          ...result.data,
          status: status,
          sex:
            result.data.sex === 1
              ? '男'
              : result.data.sex === 2
              ? '女'
              : '未知',
          bornChildDate: result.data.bornChildDate
            ? result.data.bornChildDate.replace(/00:00:00/g, '')
            : '',
          tabsList,
          name: this.$decryptBase64(result.data.name)
        }
        localStorage.setItem('im-patient-info', JSON.stringify(this.userData))
        this.remarksShow = false
        this.isOmit = false
        this.$nextTick(() => {
          this.inspectOmit()
        })
      }
      //  根据个人ID 查询扩展信息包含标签信息
      getNewPatientById(id).then((response) => {
        let detailInfo = response.data
        this.shoudongLabelList = []
        this.zidongLabelList = []
        detailInfo.labelList.forEach((item, index) => {
          if (item.tagType === 0) {
            this.shoudongLabelList.push(item)
          }
          if (item.tagType === 1) {
            this.zidongLabelList.push(item)
          }
        })
      })
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
    inspectOmit() {
      const box = this.$refs.omitLabel
      if (box && box.scrollHeight && box.clientHeight) {
        this.isOmit = box.scrollHeight > box.clientHeight
      }
    },
    editItem() {
      this.$local.get('patient_info') ? this.$local.remove('patient_info') : '',
        this.$local.set('patient_info', this.editData)
      this.$bus.$emit('patient_edit', true)
      // this.$router.push({
      //   path: '/edit'
      // })
    },
    viewItemLabel() {
      const item = this.editData
      if (!item.labelList) {
        this.initLableData = []
      } else {
        this.initLableData = this.$lodash.cloneDeep(item.labelList)
      }
      this.isEditSingle = true
      this.patientId = item.id
      this.dlgVisible = true
    },
    closeDlg() {
      this.dlgVisible = false
    },
    async updateLabelList(labellist) {
      // 获取到标签列表
      this.dlgVisible = false
      const params = {
        patientId: this.userData.id,
        tagType: 1,
        tagIds: labellist.map((item) => {
          item = item.id
          return item
        }),
      }
      const result = await this.$requestPost(
        `/cloud-baseinfo/patientTag/save`,
        params
      )
      if (result && result.code === 200) {
        this.$message.success('患者标签编辑成功')
        this.userData.labelList = []
        this.userData.labelIds = []
        labellist.forEach((item) => {
          this.userData.labelList.push(item)
          this.userData.labelIds.push(item.id)
        })
        this.initData(this.id)
      }
    },
    async getOrderList(userId) {
      // const userId = 61
      const params = {
        pageNo: 1,
        pageSize: 50,
        payStatus: 0,
        userId,
        productType: 1,
      }
      const result = await this.$requestPost(
        `/cloud-hmall/order/queryByUserId`,
        params
      )
      if (result && result.code === 200) {
        this.orderListData = (result.data.rows || []).map((item) => {
          item = {
            ...item,
            orderPackage: JSON.parse(item.order.orderPackage),
          }
          return item
        })
      }
    },
    rateClick(val) {
      this.firstLoading = false

      if (this.userData.intention === 1) {
        this.starClick++
        this.starClick % 2 === 0 ? (this.userData.intention = 0) : ''
      } else {
        this.starClick = 0
      }
    },
    // 备注修改
    desBlur() {
      this.remarksShow = false
    },
    async desChange() {
      const params = {
        id: this.userData.id,
        fieldName: 'description',
        fieldValue: this.userData.description,
      }
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/updateField`,
        params
      )

      if (result && result.code === 200) {
        this.$message.success('患者备注修改成功')
        this.editData.description = this.userData.description
        this.isOmit = false
        this.$nextTick(() => {
          this.inspectOmit()
        })
      } else {
        this.userData.description = this.editData.description
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.pa-el-tag {
  margin: 0 8px 8px 0;
}
.left-item .title {
  font-size: 14px;
}
.pa-flex-column * {
  font-size: 14px;
}
.edit-icon {
  color: #06c;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}
.tip-text {
  font-size: 12px;
  color: #999;
  margin-right: 4px;
}
.right-item {
  align-items: center;
}
.pa-list-item {
  display: flex;
  flex-direction: column;
}
::v-deep .mobile-container {
  display: flex;
  align-items: center;
  .pa-special-form-item {
    width: auto;
  }
}
::v-deep.pa-item.pa-flex-column.pa---item---box {
  .pa-special-item-label {
    text-align: left;
  }
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
