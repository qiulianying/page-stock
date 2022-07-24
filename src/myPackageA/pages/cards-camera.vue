<template>
	<!--拍照读取银行卡信息-->
	<view class="cover-img" :style="{height: windowHeight + 'px'}">
		<!--uni-app目前相机组件无法在h5使用-->
		<!--  #ifdef MP-WEIXIN  -->
		<camera v-if="showCarema" mode="normal" device-position="back" flash="auto"
				:style="{height: cameraHeight + 'px'}">
			<cover-view class="controls" style="width: 100%; height: 100%;"></cover-view>
		</camera>
		<!--  #endif  -->
		<!--模块背景图-->
		<view class="cover-image" v-show="showBackIg">
			<image class="icon-w569-h828"
				src="/static/images/idcard_scan/pic_bank_scan.png" />
		</view>
		<!--拍摄预览图-->
		<view v-if="src && !showCarema" :style="{height: cameraHeight + 'px'}">
			<image mode="widthFix" :src="src" style="width: 100%; height: 100%;"/>
		</view>
		<view class="bottom font-36-fff">
			<view class="wrap">
				<view class="back my-index" @tap="back">取消</view>
				<view @tap="takephoto" class="my-index" v-show="showCarema">
					<view class="icon-w131-h131">
						<view class="icon-w110-h110"></view>
					</view>
				</view>
				<view @tap="chooseImage" class="my-index" v-show="showCarema">相册</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { OCR_URL_CARD } from '../../common/config'
	export default {
		name: 'user-camera',
		components: {},
		props: {},
		data() {
			return {
				src: '',
				showBackIg: true,		//显示背景图
				cameraContext: {},
				windowHeight: 0,
				cameraHeight: 0,
				tempImagePath: '',
				showCarema: false		//是否显示拍照模块
			};
		},
		onLoad(option) {
			setTimeout(() => {
				this.showCarema = true
			}, 100)
			if (uni.createCameraContext) {
				this.cameraContext = uni.createCameraContext()
			} else {
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		},
		watch: {},
		computed: {},
		created() {
			let systemInfo = uni.getSystemInfoSync()
			this.windowHeight = systemInfo.windowHeight
			this.cameraHeight = systemInfo.windowHeight - 80

			console.log(this.cameraHeight)
		},
		mounted() {},
		beforeDestroy() {},
		methods: {
			//图片流解析接口
			toGetOcrCard(path) {
				//上传银行卡图片流接口
				let _this = this
				this.$upload(path, 'payment-jft', OCR_URL_CARD, 'image').then(response => {
					const obj = response.object || ""
					console.log(response)
					uni.setStorageSync('cardOcr', obj)		//设置路径
					let pages = getCurrentPages() //页面栈
					let prePage = pages[pages.length - 2] //上一页
					_this.showCarema = true
					_this.showBackIg = true
					_this.src = ''
					uni.navigateBack({
						success: function() {
							prePage.onLoad(); // 执行上一页的onLoad方法
						}
					})
					uni.hideLoading()
				}).catch(err => {
					_this.showCarema = true
					_this.showBackIg = true
					_this.src = ''
					console.error(err)
				})
			},
			// 拍照
			takephoto() {
				let _this = this
				uni.showLoading({
					title: '上传中，请稍候'
				})
				console.log(this.cameraContext)
				uni.createCameraContext().takePhoto({
					quality: 'normal',
					success: (res) => {
						_this.src = res.tempImagePath
						_this.showCarema = false
						_this.showBackIg = false
						_this.toGetOcrCard(res.tempImagePath)
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '拍照失败，请检查系统是否授权',
							icon: 'none',
							duration: 1200
						})
					},
				})
			},
			// 从相册选取
			chooseImage() {
				let _this = this
				uni.showLoading({
					title: '上传中，请稍候'
				})
				uni.chooseImage({
					count: 1,
					sizeType: 'compressed',
					sourceType: ['album'],
					success: (res) => {
						//调用对应接口
						_this.toGetOcrCard(res.tempFilePaths[0])
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '上传失败',
							icon: 'none',
							duration: 1200
						})
					}
				})
			},
			// 取消
			back() {
				uni.navigateBack()
			}
		}
	};
</script>
<style lang="scss" scoped>
	.icon-w569-h828 {
		// height: 569rpx !important;
		// width: 854rpx !important;
		width: 608rpx;
		height: 428rpx;
		// transform: rotateZ(450deg);
	}

	.cover-image {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -40%);
	}

	.controls {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bottom {
		width: 100%;
		background-color: #000;
		color: #fff;
		height: 80px;

		.wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			padding: 0 73rpx;

			.icon-w131-h131 {
				width: 131rpx;
				height: 131rpx;
				background: white;
				border-radius: 131rpx;
				/* line-height: 131rpx; */
				display: flex;
				align-items: center;
				justify-content: center;

				.icon-w110-h110 {
					width: 110rpx;
					height: 110rpx;
					border-radius: 110rpx;
					border: 6rpx solid #000;
				}
			}
		}
	}
</style>
