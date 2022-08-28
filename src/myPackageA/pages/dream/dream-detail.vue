<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">我的筑梦</block>
		</cu-custom>

		<view style="width:100%;height:750rpx;margin:0 auto;align:center">
			<u-swiper :list="swiperList" height="750" class="detail-swiper">
			</u-swiper>
		</view>

		<view class="goods-detail-info">
			<view class="goods-title">
				<span>全闽悦影券豪华版</span>
				<span class="createTime">2022-10-04 创建</span>
			</view>
			<view class="goods-desc">福建线上约130家，线下约170家，含金逸万达GGV中瑞等主流影城。福建线上约130家，线下约170家，含金逸万达GGV中瑞等主流影城</view>
			<view class="zj-dream-informShow">
				<view class="zj-dream-informTitle" v-for="infoItem in infoArrayShow">
					<text :class="'myCuIcon cuIcon-' + infoItem.type"></text>
					<text class="cuIcon-Number">{{infoItem.number}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [
					"http://localhost:8082/platform-oss/internal-getfile/service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"
				],
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.user-user-msg-page {
		.goods-detail-info {
			background: #ffffff;
			padding: 32rpx 24rpx;

			.goods-num-box {
				display: flex;
				align-items: center;
				position: relative;
				height: 80rpx;
				justify-content: space-between;

				.goods-stock {
					font-size: 34rpx;
					color: #aaa5a5;
					margin-bottom: 12rpx;
					margin-left: 160rpx;
				}
			}

			.goods-title {
				width: 100%;
				font-size: 30rpx;
				font-weight: 500;
				color: #333;
				line-height: 1.2;
				margin: 12rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.createTime {
					text-align: right;
					font-size: 20rpx;
					font-weight: 400;
					color: #BBBBBB;
				}
			}

			.goods-tags {
				margin: 18rpx 0;
				height: 40rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				&-box {
					padding: 0 10rpx;
					height: 32rpx;
					border-radius: 32rpx;
					font-size: 20rpx;
					margin-right: 10rpx;
					display: inline-block;
				}
			}


			.goods-desc {
				line-height: 1.2;
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
			}

			.goods-spec {
				display: flex;
				font-size: 26rpx;
				color: #666666;
				margin-top: 24rpx;
				align-items: center;

				text:nth-child(odd) {
					margin-right: 8rpx;
					font-size: 48rpx;
				}

				text:nth-child(even) {
					margin-right: 32rpx;
				}
			}
		}
	}
</style>
