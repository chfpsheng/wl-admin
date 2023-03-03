import request from '@/utils/request'

// 员工设置查询
export function fetchEmployeeList(data) {
  return request({
    url: '/employee/query',
    method: 'post',
    data
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    url: '/employee/insert',
    method: 'post',
    data
  })
}

// 更新员工设置
export function updateEmployee(data) {
  return request({
    url: '/employee/update',
    method: 'post',
    data
  })
}

// 删除员工设置
export function deleteEmployee(data) {
  return request({
    url: '/employee/delete?id=' + data.id,
    method: 'post',
    data
  })
}
