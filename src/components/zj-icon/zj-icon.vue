<template>
	<view :style="{'color': color, 'background': bgColor}"><slot></slot></view>
</template>

<script>
	/**
	 * Icon 文字图标
	 * @description 用于显示文字的图标
	 * @property {String} color 图标文字颜色
	 * @property {String} bgColor 图标背景颜色
	 * @example <zj-icon color="#FF0000" bg-color="#00FF00">惠</zj-icon>
	 */
	export default {
		props: {
			color: {
				type: String,
				default: '#FFFFFF'
			},
			bgColor: {
				type: String,
				default: '#FB5F43'
			}
		}
	}
</script>

<style scoped>
	view {
		width: 32rpx;
		height: 32rpx;
		font-size: 24rpx;
		line-height: 32rpx;
		border-radius: 2rpx;
		display: inline-block;
		text-align: center;
		margin-right: 8rpx;
		box-sizing: border-box;
	}
</style>
