<template>
	<view class="user-wallet-withdraw-success-page">
		<cu-custom bgColor="bg-white" is-back back-reload>
			<block slot="backText" class="text-black">成功{{actionName}}</block>
		</cu-custom>
		<view v-if="visible.page" class="page-box flex flex-direction ">
			<view class="flex" style="margin-left:30rpx">
				<image style="width:56rpx;height:460rpx;" src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638258388423/timebar_success.png">
				</image>
				<view class="action-text">
					<view class="action-text-item text-gray">发起{{actionName}}申请</view>
					<view class="action-text-item text-center">
						<view style="font-size:32rpx">银行处理中</view>
						<view class="text-gray" style="font-size:24rpx">预计10分钟内到账</view>
					</view>
					<view class="action-text-item text-bottom text-gray">
						{{actionName}}成功
					</view>
				</view>
			</view>

			<view class="flex flex-direction info">
				<view class="action-info">
					<text class="action-info-title">{{actionName}}金额</text>
					<text class="action-info-detail">¥ 0.01</text>
				</view>
				<view class="action-info">
					<text class="action-info-title">支付银行卡</text>
					<text class="action-info-detail">交通银行 尾号7272</text>
				</view>
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
				themeColor: '',
				actionName:'提现',
				actionAmount:0,
				rowRecord: ''
			}
		},
		methods: {
			

		},
		async onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.actionName=option.actionName||'提现'
			this.actionAmount=option.actionAmount
			this.rowRecord = option.rowRecord
			let {
				amount
			} = option
			this.recharge = amount
			await this.$onLaunched
			await this.queryAccBalance()
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-wallet-withdraw-success-page {
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
				color: $zj-color-primary;
				height: 90rpx;
				line-height: 90rpx;
				border: 2rpx solid $zj-color-primary;
				background: #FFFFFF;
				box-sizing: border-box;
			}

		}
	}
</style>
