<template>
	<view class="user-user-wallet-password-set-page">
		<cu-custom is-back></cu-custom>
		<view class="flex flex-direction">
			<view v-if="$util.strIsNotEmpty(redirecturl)" class="margin-right margin-top text-xl text-right"
				@tap="$toView(redirecturl, false, true)">
				<text>跳过</text>
			</view>
			<view v-else class="margin"></view>
			<view class="text-xxl text-center text-bold margin-top-xl" v-if="!closePassword">
				{{ step === 1 ? '设置支付密码' : '再次输入支付密码' }}</view>
			<view class="text-xxl text-center text-bold margin-top-xl" v-else>请输入密码验证</view>
			<view class="text-df text-center text-gray margin-top" v-if="!closePassword">
				{{ step === 1 ? '请设置支付密码，保障您的账户安全' : '请再次输入密码以确认' }}</view>
			<view class="code flex align-center justify-center" style="margin-top: 10vh;">
				<view class="flex align-center justify-center">
					<view v-for="(item, index) in 6" :key="index">{{ inputStr[index] && '●' || '' }}</view>
				</view>
			</view>
		</view>
		<view class="keyboard flex flex-wrap">
			<button v-for="(item, index) in 9" :key="index" hover-class="button-hover" @click="key(index + 1)">
				<text>{{ index + 1 }}</text>
			</button>
			<button hover-class="button-hover" class="hide"></button>
			<button hover-class="button-hover" @click="key(0)">
				<text>0</text>
			</button>
			<button hover-class="button-hover" @click="del()">
				<image src="/static/images/icon/icon-keyboard-delete.png" mode="aspectFill"></image>
			</button>
		</view>
		<zj-popup ref="send-code-pop" class="send-code-pop" title="短信验证" height="auto" :mask-click="false"
			:allow-close="false" v-if="!closePassword">
			<view class="send-code-pop-box-form flex flex-direction">
				<view class="send-code-pop-box-tip">
					<text>短信验证码已发送至 {{ phone }}</text>
				</view>
				<view class="send-code-pop-box-input">
					<text class="send-code-pop-box-input-label">验证码</text>
					<input type="number" v-model="code" focus :maxlength="6" placeholder="请输入短信验证码"
						placeholder-class="input-placeholder" />
					<text class="send-code-pop-box-input-right"
						@tap="handleSendCode">{{ sendLoading || !send ? '重发' : (intervalSecond + 's') }}</text>
				</view>
				<button class="cu-btn send-code-pop-box-btn"
					:class="$util.strIsEmpty(code) ? 'bg-disabled' : 'bg-theme'"
					:style="{background: $util.strIsEmpty(code) ? '#BCCBD6' : themeColor}" @tap="setPwdApi">确认</button>
			</view>
		</zj-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import sha1 from 'sha1'
	import {
		memberAccount,
		setPwd,
		openPassword
	} from '../../../api/infomember'
	import {
		closePassword
	} from '../../../api/infomember'
	import {
		smsSend
	} from '../../../api/smsapi'
	import {
		sendMobileCode
	} from '../../../api/platformgouc'

	export default {
		data() {
			return {
				step: 1,
				inputStr: '',
				password: '',
				phone: '',
				code: '',
				sendLoading: false,
				send: false,
				intervalSecond: 59,
				accountId: null,
				redirecturl: null,
				closePassword: false,
				enableMemberPassword: '',
				accoutIdClose: '',
				themeColor: '',
			}
		},
		methods: {
			key(key) {
				// 如果不是关闭密码验证
				if (!this.closePassword) {
					if (this.inputStr.length < 6) {
						this.inputStr += key
						if (this.inputStr.length === 6) {
							if (this.step === 1) {
								this.password = this.inputStr
								this.inputStr = ''
								this.step = 2
							} else if (this.inputStr !== this.password) {
								this.inputStr = ''
								uni.showToast({
									title: '两次密码输入不一致！',
									icon: 'none'
								})
								this.step = 1
							} else {
								this.sendSms()
							}
						}
					}
				} else {
					// 如果是关闭密码验证
					if (this.inputStr.length < 6) {
						this.inputStr += key
						if (this.inputStr.length === 6) {
							this.password = this.inputStr
							// 密码输入之后，调取接口进行验证
							closePassword({
								accountId: this.accoutIdClose,
								enableMemberPassword: parseInt(this.enableMemberPassword),
								tradePassword: sha1('superbpay@@##_2021' + this.password),
							}).then(res => {
								if (res.errcode === '0') {
									this.showToast()
									setTimeout(() => {
										this.inputStr = ''
										uni.navigateBack()
									}, 800)
								} else {
									this.$refs.uToast.show({
										title: res.errmsg,
										type: 'error',
									})
								}
							})
						}
					}

				}
			},
			showToast() {
				this.$refs.uToast.show({
					title: '关闭密码验证',
					type: 'success',
				})
			},
			del() {
				if (this.inputStr.length > 0) {
					this.inputStr = this.inputStr.substring(0, this.inputStr.length - 1)
				}
			},
			async sendSms() {
				await this.memberAccount()
			},
			async memberAccount() {
				// await memberAccount({
				// 	subjectType: 5,
				// 	accountType: 1,
				// 	subjectId: this.$regionId,
				// 	appid: this.$appid,
				// 	isOpen: 1
				// }).then(res => {
				// 	const obj = res.object
				// 	const member = obj.member || {}
				// 	this.phone = member.phone
				// 	if (obj.account != null && obj.account.length > 0) {
				// 		this.accountId = obj.account[0].accountId
				// 	}
					this.smsSend()
				// })
			},
			async smsSend() {
				if (this.sendLoading || this.send) {
					return
				}
				this.code = ''
				this.sendLoading = true

				// #ifdef H5
				// await sendMobileCode({
				// 	phoneNum: this.phone,
				// 	regionNo: this.$regionId,
				// 	op: 5
				// }).then(res => {
					this.sendLoading = false
					uni.showToast({
						title: '短信验证码发送成功！',
						icon: 'none'
					})
					this.canSendNextMsg()
					this.$refs['send-code-pop'].open()
				// }).catch(err => {
				// 	this.sendLoading = false
				// 	console.error(err)
				// })
				// #endif

				// #ifdef MP-WEIXIN
				await smsSend({
					// opType: 'updatePwd',
					phone: this.phone
				}).then(res => {
					this.sendLoading = false
					uni.showToast({
						title: '短信验证码发送成功！',
						icon: 'none'
					})
					this.canSendNextMsg()
					this.$refs['send-code-pop'].open()
				}).catch(err => {
					this.sendLoading = false
					console.error(err)
				})
				// #endif
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
				this.smsSend()
			},
			async setPwdApi() {
				// 在设置密码之前,先判断是否有密码，没有的话，先开启密码验证,密码验证通过之后再调用设置密码接口
				if (this.$store.state.hasPassword === 0) {
					// openPassword({
					// 	accountId: this.accountId,
					// 	enableMemberPassword: parseInt(this.enableMemberPassword)
					// }).then(res => {
					// 	if (res.errcode === '0') {
							this.setPassword()
						}
					// })
				// } else {
				// 	this.setPassword()
				// }


			},
			setPassword(){
				//  setPwd({
				// 	opType: 'updatePwd',
				// 	phone: this.phone,
				// 	captcha: this.code,
				// 	newPassword: sha1('superbpay@@##_2021' + this.password),
				// 	accountId: this.accountId,
				// 	source: 1
				// }).then(res => {
				// 	if (this.$util.strIsNotEmpty(this.redirecturl)) {
						uni.showToast({
							title: '密码设置成功',
							icon: 'success'
						})
						setTimeout(() => {
							this.$nextTick(() => {
								// this.$toView(this.redirecturl, false, true)
								uni.navigateTo({
								  url: `/pages/index/index`,
								})
							})
						}, 800)
					// } else {
					// 	this.$toView(`/myPackageA/pages/user/user-wallet-password-set-success`, false, true, true)
					// }
				// })
			}
		},
		async onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			await this.$onLaunched
			let {
				redirecturl
			} = option
			if (this.$util.strIsNotEmpty(redirecturl)) {
				this.redirecturl = decodeURIComponent(redirecturl)
			}
			console.log('this.redirecturl==========',this.redirecturl)
			this.closePassword = option.closePassword || false
			this.accoutIdClose = option.accountId || ''
			this.enableMemberPassword = option.enableMemberPassword || ''
			memberAccount({
				subjectType: 5,
				accountType: 1,
				subjectId: this.$regionId,
				appid: this.$appid,
				isOpen: 1
			}).then(res => {
				const obj = res.object
				const member = obj.member || {}
				this.phone = member.phone
				if (obj.account != null && obj.account.length > 0) {
					this.accountId = obj.account[0].accountId
					this.accoutIdClose = obj.account[0].accountId
				}
			})
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.user-user-wallet-password-set-page {
		.code {
			>view {
				border: 1px solid #DDDDDD;
				border-radius: 8rpx;
				overflow: hidden;

				view {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100rpx;
					height: 100rpx;
					background: #FAFAFA;
					font-size: 60rpx;

					&:not(:last-child) {
						border-right: 1px solid #DDDDDD;
					}
				}
			}
		}

		.keyboard {
			position: fixed;
			bottom: 0;
			width: 100%;
			background: #EEEEEE;

			button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: calc(100vw / 3 - 1px);
				background: #FFFFFF;
				border-radius: 0;
				margin-top: 1px;
				font-size: 50rpx;
				height: 108rpx;

				&.button-hover:not(.hide) {
					background: #EEEEEE;
				}

				image {
					width: 52rpx;
					height: 38rpx;
				}
			}
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
