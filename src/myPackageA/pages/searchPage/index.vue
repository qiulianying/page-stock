<template>
	<view class="search-page">
		<cu-custom bgColor="bg-white" is-back :goBack="true">
			<block slot="backText" class="text-black">搜索</block>
		</cu-custom>
		<view class="search-top-part">
			<view class="search-box">
				<view class="search-box-left">
					<u-search :placeholder="searchText" v-model="keyword" :focus="true" :show-action="false" @search="inputSearch()">
					</u-search>
				</view>
				<view class="search-box-right" @click="doSearch">搜索</view>
			</view>
			<view class="search-word-history" v-if="historyList.length>0 && showTop">
				<view class="search-word-title">
					<text>搜索历史</text>
					<u-icon name="trash" color="#969696" size="36" @click="clearHistory"></u-icon>
				</view>
				<view class="search-history-box">
					<view class="search-history" v-for="(item,index) in historyList" :key="index">
						<text @click="changeKeyword(item)">{{item}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="search-bot-part">
			<!-- 商家列表 -->
			<scroll-view v-if="myRegionCtn" scroll-y="true" class="index-shop">
				<view v-for="shopItem in resultList" :key="shopItem.id" class="index-shop-item"
					@tap="$toView(`shop/shop-detail?merchantNo=${shopItem.merchantNo}`, true)">
					<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
					<image class="index-shop-item-logo"
								:src="$util.strIsEmpty(shopItem.logo) ? '/static/images/login-grey.png' : (fileBaseURL + shopItem.logo + fixStr)"
								mode="aspectFit" @error="onErrorShopLogo(shopItem)" />
					<view class="index-shop-item-box">
						<view class="index-shop-item-title text-black">{{ shopItem.merchantName }}</view>
						<view class="index-shop-item-type">
							<text class="cuIcon- zjIcon-tag_type"
									style="font-size: 30rpx;vertical-align: middle;"></text>
							<text v-if="shopItem.categoryArray != null && shopItem.categoryArray.length > 0"
									class="margin-left-xs">{{ shopItem.categoryArray[shopItem.categoryArray.length - 1].categoryName }}</text>
						</view>
						<view class="index-shop-item-address text-black">
							<text v-if="$util.strIsNotEmpty(shopItem.address)">{{ shopItem.address }}</text>
							<text
									v-if="location != null && shopItem.location != null">{{ $util.getDistance(location.latitude, location.longitude, shopItem.location.lat, shopItem.location.lon) }}</text>
						</view>
						<template v-if="shopItem.favList != null && shopItem.favList.length > 0">
							<view v-for="(item, index) in shopItem.favList" :key="index"
									class="index-shop-item-fav">
								<zj-icon>券</zj-icon>{{ item.title }}
							</view>
						</template>
					</view>
				</view>
			</scroll-view>
			<!-- 代金券列表 -->
			<scroll-view v-if="!myRegionCtn" scroll-y="true" class="index-shop">
				<view v-for="couponItem in resultList" :key="couponItem.id" class="index-shop-item">
					<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
					<image class="index-shop-item-logo"
						:src="$util.strIsEmpty(couponItem.pic) ? '/static/images/login-grey.png' : (fileBaseURL + couponItem.pic + fixStr)"
						mode="aspectFit" @error="onErrorShopLogo(couponItem)"
						@tap="$toView(`/myPackageA/pages/cash-coupon?couponId=${couponItem.id}&lat=${location.latitude}&lon=${location.longitude}`, true, false, true)" />
					<view class="index-shop-item-box coupon-mid"
						@tap="$toView(`/myPackageA/pages/cash-coupon?couponId=${couponItem.id}&lat=${location.latitude}&lon=${location.longitude}`, true, false, true)">
					<view class="index-shop-item-title text-black text-2line">{{couponItem.name}}</view>
					<view class="text-2line" style="height: auto;" v-if="couponItem.discountCondition">
						消费满{{couponItem.discountCondition}}元可用</view>
					</view>
					<view class="index-shop-item-btn coupon-mid" style="align-items: center">
						<view style="font-size: 30rpx; color: red"><text
							style="font-size: 36rpx; font-weight: bold;">{{couponItem.realPrice}}</text>元
						</view>
						<view style="text-decoration: line-through" v-if="couponItem.value">
							{{couponItem.value}}元</view>
						<view v-if="couponItem.isOpenStore === 1 && couponItem.remainStore > 0"><button
							class="coupon-mid-btn" :style="{background: `${themeColor}`}"
							@click="clickCoupon(couponItem.realPrice > 0, couponItem.id)">{{ couponItem.realPrice > 0 ? '购买' : '领取' }}</button>
						</view>
						<view v-else-if="couponItem.isOpenStore === 1 && couponItem.remainStore <= 0">已售罄</view>
						<view v-else-if="couponItem.isOpenStore === 0"><button class="coupon-mid-btn" :style="{background: `${themeColor}`}"
							@click="clickCoupon(couponItem.realPrice > 0, couponItem.id)">{{ couponItem.realPrice > 0 ? '购买' : '领取' }}</button>
						</view>
					</view>
				</view>
			</scroll-view>

			<zj-empty v-if="resultList.length === 0 && !showTop" text="抱歉，暂未搜索到相关内容" :img="`${imgUrl}1639019849000/pic_search.png`"/>
			<uni-load-more v-if="resultList.length > 0 && !showTop" :status="record.status"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		orgHomeConfig,
		getMerchantList
	} from '../../../api/infouser'
	import {
		getPreSettleCalc
	} from '../../../api/rightsmarketing'
	import {
		receiveCoupon
	} from '../../../api/shopmall'
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				imgUrl: this.$imgUrl,
				showTop: true,
				keyword: '',
				historyList: [],
				resultList: [],
				location: {},
				record: {
					curPageNum: 1,
          pageSize: 20
				},
				location: {},
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				timer: null,
				myRegionCtn: !(this.$const.REGION_NAME[uni.getStorageSync('regionNo')]),  // 为false表示是德州的渠道
				searchText: '搜索梦想',
			}
		},
		components: {
		},
		computed: {
		},
		watch: {
			keyword: {
				handler(newVal) {
					if (newVal == '') {
						this.showTop = true
						this.resultList = []
					}
				},
				immediate: true,
				deep: true
			},
		},
		onLoad(option) {
			this.location = {
				longitude: option.lon,
				latitude: option.lat
			}
			console.log('this.location------------this.location',this.location)
			let historyList = uni.getStorageSync('searchHistory')
			this.historyList = (historyList == undefined || historyList == '') ? [] : JSON.parse(historyList)
			console.log('onload------------this.historyList',historyList)
		},
		methods: {
			onReachBottom () {
				if (this.record.curPageNum === 0) {
					return
				}
				if (this.record.status === 'loading' || this.record.loaded && (this.resultList == null || this.resultList.length === 0)) {
					return
				}
				if (this.record.curPageNum >= this.record.totalPageNum) {
					return
				}
				this.record.curPageNum = ++this.record.curPageNum
				// this.inputSearch()
				// this.couponSearch()
				this.doSearch()
			},
			doSearch() {
				console.log('this.myRegionCtn', this.myRegionCtn)
				if (this.myRegionCtn) {
					this.inputSearch()  // 除德州以外的平台搜索商家，暂时
				} else {
					this.couponSearch() // 德州平台搜索代金券，暂时
				}
			},
			// 搜索代金券的方法，先应对年前的一波上线，后续修改
			couponSearch() {
				if (this.keyword == '') {
					return
				}
				getPreSettleCalc({
					regionNo: this.$regionId,
					// status: '1',
					name: this.keyword,
					voucherFlag: 1,
					pager: {
						curPageNum: this.record.curPageNum,
						pageSize: this.record.pageSize
					}
				}).then(res => {
					console.log('res==========================', res)
					this.showTop = false
					this.record.status === 'loading'
					this.record = res.pager
					if (this.record.curPageNum * this.record.pageSize < this.record.totalCount) {
						this.record.status = 'more'
					} else {
						this.record.status = 'noMore'
					}
					// 获取到的数据进行处理
					if (this.record.curPageNum <= 1) {
						this.resultList = res.object || []
					} else if (this.record.pageSize * this.record.curPageNum >= this.resultList.length) {
						this.resultList = this.resultList.concat(res.object)
					}
					uni.stopPullDownRefresh()

					// 请求成功后将搜索关键字记录进缓存
					if (this.historyList.indexOf(this.keyword) == -1) {
						if (this.historyList.length>=6) {
							this.historyList.pop()
						}
					} else {
						let idx = this.historyList.indexOf(this.keyword)
						this.historyList.splice(idx, 1)
					}
					if (this.keyword != '') this.historyList.unshift(this.keyword)
					uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
				})
			},
			// 代金券的领取或购买
			clickCoupon(isBuy, goodsId) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {

					if (uni.getStorageSync('mspIsMember')) {
						// 如果登陆了
						if (isBuy) {
							this.$toView(
									`/myPackageA/pages/cash-coupon?couponId=${goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`,
									true, false, true)
						} else {
							// 领取优惠券
							receiveCoupon({
								rightsId: goodsId, //代金券Id 必填
								couponCount: 1 //领券数量 必填
							}).then(res => {
								console.log(res)
								if (res.errcode === '0') {
									uni.showToast({
										title: '领取成功',
										duration: 3000,
										icon: 'success'
									})
									uni.navigateTo({
										// url: '/pages/user/user-coupon-list'
										// url: '/myPackageA/pages/userCoupon/user-coupon-list'
										url: '/myPackageA/pages/userCoupon/user-coupon-all'
									})
								} else {
									uni.showToast({
										title: '领取失败',
										duration: 3000,
										icon: 'error'
									})
								}

							})
						}
					} else {
						let url = encodeURIComponent(`/pages/index/index?tabName=0`)
						uni.navigateTo({
							url: `/pages/login/login?fromurl=${url}`
						})
					}

				}, 1000)


			},
			// 搜索门店的方法
			inputSearch() {
				if (this.keyword == '') {
					return
				}
				let params = {
					distance: "20000km",
					lat: this.location.latitude,
					lon: this.location.longitude,
					managementType: 0,
					merchantName: this.keyword,
					pager: {
						curPageNum: this.record.curPageNum,
						pageSize: this.record.pageSize
					},
					regionNo: this.$regionId
				}
				getMerchantList(params).then(res => {
					console.log('res==========================', res)
					this.showTop = false
					// this.record.status === 'loading'
					this.record = res.pager
					if (this.record.curPageNum * this.record.pageSize < this.record.totalCount) {
						this.record.status = 'more'
					} else {
						this.record.status = 'noMore'
					}
					// 获取到的数据进行处理
					if (this.record.curPageNum <= 1) {
						this.resultList = res.object || []
					} else if (this.record.pageSize * this.record.curPageNum >= this.resultList.length) {
						this.resultList = this.resultList.concat(res.object)
					}
					uni.stopPullDownRefresh()

					// 请求成功后将搜索关键字记录进缓存
					if (this.historyList.indexOf(this.keyword) == -1) {
						if (this.historyList.length>=6) {
							this.historyList.pop()
						}
					} else {
						let idx = this.historyList.indexOf(this.keyword)
						this.historyList.splice(idx, 1)
					}
					if (this.keyword != '') this.historyList.unshift(this.keyword)
					uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
				}).catch(err => {
					console.error(err)
				})
			},
			changeKeyword(word) {
				if (this.keyword == word) {
					return
				}
				this.keyword = word
				// this.inputSearch()
				// this.couponSearch()
				this.doSearch()
			},
			clearHistory() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认删除全部历史记录？',
					success: function (res) {
						if (res.confirm) {
							try {
								uni.removeStorageSync('searchHistory')
								that.historyList = []
							} catch (e) {
								// error
							}
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			onErrorShopLogo(item) {
				this.$set(item, 'logo', null)
			}
		}
	}
