<template>
  <span class="code-check" @click="clickIt">
    <slot name="default" v-if="time <= 0">{{ placeholder }}</slot>
    <slot name="time" v-else>{{ format(time) }}</slot>
  </span>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: "获取验证码",
    },
    format: {
      type: Function,
      default: (time) => time + "s",
    },
    interval: {
      type: [String, Number],
      default: 60,
    },
    onRequest: {
      type: Function,
    },
  },
  data() {
    return {
      time: 0,
      timer: -1,
      disabled: false,
    };
  },
  methods: {
    clickIt() {
      if (this.time <= 0) {
        if (typeof this.onRequest === "function") {
          const res = this.onRequest();
          if (res instanceof Promise) {
            res
              .then((msg) => {
                if (msg) {
                  this.$toast(typeof msg === "string" ? msg : "验证码发送成功");
                }
                if(msg !== false){
                  this.setInterval();
                }
              })
              .catch(() => {
                this.clear();
              });
            return;
          }
        }

        if (this.setInterval.clear != this.clear) {
          this.setInterval.clear = this.clear;
        }
        this.$emit("click", this.setInterval);
      }
    },
    setInterval(time = this.interval) {
      time = parseInt(time);
      this.time = isNaN(time) ? 60 : time;
      this.clear();
      this.time--;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          this.$emit("finished", this.temp);
          this.clear(false);
        }
      }, 1000);
    },
    clear(clear = true) {
      if (this.timer !== -1) {
        clear && clearInterval(this.timer);
        this.timer = -1;
        this.time = 0;
        this.$emit("clear", this.temp);
      }
    },
  },
  destroyed() {
    this.clear();
  },
};
</script>

<style scoped lang="less">
</style>