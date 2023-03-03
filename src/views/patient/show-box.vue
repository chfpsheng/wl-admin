<template>
  <div class="show-box">
    <el-header
      style="background: #fff; border-bottom: 1px solid #ebebeb; padding: 0"
    >
      <div class="box-mr header">
        <span style="padding-left: 8px">用户画像</span>
      </div>
    </el-header>
    <el-container>
      <el-aside style="width: 70%; height: 753px" class="content">
        <user-chart
          :labelList="detailInfo.labelList"
          :gestationInfo="detailInfo.gestationInfo"
        ></user-chart>
      </el-aside>
      <el-main style="padding: 0; height: 753px; background: #fff">
        <div class="flex flex-just main-body">
          <div class="content baseInput">
            <div class="base-info">
              <div class="flex flex-between header box-mr">
                <span class="title"
                  ><i
                    class="icon iconfont icon-jibenxinxiicon mr-8"
                    style="color: #0066cc"
                  ></i
                  >基本信息</span
                >
                <span
                  class="icon iconfont icon-s_xiugai"
                  style="color: rgba(0, 102, 204, 1); cursor: pointer"
                  title="编辑"
                  @click="openInput()"
                ></span>
              </div>
              <el-form
                class="box-mr box-main"
                style="max-height: 390px; overflow: scroll"
              >
                <el-form-item label="患者姓名:">
                  <div class="flex flex-between">
                    <div>
                      <span class="cont-txt">{{ detailInfo.name }}</span>
                      <i
                        class="icon iconfont ml-8"
                        :class="
                          detailInfo.sex === 1
                            ? 'icon-s_male manColor'
                            : 'icon-s_female wumanColor'
                        "
                      ></i>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="意向度:">
                  <div>
                    <span class="tip-text">
                      <el-rate
                        v-model="detailInfo.intention"
                        :colors="['#EF4F3C', '#EF4F3C', '#EF4F3C']"
                        @click.native="rateClick(detailInfo.intention)"
                      />
                    </span>
                  </div>
                </el-form-item>
                <el-form-item label="年龄:">
                  <span class="cont-txt"
                    >{{
                      detailInfo.birthDate
                        ? computedAge(detailInfo.birthDate)
                        : ''
                    }}
                    <span style="margin: 0 4px"></span>
                    {{
                      detailInfo.birthDate
                        ? '(' +
                          moment(detailInfo.birthDate).format('YYYY-MM-DD') +
                          ')'
                        : ''
                    }}
                  </span>
                </el-form-item>
                <!-- <el-form-item label="性别:">
                  <span class="cont-txt">{{
                    translateSex(detailInfo.sex)
                  }}</span>
                </el-form-item> -->
                <!-- <el-form-item label="身份证号:">
                  <div class="text">
                    <template v-if="detailInfo.idCard">
                      {{ translateIdCard(detailInfo.idCard) }}
                      <SensitiveInfoShow
                        :id="detailInfo.id"
                        type="身份证号"
                        :url="sensitiveInfoInitUrl"
                      />
                    </template>
                  </div>
                </el-form-item> -->

                <el-form-item label="怀孕状态:">
                  <span class="cont-txt"
                    >{{
                      detailInfo.gestationInfo
                        ? showGestationInfo(detailInfo.gestationInfo)
                        : '其他'
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="预产期:">
                  <span class="cont-txt">
                    {{
                      detailInfo.expectedDate
                        ? moment(detailInfo.expectedDate).format('YYYY-MM-DD')
                        : ''
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="生产状态:">
                  <span class="cont-txt">{{
                    showBirthInfo(detailInfo)
                  }}</span>
                </el-form-item>
                <!-- <el-form-item label="生产日期:">
                  <span class="cont-txt"
                    >{{
                      detailInfo.bornChildDate
                        ? moment(detailInfo.bornChildDate).format('YYYY-MM-DD')
                        : ''
                    }}
                  </span>
                </el-form-item> -->
                <!-- <el-form-item label="联系方式:">
                  <div class="text">
                    <template v-if="detailInfo.mobile">
                      <span class="cont-txt">{{
                        translatePhone(detailInfo.mobile)
                      }}</span>
                      <SensitiveInfoShow
                        :id="detailInfo.id"
                        type="手机号"
                        :url="sensitiveInfoInitUrl"
                      />
                    </template>
                  </div>
                </el-form-item> -->
                <el-form-item label="专属管家:">
                  <span class="cont-txt">{{
                    translate(detailInfo.assignKeeper)
                  }}</span>
                </el-form-item>
                <!-- TODO：暂时不做这个功能 -->
                <!-- <el-form-item label="服务机构">
                  <span class="cont-txt">{{
                    translateHos(detailInfo.hospitalCode)
                  }}</span>
                </el-form-item> -->
                <!-- <el-form-item label="居住地址:">
                  <span class="cont-txt">{{ detailInfo.address }}</span>
                </el-form-item> -->
                <el-form-item label="患者备注:">
                  <span class="cont-txt">{{ detailInfo.description }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content" style="margin-top: 16px">
            <div class="base-info">
              <div class="flex flex-between header box-mr">
                <span class="title"
                  ><i
                    class="icon iconfont icon-biaoqianicon mr-8"
                    style="color: #0066cc"
                  ></i
                  >患者标签</span
                >
                <span
                  class="icon iconfont icon-s_xiugai"
                  style="color: rgba(0, 102, 204, 1); cursor: pointer"
                  title="编辑"
                  @click="openSelect()"
                ></span>
              </div>
              <div class="box-mr">
                <el-form>
                  <el-form-item>
                    <div>手动标签</div>
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
                    <div>自动标签</div>
                    <el-row
                      style="
                        max-height: 85px;
                        overflow: scroll;
                        min-height: 40px;
                      "
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
        </div>
      </el-main>
    </el-container>
    <div class="footer content">
      <!-- <div class="footer-header flex">
        <div class="box-mr header">同标签的用户最近一年的行为画像</div>
        <div>
          <el-checkbox-group v-model="labelCode">
            <el-checkbox-button
              v-for="item in labelListData"
              :label="name"
              :key="item.code"
              >{{ item.value }}</el-checkbox-button
            >
            <span>全选</span>
          </el-checkbox-group>
        </div>
      </div> -->
    </div>
    <label-select
      v-if="isOpenSelect"
      :dlg-visible="isOpenSelect"
      :init-data="initLableData"
      @closeDlg="closeDlg"
      @updateLabelList="updateLabelList"
    />
    <el-drawer
      :visible.sync="isOpenBaseinfo"
      direction="rtl"
      :wrapperClosable="false"
      title="用户信息"
      size="400px"
      class="draw-box"
    >
      <base-input
        v-if="isOpenBaseinfo"
        :detailInfo="detailInfo"
        @isCancel="isCancel"
        @updateLabelList="updateLabelList"
      />
    </el-drawer>
  </div>
</template>
<script>
import {
  getNewPatientById,
  labelUpdateOnly,
  queryAssigner,
  getSysDictionary,
} from '@/api/patient'
import LabelSelect from '@/components/LabelSelect'
import BaseInput from '@/components/BaseInput'
import baseDataMixin from '@/mixins/baseData'
import SensitiveInfoShow from '@/components/SensitiveInfo/sensitive-info-show.vue'
import userChart from './user-chart.vue'
export default {
  name: 'showBox',
  components: {
    LabelSelect,
    BaseInput,
    userChart,
    SensitiveInfoShow,
  },
  mixins: [baseDataMixin],
  data() {
    return {
      listId: 0,
      starClick: 0,
      showChart: false,
      detailInfo: {
        gestationInfo: {},
        labellist: [],
      }, // 数据源
      hostList: [], // 医院列表
      firstLoading: true,
      gestationInfoArr: ['', '孕早期', '孕中期', '孕晚期', '产后'],
      initLableData: [], // 所有标签的集合
      isOpenSelect: false, // 标签抽屉
      isOpenBaseinfo: false, // 基本信息抽屉
      labelCode: '', // 选中的标签ID
      shoudongLabelList: [],
      zidongLabelList: [],
      labelListData: [],
      housekeeperOptions: [],
    }
  },
  watch: {
    listId: {
      handler(orderID) {
        if (orderID) {
          this.initData(orderID)
        }
      },
      immediate: true,
    },
    'detailInfo.intention': {
      handler(val) {
        setTimeout(() => {
          this.rateChange(val)
        }, 300)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 根据出生日期计算年龄
    computedAge(birthDate) {
      let m1 = this.moment(birthDate)
      let m2 = this.moment()
      return m2.diff(m1, 'year')
    },
    // 根据code匹配管家汉语
    translate(val) {
      let result = ''
      this.housekeeperOptions.forEach((item, index) => {
        if (val == item.id) {
          result = item.label
        }
      })
      return result
    },
    // 根据code匹配医院
    translateHos(val) {
      let result = ''
      this.hostList.forEach((item) => {
        if (item.itemCode == val) {
          result = item.itemName
        }
      })
      return result
    },
    // 请求医院字典
    searchHosipital() {
      getSysDictionary({
        dicType: 'hospital_code',
      }).then((response) => {
        this.hostList = response?.data
      })
    },
    // 根据code匹配性别
    translateSex(val) {
      let result = ''
      if (val == 1) {
        result = '男'
      }
      if (val == 2) {
        result = '女'
      }
      if (val !== 1 && val !== 2) {
        result = '其他'
      }
      return result
    },
    // 根据生产状态匹配对应中文
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
    // 讲手机号转成匿名的
    translatePhone(val) {
      let result = ''
      result = val.substring(0, 3) + '******' + val.substring(9, 11)
      return result
    },
    // 身份证号匿名化
    translateIdCard(val) {
      let result = ''
      if (val.length === 18) {
        result = val.substring(0, 4) + '******' + val.substring(15, 18)
      }
      if (val.length === 15) {
        result = val.substring(0, 4) + '******' + val.substring(12, 15)
      }
      return result
    },
    async rateChange(val) {
      if (this.firstLoading) {
        return
      }
      const params = {
        id: this.detailInfo.id,
        intention: val,
      }
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/updateIntention`,
        params
      )
      if (result && result.code === 200) {
        this.$message.success('意向度修改成功')
      } else {
        this.$message.error('意向度修改失败')
      }
    },
    computedStatus(val) {
      let result = ''
      if (val) {
        if (val == 1) {
          result = '孕早期'
        }
        if (val == 2) {
          result = '孕中期'
        }
        if (val == 3) {
          result = '孕晚期'
        }
      }
    },
    // 调星星
    rateClick(val) {
      this.firstLoading = false
      if (this.detailInfo.intention === 1) {
        this.starClick++
        this.starClick % 2 === 0 ? (this.detailInfo.intention = 0) : ''
      } else {
        this.starClick = 0
      }
    },
    // 查询管家
    async searchHourse() {
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
      }).then(async (res) => {
        this.labelOptions = []
        const vm = this
        res.data.rows.map((item) => {
          if (item.status === 1) {
            vm.housekeeperOptions.push({
              label: item.displayName,
              id: item.id,
            })
          }
        })
      })
    },
    // 打开编辑标签
    openSelect() {
      this.initLableData = this.$lodash.cloneDeep(this.detailInfo.labelList)
      this.isOpenBaseinfo = false
      this.isOpenSelect = true
    },
    // 点击取消关闭编辑抽屉
    isCancel(val) {
      if (val) {
        this.initData(this.$route.query.id)
      }
      this.isOpenBaseinfo = false
    },
    // 打开个人信息的编辑
    openInput() {
      this.isOpenSelect = false
      this.isOpenBaseinfo = true
    },
    // 保存编辑标签后 更新列表
    updateLabelList(labellist) {
      // 获取到标签列表
      const tagIds = []
      this.isOpenSelect = false
      labellist.forEach((item) => {
        tagIds.push(item.id)
      })
      labelUpdateOnly({
        patientId: this.listId,
        tagIds: tagIds,
        tagType: 1,
      })
        .then((res) => {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.initData(this.$route.query.id)
        })
        .finally((err) => {
          this.initData(this.$route.query.id)
        })
    },
    closeDlg() {
      this.isOpenSelect = false
    },
    initData(orderID) {
      this.showChart = false
      this.firstLoading = true
      //  根据个人ID 查询扩展信息包含标签信息
      getNewPatientById(orderID).then((response) => {
        this.detailInfo = response.data
        this.detailInfo.id = parseInt(orderID)
        this.detailInfo.name = decodeURIComponent(escape(window.atob(this.detailInfo.name)))
        this.detailInfo.mobile = decodeURIComponent(escape(window.atob(this.detailInfo.mobile)))
        this.detailInfo.idCard = decodeURIComponent(escape(window.atob(this.detailInfo.idCard)))
        this.shoudongLabelList = []
        this.zidongLabelList = []
        this.detailInfo.labelList.forEach((item, index) => {
          if (item.tagType === 0) {
            this.shoudongLabelList.push(item)
          }
          if (item.tagType === 1) {
            this.zidongLabelList.push(item)
          }
        })
        this.showChart = true
      })
      // 查询管家
      this.searchHourse()
      // 查询机构列表
      this.searchHosipital()
    },
    showGestationInfo(gestationInfo) {
      if (!gestationInfo.status) {
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
  },
  mounted() {
    this.listId = parseInt(this.$route.query.id) || 0
  },
}
</script>
<style scoped>
.base-info {
  border: 1px solid #ebebeb;
  min-width: 305px;
}
.shoudong {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  color: black;
  font-size: 12px;
}
.zidong {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  color: black;
  font-size: 12px;
}
.title {
  font-size: 16px;
  margin-right: 8px;
  color: #333333;
}
.icon-bianji {
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}
.mr-8 {
  margin-right: 8px;
}
.flex {
  display: flex;
}
.flex-between {
  justify-content: space-between;
}
.base-info .header {
  line-height: 20px;
  border-bottom: 1px solid #ebebeb;
}
.box-mr {
  padding: 12px 16px;
}
.content {
  background: #ffffff;
}
.ml-8 {
  margin-left: 8px;
}
.box-mr .el-form-item {
  margin-bottom: 0;
}
.baseInput >>> .el-form-item__content {
  line-height: 21px !important;
  padding-left: 68px;
  padding-top: 7px !important;
}
.show-box .header {
  line-height: 32px;
}
.main-body {
  margin-right: 24px;
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
.manColor {
  color: rgb(0, 102, 204);
}
.wumanColor {
  color: #f59170;
}
.base-info >>> .el-form-item__label {
  color: #999999;
  line-height: 35px;
  min-width: 68px;
  text-align: left;
}
.draw-box >>> .el-drawer .el-drawer__header > span {
  width: 64px;
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 22px;
}
.show-box >>> .el-form-item__label {
  font-weight: normal;
}
.cont-txt {
  font-weight: normal;
  color: #333333;
}
.flex-just {
  flex-direction: column;
  justify-content: center;
}
</style>
