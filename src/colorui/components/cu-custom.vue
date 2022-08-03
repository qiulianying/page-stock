<template>
	<view>
		<!-- #ifdef H5 -->
		<view :class="isBgBlue ? 'cu-custom-blue' : 'cu-custom'"
			:style="[{height: CustomBar ? CustomBar + 'px' : ''}, {backgroundColor: isBgBlue ? themeColor : '#ffffff'}]">
			<!-- <view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]"> -->
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" style="font-size: 34rpx; font-weight: bold;" @tap="backPageH5" v-if="isBack">
					<text class="cuIcon-back" style="font-size: 38rpx; font-weight: normal;"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" style="font-size: 34rpx; font-weight: bold;" @tap="backPageH5" v-else>
					<slot name="backText"></slot>
				</view>
				<view class="content" style="font-size: 34rpx; font-weight: bold;" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<view class="input" style="font-size: 34rpx; font-weight: bold;" :style="[{top:StatusBar + 'px'}]">
					<slot name="input"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view :class="isBgBlue ? 'cu-custom-blue' : 'cu-custom'"
			:style="[{height: CustomBar ? CustomBar + 'px' : ''}, {backgroundColor: isBgBlue ? themeColor : ''}]">
			<!-- <view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]"> -->
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" style="font-size: 34rpx; font-weight: bold;" @tap="backPage" v-if="isBack">
					<text class="cuIcon-back" style="font-size: 38rpx; font-weight: normal;"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" style="font-size: 34rpx; font-weight: bold;" @tap="backPage" v-else>
					<slot name="backText"></slot>
				</view>
				<view class="content" style="font-size: 34rpx; font-weight: bold;" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<view class="input" style="font-size: 34rpx; font-weight: bold;" :style="[{top:StatusBar + 'px'}]">
					<slot name="input"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				themeColor: '#34A2E8'
			}
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = ''
				if (this.bgColor === 'bg-white' || !this.bgColor) {
					style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				} else {
					style = `height:${CustomBar}px;padding-top:${StatusBar}px;background-color:${this.themeColor};`;
				}

				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			backReload: {
				type: Boolean,
				default: false
			},
			goBack: {
				type: Boolean,
				default: true
			},
			url: {
				type: String,
				default: ''
			},
			isBgBlue: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			backPage() {
				if (this.goBack == true) {
					this.$util.toBack(1, this.backReload)
				} else {
					if (this.url) {
						uni.redirectTo({
							url: this.url
						})
					}
				}
			},
			backPageH5() {

				this.$util.toBack(1, this.backReload)

			}
		}
	}
</script>

<style>

</style>
