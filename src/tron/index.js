function tronLoadAbis() {
  var locales = []
  if (process.env.NODE_ENV == 'production') {
    locales = require.context('./tronChain/', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  }
  if (process.env.NODE_ENV == 'development') {
    locales = require.context('./testChain/', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  }
  const obj = {}
  if (locales.length == 0) {
    return
  }
  locales.keys().forEach(key => {

    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      obj[locale] = locales(key)
      obj[locale].name = locale
    }
  })
  // console.log(obj)
  return obj
}

const tron = tronLoadAbis();
const install = Vue => {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    // 注意，此处挂载在 Vue 原型的 $ethChain 对象上
    $trons: {
      get() {
        return tron
      }
    },
  })
}
export default install
