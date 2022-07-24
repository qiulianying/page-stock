<template>
	<view class="user-user-code-success-pay-page">
		<!-- <cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">到店消费</block>
		</cu-custom> -->
		<view class="page-box flex flex-direction item align-center">
			<image src="/static/images/success.png"></image>
			<text style="font-size: 34rpx; ">支付成功</text>
			<view style="font-size: 70rpx; color: #000;font-weight: bold;"><text style="font-size: 50rpx;">￥</text>0.01
			</view>
		</view>
		<view style="margin: 0 35rpx; font-size: 30rpx;">
			<view style="display: flex; justify-content: space-between; margin-right: 20rpx;">

				<view class="text" style="text-align: left">实付金额</view>
				<view style="min-width: 200rpx; text-align: end">￥0.01</view>
			</view>
			<view style="display: flex; justify-content: space-between; margin-right: 20rpx;">
				<view style="min-width: 200rpx">优惠金额</view>
				<view class="text">￥0.01</view>
			</view>
			<view style="display: flex; justify-content: space-between; margin-right: 20rpx;">
				<view style="min-width: 200rpx">付款方式</view>
				<view class="text">{{payTypeName||'微信支付'}}</view>
			</view>
		</view>
		<view class="flex" style="width: 100%; margin-top: 120rpx; position: fixed; bottom: 120rpx">
			<!-- <button class="cu-btn page-box-btn text-theme" :style="[{color: themeColor}]" @tap="$util.toBack(1, false)">返回</button> -->
			<button class="cu-btn page-box-btn bg-theme" :style="[{background: themeColor}, {color: 'white'}]"
				@tap="$util.toBack(1, true)">返回</button>
			<!-- <button class="cu-btn page-box-btn bg-theme" :style="{background: themeColor}" @tap="$toView(`/myPackageA/pages/dealRecord/user-deal-record`, false, true, true)">查看订单</button> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: 0,
				themeColor: '',
				discountMoney: '',
				payTypeName: '',
				saler: '',
				acount: ''
			}
		},
		methods: {},
		onLoad(option) {
			let {
				money
			} = option
			this.money = parseFloat(money).toFixed(2)
			this.discountMoney = option.discountMoney || 0
			this.payTypeName = option.payTypeName || ''
			this.saler = option.saler || ''
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.acount = option.acount
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
</style>
<style lang="scss">
	.user-user-code-success-pay-page {
		.page-box {
			padding: 20% 36rpx 20rpx;

			image {
				// width: 260rpx;
				// height: 260rpx;
				width: 120rpx;
				height: 120rpx;
			}

			&-btn {
				margin: 0 15rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
				flex: 1;

				&:first-child {
					color: $zj-color-primary;
					height: 90rpx;
					line-height: 90rpx;
					border: 2rpx solid $zj-color-primary;
					background: #FFFFFF;
					box-sizing: border-box;
				}
			}
		}
	}

	.text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		text-align: end;
	}
</style>