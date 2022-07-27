<template>
	<view class="bank-item" :style="bankThem">
		<!-- #ifndef MP-WEIXIN -->
		<canvas v-if="showCanvas" class="bank-icon" :id="uuid" :canvas-id="uuid" />
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<canvas v-if="showCanvas" class="bank-icon" id="bankIcon" canvas-id="bankIcon" />
		<!-- #endif -->
		<template v-if="walletPage">
			<view class="bank-head-box">
				<image :src="image"></image>
				<view class="bank-msg">
					<view class="bank-msg-box">
						<view class="bank-msg-name">{{_bankName}}</view>
					</view>
					<view class="bank-msg-box">
						<view class="card-msg-type">{{cardType}}</view>
						<view class="card-msg-code">
							<text class="msg-omit">****</text>
							<text class="msg-omit">****</text>
							<text class="msg-omit">****</text>
							<text>{{endNumber}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="bank-watermark" :style="waterMark" /> -->
			<image class="bank-msg-watermark" :src="image"></image>
		</template>
		<template v-else>
			<view class="bank-head">
				<image :src="image"></image>
				<view class="bank-info">
					<text class="bank-name">{{_bankName}}</text>
					<text class="card-type">{{cardType}}</text>
					<view class="card-code">
						<text class="omit">****</text>
						<text class="omit">****</text>
						<text class="omit">****</text>
						<text>{{endNumber}}</text>
					</view>
				</view>
			</view>
			<!-- <view class="bank-watermark" :style="waterMark" /> -->
			<image class="bank-watermark" :src="image"></image>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'bankItem',
		props: {
			walletPage: {
				type: Boolean,
				default: false
			},
			bankCode: {
				type: String,
				required: true
			},
			bankName: {
				type: String
			},
			cardType: {
				type: String,
				default: '储蓄卡'
			},
			cardCode: {
				type: String,
				required: true
			}
		},
		computed: {
			waterMark() {
				return `background-image: url(${this.image});`
			},
			endNumber() {
				let length = this.cardCode.length;
				return this.cardCode.substr(length - 4, length);
			},
			_bankName() {
				return this.$const.BANK[this.bankCode]
			}
		},
		data() {
			// #ifndef MP-WEIXIN
			const buildUuid = () => {
				return 'bank_' + parseInt(Math.random() * 100000000);
			};
			// #endif
			return {
				bankThem: '',
				image: '',
				showCanvas: true,
			};
		},
		methods: {
			async buildItem() {
				this.image = `/static/images/bank/${this.bankCode}.png`;
				await this.getThemColor();
				this.showCanvas = false;
			},
			async getThemColor() {
				let bgSize = uni.upx2px(76);
				let iconSize = uni.upx2px(50);
				this.iconContext = uni.createCanvasContext(this.uuid, this);
				this.iconContext.width = bgSize;
				this.iconContext.height = bgSize;
				this.iconContext.fillStyle = '#FFFFFF';
				this.iconContext.beginPath();
				let bgRadio = bgSize / 2;
				this.iconContext.arc(bgRadio, bgRadio, bgRadio - 1, 0, 2 * Math.PI, 0, true);
				this.iconContext.closePath();
				this.iconContext.fill();
				let iconRadio = bgSize / 2 - iconSize / 2;
				this.iconContext.drawImage(this.image, iconRadio, iconRadio, iconSize, iconSize);
				await this.draw(this.iconContext);
				let imageData = await this.getImageData(iconRadio, iconSize);
				this.parsingImageData(imageData);
			},
			parsingImageData(imageData) {
				let statistics = {};
				for (let i = 0, length = imageData.length; i < length; i += 4) {
					let r = imageData[i];
					let g = imageData[i + 1];
					let b = imageData[i + 2];
					if ((r + g + b) < 400) {
						let rgb = [r, g, b];
						let key = rgb.join(', ');
						statistics[key] = statistics[key] == null ? 1 : statistics[key] + 1;
					}
				}
				let maxKey = '';
				Object.keys(statistics).forEach(key => {
					if (maxKey === '') {
						maxKey = key;
					} else {
						maxKey = statistics[maxKey] > statistics[key] ? maxKey : key;
					}
				});
				let beginColor = maxKey.split(', ').map((item, index) => {
					item = parseInt(item);
					if (index > 1) return item;
					let newColor = item + 50;
					return newColor > 255 ? 255 : newColor;
				}).join(', ');
				this.bankThem = `background-image: linear-gradient(45deg, rgba(${beginColor}, 1), rgba(${maxKey}, 1));`;
			},
			getImageData(radio, size) {
				return new Promise((resolve, reject) => {
					uni.canvasGetImageData({
							canvasId: this.uuid,
							x: radio,
							y: radio,
							width: size,
							height: size,
							success(res) {
								resolve(res.data);
							},
							fail(err) {
								console.log(err);
								reject();
							}
						},
						this
					);
				});
			},
			draw(context, reserve = false) {
				return new Promise((resolve) => {
					context.draw(reserve, () => {
						resolve();
					});
				});
			}
		},
		created() {
			this.$nextTick(() => {
				this.buildItem();
			});
		}
	};
