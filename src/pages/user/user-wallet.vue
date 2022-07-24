<template>
	<view class="user-user-wallet-page">
		<image src="../../static/images/bank_bg.png" mode="heightFix"
			style="position: absolute; width: 100vw; height: 100vh;"></image>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">钱包</block>
		</cu-custom>
		<view class="page-box" style="position: relative">

			<view class="balance-box-new">
				<view class="balance-box-new-charge">
					<view class="balance-box-new-charge-item">
						<view class="amount">
							{{ accountBalance == null ? '--.--' : $util.toMoney(accountBalance / 100) }}</view>
						<view class="title">我的余额 (元)</view>
					</view>

					<view class="balance-box-new-charge-item" @tap="$toView('user/user-wallet-record', true)">
						<view class="chargeButton">零钱明细</view>
					</view>
				</view>
				<view class="balance-box-new-btn">
					<view class="balance-box-new-btn-item" @tap="$toView(`user/user-wallet-recharge?title=充值`, true)">
						<view class="action" style="color:#B00001">充值</view>
						<view class="click">点击充值余额</view>
					</view>
					<view class="balance-box-new-btn-item" @tap="handleWithdraw">
						<view class="action">提现</view>
						<view class="click">点击提现余额</view>
					</view>
				</view>
			</view>
			<view class="card-list-box flex flex-direction">
				<view class="flex align-center" @tap="$toView('user/user-bankcard', true)">
					<view class="flex align-center">
						<!-- <text class="text-xl text-bold">银行卡</text>
						<text class="text-xl text-bold text-theme"
							:style="[{color: themeColor}]">（{{ cardCount }}）</text>
						<text class="cuIcon-right"></text> -->
						<text class="bank-card">银行卡</text>
						<text class="bank-card-num">（共<text>{{ cardCount }}</text>张）</text>
					</view>
					<text class="flex-sub"></text>
					<view class="flex align-center">
						<!-- <text class="text-xxl margin-right-xs">
							<text class="cuIcon-roundadd"></text>
						</text>
						<text class="text-df">添加</text> -->
						<text class="see-all-card">查看全部</text>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="flex flex-direction back-card-box" v-if="showWallet">
					<bank-item class="bank-item-box" v-for="(item) in cardList" :walletPage='true' :key="item.cardId"
						:bank-code="item.bankTp" :card-code="item.bindMedium"
						@tap="$toView(`user/user-bankcard-detail?cardId=${ item.cardId }&bindMedium=${ item.bindMedium }&bankTp=${ item.bankTp }`, true)" />
				</view>
				<zj-empty v-if="cardList == null || cardList.length === 0" text="暂未绑定银行卡"
					:img="`${imgUrl}1639019849000/pic_cardbag.png`" />
				<button class="cu-btn " :style="{background: themeColor}" @tap="$toView('user/user-bankcard-add')">
					<!-- :style="{background: themeColor}" -->
					<text class="cuIcon-roundadd margin-right-xs"></text>添加银行卡</button>
			</view>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
		<zj-popup ref="pay-list-pop" class="pay-list-pop" title="选择银行卡">
			<radio-group class="pay-type-list block">
				<block v-for="(cardItem, cardIndex) in cardList" :key="cardIndex">
					<label class="type-item" @tap="changeCard(cardItem.cardId)">
						<image :src="`../../static/images/bank/${cardItem.bankTp}.png`" />
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
				@tap="doWithdraw">确认提现</button>
		</zj-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$imgUrl,
				bank: this.$const.BANK,
				accountBalance: 770,
				cardList: [],
				cardCount: 0,
				selectedCardId: null,
				themeColor: '',
				showWallet: true
			}
		},
		onShow() {
			this.queryAccBind()
		},
		methods: {

			async queryAccBind() {
				this.cardList = [{
					accountFlag: 1,
					bankTp: "103",
					bindMedium: "623052*********1775",
					cardId: 1117,
					protocolId: "02021121511401233680",
					status: "0"
				}]
				this.cardCount = 1
			},
			async handleWithdraw() {
				if (this.accountBalance == null || this.accountBalance <= 0) {
					return uni.showToast({
						title: '余额不足，无法提现',
						icon: 'none'
					})
				}
				await this.queryAccBind()
				if (this.cardCount === 0) {
					uni.showModal({
						content: '您还未绑定银行卡，是否现在绑卡？',
						confirmText: '马上绑卡',
						cancelText: '以后再说',
						success: res => {
							if (res.confirm) {
								this.$toView('user/user-bankcard-add')
							}
						}
					})
				} else {
					this.$toView(`user/user-wallet-recharge?title=提现`, true)
					// this.$refs['pay-list-pop'].open()
				}
			},
			changeCard(cardId) {
				this.selectedCardId = cardId
			},
			doWithdraw() {
				if (this.selectedCardId == null) {
					return uni.showToast({
						title: '请先选择银行卡',
						icon: 'none'
					})
				}
				this.$refs['check-password-pop'].open()
			},

			withdrawSuccess() {
				uni.showToast({
					title: '提现成功'
				})
				setTimeout(() => {
					this.$nextTick(() => {
						this.$toView(`user/user-wallet-withdraw-success?amount=${this.accountBalance}`,
							true)
					})
				}, 800)
			}
		},
		onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.$refs['pay-list-pop'].close()
			this.accountBalance = "770"
			this.queryAccBind()
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-page {
		.page-box {
			.wallet-info {
				margin: 40rpx 24rpx 24rpx;

				>text {
					font-size: 28rpx;

					&:first-of-type {
						font-size: 40rpx;
						font-weight: bold;
					}
				}
			}

			.balance-box-new {
				position: relative;
				padding: 0;
				width: 100%;
				height: 420rpx;
				background-position: center;
				background-size: 100%;
				background-repeat: no-repeat;
				background-image: url('https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638179794000/my_purse_bg.png');

				&-charge {
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: center;
					position: absolute;
					top: 80rpx;

					&-item {
						color: #794005;

						.amount {
							width: 420rpx;
							font-weight: bold;
							font-size: 60rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							padding-left: 20rpx;
						}

						.title {
							font-size: 26rpx;
							padding-left: 20rpx;
						}

						.chargeButton {
							width: 200rpx;
							height: 70rpx;
							line-height: 70rpx;
							border-radius: 30rpx;
							text-align: center;
							background: #F8ECD9;
						}
					}
				}

				&-btn {
					position: absolute;
					bottom: 30rpx;
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: center;
					text-align: center;

					&-item {
						flex: 1;

						.action {
							font-weight: bold;
							font-size: 36rpx;
							color: #794005;
						}

						.click {
							font-size: 26rpx;
							color: #794005;
						}
					}
				}
			}

			.balance-box {
				// border: 1px solid red;
				position: relative;
				margin: 24rpx;
				padding: 36rpx 0;
				// background: linear-gradient(94deg, #4DBAFE 0%, #39AEF7 100%);
				border-radius: 8rpx 50rpx 8rpx 8rpx;
				display: flex;
				align-items: center;
				justify-items: center;
				flex-direction: column;
				color: #FFFFFF;
				line-height: 72rpx;

				>text {
					&:first-of-type {
						font-size: 26rpx;
					}

					&:last-of-type {
						font-size: 56rpx;
						font-weight: bold;
					}
				}

				&-btn {
					width: 100%;
					padding: 0 15rpx;
					margin-top: 44rpx;

					button {
						margin: 0 9rpx;
						height: 76rpx;
						background: rgba(255, 255, 255, .3);
						border-radius: 4rpx;
						font-size: 30rpx;
						text-align: center;
						color: #FFFFFF;

						text {
							margin-right: 12rpx;
						}
					}
				}

				&-bottom {
					width: 664rpx;
					height: 56rpx;
					// background: linear-gradient(94deg, #4DBAFE 0%, #39AEF7 100%);
					opacity: 0.7;
					filter: blur(10px);
					position: absolute;
					bottom: -16rpx;
					left: 16rpx;
					right: 16rpx;
				}
			}

			.card-list-box {
				background: #FFFFFF;
				border-radius: 8rpx;
				margin: 50rpx 24rpx 24rpx;
				padding: 24rpx;

				.bank-card {
					color: #000000;
					font-weight: bold;
					font-size: 30rpx;
				}

				.bank-card-num {
					color: #000000;
					font-size: 28rpx;

					text {
						font-weight: bold;
						color: #FFC52E;
					}
				}

				.see-all-card {
					color: #000000;
					font-weight: 400px;
					font-size: 28rpx;
				}

				.back-card-box {
					margin-top: 40rpx;

					.bank-item-box {
						margin-top: -18rpx;
					}

					.bank-item-box:first-child {
						margin-top: 0 !important;
					}
				}

				button {
					margin: 64rpx 0;
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

		.page-bottom {
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-bottom: 50rpx;
			width: 100%;
			background-color: #F5F5F5;
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