<template>
	<view class="user-user-address-list-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">收货地址</block>
		</cu-custom>
		<view class="address-list-box">
			<u-swipe-action :show="item.show" :index="index" 
						v-for="(item, index) in list" :key="item.id" 
						@click="click(item.id)" @open="open"
						:options="options"
					>
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view class="address-item">
								<view class="address-item-left"  @click="chooseAddress(item)">
									<view class="address-item-left-top">
										<text class="address-item-name text">{{ item.name }}</text>
										<text class="address-item-phone">{{ item.phone }}</text>
										<text class="address-item-default cu-tag round" v-if="item.isDefault">默认</text>
										<text class="address-item-tag cu-tag round" v-if="item.label">{{item.label}}</text>
									</view>
									<view class="address-item-address font">{{ item.addressPrefix }}{{ item.addressDetail }}</view>
								</view>
								<view class="address-item-right" @tap="toManageView(item)">
									<text class="cuIcon- zjIcon-edit"></text>
								</view>
							</view>
					</u-swipe-action>
					
					
			<!-- <view class="address-item" v-for="(item, index) in list" :key="index">
				<view class="address-item-left">
					<view class="address-item-left-top">
						<text class="address-item-name">{{ item.name }}</text>
						<text class="address-item-phone">{{ item.phone }}</text>
						<text class="address-item-default cu-tag round" v-if="item.isDefault">默认</text>
						<text class="address-item-tag cu-tag round" v-if="item.label">{{item.label}}</text>
					</view>
					<view class="address-item-address">{{ item.addressPrefix }}</view>
				</view>
				<view class="address-item-right">
					<text class="cuIcon- zjIcon-edit" @tap="toManageView(item)"></text>
				</view>
			</view> -->
			
			
			
		</view>
		<view class="address-list-bottom">
			<button class="cu-btn bg-theme" :style="{background: themeColor}" @tap.stop="toManageView()">添加新地址</button>
		</view>
	</view>
</template>

<script>
	import {getDeliveryAddress, getDelAddress } from "../../../api/shopmall";
	export default {
		data() {
			return {
				list: [
				// 	{
				// 	id: '1',
				// 	name: '张园园',
				// 	address: '福建省福州市鼓楼区软件园A7号楼 701-1',
				// 	phone: '18459113333',
				// 	isDefault: 1,
				// 	tag: '公司'
				// },
				],
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				memberInfo: {},
				merchantNo: '',
        themeColor: ''
			}
		},
		mounted() {
			// 获取地址
			this.getDeliveryAddress()
		},
		onLoad(option) {
			this.merchantNo = option.merchantNo
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			toManageView(item) {
				let Item = JSON.stringify(item)
				uni.navigateTo({
					url: `/pages/shopMall/user/user-address-manage?item=${Item}&merchantNo=${this.merchantNo}`
				})
			},
			//获取收货地址，默认使用第一个
			getDeliveryAddress() {
				getDeliveryAddress({"pager":{"curPageNum":1,"pageSize":100}}, {
					errorRedirect: false
				}).then(res => {
					// 給地址賦值
					if(res.object.deliveryAddresses){
						this.list = res.object.deliveryAddresses
					this.list.forEach(val => {
						this.$set(val, 'show', false)
					})
					}
				})
			},
			// 删除
			click(id) {
					// this.$u.toast(`删除了第${index}个cell`);
					getDelAddress(id).then(res => {
						// console.log(res)
						if(res.errcode === '0'){
							this.$refs.uToast.show({
								title: '删除成功',
								type: 'success'
							})
						}
					})
					this.getDeliveryAddress()
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			// 选择地址
			chooseAddress(item){
				let Item = JSON.stringify(item)
				// uni.navigateTo({
				// 	url: `/pages/shopMall/order-submit` + (item ? `?item=${Item}` : '')
				// })
				// uni.$emit("getAddress", {
				// 	address: item
				// })
				// uni.navigateBack({
					
				// })
				// const memberInfo = JSON.stringify(this.memberInfo)
				uni.navigateTo({
					url: `/pages/shopMall/order-submit?merchantNo=${this.merchantNo}&address=${Item}`
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
				width: 100rpx;
				text-align: center;
			}
			&-name {
				width: 140rpx;
				font-size: 30rpx;
				font-weight: 500;
				margin-right: 20rpx;
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
				border: 2rpx solid #34A2E8;
				color: #34A2E8;
			}
		}
	}
	.text{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
	.font{
		 // text-overflow: -o-ellipsis-lastline;
		 //  overflow: hidden;
		 //  text-overflow: ellipsis;
		 //  display: -webkit-box;
		 //  -webkit-line-clamp: 2;
		 //  line-clamp: 2;
		 //  -webkit-box-orient: vertical;
		 //  width: 600rpx;
		  word-break: break-all;
	}
</style>
