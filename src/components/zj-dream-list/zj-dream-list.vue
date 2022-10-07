<template>
	<view>
		<view v-if="testIndex.length > 0" class="zj-dream-list-item"
			  v-for="(item,index) in testIndex" :key="index">
			<view class="zj-dream-header">
				<view @tap="itemClick(item)">
					<image :src="item.createAvatar"
						   @tap.stop="itemToDetailInfo(item)"
						   class="zj-dream-headerImg" mode="aspectFill"
						   :lazy-load="true"/>
					<view class="zj-dream-headerContent">
						<view>{{item.createName}}</view>
						<view class="zj-dream-headerContentTime">{{$util.dateFormat(new Date(Number(item.createTime)), '-')}}发布了</view>
					</view>
					<view>
						<view class="zj-dream-title">{{item.title}}</view>
						<view class="zj-dream-content">{{item.content}}</view>
						<view v-for="itemImg in item.files" class="zj-dream-imgArray" v-if="item.files && item.files.length > 0">
							<image :src="itemImg.url" class="zj-dream-imgArrayList" mode="aspectFill"
								   :lazy-load="true"/>
						</view>
					</view>
				</view>
				<!--点赞喜欢等操作-->
				<view class="zj-dream-informShow">
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'appreciate', index)">
						<text :class="'myCuIcon cuIcon-appreciate'" :style="{
								color: item.isPraise === 1 ? themeColor : '',
								fontWeight: item.isPraise === 1 ? 'bold' : ''}"></text>
						<text class="cuIcon-Number">{{item.praiseNum}}</text>
					</view>
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'like')">
						<text :class="'myCuIcon cuIcon-like'" :style="{
								color: item.isCollect === 1 ? themeColor : '',
								fontWeight: item.isCollect === 1 ? 'bold' : ''}"></text>
						<text class="cuIcon-Number">{{item.collectNum}}</text>
					</view>
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'comment')">
						<text :class="'myCuIcon cuIcon-comment'"></text>
						<text class="cuIcon-Number">{{item.commentNum}}</text>
					</view>
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'forward')">
						<text :class="'myCuIcon cuIcon-camera'" :style="{
								color: item.isWatched === 1 ? themeColor : '',
								fontWeight: item.isWatched === 1 ? 'bold' : ''}"></text>
						<text class="cuIcon-Number">{{item.watcheNum}}</text>
					</view>
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'money')" v-if="!noPayMoney">
						<text :class="'myCuIcon cuIcon-recharge'"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { putPraise, putCollect, putWatch } from '../../api/createdream'
	export default {
		data() {
			return {
				appreciate: '',
				like: '',
				forward: '',
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				myNeedKey: 0,
				testIndex: []
			}
		},
		created() {
			this.testIndex = this.list
			console.log(this.testIndex)
		},
		watch: {
			list: {
				handler(val) {
					console.log(val)
					this.testIndex = val
				},
				deep: true
			}
		},
		props: {
			noPayMoney: {
				type: Boolean,
				default: false
			},
			moreTitle: {
				type: String,
				default: '更多'
			},
			list: {
				type: Array,
				default: () => []
			},
			// 该值传入将不处理跳转个人详情
			headerNo: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			toSetInfo(item, infoItem, index) {
				switch (infoItem) {
					//给钱
						case 'money':
							this.$toView(`shop/shop-check?id=${item.item}`, false, false, false)
							break;
						// 评论
					case 'comment':
						this.$emit('addcommnt', item)
						break;
						// 点赞
					case 'appreciate':
						putPraise({
							id: item.id,
							description: 1
						}).then(res => {
							if (item.isPraise === 1) {
								item.isPraise = 0
								item.praiseNum = parseInt(item.praiseNum) - 1
							} else {
								item.isPraise = 1
								item.praiseNum = parseInt(item.praiseNum) + 1
							}
							// this.$emit('relodLast', true)
						})
						break;
						// 收藏
					case 'like':
						putCollect({
							id: item.id,
							description: 1
						}).then(res => {
							console.log(item)
							if (item.isCollect === 1) {
								item.isCollect = 0
								item.collectNum = parseInt(item.collectNum) - 1
							} else {
								item.isCollect = 1
								item.collectNum = parseInt(item.collectNum) + 1
							}
							// this.$emit('relodLast', true)
						})
						break;
						// 围观
					case 'forward':
						putWatch({
							id: item.id,
							description: 1
						}).then(res => {
							if (item.isWatched === 1) {
								item.isWatched = 0
								item.watcheNum = parseInt(item.watcheNum) - 1
							} else {
								item.isWatched = 1
								item.watcheNum = parseInt(item.watcheNum) + 1
							}
							// this.$emit('relodLast', true)
						})
						break;
				}
			},
			itemToDetailInfo(item) {
				if (this.headerNo) {
					this.itemClick(item)
				} else {
					// 跳转不同的详情页面
					if (item.createBy == uni.getStorageSync('userId')) {
						this.$toView(`index/index?tabName=4`, false, true, false)
					} else {
						this.$toView(`user/otherUser?id=${item.createBy}`, false, false, false)
					}
				}
			},
			itemClick(id) {
				this.$emit('itemClick', id)
			},
			lower(e) {
				console.log(e)
				console.log(32423423)
			}
		}
	}
</script>

<style lang="scss">
	.zj-dream-list-item {
		width: 100%;
		padding: 30rpx 32rpx;

		.zj-dream-header {
			.zj-dream-headerImg {
				width: 72rpx;
				height: 72rpx;
				display: inline-block;
				vertical-align: middle;
				border: 1px solid #D8D8D8;
				border-radius: 10rpx;
			}

			.zj-dream-headerContent {
				display: inline-block;
				vertical-align: middle;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: bold;
				color: #333333;
				margin-left: 12rpx;

				.zj-dream-headerContentTime {
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #BBBBBB;
				}
			}

			.zj-dream-title {
				margin: 15rpx 0;
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
			}

			.zj-dream-content {
				width: 100%;
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				margin-bottom: 15rpx;
				display: -webkit-box;
				-moz-box-orient: vertical;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
			}

			.zj-dream-imgArray {
				display: inline-block;
				vertical-align: middle;
				margin-right: 24rpx;
				.zj-dream-imgArrayList {
					width: 180rpx;
					height: 180rpx;
					background: #D8D8D8;
					border-radius: 9rpx;
				}
			}
		}
	}

	/*点赞以及评论等操作*/
	.zj-dream-informShow {
		width: 100%;
		.zj-dream-informTitle {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #BBBBBB;
			display: inline-block;
			vertical-align: middle;
			margin-right: 80rpx;
			&:last-child {
				margin-right: 0;
			}

			.myCuIcon {
				font-size: 36rpx;
				display: inline-block;
				vertical-align: middle;
			}

			.cuIcon-Number {
				display: inline-block;
				vertical-align: middle;
				margin-left: 10rpx;
			}
		}
	}
</style>
