<template>
	<view class="user-bankcard-del-success-page">
		<cu-custom bgColor="bg-white" is-back back-reload>
			<block slot="backText" class="text-black">解绑成功</block>
		</cu-custom>
		<view class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text class="text-bold" style="font-size: 34rpx; margin: 24rpx 0;">解绑成功！</text>
			<text style="font-size: 30rpx; color: #666666;">尊敬的用户，您的卡片已经解除成功</text>
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" @tap="$util.toBack(1, true)">完成</button>
			</view>
		</view>
	</view>
</template>

<script>

export default {
  data(){
    return{
      themeColor:''
    }
  },
  mounted(){
    this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
  }
}
</script>


<style lang="scss">
	.user-bankcard-del-success-page {
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
