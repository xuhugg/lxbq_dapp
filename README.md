# vuetemplate
+ vant组件非按需导入，不需要在vue文件中声明
+ 已配置px转rem，无需再做配置


## 项目依赖安装

```
npm install
```

### 开发时运行测试

```
npm run serve
```
### 编译测试压缩打包

```
npm run build
```

### 开发时运行正式

```
npm run serve:pro
```

### 编译压缩打包正式

```
npm run build:pro
```

### 整理和修复文件

```
npm run lint
```
## 自定义配置
### 测试以及生产的请求地址在env文件中配置
~~+ VUE_APP_RUN_DEV 是否是运行模式；~~
+ VUE_APP_REQUEST_URL 请求地址
+ VUE_APP_ENC 是否进行请求加密 ' '||false：不加密 true：加密
+ VUE_APP_APP_KEY 用来生成签名
+ VUE_APP_AES_KEY 用来加密解密
+ VUE_APP_CHAIN_ID 验证当前链id

### 其他配置可以参考[这里](https://cli.vuejs.org/config/)。

## 展示模块
### env全局配置模块
+ VUE_APP_ROUTER_LOADING --路由跳转是否开启遮罩层
+ VUE_APP_ROUTER_LOADING_TIME --路由跳转遮罩层时间(毫秒)
+ VUE_APP_LOG --是否开启请求返回值内容log打印
+ VUE_APP_OPEN_WEB3 --是否开启web3功能（以太链、币安链、heco链）
+ VUE_APP_OPEN_WEB3_TRON --是否开启web3功能（波场链）
+ VUE_APP_OPEN_SIGN --是否开启签名登录（可防止观察钱包直接登录账户操作 ）（以太链、币安链、heco链）
+ VUE_APP_SIGN_TIP -- 开启验证登录时，签名提示语句
+ VUE_APP_POST_LOADING --是否开启请求等待加载效果
+ VUE_APP_NEW_LOADING --是否开启新加载效果
+ VUE_APP_OPEN_VCONSOLE --是否开启Vconsole调试器
+ VUE_APP_TOKEN_VUEX --是否开启Vuex存储token 
+ `由于DAPP的特殊性，token不建议存储在本地，推荐使用Vuex`
+ `dapp 静默登录需要关掉签名验证,签名登录会吊起授权窗口`
+ ·VUE_APP_OPEN_CHECK_NETWORK --是否开启验证链是否正确


> 开启验证链 需要在dev prod 中配置链ID  可参考[Chainlist](https://chainlist.org/zh) 中ChainID 测试与正式分开配置
>
### 多语言模块
```
//多语言已做自动注册 只需要创建对应的js文件即可
//使用多语言
{{$t('m.xxxx')}}  //xxxx为语言文本中设置的键名 ps:可中文
//切换语言
$i18n.locale  = 'xx'   //xx为plugin/lang/i18n.js p配置的，名称
```
### 路由
#### 该脚手架路由为自动路由，无需配置 

### 地区选择
~~~
yarn add @vant/area-data

import { areaList } from '@vant/area-data';

export default {
  data() {
    return { areaList };
  },
};
~~~


## 功能模块

#### 区块链功能
```
// 转账 --自动判断开启那个web3版本

  this.blockFun.transfer("合约名称","转账数量","转到的地址",'精度：默认ether <非必传>',"是否主链货币 <非必传>")
  .then 接收交易hash

 
 //查询余额 --自动判断开启那个web3版本

  this.blockFun.getEthBalance("合约名称",'精度：默认ether <非必传>',"是否主链货币 <非必传>")
  .then 接收交易hash

 //NFT转账 --自动判断开启那个web3版本（暂时未作波场链）
  this.blockFun.transferFrom("合约名称","用户地址","接收地址","NFT TokenID")
  .then 接收交易hash

//合约授权 -- 自动判断开启那个web3版本（波场链 -待测）
//合约授权。只有当从用户账户中扣除代币时调用。
//说明：“被授权合约”可以从授权过的账户地址提取代币
   this.blockFun.approve("合约名称","授权地址","授权数量 <非必传>")
  .then 接收交易hash

//添加代币到钱包
   this.blockFun.approve("代币名称","代币地址","代币精度",代币图标url)
 


```

#### 常用方法
```
1.时间格式化

this.parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')

2.多语言切换

this.languageSwitch('语言代号','是否切换完成后刷新')


```


#### 复制
```
 this.$copyText(codes).then(() => {
          this.$toast('复制成功')
        })
```
#### 二维码生成

```
   <van-col class="qrCode" span="24">
       <div class="qrcode" ref="qrCodeUrl"></div>
   </van-col>

  import QRCode from 'qrcodejs2'

  new QRCode(this.$refs.qrCodeUrl, {
            text: '链接地址',
            width: 120,
            height: 120,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
```

#### 自定义指令  **待实际使用**

>复制粘贴指令 v-copy
> 
>长按指令 v-longpress
> 
>输入框防抖指令 v-debounce
> 
>禁止表情及特殊字符 v-emoji
> 
>权限校验指令 v-premission
> 
>实现页面水印 v-waterMarker
> 
>拖拽指令 v-draggable




## 项目地址及其他

### 安装scss

```
npm install node-sass --save-dev
npm install sass-loader --save-dev
```

### 安装typescript
  
```
npm i typescript ts-loader --save-dev
```

### 封装组件请进组件内查看
