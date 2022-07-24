<template>
	<view class="login-login-mobile-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content" class="text-black">手机号码登录</block>
		</cu-custom>
		<view class="page-box">
			<view class="page-img">
				<image class="login-logo" :src="myLoginSrc" mode="widthFix" v-if="myLoginSrc"/>
			</view>
			<view class="page-box-input">
				<text class="page-box-input-icon cuIcon- zjIcon-login_number text-theme" :style="[{color: themeColor}]"/>
				<input type="number" v-model="registerForm.phoneNum" :maxlength="11" placeholder="请输入手机号码" placeholder-class="input-placeholder"/>
			</view>
			<view class="page-box-input">
				<text class="page-box-input-icon cuIcon- zjIcon-login_password text-theme" :style="[{color: themeColor}]"/>
				<input type="number" v-model="registerForm.captcha" :maxlength="6" placeholder="请输入验证码" placeholder-class="input-placeholder"/>
				<text class="page-box-input-right text-theme" :style="[{color: themeColor}]" @tap="handleSendCode">{{ sendLoading || !send ? '获取验证码' : (intervalSecond + 's后重新获取') }}</text>
			</view>
			<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" :loading="registering" @tap="handleLogin">登 录</button>
		</view>
	</view>
</template>

<script>
	import { sendMobileCode, userForceBind } from '../../api/platformgouc'
	import { memberSupply, memberMerge, memberAccount } from '../../api/infomember'
	import { smsSend, smsSendH5 } from '../../api/smsapi'
	import {BASE_URL} from "../../common/config";
	import myLoginSrc from '../../static/images/dream.png'


	export default {
		data() {
			return {
				fromurl: null,
				sendLoading: false,
				send: false,
				registering: false,
				intervalSecond: 59,
				registerForm: {},
				themeColor: '',
				myLoginSrc: myLoginSrc,
				id: '',
				merchantNo: '',
				price: ''
			}
		},
		methods: {
			validForm(callback) {
				if (this.$util.strIsEmpty(this.registerForm.phoneNum)) {
					uni.showToast({
						title: '请正确填写手机号码！',
						icon: 'none'
					})
					callback(false)
					return
				}
				callback(true)
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
			handleSendCode() {
				if (this.sendLoading || this.send) {
					return
				}
				this.validForm(valid => {
					if (valid) {
						this.registerForm.captcha = ''
						this.sendLoading = true

						/*
						* 注意：如果是云闪付和普通h是否存在差异
						* */
						// #ifdef H5
						sendMobileCode({
							phoneNum: this.registerForm.phoneNum,
							regionNo: this.$regionId,
							op: 1
						}).then(res => {
							this.sendLoading = false
							uni.showToast({
								title: '短信验证码发送成功！',
								icon: 'none'
							})
							this.canSendNextMsg()
						}).catch (err => {
							this.sendLoading = false
							console.error(err)
						})
						// #endif

						// #ifdef MP-WEIXIN
            			smsSend({
							phone: this.registerForm.phoneNum,
						}).then(res => {
							this.sendLoading = false
							uni.showToast({
								title: '短信验证码发送成功！',
								icon: 'none'
							})
							this.canSendNextMsg()
						}).catch (err => {
							this.sendLoading = false
							console.error(err)
						})
						// #endif
					}
				})
			},
			handleLogin() {
				this.validForm(valid => {
					if (valid) {
						if (this.$util.strIsEmpty(this.registerForm.captcha)) {
							uni.showToast({
								title: '请正确填写动态短信验证码！',
								icon: 'none'
							})
							return
						}
						this.registering = true
						this.$toView(`index/index`)
					}
				})
			}
		},
		onLoad(option) {
			let goodsUrl = BASE_URL + '/platform-oss/internal-getfile/'
			this.fromurl = decodeURIComponent(option.fromurl)
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.id = option.id || ''
			this.merchantNo = option.merchantNo || ''
			this.price = option.price || ''
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.login-login-mobile-page {
		.page-box {
			text-align: center;
			&-btn {
				margin: 80rpx 60rpx 20rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
			}
			&-input {
				display: flex;
				align-items: center;
				justify-items: center;
				margin: 0 60rpx 24rpx;
				height: 108rpx;
				background: #FFFFFF;
				border-radius: 54rpx;
				border: 2rpx solid #E4E4E4;
				&-icon {
					font-size: 64rpx;
					margin: 0 18rpx 0 24rpx;
				}
				input {
					flex: 1;
					text-align: left;
					font-size: 32rpx;
				}
				&-right {
					margin-right: 36rpx;
					font-size: 32rpx;
				}
				.input-placeholder {
					font-size: 30rpx;
					color: #999999;
				}
			}
		}
		.page-img {
			width: 100%;
			height: 280rpx;
			margin: 20% 0;
			.login-logo {
				width: 228rpx;
			}
		}
	}
</style>
