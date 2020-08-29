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
      <div>
        tashua
      </div>
      <div class="noGoods">数据库暂无此商品</div>
    </div>
    <div class="historyWrapper" v-if="historyData.length !== 0">
      <div class="subWrapper">
        <div>历史记录</div>
        <div class="clearHistoryButton" @click="clearHistory"></div>
      </div>
      <div class="contWrapper">
        <div class="hisLabel" v-for="(item,index) in historyData" :key="index">{{item.keyword}}</div>
      </div>
    </div>
    <div class="historyWrapper hotHistory">
      <div class="subWrapper">
        <div>热门搜索</div>
      </div>
      <div class="contWrapper">
        <div class="hisLabel" v-for="(item,index) in hotData" :key="index" :class="{active:index === 0}">{{item.keyword}}</div>

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
      historyData:[]
    }
  },
  mounted(){
    this.openid = wx.getStorageSync('openId')
    this.getHotData()
  },
  methods:{
    clearInput(){
      this.words = ''
    },
    inputFocus(){

    },
    showTips(){},
    cancel(){},
    clearHistory(){},
    async getHotData(){
      const data = await get('/search/indexAction?openId='+ this.openid)
      this.historyData = data.historyData
      this.hotData = data.hotKeywordList
      // console.log(data)
    },
    async searchWords(e){
      //存储搜索历史记录
      console.log(e,'e')
      let value = e.currentTarget.dataset.value
      this.words = value || this.words
      const data = await post('/search/addHistoryAction',{
        openId:this.openid,
        keyword: value || this.words
      })
      console.log(data,'data')
      //获取历史记录
      this.getHotData()
    },
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
          width: 53 rpx;
          height: 53 rpx;
          padding: 0;
        }
      }
      div:nth-child(2){
        flex: 1;
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
  }
</style>
