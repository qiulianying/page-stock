<template>
	<view>
		<!-- 弹框 -->
		<view class="pop-box" v-if="showModal">
			<view class="pop-box-header header-blue">
				<view>您一共选择了{{ totalGoods }}件商品</view>
				<view @click="delAll"><u-icon name="trash" style="margin-right: 10rpx"></u-icon> 清空</view>
			</view>
			<scroll-view style="height:auto;max-height:580rpx;margin-top:70rpx" scroll-y enable-back-to-top>
				<view v-for="(categoryItem, key, index) in selectedGoods" :key="key">
					<view class="item-box">
						<image :src="tempImage" class="pop-image"></image>
						<view class="pop-texts">
							<view class="pop-texts-name">{{ categoryItem.name }}</view>
							<view class="pop-texts-desc">规格：{{ categoryItem.unit }}</view>
							<view class="pop-texts-money">{{ "￥" + categoryItem.goodsPrice || 0}}</view>
							<!--点击数量获取组件-->
							<zj-number-box :value="categoryItem.count" :rowData="categoryItem" :content="delContent"
								@change="getChangeInfo" :showModal="false" color="#34A2E8"
								style="position: absolute;top:110rpx;right: 40rpx">
							</zj-number-box>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--遮罩-->
		<view class="mask" v-if="showModal" @click="showModal = false"></view>
		<!--支付组件-->
		<view class="settle">
			<!-- 图片 -->
			<view class="settle-images-mask" v-if="distribution" @click="showModal = !showModal">
			</view>
			<view class="settle-images" v-if="distribution">

				<view class="settle-images-icon">
					<u-badge type="error" :count="totalGoods" is-center></u-badge>

					<image :src='total ? "../../static/images/cart_pre.png":"../../static/images/cart_nor.png"'>

					</image>
				</view>


			</view>

			<view class="settle-text" v-if="showTotal">
				<view style="font-weight: 600">
					<span>{{ isOrderSettlement ? "待支付" : "合计" }}：</span>
					<span v-if="totalMoney">￥{{ totalMoney }}</span>
					<span v-else>￥{{ total }}</span>
				</view>
			</view>
			<view class="settle-text" v-else>
				<view style="font-weight: 600" v-if="isOrderSettlement">请选择收货地址</view>
				<view style="font-weight: 600" v-else>
					<view style="font-weight: 600">{{ isOrderSettlement ? "待支付" : "合计" }}：￥{{ total }}</view>
					<view style="font-size: 24rpx">预计配送费{{ distribution }}元</view>
				</view>
			</view>
			<view :class=" total || !distribution ? 'box-color-blue settle-box' :'box-color-black settle-box' "
				@click="toOrder">
				<text style="margin-left: 30%">去结算</text>
			</view>
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @cancel="show = false"
			@confirm="delProducts" cancel-text="我再想想"></u-modal>
			<zj-empty v-if="cartList.length === 0"
			  :img="`${imgUrl}1639019849000/pic_search.png`" text="暂无商品" />
	</view>
</template>

