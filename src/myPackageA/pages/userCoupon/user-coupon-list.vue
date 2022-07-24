<template>
	<view class="user-user-coupon-list-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">代金券历史记录</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav box-all">
			<view class="flex text-center">
				<view v-for="(item, index) in navList" :key="index" @tap="tabSelect" :data-id="index"
					class="cu-item flex-sub" :class="index == tabCurrentIndex ? 'text-theme cur' : ''"
					:style="[{color: index == tabCurrentIndex ? themeColor : ''}]">
					{{ item.text }}
				</view>
			</view>
		</scroll-view>
		<!-- <swiper :current="tabCurrentIndex" class="coupon-list-box" :style="{
			height: `calc(100% - 90rpx - ${CustomBar}px)`
		}" duration="300" @change="changeTab">
			<swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex"> -->
		<view :style="{'padding-top': `${tabBar}rpx`}">
			<scroll-view class="list-scroll-content" scroll-y>
				<view v-for="(row, index) in navList[tabCurrentIndex].list" :key="index" class="coupon-item"
					@tap="toCouponDetail(row.id, row.title)">
					<view class="coupon-item-left">
						<!--如果没有图片就使用默认图片-->
						<image :src="row.pic ? spMatefileBaseURL + row.pic + fixStr : '../../../static/logo.png'"
							mode="aspectFit" />
					</view>
					<view class="coupon-item-center">
						<view class="title">{{ row.title }}</view>
						<view class="term" v-if="row.expiry.startDate && row.expiry.endDate">
							<view>有效期：</view>{{ row.expiry.startDate }} ~ {{ row.expiry.endDate }}
						</view>
						<view class="term" v-else>
							<view>有效期：</view>永久有效
						</view>
						<view class="gap-top"></view>
						<view class="gap-bottom"></view>
					</view>
					<view class="coupon-item-right" :class="navList[tabCurrentIndex].status !== 0 ? 'invalid' : ''">
						<view class="ticket">
							<view class="unit">￥</view>
							<view class="num">{{ row.ticket }}</view>
						</view>
						<view class="criteria">满{{ row.criteria }}可用</view>
						<view class="use" @tap.stop="toUserCodeView(tabItem.status === 0)">
							<template v-if="navList[tabCurrentIndex].status === 0">去使用</template>
							<template v-else-if="navList[tabCurrentIndex].status === 1">已使用</template>
							<template v-else-if="navList[tabCurrentIndex].status === 2">已过期</template>
						</view>
					</view>
				</view>
				<!-- <zj-empty v-if=" tabItem.list.length === 0" text="暂无优惠券信息" :img="`${imgUrl}1639019849000/pic_coupon.png`"/> -->
			</scroll-view>
		</view>
		<zj-empty v-if="navList[tabCurrentIndex].list.length === 0" text="暂无卡包信息"
			:img="`${imgUrl}1639019849000/pic_coupon.png`" />
		<uni-load-more v-else :status="record.status"></uni-load-more>
		<!-- </swiper-item>
		</swiper> -->
	</view>
</template>

