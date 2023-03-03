import request from '@/utils/request'
import qs from 'qs'
// 新增随访计划
export function addFollowPlan(data) {
  return request({
    url: '/cloud-consult/followUpPlan/insert',
    method: 'post',
    data: data
  })
}
// 随访任务下拉选项数据
export function getTaskTypeOptions() {
  return request({
    url: '/cloud-consult/followUpPlan/getTaskList',
    method: 'post'
  })
}
// 今日随访列表数据
export function getFollowLists(data) {
  return request({
    url: '/cloud-consult/followUpPlan/queryByOther',
    method: 'post',
    data: data
  })
}
// 根据主键ID获取随访数据
export function getEditFollowUpData(id) {
  return request({
    url: `/cloud-consult/followUpPlan/get?id=${id}`,
    method: 'post',
  })
}
// 删除随访计划
export function delFollowPlan(data) {
  return request({
    url: `/cloud-consult/followUpPlan/delete?id=${data}`,
    method: 'post',
    data: {}
  })
}
// 编辑随访计划
export function editFollowPlan(data) {
  return request({
    url: `/cloud-consult/followUpPlan/update`,
    method: 'post',
    data: data
  })
}
// 通过患者id查随访计划
export function getPatientFollowPlan(data) {
  return request({
    url: `/cloud-consult/followUpPlan/queryByRangeTime`,
    method: 'post',
    data: data
  })
}
// 根据主键ID获取随访数据
export function getFollowUpData(data) {
  return request({
    url: `/cloud-consult/followUpPlan/get?patientId=${data.patientId}&followUpTime=${data.followUpTime}&planType=PLAN`,
    method: 'post',
    data: {}
  })
}

// 获取日志列表数据
export function getFollowUpLogList(data) {
  return request({
    url: `/cloud-consult/followUpLog/query`,
    method: 'post',
    data
  })
}
