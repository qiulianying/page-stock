<template>
	<view class="user-order-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">我的订单</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view v-for="(item, index) in navList" :key="index" @tap="tabSelect" :data-id="index" class="cu-item flex-sub" :class="index == tabCurrentIndex ? 'text-red cur' : ''">
					{{ item.text }}
				</view>
			</view>
		</scroll-view>	
		<swiper :current="tabCurrentIndex" class="user-order-box" :style="{
			height: `calc(100% - 90rpx - ${CustomBar}px)`
		}" duration="300" @change="changeTab">
			<swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<view v-for="(item, index) in tabItem.list" :key="index" class="order-item">
						<view class="i-top">
							<text class="time">{{ item.time }}</text>
							<text class="status" :style="{ color: item.status !== 9 ? '#e54d42' : '' }">{{ item.statusTip }}</text>
						</view>
						<scroll-view v-if="item.goodsList.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.goodsList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList"
						 :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title">{{ goodsItem.title }}</text>
								<text class="attr-box">{{ goodsItem.attr }} x {{ goodsItem.number }}</text>
								<text class="price">{{ goodsItem.price }}</text>
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{ item.goodsList.length }}</text>
							件商品 实付款
							<text class="price">200.00</text>
						</view>
						<view class="action-box" v-if="item.status !== 9">
							<button class="action-btn cu-btn round line-gray">取消订单</button>
							<button class="action-btn cu-btn round line-red">立即支付</button>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				tabCurrentIndex: 0,
				navList: [{
					text: '全部',
					list: [{
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}],
					}, {
						time: '2019-04-06 11:37',
						status: 9,
						statusTip: '订单已关闭',
						goodsList: [{
							title: '卡乐比水果麦片健康营养',
							price: 123.45,
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
							number: 1,
							attr: '进口水果麦片营养丰富'
						}]
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}]
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							title: '卡乐比水果麦片健康营养卡乐比水果麦片健康营养卡乐比水果麦片健康营养',
							price: 123.45,
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
							number: 1,
							attr: '进口水果麦片营养丰富'
						}]
					}]
				}, {
					status: 1,
					text: '待付款',
					list: [{
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}],
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}]
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							title: '卡乐比水果麦片健康营养',
							price: 123.45,
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
							number: 1,
							attr: '进口水果麦片营养丰富'
						}]
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}]
					}, {
						time: '2019-04-06 11:37',
						status: 1,
						statusTip: '待付款',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}]
					}]
				}, {
					status: 2,
					text: '待收货',
					list: [{
						time: '2019-04-06 11:37',
						status: 2,
						statusTip: '待收货',
						goodsList: [{
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}, {
							image: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						}]
					}]
				}]
			}
		},
		methods: {
			tabSelect (e) {
				this.tabCurrentIndex = e.currentTarget.dataset.id
			},
			changeTab (e) {
				this.tabCurrentIndex = e.target.current
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.user-order-page {
		height: 100%;
		padding-bottom: 100rpx;
		background-color: #F5F5F5;
		.user-order-box {
			overflow: hidden;
		}
		.list-scroll-content {
			height: 100%;
			display: block;
			position: relative;
		}
		.order-item {
			display: flex;
			flex-direction: column;
			padding-left: 30rpx;
			background: #FFFFFF;
			margin: 0 24rpx 20rpx;
			border-radius: 12rpx;
			&:first-child {
				margin-top: 30rpx;
			}
			&:last-child {
				margin-bottom: 30rpx;
			}
			.i-top {
				display: flex;
				align-items: center;
				height: 80rpx;
				padding-right: 30rpx;
				font-size: 28rpx;
				position: relative;
				border-bottom: 2rpx solid #EEEEEE;
				.time {
					flex: 1;
				}
				.status {
					color: #666666;
				}
				.del-btn {
					padding: 10rpx 0 10rpx 36rpx;
					font-size: 32rpx;
					color: #999999;
					position: relative;
					&:after {
						content: '';
						width: 0;
						height: 30rpx;
						border-left: 2rpx solid #CCCCCC;
						position: absolute;
						left: 20rpx;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		
			/* 多条商品 */
			.goods-box {
				height: 160rpx;
				padding: 20rpx 0;
				white-space: nowrap;
				.goods-item {
					width: 120rpx;
					height: 120rpx;
					display: inline-block;
					margin-right: 24rpx;
				}
				.goods-img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			/* 单条商品 */
			.goods-box-single {
				display: flex;
				padding: 20rpx 0;
				.goods-img {
					display: block;
					width: 120rpx;
					height: 120rpx;
				}
				.right {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding: 0 30rpx 0 24rpx;
					overflow: hidden;
					.title {
						font-size: 30rpx;
						color: #333333;
						line-height: 1;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: block;
					}
					.attr-box {
						font-size: 26rpx;
						color: #999999;
						padding: 10rpx 0;
					}
					.price {
						font-size: 30rpx;
						color: #333333;
						&:before {
							content: '￥';
							font-size: 24rpx;
							margin-right: 2rpx;
						}
					}
				}
			}
			.price-box {
				display: flex;
				justify-content: flex-end;
				align-items: baseline;
				padding: 20rpx 30rpx;
				font-size: 26rpx;
				color: #999999;
				.num {
					margin: 0 8rpx;
					color: #333333;
				}
				.price {
					font-size: 32rpx;
					color: #333333;
					&:before {
						content: '￥';
						font-size: 24rpx;
						margin: 0 2rpx 0 8rpx;
					}
				}
			}
			.action-box {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 100rpx;
				position: relative;
				padding-right: 30rpx;
				border-top: 2rpx solid #EEEEEE;
			}
			.action-btn {
				width: 160rpx;
				height: 60rpx;
				margin: 0;
				margin-left: 24rpx;
				padding: 0;
				text-align: center;
				line-height: 60rpx;
				font-size: 26rpx;
			}
		}
	}
</style>
