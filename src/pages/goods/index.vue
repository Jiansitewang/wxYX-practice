<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <blok v-for="(item,index) in bannerPic" :key="index">
          <swiper-item class="swiper-item">
            <img :src="item.img_url" alt="" class="slide-image">
          </swiper-item>
        </blok>
      </swiper>
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-bottom">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>
    <div class="goodsInfo">
      <div class="wrapper">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>{{info.retail_price}}</p>
        <div class="brand" v-if="brand.name">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <div class="specification" @click="showSpec">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <!--商品参数-->
    <div class="goodsAttr">
      <header class="header">商品参数</header>
      <div class="item" v-for="(item,index) in attribute" :key="index">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <!--商品详情-->
    <div class="goodsDetail" v-if="goodsDesc">
      <wxParse :content="goodsDesc"/>
    </div>
    <!--常见问题-->
    <div class="problem">
      <header class="header">
        <text class="title">常见问题</text>
      </header>
      <div class="questionWrapper">
        <div class="item" v-for="(item,index) in problemList" :key="index">
          <div>
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">{{item.answer}}</div>
        </div>
      </div>
    </div>
    <!--大家都在看-->
    <div class="problem everyoneLook">
      <header class="header">
        <text class="title">大家都在看</text>
      </header>
      <div class="itemWrapper">
        <div class="item" v-for="(item,index) in goodsList" :key="index">
          <img :src="item.list_pic_url" alt="">
          <p>{{item.name}}</p>
          <p>{{item.retail_price}}</p>
        </div>
      </div>
    </div>
    <!--底部边栏-->
    <div class="footer">
        <div class="collectWrapper" @click="goodsCollect">
          <div :class="[collectState ? 'active' : '']"></div>
        </div>
        <div class="cartWrapper">
          <div class="cartIcon" @click="toCartPage">
            <span>{{cartNum}}</span>
            <img src="../../../static/images/ic_menu_shoping_nor.png" alt="">
          </div>
        </div>
        <div @click="buy">立即购买</div>
        <div @click="addCart">加入购物车</div>
    </div>
    <!--选择规格弹出层-->
    <div class="maskLayer" v-show="showPop" @click="showSpec"></div>
    <div class="popUp" :class="[showPop ? 'fadeUp' : 'fadeDown']">
      <div class="popUp-top">
        <div class="goodsPic">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="selectedInfo">
            <p>¥{{info.retail_price}}</p>
            <p>请选择数量</p>
        </div>
        <div class="closeButton" @click="showSpec">X</div>
      </div>
      <div class="popUp-bottom">
        <p>数量</p>
        <div class="minusPlus">
          <div class="minus" @click="minus">-</div>
          <input type="text" class="number" disabled="false" v-model="selectNum">
          <div class="plus" @click="plus">+</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {get,post} from "../../utils/utils"
import wxParse from 'mpvue-wxparse'

export default {
  data(){
    return{
      bannerPic: [],
      id: '',
      openid:'',
      info: {},
      brand:{},
      showPop: false,
      selectNum: 0,
      attribute: [],
      goodsDesc:'',
      problemList: [],
      goodsList: [],
      collectState: false,
      goodsId: '',
      cartNum: 0,
      allPrice: ''
    }
  },
  components:{
    wxParse
  },
  //商品分享
  onShareAppMessage(){
    return {
      title:this.info.name,
      path: '/pages/goods/main?id'+ this.info.id,
      imageUrl: this.bannerPic[0].img_url
    }
  },
  mounted () {
    this.openid = wx.getStorageSync('openId')
    this.goodsDetail()
  },
  methods:{
    async goodsDetail(){
      const data = await get('/goods/goodsDetail',{
        id: 1009024,
        openId: this.openid
      })
      console.log(data)
      this.info = data.info
      this.bannerPic = data.gallery
      this.attribute = data.attribute
      this.goodsDesc = data.info.goods_desc
      this.problemList = data.problem
      this.goodsList = data.goodsList
      this.goodsId = data.info.id
      this.collectState = data.collected
      this.cartNum = data.allNumber
      this.allPrice = data.info.retail_price
    },
    showSpec(){
      this.showPop = !this.showPop
    },
    plus(){
      this.selectNum += 1
    },
    minus(){
      if (this.selectNum > 0){
        this.selectNum -= 1
      }else {
        return false
      }
    },
    async goodsCollect(){
      this.collectState = !this.collectState
      const data = await post('/collect/addCollect',{
        openId: this.openid,
        goodsId: this.goodsId
      })
    },
    toCartPage(){
      wx.switchTab({
        url: '/pages/cart/main'
      })
    },
    async buy(){
      if (this.showPop){
        if(this.selectNum === 0){
          wx.showToast({
            title: '请选择商品数量',
            duration: 2000,
            icon: 'none',
            mask: true,
            success: res =>{

            }
          })
          return false
        }
        const data = await post('/order/submitAction',{
          goodsId: this.goodsId,
          openId: this.openid,
          allPrice: this.allPrice
        })
        if (data){
          wx.navigateTo({
            url: "/pages/order/main"
          })
        }
      }else {
        this.showPop = true
      }
    },
    addCart(){

    }
  }
}
</script>

