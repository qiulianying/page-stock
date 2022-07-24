<template>
	<view class="user-user-wallet-bankcard-add-page">
  <image src="../../static/images/bank_bg.png" mode="heightFix" style="position: absolute; width: 100vw; height: 100vh;"></image>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">添加银行卡</block>
		</cu-custom>
		<view class="page-box flex flex-direction" style="background: white;height: calc(100vh - 180rpx);">
			<view class="page-box-title">
				<view class="page-box-form flex flex-direction">
          <view class="page-box-tip">输入卡号添加</view>
					<view class="page-box-input">
						<!-- <text class="page-box-input-label">银行卡号</text> -->
						<input type="number" v-model="mediumNo" focus :maxlength="24" placeholder-style="text-align: center"
							   placeholder="请输入本人银行卡号" placeholder-class="input-placeholder" />
						<!--拍摄或者扫描添加-->
						<view @tap="chooseCardImg" class="my-page-box-btn" style="position: relative;">
							<view>
								<text class="cuIcon-scan my-cuIcon-icon"></text>
							</view>
							<view>
								<text class="text-black my-cuIcon-text">扫描添卡</text>
							</view>
						</view>
					</view>
				</view>
				<button class="cu-btn page-box-btn" :class="nextDisabled ? 'bg-disabled' : 'bg-theme'"
					:style="{background: nextDisabled ? '' : themeColor}" @tap="doNextStep">下一步</button>
			</view>
			<!-- <text class="page-box-info text-center text-theme" :style="[{color: themeColor}]" @tap="$toView(`user/user-wallet-bankcard-support`)">支持银行卡列表</text> -->
			<view class="page-box-bank">
				<view class="page-box-list">
					<text class="page-box-info text-theme">支持银行卡列表</text>
					<text class="page-box-list-remark">（仅支持62开头的储蓄卡）</text>
				</view>
				<view class="bank-list block">
					<block v-for="(name, no) in bank" :key="no">
						<label class="bank-item">
							<image :src="`/static/images/bank/${no}.png`" />
							<view class="con">
								<text>{{ name }}（储蓄卡）</text>
							</view>
						</label>
					</block>
				</view>
			</view>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				mediumNo: '',
				themeColor: '',
				bank: this.$const.BANKNAME,
				isBankNo: true
			}
		},
		onLoad() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			
		},
		computed: {
			...mapState([
				'walletInfo'
			]),
			nextDisabled() {
				return this.$util.strIsEmpty(this.mediumNo) || this.mediumNo.replace(/\s+/g, "").length < 16 || !this.isBankNo
			}
		},
		methods: {
			...mapMutations(['setWalletInfo']),
			doNextStep() {
				if (this.nextDisabled) {
					return
				}
				this.walletInfo.mediumNo = this.mediumNo.replace(/\s+/g, "")
				this.setWalletInfo(this.walletInfo)
				this.$toView(`user/user-wallet-bankcard-add-userinfo`, true)
			},
			getBlank(num) {
				if (num.length % 4 === 0) {
					return num + '\xa0\xa0'
				}
			},
			//银行卡拍摄
			chooseCardImg() {
				uni.navigateTo({
					url: `/myPackageA/pages/cards-camera?direction=back`
				})
			},
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-bankcard-add-page {
		.page-box {
			&-form {
				// margin: 40rpx 24rpx;
				background: #FFFFFF;
				// border-radius: 8rpx;
			}

      &-tip{
        padding-left: 30rpx;
        font-size: 32rpx;
        margin-bottom: 10rpx;
        font-weight: 600;
        &-remark{
          font-size: 28rpx;
          font-weight: normal;
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
				background-color: #F4F5F7;
				padding-left: 30rpx;

				&:not(:last-of-type) {
					box-shadow: 0 2rpx 0 0 #F4F5F7;
				}

				&-label {
					width: 144rpx;
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
				margin: 20rpx 60rpx;
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
				font-size: 32rpx;
				// font-size: 30rpx;
				margin: 20rpx 0;
				font-weight: 600;
			}

			&-title {
				margin: 40rpx 24rpx 0;
				background: white;
				border-radius: 8rpx;
			}

			&-bank {
				background: white;
				margin: 24rpx 60rpx 0;
				border-radius: 8rpx;
				padding: 24rpx 0;
				border: 2rpx solid #F4F5F7;
			}

			&-list {
				display: flex;
				padding-left: 48rpx;
				align-items: center;
				box-shadow: 0px 2rpx 0px 0px #F4F5F7;

				// margin-top: 48rpx;
				&-remark {
					font-size: 28rpx;
					// color: #e66980;
				}
			}

			.bank-list {
				padding: 0 24rpx 0 48rpx;

				.bank-item {
					height: 96rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-shadow: 0px 2rpx 0px 0px #F4F5F7;
				}

				image {
					width: 40rpx !important;
					height: 40rpx !important;
					margin-right: 24rpx !important;
				}

				.con {
					flex: 1;
					font-size: 28rpx;
					color: #333333;
				}
			}
		}

		.page-bottom {
			position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 14rpx;
			padding-bottom: 62rpx;
			width: 100%;
			// background-color: #F5F5F5;
		}
	}

	.my-page-box-btn {
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
