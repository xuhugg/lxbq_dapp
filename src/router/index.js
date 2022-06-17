import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import autoRouter from "./pages/auto"
// import { getUser } from "@/utils/auth";

Vue.use(VueRouter)

const routes = [
  ...autoRouter // 这个是自动路由
  ,
  //添加底部标签栏
  {
    path: "/",
    component: () => import("@/components/Foot"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/home"),
      },
      {
        path: "/my",
        name: "my",
        component: () => import("@/views/my"),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 不需要检查登录的路径
const noCheckPath = [
  "/login/**",
  "/comm/**"
]

router.beforeEach((to, from, next) => {
  const userInfo = store.state.user;
  for (let i = 0; i < noCheckPath.length; i++) {
    let pass =
      noCheckPath[i] === to.path ||
      (noCheckPath[i].endsWith("/**") &&
        to.path.startsWith(noCheckPath[i].substring(0, noCheckPath[i].lastIndexOf('/'))));

    if (pass) {
      next();
      return;
    }
  }

  if (!userInfo) {
    next({
      // name: 'login'
    })
  } else {
    next()
  }
});

export default router
