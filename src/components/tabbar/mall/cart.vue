<template>
	<view style="padding-bottom: 200rpx;background-color: #F5F5F5;">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">购物车</block>
		</cu-custom>
		<view class="mall-cart-list flex flex-direction">
			<view class="flex animation-reverse">
				<view class="flex-sub"></view>
				<view class="cu-tag round margin-lr" style="color: #F05353; background: #FEE3E3;">优惠券</view>
				<view style="color: 666666;">清空</view>
			</view>
			<checkbox-group @change="changeCartList">
				<view v-for="(item, index) in cartList" :key="index" class="mall-cart-item">
					<view>
						<checkbox style="transform:scale(0.8)" :value="item.id" :checked="item.checked" class="round red"></checkbox>
					</view>
					<view class="m-img">
						<image style="width: 100%;height: 100%;" :src="item.pic" mode="aspectFit"></image>
					</view>
					<view class="m-text">
						<view class="m-title">{{item.name}}</view>
						<view class="m-spec">
							<view class="cu-tag radius">{{item.spec}}</view>
						</view>
						<view class="m-price-box">
							<view class="m-price">￥{{item.sellPrice}}</view>
						</view>
						<view class="m-number">
							<zj-number-box :value="item.number" :rowData="item"  :color="themeColor"></zj-number-box>
						</view>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="mall-cart-split">
			<view></view>
			<text>猜你喜欢</text>
			<view></view>
		</view>
		<view class="mall-cart-lover-list cu-list grid col-2">
			<view v-for="item in loverList" :key="item.id" @tap="toGoodsDetailView(item.id)">
				<view class="mall-cart-lover-list-item">
					<image :src="item.pic" class="mall-cart-lover-list-item-img" mode="aspectFill"/>
					<view class="mall-cart-lover-list-item-title">{{ item.name }}</view>
					<view class="mall-cart-lover-list-item-price">
						<text>￥{{ item.sellPrice }}</text>
						<zj-number-box :value="item.number" :rowData="item"  :color="themeColor"></zj-number-box>
					</view>
				</view>
			</view>
		</view>
		<view class="mall-cart-bottom">
			<checkbox-group @change="changeAll">
				<label>
					<checkbox style="transform:scale(0.8)" :checked="allFlag.checked" :value="allFlag.value" class="round red"/> 全选
				</label>
			</checkbox-group>
			<text class="margin-left">合计：</text>
			<text class="flex-sub text-red">￥100.00</text>
			<button class="cu-btn" @tap="toOrderSubmitView">去结算(2)</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allFlag: {
					checked: false,
					value: 'all'
				},
				cartList: [{
					id: '111',
					pic: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
					name: '卡乐比水果麦片健康营养麦片',
					desc: '进口水果麦片营养丰富',
					shop: '软件园丞相店',
					spec: '500g/袋',
					sellPrice: '12.00',
					price: '20.00',
					number: 1
				}, {
					id: '222',
					pic: 'https://api.7wpp.com/uploads/20200929/80afcfb2714ffea3190d733188edb6e3.png',
					name: '卡乐比水果麦片健康营养麦片',
					desc: '进口水果麦片营养丰富',
					shop: '软件园丞相店',
					spec: '500g/袋',
					sellPrice: '12.00',
					price: '20.00',
					number: 2
				}, {
					id: '333',
					pic: 'https://api.7wpp.com/uploads/20200929/d983527b292e17305e94f6be3b2f757f.jpg',
					name: '卡乐比水果麦片健康营养麦片',
					desc: '进口水果麦片营养丰富',
					shop: '软件园丞相店',
					spec: '500g/袋',
					sellPrice: '12.00',
					price: '20.00',
					number: 1
				}],
				loverList: [{
					id: '444',
					pic: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
					name: '景颜堂燕窝肽胶原蛋白口服液',
					sellPrice: '12.00',
					price: '20.00'
				}, {
					id: '555',
					pic: 'https://api.7wpp.com/uploads/20200929/80afcfb2714ffea3190d733188edb6e3.png',
					name: '景颜堂燕窝肽胶原蛋白口服液',
					sellPrice: '12.00',
					price: '20.00'
				}, {
					id: '666',
					pic: 'https://api.7wpp.com/uploads/20200929/d983527b292e17305e94f6be3b2f757f.jpg',
					name: '景颜堂燕窝肽胶原蛋白口服液',
					sellPrice: '12.00',
					price: '20.00'
				}],
        themeColor:''
			}
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
    },
		methods: {
			changeCartList (e) {
				const values = e.detail.value
				for (let i = 0, listLength = this.cartList.length; i < listLength; i++) {
					const item = this.cartList[i]
					this.$set(item, 'checked', values.includes(item.id))
				}
				this.$set(this.allFlag, 'checked', this.cartList.every(item => item.checked))
			},
			changeAll (e) {
				const selected = e.detail.value.length > 0
				this.cartList.map(item => this.$set(item, 'checked', selected))
				this.$set(this.allFlag, 'checked', selected)
			},
			toOrderSubmitView() {
				this.$toView(`mall/order-submit`)
			},
			toGoodsDetailView(id) {
				this.$toView(`mall/goods-detail?id=${id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mall-cart-list {
		margin: 32rpx 24rpx 24rpx;
		padding: 32rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
	}
	.mall-cart-item {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		.m-img {
			flex: 0 0 170rpx;
			margin-left: 24rpx;
			height: 170rpx;
			border-radius: 8rpx;
			overflow: hidden;
		}
		.m-text {
			flex: 1;
			position: relative;
			padding-left: 24rpx;
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
					font-size: 30rpx;
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
	.mall-cart-split {
		margin: 48rpx 0 28rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text {
			color: #161616;
			font-weight: 500;
			font-size: 30rpx;
			padding: 0 24rpx;
		}
		view {
			width: 98rpx;
			height: 4rpx;
			border-radius: 3rpx;
			&:first-of-type {
				background: linear-gradient(90deg, rgba(98, 98, 98, 0) 0%, #333333 100%);
			}
			&:last-of-type {
				background: linear-gradient(90deg, #333333 0%, rgba(98, 98, 98, 0) 100%);
			}
		}
	}
	.cu-list.grid {
		background-color: transparent;
	}
	.mall-cart-lover-list {
		margin: 12rpx;
		>view {
			padding: 12rpx;
			display: flex;
		}
		&-item {
			display: inline-block;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			overflow: hidden;
			padding: 20rpx;
			&-img {
				display: inline-block;
				height: 300rpx;
				margin: 10rpx 0;
			}
			&-title {
				white-space: normal;
				height: 42rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #282828;
				line-height: 42rpx;
				display: -webkit-box !important;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-box-orient: vertical !important;
				-webkit-line-clamp: 1;
				text-align: left;
			}
			&-price {
				padding: 10rpx 0;
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
	.mall-cart-bottom {
		position: fixed;
		bottom: 130rpx;
		left: 0;
		right: 0;
		height: 100rpx;
		z-index: 1000;
		background: #FFFFFF;
		border-top: 1rpx solid #F5F5F5;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		button {
			background: linear-gradient(90deg, #E83E3E 0%, #CD1D1D 100%);
			border-radius: 50rpx;
			font-size: 30rpx;
			color: #FFFFFF;
		}
		checkbox {
			margin-right: 16rpx;
		}
		label {
			font-size: 26rpx;
			color: #666666;
		}
		text {
			font-size: 30rpx;
		}
	}
</style>
