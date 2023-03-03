import request from '@/utils/request'
// 角色
export function roleData() {
  return request({
    url: `/cloud-user/sysRole/queryBySystem?systemCode=${this.$systemCode}`,
    method: 'post',
    data: {}
  })
}
// 性别-岗位
export function dicData(data) {
  return request({
    url: `/cloud-baseinfo/sysDictionary/queryByType?dicType=${data}`,
    method: 'post',
    data: {}
  })
}