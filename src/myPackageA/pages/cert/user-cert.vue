<template>
	<view class="user-user-cert-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">员工认证</block>
		</cu-custom>
		<view style="padding: 36rpx 32rpx 16rpx;">
			<view class="row">
				<text class="row-title">姓名</text>
				<input class="input" type="text" v-model="certData.name" placeholder="请填写您的真实姓名" placeholder-class="input-placeholder" />
			</view>
			<view class="row"> 
				<text class="row-title">企业</text>
				<input class="input" type="text" v-model="certData.companyName" placeholder="请填写您所在企业全称" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="user-cert-bottom">
			<button class="cu-btn bg-theme" :style="{background: themeColor}" :disabled="loading" :loading="loading" type="" @tap="verifyStaff">提 交</button>
		</view>
	</view>
</template>

<script>
	import { memberAccount, verifyStaff } from '../../api/infomember'
	
	export default {
		data() {
			return {
				loading: false,
				phone: '',
				certData: {
				},
        themeColor: ''
			}
		},
		methods: {
			async memberAccount () {
				await memberAccount({
					subjectType: 5,
					accountType: 1,
					subjectId: this.$regionId,
					appid: this.$appid,
					isOpen: 1
				}, {
					errorRedirect: true
				}).then(res => {
					const {
						member = {}
					} = res.object
					this.phone = member.phone
				})
			},
			async verifyStaff () {
				if (this.$util.strIsEmpty(this.certData.name) || this.$util.strIsEmpty(this.certData.companyName)) {
					return uni.showToast({
						title: '姓名和企业都不能为空',
						icon: 'none'
					})
				}
				this.loading = true
				await verifyStaff({
					name: this.certData.name,
					companyName: this.certData.companyName,
					phone: this.phone
				}).then(res => {
					this.loading = false
					this.$toView('user/user-cert-success', false, true)
				}).catch(err => {
					console.error(err)
					this.loading = false
				})
			}
		},
		async onLoad(option) {
			await this.$onLaunched
			this.memberAccount()
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
	.user-user-cert-page {
		.row {
			display: flex;
			align-items: center;
			min-height: 112rpx;
			border-bottom: 1rpx solid #F5F5F5;
			.row-title {
				flex-shrink: 0;
				width: 100rpx;
				font-size: 28rpx;
				color: #282828;
			}
			.input {
				flex: 1;
				font-size: 28rpx;
			}
			.input-placeholder {
				color: #A9A9A9;
			}
		}
		.user-cert-bottom {
			button {
				margin: 64rpx 60rpx 24rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
			}
		}
	}
</style>
