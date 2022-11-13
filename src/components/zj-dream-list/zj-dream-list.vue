<template>
	<view>
		<view v-if="testIndex.length > 0" class="zj-dream-list-item"
			  v-for="(item,index) in testIndex" :key="index" @longpress="deleteThisInfo(item, index)">
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
					<!--删除按钮-->
					<view class="needTodelete" v-if="item.createBy === userId" @tap.stop="deleteThisInfo(item, index)">
						<text :class="'myCuIcon cuIcon-delete'"></text>
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
					<view class="zj-dream-informTitle" @click="toSetInfo(item, 'appreciate')">
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
						<text :class="'myCuIcon cuIcon-we'" :style="{
								color: item.isWatched === 1 ? themeColor : '',
								fontWeight: item.isWatched === 1 ? 'bold' : ''}"></text>
						<text class="cuIcon-Number">{{item.watcheNum}}</text>
					</view>
					<!--筑梦金相关金额自己的不进行展示-->
					<view class="zj-dream-informTitle"
						  @click="toSetInfo(item, 'money')"
						  v-if="item.createBy != userId">
						<text :class="'myCuIcon cuIcon-recharge'"></text>
						<!--<text class="cuIcon-Number">{{item.cashNum * 100 || 0}}元</text>-->
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showInput" mode="bottom" :closeable="true">
			<view class="myMoney">
				<view class="myMoneyTitle">为他助梦</view>
				<view class="allTypeThisInfo" @tap="toPayMoney(item, index)" v-for="(item, index) in allTypeArray" :key="index" :style="{marginRight: index === 2 || index === 5 ? 0 : '3%'}">
					<span v-if="item !== '自定义'">￥</span>{{item}}
				</view>
			</view>
		</u-popup>
		<u-modal v-model="showDelete" :content="'请确认是否删除该数据!'" @confirm="sureDelete" :async-close="true" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { putPraise, putCollect, putWatch, deleteDream } from '../../api/createdream'
	export default {
		data() {
			return {
				showDelete: false,
				allTypeArray: [1,2,5,10,50,100,'自定义'],
				showInput: false,
				userId: uni.getStorageSync('userId') || '',
				appreciate: '',
				like: '',
				forward: '',
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				commentcontent: '',	// 评论内容
				NowItem: {},
				NowIndex: 0,
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
			sureDelete() {
				// 判断不同调用不同接口
				console.log(this.NowItem)
				deleteDream(this.NowItem.id).then(res => {
					// 直接清理数组
					this.testIndex.splice(this.NowIndex, 1)
					this.showDelete = false
				})
			},
			deleteThisInfo(item, index) {
				// 只有自己创建的才有效
				if (item.isAuthor === 1) {
					this.NowIndex = index
					this.NowItem = item
					this.showDelete = true
				}
			},
			toPayMoney(item, index) {
				if (index === this.allTypeArray.length - 1) {
					this.$toView(`shop/shop-check?id=${this.NowItem.createBy}&dreamId=${this.NowItem.id}`, false, false, false)
				} else {
					this.$toView(`shop/shop-check?id=${this.NowItem.createBy}&dreamId=${this.NowItem.id}&price=${item}`, false, false, false)
				}
				this.showInput = false
			},
			toSetInfo(item, infoItem) {
				switch (infoItem) {
					//给钱
						case 'money':
							this.NowItem = item
							this.showInput = true
							break;
						// 评论
					case 'comment':
						// this.$emit('addcommnt', item)
						this.$emit('itemClick', item)
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
								this.$refs.uToast.show({
									title: '围观成功，该梦想的筑梦会通知到您!'
								})
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
					if (item.createBy == this.userId) {
						this.$toView(`index/index?tabName=4`, false, true, false)
					} else {
						this.$toView(`user/otherUser?id=${item.createBy}`, false, false, false)
					}
				}
			},
			itemClick(item) {
				this.$emit('itemClick', item)
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
		position: relative;

		.zj-dream-header {
			.needTodelete {
				position: absolute;
				right: 30rpx;
				top: 35rpx;
				z-index: 30;
				font-size: 40rpx;
			}

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
	/*弹出层搜索框*/
	.myMoney {
		height: 660rpx;
		width: 96%;
		margin: 30rpx auto;
		.myMoneyTitle {
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 80rpx;
		}
		.allTypeThisInfo {
			border-radius: 30rpx;
			text-align: center;
			display: inline-block;
			vertical-align: middle;
			width: 31%;
			margin-right: 3%;
			font-size: 48rpx;
			font-weight: 600;
			color: #333333;
			height: 120rpx;
			line-height: 120rpx;
			background: #FFFFFF;
			box-shadow: 0px 2px 17px 0px rgba(0,0,0,0.05);
			opacity: 0.98;
			border: 1rpx solid #DBDBDB;
			margin-bottom: 30rpx;
		}
	}
</style>
