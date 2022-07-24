<template>
	<view class="user-user-wallet-pay-open-success-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">开通成功</block>
		</cu-custom>
		<view class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; margin: 24rpx 0; font-weight: bold;">恭喜您，钱包开通成功！</text>
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" @tap="$toView(`user/user-wallet`, true, true)">完成</button>
			</view>
		</view>
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
	.user-user-wallet-pay-open-success-page {
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
	}
</style>
