<template>
	<div class="index">
		<div class="search">
			<navigator open-type="navigate" class="location" url="/pages/mappage" @click="toMapPage">{{locationName}}
      </navigator>
			<div class="inputWrapper">
				<label></label>
				<input class="searchBar" type="text" placeholder="搜索商品" />
			</div>
		</div>
    <div class="swiper">
      <swiper class="swiperContainer" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item,index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.image_url"></image>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="channel">
      <div v-for="(item,index) in channel" :key="index" @click="navList(item.id)">
        <img :src="item.icon_url" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="brand">
      <header @click="toBrandList">品牌制造商直供</header>
      <div class="content">
        <div v-for="(item,index) in brand" :key="index" @click="toDetail(item.id)">
          <div>
            <p>{{item.name}}</p>
            <p class="price">{{item.floor_price}}元起</p>
          </div>
          <img :src="item.new_pic_url" alt="">
        </div>
      </div>
    </div>
    <div class="newgoods">
      <div class="newgoods-top" @click="toGoodsList('new')">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="newGoodsList">
        <ul>
          <scroll-view :scroll-x="true">
            <li v-for="(item,index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newgoods hotgoods">
      <div class="newgoods-top" @click="toGoodsList('hot')">
        <div class="top">
          <p>人气推荐 · 好物精选</p>
          <p class="checkAll">查看全部</p>
        </div>
      </div>
      <div class="newGoodsList hotGoodsList">
        <ul>
          <scroll-view :scroll-x="true">
            <li v-for="(item,index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="topicList">
      <div class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item,index) in topicList" :key="index" @click="toTopicDetail(item.id)">
              <img :src="item.item_pic_url" alt="">
              <div class="bottomContent">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.subtitle}}</p>
                </div>
                <div>
                  {{item.price_info}}元起
                </div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="goodstuff">
      <div class="list" v-for="(item,index) in newCategoryList" :key="index">
        <header class="header">{{item.name}}好物</header>
        <div class="sublist">
          <div v-for="(subItem,subIndex) in item.goodsList" :key="subIndex">
            <img :src="subItem.list_pic_url" alt="">
            <p>{{subItem.name}}</p>
            <p>{{subItem.retail_price}}</p>
          </div>
          <div class="lastItem">
            <p>{{item.name}}好物</p>
            <span class="icon"></span>
          </div>
        </div>
      </div>
    </div>
	</div>

</template>

<script>
	import amapFile from "../../utils/amap-wx.js"
	import{mapState,mapMutations} from 'vuex'
  import {get} from "../../utils/utils.js"
	export default {
		data() {
			return {
        banner:[],
        channel:[],
        brand: [],
        newGoods:[],
        hotGoods:[],
        topicList:[],
        newCategoryList: [],
			}
		},
    mounted(){
		  this.getData()
      this.getCityName()
    },
		computed:{
			...mapState(['locationName'])
		},
		methods: {
			...mapMutations(['update']),
			toMapPage(){
				wx.getSetting({
					success: (res) => {
						//如果没有同意授权,则openSetting
						if (!res.authSetting['scope.userLocation']) {
							wx.openSetting({
								success: (xxx) => {
									//获取授权位置信息
									this.getCityName()
								}
							})
						}else{
							// console.log('333')
							this.getCityName()
							wx.navigateTo({
								url:'/pages/mappage/main'
							})
						}
					}
				})
			},
			getCityName(){
				var myAmapFun = new amapFile.AMapWX({key:'dd6e74b8b8ebbadcf32a262baa2b441c'});
				myAmapFun.getRegeo({
					success:(data)=>{
						// console.log(data)
					},
					fail: (err)=>{
						// console.log(err)
						// this.cityName = '北京'
						this.update({locationName: '北京'})
					}
				})
			},
      navList(id){
			  wx.navigateTo({
          url:'/pages/navlist/main?id='+ id
        })
      },
      toDetail(id){
			  wx.navigateTo({
          url: '/pages/branddetail/main?id='+id
        })
      },
      toBrandList(){
			  wx.navigateTo({
          url:'/pages/brandlist/main'
        })
      },
      toGoodsList(info){
        if (info === 'new'){
          wx.navigateTo({
            url:'/pages/newgoods/main?isHot='+1
          })
        }else {
          wx.navigateTo({
            url:'/pages/newgoods/main?isNew='+1
          })
        }
      },
      toTopicDetail(id){
        wx.navigateTo({
          url:'/pages/topicdetail/main?id='+id
        })
      },
      async getData(){
        const data = await get ('/index/index')

        this.banner = data.banner
        this.channel = data.channel
        this.brand = data.brand
        this.newGoods = data.newGoods
        this.hotGoods = data.hotGoods
        this.topicList = data.topicList
        this.newCategoryList = data.newCategoryList
      }
		}
	}
</script>

