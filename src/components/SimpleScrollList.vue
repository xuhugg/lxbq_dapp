<template>
  <div class="simple-scroll-list" ref="scrollList" @scroll="scroll">
    <div class="list-inner">
      <slot></slot>
    </div>
    <div class="remark" v-show="value || finished">
      <van-loading v-show="!finished && loadingText" size="24px">{{
        loadingText
      }}</van-loading>
      <span v-show="finished">{{ finishedText }}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  model: {
    prop: "value",
    event: "changeLoading",
  },
  props: {
    value: {
      type: Boolean,
    },
    finished: {
      type: Boolean,
    },
    finishedText: {
      type: String,
      default: "没有更多了",
    },
    loadingText: {
      type: String,
      default: "加载中 ...",
    },
  },
  data() {
    return {};
  },
  methods: {
    load() {
      if (!this.value && !this.finished) {
        this.$emit("changeLoading", true);
        this.$emit("load");
      }
    },
    scroll() {
      if (!this.value && !this.finished) {
        let scrollBottom =
          this.$refs.scrollList.scrollHeight -
          this.$refs.scrollList.clientHeight -
          this.$refs.scrollList.scrollTop;
        if (scrollBottom <= 5) {
          this.load();
        }
      }
    },
    getScrollTop() {
      let scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
  },
  components: {},
  created() {
    this.load();
  },
  watch: {
    async value(val) {
      if (!val && !this.finished) {
        this.$sleep(100).then(() => {
          if (
            this.$refs.scrollList.scrollHeight ===
            this.$refs.scrollList.clientHeight
          ) {
            this.scroll();
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.simple-scroll-list {
  height: 100%;
  overflow: auto;

  .remark {
    text-align: center;
    padding-top: 10px;
    color: #cccccc;
  }
}
</style>