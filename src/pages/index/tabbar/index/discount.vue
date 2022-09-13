<template>
	<view :class="isEdit ? 'pb200': 'pb100'" style="background-color: #F5F5F5;">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black">筑梦</block>
		</cu-custom>
		<view class="myheader-search">
			<view class="search-box">
				<view class="search-box-left">
					<u-search :placeholder="searchText" v-model="keyword" :focus="false" :show-action="false" @search="inputSearch()">
					</u-search>
				</view>
			</view>
		</view>
		<view class="mall-cart-list flex flex-direction" v-if="cartList.length > 0">
			<zj-dream-list :list="cartList" @itemClick="toShowList"></zj-dream-list>
		</view>
		<zj-empty v-if="cartList.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无数据~" />
	</view>
</template>

<script>
	import { getDreamPage } from '../../../../api/home'
	export default {
		props: {
			isReachBottom: {
				// 该页面是否拉到底部
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				searchText: '搜索您感兴趣的梦想',
				keyword: '',
				allFlag: {
					checked: false,
					value: 'all'
				},
				cartList: [],	// 梦想对应数据
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				merchantNo: '',
				customStyle:{
					background: "#34A2E8"
				},
				themeColor: '',
				imgUrl: '',
				isEdit: false,
				current: 1,
				size: 20
			}
		},
		watch: {
			isReachBottom: {
				handler(val) {
					// 如果该页面拉取到了底部，则重新调用接口
					console.log(34234234234)
					this.current += 1
					this.toSearchList()
				}
			}
		},
		created() {
			this.toSearchList()
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.customStyle.background = this.themeColor
		},
		methods: {
			toSearchList() {
				getDreamPage(`?current=${this.current}&size=${this.size}`).then(res => {
					if (res.data.length > 0) {
						this.cartList = this.cartList.concat(res.data)
					}
				})
			},
			doSearch() {

			},
			inputSearch() {

			},
			toShowList(item) {
				this.$toView('myPackageA/pages/dream/dream-detail', false, true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myheader-search {
		background-color: #ffffff;
		padding-bottom: 20rpx;
		.search-box {
			width: 96%;
			margin: 0 auto;
		}
	}
	.pb100 {
		padding-bottom: 100rpx;
	}

	.pb200 {
		padding-bottom: 200rpx;
	}

	.mall-cart-list {
		background: #ffffff;
		padding-bottom: 30rpx;
	}
</style>
