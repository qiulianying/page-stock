<template>
	<view class="login-login-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content" class="text-black">登录</block>
		</cu-custom>
		<view class="page-box">
			<view class="page-img">
				<image class="login-logo" :src="myLoginSrc" mode="widthFix" v-if="myLoginSrc" />
			</view>
			<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber">微信账号一键登录</button>
			<button class="cu-btn page-box-btn page-box-btn-mobile"
					@tap="toView('login/login-mobile')">手动输入手机号码登录</button>
		</view>
	</view>
</template>

<script>
	import myLoginSrc from '../../static/images/dream.png'
	export default {
		data() {
			return {
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
			toView(page) {
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
			// 微信小程序获取手机号码
			getPhoneNumber(e) {
			},
			getWXPhone(data) {
			},
			// 输入手机号码登录成功之后，进行会员账户的开通
			loginSuccess() {
			},
		},
		onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
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
					color: #161616;
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
	}
</style>
