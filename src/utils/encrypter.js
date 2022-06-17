import CryptoJS from "crypto-js";
import * as jsbase64 from "js-base64"
import md5 from "js-md5"

const base64decode = jsbase64.Base64.decode;
const base64encode = jsbase64.Base64.encode;
// 生成签名需要用的AppKey
const appKey = process.env.VUE_APP_APP_KEY
// 加密解密的AesKey
//let aesKey = "6RVEXawIZDdkNmQ1ZGY4MmM4YmQwY2Q2NmI3MjI3YmU5ZWFlOWE=gNNzCxCO";
let aesKey = Boolean(process.env.VUE_APP_ENC)==true?process.env.VUE_APP_AES_KEY:'' ;
if (aesKey) {
  aesKey = base64decode(aesKey.substr(8, aesKey.length - 16));
}

function hash(kqDY1, SkO2) {
  return CryptoJS.HmacSHA256(
    kqDY1 + SkO2,
    aesKey
  ).toString();
}

function validPayload(Xbcii$F3) {
  return (typeof Xbcii$F3 === "object" &&
    "iv" in Xbcii$F3 &&
    "mac" in Xbcii$F3 &&
    "value" in Xbcii$F3 &&
    CryptoJS.enc.Base64.parse(Xbcii$F3.iv).sigBytes === 16);
}

function random() {
  return window.Math.random().toString(36).substr(2);
}

function randomBytes() {
  return CryptoJS.enc.Utf8.parse(
    CryptoJS.MD5(random()).toString().substr(9, 16)
  );
}

function calculateMac(iyrmEa4, RDX5) {
  return CryptoJS.HmacSHA256(
    hash(iyrmEa4.iv, iyrmEa4.value),
    RDX5
  );
}

function hashEquals(UScFcLEp6, Dlrevd7) {
  const len = UScFcLEp6.length;
  let result = 0;
  for (let i = 0; i < len; ++i) {
    result |=
      UScFcLEp6.charCodeAt(i) ^
      Dlrevd7.charCodeAt(i);
  }
  return result === 0;
}

function validMac(a) {
  const bytes = randomBytes();
  const calculated = calculateMac(a, bytes);
  return hashEquals(CryptoJS.HmacSHA256(a.mac, bytes), calculated);
}

function getJsonPayload(aEAbEUasi8) {
  aEAbEUasi8 = CryptoJS.enc.Base64.parse(aEAbEUasi8).toString(CryptoJS.enc.Utf8);
  aEAbEUasi8 = JSON.parse(aEAbEUasi8);
  if (!validPayload(aEAbEUasi8)) {
    throw new window.Error("The payload is invalid.");
  }
  if (!validMac(aEAbEUasi8)) {
    throw new window.Error("The MAC is invalid.");
  }
  return aEAbEUasi8;
}

/**
 * 对对象的key进行排序
 * @param {any} obj 需要排序的对象
 * @returns {any} 结果
 */
function sortObj(obj) {
  const keysArr = Object.keys(obj).sort();
  const sortObj = {};
  for (const i in keysArr) {
    sortObj[keysArr[i]] = obj[keysArr[i]];
  }
  return sortObj;
}

/**
 * 将参数拼接为字符串
 * @param {any} obj 参数
 * @returns {string} 拼接后的字符串
 */
function serializeObject(obj) {
  const str = [];
  for (const p in obj) {
    str.push(p + "=" + encodeURIComponent(obj[p]));
  }
  return str.join("&");
}

/**
 * 签名
 */
function getSignStr(opts) {
  opts = sortObj(opts)
  const tempStr = serializeObject(opts)
  return md5(base64encode(`${appKey}${tempStr}${appKey}`)).toLowerCase();
}

/**
 * 数据加密
 * @param {*} imb9 需要加密的数据
 * @param {*} opts 请求data
 * @param {boolean} enc 是否启动加密
 * @returns 加密后的字符串
 */
export function aesEncrypt(imb9, opts = {}, enc = true) {
  //多语言
  let lang =  localStorage.getItem('lang') || 'zh'
  opts.language = lang =='zh'?1:2

  // 获取签名并赋值
  const sign = getSignStr(imb9)
  imb9.sign = sign;
  imb9.data = opts;
  if (!aesKey || !enc) {
    // 如果没有加密key或者不需要加密
    // 直接fanhui
    return imb9;
  }
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  let iv = randomBytes();
  const param = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };
  const plaintext = JSON.stringify(imb9);
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key, param).toString();
  const mac = hash(
    (iv = CryptoJS.enc.Base64.stringify(iv).toString()),
    ciphertext
  );
  const json = JSON.stringify({
    iv: iv,
    mac: mac,
    value: ciphertext
  });
  const encryptedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(json));
  return {encryptedData}
}

/**
 * 将加密的数据解密
 * @param {string} HTrZAqKQ10 加密的数据
 * @param {boolean} enc 是否启动加密
 * @returns 解密后的数据
 */
export function aesDecrypt(HTrZAqKQ10, enc = true) {
  if (!aesKey || !enc) {
    return HTrZAqKQ10
  }
  HTrZAqKQ10 = HTrZAqKQ10.encryptedData
  const payload = getJsonPayload(HTrZAqKQ10);
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const iv = CryptoJS.enc.Base64.parse(payload.iv);
  const param = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };
  let plaintext = CryptoJS.AES.decrypt(
    payload.value,
    key,
    param
  );
  plaintext = plaintext.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plaintext);
}
