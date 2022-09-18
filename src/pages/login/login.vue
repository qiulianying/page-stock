<template>
	<view class="login-login-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content" class="text-black">登录</block>
		</cu-custom>
		<view class="page-box">
			<view class="page-img">
				<image class="login-logo" :src="myLoginSrc" mode="widthFix" v-if="myLoginSrc" />
			</view>
<!--			<button class="cu-btn page-box-btn bg-theme" open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber">微信一键登录</button>-->
			<button class="cu-btn page-box-btn bg-theme" @tap="technological">微信一键登录</button>
			<button class="cu-btn page-box-btn page-box-btn-mobile"
					@tap="toView('login/login-mobile')">手机号登录</button>
		</view>
		<!--隐私条款-->
		<view class="readInfo">
			<u-checkbox @change="checkboxChange" v-model="checkboxThis"></u-checkbox>
			已阅读并同意<span @tap="downFile('user')">《用户协议》</span>于<span @tap="downFile('Privacy')">隐私策略</span>
		</view>
	</view>
</template>

<script>
	import myLoginSrc from '../../static/images/dream.png'
	import {userLogin} from "../../api/platformgouc";
	export default {
		data() {
			return {
				checkboxThis: true,
				fromurl: null,
				themeColor: '',
				merchantNo: '',
				price: '',
				goodsId: '',
				id: '',
				lat: '',
				lon: '',
				myLoginSrc: myLoginSrc,
				h5OpenForm: uni.getStorageSync('h5OpenForm'),		// 当前打开的是什么设备和软件
				code: ''
			}
		},
		methods: {
			checkboxChange(e) {
				this.checkboxThis = e.value
			},
			downFile(type) {
				let url = ''
				if (type === 'user') {
					url = 'https://dream.kaihuaikj.com/userProtocol.pdf'
				} else {
					url = 'https://dream.kaihuaikj.com/privateProtocol.pdf'
				}
				uni.downloadFile({
					url: url,
					success: function (res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function (res) {
								console.log('打开文档成功');
							}
						});
					}
				});
			},
			// 获取用户信息
			technological() {
				if (!this.checkboxThis) {
					uni.showToast({
						title: '请阅读并同意用户协议！',
						icon: 'none'
					})
					return
				}
				let _this = this
				uni.showModal({
					title: '温馨提示',
					content: '需要请求您的微信个人信息',
					success: function (res) {
						if (res.confirm) {
							// 获取用户信息，只限于微信小程序情况下
							uni.getUserProfile({
								desc: "获取你的昵称、头像、地区及性别",
								success: res => {
									let userAllInfo = res.userInfo
									// 保存微信获取的对应userInfo
									uni.setStorageSync('userInfo', res.userInfo)
									userAllInfo.openid = uni.getStorageSync('openId')
									userLogin(userAllInfo).then(res => {
										uni.setStorageSync('mspToken', res.data)
										// 跳转对应页面或者返回上一页
										let pages = getCurrentPages(); // 当前页面
										let beforePage = pages[pages.length - 2]; // 上一页
										uni.navigateBack({
											success: function() {
												beforePage.onLoad(); // 执行上一页的onLoad方法
											}
										});
										uni.showToast({
											title: '登录成功！',
											icon: 'success'
										})

										// if (_this.fromurl) {
										// 	uni.redirectTo({
										// 		url: decodeURIComponent(_this.fromurl)
										// 	})
										// } else {
										// 	let pages = getCurrentPages(); // 当前页面
										// 	let beforePage = pages[pages.length - 2]; // 上一页
										// 	uni.navigateBack({
										// 		success: function() {
										// 			beforePage.onLoad(); // 执行上一页的onLoad方法
										// 		}
										// 	});
										// }
									})
								},
								fail: res => {
									console.log(res)
								}
							})
						} else if (res.cancel) {
							reject()
							console.log('用户点击取消');
						}
					}
				});
			},
			toView(page) {
				if (!this.checkboxThis) {
					uni.showToast({
						title: '请阅读并同意用户协议！',
						icon: 'none'
					})
					return
				}
				let url = `/pages/${page}`
				if (this.$util.strIsNotEmpty(this.fromurl)) {
					url += `?fromurl=${encodeURIComponent(`${this.fromurl}`)}`
					// 如果有id，说明是从商城领券的流程过来的
					if (this.id) {
						url += `&id=${this.id}`
					}
					if (this.fromurl.indexOf('shop-check') > -1) {
						url += `&merchantNo=${this.merchantNo}&price=${this.price}`
					}
				}
				uni.navigateTo({
					url: url
				})
			},
			// 微信一键登录获取相关信息微信小程序获取手机号码
			getPhoneNumber(res) {
				console.log('手机号code')
				console.log(res.detail.code)
				uni.login({
					success: loginRes => {
						console.log(loginRes)
						console.log('微信登录')
						console.log(loginRes.code)

						// 执行登录并获取code
						// userLogin({
						// 	code: loginRes.code,
						// }, {
						// 	errorRedirect: false
						// }).then(res => {
						// 	//获取到对应的登录信息
						// 	console.log(res)
						// })
					}
				})
			},
			// 输入手机号码登录成功之后，进行会员账户的开通
			loginSuccess() {
			},
		},
		onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			if (option.fromurl) {
				this.fromurl = decodeURIComponent(option.fromurl)
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.login-login-page {
		.page-box {
			text-align: center;

		  .bg-theme {
			background: linear-gradient(106deg, #4749FF 0%, #5A3380 100%);
			border-radius: 45px;
		  }

			.page-box-btn {
				margin: 40rpx 60rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;

				// background: #3FAEEF;
				&-mobile {
          font-weight: 500;
          color: #523DB8;
					height: 90rpx;
					line-height: 90rpx;
					border: 2rpx solid #E4E4E4;
					background: #FFFFFF;
					box-sizing: border-box;
				}
			}

			.myupbutton {
				width: 70%;
				margin: 0 auto;
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

		.readInfo {
			font-size: 24rpx;
			font-weight: 400;
			color: #adadad;
			text-align: center;
			width: 100%;
			position: fixed;
			bottom: 60rpx;
			span {
				font-size: 26rpx;
				color: #333333;
			}
		}
	}
</style>
