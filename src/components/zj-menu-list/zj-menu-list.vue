<template>
	<view class="zj-menu-list-box" v-if="scrollPage > 0">
		<scroll-view class="zj-menu-list" scroll-x @scroll="navScroll">
			<view class="zj-menu-list-item" v-for="(pageItem, page) in scrollPage" :key="page">
				<view class="cu-list grid col-5 no-border">
					<block v-for="(item, index) in list.slice(page * 10, (page + 1) * 10)" :key="index">
						<view class="cu-item" @tap="handleClick(page, index)">
							<view class="grid-icon">
								<image class="icon" :src="item.img" mode="widthFix"/>
							</view>
							<view class="cu-tag badge z" :style="{'background-color': item.color}" v-if="item.badge">{{item.badge}}</view>
							<text class="text-black">{{item.name}}</text>
						</view>
					</block>
				</view>
			</view>
		</scroll-view>
		<view v-if="scrollPage > 1" class="zj-menu-list-scroll-h-view" :style="{width: `${scrollPage * dotPageWidth}rpx`}">
			<view class="box">
				<view class="bg-theme dot" :style="{left: `${scrollDot}rpx`, width: `${dotPageWidth}rpx`, background: themeColor}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'grid-menu-list',
		data() {
			return {
				scrollPage: 0,
				scrollDot: 0,
				dotPageWidth: 32,
        themeColor: ''
			}
		},
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		created() {
			this.getScrollPageNum()
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
    },
		methods: {
			getScrollPageNum() {
				this.scrollPage =  (this.list == null || this.list.length === 0) ? 0 : (parseInt((this.list.length - 1) / 10) + 1)
			},
			navScroll(e) {
				let pageWidth = this.scrollPage * this.dotPageWidth
				let width = e.detail.scrollWidth / pageWidth
				this.scrollDot = e.detail.scrollLeft / width
			},
			handleClick(page, index) {
				this.$emit('on-click', this.list[page * 10 + index])
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zj-menu-list-box {
		position: relative;
		margin: 36rpx 12rpx 0;
		.zj-menu-list {
			position: relative;
			white-space: nowrap;
			width: 100%;
			&-item {
				display: inline-block;
				width: 100%;
				.cu-list.grid {
					background-color: inherit;
					.grid-icon {
						.icon {
							width: 100rpx;
							height: 100rpx;
						}
					}
				}
				.cu-list.grid.no-border {
					padding: 0;
				}
				.cu-list.grid.no-border>.cu-item {
					padding-top: 20rpx;
					padding-bottom: 16rpx;
				}
				.cu-list.grid>.cu-item text {
					color: #333333;
					margin-top: 4rpx;
				}
				.cu-list.grid>.cu-item .cu-tag {
					transform: scale(0.8);
					margin-left: 0;
					left: auto;
				}
				.cu-tag.z {
					border-radius: 200rpx 200rpx 200rpx 0;
					top: 0;
					right: -10rpx;
					padding: 19rpx 18rpx 19rpx 16rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					border: 1rpx solid #FFFFFF;
				}
			}
		}
		.zj-menu-list-scroll-h-view {
			height: 10rpx;
			margin: 20rpx auto 0;
			.box {
				position: relative;
				background: #d0cfcf;
				border-radius: 40rpx;
				width: 100%;
				height: 100%;
				.dot {
					position: absolute;
					height: 100%;
					border-radius: 40rpx;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
				}
			}
		}
	}
</style>