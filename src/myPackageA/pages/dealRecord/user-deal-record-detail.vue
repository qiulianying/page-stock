<template>
	<view class="user-user-deal-record-detail-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ pageLang.title }}</block>
		</cu-custom>
		<view v-if="visible.page" class="order-detail-box flex flex-direction">
			<image v-if="detailData.saler != null && $util.strIsNotEmpty(detailData.saler.merchantLogo)"
				:src="fileBaseURL + detailData.saler.merchantLogo"></image>
			<text v-if="detailData.saler != null && $util.strIsNotEmpty(detailData.saler.merchantName)"
				class="text-center margin-bottom-sm"
				style="font-size: 30rpx;">{{ detailData.saler.merchantName }}</text>
			<!-- <text class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;">-{{ $util.toMoney(detailData.actualAmount) }}</text> -->
			<!-- 退款情况 -->
			<view class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;"
				v-if="detailData.positive === 0 && (detailData.status === 1 || detailData.status === 3)">
				+{{ $util.toMoney(detailData.actualAmount) }}
				<view class="text-center margin-top-xs" style="font-size: 30rpx;">退款成功</view>
				<!-- <view style="font-size: 13px; color: #65e065;margin-top: 20rpx;">已退款</view>  -->
			</view>
			<view class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;"
				v-else-if="detailData.positive === 1 && (detailData.status === 4 || detailData.status === 5)">
				-{{ $util.toMoney(detailData.actualAmount) }}
				<view class="text-center margin-top-xs" style="font-size: 30rpx;">支付成功</view>
				<view style="font-size: 13px; color: #65e065; margin-top: 20rpx;">已退款</view>
			</view>
			<!-- 退单情况 -->
			<view class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;"
				v-else-if="detailData.positive === 1 && detailData.status === 2 && detailData.busiStatus && (detailData.busiStatus === 4 || detailData.busiStatus === 7) ">
				+{{ $util.toMoney(detailData.actualAmount) }}
				<view class="text-center margin-top-xs" style="font-size: 30rpx;">{{ ORDER_STATUS[detailData.status] }}
				</view>
				<view style="font-size: 13px; color: #65e065;margin-top: 20rpx;">已退单</view>
			</view>
			<view class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;" v-else>
				-{{ $util.toMoney(detailData.actualAmount) }}
				<view class="text-center margin-top-xs" style="font-size: 30rpx;">{{ ORDER_STATUS[detailData.status] }}
				</view>
			</view>



			<view class="page-list">
				<view><text>{{ pageLang.orderAmount }}</text><text>{{ $util.toMoney(detailData.amount) }}</text></view>
				<view v-for="(discountItem, discountIndex) in detailData.discounts" :key="discountIndex"
					class="discount-item">
					<text>{{ pageLang.orderDiscount }}</text><text>-{{ $util.toMoney(discountItem.discountAmount) }}</text>
				</view>
				<view v-for="(couponItem, couponIndex) in detailData.coupones" :key="couponIndex" class="discount-item">
					<text>{{ pageLang.orderCoupon }}</text><text>-{{ $util.toMoney(couponItem.couponMoney) }}</text>
				</view>
				<!-- <view><text>{{ pageLang.orderType }}</text><text>{{ detailData.transactionType === 2000 ? '商城订单' : detailData.transactionTypeName }}</text></view> -->
				<view><text>{{ pageLang.orderType }}</text>
					<text v-if="detailData.transactionType === 2000">权益订单</text>
					<text v-if="detailData.transactionType === 1">直接买单</text>
					<text v-if="detailData.transactionType === 2">点单</text>
					<text v-if="detailData.transactionType === 3">商城订单</text>
					<text v-if="detailData.transactionType === 4">充值</text>
					<text v-if="detailData.transactionType === 16">收银台买单</text>
				</view>
				<view v-if="detailData.paymentList != null && detailData.paymentList.length > 1">
					<text>{{ pageLang.payment }}</text><text></text>{{ pageLang.morePayment }}</view>
				<view
					v-if="detailData.paymentList != null && detailData.paymentList.length === 1 && detailData.paymentList[0].payType === 16">
					<text>{{ pageLang.payment }}</text><text></text>{{ detailData.extra.isBankCard === 1 ? '银行卡支付' : '钱包支付' }}
				</view>
				<view
					v-if="detailData.paymentList != null && detailData.paymentList.length === 1 && detailData.paymentList[0].payType !== 16">
					<text>{{ pageLang.payment }}</text><text></text>{{ detailData.paymentList[0].payTypeName }}</view>

				<view v-if="detailData.items != null && detailData.items.length > 0">
					<text>{{ pageLang.orderGoods }}</text><text>{{ detailData.items[0].name }}{{ detailData.items.length > 1 ? ageLang.total + detailData.items.length + ageLang.item : '' }}</text>
				</view>
				<view><text>{{ pageLang.createTime }}</text><text>{{ dateFormat(detailData.createTime, true) }}</text>
				</view>
				<view><text>{{ pageLang.billNo }}</text><text>{{ detailData.billNo }}</text></view>
				<!-- 如果是退款单或者退单，要显示原订单号 -->
				<view
					v-if="detailData.positive === 0 && detailData.originalNo && (detailData.status === 1 || detailData.status === 3) ">
					<text>原订单号</text><text>{{ detailData.originalNo }}</text></view>
				<view
					v-if="detailData.positive === 1 && detailData.originalNo && (detailData.status === 4 || detailData.status === 5) ">
					<text>原订单号</text><text>{{ detailData.originalNo }}</text></view>
				<view
					v-if="detailData.positive === 1 && detailData.originalNo && detailData.status === 2 && (detailData.busiStatus === 4 || detailData.busiStatus === 7) ">
					<text>原订单号</text><text>{{ detailData.originalNo }}</text></view>
				<template v-if="detailData.paymentList != null && detailData.paymentList.length === 1">
					<view v-if="$util.strIsNotEmpty(detailData.paymentList[0].orderNo)">
						<text>{{ pageLang.orderNo }}</text><text>{{ detailData.paymentList[0].orderNo }}</text></view>
					<view v-if="$util.strIsNotEmpty(detailData.paymentList[0].platTradeNo)">
						<text>{{ pageLang.platTradeNo }}</text><text>{{ detailData.paymentList[0].platTradeNo }}</text>
					</view>
				</template>
				<template v-if="detailData.extra">
					<view v-if="$util.strIsNotEmpty(detailData.extra.remark)">
						<text>{{ pageLang.remark }}</text><text>{{ detailData.extra.remark }}</text></view>
				</template>
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
				ORDER_STATUS: this.$const.ORDER_STATUS,
				billNo: null,
				detailData: {
					"visitIp": "120.36.93.239",
					"discountAmount": 1.35,
					"pointDeductAmount": 0,
					"saler": {
						"brandNo": "5mHEXRL1",
						"enableNegativeStorage": 1,
						"enableStorageManage": 0,
						"enterRegionNo": "DL1330809358619254784",
						"mchId": "170164",
						"merchantId": "MD1468862805355663360",
						"merchantLogo": "service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png",
						"merchantName": "久号食堂（软件园店）",
						"merchantNo": "5mHEXRL1",
						"origin": 1,
						"regionNo": "DL1330809358619254784",
						"terminalNo": "68eda4264f1d",
						"terminalType": 2
					},
					"platform": "default",
					"discounts": [{
						"activityId": "61b6c464e4b039896fddb894",
						"activityName": "满0.1打9.0折",
						"activityType": 1,
						"count": 1,
						"discountAmount": 1.35,
						"favourType": 2,
						"owner": {
							"regionNo": "DL1330809358619254784"
						}
					}],
					"extra": {
						"deliveryAmount": 0,
						"packAmount": 0,
						"scheduleTime": 0,
						"thumbUrl": [
							"laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220330120112653.png"
						],
						"totalGoodsNum": 0
					},
					"billNo": "00161648612874708001344",
					"amount": 13.5,
					"finishTime": 1648612876887,
					"actualAmount": 12.15,
					"updateTime": 1648612876903,
					"positive": 1,
					"version": 4,
					"buyer": {
						"member": {
							"accountId": "b32ed827450246528696ab45392f7f80",
							"memberId": "23df337652ec46f8987aa0c84d89e2b5",
							"memberName": "用户58af55",
							"subjectId": "DL1330809358619254784",
							"subjectType": 5
						},
						"phone": "18060570125",
						"regionNo": "DL1330809358619254784",
						"vmcardId": "90",
						"walletResponse": {
							"accountBalance": 2770,
							"holdBalance": 0,
							"mediumStatus": "1"
						}
					},
					"paymentList": [{
						"accountId": "736f53616fce4d0ebe35a0b6806d9c52",
						"amount": 12.15,
						"bankDiscount": "0",
						"barCode": "611271581339174123",
						"centNo": 0,
						"divideValue": 0.08,
						"finishTime": 1648612876870,
						"mchId": "5540000011",
						"opUserId": "默认",
						"orderNo": "1648612875188190786",
						"outOrderNo": "5mHEXRL10cfa20220330120112653",
						"payType": 16,
						"payTypeName": "钱包支付",
						"protocolId": "90",
						"subPayType": "BARPAY",
						"vendorDiscount": "0"
					}],
					"transactionType": 16,
					"createTime": 1648612874741,
					"mkOrderNo": "95d61b00-793a-4cc5-b2b6-6e5ddd65e352",
					"donationAmount": 0,
					"actualPoint": 0,
					"status": 3
				}
			}
		},
		computed: {
			pageLang() {
				return this.$t('pages.user.userDealRecordDetail')
			}
		},
		methods: {
			
			// 格式化时间
			dateFormat(time, isTotal) {
				let date = new Date(time)
				let y = date.getFullYear()
				let m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
				let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
				if (isTotal) {
					return `${y}-${m}-${d} ${h}:${mm}:${ss}`
				} else {
					return `${y}-${m}-${d}`
				}
			},
		},
		async onLoad(option) {
			this.billNo = option.billNo
		}
	}
</script>

<style lang="scss">
	.user-user-deal-record-detail-page {
		.order-detail-box {
			image {
				width: 128rpx;
				height: 128rpx;
				margin: 72rpx auto 16rpx;
				border-radius: 50%;
				border: 6rpx solid #FFF;
			}

			.page-list {
				margin: 60rpx 32rpx 32rpx;
				padding: 20rpx 32rpx;
				background-color: #FFFFFF;
				border-radius: 8rpx;

				view {
					padding: 18rpx 0;
					display: flex;

					text {
						font-size: 28rpx;

						&:first-child {
							color: #666666;
							padding-right: 24rpx;
						}

						&:last-child {
							text-align: right;
							flex: 1;
							word-break: break-word;
						}
					}
				}

				.discount-item {
					text {
						color: #E43838 !important;
					}
				}
			}
		}
	}
</style>