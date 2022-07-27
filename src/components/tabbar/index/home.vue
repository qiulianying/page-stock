<template>
	<view class="home-page" style="padding-bottom: 20rpx;">

		<cu-custom v-if="pageHeadType == 0" bgColor="bg-theme" :isBgBlue="true">
			<block slot="content">福气满满，宝贝多多</block>
		</cu-custom>

		<view style="background: white">
			<!-- 头部是简约风格 -->
			<view v-if="pageHeadType == 0" class="my_header">
				<view class="my_header_top" :style="[{backgroundColor: themeColor}]">
					<!--搜索-->
					<view class="my_header_top_search">
						<view class="my_header_search_block" @click="goSearch"></view>
						<u-search :placeholder="searchText" v-model="keyword" :show-action="false" :disabled="true">
						</u-search>
					</view>
					<!-- 轮播图 -->
					<view class="mySwripter">
						<swiper style="height:300rpx;border-radius:10rpx"
							v-if="swiperList != null && swiperList.length > 0" class="index-home-swiper" autoplay
							indicator-dots indicator-active-color='#ffffff'>
							<swiper-item style="height:300rpx" v-for="(item, index) in swiperList" :key="index"
								class="index-home-swiper-item">
								<!-- :src="fileBaseURL + item.url" -->
								<image :src="item.src" class="index-home-swiper-item-img"
									style="height:300rpx;border-radius:10rpx" mode="aspectFill" :lazy-load="true"
									@click="toCouponDetail(item.link.id, item.type, item)" />
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<!-- 头部是大轮播的风格 -->
			<view v-if="pageHeadType == 1" class="my_header_more">
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
			<!-- 分类列表 -->
			<!-- 分类数量小于等于4个时，使用flex布局自动排列 -->
			<view v-if="categoryList.length > 0 && categoryList.length <= 4" class="index-home-cate"
				:class="pageHeadType == 1? 'index-home-cate-more' : ''">
				<view class="index-home-cate-outbox">
					<view v-for="(item,index) in categoryList" :key="index" class="index-home-cate-item"
						@click="handleClickMenu(index)">
						<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
						<!-- :src="fileBaseURL + item.icon + fixStr" -->
						<image style="width:100rpx;height:100rpx;border-radius:50rpx"
							:src="item.icons" />
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 分类列表 -->
			<!-- 分类数量大于4个时 -->
			<view v-if="categoryList.length > 0 && categoryList.length > 4" class="index-home-cate"
				:class="pageHeadType == 1? 'index-home-cate-more' : ''">
				<view class="more-than-four-box">
					<view v-for="(item,index) in categoryList" :key="index" class="more-than-four-box-item"
						@click="handleClickMenu(index)">
						<image style="width:80rpx;height:80rpx;border-radius:80rpx"
							:src="fileBaseURL + item.icon + smallFixStr" />
						<view class="box-name">{{item.name}}</view>
					</view>
				</view>
			</view>
			<!-- 开通钱包：存在用户手机号且作为软件园项目的时候才会存在钱包的情况 -->
			<view class="index-home-purse" @click="handleClickPurse">
				<image mode="widthFix" src="../../../static/images/purse_tab.png" />
			</view>
			<view class="index-home-title" :style="{marginTop: categoryList.length > 0 ? '32rpx' : '52rpx'}"
				v-if="isAct">热门活动</view>
			<!-- 一张图片的情况 -->
			<view class="index-home-cover" v-if="isAct && actList.length === 1">
				<image src="/static/images/bg_hot11.png" @click="gotoCoupon(actList[0].id)" mode="widthFix" />
			</view>
			<!-- 两张图片的情况 -->
			<view class="index-home-two" v-if="isAct && actList.length === 2">
				<image :src="actList[0].icon ? `${spMatefileBaseURL}${actList[0].icon}` : ''"
					@click="gotoCoupon(actList[0].id)" mode="widthFix" />
				<image style="margin-left: 16rpx" :src="actList[1].icon ? `${spMatefileBaseURL}${actList[1].icon}` : ''"
					@click="gotoCoupon(actList[1].id)" mode="widthFix" />
			</view>
			<!-- 三张图片的情况 -->
			<view class="index-home-three" v-if="isAct && actList.length >= 3">
				<!-- :src="actList[0].icon ? `${spMatefileBaseURL}${actList[0].icon}` : ''" -->
				<image class="index-home-three-img" src="/static/images/bg_hot31.png" @click="gotoCoupon(actList[0].id)"
					mode="widthFix" />
				<view class="index-home-three-imgs">
					<image src="/static/images/bg_hot32.png" @click="gotoCoupon(actList[1].id)" mode="widthFix" />
					<image src="/static/images/bg_hot33.png" @click="gotoCoupon(actList[2].id)" mode="widthFix" />
				</view>
			</view>
			<!-- 热门活动底下的热门商家 -->
			<view class="index-hot" v-if="isAct && hotShopList.length > 0" style="margin-top:36rpx;">
				<scroll-view scroll-x="true" class="hot-scroll-box">
					<view class="hot-box" :class="hotShopList.length>4?'hot-box-gap':''"
						v-for="(item, index) in hotShopList" :key="index" @click="goHotActivity(item)">
						<view class="hot-shop-logo">
							<image class="hot-shop-logo-img"
								:src="$util.strIsEmpty(item.icon) ? '/static/images/login-grey.png' : (fileBaseURL + item.icon + fixStr)"
								@error="onErrorShopIcon(item)" />
						</view>
						<view class="hot-shop-name">
							<text>{{item.name}}</text>
							<!-- 这个view是圆弧 -->
							<view class="hot-shop-name-circle"></view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 首页tab分类列表 -->
			<view style="display: flex; justify-content: center;" :class="!isAct ? 'mt36' : 'mt24'">
				<u-tabs v-if="showTab" :list="merchantTabList" :is-scroll="true" :font-size="30"
					:current="merchantTabCurIndex" @change="tabSelect" :active-color="themeColor"></u-tabs>
			</view>
		</view>
		<swiper :current="merchantTabCurIndex" class="swiper-box" duration="300" @change="changeTab"
			style="margin-bottom:100rpx">
			<!-- :style="{ height: merchantSwiperHeight + 'px' }" -->
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in merchantTabList" :key="tabIndex">

				<!-- 代金券 -->
				<view :class="'merchant-swiper-item-' + tabItem.id" v-if="tabItem.id === 2">
					<view class="index-shop">
						<view v-for="couponItem in tabItem.list" :key="couponItem.id" class="index-shop-item">
							<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
							<image class="index-shop-item-logo"
								:src="$util.strIsEmpty(couponItem.pic) ? '/static/images/login-grey.png' : (fileBaseURL + couponItem.pic + fixStr)"
								mode="aspectFit" @error="onErrorShopLogo(couponItem)"
								@tap="$toView(`/myPackageA/pages/cash-coupon?couponId=${couponItem.id}&lat=${location.latitude}&lon=${location.longitude}`, true, false, true)" />
							<view class="index-shop-item-box coupon-mid"
								@tap="$toView(`/myPackageA/pages/cash-coupon?couponId=${couponItem.id}&lat=${location.latitude}&lon=${location.longitude}`, true, false, true)">
								<view class="index-shop-item-title text-black text-2line">{{couponItem.name}}</view>
								<view class="text-2line" style="height: auto;" v-if="couponItem.discountCondition">
									消费满{{couponItem.discountCondition}}元可用</view>
							</view>
							<view class="index-shop-item-btn coupon-mid" style="align-items: center">
								<view style="font-size: 30rpx; color: red"><text
										style="font-size: 36rpx; font-weight: bold;">{{couponItem.realPrice}}</text>元
								</view>
								<view style="text-decoration: line-through" v-if="couponItem.value">
									{{couponItem.value}}元</view>
								<view v-if="couponItem.isOpenStore === 1 && couponItem.remainStore > 0"><button
										class="coupon-mid-btn" :style="{background: `${themeColor}`}"
										@click="clickCoupon(couponItem.realPrice > 0, couponItem.id)">{{ couponItem.realPrice > 0 ? '购买' : '领取' }}</button>
								</view>
								<view v-else-if="couponItem.isOpenStore === 1 && couponItem.remainStore <= 0">已售罄</view>
								<view v-else-if="couponItem.isOpenStore === 0"><button class="coupon-mid-btn"
										:style="{background: `${themeColor}`}"
										@click="clickCoupon(couponItem.realPrice > 0, couponItem.id)">{{ couponItem.realPrice > 0 ? '购买' : '领取' }}</button>
								</view>
							</view>
						</view>
					</view>
					<zj-empty v-if="tabItem.loaded && (tabItem.list == null || tabItem.list.length === 0)"
						:img="`${imgUrl}1639019849000/pic_search.png`" text="暂无代金券" :shortWindows="true" />
					<uni-load-more v-else :status="tabItem.status"></uni-load-more>
				</view>


				<!-- 推荐商家、收藏 -->
				<view  v-else>
					<view class="index-shop">
						<view v-for="shopItem in tabItem.list" :key="shopItem.id" class="index-shop-item"
							@tap="$toView(`shop/shop-detail?merchantNo=${shopItem.merchantNo}`)">
							<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
							<image class="index-shop-item-logo"
								:src="$util.strIsEmpty(shopItem.logo) ? '/static/images/login-grey.png' : (fileBaseURL + shopItem.logo + fixStr)"
								mode="aspectFit" @error="onErrorShopLogo(shopItem)" />
							<view class="index-shop-item-box">
								<view class="index-shop-item-title text-black">{{ shopItem.merchantName||'商户名' }}</view>
								<view class="index-shop-item-type">
									<text class="cuIcon- zjIcon-tag_type"
										style="font-size: 30rpx;vertical-align: middle;"></text>
									<text class="margin-left-xs">分类名称</text>
									<!-- {{ shopItem.categoryArray[shopItem.categoryArray.length - 1].categoryName||'21323' }} -->
								</view>
								<view class="index-shop-item-address text-black">
									<text>{{ shopItem.address ||'商户地址'}}</text>
									<text>1.5km</text>
									<!-- {{ $util.getDistance(location.latitude, location.longitude, shopItem.location.lat, shopItem.location.lon) }} -->
								</view>
								<template v-if="shopItem.favList != null && shopItem.favList.length > 0">
									<view v-for="(item, index) in shopItem.favList" :key="index"
										class="index-shop-item-fav">
										<zj-icon>券</zj-icon>{{ item.title }}
									</view>
								</template>
							</view>
						</view>
					</view>
					<!-- <zj-empty v-if="tabItem.loaded && (tabItem.list == null || tabItem.list.length === 0)"
						:img="`${imgUrl}1639019849000/pic_search.png`" text="暂无相关门店" :shortWindows="true" />
					<uni-load-more v-else :status="tabItem.status"></uni-load-more> -->
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		orgHomeConfig,
	} from '../../../api/infouser'
	import Payment from '../../../components/payment/index'

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
				myRegionCtn: !(this.$const.REGION_NAME[uni.getStorageSync('regionNo')]), // 这些渠道进行特殊处理
				searchText: !(this.$const.REGION_NAME[uni.getStorageSync('regionNo')]) ? '搜索门店....' : '搜索代金券....',
				pageHeadType: 1,
				showSearch: true,
				scrollTop: 0,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				imgUrl: this.$imgUrl,
				showTab: true,
				account: {},
				member: {},
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
				hotShopList: [{
					"acName": "百亿补贴",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20211224/133676c8cbf04a7084317ffe2e6846a3.png",
					"name": "拼多多",
					"appletUrl": "pages/home/home",
					"appletAppid": "wxeff36bec97901729",
					"acticon": [{
						"url": "service-org-7adc24dc/20211224/84cc566a383d4264b8d642adac7fa8ad.png"
					}, {
						"url": "service-org-7adc24dc/20211224/99ccc927876548fa8d27169b6cbb2e3a.png"
					}],
					"id": 0,
					"isShowButton": true,
					"radio": "1"
				}, {
					"h5Url": "https://spdev.51zcm.cc/manageweb/",
					"acName": "买咖啡送大礼包",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20211224/7a146dea2d3041dfa5b677272759a1dd.png",
					"name": "瑞幸咖啡",
					"acticon": [{
						"url": "service-org-7adc24dc/20211224/483252e44d6e42efb0df045b49f7026c.png"
					}, {
						"url": "service-org-7adc24dc/20211224/3b653e7ef108458b8c19e98fd1528ae1.png"
					}],
					"id": 1,
					"isShowButton": true,
					"url": "https://spdev.51zcm.cc/manageweb/",
					"radio": "2"
				}, {
					"acName": "面包大作战",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20211224/8cc84bb700894f9bacf37b9b6a6b4518.png",
					"name": "玛法面包",
					"acticon": [{
						"url": "service-org-7adc24dc/20211224/b585154d2ea2452aa198fd917a4c352a.png"
					}, {
						"url": "service-org-7adc24dc/20211224/d34ebc9f36174f5ebc0f3c6db347ac87.png"
					}, {
						"url": "service-org-7adc24dc/20211224/7762009de9ba4ae795efe20bb3405e80.png"
					}],
					"id": 2,
					"isShowButton": false
				}, {
					"acName": "活动页面",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20211224/9e48c5a3e69a47c180e5d7d33c5de8ad.png",
					"name": "DIGITAL",
					"acticon": [{
						"url": "service-org-7adc24dc/20211224/8eb180ca53584145bd09e92aad5965a0.png"
					}, {
						"url": "service-org-7adc24dc/20211224/d81ed891b8f44c179d049b51b6d1414f.png"
					}, {
						"url": "service-org-7adc24dc/20211224/dca6b661cb294881b4a92ee7fe150a80.png"
					}],
					"id": 3,
					"isShowButton": false
				}, {
					"acName": "中国移动",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20211224/a547e184ff61421ca87f43855d3ea4ce.png",
					"name": "中国移动",
					"acticon": [{
						"url": "service-org-7adc24dc/20211224/b1fa880491c544678ba00a137a6ade6c.png"
					}, {
						"url": "service-org-7adc24dc/20211224/55df6b2cf0d342c69eb83b0dadc5a32a.png"
					}],
					"id": 4,
					"isShowButton": true,
					"url": "https://www.baidu.com/"
				}, {
					"acName": "吃货嘉年华",
					"shoprightList": [],
					"icon": "service-org-7adc24dc/20220105/a6e3843a374c43dab6da556c831fb7c6.png",
					"name": "春节特惠",
					"acticon": [{
						"url": "service-org-7adc24dc/20220105/74a32bf1b4a84d99925cb79b3fda5614.png"
					}],
					"id": 5,
					"isShowButton": false,
					"radio": "1"
				}], // 热门商家数据
				categoryList: [{
					"icon": "service-org-7adc24dc/20220106/f18dd5a4111c4d309b6e1713ebf10c06.png",
					"icons": "/static/images/icon_foods.png",
					"name": "美食",
					"merchantList": [{
						"name": "中石化软件园",
						"id": "MD1341936492251058176",
						"type": 1,
						"merchantNo": "20y76IkT"
					}, {
						"name": "精彩电影",
						"id": "MD1413109041353330688",
						"type": 1,
						"merchantNo": "9ZLWBzob"
					}, {
						"name": "企业家共享洽谈室test",
						"id": "MD1413093137122988032",
						"type": 1,
						"merchantNo": "sTUuuhN9"
					}]
				}, {
					"icon": "service-org-7adc24dc/20220106/40050cd6716148e3a7a4035d39637656.png",
					"icons": "/static/images/icon_supermarket.png",
					"name": "电影",
					"merchantList": [{
						"name": "咳嗽药",
						"id": "91840445a5a92912c8491de32afc5035",
						"type": 2
					}, {
						"name": "青霉素",
						"id": "54bab45fb408b02ef070d60113dc03e6",
						"type": 2
					}, {
						"name": "感冒药",
						"id": "21aca4ce977b7a69cbb59c077070b4f8",
						"type": 2
					}]
				}, {
					"icon": "service-org-7adc24dc/20220304/22ff8eef835b41fd8b7ec79f450ccaf5.png",
					"icons": "/static/images/icon_hotel.png",
					"name": "酒店",
					"merchantList": []
				}, {
					"icon": "service-org-7adc24dc/20220304/2ff6fa6e1b0543afb47cde24beb63020.png",
					"icons": "/static/images/icon_sports.png",
					"name": "运动",
					"merchantList": []
				}, {
					"icon": "service-org-7adc24dc/20220304/2381f9906a4144ea9356a7675cff50f6.jpg",
					"icons": "/static/images/icon_fruit.jpg",
					"name": "水果",
					"merchantList": []
				}, {
					"icon": "service-org-7adc24dc/20220304/7e1f2a0215d140ccb2b0b6b8fd2334ee.png",
					"icons": "/static/images/icon_entertaiment.png",
					"name": "娱乐",
					"merchantList": []
				}, {
					"icon": "service-org-7adc24dc/20220304/13dc8dca9102497f951e3b6cc0558e5a.png",
					"icons": "/static/images/icon_snacks.png",
					"name": "零食",
					"merchantList": []
				}, {
					"icon": "service-org-7adc24dc/20220304/69a449dffabb428f98c2df139ecb7ab6.jpg",
					"icons": "/static/images/icon_movies.jpg",
					"name": "音乐",
					"merchantList": []
				}],

				categoryName: '',
				categoryIndex: '',
				categoryMerchantId: [],

				merchantSwiperHeight: 0,
				merchantTabCurIndex: 0,
				merchantTabList: [{
						name: '推荐商家',
						loaded: false,
						status: 'more',
						pager: {
							curPageNum: 0
						},
						list: [{
							address: "软件大道89号A区双创城",
							createTime: "2021-07-08 20:13:44",
							district: "350102",
							districtName: "鼓楼区",
							createUserId: "ab1a6e905ddc41949efdfb41246c1456",
							city: "350100",
							cityName: "福州市",
							closeTime: "23:00",
							enableAdvert: 1,
							enableAppoint: 1,
							enableCall: 1,
							enableDiffTerminalRefund: 0,
							enableMember: 1,
							enableNegativeStorage: 0,
							enableOrder: 1,
							enableOrderUnOpenTime: 1,
							enablePay: 1,
							enablePeddle: 1,
							enableRights: 0,
							enableShiftChange: 0,
							enableShowInStore: 1,
							enableStorageManage: 0,
							enableTakeout: 1,
							headPhoto: "service-org-7adc24dc/20211231/634098f99ab9484d8bfb0f7744d539f1.png",
							id: "MD1413109041353330688",
							indoorPhotos: {
								"data": ["service-org-7adc24dc/20211231/cae29b9fb615417b9ce6392d224ffd1a.png"]
							},
							location: {
								lat: 26.112792972395003,
								lon: 119.2704301872128
							},

							updateTime: "2022-03-25 14:27:53",
							userId: "daefc160e23a4b35877f1826d4f99ac2",
							ownerPhone: "13599098689",
							industry: 2,
							institutionalSettlement: null,
							isDelete: 0,
							logo: "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
							merchantName: "精彩电影",
							merchantNo: "9ZLWBzob",
							province: "350000",
							provinceName: "福建省",
							qrcodeMode: 1,
							region: "福州软件园",
							regionNo: "DL1333225698034458624",
							businessLicense: "service-org-7adc24dc/20211231/7f8324b5a089496c81bf97e2d0e7f0c4.png",
							categoryArray: {
								categoryName: "美食",
								goodsTemplate: null,
								level: 1,
								loadType: null,
								merchantCategory: "7d87cedb35734128be5185ebcaf2f854",
							},

						}]
					},

					{
						id: 2,
						name: '代金券',
						loaded: false,
						status: 'more',
						pager: {
							curPageNum: 0
						},
						list: [{
							discountCondition: 1.01,
							goodsPrice: 0,
							id: "44fa34e4657c4c769202e53981c502aa",
							isOpenStore: 1,
							name: "代金券202203",
							payType: "1,2,11,12",
							payTypes: ['1', '2', '11', '12'],
							pic: "service-org-7adc24dc/20211216/32d15c25d8164cb08f2383534d8976e9.png",
							pics: ["service-org-7adc24dc/20220125/2a68df9269e649e8afd1e7a7ef3ae5b6.png"],
							realPrice: 0,
							remainStore: 9987,
							saleNum: 13,
							transactionQueryType: "1,2,3,16",
							transactionQueryTypes: ['1', '2', '3', '16'],
							value: 1,
						}]
					}, {
						name: '收藏',
						loaded: false,
						status: 'more',
						pager: {
							curPageNum: 0
						},
						list: []
					}
				],
				titleType: [{
						name: '便民利民'
					},
					{
						name: '安全保障'
					},
					{
						name: '快捷服务'
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
				timer: ''
			}
		},
		mounted() {
			// 监听页面滚动，先隐藏
			// var that = this;
			// uni.$on('onPageScroll', function(data) {
			// 	console.log("页面滚动了")
			// 	console.log(data);
			// 	that.scrollTop = data;
			// 	if (that.scrollTop <= 200) {
			// 		that.showSearch = true
			// 	} else {
			// 		that.showSearch = false
			// 	}
			// 	console.log('this.showSearch', that.showSearch)
			// });
		},
		created() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.bigFixStr = this.$imageFixStr(750, 592)
			this.smallFixStr = this.$imageFixStr(80, 80)
		},
		computed: {
			merchant() {
				return this.merchantTabList[this.merchantTabCurIndex]
			}
		},
		components: {
			Payment
		},
		watch: {
			'merchant.list': {
				handler(val) {
					const className = ".merchant-swiper-item-" + this.tabCurrentId
					this.initSwiperHeight(className)
				},
				immediate: true
			},
			isFresh: {
				handler(val) {
					if (val) {
						this.init()
						this.$emit('changeIsFresh', 0)
					}
				}
			}
		},
		methods: {
			init(isShow = false) {
				if (!isShow) {
					let _this = this
					this.merchantTabCurIndex = 0
					this.$nextTick(() => {
						// this.tabCurrentId = 0
						//获取轮播图// 分类列表 //热门活动图片
						_this.orgHomeConfig()
					})
				}
			},
			initSwiperHeight(list) {
				this.$nextTick(() => {
					uni.createSelectorQuery().in(this).select(list).boundingClientRect(data => {
						if (this.merchant) {
							if (this.merchant.list == null || this.merchant.list.length === 0) {
								this.merchantSwiperHeight = 300
							} else {
								this.merchantSwiperHeight = data ? data.height + 20 : 500
							}
						}
					}).exec()
				})
			},
			reachBottom() {
				let _this = this
				if (!this.merchant || !this.merchant.pager && this.merchant.pager.curPageNum === 0) {
					return
				}
				if (this.merchant.status === 'loading' || this.merchant.loaded && (this.merchant.list == null || this
						.merchant.list.length === 0)) {
					return
				}
				if (this.merchant.pager.curPageNum >= this.merchant.pager.totalPageNum) {
					return
				}
			},
			onErrorShopIcon(item) {
				this.$set(item, 'icon', null)
			},
			onErrorShopLogo(item) {
				this.$set(item, 'logo', null)
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
			},
			orgHomeConfig() {
				let res = {
					"errcode": "0",
					"errmsg": "ok",
					"object": {
						"id": "DL13061536544952238081",
						"subjectId": "DL1306153654495223808",
						"subjectType": 1,
						"signPicture": null,
						"aliasName": null,
						"createTime": 1640682900917,
						"updateTime": 1646121346177,
						"modules": [{
							"type": "array",
							"name": "actLogo",
							"dataSource": {
								"actLogo": [{
									"shoprightList": [],
									"icon": "service-org-7adc24dc/20211229/5c37d8d098434841beea40bb91a0ac8c.png",
									"appletUrl": "pages/home/home",
									"appletAppid": "wxeff36bec97901729",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/8ef81886a27f4ffa9732aa4db9b0a843.png"
									}, {
										"url": "service-org-7adc24dc/20211229/8226f0da62234212b3d2b1c76929154c.png"
									}, {
										"url": "service-org-7adc24dc/20211229/dbbb45a368204f48a5277923d87b2127.png"
									}],
									"radio": "1",
									"acName": "百亿补贴",
									"name": "拼多多",
									"id": 0,
									"isShowButton": true
								}, {
									"shoprightList": [],
									"icon": "service-org-7adc24dc/20211229/ac4014f2145b4f538d0132e42a391dd6.png",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/ba89bc1ba1a64a53ad9e7094a51aecd9.png"
									}, {
										"url": "service-org-7adc24dc/20211229/d373feed3d01472b8dfeda35bca0f62e.png"
									}, {
										"url": "service-org-7adc24dc/20211229/487dec5e0f55454e99e40d59f6c5a8b7.png"
									}],
									"radio": "2",
									"h5Url": "https://spdev.51zcm.cc/manageweb/",
									"acName": "麦咖啡",
									"name": "瑞幸咖啡",
									"id": 1,
									"isShowButton": true
								}, {
									"shoprightList": [],
									"icon": "service-org-7adc24dc/20211229/2a397db8b7d14fd8a1a46e8d3fe36c8b.png",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/41da2f5e073b41a7b7df2f1107771ff9.png"
									}],
									"radio": "1",
									"acName": "买面包",
									"name": "面包屑",
									"id": 2,
									"isShowButton": false
								}, {
									"shoprightList": [],
									"icon": "service-org-7adc24dc/20211229/6cf654ac74c04ceaa6e7dc53bac98b83.png",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/d926ce8cbd974be89c1e2d09fafc34bb.png"
									}],
									"radio": "1",
									"acName": "移动手机",
									"name": "移动",
									"id": 3,
									"isShowButton": false
								}, {
									"shoprightList": [],
									"icon": "service-org-7adc24dc/20211229/9a9b34a17b684a99942b460775beb3fe.png",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/cfee7f8257664831be4a7f42947ff3ff.png"
									}],
									"radio": "1",
									"acName": "活动页面",
									"name": "DIGITAL",
									"id": 4,
									"isShowButton": false
								}]
							}
						}, {
							"type": "array",
							"name": "swiper",
							"dataSource": {
								"swiper": [{
									"link": {},
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/68abc6dda2c14865b23c8228ba9598ec.png"
									}, {
										"url": "service-org-7adc24dc/20211229/766fff7628f44fc2ae08ee408f24e908.png"
									}],
									"title": "活动",
									"type": 4,
									"url": "service-org-7adc24dc/20211229/2cadc894dfd447feac0868d17d6cde35.png",
									"radio": "2",
									"h5Url": "https://spdev.51zcm.cc/manageweb/",
									"style": 1,
									"isShowButton": true
								}, {
									"link": {
										"name": "星巴克（三坊七巷店）",
										"id": "MD1338381597984034816",
										"merchantNo": "HpAJ4phN"
									},
									"acticon": [],
									"title": "哈哈哈哈哈",
									"type": 1,
									"url": "service-org-7adc24dc/20211229/2ba470d335604423a300dcd1688bd330.png",
									"radio": "1",
									"style": 1,
									"isShowButton": false
								}, {
									"link": {
										"name": "99元代金券",
										"id": "41ffad53890049dd844fc8ae0a6861b7"
									},
									"acticon": [],
									"title": "代金券",
									"type": 2,
									"url": "service-org-7adc24dc/20211229/5d29bcc9c3024dcd89ca2828efdd465c.png",
									"radio": "1",
									"style": 1,
									"isShowButton": false
								}, {
									"link": {
										"name": "自有权益测试2",
										"id": "3abd67ddd12842e0aaac18d3c7aa9828"
									},
									"acticon": [],
									"title": "权益",
									"type": 3,
									"url": "service-org-7adc24dc/20211229/c841995a19ec41dda22e7b032a1e8085.png",
									"radio": "1",
									"style": 1,
									"isShowButton": false
								}, {
									"link": {},
									"appletUrl": "pages/home/home",
									"appletAppid": "wxeff36bec97901729",
									"acticon": [{
										"url": "service-org-7adc24dc/20211229/c28825da202b41f1ba1055fb0be903ad.png"
									}, {
										"url": "service-org-7adc24dc/20211229/309807b9cd084b1f92f452c7ec75e1ba.png"
									}],
									"title": "小程序",
									"type": 4,
									"url": "service-org-7adc24dc/20211229/34c64b8d8ee04b978e9845769c01282c.png",
									"radio": "1",
									"style": 1,
									"isShowButton": true
								}, {
									"link": {},
									"acticon": [],
									"title": "483758435",
									"type": 0,
									"url": "service-org-7adc24dc/20220104/db807e0acb2d44f4a06a77da9b99a62e.png",
									"radio": "1",
									"style": 1
								}],
								"style": 1
							}
						}, {
							"type": "array",
							"name": "act",
							"dataSource": {
								"act": [{
									"shoprightList": [{
										"payTypes": [],
										"remainStore": 100,
										"transactionQueryTypes": [],
										"pic": "service-org-7adc24dc/20211207/46a7bc51a797462aae300727cd1c732f.jpg",
										"saleNum": 0,
										"isOpenStore": 1,
										"goodsPrice": 0.02,
										"maxStore": 100,
										"name": "yy测试",
										"id": "06abc4fdb6ff4aeab55b4ed47353a1b5",
										"pics": [
											"service-org-7adc24dc/20211207/46a7bc51a797462aae300727cd1c732f.jpg"
										],
										"realPrice": 0.02
									}],
									"icon": "service-org-7adc24dc/20220105/7e4af1358d2847e288c5cba12f3d0cc8.png",
									"acticon": "service-org-7adc24dc/20220105/dda6d8b2856346cb949e1714e34870ae.png",
									"id": 0
								}, {
									"shoprightList": [{
										"payTypes": [],
										"remainStore": 0,
										"transactionQueryTypes": [],
										"saleNum": 0,
										"isOpenStore": 0,
										"goodsPrice": 11,
										"name": "测试导入",
										"id": "e2751182a97f46daa81ae90289b785e4",
										"pics": [],
										"realPrice": 11
									}],
									"icon": "service-org-7adc24dc/20211229/019649fec4df4bfd9d6bbd124dc16ccb.png",
									"acticon": "service-org-7adc24dc/20211229/d793868d80424ad784d4b1426ccfbc85.png",
									"id": 1
								}, {
									"shoprightList": [{
										"payTypes": [],
										"remainStore": 0,
										"transactionQueryTypes": [],
										"saleNum": 0,
										"isOpenStore": 0,
										"goodsPrice": 0.01,
										"maxStore": 0,
										"name": "电影票劵",
										"id": "04fd1ce9ac57437187dd341f5c19d6f0",
										"pics": [],
										"realPrice": 0.01
									}],
									"icon": "service-org-7adc24dc/20211229/aad191fc4846430b823075a8fd5cfdfb.png",
									"acticon": "service-org-7adc24dc/20211229/46711f15b15d4f25805365d5eed1a2cc.png",
									"id": 2
								}]
							}
						}, {
							"type": "array",
							"name": "category",
							"dataSource": {
								"category": [{
									"icon": "service-org-7adc24dc/20211229/79cadd673efb4c1586dec542bbce6bef.png",
									"name": "超市",
									"merchantList": [{
										"type": 1,
										"name": "中石化（马尾店）",
										"id": "MD1338308401427517440",
										"merchantNo": "cwukfZjq"
									}, {
										"type": 1,
										"name": "QM50",
										"id": "MD1470315971007877120",
										"merchantNo": "398a7PTU"
									}, {
										"type": 1,
										"name": "中石化（马尾店）",
										"id": "MD1481445938391289856",
										"merchantNo": "o3QA9wvH"
									}]
								}, {
									"icon": "service-org-7adc24dc/20211229/a5ae8e265ef5492fa65afd4982878739.png",
									"name": "活动",
									"merchantList": []
								}, {
									"icon": "service-org-7adc24dc/20211229/dab557cd319445b88d017fec22ea040e.png",
									"name": "美食",
									"merchantList": []
								}, {
									"icon": "service-org-7adc24dc/20211229/495fe3b37c5d4602913618ef9d7b8a22.png",
									"name": "美发",
									"merchantList": []
								}, {
									"icon": "service-org-7adc24dc/20220301/78007e808ea14134958ce303296ad47e.png",
									"name": "电影",
									"merchantList": [{
										"type": 1,
										"name": "丞相坊社区服务卫生站",
										"id": "MD1412244266620686336",
										"merchantNo": "uo9BkTGq"
									}]
								}, {
									"icon": "service-org-7adc24dc/20220301/c71138efd46a4fc9806acba55da0565a.png",
									"name": "保健",
									"merchantList": []
								}, {
									"icon": "service-org-7adc24dc/20220301/863ad3164b93480b99dc42ed585c05d7.png",
									"name": "加油",
									"merchantList": []
								}, {
									"icon": "service-org-7adc24dc/20220301/af637d355f5d4a2cb2a1e3fbee16d360.png",
									"name": "景点",
									"merchantList": []
								}]
							}
						}],
						"configForm": {
							"shop": "{\"name\":\"推荐商家\",\"show\":1,\"id\":0}",
							"ticket": "{\"name\":\"代金劵\",\"show\":1,\"id\":2}",
							"like": "{\"name\":\"收藏商家\",\"show\":1,\"id\":3}",
							"right": "{\"name\":\"推荐优惠\",\"show\":1,\"id\":1}"
						}
					}
				}
				const modules = res.object != null ? res.object.modules : null
				if (modules != null && modules.length > 0) {
					let swiperObj = modules.find(item => item.name === 'swiper')
					if (swiperObj != null) {
						this.swiperList = [{
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
						}]
						this.pageHeadType = swiperObj.dataSource.style || 0 // 如果没有设置风格，默认显示为0(简约风)
					}


					let actObj = modules.find(item => item.name === 'act')
					if (actObj != null) {
						if (actObj.dataSource.act.length !== 0) {
							this.isAct = true
							// this.actList = actObj.dataSource.act.find(i => i.id ===0)
							this.actList = actObj.dataSource.act
						}
					}
					let actLogoObj = modules.find(item => item.name === 'actLogo')
					if (actLogoObj != null) {
						if (actLogoObj.dataSource.actLogo.length !== 0) {
							this.isAct = true
							// this.hotShopList = actLogoObj.dataSource.actLogo
						}
					}
					this.configForm = res.object.configForm || {}
					// 解决key值顺序问题
					const newKey = Object.keys(this.configForm).sort()
					let newObj = {}
					for (let i = 0; i < newKey.length; i++) {
						newObj[newKey[i]] = this.configForm[newKey[i]]
					}
				}
			},
			toView(page) {
				this.$toView(page)
			},
			gotoCoupon(id) {
				this.$toView(
					`/myPackageA/pages/coupon/index?lon=${this.location.longitude}&lat=${this.location.latitude}&imgId=${id}`,
					true, false, true)
			},
			goHotActivity(item) {
				item.fileBaseURL = this.fileBaseURL
				let activeInfo = encodeURIComponent(JSON.stringify(item))
				this.$toView(
					`/myPackageA/pages/activity/index?lon=${this.location.longitude}&lat=${this.location.latitude}&activeInfo=${activeInfo}`,
					true, false, true)

			},
			clickCoupon(isBuy, goodsId) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {

						// if (uni.getStorageSync('mspIsMember')) {
						// 如果登陆了
						if (isBuy) {
							this.$toView(
								`/myPackageA/pages/cash-coupon?couponId=${goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`,
								true, false, true)
						} else {
							// 领取优惠券
							uni.showToast({
								title: '领取成功',
								duration: 3000,
								icon: 'success'
							})
							uni.navigateTo({
								// url: '/pages/user/user-coupon-list'
								// url: '/myPackageA/pages/userCoupon/user-coupon-list'
								url: '/myPackageA/pages/userCoupon/user-coupon-all'
							})

						}
					},
					1000)


			},
			goSearch() {
				uni.navigateTo({
					url: `/myPackageA/pages/searchPage/index?lon=${this.location.longitude}&lat=${this.location.latitude}`
				})
			},
			inputSearch({
				curPageNum = 1,
				merchantName = this.keyword
			} = {}) {
				this.merchantName = this.keyword;

			},
			async handleClickMenu(index) {
				// if(index === 0 || index === 3){
				this.categoryName = this.categoryList[index].name
				this.categoryIndex = index

				this.toGoodListView(this.categoryName, this.categoryIndex, this.categoryMerchantId)
				// }

			},
			toGoodListView(name, index, mid) {
				this.$toView(`shop/list-detail?categoryName=${name}&categoryIndex=${index}&categoryMerchantId=${mid}`,
					true)
			},
			handleClickPurse() {
				uni.navigateTo({
					url: `/myPackageA/pages/purse`,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-load-more {
		height: 200rpx !important;
	}

	.nav .cu-item.cur {
		border-bottom: none;
		position: relative;
		// color: $zj-color-primary;

		&::before {
			content: "";
			width: 40rpx;
			height: 8rpx;
			background: $zj-color-primary;
			position: absolute;
			bottom: 0;
			left: 50%;
			display: block;
			margin-left: -20rpx;
		}
	}

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


	.index-home-cate-more {
		// padding: 26rpx 0 0!important;
		padding: 18rpx 24rpx 8rpx !important;
		background: white;
		border-radius: 20rpx !important;
		position: relative;
		z-index: 2;
		width: 704rpx;
		min-height: 216rpx;
		margin: -85rpx auto 0 !important;
		box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.05);
	}

	.index-home-cate {
		padding: 64rpx 22rpx 22rpx;
		background: white;
		border-radius: 6rpx;
		overflow: hidden;

		.type-scroll-box {
			white-space: nowrap;

			.type-scroll-box-item:last-child {
				margin-right: 0 !important;
			}

			.type-scroll-box-item {
				font-size: 26rpx;
				color: #333333;
				width: 148rpx;
				text-align: center;
				display: inline-block;
				margin-right: 12rpx;

				image {
					width: 102rpx;
					height: 102rpx;
					margin-bottom: 24rpx;
				}
			}
		}

		&-outbox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
		}

		// margin: 24rpx;
		&-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26rpx;
			color: #333333;
			width: 150rpx;
			text-align: center;
		}

		.more-than-four-box {
			display: flex;
			justify-content: flex-start;
			// justify-content: space-between;
			flex-wrap: wrap;
			min-height: 216rpx;

			// padding: 12rpx;
			.more-than-four-box-item {
				margin-right: 58rpx;
				width: 120rpx;
				text-align: center;

				.box-name {
					margin: -8rpx auto 10rpx;
					font-size: 24rpx;
				}
			}

			.more-than-four-box-item:nth-child(4n) {
				margin-right: 0 !important;
			}

			image {
				width: 80rpx !important;
				height: 80rpx !important;
				margin-bottom: 0 !important;
			}
		}

		image {
			width: 102rpx;
			height: 102rpx;
			margin-bottom: 24rpx;
		}
	}

	.index-home-purse {
		width: 96%;
		margin: 40rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 6rpx;

		image {
			width: 100%;
			// height: 144rpx;
		}
	}

	.index-home-title {
		margin-left: 34rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.index-home-cover {
		margin: 16rpx 32rpx;
		border-radius: 8rpx;
		display: flex;
		overflow: hidden;

		image {
			width: 100%;
			height: 260rpx !important;
		}
	}

	.index-home-two {
		margin: 16rpx 32rpx;
		// border-radius: 8rpx;
		display: flex;
		justify-content: space-between;

		image {
			flex: 1;
			width: 100%;
			height: 166rpx !important;
		}

	}

	.index-home-three {
		margin: 16rpx 32rpx;
		// border-radius: 8rpx;
		display: flex;
		justify-content: space-between;

		image {
			flex: 1;
			width: 100%;
			height: 364rpx !important;
		}

		&-imgs {
			margin-left: 12rpx;
			flex: 1;

			image {
				height: 176rpx !important;
			}
		}
	}

	.index-hot {
		// width: 705rpx;
		width: 100%;
		height: 196rpx;
		// border: 2rpx solid black;
		overflow: hidden;

		.scroll-hidden {
			overflow: hidden !important;
		}

		.hot-scroll-box {
			padding: 0;
			box-sizing: border-box;
			white-space: nowrap;

			.hot-box:first-child {
				margin-left: 22rpx !important;
			}

			.hot-box:last-child {
				margin-right: 22rpx !important;
			}

			.hot-box-gap {
				margin-right: 18rpx !important;
			}

			.hot-box {
				width: 154rpx;
				height: 196rpx;
				border-radius: 20rpx 20rpx 0 0;
				border: 2rpx solid #F6F6F6;
				box-sizing: border-box;
				display: inline-block;
				margin-right: 30rpx;

				.hot-shop-logo {
					width: 100%;
					height: 154rpx;
					border-radius: 20rpx;
					background: #F6F6F6;
					z-index: 9;
					position: relative;
					text-align: center;

					.hot-shop-logo-img {
						width: 100rpx;
						height: 100rpx;
						margin-top: 18rpx;
						// background-color: #D8D8D8;
					}
				}

				.hot-shop-name {
					width: 100%;
					height: 72rpx;
					line-height: 100rpx;
					background: #fff;
					margin-top: -36rpx;
					z-index: 10;
					position: relative;
					overflow: hidden;
					color: #000000;
					font-weight: 400px;
					font-size: 24rpx;
					text-align: center;
					text-overflow: ellipsis;
					padding: 0 10rpx;

					.hot-shop-name-circle {
						border-radius: 0 0 50% 50%;
						width: 100%;
						height: 52rpx;
						line-height: 54rpx;
						left: 0;
						top: -30rpx;
						position: absolute;
						background: #F6F6F6;
					}
				}
			}
		}
	}

	.index-shop {
		margin: 24rpx;

		&-item {
			margin-bottom: 20rpx;
			padding: 32rpx 20rpx;
			border-radius: 16rpx;
			background: #FFFFFF;
			display: flex;

			&-logo {
				width: 144rpx;
				height: 144rpx;
				border-radius: 8rpx;
				border: 2rpx solid #F5F5F5;
			}

			&-box {
				flex: 1;
				margin-left: 24rpx;
			}

			.coupon-mid {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.coupon-mid-btn {
					background-color: #34A2E8;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					font-size: 30rpx;
					padding: 0 35rpx;
					color: white;
				}

			}

			&-title {
				margin-top: 2rpx;
				height: 44rpx;
				font-size: 34rpx;
				font-weight: 500;
				line-height: 44rpx;
				overflow: hidden;
			}

			&-type,
			&-fav,
			&-address {
				height: 34rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #666666;
				line-height: 34rpx;
				margin-top: 16rpx;
			}

			&-address {
				display: flex;

				text {
					&:first-child {
						flex: 1;
						overflow: hidden;
						margin-right: 6rpx;
					}
				}
			}
		}
	}

	/*顶部搜索栏简约版*/
	.my_header {
		// height: 540rpx;
		height: 400rpx;
		margin-bottom: 10rpx;

		.my_header_top {
			// background-color: $zj-color-primary;
			height: 360rpx;
			border-radius: 0 0 10% 10%;
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
				padding-top: 40rpx;
				position: relative;

				.my_header_search_block {
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					z-index: 1234;
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
				width: 95%;
				height: 300rpx;
				margin-left: 2.5%;
				position: absolute;
				margin-top: 30rpx;
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

	.home_types {
		width: 95%;
		margin: 0rpx 2.5%;
		padding: 2rpx 0;
		background-color: white;
		border-radius: 10rpx;
	}

	.text-2line {
		margin-top: 2rpx;
		height: 83rpx;
		font-size: 28rpx;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.mt36 {
		margin-top: 36rpx;
	}

	.mt24 {
		margin-top: 24rpx;
	}
</style>
