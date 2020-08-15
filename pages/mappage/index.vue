<template>
	<view class="mapPage">
		<view class="searchWrapper">
			<view class="inputWrapper">
				<input class="searchBar" type="text" placeholder="搜索" v-model="keywords" @input="searchLocation" />
			</view>
			<scroll-view scroll-y="true">
				<view class="" v-for="(item,index) in tips" :key="index" @touchstart="changeLocation(item.name)">
					{{item.name}}
				</view>
			</scroll-view>
		</view>
		<view class="mapWrapper">
			<view class="title">显示当前位置</view>
			<map scale="16" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
		</view>
	</view>
	
</template>

<script>
	import amapFile from "../../utils/amap-wx.js"
	import {mapMutations} from 'vuex'
	export default{
		data() {
			return {
				tips: [],
				longitude:0,
				latitude:0,
				markers:[],
				keywords:''
			}
		},
		mounted() {
			this.getMapaddress()
		},
		methods: {
			...mapMutations(['update']),
			getMapaddress() {
				var myAmapFun = new amapFile.AMapWX({key:'dd6e74b8b8ebbadcf32a262baa2b441c'})
				myAmapFun.getRegeo({
					iconPath:"/static/images/marker.png",
					iconWidth:22,
					iconHeight:32,
					success:(data)=>{
						// console.log(data)
						this.markers = [
							{
								id:data[0].id,
								longitude:data[0].longitude,
								latitude:data[0].latitude,
								width: data[0].width,
								height: data[0].height
							}
						]
						this.longitude = data[0].longitude
						this.latitude = data[0].latitude
						// console.log(this.markers)
					}
				})
			},
			searchLocation(e){
				let that = this
				let modelKeywords = that.keywords
				var myAmapFun = new amapFile.AMapWX({key:'dd6e74b8b8ebbadcf32a262baa2b441c'})
				myAmapFun.getInputtips({
					keywords: modelKeywords,
					location:'',
					success:function(data){
						if(data && data.tips){
							that.tips = data.tips
						}
					}
				})
			},
			changeLocation(locationName){
				this.update({locationName:locationName})
				uni.navigateBack({
					delta:1
				})
			}
			
		},
			
	}
</script>

<style scoped lang="scss">
	.mapPage{
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.searchWrapper{
		// border: 1px solid red;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		// align-items: center;
		width: 100%;
		.searchBar {
			width: 93%;
			height: 56rpx;
			margin: 0 auto;
			box-sizing: border-box;
			border: 1px solid #D4D3D4;
			background-color: #FFFFFF;
			border-radius: 8rpx;
		}
		scroll-view{
			height: 500rpx;
			width: 93%;
			margin: 0 auto;
			view{
				height: 50rpx;
			}
		}
	}
	.mapWrapper{
		border: 1px solid black;
		flex-grow: 1;
		.title{
			font-size: 34rpx;
			font-weight: bold;
			padding: 20rpx;
		}
		map{
			height: 100%;
			width: 100%;
		}
	}
</style>
