<template>
	<view class="zj-numbox" @tap.stop="">
		<!-- zjType = 'true'表示是简易版，只需要进行加减和加减的限制 -->
		<template v-if="zjType == 'true'">
			<view v-if="value > 0" class="out-box out-box-left" @tap.stop="calcEasy('minus')"></view>
			<view class="out-box" @tap.stop="calcEasy('plus')"></view>

			<view v-if="value > 0" class="zj-numbox__minus"
				:class="inputValue <= min || disabled ? 'zj-numbox__minus-disabled' : ''" :style="{
				'border-color': ($util.strIsNotEmpty(color) ? color : ''),
				color: ($util.strIsNotEmpty(color) ? color : '')
			}">
				<view class="zj-numbox--text" :class="{ 'zj-numbox--disabled': inputValue <= min || disabled }">
					<u-icon name="minus" :color="themeColor" size="20"></u-icon>
				</view>
			</view>
			<input v-if="value > 0" :disabled="true" @blur="_onBlur" class="zj-numbox__value" type="number"
				v-model="value" />
			<view class="zj-numbox__plus" :style="{
				'border-color': ($util.strIsNotEmpty(color) ? color : ''),
				background: ($util.strIsNotEmpty(color) ? color : '')
			}">
				<view class="zj-numbox--text" :class="{ 'zj-numbox--disabled': inputValue >= max || disabled }">
					<u-icon name="plus" color="#ffffff" size="20"></u-icon>
				</view>
			</view>
		</template>
		<template v-else>
			<view v-if="value > 0" class="out-box out-box-left" @tap.stop="_calcValue('minus')"></view>
			<view class="out-box" @tap.stop="_calcValue('plus')"></view>

			<view v-if="value > 0" class="zj-numbox__minus" :style="{
				'border-color': ($util.strIsNotEmpty(color) ? color : ''),
				color: ($util.strIsNotEmpty(color) ? color : '')
			}">
				<view class="zj-numbox--text" :class="{ 'zj-numbox--disabled': inputValue <= min || disabled }">
					<u-icon name="minus" :color="themeColor" size="20"></u-icon>
				</view>
			</view>
			<input v-if="value > 0" :disabled="true" @blur="_onBlur" class="zj-numbox__value" type="number"
				v-model="value" />
			<view class="zj-numbox__plus" :style="{
				'border-color': ($util.strIsNotEmpty(color) ? color : ''),
				background: ($util.strIsNotEmpty(color) ? color : '')
			}">
				<view class="zj-numbox--text" :class="{ 'zj-numbox--disabled': inputValue >= max || disabled }">
					<u-icon name="plus" color="#ffffff" size="20"></u-icon>
				</view>
			</view>
		</template>
		<!--弹窗-->
		<u-modal v-model="show" :showModal="true" :content="content" :show-cancel-button="true" @cancel="show = false"
			@confirm="confirmDel"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	export default {
		name: "zjNumberBox",
		props: {
			value: { //当前数量，默认为0
				type: [Number, String],
				default: 0
			},
			zjType: {
				type: String
			},
			min: { //限制最小值
				type: Number,
				default: 0
			},
			max: { //限制最大值
				type: Number,
				default: 100
			},
			step: { //增加数量
				type: Number,
				default: 1
			},
			disabled: { //是否禁用
				type: Boolean,
				default: false
			},
			color: {
				type: String
			},
			clickTime: {
				type: Number,
				default: 0
			},
			content: { //商品减少到0的时候弹出提示框内容
				type: String,
				default: '继续操作将删除，是否继续？'
			},
			showModal: { //商品减少到0的时候是否弹出提示框
				type: Boolean,
				default: true
			},
			rowData: { //受到该空间控制的对象，必传
				type: Object,
				default: () => ({})
			},
			productId: {
				type: String,
				default: '0'
			},
			merchantNo: { //门店号
				type: String,
				default: '0'
			},
			isInPopup: { //用于判断是否要popup规格弹窗页面，false: 不需要  true: 需要
				type: Boolean,
				default: false
			},
			multilOption: { // 当前被修改的多规格商品数据
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				themeColor: '',
				inputValue: 0,
				addStaus: true,
				show: false,
				isPopUpShow: false,
				selectedGoods: {},
				mulIndex: -1
			}
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			// inputValue(newVal, oldVal) {
			// 	if (+newVal !== +oldVal) {
			// 		//this.$emit("change", newVal,this.rowData);
			// 	}
			// 	/* if(+newVal > +oldVal){

			// 	} */
			// },
			rowData: {
				handler(val) {
					this.selectedGoods = JSON.parse(JSON.stringify(val))
				},
				deep: true,
				immediate: true
			}
		},
		created() {
			this.inputValue = +this.value
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			//减少数量
			_calcValue(type) {
				let that = this
				if (this.disabled) {
					return
				}
				const scale = this._getDecimalScale()
				let value = this.value * scale //这里切记使用外部传入的this.value为准，而不能使用this.inputValue
				let step = this.step * scale

				// 用于多规格商品计算初始总数记录
				let totalCountInit = this.selectedGoods.count ? this.selectedGoods.count : 0
				//  确保商品数据是存在的才可以进行数据操作
				if (this.selectedGoods.id) {
					if (type === "minus") {
						if (this.isInPopup && this.selectedGoods.isMultiSpec) {
							// 外部调用的计数组件且有规格 =》 点击减号，显示规格弹窗
							this.$emit('settleShow', true)
							return
						} else {
							if (value !== 1) {
								value -= step
								totalCountInit -= step
								if (value < this.min) {
									return
								}
								if (value > this.max) {
									value = this.max
								}
							} else {
								let index = -1
								if (this.selectedGoods.isMultiSpec) {
									index = this.selectedGoods.multilOptions.findIndex(mul => this.isObjectEqual(mul
										.goodsAttributes, this.multilOption.goodsAttributes) && this.isObjectEqual(
										mul.goodsSpecs, this.multilOption.goodsSpecs))
									this.mulIndex = index
								}
								if (this.showModal == false) {
									this.show = this.showModal
									value = 0
									totalCountInit -= step
									// 只有多规格商品才要
									if (this.selectedGoods.isMultiSpec) {
										if (index !== -1) {
											this.selectedGoods.multilOptions.splice(index, 1)
										}
									}
								} else {
									this.show = this.showModal
								}
							}
						}
					} else if (type === "plus") {
						if (this.isInPopup && this.selectedGoods.isMultiSpec) {
							// 外部调用的计数组件且有规格 =》 点击加号，显示加购商品详情
							this.isPopUpShow = true
							console.log('计数组件')
							console.log(this.selectedGoods)
							this.$emit('popupShow', true, this.selectedGoods)
							return
						} else {
							// 计数组件 =》 实现数量增加
							this.isPopUpShow = false
							if (that.clickTime > 0) {
								if (!this.addStaus) {
									return
								} else {
									this.addStaus = false
									setTimeout(() => {
										that.addStaus = true
									}, that.clickTime)
								}
							}
							value += step
							totalCountInit += step
							if (value > this.max) {
								this.$refs.uToast.show({
									title: '数量超过库存量，无法增加！',
									type: 'warning'
								})
								return
							}
							if (value < this.min) {
								value = this.min
							}
						}

					}
					this.inputValue = String(value / scale) //最终数量
					// 如果在购物车页面和加购商品详情页面操作商品数量
					if (!this.isInPopup && this.selectedGoods.isMultiSpec) {
						// 修改总数
						this.selectedGoods.count = parseFloat(totalCountInit) //写入数量
						// 找到该多规格商品,修改数量
						let index = this.selectedGoods.multilOptions.findIndex(mul => this.isObjectEqual(mul
							.goodsAttributes, this.multilOption.goodsAttributes) && this.isObjectEqual(mul
							.goodsSpecs, this.multilOption.goodsSpecs))
						if (index !== -1) {
							if (parseFloat(this.inputValue) !== 0) {
								this.selectedGoods.multilOptions[index].count = parseFloat(this.inputValue)
							}
						}
					} else {
						// 单规格商品
						this.selectedGoods.count = parseFloat(this.inputValue) //写入数量
					}
					this.$emit("change", this.selectedGoods.id, this.selectedGoods, this.merchantNo, this
						.isPopUpShow) //返回当前id以及当前控制对象的详情,isPopUpShow表示是否显示规格弹窗
				}
			},
			calcEasy(type) {
				if (type == 'minus') { // 减
					if (this.inputValue <= 1) {
						return
					}
					this.inputValue--
				} else {
					if (this.inputValue == this.max) {
						this.$refs.uToast.show({
							title: '数量超过库存量，无法增加！',
							type: 'warning'
						})
						return
					}
					this.inputValue++
				}
				console.log('this.value', this.inputValue, this.selectedGoods)
				this.$emit("change", this.inputValue)
				// this.$emit("change", this.selectedGoods.id, this.selectedGoods, this.merchantNo, this.isPopUpShow)
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length)
				}
				return scale
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					// this.inputValue = 0
					return
				}
				value = +value
				if (value > this.max) {
					value = this.max
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			},
			// 点击弹窗的确定
			confirmDel() {
				// 点击确定表示要删除该商品,需要将id传回父组件
				if (this.mulIndex !== -1) {
					// 多规格商品
					this.$emit('delProduct', this.merchantNo, this.productId, this.mulIndex, this.multilOption)
				} else {
					// 单规格商品
					this.$emit('delProduct', this.merchantNo, this.productId, -1)
				}
				this.inputValue = 0
			},
			// 判断两个对象是否相等
			isObjectEqual(a, b) {
				// 如果其中没有对象
				if (!this.isObject(a) || !this.isObject(b)) {
					//值类型
					return a === b
				}
				// 如果特意传的就是两个指向同一地址的对象
				if (a === b) {
					return true
				}
				// 两个都是对象或者数组，而且不相等
				// 拿到对象key
				let aKeys = Object.keys(a)
				let bKeys = Object.keys(b)
				// 先判断长度就可以过滤一些
				if (aKeys.length !== bKeys.length) {
					return false
				}
				// 以a为基准 和 b 一次递归比较
				for (let key in a) {
					// 递归比较当前每一项
					const res = this.isObjectEqual(a[key], b[key])
					// 如果碰到一个不一样的就返回 false
					if (!res) {
						// 跳出for循环
						return false
					}
				}
				// 否则全相等
				return true
			},
			// 判断是否是对象类型
			isObject(obj) {
				return typeof obj === 'object' && obj !== null
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 42rpx;

	$box-line-height: 44rpx;
	$box-width: 42rpx;

	.zj-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: $box-height;
		line-height: $box-height;
		width: 190rpx;
		justify-content: flex-end;
		align-items: center;
		position: relative;
	}

	.out-box {
		width: 90rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 0;
		// bottom: 0;
		z-index: 20;
	}

	.out-box-left {
		left: 0 !important;
	}

	.zj-numbox__value {
		width: 90rpx;
		height: $box-height;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: #222222;
		margin: 0 10rpx;
	}

	.zj-numbox--text {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.zj-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		border-radius: 50%;
		border: 1px solid $zj-color-primary;
		font-size: 36rpx;
		color: $zj-color-primary;
	}

	.zj-numbox__minus-disabled {
		border-color: $uni-text-color-disable !important;
	}

	.zj-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		background: $zj-color-primary;
		border-radius: 50%;
		border: 1px solid $zj-color-primary;
		font-size: 36rpx;
		color: #FFFFFF;
	}

	.zj-numbox--disabled {
		color: $uni-text-color-disable;
	}
</style>