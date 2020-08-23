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
        channel:[]
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
      navList(){
			  wx.navigateTo({
          url:'/pages/navlist/main?id='+ id
        })
      },
      async getData(){
        const data = await get ('/index/index')
        console.log(data)
        this.banner = data.banner
        this.channel = data.channel
      }
		}
	}
</script>

<style lang="less" scoped>
	.search {
    display: flex;
		align-items: center;
    height: 80rpx;
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
</style>
