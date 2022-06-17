// import Vue from 'vue'
const model = {
  state: {
    connect: false, account: '', netVersion: '', chainId: '', web3: undefined, contract: {}, balance: {},
  },
  mutations: {
    // 是否连接
    SET_TRON_CONNECT: (state, data) => {
      state.connect = data
    }, // 钱包账户
    SET_TRON_ACCOUNT: (state, data) => {
      state.account = data
    }, // 网络版本
    SET_TRON_NET_VERSION: (state, data) => {
      state.netVersion = data
    }, // 链ID
    SET_TRON_CHAIN_ID: (state, data) => {
      state.chainId = data
    }, // web3对象
    SET_TRON_WEB3: (state, data) => {
      state.web3 = data
    }, // contract合约对象
    SET_TRON_CONTRACT: (state, data) => {
      state.contract[data.key] = data.contract
    }, // contract合约对象
    SET_TRON_BALANCE: (state, data) => {
      state.balance[data.key] = data.balance
    }

  },
  actions: {

  }
}
export default model
