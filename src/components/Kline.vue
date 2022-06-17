<template>
  <div class="kline">
    <div class="top comBg">
      <div class="top-head">
        <img @click="show = true" src="../assets/home/menu_unfold@2x.png" alt="" />
        <p>
          {{ title.name }} <span>/{{ title.quote }}</span>
        </p>
      </div>
      <div class="top-center">
        <p :class="['close', title.change < 0 ? 'red' : 'green']">
          {{ title.close }}
        </p>
        <p>
          <span>{{ title.max_price }}</span>
          <span style="color: #687595">24h最高</span>
        </p>
      </div>
      <div class="top-center">
        <p class="rmb">
          <span> ≈{{ title.closeCNY }} CNY</span>
          <span :class="[title.change < 0 ? 'red' : 'green']">{{ title.change }}%</span>
        </p>
        <p>
          <span>{{ title.min_price }}</span>
          <span style="color: #687595">24h最低</span>
        </p>
      </div>
    </div>
    <div class="fenge"></div>
    <div class="kline_padding">
      <van-tabs color="#01AC92" title-active-color="#01AC92" title-inactive-color="#333333" line-width="20" @change="tabClick" :active="time">
        <div v-for="(i, index) in date" :key="index">
          <van-tab title-style='flex-basis:20%' :title="i.name" :name="i.time" />
        </div>
      </van-tabs>
      <div class="echartBox" style="width: 100%; overflow: auto">
        <div id="echartContainer" ref="echartContainer" style="width: 100%; height: 100%"></div>
        <div v-if="false" class="center">
          <div class="vol-box pos-box" id="Posvoldata">
            成交量 {{ Number(vol).toFixed(4) }}
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="left" :style="{ width: '80%', height: '100%' }">
      <div class="popupBox">
        <div class="top-head flex-between">
          <h5>周期合约</h5>
          <img src="../assets/home/menu_unfold@2x.png" alt="" />
          <!-- <p>{{name}} <span>/{{quote}}</span></p> -->
        </div>
        <ul>
          <li @click="goUrl(item.sid)" v-for="item in symbolList" :key="item.sid">
            <p>
              <span> {{ item.name }}/{{ item.quote }}</span>
              <span :class="item.change < 0 ? 'red' : ''">{{
                item.close
                }}</span>
            </p>
            <p>{{ item.zname }}</p>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>
<script>
import echarts from "echarts";

