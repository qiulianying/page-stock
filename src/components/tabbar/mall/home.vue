<template>
	<view style="padding-bottom: 100rpx;">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">在线商城</block>
		</cu-custom>
		
		<view class="cu-bar search mall-home-search-box">
			<view class="search-form round">
				<text class="cuIcon-search"/>
				<text>华为</text>
			</view>
			<view class="action">
				<text class="cuIcon-cart"></text>
			</view>
		</view>
		<view style="height: 100rpx;"></view>
		
		<swiper v-if="swiperList != null && swiperList.length > 0" class="mall-home-swiper" autoplay indicator-dots indicator-active-color='#ffffff'>
		  <swiper-item v-for="(item, index) in swiperList" :key="index" class="mall-home-swiper-item">
		    <image :src="item.thumb" class="mall-home-swiper-item-img" mode="aspectFill"/>
		  </swiper-item>
		</swiper>
		<zj-menu-list :list="typeList" @on-click="handleClickMenu"/>
		<zj-scroll-list title="限时秒杀" :list="seckillProductList"/>
		<zj-scroll-list title="人气热卖" :list="hotProductList"/>
		<view class="mall-home-product">
			<view v-for="(item, index) in productList" :key="index" class="mall-home-product-item" @tap="toGoodsDetailView(item.id)">
				<view class="m-img">
					<image style="width: 100%;height: 100%;" :src="item.pic" mode="aspectFit"></image>
				</view>
				<view class="m-text">
					<view class="m-title">{{item.name}}</view>
					<view class="m-descripe">{{item.desc}}</view>
					<view class="m-descripe">{{item.shop}}</view>
					<view class="m-spec">
						<view class="cu-tag radius">{{item.spec}}</view>
					</view>
					<view class="m-price-box">
						<view class="m-price">￥{{item.sellPrice}}</view>
						<view class="m-old-price" v-if="item.price > item.sellPrice">
							<text>￥{{item.price}}</text>
						</view>
					</view>
					<view class="m-number">
						<zj-number-box :value="item.number" :rowData="item" :color="themeColor"></zj-number-box>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [{
					thumb: '/static/images/temp/banner1.jpg'
				}, {
					thumb: '/static/images/temp/banner2.jpg'
				}],
				typeList: [],
				seckillProductList: [],
        themeColor: ''
			}
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
    },
		methods: {
			handleClickMenu(data) {
				this.toGoodListView(data.id)
			},
			toGoodListView(id) {
				this.$toView(`mall/goods-list?categoryId=${id}`)
			},
			toGoodsDetailView(id) {
				this.$toView(`mall/goods-detail?id=${id}`)
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.mall-home-search-box {
		position: fixed;
		width: 100%;
		z-index: 9999;
		background-color: #FFFFFF;
		padding-bottom: 10rpx;
	}
	.mall-home-swiper {
		width: 100%;
		height: 375rpx;
		&-item {
		  display: flex;
		  flex-direction: row;
		  justify-content: center;
		  align-items: center;
		  &-img {
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    height: 100%;
		    width: 100%;
		  }
		}
	}
	.mall-home-cover {
		margin: 32rpx;
		border-radius: 8rpx;
		display: flex;
		overflow: hidden;
		image {
			width: 100%;
		}
	}
	.mall-home-product {
		margin: 32rpx;
		&-item {
			display: flex;
			flex-direction: row;
			width: 100%;
			justify-content: space-between;
			align-items: flex-start;
			margin-top: 30rpx;
			margin-bottom: 30rpx;
			.m-img {
				flex: 0 0 170rpx;
				height: 170rpx;
				border: 2rpx solid #F5F5F5;
				border-radius: 8rpx;
				overflow: hidden;
			}
			.m-text {
				flex: 1;
				position: relative;
				padding-left: 20rpx;
				display: flex;
				align-content: space-between;
				flex-direction: column;
				.m-title {
					margin-bottom: 6rpx;
					font-size: 32rpx;
					color: #161616;
					height: 42rpx;
					font-weight: bold;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-box-orient: vertical !important;
					-webkit-line-clamp: 1;
				}
				.m-descripe {
					font-size: 24rpx;
					color:#555555;
					margin-top: 16rpx;
					height: 34rpx;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-box-orient: vertical !important;
					-webkit-line-clamp: 1;
				}
				.m-spec {
					margin: 16rpx 0;
					view {
						padding: 0 24rpx;
						height: 36rpx;
						line-height: 36rpx;
					}
				}
				.m-price-box {
					height: 48rpx;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					.m-price {
						position: relative;
						top: 4rpx;
						font-size: 28rpx;
						color:#ff582b;
					}
					.m-old-price {
						margin-left: 20rpx;
						display: flex;
						flex-direction: row;
						font-size: 22rpx;
						color:#999999;
						margin-top: 5rpx;
						text-decoration: line-through;
						font-weight: normal;
					}
				}
				.m-number {
					position: absolute;
					right: 0;
					bottom: -8rpx;
					z-index: 16;
					color:#b2b2b2;
					font-size: 20rpx;
					text-align: right;
				}
			}
		}
	}
</style>
