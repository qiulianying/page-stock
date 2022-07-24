<template>
	<view class="recharge_order">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">会员充值明细</block>
		</cu-custom>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in record.list" :key="index" @tap="goDetail(item)">
				<view class="order-item-left">
					<image :src="'/static/images/' + (item.orderType !== 9 ? 'icon_pay' : 'icon_withdraw') + '.png'"/>
				</view>
				<view class="order-item-center">
					<text>充值</text>
					<text>{{ $util.getTime(item.createTime) }}</text>
				</view>
				<view class="order-item-right">
					<view :style="{color: item.orderType !== 9 ? '#666666' : '#F05353'}">
						<span style="font-size: 36rpx;margin-right: 10rpx">{{ item.orderType !== 9 ? '' : '-' }}</span>
						<span>{{ $util.toMoney(item.amount) }}</span>
					</view>
				</view>
			</view>
			<zj-empty text="暂无充值记录"
				:img="`${imgUrl}1639019849000/pic_order.png`" />
			<!-- <uni-load-more :status="record.status"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
	// import { getOrderList } from '../../api/infopay'
  import { getOrderList } from '../../../api/infopay'
	import { mapActions } from 'vuex'
	export default {
		data() {
			return {
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
				shopInfo: {}
			}
		},
		methods: {
			...mapActions(['getAccountId']),
			async loadRecordList ({ curPageNum = 1 } = {}) {
				this.record.status = 'loading'
				await getOrderList({
					// accountId: await this.getAccountId(),
					// pager: {
					//   curPageNum: curPageNum,
					//   pageSize: 10
					// },
          orPositivePay: 1,
          transactionType: 4,
          pager: {
            curPageNum: curPageNum, 
            pageSize: 10
          },
          merchantNo: this.shopInfo.merchantNo
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
			},
      goDetail(item) {
        this.$toView(`/myPackageA/pages/member/recharge-detail?item=${JSON.stringify(item)}`,true,false,true)
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
			console.log('option', option)
			if (option.shopInfo) {
				this.shopInfo = JSON.parse(option.shopInfo)
				console.log('this.shopInfo',this.shopInfo)
			}
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
	.recharge_order {
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

