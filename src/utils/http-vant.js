import axios from 'axios';
import router from '../router'
import Vant, {Dialog, Lazyload, Toast} from 'vant';
import {aesDecrypt, aesEncrypt} from './encrypter';
import store from '../store'
import i18n from "../plugin/lang/i18n";



export default {
  install: Vue => {
    Vue.use(i18n)
    Vue.use(Vant);
    Vue.use(Lazyload, {
      lazyComponent: true,
    });
    Vue.prototype.$axios = axios
    axios.defaults.timeout = 10000; //请求超时 这一块有时候改有 时候不该看情况- -
    // const no_login_code = -1; //未登录返回的状态码
    // const success_code = 1; //成功返回的状态码
    // const err_code = 0; //失败返回的状态码
    if (process.env.NODE_ENV == 'development')
      setPath(
        process.env.VUE_APP_REQUEST_URL) //设置开发环境域名 对接口的时候。换一下这个地址。
    else if (process.env.NODE_ENV == 'production') setPath(
      process.env.VUE_APP_REQUEST_URL) //设置正式生产环境域名
    function setPath(path) {
      axios.defaults.baseURL = path;

    }

    
    /**
     * 提示错误信息
     * @param {string} message 错误信息
     * @param {boolean} tips 是否展示
     */
    function errorLog(message, tips = true) {
      if (tips) {
        console.log(message)
        console.error(message);
      }
    }
    
    /**
     * 加密请求
     * @param { { upload?: boolean; url?: string; module?: string; interface?: string|number; data?: any; tips?: boolean; enc?: boolean } } param
     * @returns {Promise<any>} 结果
     */
    Vue.prototype.$encPost = param => {
      if (process.env.VUE_APP_LOG == 'true') {
        console.log(param)
      }
      store.state.showLoading = true
      return new Promise((resolve, reject) => {
        // 获取token，并且格式化token
        // 由于DAPP的特殊性，token不建议做持久性存储
        let token
        if (process.env.VUE_APP_TOKEN_VUEX == 'true'){
          token = store.state.token
        }else{
          token  = localStorage.getItem("token") || "";
        }
       
        if (token && !token.startsWith("Bearer ")) {
          token = "Bearer " + token;
        }
        // 创建Axios实例
        let $axios;
        // 如果是上传请求
        const config = {
          headers: {
            'Authorization': token
          }
        };
        if (param.upload) {
          if (param.data instanceof File) {
            const formData = new FormData();
            formData.append("data", param.data)
            param.data = formData;
          }
          $axios = axios.post("/upload", param.data, config)
        } else {
          const data = {
            source: 'web',
            version: 'v1',
            module: param.module,
            interface: param.interface,
            timestamp: Math.round(new Date().getTime() / 1000),
          }
          $axios = axios.post(param.url || "/portal", aesEncrypt(data, param.data, param.enc),
            config);
        }
        if ($axios) {
          $axios.then((response) => {
            store.state.showLoading = false
            let dataAxios = aesDecrypt(response.data, param.enc);
            if (process.env.VUE_APP_LOG == 'true') {
              console.log(dataAxios)
            }
            const {
              code
            } = dataAxios;
            if (!code) {
              // 成功
              resolve(dataAxios.data || dataAxios);
            } else {
              switch (code) {
                case 4700:
                  // 登录异常错误
                  // 删除Token
                  // 跳转登录页面
                  Toast(i18n.t('m.axios.登录信息失效'))
                  localStorage.setItem("token", '');
                  errorLog(dataAxios.message, param.tips);
                  reject(dataAxios)
                  router.push("/login")
                    if (process.env.VUE_APP_OPEN_WEB3 == 'true' || process.env.VUE_APP_OPEN_WEB3_TRON == 'true'){
                      setTimeout(()=>{
                        window.location.reload();
                      },800)
                    }
                  break;
                case 4800:
                case 4810:
                  // 用户可见错误  这里可以进行认证的一些判断
                  errorLog(dataAxios.message, param.tips);
                  // Dialog.alert({
                  //   message: dataAxios.message
                  // })
                  Toast(dataAxios.message)
                  reject(dataAxios)
                  break;
                case 4500:
                  // 传入参数与接口所需不一致，部分接口用户可见
                  Dialog.alert({
                    message: dataAxios.message
                  })
                  errorLog(dataAxios.message, param.tips);
                  reject(dataAxios)
                  break;
                case 4890:
                  // 传入参数与接口所需不一致，部分接口用户可见
                  Toast(dataAxios.message, param.tips);
                  reject(dataAxios)
                  break;
                default:
                  // 其他异常情况
                  errorLog('网络异常，请稍后..', param.tips)
                  Toast(i18n.t('m.axios.网络异常'))
                  reject(dataAxios)
                  break;
              }
            }
          }).catch(err => {
            store.state.showLoading = false
            if (!err.response) {
              // 没有返回值，表示是请求失败
              console.error("error -> 网络请求失败，请检查请求地址或请求参数信息");
              reject(err)
            } else if (err.response.statue !== 200) {
              // 有返回值，且请求失败
              let message;
              switch (err.response.status) {
                case 400:
                  message = i18n.t('m.axios.请求错误');
                  break
                case 401:
                  message = i18n.t('m.axios.未授权');
                  break
                case 403:
                  message = i18n.t('m.axios.拒绝访问');
                  break
                case 404:
                  message = `${i18n.t('m.axios.请求地址出错')}:${err.response.config.url}`;
                  break
                case 408:
                  message = i18n.t('m.axios.请求超时');
                  break
                case 500:
                  message = i18n.t('m.axios.服务器内部错误');
                  break
                case 501:
                  message = i18n.t('m.axios.服务未实现');
                  break
                case 502:
                  message = i18n.t('m.axios.网关错误');
                  break
                case 503:
                  message = i18n.t('m.axios.服务不可用');
                  break
                case 504:
                  message = i18n.t('m.axios.网关超时');
                  break
                case 505:
                  message = i18n.t('m.axios.HTTP版本不受支持');
                  break
                case "ECONNABORTED":
                  message = i18n.t('m.axios.请求超时');
                  break
                default:
                  message = i18n.t('m.axios.意外错误')
                  break
              }
              console.error("error ->", message)
              err.message = message;
              reject(err)
            } else {
              // 有返回值，请求成功，但接口返回失败
              reject(err)
            }
          })
        }
      })
    }
  }
}
