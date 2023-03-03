import request from '@/utils/request'

// 获取探视设置
export function patientQuery(data) {
  return request({
    url: '/cloud-baseinfo/patient/query',
    method: 'post',
    data: data
  })
}

// 新增探视设置
export function patientInsert(data) {
  return request({
    url: '/cloud-baseinfo/patient/insert',
    method: 'post',
    data: data
  })
}

// 获取患者服务包e
export function listByUserId(data) {
  return request({
    url: '/cloud-hmall/order/listByUserIdAdv',
    method: 'post',
    data: data
  })
}

// 获取患者服务包e
export function getOrderList(data) {
  return request({
    url: '/cloud-hmall/order/queryByUserId',
    method: 'post',
    data: data
  })
}

// 更新探视设置
export function patientUpdate(data) {
  return request({
    url: '/cloud-baseinfo/patient/update',
    method: 'post',
    data: data
  })
}

// 更新探视设置
export function patientUpdateStatus(data) {
  return request({
    url: '/cloud-baseinfo/patient/updateStatus',
    method: 'post',
    data: data
  })
}

// 标签类型查找
export function labelTypeQuery(data) {
  return request({
    url: '/cloud-baseinfo/labelType/query',
    method: 'post',
    data: data
  })
}

// 标签类型新增
export function labelTypeInsert(data) {
  return request({
    url: '/cloud-baseinfo/labelType/insert',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeUpdate(data) {
  return request({
    url: '/cloud-baseinfo/labelType/update',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeDelete(data) {
  return request({
    url: '/cloud-baseinfo/labelType/delete?id=' + data.id,
    method: 'post',
    data: data
  })
}

// 标签查询
export function labelQuery(data) {
  return request({
    url: '/cloud-baseinfo/label/query',
    method: 'post',
    data: data
  })
}
// 获取单个标签详情
export function getLabel(id) {
  return request({
    url: '/cloud-baseinfo/label/get?id=' + id,
    method: 'post',
  })
}

// 标签更新
export function labelUpdate(data) {
  return request({
    url: '/cloud-baseinfo/label/update',
    method: 'post',
    data: data
  })
}

// 标签新增
export function labelInsert(data) {
  return request({
    url: '/cloud-baseinfo/label/insert',
    method: 'post',
    data: data
  })
}

// 标签删除
export function labelDelete(data) {
  return request({
    url: '/cloud-baseinfo/label/delete?id=' + data.id,
    method: 'post',
    data: data
  })
}

export function labelUpdateOnly(data) {
  return request({
    url: '/cloud-baseinfo/patientTag/save',
    method: 'post',
    data: data
  })
}

// 查找专属管家
export function queryAssigner(data) {
  return request({
    url: '/cloud-user/sysUser/queryByCondition',
    method: 'post',
    data: data
  })
}

export function exportPatient(data) {
  return request({
    url: '/cloud-baseinfo/patient/export',
    method: 'post',
    data: data
  })
}
// 根据个人ID 查询扩展信息包含标签信息
export function getPatientById(id) {
  return request({
    url: '/cloud-baseinfo/patient/get?id=' + id,
    method: 'post'
  })
}
// new根据个人ID 查询扩展信息包含标签信息
export function getNewPatientById(id) {
  const baseId = window.btoa(id)
  return request({
    url: '/cloud-baseinfo/patient/getPatientDTO?id=' + baseId,
    method: 'post'
  })
}


export function getPatientTaskList({
  patientId,
  date
}) {
  return request({
    url: '/cloud-consult/pregnancyPatient/queryPatient?patientId=' + patientId + '&date=' + date,
    method: 'post'
  })
}
export function getPatientNextPregnancy(data) {
  return request({
    url: '/cloud-consult/pregnancyPatient/queryNextPregnancy',
    method: 'post',
    data: data
  })
}
// 查询字典 学历：education 职业：profession 年收入：income
export function getSysDictionary(data) {
  return request({
    url: '/cloud-baseinfo/sysDictionary/queryByType?dicType=' + data.dicType,
    method: 'post',
    data: data
  })
}
export function getFollowUpPlan({
  patientId,
  followUpTime
}) {
  return request({
    // url: '/cloud-consult/followUpPlan/get',
    url: '/cloud-consult/followUpPlan/get?patientId=' + patientId + '&followUpTime=' + followUpTime + '&planType=' + 'PLAN',
    method: 'post',
    // data: data
  })
}
export function updateFollowUpPlan(data) {
  return request({
    url: '/cloud-consult/followUpPlan/update',
    method: 'post',
    data: data
  })
}
export function wxMsgSend(data) {
  return request({
    url: '/cloud-consult/wxMsg/send',
    method: 'post',
    data: data
  })
}

//健康管理的微信公众号推送
export function wxMsgSendHealthy(data) {
  return request({
    url: '/cloud-consult/wxMsg/sendHealthy',
    method: 'post',
    data: data
  })
}


// 查询省份
export function getProvince() {
  return request({
    url: '/cloud-baseinfo/province/get',
    method: 'post',
  })
}
// 查询市
export function getCity(id) {
  return request({
    url: '/cloud-baseinfo/city/get?id=' + id,
    method: 'post',
  })
}
// 查询 科室
export function getDept() {
  return request({
    url: '/cloud-baseinfo/department/queryAll',
    method: 'post',
  })
}

/**
 *获取报告列表
 *
 * @export
 * @return {*} 
 */
export function getReportList({
  patientId,
  reportType
}) {
  return request({
    url: '/cloud-consult/patientreport/querybypatientidlist?patientId=' + patientId + '&reportType=' + reportType,
    method: 'post'
  })
}


/**
 *体重录入
 *
 * @export
 * @return {*} 
 */
 export function weightItemInsert(data) {
  return request({
    url: '/cloud-consult/patientweight/insert',
    method: 'post',
    data: data
  })
}


/**
 *体重查询折线图
 *
 * @export
 * @return {*} 
 */
 export function weightQueryLinechart(data) {
  return request({
    url: '/cloud-consult/patientweight/querylinechartbypatientid',
    method: 'post',
    data: data
  })
}

/**
 *血糖录入
 *
 * @export
 * @return {*} 
 */
 export function bloodItemUpdate(data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/update',
    method: 'post',
    data: data
  })
}

/**
 *血糖更新
 *
 * @export
 * @return {*} 
 */
 export function bloodItemInsert(data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/insert',
    method: 'post',
    data: data
  })
}

/**
 *血糖类型字典查询
 *
 * @export
 * @return {*} 
 */
 export function getSugarTypeList() {
  return request({
    url: '/cloud-consult/patientBloodSugar/getSugarTypeList',
    method: 'post'
  })
}


/**
 *血糖记录查询，时间段包含重复数据
 *
 * @export
 * @return {*} 
 */
 export function getSugarList(data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/querySugarList',
    method: 'post',
    data: data
  })
}


