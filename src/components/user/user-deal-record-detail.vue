<template>
	<view class="user-user-deal-record-detail-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ pageLang.title }}</block>
		</cu-custom>
		<view v-if="visible.page" class="order-detail-box flex flex-direction">
			<image v-if="detailData.saler != null && $util.strIsNotEmpty(detailData.saler.merchantLogo)" :src="fileBaseURL + detailData.saler.merchantLogo"></image>
			<text v-if="detailData.saler != null && $util.strIsNotEmpty(detailData.saler.merchantName)" class="text-center margin-bottom-sm" style="font-size: 30rpx;">{{ detailData.saler.merchantName }}</text>
			<text class="text-center margin-top-xs" style="font-size: 36px;color: #161616;line-height: 1;">-{{ $util.toMoney(detailData.actualAmount) }}</text>
			<text class="text-center margin-top-xs" style="font-size: 30rpx;">{{ ORDER_STATUS[detailData.status] }}</text>
			<view class="page-list">
				<view><text>{{ pageLang.orderAmount }}</text><text>{{ $util.toMoney(detailData.amount) }}</text></view>
				<view v-for="(discountItem, discountIndex) in detailData.discounts" :key="discountIndex" class="discount-item">
					<text>{{ pageLang.orderDiscount }}</text><text>-{{ $util.toMoney(discountItem.discountAmount) }}</text>
				</view>
				<view v-for="(couponItem, couponIndex) in detailData.coupones" :key="couponIndex" class="discount-item">
					<text>{{ pageLang.orderCoupon }}</text><text>-{{ $util.toMoney(couponItem.couponMoney) }}</text>
				</view>
				<view><text>{{ pageLang.orderType }}</text><text>{{ detailData.transactionTypeName }}</text></view>
				<view><text>{{ pageLang.payment }}</text><text></text>{{ detailData.paymentList != null && detailData.paymentList.length > 1 ? pageLang.morePayment : detailData.paymentList[0].payTypeName }}</view>
				<view v-if="detailData.items != null && detailData.items.length > 0">
					<text>{{ pageLang.orderGoods }}</text><text>{{ detailData.items[0].name }}{{ detailData.items.length > 1 ? ageLang.total + detailData.items.length + ageLang.item : '' }}</text>
				</view>
				<view><text>{{ pageLang.createTime }}</text><text>{{ detailData.createTime }}</text></view>
				<view><text>{{ pageLang.billNo }}</text><text>{{ detailData.billNo }}</text></view>
				<template v-if="detailData.paymentList != null && detailData.paymentList.length === 1">
					<view v-if="$util.strIsNotEmpty(detailData.paymentList[0].orderNo)"><text>{{ pageLang.orderNo }}</text><text>{{ detailData.paymentList[0].orderNo }}</text></view>
					<view v-if="$util.strIsNotEmpty(detailData.paymentList[0].platTradeNo)"><text>{{ pageLang.platTradeNo }}</text><text>{{ detailData.paymentList[0].platTradeNo }}</text></view>
				</template>
				<template v-if="detailData.extra">
					<view v-if="$util.strIsNotEmpty(detailData.extra.remark)"><text>{{ pageLang.remark }}</text><text>{{ detailData.extra.remark }}</text></view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import { getOrderDetail } from '../../../api/infopay'

	export default {
		data() {
			return {
				visible: {
					page: false
				},
				ORDER_STATUS: this.$const.ORDER_STATUS,
				billNo: null,
				detailData: {}
			}
		},
		computed: {
			pageLang () {
				return this.$t('pages.user.userDealRecordDetail')
			}
		},
		methods: {
			async getOrderDetail () {
				await getOrderDetail({
					billNo: this.billNo
				}, {
					errorRedirect: true
				}).then(res => {
					this.detailData = res.object
					this.visible.page = true
				})
			}
		},
		async onLoad (option) {
			this.billNo = option.billNo
			await this.$onLaunched
			await this.getOrderDetail()
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
						color: #E43838!important;
					}
				}
			}
		}
	}
</style>