<script>
	import {
		getCouponData
	} from '@/api/shopmall'
	import {
		memberAccount
	} from "@/api/infomember";
	export default {
		data() {
			return {
				tabBar: 90,
				imgUrl: this.$imgUrl,
				CustomBar: this.CustomBar,
				tabCurrentIndex: 0,
				scrollLeft: 0,
				navList: [
					// {
					// 	status: 0,
					// 	text: '未使用',
					// 	list: []
					// },
					{
						status: 1,
						text: '已使用',
						list: [{
							"id": "b4426ab2d37b407a9b561b024d4fd9c7",
							"title": "满50减5",
							"expiry": {
								"startDate": "2021-07-16",
								"endDate": "2021-08-14"
							},
							"ticket": 5,
							"criteria": 50,
							"pic": ""
						}]
					},
					{
						status: 2,
						text: '已过期',
						list: [{
							"id": "b4426ab2d37b407a9b561b024d4fd9c7",
							"title": "满50减5",
							"expiry": {
								"startDate": "2021-07-16",
								"endDate": "2021-08-14"
							},
							"ticket": 5,
							"criteria": 50,
							"pic": ""
						}]
					}
				],
				record: {
					curPageNum: 1,
					pageSize: 20
				},
				params: {},
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				paramsCopy: {},
				themeColor: '',
				fromMember: false,
				shopInfo: {}
			}
		},
		onLoad(option) {
			// this.params = option.couponParams ? JSON.parse(option.couponParams) : {}
			// this.paramsCopy = option.couponParams || {}
			console.log(option)
			if (option && option.fromMember) {
				this.fromMember = option.fromMember == "true" ? true : false
				this.shopInfo = option.shopInfo ? JSON.parse(option.shopInfo) : {}
				console.log('option-=-=', this.fromMember, this.shopInfo)
			}
			let _this = this
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			let data = JSON.parse(uni.getStorageSync('loginInfo'))
			if (data.phone && data.phone !== '' && data.phone !== undefined) {
				this.params = {
					appid: data.appid,
					openid: data.openid,
					phone: data.phone,
				}
				this.paramsCopy = {
					appid: data.appid,
					openid: data.openid,
					phone: data.phone,
				}
				this.couponData()
			} else {
				//如果不存在手机号就必须从接口获取
				memberAccount({
					subjectType: 5,
					accountType: 1,
					subjectId: this.$regionId,
					appid: this.$appid,
					isOpen: 1
				}, {
					hideLoading: false,
					hideMsg: true
				}).then(res => {
					const obj = res.object
					if (obj.member) {
						_this.params = {
							appid: data.appid,
							openid: data.openid,
							phone: obj.member.phone,
						}
						_this.paramsCopy = {
							appid: data.appid,
							openid: data.openid,
							phone: obj.member.phone,
						}
						_this.couponData()
					}
				})
			}
		},
		methods: {
			tabSelect(e) {
				if (this.tabCurrentIndex == e.currentTarget.dataset.id) {
					return
				}
				this.tabCurrentIndex = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				// 切换时将页数置为1
				this.record.curPageNum = 1
				this.couponData()
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current
				this.couponData()
			},
			toUserCodeView(canUse) {
				if (canUse) {
					this.$toView('user/user-code', true)
				}
			},
			onReachBottom() {
				if (this.record.curPageNum === 0) {
					return
				}
				if (this.record.status === 'loading' || this.record.loaded && (this.navList[this.tabCurrentIndex].list ==
						null || this.navList[this.tabCurrentIndex].list.length === 0)) {
					return
				}
				if (this.record.curPageNum >= this.record.totalPageNum) {
					return
				}
				this.record.curPageNum = ++this.record.curPageNum
				// console.log('this.params.requestPage.curPageNum',this.params.requestPage.curPageNum)
				this.couponData()
			},
			couponData() {

				let arr = [{
					"id": "b4426ab2d37b407a9b561b024d4fd9c7",
					"title": "满50减5",
					"expiry": {
						"startDate": "2021-07-16",
						"endDate": "2021-08-14"
					},
					"ticket": 5,
					"criteria": 50,
					"pic": ""
				}]


				console.log('this.navList代金券', this.navList)
				uni.stopPullDownRefresh()

			},
			toCouponDetail(id, title) {
				// uni.redirectTo({
				uni.navigateTo({
					url: `/myPackageA/pages/userCoupon/user-coupon-detail?id=${id}&isCoupon=${true}&orgName=${title}&params=${this.paramsCopy}&status=${this.tabCurrentIndex + 1}`
				})
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
</style>
<style lang="scss">
	.user-user-coupon-list-page {
		height: 100%;

		.box-all {
			position: fixed;
			left: 0;
			z-index: 100;
		}

		.coupon-list-box {
			overflow: hidden;
		}

		.list-scroll-content {
			height: 100%;
			display: block;
			position: relative;
		}

		.coupon-item {
			min-height: 180rpx;
			// min-height: 270rpx;
			margin: 0 32rpx 20rpx;
			border-radius: 12rpx;
			position: relative;
			overflow: hidden;
			background-color: #fff;
			display: flex;

			&:first-child {
				margin-top: 32rpx;
			}

			&:last-child {
				margin-bottom: 32rpx;
			}

			&-left {
				image {
					width: 120rpx;
					height: 120rpx;
					margin: 30rpx 10rpx 0 30rpx;
					border: 2rpx solid rgba(0, 0, 0, 0.01);
					border-radius: 50%;
				}
			}

			&-center {
				flex: 1;
				display: flex;
				flex-direction: column;
				position: relative;

				.title {
					padding-top: 40rpx;
					width: 300rpx;
					margin: 0 5%;
					font-size: 28rpx;
					line-height: 1.2;
					overflow: hidden;
					flex: 1;
					text-overflow: ellipsis;
					white-space: nowrap;
					align-content: normal;
				}

				.term {
					width: 90%;
					margin: 0 5%;
					font-size: 24rpx;
					color: #999999;
					// height: 66rpx;
					height: 90rpx;
				}

				.gap-top,
				.gap-bottom {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					right: -12rpx;
					border-radius: 100%;
					background-color: #f5f5f5;
				}

				.gap-top {
					top: -12rpx;
				}

				.gap-bottom {
					bottom: -12rpx;
				}
			}

			&-right {
				display: flex;
				flex-wrap: wrap;
				text-align: center;
				flex-shrink: 0;
				justify-content: center;
				width: 28%;
				color: #fff;
				background: linear-gradient(137deg, #6FBCFF 0%, #6FA0FB 100%);

				&.invalid {
					background: linear-gradient(137deg, #E5E5E5 0%, #B4B4B4 100%);

					.use {
						color: #B5B5B5;
					}
				}

				.ticket,
				.criteria {
					width: 100%;
				}

				.ticket {
					line-height: 1;
					margin-top: 24rpx;
					display: flex;
					justify-content: center;
					align-items: baseline;

					.num {
						font-size: 42rpx;
					}

					.unit {
						font-size: 24rpx;
					}
				}

				.criteria {
					justify-content: center;
					font-size: 24rpx;
					margin-top: -16rpx;
				}

				.use {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					background-color: #fff;
					color: #34A2E8;
					border-radius: 28rpx;
					padding: 0 20rpx;
					margin-top: -10rpx;
				}
			}
		}
	}

	::v-deep .uni-load-more {
		margin-bottom: 60px;
	}
</style>