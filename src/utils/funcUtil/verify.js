/**
 * 此js封装为 验证
 *
 *
 * 1.邮箱              isEmail(s)
 * 2.手机号            isMobile(s)
 * 3.电话号码          isPhone(s)
 * 4.是否字符串         isString(s)
 * 5.是否数字          isNumber(s)
 * 6.是否url地址       isUrl(s)
 * 7.是否boolean      isBoolean(s)
 * 8.是否函数          isFunction(s)
 * 9.是否为null        isNull(s)
 * 10.是否undefined   isUndefined(s)
 * 11.是否对象         isObj(s)
 * 12.是否数组         isArray(s)
 * 13.是否时间         isDate(s)
 * 19.滚动到顶部       scrollToTop
 * 20.判断类型集合     checkStr
 * 21.严格的身份证校验  isCardID
 * 22.去除空格,type: 1-所有空格 2-前后空格 3-前空格 4-后空格     trim(str,type)
 * */


//邮箱验证
export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}
//手机号
export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s)
}
//电话号码
export const isPhone = (s) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
//是否为字符串
export const isString = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'String'
}
//是否数字
export const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
}
//是否URl
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s)
}
//是否boolean
export const isBoolean = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
}
//是否函数
export const isFunction = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
}
//是否为null
export const isNull = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
}
//是否undefined
export const isUndefined = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
}
//是否对象
export const isObj = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
}
//是否数组
export const isArray = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
}
//是否时间
export const isDate = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
}

//滚动到顶部
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

//严格的身份证校验
export const isCardID = (sId) => {
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
    console.log('你输入的身份证长度或格式错误')
    return false
  }
  //身份证城市
  var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
  if (!aCity[parseInt(sId.substr(0, 2))]) {
    console.log('你的身份证地区非法')
    return false
  }
  
  // 出生日期验证
  var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
    d = new Date(sBirthday)
  if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
    console.log('身份证上的出生日期非法')
    return false
  }
  
  // 身份证号码校验
  var sum = 0,
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    codes = "10X98765432"
  for (var i = 0; i < sId.length - 1; i++) {
    sum += sId[i] * weights[i];
  }
  var last = codes[sum % 11]; //计算出来的最后一位身份证号码
  if (sId[sId.length - 1] != last) {
    console.log('你输入的身份证号非法')
    return false
  }
  
  return true
}






