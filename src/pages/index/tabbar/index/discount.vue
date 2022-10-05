<template>
	<view :class="isEdit ? 'pb200': 'pb100'" style="background-color: #F5F5F5;">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black">梦圈</block>
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
			<scroll-view scroll-y class="zj-dream-list-data" @scrolltolower="lower">
				<zj-dream-list :list="cartList" :key="myKey" @itemClick="toShowList" @addcommnt="addcommnt" @relodLast="toSearchList"></zj-dream-list>
			</scroll-view>
		</view>
		<zj-empty v-if="cartList.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无数据~" />

		<!--输入评论弹窗-->
		<u-modal v-model="showComment" @confirm="confirm" :async-close="true" :title="'请输入您的评论内容'" :show-cancel-button="true">
			<view class="slot-content">
				<view class="comment-content">
					<textarea class="comment-textarea" :focus="true" maxlength="200" @input="textareaAInput" placeholder="分享你的评论, 更有机会获得关注和奖励哦"></textarea>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { getDreamgodenList } from '../../../../api/home'
	import {addComment} from "../../../../api/createdream";
	export default {
		props: {},
		data() {
			return {
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				myKey: 0,
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
				size: 20,
				total: 0, // 总数
			}
		},
		watch: {},
		created() {
			this.toSearchList()
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.customStyle.background = this.themeColor
		},
		methods: {
			lower() {
				if (this.total > this.cartList.length) {
					this.current += 1
					this.toSearchList()
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
					this.toSearchList(true)
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
			inputSearch() {
				this.toSearchList(true)
			},
			toSearchList(change) {
				let params = {current: this.current, size: this.size}
				if (this.keyword) {
					params.title = this.keyword
				}
				getDreamgodenList(params).then(res => {
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
			doSearch() {

			},
			toShowList(item) {
				this.$toView(`myPackageA/pages/dream/dream-detail?id=${item.id}`, false, false, true)
			},
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
		width: 96%;
		margin: 20rpx auto 20rpx;
		background: #ffffff;
		padding-bottom: 30rpx;
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
		height: calc(100vh - 378rpx);
	}
</style>