</script>

<style lang="scss">
	.search-page{
		.search-top-part{
			width: 100%;
			min-height: 110rpx;
			background: #fff;
			position: fixed;
			left: 0;
			z-index: 100;
			.search-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx;
				box-sizing: border-box;
				.search-box-left{
					width: 614rpx;
				}
				.search-box-right{
					color: #666;
					font-size: 28rpx;
				}
			}
			.search-word-history{
				padding: 16rpx 24rpx 0;
				.search-word-title{
					font-size: 30rpx;
					color: #666666;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.search-history-box{
					padding: 16rpx 0 0;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					.search-history{
						padding: 0 24rpx;
						// width: 100%;
						height: 52rpx;
						line-height: 52rpx;
						border-radius: 52rpx;
						background: #F4F5F7;
						color: #666666;
						font-size: 28rpx;
						margin-right: 20rpx;
						margin-bottom: 20rpx;
					}
				}
			}
		}
		.search-bot-part{
			padding: 134rpx 24rpx;

				.index-shop {
					// height: 500rpx;
					&-item {
						margin-bottom: 20rpx;
						padding: 32rpx 20rpx;
						border-radius: 16rpx;
						background: #FFFFFF;
						display: flex;

						&-logo {
							width: 144rpx;
							height: 144rpx;
							border-radius: 8rpx;
							border: 2rpx solid #F5F5F5;
						}

						&-box {
							flex: 1;
							margin-left: 24rpx;
						}

						.coupon-mid {
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							.coupon-mid-btn {
								background-color: #34A2E8;
								height: 50rpx;
								line-height: 50rpx;
								text-align: center;
								font-size: 30rpx;
								padding: 0 35rpx;
								color: white;
							}

						}

						&-title {
							margin-top: 2rpx;
							height: 44rpx;
							font-size: 34rpx;
							font-weight: 500;
							line-height: 44rpx;
							overflow: hidden;
						}

						&-type,
						&-fav,
						&-address {
							height: 34rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #666666;
							line-height: 34rpx;
							margin-top: 16rpx;
						}

						&-address {
							display: flex;

							text {
								&:first-child {
									flex: 1;
									overflow: hidden;
									margin-right: 6rpx;
								}
							}
						}
					}
				}

		}
	}
</style>
