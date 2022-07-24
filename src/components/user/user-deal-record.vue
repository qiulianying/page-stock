<template>
	<view class="user-user-deal-record-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ pageLang.title }}</block>
		</cu-custom>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index" @tap="$toView(`/myPackageA/pages/dealRecord/user-deal-record-detail?billNo=${item.billNo}`,false, false, true)">
				<view class="order-item-left">
					<image :src="fileBaseURL + item.saler.merchantLogo"/>
				</view>
				<view class="order-item-center">
					<text>{{ item.saler.merchantName }}</text>
					<text>{{ item.createTime }}</text>
				</view>
				<view class="order-item-right">
					<text>-{{ $util.toMoney(item.actualAmount) }}</text>
				</view>
			</view>
			<zj-empty v-if="record.loaded && (record.list == null || record.list.length === 0)" :text="pageLang.emptyRecord"/>
			<uni-load-more v-else :status="record.status"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { getOrderList } from '../../../api/infopay'

	export default {
		data() {
			return {
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
				}
			}
		},
		computed: {
			pageLang () {
				return this.$t('pages.user.userDealRecord')
			}
		},
		methods: {
			async loadRecordList ({ curPageNum = 1 } = {}) {
				this.record.status = 'loading'
				await getOrderList({
					regionNo: this.$regionId,
					statuses: [3],
					pager: {
					  curPageNum: curPageNum,
					  pageSize: 10
					}
				}, {
					hideLoading: true,
					errorRedirect: !this.visible.page
				}).then(res => {
					this.record.loaded = true
					this.record.pager = res.pager
					if (this.record.pager.curPageNum < this.record.pager.totalPageNum) {
						this.record.status = 'more'
					} else {
						this.record.status = 'noMore'
					}
					if (this.record.pager.curPageNum <= 1) {
						this.record.list = res.object
					} else if (this.record.pager.pageSize * this.record.pager.curPageNum >= this.record.list.length) {
						this.record.list = this.record.list.concat(res.object)
					}
					this.visible.page = true
					uni.stopPullDownRefresh()
				}).catch (err => {
					console.error(err)
					this.record.status = 'more'
					this.record.loaded = true
					uni.stopPullDownRefresh()
				})
			},
			async initData () {
				await this.loadRecordList()
			}
		},
		onPullDownRefresh () {
			this.initData()
		},
		onReachBottom () {
			if (this.record.pager.curPageNum === 0) {
				return
			}
			if (this.record.status === 'loading' || this.record.loaded && (this.record.list == null || this.record.list.length === 0)) {
				return
			}
			if (this.record.pager.curPageNum >= this.record.pager.totalPageNum) {
				return
			}
			this.loadRecordList({
				curPageNum: ++this.record.pager.curPageNum
			})
		},
		async onLoad (option) {
			await this.$onLaunched
			await this.initData()
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
						width: 96rpx;
						height: 96rpx;
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
