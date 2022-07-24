<template>
	<view class="user-user-fav-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">我的收藏</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view @tap="tabSelect(0)" class="cu-item flex-sub" :class="0 == tabCurrentIndex ? 'text-theme cur' : ''"
					:style="[{color: 0 == tabCurrentIndex ? themeColor : ''}]">
					收藏商品
				</view>
				<view @tap="tabSelect(1)" class="cu-item flex-sub" :class="1 == tabCurrentIndex ? 'text-theme cur' : ''"
					:style="[{color: 1 == tabCurrentIndex ? themeColor : ''}]">
					收藏门店
				</view>
			</view>
		</scroll-view>
		<swiper :current="tabCurrentIndex" class="fav-list-box" :style="{
			height: `calc(100% - 90rpx - ${CustomBar}px)`
		}" duration="300" @change="changeTab">
			<swiper-item @touchmove.stop="">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<uni-swipe-action class="fav-goods">
						<view class="box" v-for="(goodsItem, goodsIndex) in navList[0].list" :key="goodsIndex">
							<uni-swipe-action-item :right-options="options"
								@click="swipeClick($event, 0, goodsItem.collectId, goodsIndex)">
								<view class="fav-goods-item" @tap.stop="toCouponDetail(goodsItem.collectId)">
									<view class="m-img">
										<image style="width: 100%;height: 100%;"
											:src="goodsItem.extra.pic ?  spMatefileBaseURL + goodsItem.extra.pic + fixStr : '/static/logo.png'"
											mode="aspectFit"></image>
									</view>
									<view class="m-text">
										<view class="m-title">{{goodsItem.collectName}}</view>
										<!-- <view class="m-descripe">{{goodsItem.desc}}</view> -->
										<!-- <view class="m-descripe">{{goodsItem.shop}}</view> -->
										<!-- <view class="m-spec">
											<view class="cu-tag radius">{{goodsItem.spec}}</view>
										</view> -->
										<view class="m-price-box">
											<view class="m-price">￥{{goodsItem.extra.goodsPrice}}</view>
											<!-- <view class="m-old-price" v-if="goodsItem.price > goodsItem.sellPrice">
												<text>￥{{goodsItem.price}}</text>
											</view> -->
										</view>
										<!-- <view class="m-number">
											<zj-number-box :value="goodsItem.number" :rowData="goodsItem"></zj-number-box>
										</view> -->
									</view>
								</view>
							</uni-swipe-action-item>
						</view>
					</uni-swipe-action>
					<zj-empty v-if="navList[0].loaded && (navList[0].list == null || navList[0].list.length === 0)"
						text="暂无收藏商品" :img="`${imgUrl}1639019849000/pic_collecting.png`" />
					<uni-load-more v-else :status="navList[0].status"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item @touchmove.stop="">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<uni-swipe-action class="fav-shop">
						<view class="box" v-for="(shopItem, shopIndex) in navList[1].list" :key="shopItem.id">
							<uni-swipe-action-item :right-options="options"
								@click="swipeClick($event, 1, shopItem.extra.merchantNo, shopIndex)">
								<view class="fav-shop-item"
									@tap="$toView(`shop/shop-detail?merchantNo=${shopItem.extra.merchantNo}`)">
									<image class="fav-shop-item-logo"
										:src="$util.strIsEmpty(shopItem.extra.logo) ? '/static/images/login-grey.png' : (fileBaseURL + shopItem.extra.logo)"
										mode="aspectFit" @error="onErrorShopLogo(shopItem)" />
									<view class="fav-shop-item-box">
										<view class="fav-shop-item-title text-black">{{ shopItem.collectName }}</view>
										<view class="fav-shop-item-type">
											<text class="cuIcon- zjIcon-tag_type"
												style="font-size: 30rpx;vertical-align: middle;"></text>
											<text
												v-if="shopItem.categoryArray != null && shopItem.categoryArray.length > 0"
												class="margin-left-xs">{{ shopItem.categoryArray[shopItem.categoryArray.length - 1].categoryName }}</text>
										</view>
										<view class="fav-shop-item-address text-black">
											<text
												v-if="$util.strIsNotEmpty(shopItem.extra.address)">{{ shopItem.extra.address }}</text>
											<!-- <text v-if="location != null && shopItem.location != null">{{ $util.getDistance(location.latitude, location.longitude, shopItem.location.lat, shopItem.location.lon) }}</text> -->
										</view>
										<template v-if="shopItem.favList != null && shopItem.favList.length > 0">
											<view v-for="(item, index) in shopItem.favList" :key="index"
												class="fav-shop-item-fav">
												<zj-icon>券</zj-icon>{{ item.title }}
											</view>
										</template>
									</view>
								</view>
							</uni-swipe-action-item>
						</view>
					</uni-swipe-action>
					<zj-empty v-if="navList[1].loaded && (navList[1].list == null || navList[1].list.length === 0)"
						text="暂无收藏门店" :img="`${imgUrl}1639019849000/pic_collecting.png`" />
					<uni-load-more v-else :status="navList[1].status"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$imgUrl,
				CustomBar: this.CustomBar,
				tabCurrentIndex: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#F05353'
					}
				}],
				navList: [{
					loaded: false,
					status: 'more',
					pager: {
						curPageNum: 0
					},
					list: []
				}, {
					loaded: false,
					status: 'more',
					pager: {
						curPageNum: 0
					},
					list: []
				}],
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				type: 3,
				themeColor: ''
			}
		},
		mounted() {

			this.initData()
		},
		methods: {
			tabSelect(index) {
				this.tabCurrentIndex = index
			},
			// 初始化值
			initData() {
				if (this.tabCurrentIndex === 0) {
					this.type = 3
				} else {
					this.type = 1
				}
				this.navList[1].list = [{
					"collectId": "9ZLWBzob",
					"collectName": "精彩电影",
					"type": 1,
					"userId": "3e92a69944274344afef6c37fe464931",
					"extra": {
						"type": "info-merchant",
						"id": "MD1413109041353330688",
						"version": 0,
						"index": "info-merchant",
						"sort": [1648218473000],
						"found": false,
						"seqNo": 0,
						"primaryTerm": 0,
						"merchantName": "精彩电影",
						"merchantNo": "9ZLWBzob",
						"linkPhone": "13599098689",
						"logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
						"address": "软件大道89号A区双创城"
					}
				}]

				this.navList[0].list = [{
					"collectId": "9a687221c18c43d1a8f304e1b5fa1316",
					"collectName": "全闽悦影券豪华版(不要修改此商品信息)",
					"type": 3,
					"userId": "3e92a69944274344afef6c37fe464931",
					"extra": {
						"id": "9a687221c18c43d1a8f304e1b5fa1316",
						"regionNo": "DL1333225698034458624",
						"merchantNo": "sTUuuhN9",
						"createTime": 1648547571000,
						"updateTime": 1635411701000,
						"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
						"description": "",
						"regionPath": "9999_DL1333225698034458624",
						"ownerRegionNo": "DL1333225698034458624",
						"rightsType": "asdasd",
						"rightsTypeId": "1",
						"name": "全闽悦影券豪华版(不要修改此商品信息)",
						"categoryRights": "电影演出",
						"pic": "service-org-7adc24dc/20210812/aa5c297239124de197acc62964025fb4.jpg",
						"categoryRegion": "4248b307ac57a7f7c77a1c487a9029a9",
						"categoryRegionPath": "4248b307ac57a7f7c77a1c487a9029a9",
						"barCode": "",
						"skuCode": "poKy0QMvcqEOaxkt",
						"costPrice": 38,
						"goodsPrice": 39.9,
						"isOpenStore": 1,
						"remainStore": 2,
						"isReset": 0,
						"saleNum": 6,
						"saleTimeType": 0,
						"saleMode": 1,
						"isRefund": 0,
						"availableType": 2,
						"availableBeginTime": "1970-01-01 08:00:00",
						"availableEndTime": "1970-01-01 08:00:00",
						"availableRelative": 180,
						"availableCount": 1,
						"categoryRightsId": "4063f87d3cd84a8fa260e472ce1c21e7",
						"status": 1,
						"categoryPath": "4063f87d3cd84a8fa260e472ce1c21e7",
						"instructions": "<h3>【本商品不支持退款！】</h3><h3>【用“钱包支付”立享：满<strong>30</strong>元立减<strong>20</strong>元！每位用户可享受两次优惠！优惠100张，先到先得…】</h3><h3><br></h3><h3>使用说明</h3><p class=\"ql-align-justify\">(1)凭本券可在线下合作影城柜台或线上适用影城兑换普通厅2D/3D/zmax电影票一张；</p><p class=\"ql-align-justify\">柜台兑换：出示此券，告知影城工作人员您有<span style=\"color: rgb(255, 0, 0);\">爱来电子券</span>，选择场次、座位，影城工作人员。</p><p class=\"ql-align-justify\">电子券查看方式：</p><p class=\"ql-align-justify\">1.下载<span style=\"color: rgb(255, 0, 0);\">最美电影APP</span>, 点击我的-电影券，查看所获取的电影券。</p><p class=\"ql-align-justify\">2.&nbsp;微信小程序搜索 ”<span style=\"color: rgb(255, 0, 0);\">最美电影”，</span>可直接选择喜爱的电影，点击电影优惠券，选择电影券观影。</p><p class=\"ql-align-justify\">3.&nbsp;关注最美电影FANS公众号-点击立即购票，点击我的-电影券。</p><p class=\"ql-align-justify\">在线选座：微信小程序搜索<span style=\"color: rgb(255, 0, 0);\">”最美电影”</span>或者下载最美电影APP, 关注最美电影FANS公众号-点击立即购票。购票成功后到选定影城取票观影。</p><p class=\"ql-align-justify\">(2)&nbsp;因影城要求，如遇特殊节假日（如春节、国庆、情人节、圣诞节等）、限价片、特殊影片可能需补差，部分影城需客户购买或自备3D眼镜，以及其他未提及事项均以影城现场公告为准。</p><p class=\"ql-align-justify\">(3)本券售出，不记名，不挂失，不得二次转卖，一经兑换不得退票，密码区一经刮开，影城柜台将不予兑换。</p><p class=\"ql-align-justify\">(4)本券请在有效期内使用，逾期自动失效，自行撕角、损毁或擅自更改内容均视为票券作废无效。</p><p class=\"ql-align-justify\">(5)线下合作影城柜台或线上适用影城，可查看线上券说明。</p><p class=\"ql-align-justify\">(6)以上说明如有未尽事宜或更改，恕不另行通知，如有疑问请致电客服热线咨询。</p><p class=\"ql-align-justify\">(7)&nbsp;在法律允许的范围内，本券最终解释权归福州爱来网络科技有限责任公司所有。</p><p class=\"ql-align-center\">客服热线：400-0125-000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务时间：09:00-21:00(周一至周日)</p>",
						"isDivide": 1,
						"divideMode": 1,
						"divideRate": 500,
						"recommend": 0,
						"voucherFlag": 0
					}
				}]

				this.navList[this.tabCurrentIndex].status = 'nomore'


			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current
				this.initData()
			},
			async swipeClick(e, type, id, index) {
				if (type === 1) {
					this.navList[type].list.splice(index, 1)
				}
				console.info(e)
				console.info(type)
				console.info(id)
			},
			loadData(e) {
				let nav = this.navList[this.tabCurrentIndex]
				if (nav.pager.curPageNum === 0) {
					return
				}
				if (nav.status === 'loading' || nav.loaded && (nav.list == null || nav.list.length === 0)) {
					return
				}
				if (nav.pager.curPageNum >= nav.pager.totalPageNum) {
					return
				}
				if (this.tabCurrentIndex === 1) {
					this.getLocation({
						curPageNum: ++nav.pager.curPageNum
					})
				}
			},
			async delCollection(merchantNo) {
			
					uni.showToast({
						title: '取消成功'
					})
				
			},
		
			getLocation({
				curPageNum = 1
			} = {}) {
				this.$plugin.app.getLocation({
					success: res => {
						this.location = res
						this.getMerchantList({
							curPageNum
						})
					},
					fail: err => {
						this.getMerchantList({
							curPageNum
						})
					}
				})
			},
			// 跳转权益商品详情页面
			toCouponDetail(id) {
				uni.navigateTo({
					url: `/myPackageA/pages/coupon/coupon-detail?goodsId=${id}`
				})
			}
		},
		async onLoad(option) {
			await this.$onLaunched
			this.navList[0].loaded = true
			this.navList[1].loaded = true
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
</style>
<style lang="scss">
	.user-user-fav-page {
		height: 100%;

		.fav-list-box {
			overflow: hidden;
		}

		.list-scroll-content {
			height: 100%;
			display: block;
			position: relative;
		}

		.box {
			margin: 24rpx;
			overflow: hidden;
			border-radius: 16rpx;
		}

		.fav-goods {
			&-item {
				padding: 32rpx 20rpx;
				background: #FFFFFF;
				display: flex;
				flex: 1;
				justify-content: space-between;
				align-items: flex-start;

				.m-img {
					flex: 0 0 170rpx;
					height: 170rpx;
					border: 2rpx solid #F5F5F5;
					border-radius: 8rpx;
					overflow: hidden;
				}

				.m-text {
					flex: 1;
					position: relative;
					padding-left: 20rpx;
					display: flex;
					align-content: space-between;
					flex-direction: column;

					.m-title {
						margin-bottom: 6rpx;
						font-size: 32rpx;
						color: #161616;
						height: 42rpx;
						font-weight: bold;
						display: -webkit-box !important;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						-webkit-box-orient: vertical !important;
						-webkit-line-clamp: 1;
					}

					.m-descripe {
						font-size: 24rpx;
						color: #555555;
						margin-top: 16rpx;
						height: 34rpx;
						display: -webkit-box !important;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						-webkit-box-orient: vertical !important;
						-webkit-line-clamp: 1;
					}

					.m-spec {
						margin: 16rpx 0;

						view {
							padding: 0 24rpx;
							height: 36rpx;
							line-height: 36rpx;
						}
					}

					.m-price-box {
						height: 48rpx;
						font-weight: bold;
						display: flex;
						flex-direction: row;
						align-items: flex-end;
						margin-top: 20rpx;

						.m-price {
							position: relative;
							top: 4rpx;
							font-size: 36rpx;
							color: #ff582b;
						}

						.m-old-price {
							margin-left: 20rpx;
							display: flex;
							flex-direction: row;
							font-size: 22rpx;
							color: #999999;
							margin-top: 5rpx;
							text-decoration: line-through;
							font-weight: normal;
						}
					}

					.m-number {
						position: absolute;
						right: 0;
						bottom: -8rpx;
						z-index: 16;
						color: #b2b2b2;
						font-size: 20rpx;
						text-align: right;
					}
				}
			}
		}

		.fav-shop {
			&-item {
				padding: 32rpx 20rpx;
				background: #FFFFFF;
				display: flex;
				flex: 1;

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
					font-size: 24rpx;
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
						}
					}
				}
			}
		}
	}
</style>