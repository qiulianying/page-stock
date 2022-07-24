<template>
	<view>
		<cu-custom bgColor="bg-white" is-back @tap="toIndex" :goBack="false">
			<block slot="backText" class="text-black">开通钱包</block>
		</cu-custom>
		<view :style="{height:windowHeight+'px'}" style="width:100%">
			<view class="my_imgbody" >
				<button class="open" @click="goToPurse"> 立即开通
					<text class="cuIcon-right" style="margin-left:10rpx"></text>
				</button>
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
				src: '',
				showBackIg: true, //显示背景图
				cameraContext: {},
				windowHeight: 0,
				cameraHeight: 0,
				tempImagePath: '',
				showCarema: false //是否显示拍照模块
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
			this.windowWidth = systemInfo.windowWidth
			this.windowHeight = systemInfo.windowHeight

			console.log(this.windowHeight)
		},
		mounted() {},
		beforeDestroy() {},
		methods: {
			goToPurse() {
				uni.navigateTo({
					url: `/pages/user/user-wallet-bankcard-add`,
				});
			},
			toIndex() {
				//关闭所有页面，跳转到首页
				uni.reLaunch({
					url: `/pages/index/index`
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.my_imgbody {
		width: 100%;
		height: 100%;
		position: relative;
		background:#FCEFE7 url('https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638181760000/bg_purse.png') no-repeat;
		background-size: 100%;

		.open {
			position: absolute;
			top: 1100rpx;
			left: 50%;
			height: 80rpx;
			line-height: 80rpx;
			width: 300rpx;
			margin: 0 auto;
			text-align: center;
			background-color: #4E4989;
			color: #fff;
			transform: translate(-50%, 0%);
			font-size: 28rpx;
		}
	}

	// .my_imgbody {
	// 	width: 100%;
	// 	height: 1400rpx;
	// 	position: relative;

	// 	.my_img {
	// 		width: 100%;
	// 		height: 100%;
	// 		position: absolute;
	// 		top: 0;
	// 		left: 0;
	// 	}

	// 	.open {
	// 		position: absolute;
	// 		bottom: 250rpx;
	// 		left: 50%;
	// 		height: 80rpx;
	// 		line-height: 80rpx;
	// 		width: 300rpx;
	// 		margin: 0 auto;
	// 		text-align: center;
	// 		background-color: #4E4989;
	// 		color: #fff;
	// 		transform: translate(-50%, 0%);
	// 		font-size: 28rpx;
	// 	}
	// }
</style>
