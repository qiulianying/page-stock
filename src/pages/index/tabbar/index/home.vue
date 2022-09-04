<template>
	<view class="home-page" style="padding-bottom: 20rpx;">
		<view style="background: white">
			<!-- 头部是大轮播的风格 -->
			<view class="my_header_more">
				<view class="my_header_top">
					<!--搜索-->
					<view class="my_header_top_search"
						:style="{position:'absolute',height:`${CustomBar}px`,'padding-top':`${StatusBar}px`}">
						<view class="search-box">
							<view class="my_header_search_block" @click="goSearch"></view>
							<u-search :input-style='inputStyle' search-icon-color='#fff' bg-color='rgba(0,0,0,0.18)'
								placeholder-color='#fff' :placeholder="searchText" v-model="keyword"
								:show-action="false" :disabled="true">
							</u-search>
						</view>
					</view>
					<!-- 轮播图 -->
					<view class="mySwripter">
						<swiper style="height:592rpx;border-radius:0rpx"
							v-if="swiperList != null && swiperList.length > 0" class="index-home-swiper" autoplay
							indicator-dots indicator-active-color='#ffffff'>
							<swiper-item style="height:592rpx" v-for="(item, index) in swiperList" :key="index"
								class="index-home-swiper-item">
								<!-- :src="fileBaseURL + item.url + bigFixStr" -->
								<image :src="item.src" class="index-home-swiper-item-img"
									style="height:592rpx;border-radius:0rpx" mode="aspectFill" :lazy-load="true"
									@click="toCouponDetail(item.link.id, item.type, item)" />
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<!-- 首页tab分类列表 -->
			<view style="display: flex; justify-content: center;" :class="!isAct ? 'mt36' : 'mt24'">
				<u-tabs v-if="showTab" :list="merchantTabList" :is-scroll="true" :font-size="30"
					:current="merchantTabCurIndex" @change="tabSelect" :active-color="themeColor"></u-tabs>
			</view>
		</view>
		<swiper :current="merchantTabCurIndex" class="swiper-box" duration="300" @change="changeTab"
			style="margin-bottom:100rpx">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in merchantTabList" :key="tabIndex">

			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			isFresh: { // 是否刷新
				type: Boolean,
				default: false
			},
			optionContent: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				searchText: '搜索梦想....',
				showSearch: true,
				scrollTop: 0,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				imgUrl: this.$imgUrl,
				showTab: true,
				isSoftware: this.$Software,
				keyword: '',
				searchValue: '',
				type: 'text',
				location: {},
				swiperList: [{
					"link": {},
					"style": 1,
					"acticon": [],
					"title": "园区活动",
					"src": "/static/images/bg_index02.jpg",
					"type": 0,
					"url": "service-org-7adc24dc/20220114/eb964cbea5e749bcb1e26aa6d28a4634.jpg",
					"radio": "1"
				}, {
					"h5Url": "https://dish.51zcm.cc/mss/webapp/spbH5!index.action?merchantNo=00254946",
					"link": {
						"name": "",
						"id": "",
						"merchantNo": ""
					},
					"src": "/static/images/bg_index04.jpg",
					"appletUrl": "",
					"style": 1,
					"appletAppid": "",
					"acticon": [{
						"url": "service-org-7adc24dc/20220308/8dfd6eb689a5445f8a402a8445cc1c20.jpg"
					}],
					"title": "悠茶小驿",
					"type": 4,
					"isShowButton": true,
					"url": "service-org-7adc24dc/20220114/c8f9c5dfc53843aeabc9eabedfb85129.jpg",
					"radio": "2"
				}, {
					"h5Url": "",
					"link": {
						"name": "",
						"id": "",
						"merchantNo": ""
					},
					"src": "/static/images/bg_index03.png",
					"appletUrl": "pages/home/home",
					"style": 1,
					"appletAppid": "wxeff36bec97901729",
					"acticon": [{
						"url": "service-org-7adc24dc/20220121/7e72ca90d1ea4d8983d70f0bca627207.jpg"
					}],
					"title": "顶顶顶搜索",
					"type": 4,
					"isShowButton": true,
					"url": "service-org-7adc24dc/20220121/d1b2d0de5ffc45ae9ec8d2235e9041b6.jpg",
					"radio": "1"
				}, {
					"h5Url": "",
					"link": {
						"name": "",
						"id": "",
						"merchantNo": ""
					},
					"src": "/static/images/bg_index01.png",
					"appletUrl": "",
					"style": 1,
					"appletAppid": "",
					"acticon": [{
						"url": "service-org-7adc24dc/20220218/6663df8ffe654112af614cecd2ec29f1.png"
					}],
					"title": "嘉年华",
					"type": 4,
					"isShowButton": false,
					"url": "service-org-7adc24dc/20220218/632ce4ebac6e4d029bb81e91e922154f.png",
					"radio": "1"
				}], //轮播图数据
				merchantTabCurIndex: 0,
				// 分类
				merchantTabList: [
					{
						id: 1,
						name: '进行中',
						list: []
					},
					{
						id: 2,
						name: '已结束',
						list: []
					}
				],
				inputStyle: {
					background: 'rgba(0,0,0,0)',
					height: '100%',
					width: '284rpx',
					borderRadius: '50rpx',
					color: '#fff'
				},
				actList: [{
					"shoprightList": [{
						"isOpenStore": 0,
						"payTypes": [],
						"goodsPrice": 1.1,
						"transactionQueryTypes": [],
						"name": "测试",
						"id": "e73e099017ec4b7da28c2d9e0f81afcd",
						"saleNum": 0,
						"pics": [],
						"realPrice": 1.1
					}],
					"icon": "service-org-7adc24dc/20211202/34739117b32e4100a9957fb7371ca5d1.png",
					"acticon": "service-org-7adc24dc/20211202/7d168fe4915042a3b074c15517b0a08a.png",
					"id": 0
				}],
				isAct: true,
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				smallFixStr: '', // 小图片后缀
				bigFixStr: '', //图片后缀
				themeColor: '',
				rightCoupon: [],
				configForm: {},
				tabCurrentId: 0, // 默认是0 推荐商家
			}
		},
		created() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.bigFixStr = this.$imageFixStr(750, 592)
			this.smallFixStr = this.$imageFixStr(80, 80)
		},
    mounted() {},
		computed: {
			merchant() {
				return this.merchantTabList[this.merchantTabCurIndex]
			}
		},
		watch: {},
		methods: {
			init(isShow = false) {
				if (!isShow) {
					this.merchantTabCurIndex = 0
				}
			},
			tabSelect(e) {
				// this.merchantTabCurIndex = e.currentTarget.dataset.id;
				this.merchantTabCurIndex = e
				this.tabCurrentId = this.merchantTabList[e].id
			},
			getPreSettleCalcApi() {

			},
			async changeTab(e) {
				console.log(e)
				this.merchantTabCurIndex = e.target.current
				this.tabCurrentId = this.merchantTabList[e.target.current].id
				if (this.merchant.pager.totalPageNum == null) {
					if (this.tabCurrentId === 2) {
						this.getPreSettleCalcApi()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*轮播图*/
	.index-home-swiper {
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
			}
		}
	}

	/*顶部搜索栏*/
	.my_header_more {
		height: 592rpx;
		// height: 400rpx;
		margin-bottom: 10rpx;

		.my_header_top {
			// background-color: $zj-color-primary;
			background-color: #f2f2f2;
			height: 100%;
			// border-radius: 0 0 10% 10%;
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
				// padding-top: 40rpx;
				// position: absolute;
				display: flex;
				align-items: center;
				z-index: 2;

				.search-box {
					width: 484rpx;
					height: 66rpx;
					margin-left: 34rpx;
					position: relative;
					z-index: 2;

					// background: rgba(0,0,0,0.18);
					.my_header_search_block {
						position: absolute;
						width: 484rpx;
						height: 100%;
						left: 0;
						top: 0;
						z-index: 1234;
					}
				}
			}

			.my_header_top_title {
				display: flex;
				justify-content: space-around;
				color: white;
				font-size: 26rpx;
				margin-top: 20rpx;
			}

			.mySwripter {
				width: 100%;
				// height: 300rpx;
				height: 592rpx;
				// margin-left: 2.5%;
				// position: absolute;
				// margin-top: 30rpx;
			}
		}
	}

	.mt36 {
		margin-top: 36rpx;
	}

	.mt24 {
		margin-top: 24rpx;
	}
</style>