Date.prototype.Format = function(fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

export default {
  props: {
    type: {
      type: String,
    },
  },
  data() {
    return {
      time: "1min",
      date: [
        { name: "1分", time: "1min" },
        { name: "5分", time: "5min" },
        { name: "15分", time: "15min" },
        { name: "30分", time: "30min" },
        { name: "1时", time: "60min" },
        { name: "4时", time: "4hour" },
        { name: "1日", time: "1day" },
        { name: "1周", time: "1week" },
        { name: "1月", time: "1mon" },
        // { name: "1年", time: "1year" },
      ],
      show: false,
      data: [],
      symbolList: [],
      txt: "",
      id: "",
      title: "",
      kdjData: [],
      period: "",
      ma5: "",
      ma10: "",
      vol: "",
      macd: "",
      target: "",
      K: "",
      D: "",
      J: "",
      //option: {},
      picType: "macd", //macd kdj
      timer: "",
      timerK: "",
      i: 0,
      s: 0,
      charts: "",
      option: "",
      name: "",
      quote: "",
      startLunxun: false,
      data0: [],
      timerM:"",
      cny:'',
      socket:'',
    };
  },
  watch:{
    data0(data0){
      let option = {
          xAxis: [{
            data: data0.categoryData
          }, {
            data: data0.categoryData
          }],
          series: [{
            data: data0.values,
            markLine: {
              symbol: "",
              data: [{
                yAxis: data0.values.length == 0 ?
                  0 : data0.values[data0.values.length - 1][1],
                label: {
                  margin:0,
                  color:"#eee",
                  position: "end",
                  // padding: 0,
                  backgroundColor:"rgba(0,0,0,0.5)",
                  // width:150,
                  // height:22,
                  // lineHeight:22,
                  padding:[3,3,1,3]
                },
                lineStyle: {
                  type: "dotted",
                  color: "#333"
                }
              }, ],
            }
          }, {data: this.calculateMA(5,data0)}, {data: this.calculateMA(10,data0)}, {data: this.calculateMA(30,data0)}, {
            data: data0.vols,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList;
                  if (data0.values[params.dataIndex][1] > data0.values[params.dataIndex][0]) {
                    colorList = '#01ac92';
                  } else {
                    colorList = "#fc4261";
                  }
                  return colorList;
                },
              }
            }
          }]
        };
        this.charts.setOption(option);
      // console.log(data0.values[149])
    }
  },
  mounted() {
    this.id = this.$route.query.id ? this.$route.query.id : "1";
    //获取人民币价格
    // this.getCNY();
    // this.initTitle();
    this.init();
    
    this.initECharts();
    this.initData('1min');
   
  },
  beforeDestroy() {
    this.socket.onclose = this.close
  },
 
  methods: {
    // getCNY(){
    //   // 市场行情
    //   this.$post({
    //     url: "/portal/Digiccy",
    //     interface: "4000",
    //     module: "Market",
    //     noLoading:true,
    //   }).then((res) => {
    //     this.cny = res.cny
    //   });
    // },
    init: function () {

      if(typeof(WebSocket) === "undefined"){
          alert("您的浏览器不支持socket")
      }else{
        // 实例化socket
        this.socket = new WebSocket(process.env.VUE_APP_SOCKET_URL)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
        // console.log("socket连接成功")
    },
    error: function () {
        console.log("连接错误")
    },
    getMessage: function (msg) {
      var data = JSON.parse(msg.data)
      //更新价格的处理
        // console.log('推送消息',data)
      if(data.type == 'newprice' && this.id == data.sid){ 
        data.closeCNY = (data.close * this.cny).toFixed(2);
        //设置头数据
        this.title = data
        // this.$emit("getvalue", data);
        this.$emit("getDate", data);
      }
      //列表
      if(data.sid<5){
        this.$set(this.symbolList,(data.sid-1),data);
      }
      //是当前选择的
      if(data.type == 'tradingvew' && this.id==data.id && this.time==data.period){
        if(this.oldList.length > 0){
          // console.log('k线图',data)
          //如果推送的是最后一个
          if(this.oldList[this.oldList.length-1].id == data.time){
            this.$set(this.oldList, (this.oldList.length-1), {
              id:data.time,
              amount:parseFloat(data.amount),
              close:parseFloat(data.close),
              count:data.count,
              high:parseFloat(data.high),
              low:parseFloat(data.low),
              open:parseFloat(data.open),
              vol:data.vol
            });

            //更新K线图数据
            let data0 = this.splitData(this.oldList);
            this.data0 = data0;
          }
          else{
            this.oldList.push({
              id:data.time,
              amount:parseFloat(data.amount),
              close:parseFloat(data.close),
              count:data.count,
              high:parseFloat(data.high),
              low:parseFloat(data.low),
              open:parseFloat(data.open),
              vol:data.vol
            })
            //更新K线图数据
            let data0 = this.splitData(this.oldList);
            this.data0 = data0;
          }
        }
        // console.log('k线图',data)
      }
    },

    close: function () {
      console.log("socket已经关闭")
      
    },
    //返回上一页
    onClickLeft() {
      this.$router.go(-1);
    },
    goUrl(id) {
      this.data = [];
      this.oldList = [];
      this.kdjData = [];
      this.id = id;
      this.$emit("change", id);
      this.charts.clear();
      this.initECharts();
      this.time = '1min';
      // this.socket.onclose = this.close
      this.initData("1min");
      this.show = false;
      // this.initTitle();
    },
    initTitle() {
      
    },
    async initData(e) {
      await this.$post({
        url: "/portal/Digiccy",
        module: "Market",
        interface: "2000",
        data: {
          id: this.id,
          period: e,
          size: "150",
        },
        noLoading: true,
      }).then((res) => {
        // clearInterval(this.timerM);
        this.oldList = res.list;
        this.cny = res.cny
        this.title = res.info;
        // console.log('接口获得的数据',res.list[149].close)
        let data0 = this.splitData(res.list);
        this.data0 = data0;
        // this.init();
        this.$emit("getvalue", res.info)
        
      });
    },

    //格式化数据用
    splitData(rawData) {
      var categoryData = [];
      var values = [];
      var vols = [];
      var macds = [];
      var difs = [];
      var deas = [];
      for (var i = 0; i < rawData.length; i++) {
        var date = new Date(rawData[i]['id'] * 1000).Format("yyyy-MM-dd hh:mm:ss");
        //追加x轴
        categoryData.push(date.slice(5));
        values.push([rawData[i]['open'], rawData[i]['close'], rawData[i]['low'], rawData[i]['high'], rawData[i]['vol']])
        // values1.push([rawData[i]['open1'], rawData[i]['close1'], rawData[i]['low1'], rawData[i]['high1'], rawData[i]['vol1']])
        vols.push(rawData[i]['vol']);
      }
      // console.log(values);
      return {
        categoryData: categoryData,
        values: values,
        values1: [],
        vols: vols,
        macds: macds,
        difs: difs,
        deas: deas
      };
    },
    calculateMA(dayCount,data0) {
      // console.log(dayCount,data0.values.length);
      var result = [];
      for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        // if(i==149){
        //   console.log(data0.values[i])
        // }
        for (var j = 0; j < dayCount; j++) {
          sum = parseFloat(sum) +parseFloat(data0.values[i - j][1]);
        }
        var close1 = data0.values[i][1];
        var fLength = 2;
        if(close1>0){
          var split = close1.toString().split(".");
          if(split[1]){
            fLength = split[1].length;
            // console.log(fLength)
          }
        }
        var re = parseFloat(sum / dayCount).toFixed(fLength);
        result.push(re);
      }

      return result;
    },
    //初始化一个空的echarts
    initECharts() {
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          position: ["5%", "0%"]
        },
        grid: [{
          left: '3%',
          right: '10%',
          top: '1%',
          height: '75%',
          width:'81%'
        }, {
          left: '3%',
          right: '10%',
          top: '80%',
          height: '20%',
          width:'81%'
        }],
        xAxis: [{
          boundaryGap: true,
          // inverse: true,
          type: 'category',
          scale: true,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#4a657a',
            }
          },
          splitLine: {
            show: false
          },
          splitNumber: 20
        }, {
          type: 'category',
          // inverse: true,
          gridIndex: 1,
          axisLabel: {
            show: false
          },

        }],
        yAxis: [{
          scale: true,
          splitArea: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: '#4a657a',
            }
          },
          axisLabel: {
            textStyle: {
              color: "#666666",
            },
            // formatter: function(value) {
            //   return value.toFixed(2);
            // }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#4a657a",
              type: "dashed",
            },
          },
          position: 'right'
        }, {
          gridIndex: 1,
          splitNumber: 5,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#4a657a'

            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true
          },
          position: 'right'
        }],
        dataZoom: [{
          type: 'inside',
          start: 75,
          end: 100
        }, {
          show: false,
          type: 'slider',
          y: '90%',
          xAxisIndex: [0, 1],
          start: 75,
          end: 100
        }],
        series: [{
          name: 'KLINE',
          type: 'candlestick',
          markPoint: {
            data: []
          },
          markLine: {
            silent: true,
            data: []
          },
          itemStyle: {
            color: "#01ac92",
            color0: "#fc4261",
            borderColor: "#01ac92",
            borderColor0: "#fc4261",
          },
        }, {
          name: 'MA5',
          type: 'line',
          showSymbol: false,
          
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5,
              width:1.0
            }
          }
        }, {
          name: 'MA10',
          type: 'line',
          showSymbol: false,
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5,
                width:1.0
            }
          }
        }, {
          name: 'MA30',
          type: 'line',
          showSymbol: false,
          smooth: false,
          lineStyle: {
            normal: {
              opacity: 0.5,
                width:1.0
            }
          }
        }, {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,

        }]
      };
      this.charts = echarts.init(this.$refs.echartContainer);
      this.charts.off("click");
      // 使用刚指定的配置项和数据显示图表。
      this.charts.setOption(option);
    },

    tabClick(e) {
      this.data = [];
      this.oldList = [];
      this.kdjData = [];
      this.time = e;
      // let option = {
      //     xAxis: [{
      //       data: []
      //     }, {
      //       data: []
      //     }],
      //     series: [{
      //       data: []
      //     }, {data: []}, {data: []}, {data: []}, {
      //       data: []
      //     }]
      //   };
      this.charts.clear();
      this.initECharts();
      // this.socket.onclose = this.close
      //渲染K线图
      this.initData(this.time)
    },
    async lunxun() {
      // this.startLunxun = true
      // while (this.startLunxun) {
      //   await this.initData(this.time)
      //   await this.$sleep(1000)
      // }
    }
  },
};
</script>
<style lang="less" scoped>
.tu {
  width: 16px;
}

