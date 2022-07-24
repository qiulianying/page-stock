<template>
	<view class="search">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">搜索</block>
		</cu-custom>
		<view class="search-top">
			<view class="search-top-input">
				<u-input v-model="inputVlue" :type="text" :border="false" input-align="center" placeholder="搜索" 
					:custom-style="customStyle">
					<!-- <u-icon name="search"></u-icon> -->
				</u-input>
			</view>
			<view class="search-top-btn">
				<u-button type="primary" :custom-style="btnCustom" @keydown.enter="search">搜索</u-button>
			</view>
		</view>
		<view class="search-content">
			<view class="search-content-tip">
				以下是您搜索的信息
			</view>
			<view class="search-content-shops">
				<view class="search-content-shops-shop" v-for="(item,index) in shopData" :key="index">
					<view class="shop_img">
						<image :src="item.img" mode=""></image>
					</view>
					<view class="shop_text">
						<view class="shop_text_name text">
							{{ item.shopName }}
						</view>
						<view class="shop_text_address text">
							{{ item.address }}
						</view>
						<view class="shop_text_diatance text">
							<span>距离您：</span>
							{{ item.distance }}
							<span>km</span>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
		},
		data() {
			return {
				inputVlue: '',
				customStyle: {
					height: '40rpx',
					borderRadius: '40rpx',
					background: '#F8F8F8'
				},
				btnCustom: {
					height: '60rpx',
					width: '100rpx'
				},
				shopData:[
					{
						img:'../../static/images/bank/102.png',
						shopName:'我是一个有良心的药店',
						address: '翻斗花园xxxx号楼的一个很漂亮的房子',
						distance: '11111.22'
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		.search-top {
			display: flex;
			padding: 20rpx;
			background-color: white;
			align-items: center;
			justify-content: space-between;

			&-input {
				width: 85%;
			}

			&-btn {
				// height: 40rpx;
			}
		}

		.search-content {
			.search-content-tip {
				text-align: center;
				vertical-align: middle;
				height: 56rpx;
				line-height: 56rpx;
				color: #ACACAC;
			}

			.search-content-shops {
				.search-content-shops-shop {
					background-color: white;
					height: 200rpx;
					display: flex;
					align-items: center;
					padding: 10rpx;
                    margin: 20rpx;
					border-radius: 10rpx;
					.shop_img {
						// width: 230rpx;	
						image {
							width: 220rpx;
							height: 150rpx;
						}
					}

					.shop_text {
						margin-left: 20rpx;
						.shop_text_name {
							height: 60rpx;
							line-height: 60rpx;
							font-size: 30rpx;
							font-weight: bold;
						}

						.shop_text_address {
							height: 60rpx;
							line-height: 60rpx;
							color: #606266;
							font-size: 28rpx;
						}

						.shop_text_diatance {
							height: 60rpx;
							line-height: 60rpx;
							color:#ACACAC;
							font-size: 26rpx;
						}
						.text{
							display: -webkit-box !important;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-all;
							-webkit-box-orient: vertical !important;
							-webkit-line-clamp: 1;
						}
					}
				}
			}
		}

	}
</style>
