<template>
	<view class="index-user-page" style="padding-bottom: 110rpx">
		<view class="index-user-info">
			<view class="index-user-info-bg">
				<!-- <image class="image-bg" src="/static/images/my-bg.png" /> -->
				<view class="index-user-info-box">
					<image src="" @tap="handleLogin" />
					<view class="index-user-info-box-content" @tap="handleLogin">
						<view v-if="$util.strIsEmpty(member.phone)">登录/注册</view>
						<!-- <view>用户名称</view>
						<view>欢迎您使用xxx</view> -->
						<template v-else>
							<view v-if="
                  companyStaffEntity.status === 1 &&
                  $util.strIsNotEmpty(companyStaffEntity.name)
                ">
								{{ companyStaffEntity.name }}</view>
							<view v-else-if="$util.strIsNotEmpty(member.name)">{{
                member.name
              }}</view>
							<view>{{ $util.phoneDesensitization(member.phone) }}</view>
							<view v-if="
                  companyStaffEntity.status === 1 &&
                  $util.strIsNotEmpty(companyStaffEntity.companyName)
                ">
								{{ companyStaffEntity.companyName }}</view>
						</template>
					</view>
					<view v-if="$util.strIsNotEmpty(companyStaffEntity.companyName)" :class="
              companyStaffEntity.status === 1
                ? 'index-user-info-box-certed'
                : 'index-user-info-box-certing'
            ">
						<text v-if="companyStaffEntity.status === 1"
							class="cuIcon- zjIcon-authentication text-df"></text>
						<text v-if="companyStaffEntity.status === 1" class="text-xs margin-lr-xs">已认证</text>
						<text v-else class="text-xs margin-lr-xs" @tap="showCertingTip">认证审核中</text>
					</view>
				</view>
			</view>
			
			<view class="index-user-statistics">
				<view class="index-user-statistics-item">
					<view class="index-user-statistics-image">
						<image src=""></image>
					</view>
					<view>我的订单</view>
				</view>
				<view class="index-user-statistics-item">
					<view class="index-user-statistics-image">
						<image src=""></image>
					</view>
					<text>未付款</text>
				</view>
				<view class="index-user-statistics-item">
					<view class="index-user-statistics-image">
						<image src=""></image>
					</view>
					<text>已完成</text>
				</view>

				<!-- <view class="index-user-statistics-item">
					<text class="index-user-statistics-item-num">{{ extraTotal.couponCount == null ? '0' : extraTotal.couponCount }}</text>
					<view>我的订单</view>
				</view> -->
			</view>
		</view>

		<view class="index-user-menu cu-list menu">
			<view class="cu-item arrow" @tap="$toView('shopMall/user/user-deal-record')">
				<view class="content">
					<text class="cuIcon- zjIcon-trading_record text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">交易记录</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$toView('shopMall/user/user-address-list')">
				<view class="content">
					<text class="cuIcon- zjIcon-address text-theme" :style="[{color: themeColor}]"></text>
					<text class="text-black">收货地址</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		memberAccount,
		getMemberInfo
	} from "../../../api/infomember";

	export default {
		data() {
			return {
				visible: {
					page: false,
				},
				member: {},
				account: {},
				companyStaffEntity: {},
				extraTotal: {},
				accountBalance: {},
        themeColor: ''
			};
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
    },
		methods: {
			init() {
				this.memberAccount();
				this.getMemberInfo();
			},
			handleLogin() {
				if (this.member == null || this.$util.strIsEmpty(this.member.phone)) {
					this.$toView("login/login");
				}
			},
			showCertingTip() {
				uni.showToast({
					title: "您提交的认证申请正在审核中，请耐心等待。",
					icon: "none",
				});
			},
			getMemberInfo() {
				getMemberInfo({
					subjectType: 5,
					subjectId: this.$regionId,
				}, {
					hideLoading: true,
					hideMsg: true,
				}).then((res) => {
					this.extraTotal = (res.object || {}).extra;
				});
			},
			memberAccount() {
				memberAccount({
					subjectType: 5,
					accountType: 1,
					subjectId: this.$regionId,
					appid: this.$appid,
					isOpen: 1,
				}, {
					hideLoading: this.visible.page,
					hideMsg: this.visible.page,
				}).then((res) => {
					const obj = res.object;
					this.member = obj.member || {};
					if (obj.account != null && obj.account.length > 0) {
						this.account = obj.account[0];
					} else {
						this.account = {};
					}
					this.companyStaffEntity = obj.companyStaffEntity || {};
					this.accountBalance = obj.accountBalance || {};
					this.visible.page = true;
				});
			},
		},
	};
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
					border-radius:50%;
					background-color: #34A2E8;
					// border: 1px solid red;
					margin-right: 14rpx;
				}

				&-content {
					flex: 1;
					margin-left: 20rpx;

					view {
						&:first-child {
							height: 64rpx;
							font-size: 36rpx;
							font-weight: 500;
							line-height: 64rpx;
							color: #fff;
							overflow: hidden;
						}

						&:nth-child(2) {
							height: 40rpx;
							font-size: 24rpx;
							font-weight: 400;
							line-height: 40rpx;
							margin-top: 4rpx;
							color:#fff;
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
					background: linear-gradient(90deg, #d9b679 0%, #d5b57f 100%);
					border-radius: 38rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #ffffff;
					padding: 14rpx 42rpx;
				}

				&-certed,
				&-certing {
					color: #ffffff;
					padding: 0 12rpx;
					display: flex;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 20rpx;
				}

				&-certed {
					background: linear-gradient(84deg, #3ca5ff 0%, #1c6cfe 100%);
				}

				&-certing {
					background: linear-gradient(90deg, #f85088 0%, #ee2d28 100%);
				}
			}

			.index-user-statistics {
				position: absolute;
				left: 32rpx;
				right: 32rpx;
				bottom: 0;
				display: flex;
				justify-content: space-around;
				align-content: center;
				background: #ffffff;
				border-radius: 8rpx;
				padding: 40rpx 0;
				box-shadow: #c9c9c9 -2px 5px 17px -1px;

				&-item {
					display: flex;
					width: 33%;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
					font-weight: 600;
					color: #4d4d4d;
					flex: 1;

					&:not(:last-child) {
						border-right: 2rpx solid #f5f5f5;
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

		.index-user-statistics-image {
			background-color: #34A2E8;
			width: 90rpx;
			height: 90rpx;
			border-radius: 45rpx;
			margin-bottom: 20rpx;
		}
		.index-user-info-bg{
			height: 320rpx;
			background-image: linear-gradient(#34A2E8, #87bbee);
		}
	}
</style>