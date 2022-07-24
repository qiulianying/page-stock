<template>
	<view class="user-user-wallet-idcard-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">账户开通</block>
		</cu-custom>
		<view class="page-box flex flex-direction">
			<view class="page-box-subtitle text-center">
				<text>请上传本人有效的身份证照片</text>
			</view>
			<image v-if="$util.strIsEmpty(idcard1)" src="/static/images/idcard-1.png" @tap="chooseIdcard1Img" mode="aspectFill"></image>
			<image v-else :src="idcard1" @tap="chooseIdcard1Img" mode="aspectFill"></image>
			<image v-if="$util.strIsEmpty(idcard2)" src="/static/images/idcard-2.png" @tap="chooseIdcard2Img" mode="aspectFill"></image>
			<image v-else :src="idcard2" @tap="chooseIdcard2Img" mode="aspectFill"></image>
			<view class="upload-info text-right text-theme text-lg" :style="[{color: themeColor}]" @tap="showUploadInfoPop">
				<text class="cuIcon-infofill margin-right-xs"></text>
				<text class="text-df">拍摄照片要求</text>
			</view>
			<button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" :disabled="submiting" :loading="submiting" type="" @tap="doNextStep">下一步</button>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
		<zj-popup ref="upload-info-pop" class="upload-info-pop" title="拍摄照片要求" height="auto">
			<view class="text-center" style="width: 100%; padding-bottom: 50rpx;">
				<!-- <image src="/static/images/idcard-demo.png" style="width: 686rpx; height: 618rpx; margin: 24rpx auto;"></image> -->
				<image :src="imgUrl + '1635818546743/idcard-demo.png'" style="width: 686rpx; height: 618rpx; margin: 24rpx auto;"></image>
			</view>
		</zj-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import { uploadImg } from '../../api/paymentspmate'
	
	export default {
		data() {
			return {
				idcard1: '',
				idcard2: '',
				submiting: false,
        themeColor: '',
        imgUrl: ''
			}
		},
		computed: {
			...mapState ([
				'walletInfo'
			])
		},
    onLoad(option){
      this.imgUrl = this.$imgUrl
      // if(option.direction === 'front'){
      //   // this.idcard1 = option.tempImagePath
      //   uni.setStorageSync('idcardFront', option.tempImagePath)
      // }else if(option.direction === 'back'){
      //   // this.idcard2 = option.tempImagePath
      //   uni.setStorageSync('idcardBack', option.tempImagePath)
      // }
      this.idcard1 = uni.getStorageSync('idcardFront') || ''
      this.idcard2 = uni.getStorageSync('idcardBack') || ''
    },
		methods: {
			...mapMutations(['setWalletInfo']),
			...mapActions(['getAccountId']),
			showUploadInfoPop() {
				this.$refs['upload-info-pop'].open()
			},
			chooseIdcard1Img() {
				this.clearImg()
        uni.navigateTo({
          url: `/myPackageA/pages/user-camera?direction=front`
        })

				// uni.chooseImage({
				// 	count: 1,
				// 	sizeType: ['compressed'],
				// 	success: (chooseImageRes) => {
				// 		this.idcard1 = chooseImageRes.tempFilePaths[0]
				// 	}
				// })
			},
			chooseIdcard2Img() {
				this.clearImg()

        uni.navigateTo({
          url: `/myPackageA/pages/user-camera?direction=back`
        })
				// uni.chooseImage({
				// 	count: 1,
				// 	sizeType: ['compressed'],
				// 	success: (chooseImageRes) => {
				// 		this.idcard2 = chooseImageRes.tempFilePaths[0]
				// 	}
				// })
			},
			async doNextStep() {
				if (this.$util.strIsEmpty(this.idcard1) || this.$util.strIsEmpty(this.idcard2)) {
					return uni.showToast({ title: '请选择身份证照片', icon: 'none'})
				}
				if (this.$util.strIsEmpty(this.walletInfo.frontImgPath) || this.$util.strIsEmpty(this.walletInfo.backImgPath)){
					let frontImgPath = null
					let backImgPath = null
					this.submiting = true
					await this.$upload(this.idcard1, 'payment-jft').then(res => {
						const obj = res.object || {}
						frontImgPath = obj.filePath
					}).catch(err => {
						console.error(err)
						this.submiting = false
					})
					await this.$upload(this.idcard2, 'payment-jft').then(res => {
						const obj = res.object || {}
						backImgPath = obj.filePath
					}).catch(err => {
						console.error(err)
						this.submiting = false
					})
					this.submiting = false
					if (this.$util.strIsEmpty(frontImgPath) || this.$util.strIsEmpty(backImgPath)) {
						return uni.showToast({ title: '身份证照片上传失败', icon: 'none'})
					}
					this.setWalletInfo({
						...this.walletInfo,
						frontImgPath,
						backImgPath
					})
				}
				await this.uploadImg()
			},
			async uploadImg() {
				this.submiting = true
				await uploadImg({
					...this.walletInfo,
					regionNo: this.$regionId,
					accountId: await this.getAccountId()
				}).then(res => {
					this.submiting = false
					this.$toView(`user/user-wallet-pay-open`, true)
				}).catch(err => {
					console.error(err)
          setTimeout(() => {
            uni.showToast({
              title:'查看是否身份证图片不完整！',
              icon: 'none',
              duration: 3000
            })
          },1000)
					this.submiting = false
				})
			},
			clearImg() {
				this.setWalletInfo({
					...this.walletInfo,
					frontImgPath: null,
					backImgPath: null
				})
			}
		},
		mounted() {
			this.clearImg()
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-idcard-page {
		padding-bottom: 80rpx;
		.page-box {
			&-subtitle {
				font-size: 30rpx;
				padding: 40rpx 38rpx;
			}
			image {
				width: 630rpx;
				height: 416rpx;
				margin: 14rpx auto;
				border-radius: 10rpx;
			}
			.upload-info {
				margin: 12rpx 60rpx;
				line-height: 36rpx;
				text {
					vertical-align: middle;
				}
			}
			&-btn {
				margin: 50rpx 60rpx;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}
		}
		.page-bottom {
			position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-bottom: 50rpx;
			width: 100%;
			background-color: #F5F5F5;
		}
	}
</style>
