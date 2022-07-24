<template>
	<uni-popup ref="popup" type="bottom" class="zj-popup" :mask-click="allowClose && maskClick" @change="change">
		<view class="con">
			<view class="header" v-if="showHeader">
				<view v-if="allowClose" class="side" @click="close">
					<text class="cuIcon-close"></text>
				</view>
				<text class="title">{{ title }}</text>
				<view v-if="allowClose" class="side hidden"></view>
			</view>
			<slot name="sub-header"></slot>
			<scroll-view scroll-y :style="{ height }" @scroll="onScroll">
				<view>
					<slot></slot>
				</view>
			</scroll-view>
			<slot name="bottom"></slot>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			// 弹窗内容高度
			height: {
				type: String,
				default: '45vh',
			},
			// 显示标题栏
			showHeader: {
				type: Boolean,
				default: true,
			},
			// 点击蒙版是否关闭
			maskClick: {
				type: Boolean,
				default: true
			},
			// 是否允许关闭
			allowClose: {
				type: Boolean,
				default: true
			},
			// 弹窗标题
			title: String
		},
		data() {
			return {
				scrollTop: 0
			}
		},
		methods: {
			onScroll(e) {
				this.scrollTop = e.detail.scrollTop
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			change(value) {
				this.$emit('change', value)
			}
		}
	}
</script>

<style lang="scss">
	.zj-popup {
		.con {
			background: #fff;
			border-radius: 40rpx 40rpx 0 0;
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			padding: 20rpx 36rpx;
			border-bottom: 2rpx solid #F4F5F7;
		}

		.title {
			font-size: 34rpx;
			font-weight: bold;
			color: #161616;
		}

		.hidden {
			visibility: hidden;
		}

		.side {
			min-width: 60rpx;
			font-size: 42rpx;
			color: #666;
		}

		.h-scroll {
			height: 100vh;
			// #ifdef H5
			margin-top: 44rpx;
			height: calc(100vh - 44rpx);
			// #endif
		}
	}
</style>