/**
 *血糖记录查询，时间段包含重复数据
 *
 * @export
 * @return {*} 
 */
 export function getSugarListByDay(data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/querySugarTable',
    method: 'post',
    data: data
  })
}


/**
 *血糖记录查询，分页
 *
 * @export
 * @return {*} 
 */
 export function getBloodTable (data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/querySugarTablePage',
    method: 'post',
    data: data
  })
}

/**
 * 血糖分析结果
 *
 * @export
 * @return {*} 
 */
 export function queryBloodAnalaysis (data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/queryBloodAnalaysis',
    method: 'post',
    data: data
  })
}

/**
 * 血糖记录
 *
 * @export
 * @return {*} 
 */
 export function getBloods (data) {
  return request({
    url: '/cloud-consult/patientBloodSugar/query',
    method: 'post',
    data: data
  })
}

/**
 * 删除报告
 *
 * @export
 * @return {*} 
 */
 export function deleteReport (id) {
  return request({
    url: '/cloud-consult/patientreport/delete?id=' + id,
    method: 'post'
  })
}

/**
 * 报告详情
 *
 * @export
 * @return {*} 
 */
 export function getReport (id) {
  return request({
    url: '/cloud-consult/patientreport/querybyreportId?reportId=' + id,
    method: 'post'
  })
}

/**
 * 新增报告
 *
 * @export
 * @return {*} 
 */
 export function addReport (data) {
  return request({
    url: '/cloud-consult/patientreport/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新报告
 *
 * @export
 * @return {*} 
 */
 export function updateReport (data) {
  return request({
    url: '/cloud-consult/patientreport/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除血糖
 *
 * @export
 * @return {*} 
 */
 export function deleteBlood (id) {
  return request({
    url: '/cloud-consult/patientBloodSugar/delete?id=' + id,
    method: 'post'
  })
}

/**
 * 根据产检时间以及当前记录时间获取孕周
 *
 * @export
 * @return {*} 
 */
 export function getDays (params) {
  return request({
    url: '/cloud-consult/weightmanager/getdays?pregnancyDate=' + params.pregnancyDate + '&recordDate=' + params.recordDate,
    method: 'post'
  })
}

/**
 * 导出食谱模板
 *
 * @export
 * @return {*} 
 */
 export function exportCookbook () {
  return request({
    url: '/cloud-consult/excel/cookbook',
    method: 'post'
  })
}

/**
 * 上传食谱
 *
 * @export
 * @return {*} 
 */
 export function importCookbook (data) {
  return request({
    url: '/cloud-consult/excel/read',
    method: 'post',
    data: data,
    contentType: false,//这里不要落下
    dataType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 推送报告
 *
 * @export
 * @return {*} 
 */
 export function sendHealthReport (data) {
  return request({
    url: '/cloud-consult/patientreport/updatesendstatus',
    method: 'post',
    data: data
  })
}