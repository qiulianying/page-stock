<template>
	<view class="user-user-wallet-bankcard-add-userinfo-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">添加银行卡</block>
		</cu-custom>
		<view class="page-box flex flex-direction">
			<image src="../../static/images/bank_bg.png" mode="heightFix"
				style="position: absolute; width: 100vw; height: 100vh; bottom: -176rpx;"></image>
			<view class="page-box-subtitle" :style="[{background: themeColor}, {color: themeColor}]">
				<view class="page-box-subtitle-text">
					<text>为防范风险，保护当事人合法权益，需要添加银行卡进行实名认证</text>
				</view>
			</view>

			<!--身份证背面-->
			<view class="page-box-idCard flex flex-direction">
				<view class="page-box-subtitle text-center">
					<text>请上传本人有效的身份证背面照片</text>
				</view>
				<image v-if="$util.strIsEmpty(idcard2)" src="/static/images/idcard-2.png" @tap="chooseCardImg('back')"
					mode="aspectFill"></image>
				<image v-else :src="idcard2" @tap="chooseCardImg('back')" mode="aspectFill"></image>
				<view class="upload-info text-right text-theme text-lg"
					:style="[{color: themeColor}, {position: relative}]" @tap="showUploadInfoPop">
					<text class="cuIcon-infofill margin-right-xs"></text>
					<text class="text-df">拍摄照片要求</text>
				</view>
			</view>

			<view class="page-box-form flex flex-direction">
				<view class="page-box-input" style="position: relative">
					<text class="page-box-input-label">签发日期</text>
					<picker class="page-box-input-picker" mode="date" :end="today" @change="selectSignDate"
						:value="signDate">
						<view class="flex">
							<view class="flex-sub" :class="{ 'input-placeholder': signDate == null }">
								{{ signDate == null ? '请选择身份证签发日期' : signDate }}
							</view>
							<view class="cuIcon-right margin-left-xs text-gray"></view>
						</view>
					</picker>
				</view>
				<view class="page-box-input" style="position: relative">
					<text class="page-box-input-label">有效期至</text>
					<picker v-if="!longDate" class="page-box-input-picker" mode="date" :start="today"
						@change="selectValidityPeriod" :value="validityPeriod">
						<view class="flex">
							<view class="flex-sub" :class="{ 'input-placeholder': validityPeriod == null }">
								{{ validityPeriod == null ? '请选择身份证有效期' : validityPeriod }}
							</view>
							<view class="cuIcon-right margin-left-xs text-gray"></view>
						</view>
					</picker>
					<view v-else class="page-box-input-picker">
						<text>长期有效</text>
					</view>
					<radio-group class="flex">
						<label @tap="longDateChange">
							<radio class="blue" style="transform: scale(0.6, 0.6);margin-right: -6rpx;"
								:class="longDate ? 'checked' : ''" :checked="longDate" />
							<text class="text-sm text-theme" :style="[{color: themeColor}]">长期有效</text>
						</label>
					</radio-group>
				</view>
			</view>
			<radio-group class="page-box-info flex" style="position: relative">
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
			<button class="cu-btn page-box-btn" :class="nextDisabled ? 'bg-disabled' : 'bg-theme'"
				:style="{background: nextDisabled ? '' : themeColor}" @tap="doNextStep" :disabled="submiting"
				:loading="submiting">下一步</button>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
		<!--拍摄要求-->
		<zj-popup ref="upload-info-pop" class="upload-info-pop" title="拍摄照片要求" height="auto">
			<view class="text-center" style="width: 100%; padding-bottom: 50rpx;">
				<!-- <image src="/static/images/idcard-demo.png" style="width: 686rpx; height: 618rpx; margin: 24rpx auto;"> -->
				<image :src="imgUrl + '1635818546743/idcard-demo.png'"
					style="width: 686rpx; height: 618rpx; margin: 24rpx auto;">
				</image>
			</view>
		</zj-popup>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		uploadImg
	} from "../../api/paymentspmate";

	export default {
		data() {
			return {
				idcard1: '',
				idcard2: '',
				agree: true,
				longDate: false,
				signDate: null,
				validityPeriod: null,
				themeColor: '',
				submiting: false,
				imgUrl: ''
			}
		},
		mounted() {
			this.clearImg()
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		onLoad() {
			this.imgUrl = this.$imgUrl
			//获取身份证图片内容信息
			this.idcard1 = uni.getStorageSync('idcardFront') || ''
			this.idcard2 = uni.getStorageSync('idcardBack') || ''
			if (uni.getStorageSync('idCardOcrBack') && uni.getStorageSync('idCardOcrBack').validFrom && uni.getStorageSync(
					'idCardOcrBack').validTo) {
				this.signDate = uni.getStorageSync('idCardOcrBack').validFrom

				if (uni.getStorageSync('idCardOcrBack').validTo === '长期' || uni.getStorageSync('idCardOcrBack').validTo ===
					'长期有效') {
					this.longDate = true
					this.validityPeriod = null
				} else {
					this.longDate = false
					this.validityPeriod = uni.getStorageSync('idCardOcrBack').validTo
				}
			}
		},
		computed: {
			...mapState([
				'walletInfo'
			]),
			foreverFlag() {
				return this.longDate ? 1 : 0
			},
			nextDisabled() {
				return !this.agree || this.$util.strIsEmpty(this.signDate) || !this.longDate && this.$util.strIsEmpty(this
					.validityPeriod)
			},
			today() {
				return dayjs().format('YYYY-MM-DD')
			},
			bankNoStr() {
				const mediumNo = this.walletInfo.mediumNo
				if (this.$util.strIsEmpty(mediumNo)) return ''
				return mediumNo.substr(0, 4) + ' **** ' + mediumNo.substr(mediumNo.length - 4)
			}
		},
		methods: {
			...mapMutations(['setWalletInfo']),
			...mapActions(['getAccountId']),
			showUploadInfoPop() {
				this.$refs['upload-info-pop'].open()
			},
			clearImg() {
				this.setWalletInfo({
					...this.walletInfo,
					frontImgPath: null,
					backImgPath: null
				})
			},
			//身份证拍摄
			chooseCardImg(type) {
				this.clearImg()
				uni.navigateTo({
					url: `/myPackageA/pages/idcard-camera?direction=${type}`
				})
			},
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
			longDateChange() {
				this.longDate = !this.longDate
				this.validityPeriod = null
			},
			selectSignDate(e) {
				this.signDate = e.detail.value
			},
			selectValidityPeriod(e) {
				this.validityPeriod = e.detail.value
			},
			async doNextStep() {
				if (!this.agree) {
					return uni.showToast({
						title: '请先勾选同意相关协议！',
						icon: 'none'
					})
				}
				this.$toView(`user/user-wallet-pay-open`, true)
			},
			async uploadImg() {
				this.submiting = true
				await uploadImg({
					...this.walletInfo,
					regionNo: this.$regionId,
					accountId: await this.getAccountId()
				}).then(res => {
					this.submiting = false
					this.$toView(`user/user-wallet-pay-open`, true)
				}).catch(err => {
					console.error(err)
					setTimeout(() => {
						uni.showToast({
							title: '查看是否身份证图片不完整！',
							icon: 'none',
							duration: 3000
						})
					}, 1000)
					this.submiting = false
				})
			},
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-bankcard-add-userinfo-page {
		padding-bottom: 80rpx;

		//身份证图片
		.page-box-idCard {
			padding-top: 30rpx;

			&-subtitle {
				font-size: 30rpx;
			}

			image {
				width: 630rpx;
				height: 416rpx;
				margin: 14rpx auto;
				border-radius: 10rpx;
			}

			.upload-info {
				margin: 12rpx 60rpx;
				line-height: 36rpx;

				text {
					vertical-align: middle;
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
		}

		.page-box {
			&-subtitle {
				// background: #DCEEF9;
				// color: #34A2E8;
				font-size: 26rpx;

				// padding: 24rpx 42rpx;
				&-text {
					opacity: 0.9;
					padding: 24rpx 42rpx;
					background: white;

				}
			}

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
				box-shadow: 0 2rpx 0px 0px #F4F5F7;

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
					width: 144rpx;
				}

				&-picker {
					flex: 1;
					text-align: left;
				}

				input {
					flex: 1;
					text-align: left;
				}

				.input-placeholder {
					color: #A9A9A9;
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
			// position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-bottom: 50rpx;
			width: 100%;
			// background-color: #F5F5F5;
		}
	}

	.my-page-box-btn-card {
		float: right;
		margin: 0;
		width: 140rpx;
		text-align: center;

		.my-cuIcon-icon {
			font-size: 40rpx;
			color: #A9A9A9;
		}

		.my-cuIcon-text {
			font-size: 26rpx;
			color: #A9A9A9;
		}
	}
</style>