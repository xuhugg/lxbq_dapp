<template>
  <div>
    <Header title="标题" />
    <van-button @click="aaa">按钮</van-button>
  </div>
</template>

<script>
export default {
  pass: true,
  name: "index",
  data() {
    return {
      // key: value
    };
  },
  mounted() {},
  methods: {
    aaa() {
      this.$nextTick(() => {
        this.blockFun
          .transfer(
            "usdt",
            "0.01",
            "0xfBfEAcB618F2E2DC4327dBe30d0e53b4242D385c"
          )
          .then((res) => {
            console.log(res);
            console.log(123123132132132);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
</style>
