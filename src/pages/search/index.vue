<template>
  <div class="search">
    <header class="header">
      <div>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <input type="text" confirm-type="search" focus="true" placeholder="商品搜索"
               v-model="words" @focus="inputFocus" @input="showTips" @confirm="searchWords">
        <img class="xxx"
             @click="clearInput"
             src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </header>
    <div class="searchTips" v-if="words">
      <div v-if="tipsData.length !== 0">
        <div v-for="(item,index) in tipsData" :key="index" @click="searchWords" :data-value="item.name">
          {{item.name}}
        </div>
      </div>
      <div class="noGoods" v-else>数据库暂无此商品....</div>
    </div>
    <div class="historyWrapper" v-if="historyData.length !== 0">
      <div class="subWrapper">
        <div>历史记录</div>
        <div class="clearHistoryButton" @click="clearHistory"></div>
      </div>
      <div class="contWrapper">
        <div class="hisLabel" v-for="(item,index) in historyData" :key="index" @click="searchWords" :data-value="item.keyword">{{item.keyword}}</div>
      </div>
    </div>
    <div class="historyWrapper hotHistory">
      <div class="subWrapper">
        <div>热门搜索</div>
      </div>
      <div class="contWrapper">
        <div class="hisLabel" v-for="(item,index) in hotData" :key="index" :class="{active:index === 0}" @click="searchWords" :data-value="item.keyword">{{item.keyword}}</div>

      </div>
    </div>
<!--商品列表-->
    <div class="goodsList" v-if="goodsList.length !== 0">
      <div class="sortNav">
        <div @click="changeTab(0)" :class="[0 === defaultIndex ? 'active' : '']">综合</div>
        <div @click="changeTab(1)" :class="[1 === defaultIndex ? 'active' : '']" class="price">价格</div>
        <div @click="changeTab(2)" :class="[2 === defaultIndex ? 'active' : '']">分类</div>
      </div>
      <div class="sortList">
        <div class="item" v-for="(item,index) in goodsList" :key="index" @click="goodsDetail(item,id)">
          <img :src="item.list_pic_url" alt="">
          <p class="class">{{item.name}}</p>
          <p class="price">¥{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {get, post} from '../../utils/utils'
export default {
  data(){
    return {
      words: '',
      openid: '',
      hotData:[],
      historyData:[],
      tipsData:[],
      order:'',
      goodsList:[],
      defaultIndex: 0
    }
  },
  mounted(){
    this.openid = wx.getStorageSync('openId')
    this.getHotData()
  },
  methods:{
    clearInput(){
      this.words = ''
      this.goodsList = []
    },
    inputFocus(){
      this.goodsList = []
      this.showTips()
    },
    cancel(){
      wx.navigateBack({
        delta: 1
      })
    },
    async showTips(){
      const data = await get('/search/showTips',{
        keyword: this.words
      })
      this.tipsData = data.keywords
      // console.log(data)
    },
    async clearHistory(){
      //以用户id去数据库中查找匹配的历史记录数据
      const data = await post('/search/clearHistoryAction',{
        openId:this.openid
      })
      if (data){
        this.historyData = []
      }
    },
    async getHotData(){
      const data = await get('/search/indexAction?openId='+ this.openid)
      this.historyData = data.historyData
      this.hotData = data.hotKeywordList
      // console.log(data)
    },
    async searchWords(e){
      //存储搜索历史记录
      let value = e.currentTarget.dataset.value
      this.words = value || this.words
      const data = await post('/search/addHistoryAction',{
        openId:this.openid,
        keyword: value || this.words
      })
      //获取历史记录
      this.getHotData()
      this.getGoodsData()
    },
    async getGoodsData(){
      const data = await get('/search/showTips',{
        keyword: this.words,
        order: this.order
      })
      this.goodsList = data.keywords
      this.tipsData = []
    },
    changeTab(index){
      this.defaultIndex = index
      if (index === 1 ){
        this.order = this.order === 'asc'?'desc':'asc'
      }else {
        this.order = ''
      }
      this.getGoodsData()
    },
    goodsDetail(id){
      wx.navigateTo({
        url: '/pages/goods/main?'+ id
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    height:100vh;
    position: relative;
    background: #F4F3F4;
    .header{
      height: 91rpx;
      display: flex;
      padding: 0 32rpx;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      div:nth-child(1){
        height: 59rpx;
        display: flex;
        align-items: center;
        background: #f4f4f4;
        img{
          display: inline-block;
          width: 31rpx;
          height: 31rpx;
          padding: 0 20rpx;
        }
        input{
          display: inline-block;
          width: 480rpx;
          height: 59rpx;
          margin-left: 10rpx;
        }
        .xxx{
          width: 53rpx;
          height: 53rpx;
          padding: 0;
        }
      }
      div:nth-child(2){
        flex: 1;
        text-align: center;
      }

    }
    .searchTips{
      position: absolute;
      width: 100%;
      top: 91rpx;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      padding: 0 32rpx;
      z-index: 9;
      background: #ffffff;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      div{
        div{
          padding: 20rpx 0;
        }
      }
      .noGoods{
        margin-top: 300rpx;
        text-align: center;
      }
    }
    .historyWrapper{
      background: #fff;
      padding: 32rpx;
      .subWrapper{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        .clearHistoryButton{
          width: 55rpx;
          height: 55rpx;
          background: url("http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/del1-93f0a4add4.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .contWrapper{
        display: flex;
        flex-wrap: wrap;
        .hisLabel{
          padding: 10rpx;
          border: 1rpx solid #999;
          margin: 0 30rpx 20rpx 0;
        }
        .active{
          border: 1rpx solid #b4282d;
          color: #b4282d;
        }
      }
    }
    .hotHistory{
      margin-top: 20rpx;
    }
    .goodsList{
      position: absolute;
      width: 100%;
      top: 91rpx;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      padding: 0 32rpx;
      z-index: 9;
      background: #ffffff;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .sortNav{
        display: flex;
        width: 100%;
        height: 78rpx;
        line-height: 78rpx;
        background: #fff;
        border-bottom: 1px solid #d9d9d9;
        div{
          width: 250rpx;
          //height: 100%;
          text-align: center;
        }
        .active{
          color: #b4282d;
        }
        .price {
          background: url(//yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-3127092a69.png) 165rpx center no-repeat;
          background-size: 15rpx 21rpx;
        }
        .active.desc {
          background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/down-95e035f3e5.png) 165rpx center no-repeat;
          background-size: 15rpx 21rpx;
        }
        .active.asc {
          background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/up-636b92c0a5.png) 165rpx center no-repeat;
          background-size: 15rpx 21rpx;
        }
      }
      .sortList{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item{
          box-sizing: border-box;
          width:50%;
          text-align: center;
          background-color: #fff;
          padding: 15rpx 0;
          border-bottom: 1rpx solid #d9d9d9;
          border-right: 1rpx solid #d9d9d9;
          img{
            display:block;
            width: 302rpx;
            height: 302rpx;
            margin: 0 auto;
          }
          .name{
            margin: 15rpx 0 22rpx 0;
            text-align: center;
            padding: 0 20rpx;
            font-size: 24rpx;
          }
          .price{
            text-align: center;
            font-size: 30rpx;
            color: #b4282d;
          }
        }
        .item:nth-child(2n){
          border-right: none;
        }
        .item.active:nth-last-child(1){
          border-bottom: none;
        }
        .item.active:nth-last-child(2){
          border-bottom: none;
        }
        .item.none:last-child{
          border-bottom: none;
        }
      }
    }
  }
</style>
