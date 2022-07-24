<template>
	<view class="zj-scroll-list" v-if="list.length > 0">
		<view class="cu-list menu">
			<view class="cu-item arrow zj-scroll-list-item">
				<view class="content zj-scroll-list-title">
					<text>{{ title }}</text>
				</view>
				<view class="action zj-scroll-list-more">
					<text class="text-grey text-sm">{{ moreTitle }}</text>
				</view>
			</view>
		</view>
		<scroll-view scroll-x class="zj-scroll-list-data">
			<view class="zj-scroll-list-data-item" v-for="item in list" :key="item.id" @tap="itemClick(item.id)">
				<image :src="item.pic" class="zj-scroll-list-data-item-img" mode="aspectFit"/>
				<view class="zj-scroll-list-data-item-title">{{ item.name }}</view>
				<view class="zj-scroll-list-data-item-price">
					<text>￥{{ item.sellPrice }}</text>
					<text class="zj-scroll-list-data-item-price-original" v-if="item.price > item.sellPrice">￥{{ item.price }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			title: {
				type: String,
				default: '商品列表'
			},
			moreTitle: {
				type: String,
				default: '更多'
			},
			list: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			itemClick(id) {
				this.$emit('item-click', id)
			}
		}
	}
</script>

<style lang="scss">
	.zj-scroll-list {
		margin: 16rpx 32rpx;
		border-radius: 10rpx;
		&-title {
			font-size: 34rpx;
			font-weight: 500;
			color: #161616;
		}
		&-item {
			padding: 0!important;
			&.arrow {
				padding-right: 40rpx!important;
				&:before {
					right: 0!important;
				}
			}
		}
		&-data {
			background-color: #FFFFFF;
			white-space: nowrap;
			&-item {
				display: inline-block;
				background-color: #FFFFFF;
				border-radius: 8rpx;
				border: 2rpx solid #F5F5F5;
				width: 280rpx;
				overflow: hidden;
				&:not(:last-child) {
					margin-right: 20rpx;
				}
				&-img {
					display: inline-block;
					width: 280rpx;
					height: 188rpx;
					border-top-left-radius: 12rpx;
					border-top-right-radius: 12rpx;
					border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
				}
				&-title {
					margin: 0 20rpx;
					white-space: normal;
					height: 42rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #282828;
					line-height: 42rpx;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-box-orient: vertical !important;
					-webkit-line-clamp: 1;
				}
				&-price {
					padding: 10rpx 20rpx;
					margin-bottom: 10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					font-weight: 500;
					color: #F43636;
					line-height: 1;
					&-original {
						text-decoration: line-through;
						font-size: 22rpx;
						font-weight: 400;
						color: #666666;
						flex: 1;
						text-align: right;
					}
				}
			}
		}
	}
</style>
