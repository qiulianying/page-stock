<template>
	<view class="user-user-wallet-recharge-page">
		<image src="../../static/images/bank_bg.png" mode="heightFix"
			style="position: absolute; width: 100vw; height: 100vh;"></image>

		<cu-custom bgColor="bg-white" is-back :back-reload="backReload">
			<block slot="backText" class="text-black">{{title}}</block>
		</cu-custom>
		<view class="recharge-top" :style="{background: `linear-gradient(94deg, ${themeColor} 0%, ${themeColor} 100%)`}">
			<text>余额</text>
			<text>{{ accountBalance == null ? '7.70' : $util.toMoney(accountBalance / 100) }}</text>
		</view>
		<view class="recharge-box justify-center">
			<view class="padding-lr-lg">
				<text style="font-size: 34rpx; font-weight: 500;">{{title}}金额</text>
				<text v-if="title === '充值'" style="color: #e66d6d">（钱包余额免费提现，随时提现）</text>
				<view class="recharge-box-input">
					<text class="recharge-box-input-icon cuIcon- zjIcon-money" />
					<input v-model="money" type="digit" :maxlength="6" :placeholder="`请输入${title}金额`"
						placeholder-class="input-placeholder" />
				</view>
			</view>
		</view>
		

		<view class="recharge-bottom flex flex-direction">
			<button class="cu-btn bg-theme" :style="{background: themeColor}" :disabled="payOrdering"
				:loading="payOrdering" type="" @tap="handlerCharge">立即{{title}}</button>
			<text class="text-black text-df margin-bottom-xs text-bold" v-if="title === '充值'">充值余额说明：</text>
			<text v-if="title === '充值'">1. 余额可用于在线商城线上、线下商户消费、停车缴费、加油、食堂就餐等园区专享消费；</text>
			<text v-if="title === '充值'">2. 钱包余额免费提现，随时提现。</text>
		</view>
		<zj-popup ref="pay-list-pop" class="pay-list-pop" :title="`选择${title === '充值' ? '支付方式' : '提现银行卡'}`">
			<radio-group class="pay-type-list block">
				<block v-for="(cardItem, cardIndex) in cardList" :key="cardIndex">
					<label class="type-item" @tap="changeCard(cardItem.cardId)">
						<image :src="`/static/images/bank/${cardItem.bankTp}.png`" />
						<view class="con">
							<text>{{ bank[cardItem.bankTp] }}({{ cardItem.bindMedium.substr(cardItem.bindMedium.length - 4) }})</text>
						</view>
						<view v-if="selectedCardId == cardItem.cardId" class="text-xxl">
							<text class="cuIcon-check text-blue"></text>
						</view>
						<radio v-show="false" :checked="selectedCardId == cardItem.cardId" :value="cardItem.cardId" />
					</label>
				</block>
			</radio-group>
			<view class="pay-type-list block">
				<view class="type-item" @tap="$toView(`user/user-bankcard-add`)">
					<view style="font-size: 48rpx; padding-right: 24rpx;">
						<text class="cuIcon-add"></text>
					</view>
					<view class="con">
						<text>添加银行卡</text>
					</view>
					<view class="text-df">
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</view>
			<button class="cu-btn pay-list-pop-btn bg-theme" :style="{background: themeColor}" type=""
				@tap="doCharge">确认{{title}}</button>
		</zj-popup>
		<zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk"></zj-password-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bank: this.$const.BANK,
				accountBalance: '770',
				money: null,
				billNo: null,
				account: {},
				payType: 1,
				payOrdering: false,
				queryResultCount: 0,
				queryMaxCount: 4,
				selectedCardId: null,
				cardList: [],
				backReload: false,
				title: '充值',
				themeColor: '',
				quickRechargeList: [1, 1, 1],
				nowIndex: null
			}
		},
		methods: {

			chargeMoney(num) {
				console.log(num);
				if (this.nowIndex == num) {
					return
				}
				console.log(this.nowIndex);
				this.nowIndex = num
			},
			queryAccBind() {
				this.payOrdering = true
				this.cardList = [{
					accountFlag: 1,
					bankTp: "103",
					bindMedium: "623052*********1775",
					cardId: "1117",
					protocolId: "02021121511401233680",
					status: "0",
				}]
				this.selectedCardId = this.cardList[0].cardId
				this.$refs['pay-list-pop'].open()

				this.payOrdering = false
			},
			async handlerCharge() {
				if (this.title === '充值') {
					if (this.money == null || this.money <= 0) {
						return uni.showToast({
							title: `请正确输入${this.title}金额`,
							icon: 'none'
						})
					}
				} else {
					if (this.money == null || this.money <= 0 || this.money > parseFloat(this.accountBalance / 100)) {
						return uni.showToast({
							title: `请正确输入${this.title}金额`,
							icon: 'none'
						})
					}
				}

				await this.queryAccBind()
			},
			changeCard(cardId) {
				this.selectedCardId = cardId
			},
			doCharge() {
				if (this.selectedCardId == null) {
					return uni.showToast({
						title: `请选择${this.title === '充值' ? '支付方式' : '提现银行卡'}`,
						icon: 'none'
					})
				}
				// 如果开启了密码验证，并且有密码，则弹出密码框
				if (this.$store.state.enableMemberPassword === 1 && this.$store.state.hasPassword === 1) {
					this.$refs['check-password-pop'].open()
				} else {
					if (this.title === '充值') {
						this.rechargeAcc()
					} else {
						this.withdrawAcc()
					}
				}
			},
			passwordInputOk(value) {
				if (this.title === '充值') {
					this.rechargeAcc(value)
				} else {
					this.withdrawAcc(value)
				}

			},
			// 充值接口
			async rechargeAcc(password) {
				this.paySuccess()
			},
			// 提现接口
			async withdrawAcc(password) {
				this.withdrawSuccess()
			},
			paySuccess() {
				uni.showToast({
					title: '充值已受理'
				})
				setTimeout(() => {
					this.$nextTick(() => {
						uni.navigateTo({
							url: `pages/user/user-wallet-recharge-success`
						})
					})
				}, 800)
			},
			withdrawSuccess() {
				uni.showToast({
					title: '提现已受理'
				})
				setTimeout(() => {
					this.$nextTick(() => {
						uni.navigateTo({
							url: `pages/user/user-wallet-withdraw-success`
						})
					})
				}, 800)
				setTimeout(() => {
					this.money = ''
				}, 900)
			}
		},
		async onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			let {
				backReload
			} = option
			
			if (backReload != null) {
				this.backReload = true
			}
			this.$refs['pay-list-pop'].close()
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-recharge-page {
		.recharge-top {
			margin: 42rpx;
			padding: 36rpx 0;
			// background: linear-gradient(94deg, #4DBAFE 0%, #39AEF7 100%);
			background: linear-gradient(to right, rgba(245, 224, 190, 1) 0%, rgba(244, 205, 145, 1) 100%);
			border-radius: 8rpx 50rpx 8rpx 8rpx;
			display: flex;
			align-items: center;
			justify-items: center;
			flex-direction: column;
			color: #FFFFFF;
			line-height: 72rpx;
			opacity: 1 !important;

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

		.quick-pay-box {
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 0 40rpx;
			box-sizing: border-box;
			margin-top: 40rpx;

			.pay-high {
				background-color: #EFF3FF !important;
				border: 2rpx solid #0C37B9 !important;
				box-sizing: border-box;
			}

			.quick-pay {
				width: 212rpx;
				height: 170rpx;
				border: 2rpx solid #fff;
				background: #fff;
				color: #6D85CE;
				font-weight: 400px;
				font-size: 28rpx;
				text-align: center;
				box-sizing: border-box;

				.pay-top {
					color: #161616;
					font-weight: bold;
					font-size: 40rpx;
					margin: 38rpx 0 14rpx;

					span {
						font-size: 28rpx !important;
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

		.pay-list-pop {
			.pay-type-list {
				padding-left: 40rpx;

				.type-item {
					height: 96rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30rpx;
					padding-right: 40rpx;
					box-shadow: 0px 2rpx 0px 0px #F4F5F7;

					radio {
						transform: scale(0.7, 0.7);
					}
				}

				image {
					width: 48rpx !important;
					height: 48rpx !important;
					margin-right: 24rpx !important;
				}

				.con {
					flex: 1;
					font-size: 28rpx;
					color: #333333;
				}
			}

			&-btn {
				margin: 60rpx 60rpx 40rpx;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}
		}
	}
</style>