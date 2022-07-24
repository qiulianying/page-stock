<template>
	<view class="user-user-bankcard-add-success-page">
		<cu-custom bgColor="bg-white" is-back back-reload>
			<block slot="backText" class="text-black">开通成功</block>
		</cu-custom>
		<view class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; margin: 24rpx 0; font-weight: bold;">恭喜您，银行卡添加成功！</text>
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" @tap="$util.toBack(1, true)">完成</button>
			</view>
		</view>
    <view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
	</view>
</template>

<script>
export default{
  data(){
    return{
      themeColor: ''
    }
  },
  mounted(){
    this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
  }
}
</script>

<style lang="scss">
	.user-user-bankcard-add-success-page {
		.page-box {
			padding: 20% 36rpx 20rpx;
			image {
				width: 260rpx;
				height: 260rpx;
			}
			&-btn {
				margin: 0 15rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
				flex: 1;
			}
		}
    .page-bottom {
			position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-bottom: 50rpx;
			width: 100%;
			background-color: #F5F5F5;
		}
	}
</style>
