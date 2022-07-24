<template>
	<!-- 卡包列表 -->
	<view class="user-user-coupon-list-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">权益卡历史记录</block>
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
		<view :style="{'padding-top': `${tabBar}rpx`}">
			<scroll-view class="list-scroll-content" scroll-y>
				<view v-for="(row, index) in navList[tabCurrentIndex].list" :key="index" class="coupon-item"
					@tap="toCouponDetail(row)">
					<view class="coupon-item-left">
						<!--如果没有图片就使用默认图片-->
						<image
							:src="row.rightLogo ? spMatefileBaseURL + row.rightLogo + fixStr : '/static/logo.png'"
							mode="aspectFit" />
					</view>
					<view class="coupon-item-center">
						<view class="title">{{ row.rightsName }}</view>
						<view class="term" v-if="row.expireTime">
							<view v-if="row.startTime">
								<view>有效期：</view>{{ getDate(new Date(row.startTime).getTime()) }} ~ {{ getDate(new Date(row.expireTime).getTime()) }}
							</view>
							<view v-else>
								<view>有效期：</view>{{ getDate(row.createTime) }} ~ {{ getDate(new Date(row.expireTime).getTime()) }}
							</view>
						</view>
						<view class="term" v-else>
							<view>有效期：</view>永久有效
						</view>
						<view class="gap-top"></view>
						<view class="gap-bottom"></view>
					</view>
					<view class="coupon-item-right" :class="navList[tabCurrentIndex].status !== 0 ? 'invalid' : ''">
						<!-- <view class="ticket">
							<view class="unit">￥</view>
							<view class="num">{{ row.ticket }}</view>
						</view>
						<view class="criteria">满{{ row.criteria }}可用</view> -->
						<view class="use">
							<!-- <template v-if="navList[tabCurrentIndex].status === 0">去使用</template> -->
							<template v-if="navList[tabCurrentIndex].status === 1">已使用</template>
							<!-- 后端没有已过期（status=3）的状态，只能通过请求的参数前端进行判断，status=4为已退款 -->
							<template v-else-if="navList[tabCurrentIndex].status === 2 && row.status != 4">已过期</template>
							<template v-else-if="navList[tabCurrentIndex].status === 2 && row.status == 4">已退款</template>
						</view>
					</view>
				</view>
				<!-- <zj-empty v-if="tabItem.list.length === 0" text="暂无卡包信息" :img="`${imgUrl}1639019849000/pic_coupon.png`"/>
				<uni-load-more v-else :status="record.status"></uni-load-more> -->
			</scroll-view>
		</view>
		<zj-empty v-if="navList[tabCurrentIndex].list.length === 0" text="暂无卡包信息" :img="`${imgUrl}1639019849000/pic_coupon.png`"/>
		<uni-load-more v-else :status="record.status"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBar: 90,
				imgUrl: this.$imgUrl,
				CustomBar: this.CustomBar,
				tabCurrentIndex: 0,
				scrollLeft: 0,
				navList: [
					{
						status: 1,
						text: '已使用',
						list: []
					},
					{
						status: 2,
						text: '已失效',
						list: []
					}
				],
				params: {},
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				subjectId: '',
				subjectType: 0,
				record: {
					curPageNum: 1,
          pageSize: 20
				},
				themeColor: ''
			}
		},
		onLoad(option) {
			this.subjectId = option.subjectId
			this.subjectType = option.subjectType
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

		},
		mounted() {},
		methods: {
			tabSelect(e) {
				if (this.tabCurrentIndex == e) {
					return
				}
				this.tabCurrentIndex = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				// 切换时将页数置为1
				this.record.curPageNum = 1
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current
			},
		
			toCouponDetail(row) {
				console.log(this.subjectType)
				let status = row.status == 4 ? row.status : this.tabCurrentIndex + 1
				uni.navigateTo({
					url: `/myPackageA/pages/userCoupon/user-coupon-detail?id=${row.rightNo}&goodsId=${row.rightId}&subjectId=${this.subjectId}&subjectType=${this.subjectType}&cardId=${row.id}&status=${status}`
				})
			},
			// 时间戳格式化
			getDate(value) {
				if (typeof(value) == 'undefined') {
					return ''
				} else {
					let date = new Date(parseInt(value))
					let y = date.getFullYear()
					let MM = date.getMonth() + 1
					MM = MM < 10 ? ('0' + MM) : MM
					let d = date.getDate()
					d = d < 10 ? ('0' + d) : d
					let h = date.getHours()
					h = h < 10 ? ('0' + h) : h
					let m = date.getMinutes()
					m = m < 10 ? ('0' + m) : m
					let s = date.getSeconds()
					s = s < 10 ? ('0' + s) : s
					return y + '.' + MM + '.' + d
				}
			},
			onPullDownRefresh() {
				this.getDetail()
			},
			onReachBottom() {
				console.log('到底了')
				if (this.record.curPageNum === 0) {
					return
				}
				if (this.record.status === 'loading' || this.record.loaded && (this.navList[this.tabCurrentIndex].list ==
						null || this.navList[this.tabCurrentIndex].list.length === 0)) {
					return
				}
				if (this.record.curPageNum * this.record.pageSize >= this.record.totalCount) {
					return
				}
				this.params.pager.curPageNum = ++this.record.curPageNum
			
			},
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
		.box-all{
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
			// min-height: 290rpx;
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
				// flex: 1;
				width: 332rpx;
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
					// white-space: nowrap;
					align-content: normal;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
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
				align-items: center;
				border-left: 2rpx dashed #F4F5F7;
				;

				// background: linear-gradient(137deg, #6FBCFF 0%, #6FA0FB 100%);
				&.invalid {

					// background: linear-gradient(137deg, #E5E5E5 0%, #B4B4B4 100%);
					.use {
						color: #A9A9A9;
						border: 2rpx solid #A9A9A9;
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
					height: 48rpx;
					line-height: 48rpx;
					font-size: 24rpx;
					background-color: #fff;
					color: #F05353;
					border-radius: 28rpx;
					padding: 0 20rpx;
					// margin-top: -10rpx;
					width: 120rpx;
					border-radius: 32rpx;
					border: 2rpx solid #F05353;
				}
			}
		}
	}
	::v-deep .uni-load-more {
		margin-bottom: 60px;
	}
</style>
