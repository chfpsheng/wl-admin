/**
*商品类型
*/
export default{
  filters: {
      shopTypeText (value) {//列表状态字段type对应中文,0表示免费产品 1表示普通产品
        if (value==null||value==undefined) return '';
        let _str = '';
        switch(value){
          case 0:_str = '免费商品';break;
          case 1:_str = '普通商品';break;
          default:break;
        }
        return _str;
      }
  }
}
