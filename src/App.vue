<template>
  <div id="app">
    <!--    遮罩-->
    <van-overlay :show="show">
      <div class="loading" v-if="newLoading == 'true'">
        <div>
          <div class="c1"></div>
          <div class="c2"></div>
          <div class="c3"></div>
          <div class="c4"></div>
        </div>
        <span>loading</span>
      </div>
      <van-loading type="spinner" v-else />
    </van-overlay>
    <transition mode="out-in" name="router-switch">
      <keep-alive :include="$store.state.keepAliveRouteNames">
        <router-view />
      </keep-alive>
    </transition>
    <!--    <van-overlay :show="$store.state.isLoadding" @click.stop z-index="2999">-->
    <!--      <div class="loadding-out">-->
    <!--        <van-loading class="all-loadding" type="spinner" />-->
    <!--      </div>-->
    <!--    </van-overlay>-->
  </div>
</template>

<script type="text/ecmascript-6">
import * as VConsole from "vconsole";
export default {
  data() {
    return {
      // key: value
      show: this.$store.state.showLoading,
      newLoading: process.env.VUE_APP_NEW_LOADING,
    };
  },
  created() {
    if (process.env.VUE_APP_OPEN_CHECK_NETWORK == "true") {
      let web3 = this.$metaMask.getWeb3();
      window.ethereum.request({ method: "eth_chainId" }).then((res) => {
        if (
          res != web3.utils.numberToHex(Number(process.env.VUE_APP_CHAIN_ID))
        ) {
          setInterval(() => {
            this.show = true;
            this.$toast({
              duration: 0,
              message:
                "当前链ID与配置ID不一致，请到app.vue 文件50行修改提示语句",
            });
          }, 800);
          this.$toast({
            duration: 0,
            message: "当前链ID与配置ID不一致，请到app.vue 文件50行修改提示语句",
          });
        }
      });
    }

    console.log(
      "%c+",
      `font-size: 1px;
  padding: 100px 181px;
  background-image: url(https://boooxxx.oss-cn-beijing.aliyuncs.com/1.jpg);
  background-size: contain;
  background-repeat: no-repeat;
  color: transparent;`
    );
    // 检测更新
    // window.changeversion = this.checkUpdate;
  },
  mounted: function () {
    let self = this;
    if (process.env.VUE_APP_OPEN_WEB3 == "true") {
      console.log(
        "%cweb3开启",
        "padding: 5px 10px; border-radius: 18px ; color: #fff; background: #606060; font-weight: bold;"
      );
      console.log(
        "%c由于DAPP的特殊性，token不建议存储在本地，推荐使用Vuex,如需使用请在env中开启",
        "color:#fffefa;padding: 5px 10px; border-radius: 18px ;  background: #606060; font-weight: bold;"
      );

      self.$metaMask.init().then(() => {
        // 初始化web3
        let web3 = self.$metaMask.getWeb3();
        // 遍历合约对象
        self.$metaMask.getContract(web3, self.$abi);
      });
    }
    if (process.env.VUE_APP_OPEN_WEB3_TRON == "true") {
      console.log(
        "%c由于DAPP的特殊性，token不建议存储在本地，推荐使用Vuex,如需使用请在env中开启",
        "color:#fffefa;padding: 5px 10px; border-radius: 18px ;  background: #606060; font-weight: bold;"
      );
      console.log(
        "%cTron开启",
        "padding: 0px 10px; border-radius: 18px ; color: #fff; background: #606060; font-weight: bold;"
      );
      self.$tron.init().then(() => {
        //初始化
        let web3 = self.$tron.getTronWeb();
        //注册合约
        self.$tron.getTronContract(web3, self.$trons);
      });
    }
    if (process.env.VUE_APP_OPEN_VCONSOLE == "true") {
      new VConsole();
    }
  },
  methods: {
    checkUpdate(...arg) {
      let version = arg[0].toString().split("").join(".");
      this.$post({
        module: "Utils",
        interface: "1002",
        data: {
          platform: 1,
          version,
        },
      })
        .then((res) => {
          window.test.version(JSON.stringify(res));
        })
        .catch((err) => {
          console.log("检测更新失败", err);
        });
    },
  },
  computed: {
    f1() {
      return this.$store.state.showLoading;
    },
  },
  watch: {
    //使用watch 监听$router的变化
    $route: {
      handler() {
        if (process.env.VUE_APP_ROUTER_LOADING == "true") {
          this.show = true;
          setTimeout(() => {
            this.show = false;
          }, Number(process.env.VUE_APP_ROUTER_LOADING_TIME));
        }
      },
      // 深度观察监听
      deep: true,
    },
    f1(curVal) {
      // console.log(curVal) -0
      if (process.env.VUE_APP_POST_LOADING == "true") {
        this.show = curVal;
      }
    },
  },
};
</script>

<style lang="less">
@import url("./css/public.css");

/** 过度动画 */
.router-switch-enter-active,
.router-switch-leave-active {
  transition: opacity 0.3s;
}
.router-switch-enter,
.router-switch-leave-to {
  opacity: 0;
}

/** 卡片打开关闭动画 */
.anim-simple-up-enter-active,
.anim-simple-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.anim-simple-up-enter,
.anim-simple-up-leave-to {
  opacity: 0;
  transform: translateY(-50%) scaleY(0.5);
}

*::-webkit-scrollbar {
  display: none;
}

#app {
  min-height: 100vh;
  background-color: @default-color;
  color: @base-color;
  font-size: @base-size;
}

body {
  margin: 0;
  overflow: auto;
}

button {
  outline: none;
  border: none;
}

input {
  background: unset;
  outline: none;
  border: none;
  width: 100%;
  color: inherit;

  &::placeholder {
    color: @holder-color;
  }
}

* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;

  &.router-link {
    color: @theme-color;
  }
}

.loadding-out {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.van-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: @theme-color !important;
}
.van-overlay {
  /*z-index: 99999 !important;*/
}

.loading {
  width: 100%;
  height: 100%;
  position: fixed;
}

.loading > div {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 50%;
  margin-left: -30px;
  top: 50%;
  margin-top: -30px;
}

.loading > div > div {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: @theme-color !important;
  top: 10px;
  left: 10px;
  transform-origin: 20px 20px;
  border-radius: 8px;
  animation: spin-a 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
}

.loading > div > .c2 {
  top: 10px;
  left: auto;
  right: 10px;
  transform-origin: -4px 20px;
  animation: spin-b 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
}
.loading > div > .c3 {
  top: auto;
  left: auto;
  right: 10px;
  bottom: 10px;
  transform-origin: -4px -4px;
  animation: spin-c 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
}
.loading > div > .c4 {
  top: auto;
  bottom: 10px;
  transform-origin: 20px -4px;
  animation: spin-d 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
}

@keyframes spin-a {
  0% {
    transform: rotate(90deg);
  }
  0% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spin-b {
  0% {
    transform: rotate(90deg);
  }
  25% {
    transform: rotate(90deg);
  }
  25% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spin-c {
  0% {
    transform: rotate(90deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spin-d {
  0% {
    transform: rotate(90deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading > span {
  width: 100px;
  height: 30px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 50%;
  margin-top: 30px;
  color: @theme-color !important;
  font-size: 12px;
  text-align: center;
}

.content {
  padding: 1.5em;
}
</style>
