<template>
	<view class="user-wallet-recharge-success-page">
		<cu-custom bgColor="bg-white" is-back back-reload>
			<block slot="backText" class="text-black">成功充值</block>
		</cu-custom>
		<view v-if="visible.page" class="page-box flex flex-direction ">
			<view class="flex">
				<image style="width:120rpx;height:460rpx;"
					src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638943201821/check_success.png">
				</image>
				<view class="action-text">
					<view class="action-text-item text-gray">发起充值申请</view>
					<view class="action-text-item text-center">
						<view style="font-size:32rpx">银行处理中</view>
						<view class="text-gray" style="font-size:24rpx">预计10分钟内到账</view>
					</view>
					<view class="action-text-item text-bottom text-gray">
						充值成功
					</view>
				</view>
			</view>

			<view class="flex flex-direction info">
				<view class="action-info">
					<text class="action-info-title">充值金额</text>
					<text class="action-info-detail">¥ {{ $util.toMoney(recharge) }}</text>
				</view>
				<view class="action-info">
					<text class="action-info-title">支付银行卡</text>
					<text class="action-info-detail">交通银行 尾号7272</text>
				</view>
			</view>
			<!-- <image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; margin: 24rpx 0;">支付成功！</text>
			<text style="font-size: 30rpx; color: #666666;">您已成功充值<text class="text-red">{{ $util.toMoney(recharge) }}</text>元</text>
			<text style="font-size: 30rpx; color: #666666;"><text class="text-red">{{ $util.toMoney(recharge) }}</text>元充值受理成功，预计10分钟内到账</text>
			<text style="font-size: 30rpx;">账户余额：¥ {{ $util.toMoney(balance / 100) }}</text> -->
			<view class="flex" style="width: 100%; margin-top: 120rpx;">
				<button class="cu-btn page-box-btn text-theme" :style="[{color: themeColor}]"
					@tap="$toView(`user/user-wallet-recharge?backReload=1&title=充值`, true, true)">继续充值</button>
				<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}"
					@tap="$util.toBack(1, true)">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: {
					page: false
				},
				balance: 0,
				recharge: 0,
				themeColor: ''
			}
		},
		methods: {
		},
		async onLoad(option) {
			let {
				amount
			} = option
			this.recharge = amount
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
	.user-wallet-recharge-success-page {
		.page-box {
			padding: 10% 40rpx 20rpx;

			.action-text {
				height: 460rpx;
				display: flex;
				flex-direction: column;
				position: relative;
				text-align: left;
				margin: 0 30rpx;

				&-item {
					flex: 1;
				}
			}

			.info {
				margin: 100rpx 30rpx 20rpx;
				border-top: 4rpx solid #ececec;
				padding-top: 10rpx;

				.action-info {
					margin: 14rpx 0;
					display: flex;

					&-title {
						width: 30%;
						color: #8a8a8a;
					}

					&-detail {
						width: 70%;
						text-align: right;
					}
				}
			}


			.text-bottom {
				display: flex;
				align-items: flex-end;
			}

			.text-center {
				display: flex;
				justify-content: center;
				flex-direction: column;
				text-align: left;
			}

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
