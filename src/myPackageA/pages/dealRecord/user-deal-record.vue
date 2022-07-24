<template>
	<view class="user-user-deal-record-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ pageLang.title }}</block>
		</cu-custom>
		<!--标签定义多种查询情况-->
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" :active-color="themeColor"></u-tabs>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index"
				@tap="$toView(`/myPackageA/pages/dealRecord/user-deal-record-detail?billNo=${item.billNo}`,false, false, true)">
				<view class="order-item-left" v-if="item.paymentList[0].payType === 16">
					<image v-if="item.extra.isBankCard === 1" src="../../../static/images/pay/bank_card.png" />
					<image v-else src="../../../static/images/pay/bank_money.png" />
				</view>
				<view class="order-item-left" v-if="item.paymentList[0].payType === 8">
					<image src="../../../static/images/pay/bank_card.png" />
				</view>
				<view class="order-item-left" v-if="item.paymentList[0].payType === 1">
					<image src="../../../static/images/pay/1.png" />
				</view>
				<view class="order-item-center">
					<text>{{ item.saler.merchantName || item.items[0].name }}</text>
					<text>{{ item.createTime }}</text>
				</view>
				<view class="order-item-right">
					<!-- 退款情况 -->
					<view v-if="item.positive === 0 && (item.status === 1 || item.status === 3)">
						+{{ $util.toMoney(item.actualAmount) }}</view>
					<view v-else-if="item.positive === 1 && (item.status === 4 || item.status === 5)">
						-{{ $util.toMoney(item.actualAmount) }}
						<view style="font-size: 13px; color: #65e065; text-align: right;">已退款</view>
					</view>
					<!-- 退单情况 -->
					<view
						v-else-if="item.positive === 1 && item.status === 2 && item.busiStatus && (item.busiStatus === 4 || item.busiStatus === 7) ">
						-{{ $util.toMoney(item.actualAmount) }}
						<view style="font-size: 13px; color: #65e065">已退单</view>
					</view>
					<view v-else>-{{ $util.toMoney(item.actualAmount) }}</view>
				</view>
			</view>
			<zj-empty v-if="record.loaded && (record.list == null || record.list.length === 0)"
				:text="pageLang.emptyRecord" :img="`${imgUrl}1639019849000/pic_order.png`" />
			<!-- <uni-load-more v-else :status="record.status"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				imgUrl: this.$imgUrl,
				visible: {
					page: false
				},
				record: {
					loaded: false,
					status: 'more',
					pager: {
						curPageNum: 0
					},
					list: []
				},
				list: [{
					name: '已支付'
				}, {
					name: '已退款'
				}, {
					name: '全部'
				}],
				current: 0,
				merchantNo: null, //门店号
			}
		},
		computed: {
			pageLang() {
				return this.$t('pages.user.userDealRecord')
			}
		},
		methods: {
			change(index) {
				console.log(index)
				this.current = index;
				this.loadRecordList({
					curPageNum: 1
				}, this.current)
			},
			loadRecordList() {

				this.record.list = [{
					"actualAmount": 12.15,
					"amount": 13.5,
					"positive": 1,
					"createTime": "2022-03-30 12:01:14",
					"billNo": "00161648612874708001344",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648612875188190786",
						"amount": 12.15,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220330120112653.png"
						]
					}
				}, {
					"actualAmount": 12.15,
					"amount": 13.5,
					"positive": 1,
					"createTime": "2022-03-29 11:53:13",
					"billNo": "00161648525993584001334",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648525994102159409",
						"amount": 12.15,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220329115313086.png"
						]
					}
				}, {
					"actualAmount": 13.05,
					"amount": 14.5,
					"positive": 1,
					"createTime": "2022-03-28 11:52:58",
					"billNo": "00161648439578356001248",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648439578862443921",
						"amount": 13.05,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220328115258803.png"
						]
					}
				}, {
					"actualAmount": 13.05,
					"amount": 14.5,
					"positive": 1,
					"createTime": "2022-03-25 12:04:56",
					"billNo": "00161648181096743001173",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648181097250849379",
						"amount": 13.05,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220325120453668.png"
						]
					}
				}, {
					"actualAmount": 13.95,
					"amount": 15.5,
					"positive": 1,
					"createTime": "2022-03-24 11:56:10",
					"billNo": "00161648094170538001183",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648094171062901969",
						"amount": 13.95,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220324115611962.png"
						]
					}
				}, {
					"actualAmount": 12.15,
					"amount": 13.5,
					"positive": 1,
					"createTime": "2022-03-23 12:01:52",
					"billNo": "00161648008112553001252",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1648008113016297183",
						"amount": 12.15,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220323120154848.png"
						]
					}
				}, {
					"actualAmount": 11.25,
					"amount": 12.5,
					"positive": 1,
					"createTime": "2022-03-22 12:01:13",
					"billNo": "00161647921673039001114",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1647921673539431793",
						"amount": 11.25,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220322120111473.png"
						]
					}
				}, {
					"actualAmount": 12.15,
					"amount": 13.5,
					"positive": 1,
					"createTime": "2022-03-21 12:01:52",
					"billNo": "00161647835312447001083",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1647835312930688368",
						"amount": 12.15,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220321120149595.png"
						]
					}
				}, {
					"actualAmount": 11.25,
					"amount": 12.5,
					"positive": 1,
					"createTime": "2022-03-18 11:57:34",
					"billNo": "00161647575854754001247",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1647575855244993291",
						"amount": 11.25,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220318115740312.png"
						]
					}
				}, {
					"actualAmount": 12.15,
					"amount": 13.5,
					"positive": 1,
					"createTime": "2022-03-17 12:09:58",
					"billNo": "00161647490197993001329",
					"transactionType": 16,
					"status": 3,
					"saler": {
						"merchantName": "久号食堂（软件园店）",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"
					},
					"isSupportRepay": false,
					"paymentList": [{
						"orderNo": "1647490198489731096",
						"amount": 12.15,
						"payType": 16,
						"payTypeName": "钱包支付",
						"subPayType": "BARPAY",
						"vendorDiscount": "0",
						"bankDiscount": "0",
						"protocolId": "90"
					}],
					"extra": {
						"scheduleTime": 0,
						"totalGoodsNum": 0,
						"deliveryAmount": 0,
						"packAmount": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220317120953472.png"
						]
					}
				}]

				this.visible.page = true

			},

		},
		onPullDownRefresh() {
			this.initData()
		},

		onLoad(option) {
			this.merchantNo = option.merchantNo || null
			this.loadRecordList()
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-user-deal-record-page {
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

				&-left {
					margin-right: 24rpx;
					display: flex;

					image {
						width: 80rpx;
						height: 80rpx;
						background: #fff;
						border-radius: 50%;
						border: 2rpx solid #F5F5F5;
					}
				}

				&-center {
					display: flex;
					flex-direction: column;
					flex: 1;

					text {
						&:first-child {
							font-weight: 500;
							font-size: 30rpx;
							color: #161616;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}

						&:not(:first-child) {
							color: #666666;
							font-size: 24rpx;
							line-height: 1.2;
							margin-top: 8rpx;
						}

						&:last-child {
							margin-top: 12rpx;
						}
					}
				}

				&-right {
					font-size: 32rpx;
					font-weight: 500;
					color: #161616;
				}
			}
		}
	}
</style>