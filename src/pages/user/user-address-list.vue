<template>
	<view class="user-user-address-list-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">收货地址</block>
		</cu-custom>
		<view class="address-list-box">
			<view class="address-item" v-for="(item, index) of list" :key="index">
				<view class="address-item-left">
					<view class="address-item-left-top">
						<text class="address-item-name">{{ item.name }}</text>
						<text class="address-item-phone">{{ item.phone }}</text>
						<text class="address-item-default cu-tag round" v-if="item.isDefault">默认</text>
						<text class="address-item-tag cu-tag round" :style="[{border: `2rpx solid ${themeColor}`},{color: themeColor}]" v-if="item.tag">{{item.tag}}</text>
					</view>
					<view class="address-item-address">{{ item.address }}</view>
				</view>
				<view class="address-item-right">
					<text class="cuIcon- zjIcon-edit" @tap="toManageView(item.id)"></text>
				</view>
			</view>
		</view>
		<view class="address-list-bottom">
			<button class="cu-btn bg-theme" :style="{background: themeColor}" @tap.stop="toManageView()">添加新地址</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					id: '1',
					name: '张园园',
					address: '福建省福州市鼓楼区软件园A7号楼 701-1',
					phone: '18459113333',
					isDefault: 1,
					tag: '公司'
				}],
        themeColor: ''
			}
		},
    mounted(){
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

    },
		methods: {
			toManageView(id) {
				uni.navigateTo({
					url: `/pages/user/user-address-manage` + (this.$util.strIsNotEmpty(id) ? `?id=${id}` : '')
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-user-address-list-page {
		padding-bottom: 120rpx;
		.address-list-box {
			padding: 32rpx 24rpx;
		}
		.address-list-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1000;
			background: #F5F5F5;
			button {
				margin: 24rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
			}
		}
		.address-item {
			background: #FFFFFF;
			border-radius: 8rpx;
			margin-bottom: 24rpx;
			padding: 32rpx 18rpx 32rpx 32rpx;
			display: flex;
			align-items: center;
			justify-items: center;
			&-left {
				flex: 1;
				&-top {
					display: flex;
					align-items: center;
					justify-items: center;
					margin-bottom: 20rpx;
					.cu-tag {
						width: 86rpx;
						height: auto;
					}
				}
			}
			&-right {
				font-size: 56rpx;
				color: #666666;
			}
			&-name {
				width: 160rpx;
				font-size: 30rpx;
				font-weight: 500;
			}
			&-phone {
				width: 210rpx;
				font-size: 30rpx;
				font-weight: 500;
			}
			&-default {
				color: #FFFFFF;
				background: #E43838!important;
				border: 2rpx solid #E43838;
			}
			&-tag {
				background: #EAF0FB;
				// border: 2rpx solid #34A2E8;
				// color: #34A2E8;
			}
		}
	}
</style>