</script>

<style>
	.omit {
		font-size: 42rpx;
		margin-right: 12rpx;
		color: #fff;
	}

	.card-code {
		margin-top: 15rpx;
		display: flex;
		justify-content: flex-end;
		color: #FFFFFF;
		font-size: 32rpx;
	}

	.flex-1 {
		flex: 1;
	}

	.card-type {
		font-size: 24rpx;
		color: #F1F1F1;
	}

	.bank-name {
		font-size: 32rpx;
		color: #FFFFFF;
	}

	.bank-info {
		display: flex;
		flex-direction: column;
		margin-left: 24rpx;
		margin-top: -6rpx;
	}

	.bank-head {
		display: flex;
		flex: 1;
		height: 160rpx;
	}

	.bank-head image {
		width: 76rpx;
		height: 76rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		overflow: hidden;
	}

	.bank-icon {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 76rpx;
		height: 76rpx;
	}

	.bank-watermark {
		position: absolute;
		right: -360rpx;
    top: 40rpx;
    width: 260rpx;
    height: 260rpx;
		background-repeat: no-repeat;
		filter: drop-shadow(-300rpx 0rpx 0rpx #fff);
		opacity: 0.2;
		background-size: cover;
	}

	.bank-item {
		position: relative;
		flex: 1;
		/* margin: 10rpx 0; */
		position: relative;
		border-radius: 16rpx;
		padding: 40rpx 24rpx;
		overflow: hidden;
	}

	.bank-item:after {
		content: "";
		display: block;
		background: inherit;
		filter: blur(10rpx);
		position: absolute;
		width: 100%;
		height: 100%;
		top: 10rpx;
		left: 10rpx;
		z-index: -1;
		opacity: 0.4;
		transform-origin: 0 0;
		border-radius: inherit;
		transform: scale(1, 1);
	}
</style>
<style lang="scss">
.bank-head-box{
	display: flex;
	flex: 1;
	align-items: center;
	height: 84rpx;
	color: #FFFFFF;
	image {
		width: 76rpx;
		height: 76rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		overflow: hidden;
	}
	.bank-msg{
		width: 80%;
		margin-left: 30rpx;
		.bank-msg-box{
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.bank-msg-name{
				width: 90%;
			}
			.card-msg-type{
				font-size: 22rpx;
			}
			.card-msg-code{
				.msg-omit{
					margin-right: 12rpx;
				}
			}
		}
	}
}
.bank-msg-watermark{
	position: absolute;
	right: -320rpx;
	top: 20rpx;
	width: 220rpx;
	height: 220rpx;
	background-repeat: no-repeat;
	filter: drop-shadow(-300rpx 0rpx 0rpx #fff);
	opacity: 0.2;
	background-size: cover;
}
</style>
