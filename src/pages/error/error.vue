<template>
	<view class="error-error-page">
		<cu-custom is-back>
		</cu-custom>
		<view class="page-box">
			<image class="page-box-image" src="/static/images/empty.png" mode="widthFix"></image>
			<view class="page-box-title">哎呀，出错啦</view>
			<text class="page-box-text">{{ error }}</text>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				error: ''
			}
		},
		onLoad (option) {
			let {
				error
			} = option
			if (this.$util.strIsNotEmpty(error)) {
				this.error = decodeURIComponent(error)
			}
			if (this.$util.strIsEmpty(this.error) || this.error === undefined || this.error === 'undefined') {
				this.error = '未知错误'
			}
		}
	}
</script>

<style lang="scss">
	.error-error-page {
		image {
			height: auto;
		}
		.page-box {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: absolute;
			left: 0;
			right: 0;
			top: 46%;
			&-image {
				width: 400rpx;
				margin-top: -220rpx;
			}
			&-title {
				color: #333;
				font-size: 32rpx;
				padding: 60rpx 80rpx 0 80rpx;
				font-weight: bolder;
			}
			&-text {
				color: #999;
				font-size: 24rpx;
				padding: 20rpx 40rpx 60rpx 40rpx;
				text-align: center;
			}
		}
	}
</style>
