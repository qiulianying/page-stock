<template>
	<zj-popup ref="popup" title="请输入支付密码" height="auto" @change="change">
		<view class="zj-password-popup">
			<view class="code flex align-center justify-center">
				<view class="flex align-center justify-center">
					<view v-for="(item, index) in 6" :key="index">{{ password[index] && '●' || '' }}</view>
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
		</view>
	</zj-popup>
</template>

<script>
	import sha1 from 'sha1'
	
	export default {
		data() {
			return {
				password: ''
			}
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.clear()
				this.$refs.popup.close()
			},
			clear() {
				this.password = ''
			},
			change(value) {
				this.password = ''
				this.$emit('change', value)
				this.$emit('close-popup')
			},
			key(key) {
				if (this.password.length < 6) {
					this.password += key
					if (this.password.length === 6) {
						this.$emit('input-ok', sha1('superbpay@@##_2021' + this.password))
					}
				}
			},
			del() {
				if (this.password.length > 0) {
					this.password = this.password.substring(0, this.password.length - 1)
				}
			}
		}
	}
</script>

<style lang="scss">
	.zj-password-popup {
		.code {
			padding: 80rpx 0;
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
	}
</style>
