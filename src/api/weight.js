/*
 * @Author: your name
 * @Date: 2021-11-29 10:53:12
 * @LastEditTime: 2021-11-30 11:21:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\api\weight.js
 */
import request from '@/utils/request'

// 获取体重报告,确认暂时没有用
// export function getPatientweight(data) {
//   return request({
//     url: 'cloud-consult/patientreport/query',  
//     method: 'post',
//     data: data
//   })
// }
// 获取体重数据
export function querynearweightinfo(data) {
  return request({
    url: 'cloud-consult/weightmanager/querynearweightinfo',  
    method: 'post',
    data: data
  })
}
// 更新用户体重数据接口
export function updateWeightInfo(data) {
  return request({
    url: 'cloud-consult/weightmanager/updatePatientWeight',  
    method: 'post',
    data: data
  })
}
// 更新体重列表数据(编辑)
export function upDataWeightinfo(data) {
  return request({
    url: '/cloud-consult/patientweight/update',  
    method: 'post',
    data: data
  })
}
// 新增体重数据
export function addNewWeightinfo(data) {
  return request({
    url: 'cloud-consult/patientweight/insert',  
    method: 'post',
    data: data
  })
}
// 获取体重记录列表数据
export function getPatientRecord(data) {
  return request({
    url: 'cloud-consult/patientweight/query',  
    method: 'post',
    data: data
  })
}
// 获取体重记录列表数据 删除接口
export function delatePatientRecord({id}) {
  return request({
    url: 'cloud-consult/patientweight/delete?id=' + id,  
    method: 'post'
  })
}



/**
 *删除体重报告
 *
 * @export
 * @param {*} data
 * @return {*} 
 */
export function deletePatientReport(id) {
  return request({
    url: 'cloud-consult/patientreport/delete?id=' + id,  
    method: 'post'
  })
}


