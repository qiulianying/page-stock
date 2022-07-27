<template>
	<view class="discount">
		<!-- <cu-custom bgColor="bg-theme">
			<block slot="input" style=" width: calc(100vw - 220rpx - 30rpx);">
				<u-search placeholder="搜索门店、商品" v-model="searchValue" shape="round" height="60"
        :show-action="false" color="#606266" placeholder-color="#606266" @tap="searchData" disabled></u-search>
			</block>
		</cu-custom> -->
		<cu-custom bgColor="bg-theme">
			<block slot="backText" class="text-white">权益</block>
		</cu-custom>
		<view class="discount-top">
			<image class="discount-top-img" :src="imgUrl + '1634631729308/discount.png'"></image>
		</view>

		<view class="discount-middle" v-if="tabList.length > 0">
			<!-- tab栏 -->
			<u-sticky :offset-top="statusBarHeight">
				<view>
					<u-tabs :list="tabList" :is-scroll="tabList.length > 3" :active-color="themeColor"
						:current="current" @change="changeTab" font-size="28"></u-tabs>
				</view>
			</u-sticky>
			<!-- <u-tabs :list="list" :is-scroll="list.length > 5" :current="current" @change="change" font-size="28"></u-tabs> -->
		</view>
		<view class="discount-data" v-if="shopData.length > 0">
			<!-- 商品详情 -->
			<view class="discount-data-detail" v-for="(shop, shopIndex) in shopData" :key="shopIndex"
				@click="toCouponDetail(shop)">
				<view class="discount-data-detail-img">
					<image class="discount-top-img"
						:src=" shop.pic ? spMatefileBaseURL + shop.pic + fixStr : '../../../static/logo.png'"></image>
				</view>
				<view class="discount-data-detail-product">
					<view class="discount-data-detail-product-name">
						{{shop.name || ''}}
					</view>
					<view class="discount-data-detail-product-price">
						<view class="value">￥{{shop.realPrice.toFixed(2)}}</view>
						<view class="botton">
							<u-button type="error" :custom-style="customStyle" :hair-line="false" shape="circle"
								@click="toCouponDetail(shop)">马上抢
							</u-button>
						</view>
					</view>
					<view class="discount-data-detail-product-data">
						<view class="origin">
							<template
								v-if="shop.originalPrice && shop.originalPrice!=shop.realPrice">原价￥{{shop.originalPrice.toFixed(2)}}</template>
						</view>
						<view class="stack">已售：<text style="color: #FFB025">{{shop.saleNum}}</text></view>
					</view>
				</view>
			</view>

		</view>
		<zj-empty v-if="shopData.length === 0" :img="`${imgUrl}1639019849000/pic_search.png`" text="暂无相关商品～"
			:shortWindows="true" />
		<uni-load-more v-if="shopData.length > 0" :status="record.status"></uni-load-more>
	</view>
</template>

