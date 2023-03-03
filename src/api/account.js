import request from '@/utils/request'

export function getAccount() {
  return request({
    url: '/cloud-pay/appMch/query',
    method: 'post',
    data: {
      "pageNo": 1,
      "pageSize": 300,
    },
  }).then(res => {
    if (res.code === 200) {
      return res.data.rows.map(item => {
        return {
          ...item,
          label: item.mchName,
          value: item.id,
          sharePercent: item.shareMaxPercent / 100
        }
      })
    } else {
      return []
    }
  })
}
export function orderReShare(orderId) {
  return request({
    url: `/cloud-hmall/orderShare/reBegin?orderId=${orderId}`,
    method: 'post',
  })

}
