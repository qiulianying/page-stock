<template>
	<view class="user-user-recharge-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="content">提现</block>
		</cu-custom>
		<view class="recharge-top" :style="{background: themeColor}">
			<text>可提现金额</text>
			<text>{{Number(AllMoney) / 100}}</text>
		</view>
		<view class="recharge-box justify-center">
			<view class="padding-lr-lg">
				<text style="font-size: 34rpx; font-weight: 500;">提现金额</text>
				<view class="recharge-box-input"
					:class="selectedActivityIndex === -1 ? 'recharge-box-input-selected' : ''">
					<text class="recharge-box-input-icon cuIcon- zjIcon-money" />
					<input v-model="money" type="digit" :maxlength="8" placeholder="请输入提现金额"
						placeholder-class="input-placeholder" @focus="handleMoneyFocus" />
				</view>
			</view>
		</view>
		<view class="recharge-bottom flex flex-direction">
			<button class="cu-btn bg-theme" :style="{background: themeColor}" :disabled="payOrdering"
				:loading="payOrdering" type="" @tap="handlerCharge">立即提现</button>
			<text class="text-black text-df margin-bottom-xs text-bold">提现金额说明：</text>
			<text>1. 提现金额将在审核通过后1小时内到账；</text>
		</view>

	</view>
</template>

<script>
	import { cashOut } from '../../api/platformgouc'
	export default {
		data() {
			return {
				AllMoney: 0,
				money: null,
				account: {},
				selectedActivityIndex: -1,
				payType: 1,
				payOrdering: false,
				queryResultCount: 0,
				queryMaxCount: 4,
				activityList: [
				],
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
			}
		},
		methods: {
			handleActivityChange(e) {
				let {
					index
				} = e.detail
			},
			handleMoneyFocus(e) {
				this.selectedActivityIndex = -1
			},
			onSelectedActivity(value) {
				this.selectedActivityIndex = value
			},
			open(popId) {
				this.$refs[popId].open()
			},
			close(popId) {
				this.$refs[popId].close()
			},

			handlerCharge() {
				if (this.money == null || this.money <= 0) {
					uni.showToast({
						title: '请正确输入充值金额',
						icon: 'none'
					})
				}
				this.paySuccess()
			},
			paySuccess() {
				console.log(this.money)
				cashOut({
					money: Number(this.money) * 100
				}).then(res => {
					this.$toView(`user/user-wallet-withdraw-success?amount=${this.money}`, false, false, false)
				})
			}
		},
		onLoad(option) {
			this.AllMoney = option.money
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-user-recharge-page {
		.recharge-top {
			margin: 42rpx;
			padding: 36rpx 0;
			background: linear-gradient(94deg, #3CA5FF 0%, #34A2E8 100%);
			border-radius: 8rpx 50rpx 8rpx 8rpx;
			display: flex;
			align-items: center;
			justify-items: center;
			flex-direction: column;
			color: #FFFFFF;
			line-height: 72rpx;

			text {
				&:first-child {
					font-size: 36rpx;
				}

				&:last-child {
					font-size: 48rpx;
					font-weight: 500;

					&:before {
						content: '￥';
						font-size: 36rpx;
						margin-right: 8rpx;
					}
				}
			}
		}

		.recharge-box {
			display: flex;
			flex-direction: column;

			&-input {
				display: flex;
				align-items: center;
				justify-items: center;
				margin: 24rpx 0;
				height: 136rpx;
				background: #FFFFFF;
				border: 2rpx solid #F5F5F5;

				&-selected {
					border: 2rpx solid rgba($zj-color-primary, 1);
				}

				&-icon {
					font-size: 48rpx;
					margin: 0 24rpx 0 32rpx;
				}

				input {
					flex: 1;
					text-align: left;
					font-size: 48rpx;
					line-height: 80rpx;
					height: 80rpx;
				}

				.input-placeholder {
					font-size: 30rpx;
					color: #999999;
				}
			}

			&-active {
				background: #FFFFFF;

				.activity-item {
					position: relative;
					padding: 10rpx;

					>view {
						height: 100%;
						border: 1px solid #F5F5F5;
						background-color: #FFFFFF;
						box-sizing: border-box;
						color: #161616;
					}

					&-recharge {
						font-size: 48rpx;
						font-weight: 500;
						align-items: baseline;
					}

					&-selected {
						>view {
							background: rgba($zj-color-primary, 0.05);
							border-color: rgba($zj-color-primary, 1);
							color: $zj-color-primary;
						}
					}
				}
			}
		}

		.recharge-bottom {
			padding: 64rpx 40rpx 40rpx;

			button {
				margin-bottom: 72rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
			}

			>text {
				line-height: 1.6;
				color: #666666;
			}
		}

		.modal-pay-type {
			border-radius: 40rpx 40rpx 0 0;
			overflow: hidden;

			.cu-list {
				padding: 24rpx 0;

				image {
					width: 48rpx !important;
					height: 48rpx !important;
					margin-right: 36rpx !important;
				}
			}

			.cu-list.menu>.cu-item:after {
				border-bottom: none;
			}

			.cu-list.menu>.cu-item {
				padding: 0 40rpx;
				min-height: 88rpx;
			}

			.pay-type-popup-bottom {
				padding: 40rpx;

				button {
					border-radius: 47rpx;
					font-size: 34rpx;
					color: #FFFFFF;
					height: 94rpx;
					line-height: 94rpx;
					text-align: center;
					display: block;
				}
			}
		}
	}
</style>
