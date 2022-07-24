<template>
	<view>
		<!-- 弹框 -->
		<view class="pop-box" v-if="showModal">
			<view class="pop-box-header header-blue">
				<view>您一共选择了{{ totalGoods }}件商品</view>
				<view @click="delAll">
					<u-icon name="trash" style="margin-right: 10rpx"></u-icon> 清空
				</view>
			</view>
			<scroll-view style="height:auto;max-height:580rpx;margin-top:70rpx" scroll-y enable-back-to-top>
				<view v-for="(categoryItem, key) in selectedGoods" :key="key" class="item">
					<!-- 单规格数据 -->
					<view class="item-box" v-if="!categoryItem.multilOptions">
						<view class="item-box-data">
							<image
								:src="(categoryItem.productUrlList && categoryItem.productUrlList[0]) ? spMatefileBaseURL + categoryItem.productUrlList[0] + fixStr : tempImage"
								class="pop-image"></image>
							<view class="pop-texts item-box-data-contain">
								<view class="pop-texts-name">{{ categoryItem.name }}</view>
								<view class="pop-texts-desc" style="max-height: 70rpx; overflow: auto;">
									规格：{{ categoryItem.unit }}</view>
								<view class="pop-texts-money">{{ "￥" + categoryItem.goodsPrice || 0}}</view>
								<!--点击数量获取组件-->
								<!-- 开启了库存管理，且没有开启负库存销售，不能超过库存数量 -->
								<zj-number-box v-if="merchantStock" :key="key" :value="categoryItem.count"
									v-show="categoryItem.count > 0" :rowData="categoryItem" :content="delContent"
									@change="getChangeInfo" :showModal="false" :color="themeColor"
									:max="categoryItem.stockRemain" style="position: absolute;top:86rpx;right: 40rpx">
								</zj-number-box>
								<!-- 开启了库存管理，开启了负库存销售，可以无限量购买 -->
								<!-- 未开启库存管理，可以无限量购买 -->
								<zj-number-box v-else :key="key" :value="categoryItem.count"
									v-show="categoryItem.count > 0" :rowData="categoryItem" :content="delContent"
									@change="getChangeInfo" :showModal="false" :color="themeColor"
									style="position: absolute;top:86rpx;right: 40rpx">
								</zj-number-box>
							</view>
						</view>
					</view>
					<!-- 多规格数据 -->
					<view class="item-box" v-else>
						<view v-for="(mul, mulIndex) in categoryItem.multilOptions" :key="mulIndex"
							class="item-box-data">
							<image
								:src="mul.goodsSpecs.pic ? spMatefileBaseURL + mul.goodsSpecs.pic + fixStr : tempImage"
								class="pop-image"></image>
							<view class="pop-texts item-box-data-contain">
								<view class="pop-texts-name">{{ categoryItem.name }}</view>
								<view class="pop-texts-desc">规格：{{ getCheckedDta(mul.goodsSpecs, mul.goodsAttributes) }}
								</view>
								<view class="pop-texts-money">{{ "￥" + mul.totalPrice || 0}}</view>
								<!-- 点击数量获取组件 如果店铺库存管理开启，且没有开启负库存，库存不是无限量的商品，有数量限制 -->
								<zj-number-box
									v-if="categoryItem.enableStorageManage === 1 && categoryItem.enableNegativeStorage === 0 && mul.goodsSpecs.isInfinite === 0"
									:value="mul.count" :rowData="categoryItem" :content="delContent" :multilOption="mul"
									@change="getChangeInfo" :showModal="false" :color="themeColor" :isInPopup="false"
									:max="mul.goodsSpecs.stockRemain"
									style="position: absolute;top:106rpx;right: 40rpx">
								</zj-number-box>
								<!-- 点击数量获取组件 否则，可以无限添加 -->
								<zj-number-box v-else :value="mul.count" :rowData="categoryItem" :content="delContent"
									:multilOption="mul" @change="getChangeInfo" :showModal="false" :color="themeColor"
									:isInPopup="false" style="position: absolute;top:106rpx;right: 40rpx">
								</zj-number-box>
							</view>
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
			<view class="settle-images-mask" v-if="distribution" @click="showModalHandler">
			</view>
			<view class="settle-images" v-if="distribution&&total">
				<view class="settle-images-icon">
					<u-badge type="error" :count="totalGoods" is-center></u-badge>
					<image :src=' total ? "../../static/images/cart_pre.png":"../../static/images/cart_nor.png"'>
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
			<!--form表单 发送模板消息 获取formId-->
			<form @submit="subGetFormId" report-submit="true">
				<button
					:class=" totalMoney || total || (!distribution && errorCode == '0' )? 'box-color-blue settle-box' :'box-color-black settle-box' "
					:style="[{background: totalMoney || total || (!distribution && errorCode == '0' ) ? themeColor : '#333333'}, {border: totalMoney || total || (!distribution && errorCode == '0' ) ? `${1}px solid ${themeColor}` : ``},
            {color: totalMoney || total || (!distribution && errorCode == '0' ) ? '#fff' : `#908c8b`}]" plain="true"
					form-type="submit">
					<text style="margin-left: 30%;font-size: 30rpx">去结算</text>
				</button>

			</form>
			<!--			<view
				:class=" total || (!distribution && errorCode == '0' )? 'box-color-blue settle-box' :'box-color-black settle-box' "
				@click="toOrder">
				<text style="margin-left: 30%">去结算</text>
			</view>
			<view v-if="!(total || (!distribution && errorCode == '0'))" class="blockbox"></view>-->
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @cancel="show = false"
			@confirm="delProducts" cancel-text="我再想想"></u-modal>
	</view>
