// import parseTime, formatTime and set to filter
// import { parseTime, formatTime } from '@/utils'
import {
  isNull,
  isNaN,
  isUndefined
} from 'lodash'
import numeral from 'numeral'

export function parseTimes(time, cFormat) {
  if (!time) {
    return
  }
  if (arguments.length === 0 || !time) {
    return null
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTimes(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [{
      value: 1E18,
      symbol: 'E'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E6,
      symbol: 'M'
    },
    {
      value: 1E3,
      symbol: 'k'
    }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export function amount(val) {
  return isNaN(val) ? 0.00 : parseFloat((val / 100).toFixed(2))
}
// 金额带货币符号￥
export function currency(value, unit = '￥') {
  return unit + numeral(value / 100).format('0.00')
}
// 金额带货币符号￥保留三位小数
export function currencyThree(value, unit = '￥') {
  return unit + numeral(value / 100).format('0.000')
}
// 金额分转元 元单位在后面
export function currencyYuan(value) {
  return numeral(value / 100).format('0.00') + ' 元'
}
// 分转为元
export function yuan(val) {
  if (val) {
    if (val >= 100) {
      val = String(val)
      return val.substring(0, val.length - 2) + '.' + val.substring(val.length - 2)
    } else if (val >= 10) {
      return '0.' + val
    } else if (val < 0) {
      return -(Math.abs(val) / 100).toFixed(2)
    } else {
      return '0.0' + val
    }
  } else {
    return '0.00'
  }
}

// 根据日期获取星期几
export function getWeekday(val) {
  let dateObj = new Date(val); //表示当前系统时间的Date对象
  let day = dateObj.getDay(); //当前系统时间中的星期值
  let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weeks[day]; //根据星期值，从数组中获取对应的星期字符串
}

// 格式化百分比
export const formatPercentage = (value, formatStr, defaultValue) => {
  if (isNull(value) || isUndefined(value)) {
    return defaultValue
  }
  if (value.toString().includes('%')) {
    return value
  }
  formatStr = formatStr ? formatStr : '0,0'
  return numeral(value * 100).format(formatStr) + '%'
}

// 格式化价格范围
export const formatPriceRate = (value) => {
  if (!value) {
    return ''
  }
  if (!value.length) {
    return ''
  }
  const from = value[0]
  const to = value[1]
  if (from === to || typeof to === 'undefined') {
    return currency(from)
  }
  return `${currency(from)} - ${currency(to, '')}`
}

// 血糖类型
export function bloodType (val) {
  if (val === 'BEFORE_DAWM') {
    return '凌晨'
  } else if (val === 'BEFORE_BREAKFAST') {
    return '早餐前'
  } else if (val === 'AFTER_BREAKFAST') {
    return '早餐后'
  } else if (val === 'BEFORE_LUNCH') {
    return '午餐前'
  } else if (val === 'AFTER_LUNCH') {
    return '午餐后'
  } else if (val === 'BEFORE_DINNER') {
    return '晚餐前'
  } else if (val === 'AFTER_DINNER') {
    return '晚餐后'
  } else if (val === 'BEFORE_SLEEP') {
    return '睡前'
  } else {
    return ''
  }
}

// 血糖类型
export function diabetes (val) {
  if (val === 1) {
    return '糖尿病合并妊娠'
  } else if (val === 2) {
    return '妊娠期糖尿病'
  } else {
    return '无'
  }
}

// 周几
export function weekTitle (val) {
  const weekArray = new Array('一', '二', '三', '四', '五', '六', '日')
  return weekArray[val]
}

// 食谱类型
export function foodType (val) {
  if (val === '1') {
    return '早餐'
  } else if (val === '2') {
    return '早点'
  } else if (val === '3') {
    return '午餐'
  } else if (val === '4') {
    return '午点'
  } else if (val === '5') {
    return '晚餐'
  } else if (val === '6') {
    return '晚点'
  } else {
    return ''
  }
}

// 增长速率
export function growRate (val) {
  if (val === 2) {
    return '过快'
  } else if (val === 3) {
    return '较慢'
  } else {
    return '正常'
  }
}