<style lang="less" scoped>
@import url('~mpvue-wxparse/src/wxParse.css');
.goods{
  overflow: hidden;
  .swiper{
    width: 750rpx;
    height: 750rpx;
    position: relative;
    &-container{
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .share{
      position: absolute;
      border-radius: 40rpx 0 0 40rpx;
      width: 150rpx;
      height: 65rpx;
      line-height: 65rpx;
      text-align: center;
      right: 0;
      top: 50rpx;
      background: #e0a354;
      color: #fff;
      font-size: 24rpx;
    }
  }
  .swiper-bottom{
    width: 710rpx;
    height: 73rpx;
    margin: 0 auto;
    background: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
      background: url('http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png') 0 center no-repeat;
      background-size: 10rpx;
      padding-left: 15rpx;
      display: flex;
      align-items: center;
      font-size: 25rpx;
      color: #666;
    }
  }
  .goodsInfo{
    width: 750rpx;
    height: 306rpx;
    background: #ffffff;
    margin: 0 auto;
    border-bottom: 1px solid #f4f4f4;
    .wrapper{
      height: 100%;
      p{
        display: block;
        text-align: center;
      }
      p:nth-child(1){
        font-size: 41rpx;
        padding: 20rpx;
      }
      p:nth-child(2){
        font-size: 24rpx;
        margin-bottom: 25rpx;
        color: #999;
      }
      p:nth-child(3){
        font-size: 35rpx;
        margin-top: 10rpx;
        color: #b4282d;
      }
      .brand{
        margin-top: 25rpx;
        text-align: center;
        p{
          display: inline-block;
          color: #b1a279;
          font-size: 20rpx;
          padding: 5rpx 30rpx;
          border: 1rpx solid #b1a279;
        }
      }
    }
  }
  .specification{
    height: 108rpx;
    background: #ffffff;
    margin-bottom: 20rpx;
    padding: 0 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:nth-child(2){
      width: 52rpx;
      height: 52rpx;
      background: url('../../../static/images/address_right.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .maskLayer{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .popUp{
    position: fixed;
    width: 100%;
    height: 500rpx;
    bottom: -500rpx;
    transition: all 400ms ease;
    box-sizing: border-box;
    padding: 30rpx;
    background: #ffffff;
    .popUp-top{
      display: flex;
      margin-bottom: 35rpx;
      position: relative;
      .goodsPic{
        float: left;
        height: 177rpx;
        width: 177rpx;
        margin-right: 30rpx;
        img{
          float: left;
          height: 177rpx;
          width: 177rpx;
        }
      }
      .selectedInfo{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-top: 95rpx;
        p{
          width: 100%;
          line-height: 45rpx;
        }
        p:nth-child(1){
          color: #b4282d;
        }
      }
      .closeButton{
        position: absolute;
        top: 0;
        right: 0;
        font-size: 30rpx;
        color: #999;

      }
    }
    .popUp-bottom{
      .minusPlus{
        width: 322rpx;
        height: 71rpx;
        line-height: 71rpx;
        display: flex;
        border: 1rpx solid #ccc;
        margin-top: 20rpx;
        div{
          width: 90rpx;
          text-align: center;
        }
        .number{
          flex: 1;
          height: 100%;
          text-align: center;
          border-right: 1rpx solid #ccc;
          border-left: 1rpx solid #ccc;
        }
      }
    }
  }
  .fadeUp{
    transform: translateY(-500rpx);
  }
  .goodsAttr{
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;
    .header{
      font-size: 38rpx;
      padding: 20rpx 0;
    }
    .item{
      display: flex;
      background: #f7f7f7;
      padding: 20rpx 0;
      margin: 20rpx;
      div:nth-child(1){
        width: 134rpx;
        font-size: 25rpx;
        color: #999;
      }
      div:nth-child(2){
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .problem{
    margin-bottom: 110rpx;
    .header{
      padding: 35rpx 0;
      background: #fff;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .title{
        padding: 0 25rpx;
        background: #FFFFFF;
      }
    }
    .questionWrapper{
      padding: 0 30rpx;
      background: #FFFFFF;
      .item{
        padding-bottom: 25rpx;
        div:nth-child(1){
          display: flex;
          .spot{
            width: 8rpx;
            height: 8rpx;
            background: #b4282d;
            border-radius: 50%;
            margin-top: 11rpx;
          }
          .question{
            line-height: 30rpx;
            padding-left: 8rpx;
            display: block;
            font-size: 26rpx;
            padding-bottom: 15rpx;
            color: #303030;
          }
        }
        .answer{
          line-height: 40rpx;
          padding-left: 16rpx;
          font-size: 26rpx;
          color: #787878;
        }
      }
    }
  }
  .everyoneLook{
    .itemWrapper{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 730rpx;
      margin: 0 auto;
      .item{
        width: 360rpx;
        background: #fff;
        margin-bottom: 10rpx;
        padding-bottom: 10rpx;
        img{
          display: block;
          width: 302rpx;
          height: 302rpx;
          margin: 0 auto;
        }
        p{
          margin-bottom: 5rxp;
          text-indent: 1em;
        }
        p:nth-child(2){
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 98%;
        }
        p:nth-child(3){
          color: #b4282d;
        }
      }
    }
  }
  .footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 750rpx;
    height: 100rpx;
    display: flex;
    background: #FFFFFF;
    z-index: 10;
    .collectWrapper{
      height: 100rpx;
      width: 162rpx;
      border: 1px solid #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
      div{
        display: block;
        height: 44rpx;
        width: 44rpx;
        background: url("../../../static/images/icon_collect.png") no-repeat;
        background-size: 100% 100%;
      }
      .active{
        display: block;
        height: 44rpx;
        width: 44rpx;
        background: url("../../../static/images/icon_collect_checked.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .cartWrapper{
      height: 100rpx;
      width: 162rpx;
      border: 1px solid #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
      .cartIcon{
        position: relative;
        width: 60rpx;
        height: 60rpx;
        span{
          position: absolute;
          top: 0;
          right: 0;
          width: 28rpx;
          height: 28rpx;
          z-index: 10;
          background: #b4282d;
          text-align: center;
          font-size: 18rpx;
          color: #fff;
          line-height: 28rpx;
          border-radius: 50%;
        }
        img{
          display: flex;
          height: 44rpx;
          width: 44rpx;
          position: absolute;
          top: 10rpx;
          left: 0;
        }
      }
    }
    div:nth-child(3){
      height: 100rpx;
      line-height: 96rpx;
      flex: 1;
      text-align: center;
      color: #333333;
      border-top: 1rpx solid #f4f4f4;
      border-bottom: 1rpx solid #f4f4f4;
    }
    div:nth-child(4){
      height: 100rpx;
      line-height: 96rpx;
      flex: 1;
      text-align: center;
      color: #FFFFFF;
      border: 1rpx solid #b4282d;
      background: #b4282d;
    }

  }
}
</style>
