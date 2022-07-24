<template>
	<view :class="isEdit ? 'pb200': 'pb100'" style="background-color: #F5F5F5;">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">购物车</block>
		</cu-custom>
		<view class="mall-cart-list flex flex-direction">
			<view class="mall-cart-list-top">
				<view class="mall-cart-list-top-num">
					共 {{ cartNum }} 件商品
				</view>
				<view class="mall-cart-list-top-edit" @click="editClick">
					<view>
						<u-icon v-if="!isEdit" name="list" class="icon"></u-icon>
						<u-icon v-else name="checkmark" class="icon"></u-icon>
					</view>
					<view>
						<span v-if="!isEdit">编辑</span>
						<span v-else>完成</span>

					</view>
				</view>
			</view>
		</view>
		<checkbox-group @change="changeCartList">
			<view class="mall-cart" v-for="(shop, shopIndex) in cartList" :key="shopIndex">
				<!-- 店铺名字 -->
				<view class="mall-cart-top">
					<view :class="shop.checked ? 'mall-cart-top-icon icon-bg-blue' : 'mall-cart-top-icon'"
						@click="changeAll(shopIndex)" v-if="isEdit">
						<u-icon v-if="shop.checked" name="checkmark" color="white" size="28"></u-icon>
					</view>
					<view class="mall-cart-top-shop">
						{{ shop.shopName }}
					</view>
				</view>
				<!-- 商品 -->
				<view v-for="(item, index) in shop.products" :key="index" class="mall-cart-item">
					<view>
						<checkbox v-if="isEdit" style="transform:scale(0.8)" :value="item.id" :checked="item.checked"
							class="round blue"></checkbox>
					</view>
					<view class="m-img">
						<image style="width: 100%;height: 100%;" :src="item.pic" mode="aspectFit"></image>
					</view>
					<view class="m-text">
						<view class="m-text-left">
							<view class="m-title">{{item.name}}</view>
							<view class="m-spec">
							<span>规格：</span>{{item.spec}}
							</view>
							<view class="m-price-box">
								<view class="m-price">￥{{item.sellPrice}}</view>
							</view>
						</view>
						<view class="m-number">
							<zj-number-box :value="item.number" :rowData="item" :color="themeColor" :content="delContent"
								:productId="item.id" @delProduct="delProduct" @change="changeNum"></zj-number-box>
						</view>
					</view>
				</view>
				<!-- 合计 -->
				<view class="mall-cart-total">
					<view class="mall-cart-total-value">
						合计 <span class="value_title">￥{{ shop.shopPriceSum}}</span>
					</view>
					<view class="mall-cart-total-btn">
						<u-button type="primary" shape="circle" @click="toOrder(shop)">去结算</u-button>
					</view>
				</view>
			</view>
		</checkbox-group>
		<view class="mall-cart-bottom" v-if="isEdit">
			<checkbox-group @change="checkedAll">
				<label>
					<checkbox style="transform:scale(0.8)" :checked="allFlag.checked" :value="allFlag.value"
						class="round blue" /> 全选
				</label>
			</checkbox-group>
			<view class="">
				<u-button type="primary" shape="circle" @click="delClick">删除药品</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @cancel="show = false"
			@confirm="delProducts" cancel-text="我再想想"></u-modal>
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
					id: 123456,
					shopName: '好厉害的店名0',
					shopPriceSum: '24.00',
					products: [{
						id: '111',
						pic: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
						name: '卡乐比水果麦片健康营养麦片',
						desc: '进口水果麦片营养丰富',
						shop: '软件园丞相店',
						spec: '500g/袋',
						sellPrice: '12.00',
						price: '20.00',
						number: 1000
					}, {
						id: '222',
						pic: 'https://api.7wpp.com/uploads/20200929/80afcfb2714ffea3190d733188edb6e3.png',
						name: '卡乐比水果麦片健康营养麦片卡乐比水果麦片健康营养麦片卡乐比水果麦片健康营养麦片',
						desc: '进口水果麦片营养丰富',
						shop: '软件园丞相店',
						spec: '500g/袋',
						sellPrice: '12.00',
						price: '20.00',
						number: 1
					}]
				}, {
					id: 456789,
					shopName: '好厉害的店名1',
					shopPriceSum: '12.00',
					products: [{
						id: '333',
						pic: 'https://api.7wpp.com/uploads/20200929/d983527b292e17305e94f6be3b2f757f.jpg',
						name: '卡乐比水果麦片健康营养麦片',
						desc: '进口水果麦片营养丰富',
						shop: '软件园丞相店',
						spec: '500g/袋',
						sellPrice: '12.45',
						price: '20.00',
						number: 1
					}]

				}, ],
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
				cartNum: 0,
				delContent: '继续操作将在购物车删除该商品！',
				isEdit: false,
				show: false,
				content: '是否确认删除所选择的商品？',
        themeColor: ''
			}
		},
		watch: {
			cartList: {
				handler(val) {
					let sum = 0
					// 计算购物车总数
					val.forEach(cart => {
						cart.products.forEach(val => {
							sum = val.number + sum
						})
					})
					this.cartNum = sum
					// 重新计算总价
					this.getSumValue()
				},
				deep: true,
				immediate: true
			}
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

    },
		methods: {
			// 选择单个商品
			changeCartList(e) {
				const values = e.detail.value
				for (let i = 0, listLength = this.cartList.length; i < listLength; i++) {
					const item = this.cartList[i]
					item.products.forEach(val => {
						this.$set(val, 'checked', values.includes(val.id))
					})
					this.$set(item, 'checked', item.products.every(i => i.checked))
				}
				// 是否勾选底部全选
				let arr = this.cartList.filter(val => !val.checked)
				if (arr.length !== 0) {
					this.allFlag.checked = false
				} else {
					this.allFlag.checked = true
				}

			},
			// 点击店铺名左边的选择,选中店铺所有商品
			changeAll(index) {
				// const selected = e.detail.value.length > 0
				this.cartList[index].checked = !this.cartList[index].checked
				this.cartList[index].products.forEach(val => {
					val.checked = this.cartList[index].checked
				})
				// 是否勾选底部全选
				let arr = this.cartList.filter(val => !val.checked)
				console.log(arr)
				if (arr.length !== 0) {
					this.allFlag.checked = false
				} else {
					this.allFlag.checked = true
				}
			},
			// 编辑商品时全选
			checkedAll() {
				this.allFlag.checked = !this.allFlag.checked
				this.cartList.forEach(cart => {
					cart.products.forEach(val => {
						val.checked = this.allFlag.checked
					})
					cart.checked = this.allFlag.checked
				})

			},
			toOrderSubmitView() {
				this.$toView(`mall/order-submit`)
			},
			toGoodsDetailView(id) {
				this.$toView(`mall/goods-detail?id=${id}`)
			},
			// 计数器商品个数剩下1,用户要求删除，子组件返回id
			delProduct(id) {
			},
			delProducts() {
				let delArr = []
				this.cartList.forEach(cart => {
					cart.products.forEach(val => {
						if (val.checked) {
							delArr.push(val.id)
						}
					})
				})

			},
			// 改变计数器的值
			changeNum(val, id) {
				this.cartList.forEach(cart => {
					let index = cart.products.findIndex(pro => pro.id === id)
					if (index !== -1) {
						cart.products[index].number = parseFloat(val)
						return
					}
				})
			},
			// 计算总价
			getSumValue() {
				this.cartList.forEach((cart, index) => {
					let valueSum = 0
					if (this.cartList[index].shopName === cart.shopName) {
						cart.products.forEach(val => {
							valueSum = ((parseFloat(val.sellPrice) * parseFloat(val.number)) + valueSum)

						})
						cart.shopPriceSum = valueSum.toFixed(2)
					}
				})
			},
			// 点击编辑
			editClick() {
				this.isEdit = !this.isEdit
				this.cartList.forEach(val => {
					this.$set(val, 'checked', false)
				})
			},
			delClick() {
				let delArr = []
				this.cartList.forEach(cart => {
					cart.products.forEach(val => {
						if (val.checked) {
							delArr.push(val.id)
						}
					})
				})
				if (delArr.length !== 0) {
					this.show = true
				} else {
					this.$refs.uToast.show({
						title: '未选择药品！',
						type: 'warning'
					})
				}

			},
			toOrder(shop){
				let shopData = JSON.stringify(shop)
				uni.navigateTo({
					url: `/pages/shopMall/order-submit?shopData=${encodeURIComponent(shopData)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pb100{
		padding-bottom: 100rpx;
	}
	.pb200{
		padding-bottom: 200rpx;
	}
	.mall-cart-list {
		// margin: 32rpx 24rpx 24rpx;
		// padding: 32rpx;
		background: #F8F8F8;
		border-radius: 16rpx;

		.mall-cart-list-top {
			display: flex;
			justify-content: space-between;
			color: #808080;
			font-size: 28rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: 0 50rpx;

			.mall-cart-list-top-edit {
				display: flex;
				align-items: center;

				.icon {
					font-size: 30rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.mall-cart {
		background-color: white;
		padding: 20rpx 20rpx;
		margin: 0 20rpx 30rpx 20rpx;
		border-radius: 10rpx;

		.mall-cart-top {
			display: flex;

			.mall-cart-top-icon {
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				// background-color: #2979FF;
				text-align: center;
				line-height: 40rpx;
				border: 1px solid #c7c7c7;
			}

			.icon-bg-blue {
				background-color: #2979FF;
				border: 1px solid #2979FF;
			}

			.mall-cart-top-shop {
				font-size: 32rpx;
				font-weight: 600;
				margin: 0 20rpx;
				height: 42rpx;
				display: -webkit-box !important;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-box-orient: vertical !important;
				-webkit-line-clamp: 1;
			}
		}

		.mall-cart-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 15rpx 20rpx 50rpx 20rpx;

			.m-img {
				flex: 0 0 170rpx;
				margin-left: 24rpx;
				height: 170rpx;
				border-radius: 8rpx;
				overflow: hidden;
			}

			.m-text {
				flex: 1;
				// position: relative;
				padding-left: 24rpx;
				display: flex;
				align-items: center;

				.m-text-left {
					flex: 1;

					.m-title {
						margin-bottom: 6rpx;
						font-size: 28rpx;
						color: #161616;
						// height: 42rpx;
						font-weight: bold;
						display: -webkit-box !important;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						white-space: wrap;
					}

					.m-descripe {
						font-size: 24rpx;
						color: #555555;
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
						height: 36rpx;
						line-height: 36rpx;
						font-size: 24rpx;
						color: #acacac;
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
							color: #ff582b;
						}

						.m-old-price {
							margin-left: 20rpx;
							display: flex;
							flex-direction: row;
							font-size: 22rpx;
							color: #999999;
							margin-top: 5rpx;
							text-decoration: line-through;
							font-weight: normal;
						}
					}
				}

				.m-number {
					// position: absolute;
					width: 160rpx;
					// right: 0;
					// bottom: -8rpx;
					// z-index: 16;
					color: #b2b2b2;
					font-size: 20rpx;
					// text-align: right;
				}
			}
		}

		.mall-cart-total {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			border-top: 2rpx solid #e8e8e8;

			.mall-cart-total-value {
				width: 300rpx;
				color: #999999;

				.value_title {
					font-size: 34rpx;
					color: #ff582b;
					font-weight: bold;
					margin-left: 10rpx;
				}
			}

			.mall-cart-total-btn {
				width: 150rpx;
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
		justify-content: space-between;

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
