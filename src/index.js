import Vue from 'vue'
// 全局组件
import PaSelect from '@/components/PaSelect'
import PaDatePicker from '@/components/PaDatePicker'
import PaPagination from '@/components/PaPagination'
import PaSwitch from '@/components/PaSwitch'
import PaDrawer from '@/components/PaDrawer'
import FilterSelect from '@/components/FilterSelect'
import FilterInput from '@/components/FilterInput'
import FilterDaterangPicker from '@/components/FilterDaterangPicker'
import FilterDatePicker from '@/components/FilterDatePicker'
import HeaderBox from '@/components/HeaderBox'
import UploadImg from '@/components/UploadImg'
import UploadImgs from '@/components/UploadImgs'
import CsButton from '@/components/CsButton'
import PaIframe from '@/components/PaIframe'
import PaPreview from '@/components/PaPreview'
import InputAmount from '@/components/Form/input-amount.vue'

// 引入过滤器
import * as filters from '@/filters/index.js'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import ValidateRules from './utils/ValidateRules'
import md5 from 'js-md5'

import { requestPost, requestGet, requestDel, requestPut } from './api/request-new.js'
import { computeHeight } from './api/common.js'

import lodash from 'lodash'
Vue.prototype.$lodash = lodash

import Moment from 'moment'

Vue.component('PaSelect', PaSelect)
Vue.component('PaDatePicker', PaDatePicker)
Vue.component('PaPagination', PaPagination)
Vue.component('PaSwitch', PaSwitch)
Vue.component('PaDrawer', PaDrawer)
Vue.component('FilterSelect', FilterSelect)
Vue.component('FilterInput', FilterInput)
Vue.component('FilterDaterangPicker', FilterDaterangPicker)
Vue.component('FilterDatePicker', FilterDatePicker)
Vue.component('UploadImg', UploadImg)
Vue.component('UploadImgs', UploadImgs)
Vue.component('HeaderBox', HeaderBox)
Vue.component('CsButton', CsButton)
Vue.component('PaIframe', PaIframe)
Vue.component('PaPreview', PaPreview)
Vue.component('InputAmount', InputAmount)

Vue.prototype.ValidateRules = ValidateRules
Vue.prototype.$md5 = md5

Vue.prototype.moment = Moment

Vue.prototype.$requestGet = requestGet
Vue.prototype.$requestPost = requestPost
Vue.prototype.$requestPut = requestPut
Vue.prototype.$requestDel = requestDel
Vue.prototype.$computeHeight = computeHeight

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
