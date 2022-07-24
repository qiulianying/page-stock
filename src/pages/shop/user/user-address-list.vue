<template>
	<view class="user-user-address-list-page">
		<!--门店支付进入，使用跳转组件固定返回-->
		<topback-btn v-if="merchantNo" :url="`/pages/shop/order-submit?merchantNo=${merchantNo}`" bgColor="bg-white">
			<block slot="backText" class="text-black">选择收货地址</block>
		</topback-btn>
		<!--非门店支付进入，默认返回-->
		<cu-custom bgColor="bg-white" is-back v-else>
			<block slot="backText" class="text-black">收货地址</block>
		</cu-custom>
		<view class="address-list-box" v-if="list.length !== 0">
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.id"
				@click="click(item.id)" @open="open" :options="options">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="address-item">
					<view class="address-item-left" @click="chooseAddress(item)">
						<view class="address-item-left-top">
							<text class="address-item-name text">{{ item.name }}</text>
							<text class="address-item-phone">{{ item.phone }}</text>
							<text class="address-item-default cu-tag round" v-if="item.isDefault">默认</text>
							<text class="address-item-tag cu-tag round"
								:style="[{border: `2rpx solid ${themeColor}`},{color: themeColor}]"
								v-if="item.label">{{item.label}}</text>
						</view>
						<view class="address-item-address font">{{ item.addressPrefix }}{{ item.addressDetail }}</view>
					</view>
					<view class="address-item-right" @tap="toManageView(item)">
						<text class="cuIcon- zjIcon-edit"></text>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view class="address-list-box" v-else>
			<zj-empty text="您还没有收货地址哦~" :img="`${imgUrl}1639019849000/pic_address.png`" />
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
				imgUrl: this.$imgUrl,
				list: [{
					"id": "dcb5f145152a4393b1b4b670628f7a6a",
					"name": "王",
					"addressDetail": "222",
					"phone": "13222222222",
					"isDefault": 0,
					"isDelete": 0,
					"createTime": "2021-07-08T12:22:57.995+0000",
					"updateTime": 1625746977995,
					"createUserId": "b4a072edbc3d47088936cf20a15b7556",
					"location": {
						"lat": 26.08198,
						"lon": 119.30405
					},
					"sex": 1,
					"label": "家",
					"addressPrefix": "福州市鼓楼区人民政府",
					"show": false
				}],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				memberInfo: {},
				merchantNo: null,
				themeColor: ''
			}
		},
		mounted() {
			// 获取地址
		},
		onLoad(option) {
			console.log(option)
			this.merchantNo = option.merchantNo || null
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			//添加新地址
			toManageView(item) {
				//是否属于门店支付进入
				if (this.merchantNo) {
					if (item) {
						let Item = JSON.stringify(item)
						uni.redirectTo({
							url: `/pages/shop/user/user-address-manage?item=${Item}&merchantNo=${this.merchantNo}`
						})
					} else {
						uni.redirectTo({
							url: `/pages/shop/user/user-address-manage?merchantNo=${this.merchantNo}`
						})
					}
				} else {
					if (item) {
						let Item = JSON.stringify(item)
						uni.redirectTo({
							url: `/pages/shop/user/user-address-manage?item=${Item}`
						})
					} else {
						uni.redirectTo({
							url: `/pages/shop/user/user-address-manage`
						})
					}
				}
			},

			// 删除
			click(id) {

				this.$refs.uToast.show({
					title: '删除成功',
					type: 'success'
				})

			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			// 选择地址
			chooseAddress(item) {
				if (!this.merchantNo) {
					return
				}
				let Item = JSON.stringify(item)
				uni.redirectTo({
					url: `/pages/shop/order-submit?merchantNo=${this.merchantNo}&address=${Item}`
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
				background: #E43838 !important;
				border: 2rpx solid #E43838;
			}

			&-tag {
				background: #EAF0FB;
				border: 2rpx solid #34A2E8;
				color: #34A2E8;
			}
		}
	}

	.text {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.font {
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