<script>
	export default {
		name: 'discount',
		components: {},
		props: {
			isReachBottom: {
				// 是否上拉页面
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				tabList: [{
					"name": "电影演出",
					"paths": "4248b307ac57a7f7c77a1c487a9029a9"
				}, {
					"name": "餐饮美食",
					"paths": "c30b7daea9ee992d1fb24dbaee8d27f7"
				}, {
					"name": "游乐园1",
					"paths": "788797b43a4bd1b778ff12bd945fd0f9"
				}, {
					"name": "体育健身",
					"paths": "813dff47b9f4c0d34b10ab79575001c8"
				}, {
					"name": "食品1",
					"paths": "07f15be017ace8e20976f7c546efb9ed"
				}],
				current: 0,
				searchValue: '',
				type: 'text',
				customStyle: {
					width: '132rpx',
					height: '56rpx',
					fontSize: '13px',
					background: 'linear-gradient(to right, #F46A6A , #E43838)'
				},
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				// spMatefileBaseURL
				record: {},
				shopData: [{
					"id": "ec2ba14d87b640db97bb7fd99670f9c5",
					"name": "权益汇总测试",
					"pics": ["service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg"],
					"pic": "service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
					"description": "<p>美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭</p>",
					"goodsPrice": 0.01,
					"isOpenStore": 1,
					"remainStore": 17,
					"maxStore": 0,
					"realPrice": 0.01,
					"saleNum": 7,
					"instructions": "<p>美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭美味多汁的烤鸭</p>",
					"transactionQueryTypes": [],
					"payTypes": []
				}, {
					"id": "a74700595e2140aba11018e306451f50",
					"name": "青椒炒肉",
					"pics": ["service-org-7adc24dc/20211214/35682771a0dc4109b9a75731dbc4f64f.jpg"],
					"pic": "service-org-7adc24dc/20211214/35682771a0dc4109b9a75731dbc4f64f.jpg",
					"description": "",
					"goodsPrice": 0.01,
					"isOpenStore": 1,
					"remainStore": 0,
					"maxStore": 0,
					"realPrice": 0.01,
					"saleNum": 9,
					"instructions": "",
					"transactionQueryTypes": [],
					"payTypes": []
				},{
					"id": "d93d9d1d579240488733aaf4e4407380",
					"name": "ktv套票",
					"pics": ["service-org-7adc24dc/20220209/bea013263f8b4f81be7dca6531a9878c.png"],
					"pic": "service-org-7adc24dc/20220209/bea013263f8b4f81be7dca6531a9878c.png",
					"description": "",
					"goodsPrice": 20,
					"isOpenStore": 1,
					"remainStore": 99,
					"maxStore": 0,
					"realPrice": 20,
					"saleNum": 0,
					"instructions": "",
					"transactionQueryTypes": [],
					"payTypes": [],
					"originTags": "娱乐,特惠"
				}, {
					"id": "fb54fdf375b1413398f90de57e9271d4",
					"name": "电影票",
					"pics": ["service-org-7adc24dc/20220209/9731b2a44e8f4c938698e8021b983f31.png"],
					"pic": "service-org-7adc24dc/20220209/9731b2a44e8f4c938698e8021b983f31.png",
					"description": "",
					"goodsPrice": 60,
					"isOpenStore": 1,
					"remainStore": 0,
					"maxStore": 0,
					"realPrice": 60,
					"saleNum": 0,
					"instructions": "",
					"transactionQueryTypes": [],
					"payTypes": [],
					"originTags": "精彩电影"
				}],
				statusBarHeight: 0,
				CustomBar: this.CustomBar,
				themeColor: '',
				path: '',
				params: {},
				location: {},
				imgUrl: ''
			};
		},
		watch: {
			isReachBottom: {
				handler(val) {
					// 如果上拉页面了，则重新调用接口
					this.onReachbottom()
				}
			}
		},
		computed: {},
		created() {
			this.fixStr = this.$imageFixStr(700, 350)
			console.log('this.fixStr', this.fixStr)
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			// 获取导航栏的高度，并将px转换成rpx单位的数值，因为组件要求数值单位为rpx
			this.statusBarHeight = this.CustomBar / (uni.upx2px(100) / 100)
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

			// #ifdef H5
			//  对于H5页面，吸顶的距离不一样
			this.statusBarHeight = -(this.CustomBar / (uni.upx2px(100) / 100))
			//  #endif
		},
		beforeDestroy() {},
		methods: {
			changeTab(index) {
				this.current = index;
			},
			// 获取数据
			getDetail() {
				this.params.voucherFlag = 0
			},
			onReachbottom() {

				if (this.record.curPageNum === 0) {
					return
				}
				if (this.record.status === 'loading' || this.record.loaded && (this.shopData == null || this.shopData.length === 0)) {
					return
				}
				if (this.record.curPageNum >= this.record.totalPageNum) {
					return
				}
				this.params.pager.curPageNum = ++this.record.curPageNum
				this.getDetail()
			},
			toCouponDetail(item) {
				uni.navigateTo({
					url: `/myPackageA/pages/coupon/coupon-detail?goodsId=${item.id}&lon=${this.location.longitude}&lat=${this.location.latitude}`,
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.discount {
		// height: calc(100vh - 130rpx);
		padding-bottom: 120rpx;
		overflow-y: auto;

		.discount-top {

			.discount-top-img {
				height: 50vw;
				width: 100vw;
			}
		}

		.discount-data {
			padding: 24rpx 24rpx 0 24rpx;

			// height: calc(100vh - 50vw - 84rpx - 130rpx - 120rpx);
			// overflow-y: auto;
			.discount-data-detail {
				background: white;
				border-radius: 10rpx;
				padding-bottom: 32rpx;
				margin-bottom: 16rpx;

				.discount-data-detail-img {
					image {
						width: calc(100vw - 48rpx);
						height: calc(50vw - 24rpx);
					}
				}

				.discount-data-detail-shop {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 24rpx 0 24rpx;

					.name {
						font-weight: 500;
						font-size: 30rpx;
						color: #161616;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						display: flex;
						align-items: center;
						color: #A9A9A9;
						font-size: 12px;
						width: 300rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;

						.tri {
							width: 10rpx;
							height: 32rpx;
							border-top: 8rpx solid transparent;
							border-right: 0;
							border-bottom: 8rpx solid transparent;
							// border-left: 10rpx solid #34A2E8;
							margin-right: 16rpx;
						}

						.shopname {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							flex: 1;
						}
					}

					.distance {
						color: #A9A9A9;
						font-size: 12px;
						flex: 1;
						text-align: right;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: flex;

						.address {
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							padding-right: 10rpx;
						}

						.far {
							max-width: 160rpx;
							padding-left: 10rpx;
						}

					}
				}

				.discount-data-detail-product {
					padding: 0 24rpx 0 24rpx;

					.discount-data-detail-product-name {
						font-weight: 500;
						font-size: 15px;
						color: #161616;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						margin-top: 20rpx;

					}

					.discount-data-detail-product-price {
						display: flex;
						justify-content: space-between;
						align-items: center;
						// margin-top: 20rpx;

						.value {
							color: #E43838;
							font-size: 15px;
							font-weight: bold;

						}

						.botton {}
					}

					.discount-data-detail-product-data {
						margin-top: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.origin {

							color: #A9A9A9;
							font-size: 12px;
							text-decoration: line-through;

						}

						.stack {

							color: #A9A9A9;
							font-size: 12px;

						}
					}
				}
			}
		}
	}
</style>
