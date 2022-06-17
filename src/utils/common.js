const emailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const phoneReg = /^[1][0-9]{10}$/;
const pass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
const pay = /^\d{6}$/;
const captcha = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6}$/;
const account = /^[a-zA-Z][a-zA-Z0-9_-]{2,16}$/i;

export default {
  /**
   * 是否是登录密码
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isPass(value) {
    return pass.test(value);
  },
  /**
   * 是否是交易密码
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isPay(value) {
    return pay.test(value)
  },
  /**
   * 是否是邮箱
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isEmail(value) {
    return emailReg.test(value)
  },
  /**
   * 是否是手机号
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isPhone(value) {
    return phoneReg.test(value)
  },
  /**
   * 是否是验证码
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isCaptcha(value) {
    return captcha.test(value);
  },
  /**
   * 是否是账号
   * @param {String} value 需要被校验的值
   * @returns 是否通过校验
   */
  isAccount(value) {
    return account.test(value)
  }
}