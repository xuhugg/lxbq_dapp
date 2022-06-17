/**
 * 波场自动注册
 */
import store from "../store";
/*
 * Tron钱包对象
 * Tron 将全局 API 注入其用户访问的网站api.trongrid.io。该 API 允许网站请求用户的以太坊账户，从用户连接的区块链读取数据，并建议用户签署消息和交易。提供者对象的存在表明以太坊用户。我们建议使用@metamask/detect-provider （打开新窗口）在任何平台或浏览器上检测我们的提供商
 */
const tronWallet = {
  // 初始化并获取账户
  init() {
    return new Promise((resolve, reject) => {
      let time = setInterval(async () => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          clearInterval(time)
          store.commit("SET_TRON_ACCOUNT", window.tronWeb.defaultAddress.base58)
          this.getTronWeb()
          resolve(window.tronWeb.defaultAddress.base58)
          let authorize = setInterval(() => {
            if (window.tronLink != undefined) {
              if (!store.state.tronWallet.connect) {
                window.tronLink.request({ method: 'tron_requestAccounts' }).then(res => {
                  if (res.code === 200) {
                    clearInterval(authorize)
                    store.commit("SET_TRON_CONNECT", true)
                  } else if (res.code === 4001) {
                    reject('用户拒绝授权了')
                    store.commit("SET_TRON_CONNECT", false)
                  }
                })
              }
            }
          }, 1000)
        } else {
          clearInterval(time)
          reject('浏览器不支持TronDAPP环境，请检查')
        }
      }, 1000)
    })
  },
  getTronWeb() {
    if (window.tronWeb) {
      store.commit('SET_TRON_WEB3', window.tronWeb)
      return window.tronWeb
    }
    return null
  },
  async initWe3() {
    let self = this
    await self.init()
    return self.getTronWeb()
  },
  async getTronContract(web3, abis) {
    if (web3 && abis) {
      Object.keys(abis).forEach(key => {
        let contract = web3.contract(abis[key].abi, abis[key].address, {
          feeLimit: 400000000,
          callValue: 1,
          shouldPollResponse: true
        })
        store.commit('SET_TRON_CONTRACT', { key: key, contract: contract })
      })
    }
  },
}
const install = Vue => {
  if (install.installedToast) {
    return
  }
  install.installedToast = true
  Object.defineProperties(Vue.prototype, {
    $tron: {
      get() {
        return tronWallet
      }
    }
  })
}
export default install

