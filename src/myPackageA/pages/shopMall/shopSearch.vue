<template>
	<view class="search">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">搜索</block>
		</cu-custom>
		<view class="search-top">
			<view class="search-top-input">
				<u-input v-model="inputVlue" type="text" :border="false" input-align="center" placeholder="搜索"
					@confirm="search" :custom-style="customStyle">
				</u-input>
				<!-- <input v-model="inputVlue" type="text" @confirm="search"
					placeholder="搜索">
				</input> -->
			</view>
			<!-- 	<view class="search-top-btn">
				<u-button type="primary" :custom-style="btnCustom" @click="search">搜索</u-button>
			</view> -->
		</view>
		<view class="search-content">
			<view class="search-content-tip">
				{{ shopData.length !== 0 ? '以下是您搜索的信息' : '暂无药品信息'}}
			</view>
			<view class="search-content-shops">
				<view class="search-content-shops-shop" v-for="(item,index) in shopData" :key="index">
					<view class="shop_img">
						<image
							:src="`${spMatefileBaseURL}${item.productUrlList[0]}?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144`"
							mode=""></image>
					</view>
					<view class="shop_text">
						<view class="shop_text_name">
							{{ item.name }}
						</view>
						<view class="shop_text_diatance text">
							已售 {{ item.sellNum }}
						</view>
						<view style="display: flex;align-items: center; justify-content: space-around;">
							<view class="shop_text_address text">
								￥{{ item.goodsPrice }}
							</view>
							<view class="shop_text_number">
								<!--点击数量获取组件-->
								<zj-number-box :showModal="false" :color="themeColor" :rowData="item"
									:value="selectedGoods[item.id] ? selectedGoods[item.id].count : 0"
									@change="getChangeInfo" style="position:absolute;bottom:0rpx;">
								</zj-number-box>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--结算组件-->
		<settle :distribution="distribution" :showTotal="address" :startPrice="0.01" :merchantNo="merchantNo"
			:selectedGoods="selectedGoods" @change="getChangeInfo" :isOrderSettlement="true">
		</settle>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		searchGoodsByTakeout
	} from "@/api/shopmall";
	export default {
		onLoad(option) {
			this.merchantNo = option.merchantNo
			this.merchantName = option.merchantName
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		onShow() {
			//获取当前门店下的缓存记录
			this.selectedGoods = this.$shopMall.getSelectedGoods(this.merchantNo) ? this.$shopMall
				.getSelectedGoods(this.merchantNo) : {}
		},
		data() {
			return {
				merchantNo: '',
				selectedGoods: {}, //选中的商品对象
				distribution: 1, //配送费
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
				shopData: [],
				address: '福州软件园A区1号楼10层福州软件园A区1号楼10层福州软件园A区1号楼10层',
				merchantName: '',
				themeColor: ''
			}
		},
		methods: {
			search() {
				if (this.inputVlue) {
					let params = {
						merchantNo: this.merchantNo,
						name: this.inputVlue,
						paper: {
							curPageNum: 1,
							pageSize: 1,
						}
					}
					searchGoodsByTakeout(params).then(res => {
						this.shopData = []
						res.object.forEach(val => {
							this.shopData.push({
								name: val.name,
								sellNum: val.sellNum,
								goodsPrice: val.goodsPrice,
								productUrlList: val.productUrlList,
								id: val.id
							})
						})
					})
				} else {
					this.$refs.uToast.show({
						title: '请输入搜索词',
						type: 'warning'
					})
				}

			},
			//修改商品情况
			getChangeInfo(id, value) {
				const newSelectedGoods = this.$shopMall.updateSelectedGoods(value, this.selectedGoods, this.merchantNo,
					this.merchantName)
				this.selectedGoods = JSON.parse(JSON.stringify(newSelectedGoods))
				console.log(this.selectedGoods)
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
				width: 100%;
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
				margin-top: 20rpx;
			}

			.search-content-shops {
				padding-bottom: 135rpx;

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
							height: 85rpx;
							// line-height: 60rpx;
							// font-size: 30rpx;
							// font-weight: bold;
							font-size: 30rpx;
							// line-height: 40rpx;
							margin-top: 20rpx;
							font-weight: bold;
							color: #282828;
							overflow: hidden;
							-o-text-overflow: ellipsis;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}

						.shop_text_address {
							height: 60rpx;
							line-height: 60rpx;
							font-size: 34rpx;
							color: #CD1D1D;
							width: 240rpx;
						}

						.shop_text_number {
							position: relative;
							flex: 1;
						}

						.shop_text_diatance {
							height: 45rpx;
							line-height: 45rpx;
							color: #ACACAC;
							font-size: 26rpx;
						}

						.text {
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