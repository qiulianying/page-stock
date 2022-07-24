<template>
	<view class="user-user-wallet-recharge-record-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">钱包明细</block>
		</cu-custom>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index">
				<view class="order-item-center">
					<text>{{ item.remarks }}</text>
					<text>{{ item.busidate }} {{ item.busitime }}</text>
				</view>
				<view class="order-item-right">
					<text v-if="item.remarks !== '退货' && item.remarks !== '退款'"
						:class="{ 'text-theme' : item.drcrf == '2' }"
						:style="[{color:  item.drcrf == '2' ? themeColor : ''}]">{{ item.drcrf == '2' ? '+' : '-' }}{{ $util.toMoney(item.amount/100) }}</text>
					<text v-else class="text-theme">+{{ $util.toMoney(item.amount/100).split('-')[1] }}</text>
					<text>余额{{ $util.toMoney(item.balance/100) }}</text>
				</view>
			</view>
			<zj-empty v-if="record.loaded && (record.list == null || record.list.length === 0)" text="暂无钱包交易记录"
				:img="`${imgUrl}1639019849000/pic_order.png`" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$imgUrl,
				visible: {
					page: true
				},
				record: {
					loaded: false,
					status: 'more',
					page: 0,
					nextpageFlag: 0,
					list: [{
						"trxAmount": "0",
						"busitime": "12:01:16",
						"amount": "1215",
						"balance": "1555",
						"busidate": "2022-03-30",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000117",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "0",
						"busitime": "11:53:29",
						"amount": "2000",
						"balance": "2770",
						"busidate": "2022-03-30",
						"trxCite": "",
						"rowRecord": "000002022031402029101127874600000000116",
						"remarks": "充值",
						"drcrf": "2"
					}, {
						"trxAmount": "0",
						"busitime": "11:07:43",
						"amount": "1",
						"balance": "770",
						"busidate": "2022-03-30",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000115",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "0",
						"busitime": "10:09:28",
						"amount": "1",
						"balance": "771",
						"busidate": "2022-03-30",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000114",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "",
						"busitime": "18:24:32",
						"amount": "1",
						"balance": "772",
						"busidate": "2022-03-29",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000113",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "",
						"busitime": "14:46:08",
						"amount": "1",
						"balance": "773",
						"busidate": "2022-03-29",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000112",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "",
						"busitime": "11:53:15",
						"amount": "1215",
						"balance": "774",
						"busidate": "2022-03-29",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000111",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "",
						"busitime": "11:52:24",
						"amount": "1000",
						"balance": "1989",
						"busidate": "2022-03-29",
						"trxCite": "",
						"rowRecord": "000002022031402029101127874600000000110",
						"remarks": "充值",
						"drcrf": "2"
					}, {
						"trxAmount": "",
						"busitime": "10:07:27",
						"amount": "1",
						"balance": "989",
						"busidate": "2022-03-29",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000109",
						"remarks": "消费",
						"drcrf": "1"
					}, {
						"trxAmount": "",
						"busitime": "11:53:00",
						"amount": "1305",
						"balance": "990",
						"busidate": "2022-03-28",
						"trxCite": "网上银行",
						"rowRecord": "000002022031402029101127874600000000108",
						"remarks": "消费",
						"drcrf": "1"
					}]
				},
				themeColor: ''
			}
		},
		methods: {},

		onLoad(option) {
			this.$onLaunched
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-user-wallet-recharge-record-page {
		.order-box {
			background: #FFFFFF;

			.order-item {
				padding: 32rpx;
				position: relative;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				-webkit-box-align: center;
				-webkit-align-items: center;
				align-items: center;

				&:not(:last-child):before {
					content: '';
					position: absolute;
					z-index: 2;
					bottom: 0;
					left: 32rpx;
					right: 0;
					height: 1px;
					border-bottom: 1px solid #EEEEEE;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
				}

				&-center {
					display: flex;
					flex-direction: column;
					flex: 1;

					text {
						&:first-child {
							font-size: 30rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}

						&:last-child {
							color: #A9A9A9;
							font-size: 24rpx;
							line-height: 1.2;
							margin-top: 12rpx;
						}
					}
				}

				&-right {
					display: flex;
					flex-direction: column;
					text-align: right;

					text {
						&:first-child {
							font-size: 30rpx;
							font-weight: 500;
						}

						&:last-child {
							color: #A9A9A9;
							font-size: 24rpx;
							line-height: 1.2;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}
</style>