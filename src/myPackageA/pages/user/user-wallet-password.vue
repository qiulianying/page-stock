<template>
	<view class="user-user-wallet-password-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">支付密码</block>
		</cu-custom>
		<view class="menu-list cu-list menu">
			<view class="cu-item arrow"
				@tap="$toView('/myPackageA/pages/user/user-wallet-password-set', true,false,true)"
				v-if="enableMemberPassword === 1 &&  hasPassword === 1">
				<view class="content">
					<text class="text-black">修改支付密码</text>
				</view>
			</view>
			<view class="cu-item arrow"
				@tap="$toView('/myPackageA/pages/user/user-wallet-password-set', true,false,true)"
				v-if="enableMemberPassword === 1 &&  hasPassword === 0">
				<view class="content">
					<text class="text-black">设置支付密码</text>
				</view>
			</view>
			<view class="cu-item arrow"
				@tap="$toView('/myPackageA/pages/user/user-wallet-password-set', true,false,true)"
				v-if="enableMemberPassword === 1 &&  hasPassword === 1">
				<view class="content">
					<text class="text-black">忘记支付密码</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="openPassword" v-if="enableMemberPassword === 0">
				<view class="content">
					<text class="text-black">开启密码验证</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="closePassword" v-if="enableMemberPassword === 1">
				<view class="content">
					<text class="text-black">关闭密码验证</text>
				</view>
			</view>
		</view>
		<u-modal v-model="show" :show-cancel-button="true" :content="content" @cancel="show = false" @confirm="confirm">
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	import {
		isPassword,
		openPassword,
		closePassword
	} from '../../../api/infomember'
	export default {
		name: 'user-wallet-password',
		components: {},
		props: {

		},
		data() {
			return {
				show: false,
				type: 'open',
				content: '该操作将修改密码验证设置为开启密码验证，请确认是否继续',
				enableMemberPassword: 0,
				hasPassword: 0,

			};
		},
		watch: {},
		computed: {},
		created() {},
		mounted() {
			this.enableMemberPassword = this.$store.state.enableMemberPassword
			this.hasPassword = this.$store.state.hasPassword
		},
		beforeDestroy() {},
		methods: {
			...mapActions(['getAccountId']),
			//关闭密码验证
			closePassword() {
				this.show = true
				this.type = 'close'
				this.content = '该操作将修改密码验证设置为关闭密码验证，请确认是否继续'
			},
			//开启密码验证
			openPassword() {
				this.show = true
				this.type = 'open'
				this.content = '该操作将修改密码验证设置为开启密码验证，请确认是否继续'
			},
			//判断对应的密码情况
			async confirm() {
				let _this = this

				uni.redirectTo({
					url: `/myPackageA/pages/user/user-wallet-password-set`
				})

				// this.id = await this.getAccountId()
				// isPassword({
				// 	id: this.id
				// }).then(res => {
				// 	if (res.object.accoutId) {
				// 		let enableMemberPassword = _this.type === 'open' ? 1 : 0
				// 		let myFunction = _this.type === 'open' ? openPassword : closePassword
				// 		console.log(res.object)
				// 		// 如果是开启密码验证，直接开启
				// 		if (_this.type === 'open') {

				// 			// if (res.errcode === '0') {

				// 			if (this.$store.state.hasPassword === 0) {
				// 如果没有设置密码，则需要跳转输入密码
				// uni.redirectTo({
				// 	url: `/myPackageA/pages/user/user-wallet-password-set?accountid=${res.object.accoutId}&enableMemberPassword=${enableMemberPassword}`
				// })
				// } else {
				// myFunction({
				// 	accountId: res.object.accoutId,
				// 	enableMemberPassword
				// }).then(res => {
				// 	if (res.errcode === '0') {
					


				// this.$refs.uToast.show({
				// 	title: '密码开启成功！',
				// 	type: 'success',
				// })
				// 返回到首页
				// setTimeout(() => {
				// 	uni.navigateBack()
				// }, 800)




				// }
				// 	})

				// }


				// }
				// })
				// myFunction({
				// 	accountId: res.object.accoutId,
				// 	enableMemberPassword
				// }).then(res => {
				// 	if (res.errcode === '0') {
				// 		this.$refs.uToast.show({
				// 			title: '密码开启成功！',
				// 			type: 'success',
				// 		})
				// 		if (this.$store.state.hasPassword === 0) {


				// 			// 如果没有设置密码，则需要跳转输入密码
				// 			uni.redirectTo({
				// 				url: `/pages/user/user-wallet-password-set`
				// 			})



				// 		} else {
				// 			// 返回到首页
				// 			setTimeout(() => {
				// 				uni.navigateBack()
				// 			}, 800)
				// 		}


				// 	}
				// })
				// } else {
				// 如果是关闭密码验证，则需要跳转输入密码
				uni.redirectTo({
					url: `/myPackageA/pages/user/user-wallet-password-set?closePassword=${true}&accountId=${res.object.accoutId}&enableMemberPassword=${enableMemberPassword}`
				})
				// this.$toView(`user/user-wallet-password-set?closePassword=${true}&accountId=${res.object.accoutId}&enableMemberPassword=${enableMemberPassword}`, true)
				// }
				// }
				// })
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.user-user-wallet-password-page {
		.menu-list {
			margin: 32rpx;
		}

		.cu-list.menu>.cu-item {
			padding: 0;
		}

		.cu-list.menu>.cu-item.arrow:before {
			right: 0;
		}
	}
</style>