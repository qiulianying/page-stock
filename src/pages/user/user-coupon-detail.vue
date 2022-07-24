<template>
	<view class="user-user-coupon-detail-page">
		<cu-custom bgColor="bg-theme" is-back :goBack="false" :url="`/myPackageA/pages/userCoupon/user-coupon-all?couponParams=${couponParams}`">
			<block slot="backText" class="text-white">权益商品详情</block>
		</cu-custom>
		<view class="order-detail-top-title" v-if="status !== 0">
			<u-icon name="minus-circle" size="52" color="#34A2E8" style="margin-right: 24rpx"></u-icon>
			{{status === 1 ? '已使用' : '已过期'}}
		</view>
		<view class="detail-box" :style="[{background: themeColor}]">
			<view class="detail-box-top">
				<!-- <view class="detail-box-top-left">
					<image :src="detailData.pic"/>
				</view> -->
				<!-- 名称 -->
				<view class="detail-box-top-right">
					<text>{{detailData.title || '权益商品'}}</text>
					<!-- <text>{{detailData.criteria}}</text> -->
				</view>
			</view>
			<view class="detail-box-bottom">
				<view class="text-center">
					<view class="detail-box-bottom-tip" :style="[{color: themeColor}]" v-if="status === 0">请向服务员出示二维码核销</view>
					<!-- <view class="detail-box-bottom-barcode">
                        <tki-barcode
                            ref="barcode"
                            onval
                            :val="detailData.code"
                            :load-make="true"
                            :opations="barOpations"/>
                    </view> -->
					<!-- 二维码生成器 -->
					<tki-qrcode v-if="status === 0" ref="qrcode" onval :val="detailData.code" :size="280" :icon-size="60"
								:load-make="true" :show-loading="false" :using-components="false" />
				</view>
				<view class="detail-box-bottom-code" v-if="status === 0">
					<text class="detail-box-bottom-code-data">{{ detailData.code }}</text>
					<u-button @click="copy(detailData.code)" :custom-style="customStyle" size="mini" shape="circle">复制</u-button>
				</view>
				<view class="detail-box-bottom-code" v-else>
					<text class="detail-box-bottom-code-data"
						style="text-decoration: line-through;">{{ detailData.code }}</text>
				</view>
				<!-- <button @click="copy(detailData.code)"></button> -->
				<!-- 有效期、使用门槛 -->
				<view class="detail-box-bottom-date" v-if="!isCoupon">
					<view class="detail-box-bottom-date-time">
						<view class="detail-box-bottom-date-time-title">有效期</view>
						<view v-if="detailData.endDate" class="detail-box-bottom-date-time-data">
							{{dateFormat(detailData.startDate)}} 至
							{{dateFormat(new Date(detailData.endDate).getTime())}}</view>
						<view v-else class="detail-box-bottom-date-time-data">永久有效</view>
					</view>
					<view class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">使用门槛</view>
						<view class="detail-box-bottom-date-condition-data">无</view>
					</view>
				</view>

				<!-- 按钮 -->
				<view v-if="!isCoupon" style="margin: 28rpx 32rpx 0 32rpx">
					<u-button @click="goToShopdetail" shape="circle" :custom-style="customStyleBlue">查看适用门店</u-button>
				</view>

				<!--查看具体规则以及使用功能-->
				<view class="detail-desc" v-if="!isCoupon">
					<text class="detail-desc-title">【使用规则】</text>
					<view class="detail-desc-know">
						<!-- <view>【使用须知】</view> -->
						<view v-html="formatRichText(detailData.desc)"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRightData,
		getBusiRightDetail
	} from '../../api/rightsmarketing'
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				barOpations: {
					height: 180,
					displayValue: false
				},
				detailData: {
					title: '向阳坊50元优惠券',
					criteria: '满100可用',
					pic: '/static/logo.png',
					code: '12345678987654321',
					expiry: '2020.04.01 00:00:00 - 2020.04.30 23:59:59',
					payType: '二维码被扫、线上直接买单',
					merchantList: '向阳坊(双安店)、向阳坊(金山店)、向阳坊(融桥店)、向阳坊(水头店)',
					desc: '1. 本商品为特惠活动商品，支付后成功后不予退款退货；2. 使用流程：用餐前将券码给工作人员验证并支付金额或者扫线上直接买单使用;<br/>3. 商品详情：向阳坊50元代金券，满200元使用;<br/>4. 使用范围：仅限向阳坊(双安店)、向阳坊(金山店)、向阳坊(融桥店)、向阳坊(水头店)门店使用，不与其他优惠同享;<br/>5. 有效期：2020.04.01-2020.06.06;<br/>6. 客户热线：如有疑问请拨打客服热线：400-9926-997，转2;'
				},
				location: {},
				goodsId: '',
				customStyle: {
					color: '#fff',
					background: uni.getStorageSync('themeColor') || '#34A2E8',
				},
				customStyleBlue: {
					color: '#fff',
					background: uni.getStorageSync('themeColor') || '#34A2E8',
					fontSize: '15px'
				},
				subjectId: '',
				subjectType: null,
				isCoupon: false,
				couponParams: '',
				status: ''
			}
		},
		onLoad(option) {
			// this.detailData.code = option.id
			this.goodsId = option.goodsId
			this.subjectId = option.subjectId
			this.subjectType = option.subjectType
			this.isCoupon = option.isCoupon || false
			this.couponParams = option.params || ''
			this.status = parseInt(option.status)
			console.log('我是option')
			console.log(this.status)

			this.getLocation()
			if (!this.isCoupon) {
				getBusiRightDetail({
					id: option.cardId
				}).then(res => {
					this.detailData.title = res.object.rightsName
					this.detailData.startDate = res.object.createTime
					this.detailData.endDate = res.object.expireTime
				})

				getRightData({
					goodsId: this.goodsId,
					lon: parseFloat(this.location.longitude),
					lat: parseFloat(this.location.latitude),
					distance: "1000km",
					enableShowInStore: -1
				}).then(res => {
					this.detailData.desc = res.object.instructions
					// availableType: res.object.availableType,
					// startDate: res.object.availableBeginTime,
					// endDate: res.object.availableEndTime,
					// availDay: res.object.availableRelative,
					this.detailData.canUseMerchants = res.object.canUseMerchants ? res.object.canUseMerchants : []
					this.detailData.code = option.id
				})


			} else {
				this.detailData.title = option.orgName || ''
				this.detailData.code = option.id
			}
		},
		methods: {
			// 获取当前经纬度
			getLocation({
				curPageNum = 1
			} = {}) {
				this.$plugin.app.getLocation({
					success: res => {
						this.location = res
					},
					fail: err=> {}
				})
			},
			// 格式化时间
			dateFormat(time) {
				let date = new Date(time)
				let y = date.getFullYear()
				let m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
				let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
				return `${y}-${m}-${d}`
				// return `${y}-${m}-${d} ${h}:${mm}:${ss}`
			},
			/**
			 * 控制小程序中图片大小
			 */
			formatRichText(html) {
				if (html) {
					return html.replace(/\<img/gi, '<img style="width: 100%"; height: 370rpx')
				}
				return
			},
			// 可用门店
			goToShopdetail() {
				console.log(this.detailData.canUseMerchants)
				if (this.detailData.canUseMerchants.length !== 0) {
					uni.navigateTo({
						url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`
					})
				}
			},
			//复制文本内容
			copy(data) {
				//设置系统剪贴板的内容  提示：API `setClipboardData` is not yet implemented  表示当前并不支持H5 此功能
				uni.setClipboardData({
					data: data,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			},
			// 计算有效期
			dateAvailable(available) {
				let start = this.dateFormat(new Date().getTime())
				let end = this.dateFormat(new Date().getTime() + (parseInt(available) * 24 * 3600 * 1000))
				return start + ' 至 ' + end
			}
		}
	}
</script>

<style lang="scss">
	.user-user-coupon-detail-page {
		.order-detail-top-title {
			color: black;
			font-size: 40rpx;
			// margin: 40rpx 0;
			padding: 24rpx 24rpx 0;
		}

		.detail-box {
			padding: 40rpx 24rpx;
			position: relative;
			min-height: 100vh;

			&-top {
				flex: 1;
				display: flex;
				position: relative;
				// background: linear-gradient(139deg, #FF8383 0%, #EF3C3C 100%);
				background: white;
				min-height: 110rpx;
				border-radius: 12rpx 12rpx 0 0;
				align-items: center;
				padding: 0 100rpx;
				border-bottom: 2rpx dashed #E4E4E4;

				&-left {
					margin-right: 28rpx;
					display: flex;

					image {
						width: 128rpx;
						height: 128rpx;
						background: #fff;
						border-radius: 50%;
						border: 2rpx solid #F5F5F5;
					}
				}

				&-right {
					display: flex;
					flex-direction: column;
					flex: 1;
					color: #000;
					text-align: center;

					text {
						&:first-child {
							font-weight: 500;
							font-size: 14px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}

						&:last-child {
							font-size: 26rpx;
							margin-top: 12rpx;
						}
					}
				}

				.gap-left,
				.gap-right {
					position: absolute;
					width: 36rpx;
					height: 36rpx;
					bottom: -18rpx;
					border-radius: 100%;
					background-color: #f5f5f5;
				}

				.gap-left {
					left: -18rpx;
				}

				.gap-right {
					right: -18rpx;
				}
			}

			&-bottom {
				border-radius: 12rpx;
				background: #FFFFFF;
				box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.1);
				padding: 56rpx 0;

				&-tip {
					font-size: 32rpx;
					color: #34A2E8;
					margin-bottom: 28rpx;
				}

				&-barcode {
					height: 180rpx;
					margin: 0 56rpx;
				}

				&-code {
					font-size: 36rpx;
					margin: 12rpx 0rpx;
					display: flex;
					justify-content: center;
					align-content: center;

					&-data {
						margin-right: 7px;
						max-width: 567rpx;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				&-date {
					background: #F4F5F7;
					padding: 40rpx 32rpx;
					border-radius: 16rpx;
					margin: 0 32rpx;

					&-time,
					&-condition {
						display: flex;
						font-size: 26rpx;

						&-title {
							width: 110rpx;
							color: #999;
							text-align: left;
							margin-right: 20rpx;
						}

						&-data {
							flex: 1;
							text-align: left;
						}
					}

					&-condition {
						margin-top: 20rpx;
					}
				}

			}
		}

		.detail-desc {
			display: flex;
			flex-direction: column;
			margin: 40rpx 24rpx;

			&-title {
				font-size: 26rpx;
				font-weight: 500;
				color: #999;
				line-height: 70rpx;
				margin-top: 24rpx;
			}

			&-time {
				font-size: 11px;
			}

			&-know {
				font-size: 11px;
			}
		}
	}
</style>
