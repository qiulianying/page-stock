<template>
	<view>
		<radio-group v-if="cardList != null && cardList.length > 0" class="pay-type-list page-card block">
			<block v-for="(cardItem, cardIndex) in cardList" :key="cardIndex">
				<label class="type-item" @tap="changeCardType(cardItem)">
					<!--钱包-->
					<image v-if="cardItem.type === 'wallet'"
						:src="!cardItem.disabled ? '/static/images/pay/4.png' : '/static/images/pay/icon_pay_gray.png'" />
					<!--微信支付-->
					<image v-if="cardItem.type === 'WECHAT'" :src="'/static/images/pay/1.png'" />
					<view class="con">
						<view class="tit">
							<text v-if="cardItem.type === 'wallet' && cardItem.cardId">{{cardItem.name}}</text>
							<text v-if="cardItem.type === 'wallet' && !cardItem.cardId" @tap="toAddBank">钱包</text>
							<text v-if="cardItem.type === 'card'">{{cardItem.name}}</text>
							<text v-if="cardItem.type === 'WECHAT'">{{cardItem.name}}</text>
							<text v-if="cardItem.type === 'ALIPAY'">{{cardItem.name}}</text>
							<text v-if="cardItem.type === 'UNIONPAY'">{{cardItem.name}}</text>
							<view class="cu-tag z" style="background-color: #E43838"></view>
						</view>
						<text></text>
					</view>
					<radio class="blue" v-if="cardItem.type !== 'wallet' && cardItem.cardId"
						:class="selectedCard.cardId == cardItem.cardId ? 'checked' : ''"
						:checked="selectedCard.cardId == cardItem.cardId " :value="cardItem.cardId" />
					<radio class="blue" v-if="cardItem.type === 'wallet' && cardItem.cardId"
						:class="selectedCard.cardId == cardItem.cardId && !cardItem.disabled ? 'checked' : ''"
						:checked="selectedCard.cardId == cardItem.cardId " :value="cardItem.cardId"
						:disabled="cardItem.disabled" />
					<view v-if="cardItem.type === 'wallet' && !cardItem.cardId" @tap="toAddBank"><button
							class="cu-btn bg-theme" :style="{background: themeColor}" type="">去开通</button></view>
				</label>
			</block>
		</radio-group>
	</view>
</template>

<script>
	export default {
		name: 'pay-radio',
		components: {},
		props: {
			isCoupon: {
				// 是否是权益商品
				type: Boolean,
				default: false
			},
			totalMoney: {
				// 总支付金额
				type: Number,
				default: 0
			},
			// color: {
			//   // 主题颜色
			//   type: String,
			//   default: '#34A2E8'
			// },
			merchantNo: {
				// 门店号
				type: String,
				default: '',
				required: true
			}
		},
		data() {
			return {
				wallet: 0.01, //钱包余额
				cardList: [
				// {
				// 	"cardId": 90,
				// 	"balance": "0",
				// 	"type": "wallet",
				// 	"name": "钱包(剩余 ¥ 0)",
				// 	"disabled": true,
				// 	"payType": 16,
				// 	'show': false
				// },
					{
					"type": "WECHAT",
					"cardId": "WECHAT",
					"name": "微信支付",
					"disabled": false,
					"payType": 1
				}],
				member: {},
				// 当前选择的支付方式
				selectedCard: {},
				// 用户是否为软件园员工
				companyStaffEntity: {},
				// 银行名称
				bank: this.$const.BANK,
				themeColor: '',
				// 是否开通钱包
				isOpenPurse: null

			};
		},
		watch: {
		},
		computed: {},
		created() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.selectedCard = this.cardList[0]
			this.$emit('getSelectCard', this.selectedCard)
		},
		beforeDestroy() {},
		methods: {
			toAddBank() {
				this.$toView('user/user-wallet-bankcard-add')
				this.$emit('selectShow', false)
			},
			changeCardType(card) {
				this.$emit('getSelectCard', card)
			},
		}
	};
</script>
<style lang="scss" scoped>
	.pay-type-list {
		background: #FFFFFF;
		margin-top: 20rpx;
		padding: 8px 28rpx;

		.type-item {
			height: 108rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;

			radio {
				transform: scale(0.7, 0.7);
			}
		}

		image {
			width: 56rpx !important;
			height: 56rpx !important;
			margin-right: 24rpx !important;
		}

		.tit {
			font-size: 28rpx;
			color: #303133;
			display: flex;
			align-items: center;

			.cu-tag.z {
				border-radius: 20rpx 20rpx 20rpx 0;
				color: #FFFFFF;
				font-size: 22rpx;
				height: auto;
				margin-left: 32rpx;
			}
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 22rpx;
			color: #909399;
		}
	}
</style>
