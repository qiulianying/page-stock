<template>
	<view v-if="visible.page" class="user-user-bankcard-detail-page">
		<image src="../../static/images/bank_bg.png" mode="heightFix"
			style="position: absolute; width: 100vw; height: 100vh;"></image>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">银行卡</block>
		</cu-custom>
		<view class="page-box flex flex-direction"
			:style="[{position: 'relative'},{height: `calc(100% - ${getHeight})`}]">
			<bank-item :bank-code="bankTp" :card-code="bindMedium" />
			<view class="cu-list menu margin-top" style="overflow: unset;">
				<view class="cu-item arrow" @tap="toDel">
					<view class="content">
						<text class="cuIcon-delete"></text>
						<text class="text-black">解除绑定</text>
					</view>
				</view>
			</view>
		</view>
		<zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk"></zj-password-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: {
					page: true
				},
				cardId: null,
				bindMedium: null,
				bankTp: null,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			}
		},
		computed: {
			getHeight() {
				let h = this.StatusBar + this.CustomBar + 15
				return h + 'px'
			}
		},
		methods: {
			toDel() {
				uni.showModal({
					content: '您确认要解绑该银行卡吗？',
					success: res => {
						if (res.confirm) {
							this.$refs['check-password-pop'].open()
						}
					}
				})
			},
			passwordInputOk(value) {
				uni.showToast({
					title: "解绑成功",
					duration: 2000
				});
			},
		},
		async onLoad(option) {
			this.visible.page = true
		}
	}
</script>

<style lang="scss">
	.user-user-bankcard-detail-page {
		height: 100vh;

		.page-box {
			margin: 0 24rpx;
			padding: 24rpx;
			overflow-y: auto;

			button {
				margin: 24rpx 0;
				border-radius: 0;
				font-size: 34rpx;
				color: #333333;
				height: 96rpx;
				line-height: 96rpx;
				display: flex;
				box-shadow: 0px 2px 0px 0px #F4F5F7;
			}
		}
	}
</style>