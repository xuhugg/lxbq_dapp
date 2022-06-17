import store from '../store'
import Web3 from 'web3'

// const desiredNetwork = '1' // '1' 表示以太坊主网
/*
 * MetaMask钱包对象
 * MetaMask 将全局 API 注入其用户访问的网站window.ethereum。该 API 允许网站请求用户的以太坊账户，从用户连接的区块链读取数据，并建议用户签署消息和交易。提供者对象的存在表明以太坊用户。我们建议使用@metamask/detect-provider （打开新窗口）在任何平台或浏览器上检测我们的提供商
 */
const metaMask = {
  // 初始化并获取账号
  init() {
    return new Promise((resolve, reject) => {
      //检测当前浏览器是否以太坊兼容，并进行相应的处理
      if (typeof window.ethereum === 'undefined') {
        reject(new Error('Consider installing MetaMask!'));
      } else {

        //  如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        window.ethereum.request({ method: 'eth_requestAccounts' })
          //如果用户拒绝了登录请求
          .catch(reason => {
            store.commit("SET_WALLET_CONNECT", false)
            if (reason === 'User rejected provider access') {
              // 用户不想登录，你看该怎么办？
              reject(new Error('用户不想登录，你看该怎么办'));
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              reject(new Error('说明发生了意外'));
            }
          })
          //如果用户同意了登录请求，你就可以拿到用户的账号
          .then(accounts => {
            //一旦获取了用户账号，你就可以签名交易
            if (process.env.VUE_APP_OPEN_SIGN == 'true') {

              let web3 = new Web3(window.ethereum);
              web3.eth.personal.sign(web3.utils.fromUtf8(process.env.VUE_APP_SIGN_TIP), accounts[0], (err, res) => {

                if (res != null && res !== undefined && res !== '') {
                  console.log("签名成功")
                  this.initEvent()
                  store.commit("SET_WALLET_CONNECT", true)
                  store.commit("SET_WALLET_ACCOUNT", accounts[0])
                  store.commit("SET_WALLET_SIGN", res)
                  resolve(accounts)
                  console.log("签名后的数据：", res)
                } else {
                  reject(new Error('签名失败'))
                }
              })
            } else {
              console.log("%c签名功能已关闭,请注意观察钱包登录安全问题", 'color:#ee3f4d;background:#64483d;padding:5px 5px;border-radius: 8px; font-weight: bold;')
              this.initEvent()
              store.commit("SET_WALLET_CONNECT", true)
              store.commit("SET_WALLET_ACCOUNT", accounts[0])
              resolve(accounts)
            }

          })
      }
    })
  },
  // 监控改变事件
  async initEvent() {
    // 帐户更改事件
    window.ethereum.on('accountsChanged', (accounts) => {
      // 如果返回数组中的第一个帐户不是您期望的帐户，您应该通知用户！将来，accounts 数组可能包含多个帐户。但是，数组中的第一个帐户将继续被视为用户的“选定”帐户。
      console.log(accounts)
      store.commit("SET_WALLET_ACCOUNT", accounts[0])
      window.location.reload();
    })
    // 链改变事件
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId)
      store.commit("SET_WALLET_CHAIN_ID", chainId)
      window.location.reload();
    })
    // MetaMask 提供者收到一些应该通知消费者的消息事件
    window.ethereum.on('message', (message) => {
      // 消息类型：ProviderMessage
      // ProviderMessage {
      //   type: string;
      //   data: unknown;
      // }
      console.log(message)
    })
  },
  async initWeb3() {
    let self = this
    await self.init();
    return self.getWeb3();
  },
  async initContract(abis) {
    let self = this
    await self.init();
    let web3 = await self.getWeb3();
    return self.getContract(web3, abis)
  },
  getWeb3() {
    // 初始化web3
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      store.commit('SET_WALLET_WEB3', web3);
      return web3;
    }
    return null;
  },
  async getContract(web3, abis) {
    if (web3 && abis) {
      Object.keys(abis).forEach(key => {
        let contract = new web3.eth.Contract(abis[key].abi, abis[key].address, {
          from: store.state.wallet.account,
          value: 0,
          gas: 600000,
          gaslimit: 10
        })
        store.commit('SET_WALLET_CONTRACT', { key: key, contract: contract })
      })
    }
  },
  // 获取网络。1：以太坊主网； 2：Morden测试链； 3：Ropsten测试链； 4：Rinkeby测试链； 5：歌尔力测试网； 42：Kovan测试链
  getNetworkVersion() {
    if (!window.ethereum) return undefined;
    return window.ethereum.request({ method: 'net_version' })
  },
  // 获取链ID。0x1：以太坊主网； 0x2：Morden测试链； 0x3：Ropsten测试链； 0x4：Rinkeby测试链； 0x5：歌尔力测试网； 0x2a：Kovan测试链
  getChainId() {
    if (!window.ethereum) return undefined;
    return window.ethereum.request({ method: 'eth_chainId' });
  },
  // 获取当前账户
  getAccounts() {
    if (!window.ethereum) return undefined;
    return window.ethereum.request({ method: 'eth_accounts' });
  }
}

const install = Vue => {
  if (install.installedToast) {
    return
  }
  install.installedToast = true
  Object.defineProperties(Vue.prototype, {
    $metaMask: {
      get() {
        return metaMask
      }
    }
  })
}
export default install
