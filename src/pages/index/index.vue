<template>
	<view>
		<view>
			<tab-home v-if="selectedTap === tabList[0].name" :ref="'tab-' + tabList[0].name"
					  :isFresh="tabList[0].isFresh" @changeIsFresh="changeIsFresh"></tab-home>
			<tab-discount v-if="selectedTap === tabList[1].name" :ref="'tab-' + tabList[1].name"
						  :isFresh="tabList[1].isFresh" :isReachBottom="isReachBottom"></tab-discount>
			<!-- 购物车注释 -->
			<tab-recommend v-if="selectedTap === tabList[3].name" :ref="'tab-' + tabList[3].name"></tab-recommend>
			<tab-user v-if="selectedTap === tabList[4].name" :ref="'tab-' + tabList[4].name"></tab-user>
		</view>
		<!--底部导航组件-->
		<fhu-tabbar-item :tabList="tabList" :selectedTap="selectedTap" :themeColor="themeColor" @handleChangeTab="handleChangeTab"></fhu-tabbar-item>
	</view>
</template>

<script>
	import tabHome from '@/components/tabbar/index/home'
	import tabRecommend from '@/components/tabbar/index/recommend'
	import tabUser from '@/components/tabbar/index/user'
	import tabDiscount from '@/components/tabbar/index/discount'
	export default {
		components: {
			tabHome,
			tabRecommend,
			tabUser,
			tabDiscount
		},
		data() {
			return {
				backgroundStyle: {
					background: `linear-gradient(${-45}deg,#57a1e2,#0d8cfc)`
				},
				optionContent: {},
				isLoad: false,
				selectedIndex: 0,
				selectedTap: null,
				tabListCode: 2,
				tabList: [
					{
						name: 'home',
						icon: 'item01',
						title: '首页',
						barColor: 'white',
						visible: true,
						isFresh: false //是否刷新数据
					}, {
						name: 'shop',
						icon: 'item02',
						title: '权益',
						barColor: 'white',
						visible: true,
						isFresh: false
					},
					{
						name: 'shop',
						icon: 'item02',
						otherImage: '/static/images/icon/tab-code.png',
						title: '一码通',
						barColor: 'white',
						visible: true,
						isFresh: false
					},
					{
						name: 'recommend',
						icon: 'item04',
						title: '购物车',
						barColor: 'black',
						visible: true,
						isFresh: false
					},
					{
						name: 'user',
						icon: 'item05',
						title: '我的',
						barColor: 'black',
						visible: true,
						isFresh: false
					}
				],

				themeColor: '',
				themeShadow: '',
				isReachBottom: 0,
				imgUrl: '',
				nowLoading: true
			}
		},
		onReady() {
		},
		onShareAppMessage(res) {
			return {
				title: '福气满满，宝贝多多',
				path: `/pages/index/index?tabName=${0}`
			}
		},
		onShareTimeline() {
			return {
				title: '福气满满，宝贝多多',
				path: `/pages/index/index?tabName=${0}`
			}
		},
		onLoad(option) {
			this.imgUrl = this.$imgUrl
			if (option) {
				this.optionContent = option
			}
			this.isLoad = true
			if (option.tabName) {
				this.selectedIndex = option.tabName
			}
			this.handleChangeTab(this.selectedIndex)
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.themeShadow = uni.getStorageSync('themeShadow')
		},
		onShow() {
			if (this.isLoad) {
				this.handleChangeTab(this.selectedIndex, true)
			}
		},
		onReachBottom() {
			if (this.selectedTap === this.tabList[1].name) {
				// 对于发现模块，上拉要给该页面传值，加载数据
				this.isReachBottom = new Date().getTime()
			}
			if (this.$refs['tab-' + this.selectedTap].reachBottom) {
				this.$refs['tab-' + this.selectedTap].reachBottom()
			}
		},
		onPullDownRefresh() {
			var that = this;
			uni.showLoading({
				title: '下拉刷新',
				mask: true
			})
			// 下拉刷新
			// 先判断是哪个页面刷新
			setTimeout(function() {
				that.tabList[that.selectedIndex].isFresh = true
				uni.stopPullDownRefresh();
				uni.hideLoading()
			}, 1000);
		},
		methods: {
			handleChangeTab(index, isShow = false) {
				this.selectedIndex = index
				let item = this.tabList[index]
				this.selectedTap = item.name
				this.$nextTick(() => {
					if (!isShow) {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 0
						})
					}
					let barcolor = item.barColor
					if (barcolor === 'black') {
						uni.setNavigationBarColor({
							frontColor: '#000000',
							backgroundColor: '#ffffff'
						})
					} else {
						uni.setNavigationBarColor({
							frontColor: '#ffffff',
							backgroundColor: '#000000'
						})
					}
					if (this.$refs['tab-' + this.selectedTap].init) {
						this.$refs['tab-' + this.selectedTap].init(isShow)
					}
				})
			},
			// 子组件刷新完毕
			changeIsFresh(index) {
				this.tabList[index].isFresh = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F5F5F5 !important;
	}

	.showMyLoadin {
		width: 100%;
		margin-top: 300rpx;
		font-size: 40rpx;
		text-align: center;

		img {
			width: 260rpx;
			height: 260rpx;
			margin: 0 auto;
		}
	}
	.bot-code-box{
		width: 140rpx;
		height: 140rpx;
		border-radius: 140rpx;
		background: #fff;
		margin: -8rpx auto 0;
		overflow: hidden;
		.bot-code{
			width: 116rpx;
			height: 116rpx;
			border-radius: 116rpx;
			margin: 12rpx auto;
			overflow: hidden;
			.image-box{
				width: 38rpx;
				height: 36rpx;
				margin: 20rpx auto 0;
				image{
					width: 38rpx;
				}
			}
			.bot-code-note{
				font-size: 18rpx;
				margin-top: 20rpx;
				color: #fff;
			}
		}
	}
</style>
