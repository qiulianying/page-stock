<template>
	<view class="home-page" style="padding-bottom: 20rpx;">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black" style="margin-top: 20rpx">
				<view style="display: flex; justify-content: center;">
					<u-tabs height="40" class="myTabsInfo" v-if="showTab" :list="merchantTabList" :is-scroll="true" :font-size="28"
							:current="merchantTabCurIndex" @change="tabSelect" :active-color="themeColor"></u-tabs>
				</view>
			</block>
		</cu-custom>
		<view style="background: white;margin-top: 10rpx">
			<!-- 头部是大轮播的风格 -->
			<view class="my_header_more">
				<view class="my_header_top">
					<!--搜索-->
<!--					<view class="my_header_top_search"
						:style="{position:'absolute',height:`${CustomBar}px`,'padding-top':`${StatusBar}px`}">
						<view class="search-box">
							<view class="my_header_search_block" @click="goSearch"></view>
							<u-search :input-style='inputStyle' search-icon-color='#fff' bg-color='rgba(0,0,0,0.18)'
								placeholder-color='#fff' :placeholder="searchText" v-model="keyword"
								:show-action="false" :disabled="true">
							</u-search>
						</view>
					</view>-->
					<!-- 轮播图 -->
					<view class="mySwripter">
						<swiper style="height:320rpx;border-radius:0rpx"
							v-if="swiperList != null && swiperList.length > 0" class="index-home-swiper" autoplay
							indicator-dots indicator-active-color='#ffffff'>
							<swiper-item style="height:320rpx" v-for="(item, index) in swiperList" :key="index"
								class="index-home-swiper-item">
								<image :src="item.src" class="index-home-swiper-item-img"
									style="height:320rpx;border-radius:0rpx" mode="scaleToFill" :lazy-load="true"/>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<!-- 首页tab分类列表 -->
<!--			<view style="display: flex; justify-content: center;">
				<u-tabs v-if="showTab" :list="merchantTabList" :is-scroll="true" :font-size="30"
					:current="merchantTabCurIndex" @change="tabSelect" :active-color="themeColor"></u-tabs>
			</view>-->
		</view>
		<view class="swiper-box" style="margin-bottom:100rpx">
			<view v-if="cartList.length > 0" style="width: 100%;background-color: #ffffff">
				<scroll-view scroll-y class="zj-dream-list-data" @scrolltolower="lower">
					<zj-dream-list :key="myKey" :list="cartList" @itemClick="toShowList" @addcommnt="addcommnt" @relodLast="getDreamgodenListApi"></zj-dream-list>
				</scroll-view>
			</view>
			<zj-empty v-else :img="`${imgUrl}1639019849000/pic_shoping.png`" :shortWindows="true"
					  text="暂无数据~" />
		</view>
		<!--输入评论弹窗-->
		<u-modal v-model="showComment" v-if="showComment"
				 @confirm="confirm" :async-close="true" :title="'请输入您的评论内容'" :show-cancel-button="true">
			<view class="slot-content">
				<view class="comment-content">
					<textarea class="comment-textarea" :focus="true" maxlength="200" @input="textareaAInput" placeholder="分享你的评论, 更有机会获得关注和奖励哦"></textarea>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { getDreamgodenList, getGoldList } from '../../../../api/home'
	import {addComment} from "../../../../api/createdream";
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
				myKey: 0,
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				cartList: [],
				searchText: '搜索梦想....',
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				imgUrl: this.$imgUrl,
				showTab: true,
				isSoftware: this.$Software,
				keyword: '',
				type: 'text',
				swiperList: [{
					"style": 1,
					"title": "园区活动",
					"src": "/static/images/bg_index02.png"
				}, {
					"style": 1,
					"title": "园区活动",
					"src": "/static/images/bg_index03.png"
				}], //轮播图数据
				merchantTabCurIndex: 0,
				// 分类
				merchantTabList: [
					{
						id: 0,
						name: '进行中',
						list: []
					},
					{
						id: 1,
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
				bigFixStr: '', //图片后缀
				themeColor: '',
				tabCurrentId: 0, // 默认是0 进行中状态
				current: 1,
				size: 20,
				total: 0, // 总数
			}
		},
		created() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.bigFixStr = this.$imageFixStr(750, 320)
			console.log('重新执行')
			this.getDreamgodenListApi()
		},
		activated() {
			console.log('重新执行222')
			this.getDreamgodenListApi()
		},
    	mounted() {},
		computed: {},
		watch: {},
		methods: {
			lower() {
				if (this.total > this.cartList.length) {
					this.current += 1
					this.getDreamgodenListApi()
				}
			},
			confirm() {
				// 添加评论
				addComment({
					content: this.commentcontent,
					businessId: this.NowItem.id,
					type: 0,
					level: 0,
				}).then(res => {
					this.showComment = false;
					this.commentcontent = ''
					this.getDreamgodenListApi(true)
				})
			},
			addcommnt(item) {
				this.commentcontent = ''
				this.NowItem = item
				this.showComment = true
			},
			textareaAInput(e) {
				this.commentcontent = e.detail.value
			},
			getDreamgodenListApi(change) {
				getGoldList(`?current=${this.current}&size=${this.size}&status=${this.tabCurrentId}`).then(res => {
					if (res.data && res.data.records) {
						if (change) {
							this.cartList = res.data.records
							this.total = res.data.total
							this.myKey += 1
						} else {
							this.cartList = this.cartList.concat(res.data.records)
							this.total = res.data.total
							this.myKey += 1
						}
					}
				})
			},
			toShowList(item) {
				this.$toView(`myPackageA/pages/dream/dream-detail?id=${item.id}`, false, false, true)
			},
			init(isShow = false) {
				if (!isShow) {
					this.merchantTabCurIndex = 0
				}
			},
			tabSelect(e) {
				// this.merchantTabCurIndex = e.currentTarget.dataset.id;
				this.merchantTabCurIndex = e
				this.tabCurrentId = this.merchantTabList[e].id
				// 根据不同情况切换调用接口
				this.getDreamgodenListApi(true)
			},
			getPreSettleCalcApi() {

			},
			async changeTab(e) {
				this.merchantTabCurIndex = e.target.current
				// 根据切换的不同处理
				switch (this.merchantTabCurIndex) {
					case 0:
						this.getDreamgodenListApi()
						break;
					case 1:
						this.getDreamgodenListApi()
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myTabsInfo {
		/deep/ .u-tab-item {
			height: 30rpx !important;
			line-height: 30rpx !important;
		}
	}

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
		height: 320rpx;
		// height: 320rpx;
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
				height: 320rpx;
			}
		}
	}

	/*切换栏内容样式*/
	.swiper-box {
		.tab-content {
			.tab-listInfo {

			}
		}
	}

	.mt36 {
		margin-top: 24rpx;
	}

	.comment-content {
		width: 80%;
		margin: 0 auto;

		.comment-textarea {
			width: 100%;
			height: 360rpx;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}

	.zj-dream-list-data {
		height: calc(100vh - 490rpx - 130upx);
	}
</style>
