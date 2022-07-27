<template>
	<view class="index-user-page" style="padding-bottom: 110rpx;">
		<view class="index-user-info">
			<image class="image-bg" src="/static/images/my-bg.png" />
			<view class="index-user-info-box">
				<image src="/static/images/head.png" @tap="handleLogin" />
				<view class="index-user-info-box-content" @tap="handleLogin">
					<!-- <view v-if="$util.strIsEmpty(member.phone) && !member.memberId">登录/注册</view> -->
					<template>
						<view v-if="companyStaffEntity.status === 1 && $util.strIsNotEmpty(companyStaffEntity.name)">
							{{ companyStaffEntity.name }}
						</view>
						<view>{{ member.name || '暂无名称' }}</view>
						<view>{{ $util.phoneDesensitization(member.phone) || '暂无电话' }}</view>
						<!-- 公司名称，暂时屏蔽 -->
						<!-- <view v-if="companyStaffEntity.status === 1 && $util.strIsNotEmpty(companyStaffEntity.companyName)">{{ companyStaffEntity.companyName }}</view> -->
					</template>
				</view>
				<!-- 认证标签，暂时屏蔽 -->
				<view v-if="$util.strIsNotEmpty(companyStaffEntity.companyName)"
					:class="companyStaffEntity.status === 1 ? 'index-user-info-box-certed' : 'index-user-info-box-certing'"
					:style="{background: companyStaffEntity.status === 1 ? themeColor : '#EE2D28'}">
					<text v-if="companyStaffEntity.status === 1" class="cuIcon- zjIcon-authentication text-df"></text>
					<text v-if="companyStaffEntity.status === 1" class="text-xs margin-lr-xs">已认证</text>
					<text v-else class="text-xs margin-lr-xs" @tap="showCertingTip">认证审核中</text>
				</view>
			</view>
			<view class="index-user-statistics">
				<!--需要在存在用户手机号且作为软件园项目的时候才会存在钱包的情况-->
				<template v-if="$util.strIsNotEmpty(member.phone) && isSoftware">
					<template>
						<!-- <template v-if="companyStaffEntity.status === 1"> -->
						<!-- <view v-if="account.isOpenPurse != null && account.isOpenPurse === 0" class="index-user-statistics-item" @tap="$toView('user/user-wallet', true)"> -->
						<view v-if="account.isOpenPurse != null && account.isOpenPurse === 0"
							class="index-user-statistics-item" @tap="$toView('user/user-wallet', true)">
							<text
								class="index-user-statistics-item-num">{{ accountBalance == null ? '7.70' : $util.toMoney(accountBalance / 100) }}</text>
							<view style="display: flex">
								<text>余额</text>
								<text :style="{color: themeColor}">·充值</text>
							</view>
						</view>
						<view v-else class="index-user-statistics-item">
							<button class="cu-btn bg-theme" :style="{background: themeColor}" type=""
								@tap="$toView('user/user-wallet-bankcard-add')">去开通</button>
							<text>钱包余额</text>
						</view>
					</template>
					<!-- <view v-else class="index-user-statistics-item">
						<text class="index-user-statistics-item-num">{{ extraTotal.amount == null ? '0.00' : $util.toMoney(extraTotal.amount) }}</text>
						<text>余额</text>
					</view> -->
				</template>
				<view class="index-user-statistics-item" @click="clickToIntegral">
					<text
						class="index-user-statistics-item-num">{{ account.pointAmount ? account.pointAmount : '0' }}</text>
					<text>积分</text>
				</view>

				<view class="index-user-statistics-item" @click="clickToCoupon">
					<text class="index-user-statistics-item-num">
						{{ occupationNumber ? occupationNumber : 0 }}
					</text>
					<text>卡券包</text>
				</view>

				<view class="index-user-statistics-item" @tap="$toView('/myPackageA/pages/user/user-fav', true,false,true)">
					<text class="index-user-statistics-item-num">2</text>
					<text>我的收藏</text>
				</view>
			</view>
		</view>

		<view class="index-user-menu cu-list menu">
			<view class="cu-item arrow" @tap="$toView('/myPackageA/pages/order/user-order-list', true, false, true)">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">我的订单</text>
				</view>
			</view>
			<view class="cu-item arrow"
				@tap="$toView(`/myPackageA/pages/order/appoint-list?fromPage=appointment&account=${jsonAccount}`, true, false, true)">
				<view class="content">
					<text class="cuIcon- newIcon-remind text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">我的预约</text>
				</view>
			</view>
			<view class="cu-item arrow"
				@tap="$toView('/myPackageA/pages/dealRecord/user-deal-record', false, false, true)">
				<view class="content">
					<text class="cuIcon- zjIcon-trading_record text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">交易记录</text>
				</view>
			</view>
			<view class="cu-item arrow" v-if="isSoftware"
				@tap="$toView('/myPackageA/pages/user/user-recharge-record', true,false,true)">
				<view class="content">
					<text class="cuIcon- zjIcon-recharge_record text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">充值提现记录</text>
				</view>
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<view class="cu-item arrow" @tap="$toView('shop/user/user-address-list', true)">
				<view class="content">
					<text class="cuIcon- zjIcon-address text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">联系地址</text>
				</view>
			</view>
			<!-- #endif -->

			<view class="cu-item arrow"
				@tap="$toView('/myPackageA/pages/user/user-wallet-password', true, false, true)">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">支付密码</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$toView('/myPackageA/pages/environment/index', false, false, true)"
				v-if="nowEnvironment === 'trial' || nowEnvironment === 'develop'">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">环境切换(只有小程序开发版和体验版存在)</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="changeStyle"
				v-if="nowEnvironment === 'trial' || nowEnvironment === 'develop'">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">换肤体验(只有小程序开发版和体验版存在)</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="clickShowComponents" v-if="nowEnvironment === 'develop'">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">非uview额外自定组件预览(只有小程序开发版存在)</text>
				</view>
			</view>

			<!-- <view class="cu-item arrow" @tap="changeStyle">
                      <view class="content">
                          <text class="cuIcon- zjIcon-password text-theme" :style="[{color: themeColor}]"></text>
                          <text class="text-black">换肤</text>
                      </view>
                  </view> -->
			<!-- <view class="cu-item" @tap="topay">
				<view class="content">
					<text class="cuIcon- text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">订单</text>
				</view>
			</view> -->

			<!--			 <view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon- zjIcon-access_records text-theme"></text>
					<text class="text-black">出入记录</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon- zjIcon-car_manage text-theme"></text>
					<text class="text-black">车辆管理</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$toView('user/user-msg')">
				<view class="content">
					<text class="cuIcon- zjIcon-message1 text-theme"></text>
					<text class="text-black">我的消息</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon- zjIcon-password text-theme"></text>
					<text class="text-black">修改密码</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon- zjIcon-share text-theme"></text>
					<text class="text-black">分享好友</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon- zjIcon-about text-theme"></text>
					<text class="text-black">关于我们</text>
				</view>
			</view>-->
		</view>
		<view class="user-bottom" @tap="phoneToRegion(linkPhone)" v-if="linkPhone">
			<view class="text-black">客服热线(时间8:30-12:00,14:30-18:00)</view>
			<view>
				<u-icon style="margin-right: 20rpx" name="phone-fill" :color="themeColor" size="28"></u-icon>
				{{linkPhone}}
			</view>
		</view>

		<u-modal v-model="popShow" title="换肤" :show-confirm-button="false" :show-cancel-button="true">
			<view class="slot-content">
				<view>
					<view style="display: inline-block;vertical-align: middle">
						当前使用颜色：
					</view>
					<view style="display: inline-block;vertical-align: middle">
						<view class="slot-content-circle-data" :style="{background: themeColor}"></view>
					</view>
				</view>
				<view v-for="(colorItem, colorIndex) in colorData" :key="colorIndex" class="slot-content-circle">
					<view class="slot-content-circle-data" :style="{background: colorItem.color}"
						@tap="changeColor(colorItem)">
					</view>
				</view>

				<view class="l" style="margin: 50rpx;">
					<u-number-box v-model="productCount" color="#fff" :bg-color="themeColor" :min="1" :max="99"
						:disabled-input="true"></u-number-box>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				visible: {
					page: false
				},
				productCount: 1,
				member: {
					"subjectIds": ["MD1400029938156965888", "MD1296349752773971968", "9999", "MD1147075206523785216",
						"MD1146690069998997504", "MD1174868589975572480", "MD1336992351234691072",
						"DL1306153654495223808", "MD1187313477199466496", "MD1189384342942650368",
						"MD1338323869265694720", "MD1230397503766138880", "MD1233329431049801728",
						"MD1338319450872614912", "MD1338321807954022400", "MD1157207976998735872",
						"MD1171242223111639040", "MD1424973734221058048", "MD1232913510757961728"
					],
					"identityIds": ["bb95ca9e2a1041a88b2eba690528371f"],
					"locationA": "柯桥区",
					"locationC": "绍兴市",
					"regionId": "9999",
					"phone": "18060570125",
					"name": "用户76768d",
					"memberId": "14474b989a4947f1bba8c7a5f4f2be65",
					"status": 1,
					"locationP": "浙江省"
				},
				account: {
					"amount": 0,
					"pointAmount": 0,
					"accountType": 1,
					"hasPassword": 0,
					"cardNo": "63a49b71cced4380b3121a44b1cefddf",
					"subjectType": 5,
					"subjectId": "DL1306153654495223808",
					"accountId": "fca69421c14543d9a6ab6a2fee19c649",
					"cardId": "68c4ed10377c4cf08895024d6c136364",
					"donationAmount": 0,
					"isOpenPurse": 0,
					"accountAmount": 0
				},
				jsonAccount: {},
				companyStaffEntity: {},
				extraTotal: {},
				accountBalance: null,
				couponParams: {
					"appid": "wx4af6284d6f4bf2a1",
					"openid": "ozZZB5dlQD2DhQm4B1d6jgt82ecQ",
					"phone": "18060570125"
				},
				regionId: '',
				rightsCount: 0,
				popShow: false,
				themeColor: '#353D96', //当前默认使用颜色
				// colorData: [
				// 	'#34A2E8', '#353D96', 'green', 'red', '#0324CA'
				// ],
				colorData: [{
						color: '#34A2E8',
						shadowColor: '#0D8CFC',
					},
					{
						color: '#353D96',
						shadowColor: '#4753F6',
					},
					{
						color: '#357E22',
						shadowColor: '#35E521',
					},
					{
						color: '#1F336E',
						shadowColor: '#2663FF',
					},
					{
						color: '#3B68B5',
						shadowColor: '#5586FF',
					},
				],
				linkPhone: '',
				isSoftware: true,
				nowEnvironment: 'develop'
			}
		},
		computed: {
			// 计算卡劵包
			occupationNumber() {
				let couponCount = (this.extraTotal && this.extraTotal.couponCount) ? parseInt(this.extraTotal
					.couponCount) : 0
				let couponCountCard = this.rightsCount ? parseInt(this.rightsCount) : 0
				console.log(couponCount + couponCountCard)
				return couponCount + couponCountCard
			}
		},
		created() {
			// #ifdef MP-WEIXIN
			const accountInfo = uni.getAccountInfoSync();
			// miniProgram.envVersion的合法值：develop开发版、trial体验版、release正式版
			this.nowEnvironment = accountInfo.miniProgram.envVersion;
			// #endif
			// #ifdef H5
			let host = window.location.host // 'spdev.51zcm.cc' 是开发环境   https://sptest.51zcm.cc 是测试
			// let myHost = '172.26.113.207:8082'
			if (host.indexOf('spdev.51zcm.cc') > -1 || host.indexOf('sptest.51zcm.cc') > -1) {
				this.nowEnvironment = 'trial'
			}
			// #endif
		},
		mounted() {
			this.getMemberInfo()
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.regionId = this.$regionId
			this.linkPhone = '188887788888'
		},
		methods: {
			goopen() {
				uni.navigateTo({
					url: '/pages/openId-page/index?token=gouc_a1b659ea24804b9b87eec83d1cadfee5'
				})
			},
			...mapActions(['getAccountId']),
			init() {
				this.memberAccount()
				this.getMemberInfo()
			},
			handleLogin() {
				if (this.member == null || this.$util.strIsEmpty(this.member.phone)) {
					this.$toView('login/login')
				}
			},
			showCertingTip() {
				uni.showToast({
					title: '您提交的认证申请正在审核中，请耐心等待。',
					icon: 'none'
				})
			},
			getMemberInfo() {
				this.extraTotal = {
					"amount": 0,
					"pointAmount": 0,
					"collectCount": 0,
					"couponCount": 5
				}
			},
			memberAccount() {

				this.rightsCount = '0'
				this.member = {
					"subjectIds": ["MD1400029938156965888", "MD1296349752773971968", "9999",
						"MD1147075206523785216", "MD1146690069998997504", "MD1174868589975572480",
						"MD1336992351234691072", "DL1306153654495223808", "MD1187313477199466496",
						"MD1189384342942650368", "MD1338323869265694720", "MD1230397503766138880",
						"MD1233329431049801728", "MD1338319450872614912", "MD1338321807954022400",
						"MD1157207976998735872", "MD1171242223111639040", "MD1424973734221058048",
						"MD1232913510757961728"
					],
					"identityIds": ["bb95ca9e2a1041a88b2eba690528371f"],
					"locationA": "柯桥区",
					"locationC": "绍兴市",
					"regionId": "9999",
					"phone": "18060570125",
					"name": "用户76768d",
					"memberId": "14474b989a4947f1bba8c7a5f4f2be65",
					"status": 1,
					"locationP": "浙江省"
				}

				this.jsonAccount = {
					"amount": 0,
					"pointAmount": 0,
					"accountType": 1,
					"hasPassword": 0,
					"cardNo": "63a49b71cced4380b3121a44b1cefddf",
					"subjectType": 5,
					"subjectId": "DL1306153654495223808",
					"accountId": "fca69421c14543d9a6ab6a2fee19c649",
					"cardId": "68c4ed10377c4cf08895024d6c136364",
					"donationAmount": 0,
					"isOpenPurse": 0,
					"accountAmount": 0
				}

				this.companyStaffEntity = {
					"cellStyleMap": {},
					"id": "18060570125",
					"name": "锋浩",
					"phone": "18060570125",
					"companyName": "超汇",
					"status": 1,
					"createTime": 1625659843964
				}
				this.visible.page = true

			},
			// 积分页面
			clickToIntegral() {},
			// 跳转卡劵包页面
			clickToCoupon() {
				if (this.couponParams.phone) {
					this.$toView(
						`/myPackageA/pages/userCoupon/user-coupon-all?couponParams=${JSON.stringify(this.couponParams)}`,
						true, false, true)
				}
				// else {
				// 	uni.showToast({
				// 		title: '未登录，请先登录！',
				// 		icon: 'none',
				// 		duration: 2500
				// 	})
				// }
				// if (this.couponParams.phone) {
				// 	this.$toView(
				// 		`/myPackageA/pages/userCoupon/user-coupon-list?couponParams=${JSON.stringify(this.couponParams)}`,
				// 		true, false, true)
				// } else {
				// 	uni.showToast({
				// 		title: '未登录，请先登录！',
				// 		icon: 'none',
				// 		duration: 2500
				// 	})
				// }
			},
			// h5清除缓存
			cleanStorage() {
				uni.clearStorage()
			},
			clickShowComponents() {
				uni.navigateTo({
					url: '/myPackageA/pages/cmpshow'
				})
			},
			changeStyle() {
				// this.$errorMsg.show("23489234020934828943")
				this.popShow = true
			},
			changeColor(item) {
				this.popShow = false
				// 存入缓存
				uni.setStorageSync('themeColor', item.color)
				uni.setStorageSync('themeShadow', item.shadowColor)
				// #ifdef MP-WEIXIN
				uni.redirectTo({
					url: `/pages/index/index?tabName=${0}`
				})
				// #endif
				// #ifdef H5
				location.reload()
				// #endif
			},
			phoneToRegion(number) {
				uni.makePhoneCall({
					phoneNumber: number
				})
			},
			topay() {
				uni.navigateTo({
					url: '/pages/shop/settlement?orderNo=00031636716908628000074'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-user-page {
		.index-user-info {
			width: 100%;
			height: 500rpx;
			position: relative;
			z-index: 0;

			&-box {
				position: absolute;
				left: 40rpx;
				right: 40rpx;
				top: 118rpx;
				display: flex;
				justify-items: center;
				align-items: center;

				image {
					width: 128rpx;
					height: 128rpx;
					margin-right: 14rpx;
				}

				&-content {
					flex: 1;

					view {
						&:first-child {
							height: 64rpx;
							font-size: 36rpx;
							font-weight: 500;
							line-height: 64rpx;
							color: #161616;
							overflow: hidden;
						}

						&:nth-child(2) {
							height: 40rpx;
							font-size: 28rpx;
							font-weight: 400;
							line-height: 40rpx;
							margin-top: 4rpx;
						}

						&:nth-child(3) {
							height: 34rpx;
							font-size: 24rpx;
							font-weight: 400;
							line-height: 34rpx;
							margin-top: 4rpx;
							color: #666666;
						}
					}
				}

				&-cert {
					background: linear-gradient(90deg, #D9B679 0%, #D5B57F 100%);
					border-radius: 38rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
					padding: 14rpx 42rpx;
				}

				&-certed,
				&-certing {
					color: #FFFFFF;
					padding: 0 12rpx;
					display: flex;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 20rpx;
				}

				// &-certed {
				// 	background: linear-gradient(84deg, #3CA5FF 0%, #34A2E8 100%);
				// }
				// &-certing {
				// 	background: linear-gradient(90deg, #F85088 0%, #EE2D28 100%);
				// }
			}

			.index-user-statistics {
				position: absolute;
				left: 32rpx;
				right: 32rpx;
				bottom: 0;
				display: flex;
				justify-content: space-around;
				align-content: center;
				background: #FFFFFF;
				border-radius: 8rpx;
				padding: 50rpx 0;

				&-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					font-size: 26rpx;
					color: #737373;
					flex: 1;

					&:not(:last-child) {
						border-right: 2rpx solid #F5F5F5;
					}

					&-num {
						font-size: 36rpx;
						color: #333333;
						margin-bottom: 8rpx;
						font-weight: 500;
					}

					button {
						border-radius: 4rpx;
						height: 48rpx;
						padding: 0 20rpx;
						font-size: 24rpx;
						margin: 8rpx 0;
					}
				}
			}
		}

		.index-user-menu {
			border-radius: 8rpx;
			margin: 32rpx;
		}

		.user-bottom {
			font-size: 30rpx;
			text-align: center;
			padding-bottom: 48rpx;
		}
	}

	.slot-content {
		margin: 20rpx;

		&-circle {
			// width: 33%;
			// height: 70rpx;
			// line-height: 70rpx;
			padding: 20rpx;
			display: inline-block;

			&-data {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50rpx;
			}
		}
	}
</style>
