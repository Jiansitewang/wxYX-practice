<template>
  <div class="navList">
    <!--导航标签-->
    <scroll-view scroll-x="true" class="tabs" :scroll-left="scrollLeft">
      <div v-for="(item,index) in navData" :key="index" :class="[nowIndex === index ? 'active' : '']" @click="changeTab(index,item.id)">
        {{item.name}}
      </div>
    </scroll-view>
    <!--标签标题-->
    <div class="sortTitle">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.front_desc}}</p>
    </div>
    <!--标签内的商品-->
    <div class="tabsContent" v-if="navGoodsData.length !== 0">
      <div class="item" v-for="(item,index) in navGoodsData" :key="index" @click="toGoodsDetail(item.id)">
        <img :src="item.list_pic_url" alt="">
        <p class="goodsName">{{item.name}}</p>
        <p class="price">¥{{item.retail_price}}</p>
      </div>
    </div>
    <!--数据库暂无数据-->
    <div class="none" v-else>
      数据库暂无数据...
    </div>
  </div>

</template>

<script>
import {get} from '../../utils/utils'

export default {
  data(){
    return {
      navData: [],
      navId: '',
      currentNav: {},
      nowIndex: 0,
      navGoodsData: [],
      scrollLeft: 0
    }
  },
  mounted(){
    this.navId = this.$root.$mp.query.id
    this.getPageData()
  },
  methods: {
    async getPageData(){
      //获取nav各标签数据及当前选中的标签的印记
      const data = await get('/navList/nav',{
        id: this.navId || '1005000'
      })
      // console.log(data)
      this.navData = data.navData
      console.log(this.navData)
      this.currentNav = data.currentNav
      for(let i = 0; i < data.navData.length; i++){
        const id = this.navData[i].id
        if (id === this.currentNav.id){
          this.nowIndex = i
        }
      }
      //获取各标签里的商品数据
      const navGoodsData = await get('navGoods/navGoodsData',{
        navId: this.navId || '1005000'
      })
      // console.log(navGoodsData)
      this.navGoodsData = navGoodsData.data

    },
    async changeTab(index,id){
      this.nowIndex = index
      const navGoodsData =await get('navGoods/navGoodsData',{
        navId: id
      })
      console.log(navGoodsData)
      this.navGoodsData = navGoodsData.data
      this.currentNav = navGoodsData.currentNav
      //让标签滚动到可见区域
      if (this.nowIndex > 4){
        this.scrollLeft = this.nowIndex * 60
      }else{
        this.scrollLeft = 0
      }
    },
    toGoodsDetail(id){
      wx.navigateTo({
        url: '/pages/goods/main?id='+ id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.navList {
  width: 100%;
  .tabs {
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    background: #fff;
    white-space: nowrap;
    div {
      display: inline-block;
      padding: 0 20rpx;
      margin-left: 20rpx;
    }
    .active {
      color: #ab2b2b;
      height: 100%;
      border-bottom: 2px solid #ab2b2b;
      box-sizing: border-box;
    }
  }
  .sortTitle {
    text-align: center;
    background: #fff;
    padding: 30rpx;
    margin-top: 20rpx;
    margin-bottom: 5rpx;
    p:nth-child(1) {
      margin-bottom: 18rpx;
      font-size: 30rpx;
      color: #333;
    }
    p:nth-child(2) {
      display: block;
      height: 24rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  .tabsContent {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 372.5rpx;
      margin-bottom: 5rpx;
      text-align: center;
      background: #fff;
      padding: 15rpx 0;
      img {
        display: block;
        width: 302rpx;
        height: 302rpx;
        margin: 0 auto;
      }
      .goodsName {
        margin: 15rpx 0 22rpx 0;
        text-align: center;
        padding: 0 20rpx;
        font-size: 24rpx;
      }
      .price {
        text-align: center;
        font-size: 30rpx;
        color: #b4282d;
      }
    }
  }
  .none {
    text-align: center;
    margin-top: 100rpx;
    color: #999;
  }
}

</style>
