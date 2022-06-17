<template>
  <div :style="{ '--background': background }" class="app-header-placeholder">
    <div :class="{ 'static-bar': staticBar }" class="app-header-vue">
      <div @click="onClickLeft" class="header_left" v-if="!isback">
        <!-- <img src="@/assets/img/back.png" class="header_back" @click="onClickLeft" /> -->
        <slot name="left">
          <img :src="backIcon" class="back-icon" v-if="backIcon" />
          <van-icon name="arrow-left" :style="{ 'color': color}"  size="0.55rem" v-else />
        </slot>
      </div>
      <div :style="{ 'color': color}" @click="dbclick" class="header_title">{{ title }}</div>
      <div @click="onClickRight" class="header_right" :style="{ 'color': color}">
        <slot name="right" >{{ rightText }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * /////////// prop ///////////
   * {title:String} 标题，默认值""，可选值任意字符串
   * {isback:Boolean} 是否展示返回键，默认值展示，传入true隐藏返回键
   * {url:String} 点击返回键跳转的路由，默认值返回上一页，可传入任意页面路由
   * {righturl:String} 点击右侧区域跳转的路由，默认不跳转，可传入任意页面路由
   * {rightText:String} 右侧区域文字，默认不显示，可选值任意字符串
   * {background:String} 头部栏背景色，默认透明，可选值任意可被css3解析的颜色值
   *
   * 2021/11/25
   * {color:String} 标题颜色，默认黑色，可传递任意可被解析的颜色值
   *
   * /////////// event ///////////
   * clickRight:Function 点击右侧区域事件，事件参数为一个回调方法，调用此回调方法阻止路由跳转
   * clickLeft:Function 点击左侧区域事件，事件参数为一个回调方法，调用此回调方法阻止路由跳转
   * dbclick:Function 双击标题事件
   *
   * /////////// slot /////////////
   * right->右侧区域插槽
   * left->左侧区域插槽
   */
  export default {
    props: {
      title: {
        type: String,
        default: "",
      },
      isback: {
        type: Boolean,
        default: false,
      },
      url: {
        type: String,
        default: "",
      },
      righturl: {
        type: String,
      },
      rightText: {
        type: String,
        default: "",
      },
      staticBar: {
        type: Boolean,
        default: false,
      },
      background: {
        type: String,
        default: "white",
      },
      backIcon: {
        type: String,
      },
      color: {
        type: String,
      }
    },
    data() {
      return {
        lastClick: -1,
      };
    },
    methods: {
      dbclick() {
        let now = new Date().getTime();
        if (now - this.lastClick <= 500) {
          this.$emit("dbclick", "安迪烦的");
        }
        this.lastClick = now;
      },
      onClickLeft() {
        this.onClickBtn("clickLeft", this.url);
      },
      onClickRight() {
        this.onClickBtn("clickRight", this.righturl);
      },
      onClickBtn(event, url) {
        let res = true;
        this.$emit(event, () => {
          res = false;
        });
        if (!res || url == undefined) {
          return;
        }
        if (url === "") {
          this.$router.go(-1);
        } else {
          this.$router.push(url);
        }
      },
    },
  };
</script>

<style lang="less" scoped="scoped">
  .app-header-placeholder,
  .app-header-vue {
    height: @app-header-height;
  }

  .app-header-vue {
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    background: var(--background);

    &.static-bar {
      position: relative;
    }
  }

  .header_left,
  .header_right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: @theme-color;
    font-size: 13px;
  }

  .header_left {
    left: 10px;
  }

  .header_title {
    font-size: 18px;
    color: @theme-color;
  }

  .back-icon {
    width: 29px;
    height: 29px;
    vertical-align: middle;
  }

  .header_i_back {
    font-size: 22px;
    vertical-align: middle;
  }

  .header_right {
    right: 10px;
  }
</style>
