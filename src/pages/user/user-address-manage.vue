<template>
	<view class="user-user-address-manage-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ isEdit ? '编辑' : '新建' }}收货人</block>
		</cu-custom>
  
		<view style="padding: 36rpx 32rpx 16rpx; background: #FFFFFF;">
			<view class="row" style="align-items: baseline;">
				<text class="row-title">联系人</text>
				<view style="display: flex; flex-direction: column; flex: 1;">
					<input class="input" style="margin-bottom: 28rpx;" type="text" v-model="addressData.name" placeholder="请填写收货人姓名" placeholder-class="input-placeholder" />
					<view class="row-tag" style="padding: 28rpx 0; border-top: 1rpx solid #F5F5F5;">
						<text class="cu-tag-selected cu-tag round">先生</text>
						<text class="cu-tag round">女士</text>
					</view>
				</view>
			</view>
			<view class="row">
				<text class="row-title">手机号</text>
				<input class="input" type="number" v-model="addressData.mobile" placeholder="请填写收货人手机号码" placeholder-class="input-placeholder" />
			</view>
			<view class="row" @tap="chooseLocation">
				<text class="row-title">地址</text>
				<text class="input">
					{{ $util.strIsNotEmpty(addressData.addressName) ? addressData.addressName : '请在地图上选择' }}
				</text>
				<text class="cuIcon- zjIcon-address icon-address"></text>定位
			</view>
			<view class="row"> 
				<text class="row-title">门牌号</text>
				<input class="input" type="text" v-model="addressData.area" placeholder="请填写街道楼牌号等" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="margin-top-sm" style="padding: 16rpx 32rpx; background: #FFFFFF;">
			<view class="row">
				<text class="row-title">标签</text>
				<view class="row-tag">
					<text class="cu-tag-selected cu-tag round">家</text>
					<text class="cu-tag round">公司</text>
					<text class="cu-tag round">学校</text>
					<text class="cu-tag round">其他</text>
				</view>
			</view>
		</view>
		<view class="margin-top-sm" style="padding: 16rpx 32rpx; background: #FFFFFF;">
			<view class="row">
				<view style="display: flex; flex-direction: column; flex: 1;">
					<text class="row-title" style="width: auto;">设为默认地址</text>
					<text style="font-size: 22rpx; color: #666666;">提醒：设置成默认地址下单时会推荐使用该地址</text>
				</view>
				<switch :checked="addressData.defaule" class="theme" @change="switchChange" />
			</view>
		</view>
		<view class="page-bottom">
			<button class="cu-btn bg-theme" :style="{background: themeColor}">保 存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEdit: false,
				addressData: {
					name: '',
					mobile: '',
					addressName: '',
					address: '',
					area: '',
					default: false
				},
        themeColor: ''
			}
		},
		methods: {
			switchChange(e) {
				this.addressData.default = e.detail
			},
			chooseLocation() {
				uni.chooseLocation({
					success: data => {
						this.addressData.addressName = data.name
						this.addressData.address = data.name
					}
				})
			}
		},
		onLoad(option) {
			let id = option.id
			this.isEdit = id != null
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'

		}
	}
</script>

<style lang="scss">
	.user-user-address-manage-page {
		.row {
			display: flex;
			align-items: center;
			min-height: 96rpx;
			&:not(:last-child) {
				border-bottom: 1rpx solid #F5F5F5;
			}
			.row-title {
				flex-shrink: 0;
				width: 144rpx;
				font-size: 28rpx;
				color: #282828;
			}
			.row-tag {
				.cu-tag {
					background: #F5F5F5;
					border: 2rpx solid #F5F5F5;
					color: #A9A9A9;
					height: 52rpx;
					line-height: 52rpx;
					padding: 0 32rpx;
					border-radius: 26px;
				}
				.cu-tag-selected {
					background: #EAF0FB;
					border: 2rpx solid #34A2E8;
					color: #34A2E8;
				}
			}
			.input {
				flex: 1;
				font-size: 28rpx;
			}
			.input-placeholder {
				color: #A9A9A9;
			}
			.icon-address {
				font-size: 48rpx;
				margin-right: 8rpx;
				color: #A9A9A9;
			}
		}
		.page-bottom {
			button {
				margin: 64rpx 24rpx 24rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
			}
		}
	}
</style>
