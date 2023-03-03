// 金额转化 分->元
export function amount(val) {
  return isNaN(val) ? 0.00 : parseFloat((val / 100).toFixed(2))
}

