import store from "../../store";

// 不自动添加的路由，懒得加可以在页面内添加 {{ pass: true, }} 属性
const pass = []

const files = require.context("@/views", true, /\.vue$/);

const autoRoutes = []
const keepNames = [];

files.keys().forEach(key => {
  let item = files(key);

  if (!item.default.pass && pass.indexOf(item) === -1) {
    // 获取文件信息
    let fileInfo = getFileInfo(key, item);

    // 说明这个是子路由，不添加到主路由中
    if (fileInfo.path.indexOf("_children") !== -1) {
      return;
    }

    // 设置路由路径
    let path = "/";
    if (fileInfo.origin[0] != "home" || fileInfo.origin[1] != "index") {
      fileInfo.origin.forEach((p, index) => {
        if ((index != fileInfo.origin.length - 1 || p != "index")) {
          path += path == "/" ? p : `/${p}`;
        }
      });
    }


    // 如果写了urlName 则添加路由参数
    if (item.default.urlName) {
      path += `/:${item.default.urlName}`
    }

    // 设置路由名称
    let name = item.default.name || "";
    if (!name) {
      fileInfo.origin.forEach((p, index) => {
        if ((index != fileInfo.origin.length - 1 || p != "index")) {
          name += index == 0 ? p : initialsToUpperCase(p);
        }
      });
    }
    let children = item.default.children;

    const meta = item.default.routeMeta || {}
    if (!meta.keepAlive) {
      meta.keepAlive = item.default.keepAlive || false;
    }
    if (meta.keepAlive) {
      keepNames.push(name)
    }

    autoRoutes.push({
      path,
      name,
      component: item.default,
      children,
      meta
    })
  }
});

store.state.keepAliveRouteNames = keepNames;

function getFileInfo(key) {
  let result = {};
  let path = key.replace(/(\.\/|\.vue)/g, '').toLowerCase().split("/");
  result.path = path.slice(0, path.length - 1);
  result.fileName = path[path.length - 1];
  result.origin = path;
  return result;
}

function initialsToUpperCase(str) {
  return str.replace(/^\w/, all => all.toUpperCase());
}

export default autoRoutes;