<script>
	import tempImage from "../../static/images/default-shop.png";
	export default {
		name: "settle",
		props: {
			merchantNo: { //对应门店号，必传
				type: String,
				default: '',
			},
			// 配送费
			distribution: {
				type: Number,
				default: 0,
			},
			// 是否变成黑色的底
			showTotal: {
				type: Boolean,
				default: false,
			},
			// 是否是商品确认订单页面
			isOrderSettlement: {
				type: Boolean,
				default: false,
			},
			//选中的数组数据，这里使用object对象，默认空对象·
			selectedGoods: {
				type: Object,
				default: {}
			},
			//外部传入的需要支付的总额，如果有传入，以传入的为高优先
			totalMoney: {
				type: Number,
				default: null
			},
			//是否调用支付接口进行付钱
			toPayment: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			selectedGoods: {
				handler(newVal) {
					//空对象，无商品
					if (Object.keys(newVal).length === 0) {
						this.total = 0 //总价
						this.totalGoods = 0 //商品数量
					} else {
						let totalGoodsNumber = 0
						let totalMoney = 0
						for (let bx in newVal) {
							totalGoodsNumber = newVal[bx].count + totalGoodsNumber
							totalMoney = newVal[bx].goodsPrice * newVal[bx].count + totalMoney
						}
						this.totalGoods = totalGoodsNumber
						this.total = (totalMoney).toFixed(2) //总价
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				imgUrl: this.$imgUrl,
				tempImage: tempImage,
				showModal: false,
				totalGoods: 0,
				total: 0, //合计
				delContent: '继续操作将在购物车删除该商品！',
				popList: [{
						id: 1,
						name: "水果",
						img: "/static/images/icon/icon-mall-1.png",
						desc: "123",
					},
					{
						id: 1,
						name: "水果",
						img: "/static/images/icon/icon-mall-1.png",
						desc: "123",
					},
				],
				content: '是否确认删除所选择的商品？',
                show: false
			};
		},
		methods: {
			getChangeInfo(id, value) {
				//返回父类方法调用
				this.$emit("change", id, value) //返回当前id以及当前控制对象的详情
			},
			toOrder() {
				this.$shopMall.updateIsCart(false)
				if (this.toPayment) {
					//直接调用支付接口进行支付
					this.$emit('toPayment')
				} else {
					if (this.total && this.total > 0) {
						//跳转支付页面
						uni.redirectTo({
							url: `/pages/shopMall/order-submit?merchantNo=${this.merchantNo}`,
						});
					}
				}
			},
			// 清空
			delAll(){
				this.show = true
			},
			delProducts(){
				this.$shopMall.clearAllSelectedGoods()
				this.showModal = false
				this.$emit('delShopAllProduct', true)

			}
		},
	};
</script>

<style lang="scss" scoped>
	.settle {
		display: flex;
		position: fixed;
		bottom: 30rpx;
		background: #333333;
		border-radius: 50rpx 0 0 50rpx;
		left: 30rpx;
		right: 25%;
		min-height: 100rpx;
		z-index: 9999;
		align-items: center;
		justify-items: center;

		.settle-images-mask {
			width: 475rpx;
			height: 100rpx;
			position: absolute;
			z-index: 9999;
		}

		.settle-images {
			width: 100rpx;
			height: 100rpx;
			// border: 2px solid #34A2E8;

			.settle-images-icon {
				position: relative;
				width: 120rpx;
				height: 120rpx;
				padding-left: -100rpx;
				left: -8rpx;

				image {
					width: 120rpx;
					height: 120rpx;
					top: -10rpx;
				}
			}

		}

		.settle-text {
			color: #ffffff;
			margin-left: 40rpx;
			z-index: 999;
		}

		.settle-box {
			display: flex;
			position: fixed;
			width: 30%;
			bottom: 30rpx;
			color: #fff;
			border-radius: 0 50rpx 50rpx 0;
			right: 20rpx;
			min-height: 100rpx;
			align-items: center;
			justify-items: center;
			z-index: 99999;
		}

		.box-color-blue {
			background: #34A2E8;
			color: #fff;
			z-index: 999;
      border: 1px solid #34A2E8;
		}

		.box-color-black {
			background: #333333;
			color: #908c8b;
			z-index: 999;
		}
	}

	.pop-box {
		position: fixed;
		box-sizing: border-box;
		width: 700rpx;
		min-height: 150rpx;
		border-radius: 20rpx 20rpx 0 0;
		left: 30rpx;
		bottom: 70rpx;
		background-color: #fff;
		z-index: 9999;
		padding-bottom: 90rpx;

		.pop-box-header {
			position: fixed;
			border-radius: 20rpx 20rpx 0 0;
			color: #fff;
			// background-color: #34A2E8;
			width: inherit;
			height: 70rpx;
			line-height: 70rpx;
			// text-align: center;
			z-index: 9999;
		    display: flex;
			justify-content: space-between;
			padding: 0 40rpx;
		}

		.header-blue {
			background-color: #34A2E8;
		}

		// .header-grey {
		// 	background-color: #8a8a8a;
		// }

		.item-box {
			padding-left: 30rpx;
		}

		.pop-image {
			float: left;
			width: 140rpx;
			height: 140rpx;
			margin-right: 30rpx;
			margin-top: 5rpx;
		}

		.pop-texts {
			position: relative;
			margin-top: 40rpx;

			.pop-texts-name {
				width: 430rpx;
				font-size: 32rpx;
				font-weight: 600;
				margin-top: -20rpx;
				margin-bottom: 8rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.pop-texts-desc {
				font-size: 26rpx;
				color: grey;
				margin-bottom: 8rpx;
			}

			.pop-texts-money {
				font-size: 30rpx;
				font-weight: 600;
				color: rgb(236, 34, 34);
				margin-bottom: 8rpx;
			}

		}
	}

	.mask {
		background-color: #000;
		opacity: 0.3;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
	}
</style>
