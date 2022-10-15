<template>
	<view class="user-user-deal-record-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="content">助梦记录</block>
		</cu-custom>
		<!--标签定义多种查询情况-->
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" :active-color="themeColor"></u-tabs>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index"
				@tap="$toView(`/myPackageA/pages/dealRecord/user-deal-record-detail?billNo=${item.billNo}`,false, false, true)">
				<view class="order-item-left">
					<image src="../../../static/images/pay/bank_card.png" />
				</view>
				<view class="order-item-center">
					<text>{{ item.saler.merchantName || item.items[0].name }}</text>
					<text>{{ item.createTime }}</text>
				</view>
				<view class="order-item-right">
					<!-- 退款情况 -->
					<view>+{{ $util.toMoney(item.actualAmount) }}</view>
					<view>+{{ $util.toMoney(item.actualAmount) }}</view>
				</view>
			</view>
			<zj-empty v-if="record.loaded && (record.list == null || record.list.length === 0)"
				:text="pageLang.emptyRecord" :img="`${imgUrl}1639019849000/pic_order.png`" />
			<!-- <uni-load-more v-else :status="record.status"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
	import {  } from '../../../api/platformgouc'
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
					name: '收入'
				}, {
					name: '支出'
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