.red {
  color: red !important;
}

.popupBox {
  padding: 50px 18px;

  ul {
    margin-top: 20px;

    li {
      p {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 24px;

        span:nth-child(2) {
          color: green;
        }
      }

      // height: 50px;
      font-size: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 8px 0 8px 10px;
    }
  }
}

.top-head {
  display: flex;
  align-items: center;

  h5 {
    font-size: 30px;
  }

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}

.top {
  .top-center {
    display: flex;
    align-items: center;
    justify-content: space-between;

    // margin-top: 20px;
    .close {
      color: #01ac92;
      font-size: 24px;
    }

    p:nth-child(2) {
      span {
        margin-left: 10px;
      }
    }

    .rmb {
      font-size: 14px;
      display: flex;
      align-items: center;
      color: #8d99b6;

      span:nth-child(2) {
        color: #01ac92;
        margin-left: 10px;
      }
    }
  }
}

.fenge {
  height: 8px;
  background-color: #f5f5f5;
  margin-top: 12px;
}

.b_btns {
  width: 92%;
  margin-left: 4%;
  display: flex;
  justify-content: space-between;
  padding-top: 14px;
  padding-bottom: 0px;

  .b_btn {
    width: 48%;
    border-radius: 10px;
  }
}

.kline {
  height: 100%;

  /deep/[class*="van-hairline"]::after {
    border: none;
  }

  /deep/ .van-tab {
    text-align: center;
  }

  .kline_padding {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .kine_status {
      padding: 10px;
      color: #fff;
      background: #282828;

      .kine_status_left {
        width: 55%;
        margin-top: 15px;
        border-right: 1px solid #333;
        height: 40px;

        h1 {
          color: #e0b674;
        }
      }

      p {
        font-size: 12px;
        padding: 0;
        display: flex;
        justify-content: space-between;
      }
    }

    .num {
      display: flex;
      align-items: center;
      color: #fff;
    }
  }

  .echartBox {
    position: relative;
    flex: 1;
    height: 260px;

    .top {
      position: absolute;
      display: flex;
      top: 20px;
      left: 5px;
      font-size: 13px;

      div {
        padding: 0 10px;
      }
    }
  }
}

div /deep/ .van-tabs__wrap {
  width: 90%;
}
</style>