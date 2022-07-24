<template>
	<view class="user-user-code-success-enter-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">刷码入园</block>
		</cu-custom>
		<view class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; margin: 24rpx 0;">正常入园！</text>
			<text style="font-size: 30rpx; color: #666666;">福州软件园欢迎您的到来</text>
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn text-theme" :style="[{color: themeColor}]" @tap="$util.toBack(1, false)">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
        themeColor: ''
			}
		},
		methods: {
		},
		onLoad(option) {
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-user-code-success-enter-page {
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
				&:first-child {
					color: $zj-color-primary;
					height: 90rpx;
					line-height: 90rpx;
					border: 2rpx solid $zj-color-primary;
					background: #FFFFFF;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
