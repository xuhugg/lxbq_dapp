<template>
  <div class="simple-kline">
    <van-tabs v-model="currentTime" v-if="showTab" @change="changeTab">
      <van-tab
        :title="item.name"
        :name="item.time"
        v-for="item in times"
        :key="item.time"
        title-style="flex-basis: 15%;"
      ></van-tab>
    </van-tabs>
    <div class="simple-kline-charts-box">
      <div class="simple-kline-charts-top-bar" v-if="showTopBar">
        <div class="top-bar-item">
          <span>MA5 {{ MA5 }}</span>
        </div>
        <div class="top-bar-item">
          <span>MA10 {{ MA10 }}</span>
        </div>
      </div>
      <div class="simple-kline-charts" ref="klineCharts"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
var echarts = require("echarts");

/**
 *
 * @property { Boolean } loading 是否在加载中，当手动修改loading的值的时候，会进行一次数据加载，建议使用.sync修饰
 */
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: String,
      default: "1min",
    },
    showTab: {
      type: Boolean,
      default: true,
    },
    times: {
      type: Array,
      default() {
        return [
          { name: "1分", time: "1min" },
          { name: "5分", time: "5min" },
          { name: "15分", time: "15min" },
          { name: "30分", time: "30min" },
          { name: "1时", time: "60min" },
          { name: "4时", time: "4hour" },
          { name: "1日", time: "1day" },
          { name: "1周", time: "1week" },
          { name: "1月", time: "1mon" },
          { name: "1年", time: "1year" },
        ];
      },
    },
    // 这个东西好像冇用
    showTopBar: {
      type: Boolean,
      default: false,
    },
    kData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 跌的颜色
    downColor: {
      type: String,
      default: "#fc4261",
    },
    // 涨的颜色
    upColor: {
      type: String,
      default: "#01ac92",
    },
    maColors: {
      type: Array,
      default() {
        return ["#66ccff", "#ff0000", "#00ffff", "#ff00ff"];
      },
    },
    barMaxWidth: {
      type: Number,
      default: 6,
    },
    pageNumber: {
      type: Number,
      default: 20,
    },
    markLines: {
      type: Array,
      default() {
        return [
          {
            type: "max",
            valueDim: "close",
          },
        ];
      },
    },
  },
  data() {
    return {
      currentTime: "1min",
      klineCharts: null,
      MA5: "-",
      MA10: "-",
      datas: {
        times: [],
        open: [],
        close: [],
        highest: [],
        lowest: [],
        volumes: [],
        values: [], // open, close, lowest, highest
      },
    };
  },
  methods: {
    /**
     * 获取dataZoom的start参数，
     *
     * @param { Number } total 总数据条数
     * @param { Number } show 要展示的条数
     * @returns { Number } 返回dataZoom的start值
     */
    getStart(total, show) {
      return total <= show ? 0 : 100 - Math.floor((show / total) * 100);
    },
    /**
     * 计算MA
     */
    calculateMA(dayCount, values) {
      let result = [];
      for (let i = 0, len = values.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    },
    /**
     * 获取echarts数据
     */
    async getData() {
      let that = this;
      try {
        await this.$emit("loadData", {
          time: this.currentTime,
          callback(dataList) {
            // console.log(this.time);
            that.parseKData(dataList);
          },
        });
      } catch (e) {
        console.log("数据加载失败", e);
      }
    },
    /**
     * 切换tab栏时触发的事件
     */
    changeTab() {
      this.getData();
    },
    /**
     * 解析传入的数据
     * {
     *  id: "秒数时间戳",
     *  open: "开盘价",
     *  close: "收盘价",
     *  high: "最高价",
     *  low: "最低价",
     *  vol: "成交量",
     *  amount: "成交额（冇用）"
     * }
     *
     * @param {Array} dataList 数据对象数组
     */
    parseKData(dataList) {
      Object.keys(this.datas).forEach((key) => {
        this.datas[key] = [];
      });
      if (dataList.length == 0) {
        return;
      }
      dataList.forEach((e, i) => {
        // open, close, lowest, highest
        let value = [
          Number(e.open),
          Number(e.close),
          Number(e.low),
          Number(e.high),
        ];
        // time
        this.datas.times.push(new Date(e.id * 1000).format("MM-dd hh:mm:ss"));
        // open
        this.datas.open.push(value[0]);
        // close
        this.datas.close.push(value[1]);
        // lowest
        this.datas.lowest.push(value[2]);
        // highest
        this.datas.highest.push(value[3]);
        // volumes
        this.datas.volumes.push([i, Math.floor(e.vol * 100) / 100, value[0] > value[1] ? 1 : -1]);
        // values: open, close, lowest, highest
        this.datas.values.push(value);
      });
      // console.log(this.datas.volumes.length);
      // this.dataList.sort();
      // this.kdjList.sort();

      // 判断echarts实例是否已经初始化
      if (this.klineCharts) {
        // 已经初始化了，直接设置数据
        this.setOptionData();
      } else {
        // 没有初始化，先进行初始化
        this.initCalculate();
      }
    },
    /**
     * 进行一些舒适化的数据计算处理
     */
    initCalculate() {
      let that = this;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: 4,
          // backgroundColor: "rgba(0,0,0,0.5)",
          textStyle: {
            color: "#ffffff",
          },
          confine: true,
          position: function (pos, params, el, elRect, size) {
            let result = { top: "0" };
            result[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 10;
            return result;
          },
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777",
          },
        },
        visualMap: {
          show: false,
          seriesIndex: 5,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: that.downColor,
            },
            {
              value: -1,
              color: that.upColor,
            },
          ],
        },
        grid: [
          {
            left: "1%",
            right: "15%",
            height: "70%",
            top: 10,
          },
          {
            left: "1%",
            right: "15%",
            bottom: "5%",
            height: "18%",
          },
        ],
        xAxis: [
          {
            type: "category",
            data: [], // that.datas.times 横坐标，时间
            scale: true,
            boundaryGap: true,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100,
            },
          },
          {
            type: "category",
            gridIndex: 1,
            data: [], // that.datas.times 横坐标，时间
            scale: false,
            boundaryGap: true,
            axisLine: {},
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: true },
          },
        ],
        yAxis: [
          {
            type: "value",
            position: "right",
            scale: true,
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: "#999999",
              },
            },
            axisTick: {
              show: true,
            },
          },
          {
             scale: true,
            type: 'value',
            position: "right",
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: true },
            axisLine: {
              show: true,
              onZero: false,
            },
            axisTick: { show: true },
            splitLine: { show: true },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0, 1],
            start: 0,
            end: 100,
            // filterMode: "none",
          },
        ],
        series: [
          {
            name: "K-Line",
            type: "candlestick",
            data: [], // that.datas.values k线图的值
            itemStyle: {
              color: that.upColor,
              color0: that.downColor,
              borderColor: null,
              borderColor0: null,
            },
            markLine: {
              silent: true,
              symbol: "",
              label: {
                margin: 0,
                color: "#666",
                position: "end",
              },
              lineStyle: {
                // type: "dotted",
                color: "#333",
              },
              data: [], // that.markLines 横线
            },
            barMaxWidth: that.barMaxWidth,
          },
          {
            name: "MA5",
            type: "line",
            data: [], //  that.calculateMA(5, that.datas.values) MA5线
            smooth: true,
            symbol: "none",
            lineStyle: {
              opacity: 0.5,
              color: that.maColors[0],
            },
          },
          {
            name: "MA10",
            type: "line",
            data: [], // that.calculateMA(10, that.datas.values) MA10线
            smooth: true,
            symbol: "none",
            lineStyle: {
              opacity: 0.5,
              color: that.maColors[1],
              width: 1.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: [], // that.calculateMA(20, that.datas.values) MA20线
            smooth: true,
            symbol: "none",
            lineStyle: {
              opacity: 0.5,
              color: that.maColors[2],
              width: 1.5,
            },
          },
          {
            name: "MA30",
            type: "line",
            data: [], // that.calculateMA(30, that.datas.values) MA30线
            smooth: true,
            symbol: "none",
            lineStyle: {
              opacity: 0.5,
              color: that.maColors[3],
              width: 1.5,
            },
          },
          {
            name: "Volume",
            type: "bar",
            // large: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            barMaxWidth: that.barMaxWidth,
            data: [], // that.datas.volumes 柱状图的值
            itemStyle: {
              color: "black",
            },
          },
        ],
      };
      this.klineCharts.setOption(option, true);
      this.setBarWidth();
      this.setStart();
      this.setMarkLines();
      this.setOptionData();
    },
    /**
     * 设置dataZoom的start参数
     */
    setStart() {
      if (this.klineCharts) {
        let option = this.klineCharts.getOption();
        option.dataZoom[0].start = this.getStart(
          this.datas.times.length,
          this.pageNumber
        );
        this.klineCharts.setOption(option);
      }
    },
    /**
     * 统一设置柱状图宽度
     */
    setBarWidth() {
      if (this.klineCharts) {
        let option = this.klineCharts.getOption();
        option.series[0].barMaxWidth = this.barMaxWidth;
        option.series[5].barMaxWidth = this.barMaxWidth;
        this.klineCharts.setOption(option);
      }
    },
    /**
     * 设置颜色
     */
    setColor() {
      if (this.klineCharts) {
        let option = this.klineCharts.getOption();
        option.visualMap.pieces[0].color = this.downColor;
        option.visualMap.pieces[1].color = this.upColor;
        option.series[0].itemStyle.color = this.upColor;
        option.series[0].itemStyle.color0 = this.downColor;
        this.klineCharts.setOption(option);
      }
    },
    /**
     * 设置echarts内的option数据
     */
    setOptionData() {
      if (this.klineCharts) {
        let option = this.klineCharts.getOption();
        if (!option) {
          this.initCalculate();
          return;
        }
        // 设置横坐标时间
        option.xAxis[0].data = this.datas.times;
        option.xAxis[1].data = this.datas.times;
        // 设置k线图数据
        option.series[0].data = this.datas.values;
        // 设置MA线数据
        option.series[1].data = this.calculateMA(5, this.datas.values);
        option.series[2].data = this.calculateMA(10, this.datas.values);
        option.series[3].data = this.calculateMA(20, this.datas.values);
        option.series[4].data = this.calculateMA(30, this.datas.values);
        option.series[5].data = this.datas.volumes;
        // 等价于上面4句
        // for (let i = 1; i <= 4; i++) {
        //   option.series[i].data = this.calculateMA(
        //     i > 2 ? i * 5 + (i - 2) * 5 : i * 5,
        //     this.datas.values
        //   );
        // }
        this.klineCharts.setOption(option);
      }
    },
    setMarkLines() {
      if (this.klineCharts) {
        let option = this.klineCharts.getOption();
        option.series[0].markLine.data = this.markLines;
        this.klineCharts.setOption(option);
      }
    },
  },
  components: {},
  mounted() {
    this.klineCharts = echarts.init(this.$refs.klineCharts);
  },
  created() {
    this.currentTime = this.defaultTime || this.times[0].time;
    this.getData();
  },
  destroyed() {
    if (this.klineCharts && !this.klineCharts.isDisposed()) {
      this.klineCharts.clear();
      this.klineCharts.dispose();
    }
  },
  watch: {
    pageNumber() {
      this.setStart();
    },
    barMaxWidth() {
      this.setBarWidth();
    },
    downColor() {
      this.setColor();
    },
    upColor() {
      this.setColor();
    },
    loading() {
      this.getData();
    },
    markLines() {
      this.setMarkLines();
    },
  },
};
</script>

<style scoped lang="less">
.simple-kline {
  min-height: 400px;
  display: flex;
  flex-direction: column;

  .simple-kline-charts-box {
    flex: 1;
    position: relative;

    .simple-kline-charts-top-bar {
      position: absolute;
      top: 0px;
      left: 0px;
      display: flex;
      align-items: center;
      padding: 15px;

      .top-bar-item {
        font-size: 14px;
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .simple-kline-charts {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
}
</style>