import Vue from 'vue'
import Vuex from 'vuex'

/**
 * 用户token
 */
const USER_NAME = "USER_TOKEN";
/**
 * 语言名称
 */
const LANG_NAME = "USER_LANGUAGE";

Vue.use(Vuex)

let $i18n = null;

function loadStores() {
  const locales = require.context('./modules/', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  const obj = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      obj[locale] = locales(key).default
    }
  })
  return obj
}

const modules = loadStores();

const store = new Vuex.Store({
  state: {
    user: localStorage.getItem(USER_NAME) || '',
    isLoadding: false,
    showLoading: false,
    language: localStorage.getItem(LANG_NAME) || 'zh',
    keepAliveRouteNames: [],
    token:'',
  },
  mutations: {
    setUser(state, user) {
      if (!user.startsWith('Bearer ')) {
        user = 'Bearer ' + user;
      }
      state.user = user
      localStorage.setItem(USER_NAME, user)
    },
    removeUser(state) {
      state.user = '';
      localStorage.removeItem(USER_NAME);
    },
    setLanguage(state, lang) {
      state.language = lang;
      $i18n.locale = lang;
      localStorage.setItem(LANG_NAME, lang);
    },
  },
  actions: {},
  modules: modules
});

export default store;

export function setI18n(i18n) {
  $i18n = i18n;
}
