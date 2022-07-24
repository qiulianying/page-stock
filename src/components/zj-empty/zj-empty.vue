<template>
	<view :class="shortWindows ? 'empty-content short' : 'empty-content'">
		<image class="empty-content-image" :src="img" mode="widthFix"></image>
		<text class="empty-content-text">{{ text }}</text>
		<button v-if="$util.strIsNotEmpty(btnText)" class="empty-content-btn" @tap="handleClick">{{ btnText }}</button>
	</view>
</template>

<script>
	export default {
		props: {
			img: {
				type: String,
				default: '/static/images/empty.png'
			},
			text: {
				type: String,
				default: '暂无数据'
			},
			btnText: {
				type: String
			},
      shortWindows: {
        // 用于调整样式，是否需要padding
        type: Boolean,
        default: false
      }
		},
		methods: {
			handleClick () {
				this.$emit('btn-click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		// height: auto;
		height: 180rpx;

	}
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 150rpx 0;
		&-image {
			// width: 400rpx;
			width: 300rpx;
		}
		&-text {
			font-size: 24rpx;
			// font-size: 40rpx;
			font-weight: 400;
			color: #999999;
			line-height: 56rpx;
			// margin: 32rpx 0;
      margin: 24rpx 0;
			text-align: center;
		}
		&-btn {
			height: 100rpx;
			background: linear-gradient(90deg,rgba(253,152,120,1) 0%,rgba(251,95,67,1) 100%);
			border-radius: 50rpx;
			width: 100%;
			font-size: 30rpx;
			font-weight:400;
			color: #FFFFFF;
			line-height: 100rpx;
		}
	}
  .short{
    padding-bottom: 0 !important;
    padding-top: 80rpx;
  }
</style>
