<template>
	<view>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">门店列表</block>
		</cu-custom>
		<view class="coupon-detail-shop">
			<view class="coupon-detail-shop-list">
				<scroll-view scroll-y='true' class="scroll-vi" :style="{height: `calc(100vh - 30rpx - ${CustomBar}px)`}" @scrolltolower='lower'>
					<view class="coupon-detail-shop-list-data" v-for="(item, index) in shopDetail" :key="index">
						<!-- 店铺名称和地址 -->
						<view class="coupon-detail-shop-list-data_detail">
							<view class="coupon-detail-shop-list-data_detail_name">
								{{item.merchantName}}
							</view>
							<view class="coupon-detail-shop-list-data_detail_address">
								{{item.address}}
							</view>
						</view>
						<!-- 距离 -->
						<view class="coupon-detail-shop-list-data_diatance" v-if="location.latitude && location.longitude">
							{{item.disance ? parseFloat(item.disance).toFixed(2) : parseFloat(item.sort[0]).toFixed(2)}}km
						</view>
						<!-- 按钮 -->
						<view class="coupon-detail-shop-list-data_phone" v-if="item.linkPhone">
							<!-- 手机图标 -->
							<!-- <image @tap="callPhone(item.linkPhone)" src="../../../static/images/icon/icon_phone.png">
							</image> -->
							<view class="icon-box">
								<u-icon name="phone-fill" :color="themeColor" size="36" @tap="callPhone(item.linkPhone)"></u-icon>
							</view>
						</view>
					</view>
					<view v-if="noData" class="point-no-data">没有更多数据了</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRightData,
		suitMerchant
	} from '../../../api/rightsmarketing'
	import {
		// orgHomeConfig,
		getMerchantList
	} from '../../../api/infouser'

	export default {
		name: 'coupon-detail-shop',
		components: {},
		props: {},
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				CustomBar: this.CustomBar,
				shopDetail: [{"type":"info-merchant","id":"MD1413109041353330688","version":0,"index":"info-merchant","sort":[4.796891022851411,1648218473000],"found":false,"seqNo":0,"primaryTerm":0,"merchantName":"精彩电影","merchantNo":"9ZLWBzob","linkPhone":"13599098689","logo":"service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg","address":"软件大道89号A区双创城"}],
				goodsId: '',
				location: {
					lat: '',
					lon: ''
				},
				query: {
					pager: {
						curPageNum: 1,
						pageSize: 20,
					}
				},
				total: '',
				totalPage: '',
				noData: false,
				canUseMerchants: []
			};
		},
		watch: {},
		computed: {},
		created() {},
		onLoad(option) {
			this.goodsId = option.goodsId
			this.location.latitude = option.lat
			this.location.longitude = option.lon
			// 代金券和权益调用同一个门店查看接口
			console.log(option.canUseMerchants)
			this.canUseMerchants = []
			if (option.canUseMerchants.length > 0) {
				this.canUseMerchants = option.canUseMerchants.split(',')
			}
			this.getShopList()
		},
		mounted() {},
		beforeDestroy() {},
		methods: {
			// 打电话
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			lower() {
				console.log('到底了')
				if (this.totalPage>this.query.pager.curPageNum) {
					this.query.pager.curPageNum++
					this.getShopList()
				} else {
					this.noData = true
				}
			},
			getShopList() {
				// 调用适用门店接口
				suitMerchant({
					regionNo: this.$regionId,
					merchantNos: this.canUseMerchants,
					lon: parseFloat(this.location.longitude),
					lat: parseFloat(this.location.latitude),
					distance: "1000km",
					pager: {
						curPageNum: this.query.pager.curPageNum,
						pageSize: this.query.pager.pageSize
					}
				}).then(res => {
					if (res.object.length > 0) {
						// this.shopDetail.push(...res.object)
					} else {
						this.noData = false
					}
					// this.shopDetail = res.object
					this.total = res.pager.totalCount
					this.totalPage = Math.ceil(res.pager.totalCount/this.query.pager.pageSize)
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.coupon-detail-shop {
		.scroll-vi{
			overflow: hidden;
		}
		.point-no-data{
      text-align: center;
      padding: 50rpx 0;
    }
		background: white;

		&-list {
			padding: 30rpx 0 0;

			&-data {
				display: flex;
				align-items: cneter;
				padding: 30rpx;
				border-bottom: 5rpx solid #f5f5f5;

				&_detail {
					flex: 1;
					margin-right: 20rpx;
					word-break: break-all;

					&_name {
						margin-bottom: 20rpx;
						font-size: 30rpx;
						font-weight: bold;

					}

					&_address {
						font-size: 24rpx;

					}
				}

				&_diatance {
					width: 145rpx;
					font-size: 24rpx;

				}

				&_phone {
					width: 120rpx;
					border-left: 5rpx solid #f5f5f5;
					.icon-box{
						width:50rpx;
						height:50rpx;
						border-radius: 50rpx;
						background: #f6f6f6;
						display: flex;
						justify-content: center;
						align-items: center;
						float: right;
					}	
					image {
						height: 50rpx;
						width: 50rpx;
						float: right;
					}
				}
			}

			&-data:last-child {
				border-bottom: none;
			}
		}
	}
</style>
