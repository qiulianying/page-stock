<template>
	<view class="user-user-recharge-record-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">充值提现记录</block>
		</cu-custom>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index"
				@tap="$toView(`/myPackageA/pages/user/user-recharge-record-detail?item=${JSON.stringify(item)}`,true,false,true)">
				<view class="order-item-left">
					<image :src="'/static/images/' + (item.orderType !== 9 ? 'icon_pay' : 'icon_withdraw') + '.png'" />
				</view>
				<view class="order-item-center">
					<text>{{ item.memo }}</text>
					<text>{{ $util.getTime(item.createTime) }}</text>
				</view>
				<view class="order-item-right">
					<view :style="{color: item.orderType !== 9 ? '#666666' : '#F05353'}">
						<span style="font-size: 36rpx;margin-right: 10rpx">{{ item.orderType !== 9 ? '' : '-' }}</span>
						<span>{{ $util.toMoney(item.amount / 100) }}</span>
					</view>
				</view>
			</view>
			<zj-empty v-if="record.loaded && (record.list == null || record.list.length === 0)" text="暂无充值记录"
				:img="`${imgUrl}1639019849000/pic_order.png`" />
			<uni-load-more v-else :status="record.status"></uni-load-more>
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
					pager: {
						curPageNum: 0
					},
					list: []
				}
			}
		},
		methods: {
			loadRecordList() {
				this.record.list = [{
					"id": 229,
					"regionNo": "DL1306153654495223808",
					"platform": "default",
					"accountId": "fca69421c14543d9a6ab6a2fee19c649",
					"billNo": "100000000000031835111648623840440140",
					"trxaccDate": "2022-03-30",
					"trxaccTime": "15:04:00",
					"orderType": 9,
					"mediumId": "6214761402600868564",
					"mediumNo": "6230520700007071775",
					"amount": 1,
					"memo": "提现",
					"status": 1,
					"createTime": "2022-03-30T07:04:01.000+00:00",
					"updateTime": "2022-03-30T07:04:01.000+00:00"
				}, {
					"id": 225,
					"regionNo": "DL1306153654495223808",
					"platform": "default",
					"accountId": "fca69421c14543d9a6ab6a2fee19c649",
					"billNo": "100000000000031835111648178558614022",
					"trxaccDate": "2022-03-25",
					"trxaccTime": "11:22:38",
					"orderType": 8,
					"mediumId": "6214761402600868564",
					"mediumNo": "6230520700007071775",
					"amount": 521,
					"memo": "充值",
					"status": 1,
					"createTime": "2022-03-25T03:22:38.000+00:00",
					"updateTime": "2022-03-25T03:22:38.000+00:00",
					"appStatus": 1,
					"phone": "13338327256",
					"regionName": "软件园",
					"bankTp": "103"
				}]

			},

		},

		onLoad(option) {
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
	.user-user-recharge-record-page {
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
					width: 96rpx;
					height: 96rpx;
					line-height: 96rpx;
					text-align: center;
					background: #fff;
					border-radius: 50%;
					border: 2rpx solid #F5F5F5;

					image {
						width: 56rpx;
						height: 56rpx;
						vertical-align: middle;
						margin-top: -5rpx;
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

						&:last-child {
							color: #666666;
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
							font-size: 24rpx;
							color: #666666;
						}

						&:last-child {
							color: #161616;
							font-size: 32rpx;
							font-weight: 500;
							line-height: 1.2;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}
</style>