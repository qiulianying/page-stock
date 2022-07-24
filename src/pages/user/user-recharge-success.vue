<template>
	<view class="user-recharge-success-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">成功充值</block>
		</cu-custom>
		<view v-if="visible.page" class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; margin: 24rpx 0;">支付成功！</text>
			<text style="font-size: 30rpx; color: #666666;">您已成功充值0.01元</text>
			<text style="font-size: 30rpx;">账户余额：¥ 7.70</text>
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn text-theme"
					:style="[{color: themeColor, border: `2rpx solid ${themeColor}`}]"
					@tap="$util.toBack(1, false)">返回</button>
				<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}"
					@tap="$toView(`user/user-recharge`, false, true)">继续充值</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: {
					page: true
				},
				balance: 0,
				recharge: 0,
				themeColor: ''
			}
		},
		methods: {

		},
		onLoad(option) {
			let {
				orderNo
			} = option
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
	.user-recharge-success-page {
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