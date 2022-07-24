<template>
	<view class="cover-img" :style="{height: windowHeight + 'px'}">
		<!--uni-app目前相机组件无法在h5使用-->
		<!--  #ifdef MP-WEIXIN  -->
		<camera v-if="showCarema" mode="normal" device-position="back" flash="auto" :style="{height: cameraHeight + 'px'}">
			<cover-view class="controls" style="width: 100%; height: 100%;">
				<!-- 头像面 -->
				<!-- <cover-image v-if="direction === 'front'" class="icon-w569-h828"
					src="../../static/images/idcard_scan/pic_idcard_front.png">
				</cover-image> -->
				<!-- 国徽面 -->
				<!-- <cover-image v-else-if="direction === 'back'" class="icon-w569-h828"
					src="../../static/images/idcard_scan/pic_idcard_back.png">
				</cover-image> -->

			</cover-view>
		</camera>
		<!--  #endif  -->
    <view class="cover-image">
      <image v-if="direction === 'front'" class="icon-w569-h828" src="../../static/images/idcard_scan/pic_idcard_front.png"/>
      <image v-else-if="direction === 'back'" class="icon-w569-h828" src="../../static/images/idcard_scan/pic_idcard_back.png"/>
    </view>
		<view  v-if="showCarema" class="bottom font-36-fff">
			<view class="wrap">
				<view class="back" @click="back">取消</view>
				<view @click="takephoto">
					<view class="icon-w131-h131">
						<view class="icon-w110-h110"></view>
					</view>
				</view>
				<view @click="chooseImage">相册</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		name: 'user-camera',
		components: {},
		props: {},
		data() {
			return {
				cameraContext: {},
				windowHeight: 0,
				cameraHeight: 0,
				tempImagePath: '',
        direction: '',
        showCarema: false

			};
		},
		onLoad(option) {
      setTimeout(() => {
        this.showCarema = true
      }, 100)
      this.direction = option.direction
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
		},
		mounted() {},
		beforeDestroy() {},
		methods: {
			// 拍照
			takephoto() {
				uni.showLoading({
					title: '上传中，请稍候'
				})
				console.log(this.cameraContext)
				uni.createCameraContext().takePhoto({
					quality: 'normal',
					success: (res) => {
						// uni.redirectTo({
            //   url: `/pages/user/user-wallet-idcard?tempImagePath=${res.tempImagePath}&direction=${this.direction}`
            // })
            if(this.direction === 'front'){
              // this.idcard1 = option.tempImagePath
              uni.setStorageSync('idcardFront', res.tempImagePath)
            }else if(this.direction === 'back'){
              // this.idcard2 = option.tempImagePath
              uni.setStorageSync('idcardBack', res.tempImagePath)
            }
            let pages = getCurrentPages()//页面栈
            let prePage = pages[pages.length - 2]//上一页
            uni.navigateBack({
              success: function() {
                prePage.onLoad(); // 执行上一页的onLoad方法
              }
            })
						uni.hideLoading()
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
        uni.showLoading({
					title: '上传中，请稍候'
				})
				uni.chooseImage({
					count: 1,
					sizeType: 'compressed',
          sourceType: ['album'],
					success: (res) => {
            uni.hideLoading()
            // uni.redirectTo({
            //   url: `/pages/user/user-wallet-idcard?tempImagePath=${res.tempFilePaths[0]}&direction=${this.direction}`
            // })
            if(this.direction === 'front'){
              // this.idcard1 = option.tempImagePath
              uni.setStorageSync('idcardFront', res.tempFilePaths[0])
            }else if(this.direction === 'back'){
              // this.idcard2 = option.tempImagePath
              uni.setStorageSync('idcardBack', res.tempFilePaths[0])
            }
            let pages = getCurrentPages()//页面栈
            let prePage = pages[pages.length - 2]//上一页
            uni.navigateBack({
              success: function() {
                prePage.onLoad(); // 执行上一页的onLoad方法
              }
            })
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
				// uni.redirectTo({
        //       url: `/pages/user/user-wallet-idcard`
        //     })
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
  .cover-image{
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

		.wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80px;
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
