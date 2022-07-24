<template>
	<view class="user-user-bankcard-add-userinfo-page">
		<image src="../../static/images/bank_bg.png" mode="heightFix"
			style="position: absolute; width: 100vw; height: 100vh;"></image>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">添加银行卡</block>
		</cu-custom>
		<view v-if="visible.page" class="page-box flex flex-direction" style=" position: relative;">
			<view class="page-box-form flex flex-direction">
				<!-- <view class="bank-info">
					<image :src="'/static/images/pay/4.png'"/>
					<view class="con">
						<text>中国工商银行 {{ bankNoStr }}</text>
					</view>
				</view> -->
				<view class="page-box-input">
					<text class="page-box-input-label">真实姓名</text>
					<text class="page-box-input-text">{{ userInfo.custName||'小明' }}</text>
				</view>
				<view class="page-box-input">
					<text class="page-box-input-label">身份证号</text>
					<text class="page-box-input-text">{{ userInfo.certNo ||'350123456789123456'}}</text>
				</view>
				<view class="page-box-input">
					<text class="page-box-input-label">手机号码</text>
					<input type="number" v-model="mobileNo" :maxlength="11" placeholder="请输入本人手机号码"
						placeholder-class="input-placeholder" />
				</view>
			</view>
			<radio-group class="page-box-info flex">
				<label class="radio-label" @tap="agreeChange">
					<radio class="blue" :class="agree ? 'checked' : ''" :checked="agree" />
				</label>
				<view class="margin-left-xs margin-top-xs">
					<text>同意并阅读</text>
					<text class="text-theme" :style="[{color: themeColor}]"
						@tap="gotoCouponDetail">《电子银行个人客户服务协议》</text><text class="text-theme"
						:style="[{color: themeColor}]">、</text><text class="text-theme" :style="[{color: themeColor}]"
						@tap="toAccount">《个人银行结算账户管理协议》</text>
				</view>
			</radio-group>
			<button class="cu-btn page-box-btn " :class="'bg-theme'" :style="{background: themeColor}"
				@tap="toShowSendCodePop">下一步</button>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
		<zj-popup ref="send-code-pop" class="send-code-pop" title="短信验证" height="auto" :mask-click="false">
			<view class="send-code-pop-box-form flex flex-direction">
				<view class="send-code-pop-box-tip">
					<text>短信验证码已发送至 {{ mobileNo }}</text>
				</view>
				<view class="send-code-pop-box-input">
					<text class="send-code-pop-box-input-label">验证码</text>
					<input type="number" v-model="code" focus :maxlength="6" placeholder="请输入短信验证码"
						placeholder-class="input-placeholder" />
					<text class="send-code-pop-box-input-right"
						@tap="toSendSms">{{ sendLoading || !send ? '重发' : (intervalSecond + 's') }}</text>
				</view>
				<button class="cu-btn send-code-pop-box-btn"
					:class="$util.strIsEmpty(code) ? 'bg-disabled' : 'bg-theme'"
					:style="{background: $util.strIsEmpty(code) ? '' : themeColor}" @tap="doNextStep">下一步</button>
			</view>
		</zj-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: {
					page: true
				},
				userInfo: {},
				mobileNo: '131111111111',
				code: '',
				billNo: '',
				sendLoading: false,
				send: false,
				intervalSecond: 59,
				agree: true,
				themeColor: ''
			}
		},
		computed: {
			bankNoStr() {
				const mediumNo = this.bankcardInfo.mediumNo
				if (this.$util.strIsEmpty(mediumNo)) return ''
				return mediumNo.substr(0, 4) + ' **** ' + mediumNo.substr(mediumNo.length - 4)
			}
		},
		methods: {
			gotoCouponDetail() {
				uni.navigateTo({
					url: `/myPackageA/pages/protocol/protocol-custom`,
				});
			},
			toAccount() {
				uni.navigateTo({
					url: `/myPackageA/pages/protocol/protocol-account`,
				});
			},
			agreeChange() {
				this.agree = !this.agree
			},
			canSendNextMsg() {
				this.send = true
				const timer = setInterval(() => {
					if (this.intervalSecond <= 1) {
						this.intervalSecond = 59
						clearInterval(timer)
						this.send = false
					} else {
						this.intervalSecond--
					}
				}, 1000)
				this.$once('hook:beforeDestroy', () => {
					this.intervalSecond = 59
					clearInterval(timer)
					this.send = false
				})
			},
			async toSendSms() {

				uni.showToast({
					title: '短信验证码发送成功！',
					icon: 'none'
				})
				this.canSendNextMsg()

			},
			async toShowSendCodePop() {
				// if (!this.agree) {
				// 	return uni.showToast({
				// 		title: '请先勾选同意相关协议！',
				// 		icon: 'none'
				// 	})
				// }

				// 判断手机号是否符合规范
				// let phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				// if (!phone.test(this.mobileNo)) {
				// 	return uni.showToast({
				// 		title: '请输入正确的手机号！',
				// 		icon: 'none'
				// 	})
				// }

				this.$refs['send-code-pop'].open()
				uni.showToast({
					title: '短信验证码发送成功！',
					icon: 'none'
				})
				this.canSendNextMsg()

			},
			async doNextStep() {
				uni.navigateBack({
					delta: 2,
					success: res => {
						uni.navigateTo({
							url: '/pages/user/user-bankcard-add-success'
						})
					}
				})
			}
		},
		onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		}
	}
