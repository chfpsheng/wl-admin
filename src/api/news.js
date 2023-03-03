import request from '@/utils/request'

// 新增群发批次消息
export function addMessage(data) {
  return request({
    url: '/cloud-baseinfo/batchMessage/add2',
    method: 'post',
    data: data
  })
}

// 根据条件分页查询  群发记录
export function batchMessageQuery(data) {
  return request({
    url: '/cloud-baseinfo/batchMessage/query',
    method: 'post',
    data: data
  })
}

// 根据BatchId获取数据
export function getByBatchId(data) {
  return request({
    url: '/cloud-baseinfo/batchMessageIm/getByBatchId',
    method: 'post',
    data: data
  })
}

    // data: data
// 更新群发消息状态 
export function batchMessageUpdate(data) {
  return request({
    url: `/cloud-baseinfo/batchMessage/cancel?id=${data.id}`,
    method: 'post',
  })
}
