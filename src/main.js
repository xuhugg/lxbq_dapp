////////////   项目依赖引入   //////////////
// vue框架
import Vue from 'vue';
// vue主页面
import App from './App.vue';
// vue路由
import router from './router';
// 公共Header栏
import Header from './components/Header';
// vue组件库vant的样式文件
import 'vant/lib/index.css';
// vue组件库vant的基本依赖文件
// 统一请求文件
// import _api from "./utils/request/ethChain"
//vant 懒加载
import vant, {Lazyload} from "vant";
// vuex，
import store from './store/index';
// 多语言切换
import i18n from './plugin/lang/i18n';
// 正在校验文件
// import common from './utils/common'
// 基础工具文件
// import funcUtil from './utils/funcUtil/base'
// 移动端适配组件（px转rem必须组件之一）
import 'amfe-flexible'
// 剪切板组件，可以使用$copyText(text)方法复制文字
import VueClipboard from 'vue-clipboard2'
// vue公共指令文件
import "@/utils/command";
//扩展工具类引入 //全局方法挂载



//格式化时间
import { parseTime } from "@/utils/funcUtil/base";
Vue.prototype.parseTime = parseTime
//多语言切换
import {languageSwitch} from "./utils/funcUtil/Universal";
Vue.prototype.languageSwitch = languageSwitch
//自定义指令,使用方法参考readme.md
import cmDirectives from 'cm-directives'
Vue.use(cmDirectives)
//DAPP 自动注册
import Api from './ethChain'
import tronApi from './tron'
import metaMask from './utils/metaMask'
import tronWallet from "./utils/tronWallet";
import * as blockFun from './utils/chain/block'
//封装请求
import http from "./utils/http-vant"
Vue.use(http)
Vue.use(Lazyload);
Vue.prototype.blockFun = blockFun

//web3 按需引入
if (process.env.VUE_APP_OPEN_WEB3 == 'true') {
  Vue.use(Api)
  Vue.use(metaMask)
  
}

// tron 按需引入
if (process.env.VUE_APP_OPEN_WEB3_TRON == 'true') {
  Vue.use(tronApi)
  Vue.use(tronWallet)
}




////////////   项目常用工具设置   //////////////
// 头部
Vue.component('Header', Header);
// 引入的组件，vant VueClipboard
Vue.use(vant).use(VueClipboard);

// 定时方法，使用异步封装，方便使用（好像没啥用）
Vue.prototype.$sleep = time => {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

////////////   创建vue对象   //////////////
new Vue({
  router, store, i18n, render: h => h(App)
}).$mount('#app')
