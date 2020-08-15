<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
view{
	box-sizing: border-box;
	font-size: 32rpx;
	color: #333333;
}
button{
	background: none;
	padding: 0;
	font-weight: normal;
	font-size: 32rpx;
	box-sizing: border-box;
}
button::after{
	border:0;
}
.wxParse.p{
	margin: 0 !important;
}
.wxParse.img{
	display: block !important;
}

</style>
