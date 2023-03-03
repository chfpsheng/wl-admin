import request from '@/utils/request'

// 获取探视设置
export function patientQuery(data) {
  return request({
    url: `/patient/query?classifyType=${data.classifyType}`,
    method: 'post'
  })
}

// 新增探视设置
export function patientInsert(data) {
  return request({
    url: '/patient/insert',
    method: 'post',
    data: data
  })
}

// 更新探视设置
export function patientUpdate(data) {
  return request({
    url: '/patient/update',
    method: 'post',
    data: data
  })
}

// 更新探视设置
export function patientUpdateStatus(data) {
  return request({
    url: '/patient/updateStatus',
    method: 'post',
    data: data
  })
}

// 标签类型查找
export function labelTypeQuery(classifyType) {
  return request({
    url: `/cloud-consult/speechcraftInfo/queryByType?classifyType=${classifyType}`,
    method: 'post'
  })
}

// 标签类型新增
export function labelTypeInsert(data) {
  return request({
    url: '/cloud-consult/speechcraftInfo/insert',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeUpdate(data) {
  return request({
    url: '/cloud-consult/speechcraftInfo/update',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeDelete({ id, dataStatus }) {
  return request({
    url: `/cloud-consult/speechcraftInfo/updateDeleted?id=${id}&dataStatus=${dataStatus}`,
    method: 'post'
  })
}

// 话术查询
export function labelQuery(data) {
  return request({
    url: '/cloud-consult/speechcraftInfo/queryByCondition',
    method: 'post',
    data: data
  })
}

// 状态
export function labelStuUpdate(data) {
  return request({
    url: `/cloud-consult/speechcraftInfo/updateStatus?id=${data.id}&dataStatus=${data.dataStatus}
    `,
    method: 'post'
  })
}
// 编辑文本
export function labelUpdate(data) {
  return request({
    url: `/cloud-consult/speechcraftInfo/update`,
    method: 'post',
    data: data
  })
}

// 标签新增
export function labelInsert(data) {
  return request({
    url: '/cloud-consult/speechcraftInfo/insert',
    method: 'post',
    data: data
  })
}

// 图片新增
export function imgInsert(data) {
  return request({
    url: '/cloud-consult/speechcraftInfo/insertBatch',
    method: 'post',
    data: data
  })
}

// 删除话术
export function labelDelete(data) {
  return request({
    url: `/cloud-consult/speechcraftInfo/updateDeleted?id=${data.id}&dataStatus=1`,
    method: 'post',
    data: data
  })
}

export function labelUpdateOnly(data) {
  return request({
    url: '/patientTag/save',
    method: 'post',
    data: data
  })
}

// 查找专属管家
export function queryAssigner(data) {
  return request({
    url: '/sysUser/queryByCondition',
    method: 'post',
    data: data
  })
}

export function exportPatient(data) {
  return request({
    url: '/patient/export',
    method: 'post',
    data: data
  })
}
