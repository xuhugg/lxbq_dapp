import store from '@/store'

// 为请求加载loading
var loadCount = 0;

function start() {
  if (loadCount <= 0) {
    // 显示loadding层
    store.state.isLoadding = true;
  }

  loadCount++;
}

function stop() {
  loadCount--;

  if (loadCount <= 0) {
    // 隐藏loadding层
    store.state.isLoadding = false;
  }
}

export default {
  start,
  stop
}