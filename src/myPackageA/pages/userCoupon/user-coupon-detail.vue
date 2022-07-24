<template>
	<view class="user-user-coupon-detail-page">
		<cu-custom bgColor="bg-theme" is-back :goBack="true"
		>
		<!-- :url="`/myPackageA/pages/userCoupon/user-coupon-all?couponParams=${couponParams}&tabIndex=${tabIndex}`"> -->
			<block slot="backText" class="text-white">{{pageType == 'appointment' ? '预约码详情' : isCoupon ? '代金券详情' : '权益卡详情'}}</block>
		</cu-custom>
		<!-- <view class="order-detail-top-title" v-if="status !== 0">
			<u-icon name="minus-circle" size="52" color="#34A2E8" style="margin-right: 24rpx"></u-icon>
			{{status === 1 ? '已使用' : '已过期'}}
		</view> -->
		<!-- 中石化加油券，绑定成功的弹窗 -->
		<u-popup mode="center" v-model="showPopup" border-radius="10">
			<view class="popup-content">
				<view class="popup-content-note">
					恭喜你，绑定成功！
				</view>
				<view class="confrim-btn" :style="[{background: themeColor}]" @click="closePopup">
					确定
				</view>
			</view>
		</u-popup>


		<view class="detail-box" :style="[{background: themeColor}]">
			<view class="detail-box-top">
				<!-- 名称 -->
				<view class="detail-box-top-right">
					<text>{{detailData.title || '权益商品'}}</text>
				</view>
			</view>
			<view class="detail-box-bottom">
				<view class="text-center">
					<view class="detail-box-bottom-tip" v-if="channelType && channelType == 2" :style="[{color: themeColor}]">点击进行绑定后使用</view>
					<view class="detail-box-bottom-tip" v-else :style="[{color: themeColor}]">请向服务员出示二维码核销</view>
					<!-- channelType = 2	表示是中石化的加油券 -->
					<template v-if="channelType && channelType == 2">
						<view class="used-qrcode">
							<view class="used-qrcode-word bind-word" @click="bindCard">点击进行绑定</view>
							<image class="used-qrcode-img" src="/static/images/qrcode_used.png"></image>
						</view>
					</template>		
					<template v-else>
						<!-- 二维码生成器 -->
						<tki-qrcode v-if="status == 0" ref="qrcode" onval :val="detailData.code" :size="280" :icon-size="60"
									:load-make="true" :show-loading="false" :using-components="false" />
						<view class="used-qrcode" v-else>
							<view class="used-qrcode-word">{{status == 1 ? '已使用' : status == 4 ? '已退款' : '已过期'}}</view>
							<image class="used-qrcode-img" src="/static/images/qrcode_used.png"></image>
						</view>
					</template>		
				</view>
				<view class="detail-box-bottom-code" v-if="status == 0">
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
						<template v-if="pageType == 'appointment'">
							<view class="detail-box-bottom-date-time-data" v-if="detailData.from">{{dateFormat(detailData.from, false, true)}} - {{dateFormat(detailData.to, false, true)}}</view>
							<view class="detail-box-bottom-date-time-data" v-else>永久有效</view>
						</template>
						<template v-else>
							<view v-if="detailData.endDate" class="detail-box-bottom-date-time-data">
								<view v-if="detailData.startTime">
									{{dateFormat(detailData.startTime)}} 至
									{{dateFormat(new Date(detailData.endDate).getTime())}}
								</view>
								<view v-else>
									{{dateFormat(detailData.createTime)}} 至
									{{dateFormat(new Date(detailData.endDate).getTime())}}
								</view>
							</view>
							<view v-else class="detail-box-bottom-date-time-data">永久有效</view>
						</template>
					</view>
					<view v-if="detailData.useTime" class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">核销时间</view>
						<view class="detail-box-bottom-date-condition-data">
							<!-- 代金券和权益的useTime返回的格式不一样，这里单独处理 -->
							<span>{{dateFormat(new Date(detailData.useTime).getTime(),true)}}</span>
						</view>
					</view>
					<view v-if="detailData.merchantName" class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">核销门店</view>
						<view class="detail-box-bottom-date-condition-data">
							<span>{{detailData.merchantName}}</span>
						</view>
					</view>
				</view>
				<view class="detail-box-bottom-date" v-if="isCoupon">
					<view class="detail-box-bottom-date-time">
						<view class="detail-box-bottom-date-time-title">有效期</view>
						<view v-if="detailData.endDate" class="detail-box-bottom-date-time-data">
							<view v-if="detailData.startDate">
								{{dateFormat(detailData.startDate)}} 至
								{{dateFormat(new Date(detailData.endDate).getTime())}}
							</view>
							<view v-else>
								{{dateFormat(detailData.createTime)}} 至
								{{dateFormat(new Date(detailData.endDate).getTime())}}
							</view>
						</view>
						<view v-else class="detail-box-bottom-date-time-data">永久有效</view>
					</view>
					<view class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">使用门槛</view>
						<view class="detail-box-bottom-date-condition-data">
							<span v-if="detailData.fullFavour">
								消费满{{detailData.fullFavour.minMoney}}元减{{detailData.fullFavour.favourMoney}}元
							</span>
							<span v-else>无</span>
						</view>
					</view>
					<view v-if="detailData.useTime" class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">核销时间</view>
						<view class="detail-box-bottom-date-condition-data">
							<span>{{detailData.useTime}}</span>
						</view>
					</view>
					<view v-if="detailData.merchantName" class="detail-box-bottom-date-condition">
						<view class="detail-box-bottom-date-condition-title">核销门店</view>
						<view class="detail-box-bottom-date-condition-data">
							<span>{{detailData.merchantName}}</span>
						</view>
					</view>
				</view>

				<!-- 按钮 -->
				<view style="margin: 28rpx 32rpx 0 32rpx">
					<u-button @click="goToShopdetail" shape="circle" :custom-style="customStyleBlue">查看适用门店</u-button>
				</view>

				<!--查看具体规则以及使用功能-->
				<view class="detail-desc">
					<text class="detail-desc-title">使用规则</text>
					<view class="detail-desc-know">
						<view v-if="detailData.desc" v-html="formatRichText(detailData.desc)"></view>
						<view v-else>暂无规则</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				barOpations: {
					height: 180,
					displayValue: false
				},
				detailData: {
					title: '',
					pic: '/static/logo.png',
					code: '',
					expiry: '',
					payType: '二维码被扫、线上直接买单',
					merchantList: '',
					desc: '',
					canUseMerchants: [],
					createTime: ''
				},
				location: {},
				goodsId: '',
				customStyle: {
					color: '#fff',
					background: uni.getStorageSync('themeColor') || '#34A2E8',
					margin: 0
				},
				customStyleBlue: {
					color: '#fff',
					background: uni.getStorageSync('themeColor') || '#34A2E8',
					fontSize: '28rpx',
					width: '306rpx',
					height: '64rpx',
					'line-height': '64rpx'
				},
				pageType: '',
				subjectId: '',
				subjectType: null,
				isCoupon: false,
				couponParams: '',
				status: '',
				tabIndex: '',
				channelType: '',
				showPopup: false
			}
		},
		onLoad(option) {
			// this.detailData.code = option.id
			this.goodsId = option.goodsId
			this.subjectId = option.subjectId
			this.subjectType = option.subjectType
			this.isCoupon = option.isCoupon || false
			this.couponParams = option.params || ''
			this.channelType =  option.channelType || ''
			this.pageType = option.pageType || ''
			this.status = parseInt(option.status)
			console.log(this.status)
			this.tabIndex = this.isCoupon ? 0 : 1
			if (this.pageType == 'appointment') {
				this.detailData.code = option.id
			
			} else {
				if (!this.isCoupon) {
					this.detailData.code = option.id
					
				} else {
					this.detailData.title = option.orgName || ''
					this.detailData.code = option.id
					
				}
			}
		},
		methods: {
			// 获取当前经纬度
			
			// 格式化时间
			dateFormat(time,showAll,showMin) {
				if (typeof(time) == 'undefined') {
					return ''
				}
				let date = new Date(time)
				let y = date.getFullYear()
				let m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
				let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
				if (showAll) {
					return `${y}-${m}-${d} ${h}:${mm}:${ss}`
				} else if (showMin) {
					return `${y}-${m}-${d} ${h}:${mm}`
				} else {
					return `${y}-${m}-${d}`
				}
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
				console.log(this.isCoupon)
				let id = this.isCoupon ? this.detailData.code : this.goodsId
				let canUseMerchants = this.detailData.canUseMerchants ? this.detailData.canUseMerchants : []
				console.log('this.detailData.canUseMerchants',this.detailData.canUseMerchants)

				if (this.detailData.canUseMerchants.length > 0) {
					uni.navigateTo({
						url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${id}&lat=${this.location.latitude}
						&lon=${this.location.longitude}&isCoupon=${this.isCoupon}&canUseMerchants=${canUseMerchants}`
					})
				} else {
					uni.navigateTo({
						url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${id}&lat=${this.location.latitude}
						&lon=${this.location.longitude}&isCoupon=${this.isCoupon}&canUseMerchants=${canUseMerchants}`
					})
				}
			},
			// 绑定中石化油券
			bindCard() {
			
			},
			closePopup() {
				this.showPopup = false
				uni.navigateBack()
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
		.popup-content{
			width: 526rpx;
			height: 270rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			.popup-content-note{
				height: 162rpx;
				color: #000000;
				font-weight: 400px;
				font-size: 32rpx;
				border-bottom: 2rpx solid #DEDEDE;
				text-align: center;
				padding-top: 78rpx;
			}
			.confrim-btn{
				width: 168rpx;
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 64rpx;
				text-align: center;
				color: #fff;
				font-size: 28rpx;
				margin: 22rpx auto 0;
			}
		}
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
						font-weight: 500;
						font-size: 30rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
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
				border-radius: 0 0 12rpx 12rpx;
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
		.used-qrcode{
			width: 310rpx;
			height: 310rpx;
			position: relative;
			margin: 0 auto;
			.used-qrcode-word{
				position: absolute;
				width: 300rpx;
				height: 100rpx;
				line-height: 100rpx;
				top: 105rpx;
				left: 5rpx;
				background-color: rgba(111,111,111,0.85);
				color: #FFFFFF;
				font-weight: 500px;
				font-size: 36rpx;
				z-index: 100;
			}
			.bind-word{
				text-decoration: underline;
			}
			.used-qrcode-img{
				width: 310rpx;
				height: 310rpx;
				z-index: 99;
			}
		}
		.detail-desc {
			display: flex;
			flex-direction: column;
			margin: 40rpx 24rpx;

			&-title {
				font-size: 26rpx;
				color: #000000;
				line-height: 70rpx;
				margin-top: 24rpx;
				font-weight: bold;
			}

			&-time {
				font-size: 11px;
			}

			&-know {
				font-size: 11px;
			}
		}
		.detail-box-bottom-code{
			display: flex;
			// align-items: center;
		}
		.detail-box-bottom-code-data{
			font-size: 28rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
	}
</style>