</template>

<script>
	import tempImage from "../../static/images/default-shop.png";
	export default {
		name: "settle",
		props: {
			merchantStock: { // 是否开启了库存管理，且没有开启负库存销售，不能超过库存数量
				type: Boolean,
				default: true
			},
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
				default: function () {
					return {}
				}
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
			},
			errorCode: {
				type: String,
				default: ''
			},
			errorMsg: {
				type: String,
				default: ''
			},
			subtype: {
				type: String,
				default: 'good' //商品：good，药品：drug
			},
			finaltotal: {
				type: String,
				default: ''
			},
			settleShowMOdule: {
				type: Boolean,
				default: false
			},
			isDetailPage: {
				// 是否在详情页调用该组件
				type: Boolean,
				default: false
			},
			isShare: {
				// 是否是分享页
				type: Boolean,
				default: false
			},
			isSubmit: {
				// 是否是分享页
				type: Boolean,
				default: false
			},
			cardId: {
				// 支付类型是否存在cardId
				type: String,
				default: ''
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
							if (newVal[bx].multilOptions) {
								// 如果是多规格商品
								newVal[bx].multilOptions.forEach(val => {
									totalMoney = val.totalPrice * val.count + totalMoney
								})
							} else {
								totalMoney = newVal[bx].goodsPrice * newVal[bx].count + totalMoney
							}
						}
						this.totalGoods = totalGoodsNumber
						this.total = (totalMoney).toFixed(2) //总价
					}
				},
				immediate: true,
				deep: true
			},
			settleShowMOdule: {
				handler() {
					this.showModal = this.settleShowMOdule
				},
				immediate: true,
				deep: true
			},
			showModal: {
				handler() {
					this.$emit('changeShowModel', this.showModal)
				}
			}
		},
		onshow() {
			console.log('this.errorCode', this.errorCode);
		},
		mounted() {
			console.log(342423)
			console.log(this.merchantStock)
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		data() {
			return {
				formId: '',
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
				show: false,
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				themeColor: '#908c8b'
			};
		},
		methods: {
			//获取formId用于消息推送
			subGetFormId(e) {
				// #ifdef MP-WEIXIN
				if (!this.$isMemmber()) {
					uni.navigateTo({
						url: `/pages/login/login?fromurl=${encodeURIComponent(`/pages/shop/categories`)}&merchantNo=${this.merchantNo}`
					})
				} else {
					this.formId = e.detail.formId //注意：formId只有在真实环境下才会获取到
					console.log('消息推送formId：', e.detail.formId);
					this.toOrder()
				}
				// #endif

				// 非小程序的情况下
				// #ifndef MP-WEIXIN
				this.formId = e.detail.formId
				this.toOrder()
				// #endif
			},
			getChangeInfo(id, value) {
				console.log(value)
				//返回父类方法调用
				this.$emit("change", id, value) //返回当前id以及当前控制对象的详情
				this.$emit('settleChangeData', value)
			},
			toOrder() {
				this.$shopMall.updateIsCart(false)
				// if (this.toPayment) {
				// 	//直接调用支付接口进行支付
				// 	this.$emit('toPayment', this.formId)
				// } else {
				// if (this.total && this.total > 0) {
				if (this.subtype === 'good') {
					if (this.isDetailPage && !this.isShare) {
						console.log(1);
						// 如果是在商品详情页，则跳转需要把详情页给关闭
						uni.redirectTo({
							url: `/pages/shop/order-submit?merchantNo=${this.merchantNo}`,
						});

					} else if (this.isSubmit) {
						console.log(2);
						uni.navigateTo({
							url: `/myPackageA/pages/order/user-order-detail?merchantNo=${this.merchantNo}`,
						});
					} else {
						console.log(3);
						uni.navigateTo({
							url: `/pages/shop/order-submit?merchantNo=${this.merchantNo}`,
						});
						// uni.navigateTo({
						// 	url: `/myPackageA/pages/order/user-order-detail?merchantNo=${this.merchantNo}`,
						// });
					}

				} else {
					console.log(4);
					//跳转支付页面
					uni.navigateTo({
						url: `/pages/shopMall/order-submit?merchantNo=${this.merchantNo}`,
					});

				}
				// }
				// }
			},
			// 清空
			delAll() {
				this.show = true
			},
			delProducts() {
				this.$shopMall.clearAllSelectedGoods()
				this.showModal = false
				this.$emit('delShopAllProduct', true)
				// this.$emit('settleChangeData','')


			},
			// 属性、规格格式化
			getCheckedDta(specChecked, attributeChecked) {
				let string = specChecked.specification == undefined || specChecked.specification == '' ? '' : specChecked
					.specification
				attributeChecked.forEach((val, index) => {
					if (index == 0 && string == '') {
						string = val.value.value
					} else {
						string += `、${val.value.value}`
					}
				})
				return string
			},
			showModalHandler() {
				this.showModal = !this.showModal
				// this.$emit('changeShowModel', this.showModal)

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

		.blockbox {
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
			z-index: 999999;
		}

		.box-color-blue {
			// background: #34A2E8;
			color: #fff;
			z-index: 999;
			// border: 1px solid #34A2E8;
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
		z-index: 999;
		padding-bottom: 90rpx;

		.pop-box-header {
			position: fixed;
			border-radius: 20rpx 20rpx 0 0;
			color: #666666;
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
			background-color: #f9f9f9;
		}

		// .header-grey {
		// 	background-color: #8a8a8a;
		// }
		.item {

			.item-box {
				padding-left: 30rpx;

				&-data {
					display: flex;
					align-items: center;

					&-contain {
						flex: 1;
						min-height: 160rpx;

					}
				}
			}
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
				font-size: 28rpx;
				// font-weight: 600;
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
				max-height: 80rpx;
				overflow: auto;
				width: 490rpx;
				word-break: break-all;
			}

			.pop-texts-money {
				font-size: 26rpx;
				// font-weight: 600;
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
		z-index: 800;
	}
</style>