<template>
	<view class="index">
		<view class="search">
			<navigator open-type="navigate" class="location" url="/pages/mappage" @tap="toMapPage">{{locationName}}</navigator>
			<view class="inputWrapper">
				<label></label>
				<input class="searchBar" type="text" placeholder="搜索商品" />
			</view>
		</view>
	</view>

</template>

<script>
	import amapFile from "../../utils/amap-wx.js"
	import{mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState(['locationName'])
		},
		methods: {
			...mapMutations(['update']),
			toMapPage(){
				// uni.getLocation({
				// 	type:'wgs84',
				// 	success: (res) => {
				// 		console.log(res)
				// 	}
				// })
				uni.getSetting({
					success: (res) => {
						//如果没有同意授权,则openSetting
						if (!res.authSetting['scope.userLocation']) {
							uni.openSetting({
								success: (xxx) => {
									//获取授权位置信息
									this.getCityName()
								}
							})
						}else{
							// console.log('333')
							this.getCityName()
							uni.navigateTo({
								url:'/pages/mappage/index'
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		height: 80rpx;
		display: flex;
		align-items: center;
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
				background: url(../../static/images/search.png) center;
				background-size: 27rpx;
				background-repeat: no-repeat;
			}
		}

	}
</style>
