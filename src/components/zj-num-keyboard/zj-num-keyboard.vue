<template>
	<view class="box" @tap.stop="">
		<view class="keyboard" :class="pattern">
			<ul class="number">
				<li class="button" @tap="input(item)" v-for="item in keys" :key="item">{{item}}</li>
				<li class="button down" @tap="hide">
					<image class="delete_img" mode="aspectFit" src="/static/images/icon/icon-keyboard-resign.png"/>
				</li>
			</ul>
			<view class="action">
				<view class="delete" @tap="del">
					<image class="delete_img" mode="aspectFit" src="/static/images/icon/icon-keyboard-delete.png"/>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="ok" :style="(componentsLang.pay.column ? 'line-height: 1.1;' : 'line-height: 360rpx;') + (payDisable ? 'background-color: #999!important;' : (bgColor ? 'background-color: ' + bgColor + '!important' : ''))" @tap="done">
					<text :style="componentsLang.pay.column ? 'writing-mode: vertical-lr;writing-mode: tb-lr;' : ''">{{ componentsLang.pay.text }}</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="ok" :style="(componentsLang.pay.column ? 'line-height: 360rpx;' : 'line-height: 360rpx;') + (payDisable ? 'background-color: #999!important;' : (bgColor ? 'background-color: ' + bgColor + '!important' : ''))" @tap="done">
					<text :style="componentsLang.pay.column ? 'writing-mode: vertical-lr;writing-mode: tb-lr;' : ''">{{ componentsLang.pay.text }}</text>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
				pattern: 'slideup'
			}
		},
		props: {
			payDisable: {
				type: Boolean,
				default: true
			},
			bgColor: {
				type: String
			}
		},
		computed: {
			componentsLang () {
				return this.$t('components.zjNumKeyboard')
			}
		},
		methods: {
			show() {
				this.pattern = 'slideup';
			},
			hide() {
				this.pattern = 'slidedown';
				this.$emit('hide');
			},
			input(item) {
				this.$emit('input', item);
			},
			del() {
				this.$emit('delete');
			},
			done(){
				if (!this.payDisable) {
					this.$emit('pay')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		.keyboard {
			position: fixed;
			bottom: 0;
			height: 480rpx;
			width: 100%;
			border-top: 1px solid #eee;
			background: #fff;
			display: flex;
			flex-direction: row;
			z-index: 2;
			.number {
				display: flex;
				flex-wrap: wrap;
				width: 75%;
				list-style: none;
				padding: 0 0 0 1px;
				margin: 0;
				.button {
					margin: 0;
					padding: 0;
					width: 33.33333333%;
					height: 120rpx;
					text-align: center;
					line-height: 120rpx;
					font-size: 48rpx;
					position: relative;

					&:nth-child(3),
					&:nth-child(6),
					&:nth-child(9),
					&:nth-child(12) {
						border-right: none;
					}

					&:nth-child(10),
					&:nth-child(11),
					&:nth-child(12) {
						border-bottom: none;
					}
					&:nth-child(10) {
						font-size: 56rpx;
						font-weight: bold;
					}
					&:nth-child(12) {
						line-height: 0;
					}

					&:active {
						background: #eee;
					}
					&::before {
						border-bottom: 1px solid #eee;
						color: #eee;
						content: " ";
						position: absolute;
						left: 0;
						bottom: 0;
						right: 0;
						height: 1px;
						-webkit-transform-origin: 0 100%;
						transform-origin: 0 100%;
						-webkit-transform: scaleY(0.5);
						transform: scaleY(0.5);
					}
					&::after {
						border-right: 1px solid #eee;
						color: #eee;
						content: " ";
						position: absolute;
						right: 0;
						top: 0;
						width: 1px;
						bottom: 0;
						-webkit-transform-origin: 100% 0;
						transform-origin: 100% 0;
						-webkit-transform: scaleX(0.5);
						transform: scaleX(0.5);
					}
				}
			}
			.delete_img {
				line-height: 120rpx;
				height: 40rpx;
				position: relative;
				top: 40rpx;
				margin: auto;
			}
			.action {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.delete {
					height: 25%;
					width: 100%;
					position: relative;
					&:active {
						background: #eee;
					}
					&::before {
						border-bottom: 1px solid #eee;
						color: #eee;
						content: " ";
						position: absolute;
						left: 0;
						bottom: 0;
						right: 0;
						height: 1px;
						-webkit-transform-origin: 0 100%;
						transform-origin: 0 100%;
						-webkit-transform: scaleY(0.5);
						transform: scaleY(0.5);
					}
				}
				.ok {
					flex: 1;
					width: 100%;
					font-size: 40rpx;
					height: 360rpx;
					text-align: center;
					color: #fff;
					background-color: $zj-color-primary;
					text {
						height: 100%;
						letter-spacing: 4rpx;
					}
				}
			}
		}
	}

	/*动画*/
	@keyframes slidedown {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(100%);
		}
	}
	@keyframes slideup {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	.slidedown {
		animation: slidedown 0.2s linear;
		transform: translateY(100%);
	}
	.slideup {
		animation: slideup 0.2s linear;
		transform: translateY(0);
	}
</style>
