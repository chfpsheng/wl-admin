const checkNumber = (min, max, isAmount) => {
  return (rule, value, callback) => {
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (isAmount) {
        value = value / 100
      }
      if (value < min || value > max) {
        callback(new Error(`范围${min}-${max}`));
      } else {
        callback();
      }
    }
  }
}
export default {
  checkNumber,
  InputRequired: {
    required: true,
    message: '请输入',
    trigger: 'blur'
  },
  InputNameRequired: {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  },
  SelectRequired: {
    required: true,
    message: '请选择',
    trigger: 'change'
  },
  DateRequired: {
    required: true,
    message: '请选择日期',
    trigger: 'change'
  },
  PhoneRequired: {
    required: true,
    message: '请输入手机号',
    trigger: 'blur'
  },
  ImgRequired: {
    required: true,
    message: '请上传图片',
    trigger: 'change'
  },
  AddRequired: {
    required: true,
    message: '请添加规格',
    trigger: 'blur'
  },
  LengthTen: {
    min: 0,
    max: 10,
    message: '最多输入10个字符',
    trigger: 'blur'
  },
  LengthTwenty: {
    min: 0,
    max: 20,
    message: '最多输入20个字符',
    trigger: 'blur'
  },
  Between2to20: {
    min: 2,
    max: 20,
    message: '长度2-20个字符',
    trigger: 'blur'
  },
  LengthThirty: {
    min: 0,
    max: 30,
    message: '最多输入30个字符',
    trigger: 'blur'
  },

  // 定制化提示
  InputRoleRequired: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  },
  SelectRoleTypeRequired: {
    required: true,
    message: '请选择角色类型',
    trigger: 'change'
  },
  InputEmployeeRequired: {
    required: true,
    message: '请输入员工姓名',
    trigger: 'blur'
  },
  InputEmployeeCodeRequired: {
    required: true,
    message: '请输入员工编号',
    trigger: 'blur'
  },
  InputEmployeePhoneRequired: {
    required: true,
    message: '请输入员工手机号',
    trigger: 'blur'
  },
  AvatarImgRequired: {
    required: true,
    message: '请上传头像',
    trigger: 'change'
  },
  BirthDateRequired: {
    required: true,
    message: '请选择出生年月',
    trigger: 'change'
  },
  SelectSexRequired: {
    required: true,
    message: '请选择员工性别',
    trigger: 'change'
  },
  SelectDutyRequired: {
    required: true,
    message: '请选择员工所属岗位',
    trigger: 'change'
  },
  SelectRoleRequired: {
    required: true,
    message: '请选择员工所属角色',
    trigger: 'change'
  },
  InputSpecNameRequired: {
    required: true,
    message: '请输入服务规格名称',
    trigger: 'blur'
  },
  InputSpecRequired: {
    required: true,
    message: '请输入规格名称',
    trigger: 'blur'
  },
  InputSortRequired: {
    required: true,
    message: '请输入排序',
    trigger: 'blur'
  },
  InputProNameRequired: {
    required: true,
    message: '请输入套餐名称',
    trigger: 'blur'
  },
  SelectDepartmentRequired: {
    required: true,
    message: '请选择所属科室',
    trigger: 'change'
  },
  SelectSpecRequired: {
    required: true,
    message: '请选择服务规格',
    trigger: 'change'
  },
  SpecListRequired: {
    required: true,
    message: '服务至少需要包含1个规格，请添加规格信息!',
    trigger: 'blur'
  },
  InputServiceDetailRequired: {
    required: true,
    message: '请输入服务详情',
    trigger: 'blur'
  },
  InputbuyAttentionRequired: {
    required: true,
    message: '请输入购买须知',
    trigger: 'blur'
  },
  SelectMoneyModeRequired: {
    required: true,
    message: '请选择收款模式',
    trigger: 'change'
  },
  SelectReceivingAccountRequired: {
    required: true,
    message: '请选择收款商户',
    trigger: 'change'
  },
  InputCostPriceRequired: {
    required: true,
    message: '请输入成本价',
    trigger: 'blur'
  },
  InputOriginalPriceRequired: {
    required: true,
    message: '请输入原价',
    trigger: 'blur'
  },
  InputSalePriceRequired: {
    required: true,
    message: '请输入销售价',
    trigger: 'blur'
  },
  RadioSalePriceRequired: {
    required: true,
    message: '请选择是否分账',
    trigger: 'blur'
  },
  InputStockRequired: {
    required: true,
    message: '请输入库存数',
    trigger: 'blur'
  },
  InputGroupMoneyRequired: {
    required: true,
    message: '请输入分账金额',
    trigger: 'blur'
  },
  SelectLimitsRequired: {
    required: true,
    message: '请选择基本权限',
    trigger: 'change'
  },
  AccountValid: {
    validator: checkNumber(0.01, 999999, true),
    trigger: 'blur'
  },
  StockValid: {
    validator: checkNumber(0, 9999),
    trigger: 'blur'
  },
  SelectRequiredFollowTime: {
    required: true,
    message: '请选择随访时间',
    trigger: 'change'
  },
  SelectRequiredFollowUser: {
    required: true,
    message: '请选择随访人',
    trigger: 'change'
  },
  InputRequiredContent: {
    required: true,
    message: '请输入随访结果',
    trigger: 'blur'
  },
  SelectUserRequired: {
    required: true,
    message: '请选择随访人',
    trigger: 'change'
  },
  SelectModeRequired: {
    required: true,
    message: '请选择随访方式',
    trigger: 'change'
  },
}