</script>

<style lang="scss">
	.user-user-bankcard-add-userinfo-page {
		padding-bottom: 80rpx;

		.page-box {
			padding-top: 16rpx;

			&-form {
				margin: 24rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
			}

			.bank-info {
				height: 126rpx;
				padding: 0 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0px 2rpx 0px 0px #F4F5F7;

				image {
					width: 48rpx !important;
					height: 48rpx !important;
					margin-right: 24rpx !important;
				}

				.con {
					flex: 1;
					font-size: 30rpx;
					color: #333333;
					font-weight: bold;
				}
			}

			&-input {
				display: flex;
				align-items: center;
				justify-items: center;
				height: 124rpx;
				margin: 0 32rpx;
				color: #161616;
				font-size: 30rpx;

				&:not(:last-of-type) {
					box-shadow: 0 2rpx 0 0 #F4F5F7;
				}

				&-label {
					margin-right: 24rpx;
				}

				input {
					flex: 1;
					text-align: left;
				}

				.input-placeholder {
					color: #A9A9A9;
				}

				&-text {
					flex: 1;
					text-align: left;
					color: #666666;
				}
			}

			&-btn {
				margin: 50rpx 60rpx;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}

			.bg-disabled {
				background: #BCCBD6;
			}

			&-info {
				margin: 0 24rpx;
				color: #666666;
				font-size: 26rpx;
				align-items: flex-start;

				.radio-label {
					transform: scale(0.7, 0.7);
				}
			}
		}

		.page-bottom {
			position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-bottom: 60rpx;
			width: 100%;
			// background-color: #F5F5F5;
		}

		.send-code-pop {
			&-box {
				&-form {
					margin: 40rpx 24rpx;
					background: #FFFFFF;
					border-radius: 8rpx;

					.bg-disabled {
						background: #BCCBD6;
					}
				}

				&-tip {
					margin: 6rpx 28rpx 32rpx;
					color: #666666;
					font-size: 30rpx;
				}

				&-input {
					display: flex;
					align-items: center;
					justify-items: center;
					height: 96rpx;
					margin: 0 24rpx;
					color: #161616;
					font-size: 30rpx;
					background: #F4F5F7;
					border-radius: 8rpx;

					&-label {
						margin: 0 24rpx;
					}

					input {
						flex: 1;
						text-align: left;
						font-size: 34rpx;
					}

					.input-placeholder {
						color: #A9A9A9;
					}

					&-right {
						color: #34A2E8;
						width: 150rpx;
						border-left: 2rpx solid #E4E4E4;
						text-align: center;
					}
				}

				&-btn {
					margin: 60rpx 36rpx 40rpx;
					border-radius: 48rpx;
					font-size: 34rpx;
					color: #FFF7F7;
					height: 96rpx;
					line-height: 96rpx;
					text-align: center;
					display: block;
				}
			}
		}
	}
</style>