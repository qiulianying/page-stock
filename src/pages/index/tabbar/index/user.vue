<template>
	<view class="index-user-page" style="padding-bottom: 110rpx;">
		<view class="index-user-info">
			<image class="image-bg" src="/static/images/my-bg.png" />
			<!--消息以及相关设置-->
			<view class="userSetting">
				<text :class="'myCuIcon cuIcon-comment'" @tap="toNews"></text>
				<text :class="'myCuIcon cuIcon-moreandroid'" @tap="toSetting"></text>
			</view>
			<view class="index-user-info-box">
				<image src="/static/images/icon_foods.png" @tap="handleLogin" />
				<view class="index-user-allArray">
					<view class="index-user-ArrayList" @tap="toTypeList(item)" v-for="(item, index) in ArrayList" :key="index">
						<view class="listNumber">{{item.number || 0}}</view>
						<view class="listName">{{item.name}}</view>
					</view>
				</view>
			</view>
			<!--底部栏-->
			<view class="index-bottom"></view>
		</view>
		<!--我的梦想-->
		<view class="index-user-dream">
			<view class="index-user-dreamTite">
				<view class="index-user-dreamTiteInfo">
					<view class="name">FATFISHBOY</view>
					<view class="visitor">访客：200</view>
				</view>
				<view class="myid">id:不吃肉的猫</view>
			</view>
			<view class="index-user-dreamList">
				<view class="flex flex-direction" v-if="cartList.length > 0">
					<zj-dream-list :list="cartList" @itemClick="toShowList"></zj-dream-list>
				</view>
				<zj-empty v-if="cartList.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
						  text="暂无梦圆数据~" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				ArrayList: [
					{
						number: '',
						name: '粉丝'
					},
					{
						number: '',
						name: '关注'
					},
					{
						number: '',
						name: '筑梦'
					},
					{
						number: '',
						name: '金梦'
					}
				],
				customStyle:{
					background: "#34A2E8"
				},
				imgUrl: '',
				cartList: [
					{
						title: '2024 考研成功上岸',
						time: '2022-10-21',
						name: '春日回暖衬',
						headerIcon: "service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
						content: '中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处',
						imagesArray: [
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg"
						]
					},
					{
						title: '2024 考研成功上岸',
						time: '2022-10-21',
						name: '春日回暖衬',
						headerIcon: "service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
						content: '部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处',
						imagesArray: [
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg"
						]
					},
					{
						title: '2024 考研成功上岸',
						time: '2022-10-21',
						name: '春日回暖衬',
						headerIcon: "service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
						content: '中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处',
						imagesArray: [
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg"
						]
					},
					{
						title: '2024 考研成功上岸',
						time: '2022-10-21',
						name: '春日回暖衬',
						headerIcon: "service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
						content: '中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处中国外交部、文旅部、阿拉伯国家联盟秘书处',
						imagesArray: [
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg",
							"service-org-7adc24dc/20220120/589a86e3767e40cd9dcdd013137c1274.jpg"
						]
					}
				],	// 梦想对应数据
			}
		},
		computed: {},
		created() {},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.customStyle.background = this.themeColor
		},
		methods: {
			toNews() {
				this.$toView('user/user-msg')
			},
			toSetting() {

			},
			toShowList() {

			},
			handleLogin() {
				this.$toView('login/login')
			},
			toTypeList(item) {
				switch (item.name) {
					case '粉丝':
						this.$toView('user/user-fans')
						break
					default:
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-user-page {
		.index-user-info {
			width: 100%;
			height: 500rpx;
			position: relative;
			z-index: 0;

			.userSetting {
				position: absolute;
				right: 40rpx;
				top: 160rpx;
				color: #ffffff;
				.cuIcon-comment {
					margin-right: 60rpx;
				}
				.myCuIcon {
					font-size: 40rpx;
					display: inline-block;
					vertical-align: middle;
				}
			}

			.index-user-info-box {
				position: absolute;
				left: 40rpx;
				right: 40rpx;
				bottom: 40rpx;
				display: flex;
				justify-items: center;
				align-items: center;
				z-index: 300;

				image {
					width: 200rpx;
					height: 200rpx;
					margin-right: 14rpx;
					border-radius: 50%;
				}

				.index-user-allArray {
					margin-left: 10rpx;
					.index-user-ArrayList {
						margin-right: 80rpx;
						display: inline-block;
						vertical-align: middle;
						font-size: 22rpx;
						font-weight: 600;
						color: #FFFFFF;
						text-align: center;
						&:last-child {
							margin-right: 0;
						}
						.listNumber {
							font-size: 32rpx;
						}
					}
				}
			}

			.index-bottom {
				width: 100%;
				z-index: 200;
				position: absolute;
				bottom: 0;
				left: 0;
				background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
				box-shadow: 0px -6px 40px 0px rgba(98,119,192,0.07);
				backdrop-filter: blur(9px);
				height: 80rpx;
				border-radius: 20rpx 20rpx 0 0;
			}
		}

		.index-user-dream {
			background-color: #ffffff;
			.index-user-dreamTite {
				width: 90%;
				margin: 0 auto 50rpx;
				.index-user-dreamTiteInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name {
						margin-bottom: 10rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #2A2A2A;
						line-height: 36rpx;
					}

					.visitor {
						font-size: 22rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #2A2A2A;
					}
				}
				.myid {
					font-size: 18rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #D8D8D8;
					line-height: 16rpx;
				}
			}

			.index-user-dreamList {
				height: calc(100vh - 750rpx);
				overflow-y: auto;
			}
		}
	}
</style>
