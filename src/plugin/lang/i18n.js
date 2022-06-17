import Vue from 'vue'
import VueI18n from 'vue-i18n'



Vue.use(VueI18n);

function loadStores() {
  const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  const obj = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      if (matched[1] !='i18n'){
        const locale = matched[1]
        obj[locale] = require(`./${locale}`)
      }

    }
  })
  return obj
}
const modules = loadStores();
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh',
  messages: modules
});


export default i18n;
