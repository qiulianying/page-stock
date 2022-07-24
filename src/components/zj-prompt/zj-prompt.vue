<template>
	<view v-if="isShowModal">
		<view class="masking" v-if="showMasking" :style="{ 'background-color': bgColor }"></view>
		<view class="model-wraper">
			<view class="modal-title" v-if="modalTitle !== ''">
				{{ modalTitle }}
			</view>
			<view class="modal-body">
				<view>
					<input v-model="inputValue" style="font-size: 30rpx;" class="uni-input" focus
						:placeholder="placeholder" :maxlength="maxlength" placeholder-style="font-size: 30rpx;" />
				</view>
			</view>
			<view>
				<view class="btn cancel" :style="{'color': cancelTextColor}" @click="handleCancel">{{ cancelText }}</view>
				<view class="btn confirm" :style="{'color': confirmTextColor}" @click="handleConfirm">{{ confirmText }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否显示蒙层
			showMasking: {
				type: Boolean,
				default: true
			},
			// 蒙层背景色
			bgColor: {
				type: String,
				default: 'rgba(0, 0, 0, .6)'
			},
			// 模态框标题
			modalTitle: {
				type: String,
				default: ''
			},
			// 取消按钮文字
			cancelText: {
				type: String,
				default: '取消'
			},
			// 确定按钮文字
			confirmText: {
				type: String,
				default: '确定'
			},
			// 取消按钮文字颜色
			cancelTextColor: {
				type: String,
				default: '#666'
			},
			// 确定按钮文字颜色
			confirmTextColor: {
				type: String,
				default: '#5999FF'
			},
			// 默认值
			inputDefaultValue: {
				type: String,
				default: ''
			},
			inputPlaceholder: {
				type: String,
				default: ''
			},
			maxlength: {
				type: Number,
				default: 20
			}
		},
		data() {
			return {
				isShowModal: false,
				inputValue: ''
			}
		},
		computed: {
			componentsLang () {
				return this.$t('components.zjPrompt')
			},
			placeholder() {
				let str = this.inputPlaceholder
				if (this.$util.strIsNotEmpty(str)) {
					str += ', '
				}
				if (this.maxlength !== -1) {
					str += this.componentsLang.maxlength.replace('${0}', this.maxlength)
				}
				return str
			}
		},
		methods: {
			showModal() {
				this.inputValue = this.inputDefaultValue
				this.isShowModal = true
			},
			handleCancel() {
				this.isShowModal = false
				this.$emit('onClickCancel', 'cancel')
			},
			handleConfirm() {
				this.isShowModal = false
				this.$emit('onClickConfirm', this.inputValue)
			}
		}
	}
</script>

<style scoped>
	.masking {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.model-wraper {
		width: 600rpx;
		background-color: #fff;
		border-radius: 16rpx;
		position: absolute;
		z-index: 1000;
		top: 50%;
		left: 50%;
		margin-top: -161rpx;
		margin-left: -300rpx;
	}

	.modal-title {
		height: 120rpx;
		line-height: 120rpx;
		padding-top: 20rpx;
		width: 100%;
		text-align: center;
		font-size: 42rpx;
		color: #333;
		font-weight: bold;
	}
	
	.modal-body view {
		background: #f1f1f1;
		border-radius: 10rpx;
		padding: 18rpx;
		margin: 20rpx 30rpx 36rpx;
	}

	.btn {
		width: 300rpx;
		height: 110rpx;
		text-align: center;
		line-height: 110rpx;
		font-size: 42rpx;
		float: left;
		border-top: 1rpx solid #eeeeee;
		font-weight: bold;
	}

	.btn.cancel {
		width: 299rpx;
		border-right: 1rpx solid #eeeeee;
	}
</style>
