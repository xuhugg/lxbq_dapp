import Vue from 'vue'

////////////   自定义指令   //////////////
// 点击等待，传入一个方法；使用wait-click-time"设置等待时间默认500，单位毫秒。
Vue.directive("wait-click", {
  bind: function (el, params) {
    // 等待时间名称
    const waitClickTimeName = "wait-click-time";
    // 默认等待时间
    const defaultWaitTime = 500;
    let lastClickTime = -1;
    let temp = parseInt(el.getAttribute(waitClickTimeName));
    let waitTime = isNaN(temp) ? defaultWaitTime : temp;
    el.onclick = function (e) {
      let now = new Date().getTime();
      if (
        now - lastClickTime >= waitTime &&
        typeof params.value == "function" &&
        params.value(e) != false
      ) {
        lastClickTime = now;
      }
    };
  },
})