<style lang="less" scoped>
.index{
  background: #F4F3F4;
}
	.search {
    display: flex;
		align-items: center;
    height: 80rpx;
    background: #FFFFFF;
		.location {
			width: 115rpx;
			// padding-right: 15rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 20rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			// border: 1px solid red;
		}
		.inputWrapper {
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			background-color: #DDDDDD;
			border-radius: 8rpx;
			margin-right: 20rpx;
			.searchBar {
				width: 100%;
				height: 56rpx;
				box-sizing: border-box;
			}
			label {
				// border: 1px solid blue;
				margin-left: 10rpx;
				width: 28rpx;
				height: 28rpx;
				background: url(../../../static/images/search.png) center;
				background-size: 27rpx;
				background-repeat: no-repeat;
			}
		}

	}

  .swiper {
    width: 100%;
    height: 417rpx;
    //margin-top: 80rpx;
    .swiperContainer{
      width: 100%;
      height: 100%;
      .swiper-item{
        width: 100%;
        height: 100%;
        .slide-image{
          width: 100%;
        }
      }
    }
  }
  .channel{
    display: flex;
    padding: 20rpx 0;
    background-color: #fff;
    div{
      flex:1;
      text-align: center;
      img{
        height: 58rpx;
        width: 58rpx;
        display: inline-block;
      }
    }
  }
  .brand{
    width: 100%;
    margin-top: 20rpx;
    background: #FFFFFF;
    header{
      text-align: center;
      padding: 40rpx 0;
    }
    .content{
      width: 730rpx;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      div{
        width: 360rpx;
        height: 235rpx;
        margin-bottom: 10rpx;
        position: relative;
        div{
          position: absolute;
          top: 0;
          left: 0;
          padding: 10rpx;
          .price{
            font-size: 24rpx;
          }
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .newgoods{
    width: 100%;
    &-top{
      margin-top: 20rpx;
      height: 260rpx;
      width: 100%;
      background: url("../../../static/images/bgnew.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .top{
        p{
          color: #8c9bae;
          font-size: 32rpx;
        }
        p:nth-child(2){
          width: 180rpx;
          height: 50rpx;
          line-height: 50rpx;
          margin: 27rpx auto 0 auto;
          font-size: 22rpx;
          background: #d8e4f0;
        }
      }
    }
    .newGoodsList{
      margin-top: 20rpx;
      background-color: #fff;
      padding-bottom: 10rpx;
      ul{
        scroll-view{
          width: 100%;
          white-space: nowrap;
          li{
            width: 280rpx;
            height: 416rpx;
            margin: 5rpx 0 5rpx 25rpx;
            display: inline-block;
            img{
              width: 280rpx;
              height: 280rpx;
            }
            p{
              overflow: hidden;
              text-overflow: ellipsis;
              width: 94%;
              white-space: nowrap;
              margin-top: 8rpx;
              text-indent: 1em;
            }
            p:nth-child(2){
              font-size: 30rpx;
              font-weight: bold;
            }
            p:nth-child(3){
              font-size: 24rpx;
              color: #8a8a8a;
            }
            p:nth-child(4){
              font-size: 24rpx;
              color: #9c3232;
            }
          }
        }
      }
    }
  }
  .hotgoods{
    .newgoods-top{
      background: url("../../../static/images/bgtopic.png") no-repeat;
      background-size: 100% 100%;
      .top{
        p{
          color: #b1a279;
          font-size: 32rpx;
          vertical-align: middle;
        }
        .checkAll{
          background: #f4e9cb;
          font-size: 22rpx;
        }
      }
    }
  }
  .topicList{
    margin-top: 20rpx;
    background-color: #fff;
    &-top{
      text-align: center;
      padding: 36rpx;
      vertical-align: middle;
      .icon{
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        margin-left: 5rpx;
        background: url("../../../static/images/right.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
      }
    }
    .list{
      .scroll-view{
        white-space: nowrap;
        li{
          display: inline-block;
          width: 575rpx;
          margin-left: 25rpx;
          img{
            display: block;
            width: 575rpx;
            height: 325rpx;
            border-radius: 10rpx;
          }
          .bottomContent{
            display: flex;
            justify-content: space-between;
            margin-top: 42rpx;
            width: 100%;
            div:nth-child(1){
              width:90%;
              p{
                margin-top: 8rpx;
              }
              p:nth-child(1){
                font-size: 30rpx;
                font-weight: bold;
              }
              p:nth-child(2){
                width: 90%;
                font-size: 24rpx;
                color: #8a8a8a;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            div:nth-child(2){
              margin-top: 8 rpx;
              color: #9c3232;
              font-size: 24rpx;
            }
          }
        }
        li:last-child{
          margin-right: 25rpx;
        }
      }
    }
  }
  .goodstuff {
    margin-top: 20rpx;
    padding: 0 10rpx 25rpx 10rpx;
    .header {
      padding: 25rpx 0;
      text-align: center;
    }
    .sublist {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 730rpx;
      margin: 0 auto;
      div {
        width: 360rpx;
        background: #fff;
        margin-bottom: 10rpx;
        padding-bottom: 10rpx;
        img {
          display: block;
          width: 302rpx;
          height: 302rpx;
          margin: 0 auto;
        }
        p {
          margin-bottom: 5rpx;
          text-indent: 1em;
        }
        p:nth-child(2) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 98%;
        }
        p:nth-child(3) {
          color: #9c3232;
        }
      }
      .lastItem {
        box-sizing: border-box;
        width: 360rpx;
        height: 398rpx;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        p {
          height: 33rpx;
          width: 100%;
          line-height: 33rpx;
          color: #333;
          font-size: 33rpx;
          text-align: center;
        }
        .icon {
          display: inline-block;
          width: 70rpx;
          height: 70rpx;
          background: url('../../../static/images/rightbig.png') no-repeat;
          background-size: 100% 100%;
          margin-top: 60rpx;
        }
      }
      div:nth-child(2n) {
        margin-left: 10rpx;
      }
    }
  }
</style>
