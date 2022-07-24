<template>
	<view style="padding-bottom: 100rpx; background-color: #F7F8FA;">
		<cu-custom bgColor="bg-theme">
			<block slot="content">我的</block>
		</cu-custom>
		<view class="my_header">
			<view class="my_header_top">
				<!--定位-->
				<view class="mp-search-box">
					<view class="city" @click="navCity">
						<u-icon name="map-fill" color="#fff" class="myIcon"></u-icon>
						<text class="city-name">{{currentCity||'全国'}}</text>
						<u-icon name="arrow-down" color="#fff"></u-icon>
					</view>
				</view>
				<!--搜索-->
				<view class="my_header_top_search">
					<u-input v-model="searchValue" type="text" :border="false" input-align="center" :disabled="true"
						placeholder="搜索门店、药品......" :custom-style="inputStyle" :clearable="false" @click="handleSearch"/>
				</view>
				<!-- 标题 -->
				<view class="my_header_top_title">
					<view class="title" v-for="(item, index) in titleType" :key="index">
						{{ item.name }}
					</view>
				</view>
				<!-- 轮播图 -->
				<view class="mySwripter">
					<u-swiper :list="swiperList" height="300"></u-swiper>
				</view>
			</view>
		</view>

		<!--对应分类-->
		<view class="home_types">
			<zj-menu-list :list="typeList" @on-click="handleClickMenu" />
		</view>

		<!-- 小科普 -->
		<view class="home_science">
			<view class="home_science_title">
				小科普
			</view>
			<view class="home_science_content">
				线上购药，足不出户，送货到家！
			</view>
		</view>

		<!-- 附近药店 -->
		<view class="home_product_title">
			附近药店
		</view>
		<view class="mall-home-product">
			<view v-for="(item, index) in productList" :key="index" class="mall-home-product-item"
				@tap="toGoodsDetailView(item.id)">
				<view class="m-img">
					<image style="width: 100%;height: 100%;" :src="item.pic" mode="aspectFit"></image>
				</view>
				<view class="m-text">
					<view class="m-title">{{item.name}}</view>
					<view class="m-address">{{item.desc}}</view>
					<view class="m-descripe">
						<view class="m-descripe_left">
							{{item.shop}}
						</view>
						<view class="m-descripe_right">
							<view class="m-descripe_right_value">
								￥10起送
							</view>
							<view class="m-descripe_right_distribution">
								商家配送
							</view>
						</view>
					</view>
					<view class="m-spec">
						<view class="cu-tag radius" style="background-color: #FBE7E1; color: #E18D82;">{{item.spec}}</view>
					</view>
					<!-- <view class="m-number">
						这里是其他数据test
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { orgHomeConfig, getMerchantList } from '../../../api/infouser'
	export default {
		data() {
			return {
				currentCity: '', //地名
				swiperList: [],
				//类别
				typeList: [{
					id: 1,
					name: '水果',
					color: '#6BC109',
					badge: '必看',
					img: '/static/images/icon/icon-mall-1.png',
				}],
				//门店
				productList: [],
				searchValue: '',
				inputStyle: {
					background: 'white',
					height: '50rpx',
					borderRadius: '50rpx'
				},
				titleType: [{
						name: '便民利民'
					},
					{
						name: '安全保障'
					},
					{
						name: '快捷服务'
					}
				]
			}
		},
		methods: {
			//获取对应轮播以及分类详情
			orgHomeConfig() {
				orgHomeConfig(this.$regionId + '1').then(res => {
					const modules = res.object != null ? res.object.modules : null
					if (modules != null && modules.length > 0) {
						let swiperObj = modules.find(item => item.name === 'swiper')
						if (swiperObj != null) {
							this.swiperList = swiperObj.dataSource.swiper
						}
					}
				})
			},
			//查询地址
			navCity() {
				uni.chooseLocation({
					success: data => {
						this.currentCity = data.name
					}
				})
			},
			handleClickMenu(data) {
				this.toGoodListView(data.id)
			},
			toGoodListView(id) {
				this.$toView(`mall/goods-list?categoryId=${id}`)
			},
			toGoodsDetailView(id) {
				uni.navigateTo({
					url: '/pages/shopMall/categories'
				})
			},
			handleSearch(){
				uni.navigateTo({
					url: '/pages/shopMall/search'
				})
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.my_header {
		height: 540rpx;
        margin-bottom: 10rpx;
		.my_header_top {
			background-color: $zj-color-primary;
			height: 360rpx;
			border-radius: 0 0 10% 10%;
			position: relative;

			/*顶部搜索栏*/
			.mp-search-box {
				display: flex;
				height: 90upx;
				line-height: 90upx;
				width: 100%;
				padding: 0 40upx;

				.city {
					margin: 20upx 10px 0 0;
					height: 56upx;
					line-height: 56upx;

					.myIcon {
						font-size: 40rpx;
					}

					.city-name {
						margin: 0 5px;
						font-size: 34rpx;
						color: $zj-text-color-inverse;
					}
				}
			}

			.my_header_top_search {
				width: 95%;
				margin: auto;
			}

			.my_header_top_title {
				display: flex;
				justify-content: space-around;
				color: white;
				font-size: 26rpx;
				margin-top: 20rpx;
			}

			.mySwripter {
				width: 95%;
				margin-left: 2.5%;
				margin-top: 30rpx;
				position: absolute;

				.mall-home-swiper {
					width: 100%;
					height: 375rpx;

					&-item {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						&-img {
							display: flex;
							align-items: center;
							justify-content: center;
							height: 100%;
							width: 100%;
							border-radius: 5px;
						}
					}
				}
			}
		}
	}

	.home_types {
		width: 95%;
		margin: 0rpx 2.5%;
		background-color: white;
		border-radius: 10rpx;
	}

	.home_science {
		width: 95%;
		margin: 20rpx 2.5%;
		border-radius: 10rpx;
		background-color: white;
		height: 100rpx;
		display: flex;
		align-items: center;

		.home_science_title {
			font-size: 36rpx;
			color: #4179F2;
			width: 130rpx;
			margin-left: 20rpx;
			font-weight: bolder;
			font-style: italic;
		}

		.home_science_content {
			flex: 1;
			font-size: 28rpx;
			margin-left: 20rpx;
		}
	}

	.home_product_title {
		font-size: 36rpx;
		font-weight: bold;
		margin: 0 2.5%;
	}

	.mall-home-cover {
		margin: 32rpx;
		border-radius: 8rpx;
		display: flex;
		overflow: hidden;

		image {
			width: 100%;
		}
	}

	.mall-home-product {
		margin: 10rpx 2.5%;

		&-item {
			display: flex;
			flex-direction: row;
			width: 100%;
			justify-content: space-between;
			align-items: flex-start;
			// margin-top: 30rpx;
			margin-bottom: 30rpx;
			padding: 20rpx;
			background-color: white;
			border-radius: 10rpx;

			.m-img {
				flex: 0 0 170rpx;
				height: 170rpx;
				border: 2rpx solid #F5F5F5;
				border-radius: 8rpx;
				overflow: hidden;
			}

			.m-text {
				flex: 1;
				position: relative;
				padding-left: 20rpx;
				display: flex;
				align-content: space-between;
				flex-direction: column;

				.m-title {
					margin-bottom: 6rpx;
					font-size: 32rpx;
					color: #161616;
					height: 42rpx;
					font-weight: bold;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-box-orient: vertical !important;
					-webkit-line-clamp: 1;
				}
                .m-address{
					font-size: 24rpx;
					color: #555555;
					margin-top: 16rpx;
					height: 34rpx;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-box-orient: vertical !important;
					-webkit-line-clamp: 1;
				}
				.m-descripe {
					font-size: 24rpx;
					color: #555555;
					margin-top: 16rpx;
					height: 34rpx;
					// display: -webkit-box !important;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// word-break: break-all;
					// -webkit-box-orient: vertical !important;
					// -webkit-line-clamp: 1;
					display: flex;
					justify-content: space-between;

					.m-descripe_left {
						color: #c7c7c7;
					}

					.m-descripe_right {
						display: flex;
						justify-content: space-between;
						width: 220rpx;
						height: 42rpx;
						font-size:22rpx;
						border: #4379F3 1px solid;
						border-radius: 42rpx;
						text-align: center;
						line-height: 42rpx;
						&_value {
							color: #4379F3;
							width: 110rpx;
							background-color: #EEF4FE;
							border-radius: 42rpx 0 0 42rpx;
						}

						&_distribution {
							color: white;
							width: 110rpx;
							background-color: #4379F3;
							border-radius: 0 42rpx 42rpx 0 ;
						}
					}

				}

				.m-spec {
					margin: 16rpx 0;

					view {
						padding: 0 24rpx;
						height: 36rpx;
						line-height: 36rpx;
					}
				}

				.m-price-box {
					height: 48rpx;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					align-items: flex-end;

					.m-price {
						position: relative;
						top: 4rpx;
						font-size: 28rpx;
						color: #ff582b;
					}

					.m-old-price {
						margin-left: 20rpx;
						display: flex;
						flex-direction: row;
						font-size: 22rpx;
						color: #999999;
						margin-top: 5rpx;
						text-decoration: line-through;
						font-weight: normal;
					}
				}

				.m-number {
					position: absolute;
					right: 0;
					bottom: 10rpx;
					z-index: 16;
					color: #b2b2b2;
					font-size: 20rpx;
					text-align: right;
				}
			}
		}
	}
</style>
