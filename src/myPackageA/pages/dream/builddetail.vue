<template>
	<view class="user-user-msg-page">
		<view @tap="toHideInfo">
			<cu-custom bgColor="bg-white" is-back>
				<block slot="backText" class="text-black my-testBlack">
					<image :src="DetailInfo.createAvatar" class="userImg" mode="aspectFill"
						   :lazy-load="true"/>
					<span>{{DetailInfo.createName || '我的筑梦历程'}}</span>
				</block>
			</cu-custom>

			<view style="width:100%;height:750rpx;margin:0 auto;align:center">
				<u-swiper :list="swiperList" height="750" class="detail-swiper"></u-swiper>
			</view>

			<view class="goods-detail-info">
				<view class="goods-title">
					<span>{{DetailInfo.title || '暂无标题'}}</span>
					<span class="createTime">{{$util.dateFormat(new Date(Number(DetailInfo.createTime)), '-')}} 创建</span>
				</view>
				<view class="goods-desc">{{DetailInfo.content}}</view>
				<view class="zj-dream-informShow">
					<view class="zj-dream-informTitle" v-for="infoItem in infoArrayShow"
						  @tap.stop="toSetInfo(DetailInfo, infoItem)">
						<text :class="'myCuIcon cuIcon-' + infoItem.type" :style="{
								color: DetailInfo[infoItem.needColor] === 1 ? themeColor : '',
								fontWeight: DetailInfo[infoItem.needColor] === 1 ? 'bold' : ''}"></text>
						<text class="cuIcon-Number">{{infoItem.number}}</text>
					</view>
				</view>
			</view>

			<!--详情相关评论-->
			<view class="detail-row" v-if="commentArray.length > 0">
				<view class="detail-rowTitle">热评论</view>
				<view class="commentInfo">
					<view class="commentHeader" v-for="(item, index) in commentArray" :key="index">
						<image :src="item.createAvatar" class="userImg" mode="aspectFill"
							   :lazy-load="true"/>
						<view class="headerRight">
							<view class="name">
								<view>
									{{item.createName || '暂无数据'}}
								</view>
								<!--点赞或者其他类型操作-->
								<view>
									<view class="zj-dream-informTitle" @tap="builderAppreciate(item)">
										<text :class="'myCuIcon cuIcon-appreciate'" :style="{
								color: item.isPraise === 1 ? themeColor : '',
								fontWeight: item.isPraise === 1 ? 'bold' : ''}"></text>
										<text class="cuIcon-Number" style="margin-left: 10rpx;">{{item.praise || 0}}</text>
									</view>
									<view class="zj-dream-informTitle" @tap.stop="toCommentMore(item)">
										<text :class="'myCuIcon cuIcon-comment'"></text>
										<text class="cuIcon-Number" style="margin-left: 10rpx;">{{item.comments.length || 0}}</text>
									</view>
								</view>
							</view>
							<view class="time">{{item.createTime ? $util.dateFormat(new Date(Number(item.createTime)), '-') : '暂无发布时间'}}</view>
							<view class="commentShow">{{item.content || '暂无评论'}}</view>
						</view>
						<!--二级评论-->
						<view v-for="(itemlist, itemIndex) in item.comments" :key="itemIndex" style="margin-left: 40rpx">
							<image :src="itemlist.createAvatar" class="userImg" mode="aspectFill"
								   :lazy-load="true"/>
							<view class="headerRight">
								<view class="name">
									<view>
										{{itemlist.createName || '暂无数据'}}
									</view>
									<!--点赞或者其他类型操作-->
									<view>
										<view class="zj-dream-informTitle" @tap="builderAppreciate(itemlist)">
											<text :class="'myCuIcon cuIcon-appreciate'" :style="{
								color: itemlist.isPraise === 1 ? themeColor : '',
								fontWeight: itemlist.isPraise === 1 ? 'bold' : ''}"></text>
											<text class="cuIcon-Number" style="margin-left: 10rpx;">{{itemlist.praise || 0}}</text>
										</view>
									</view>
								</view>
								<view class="time">{{itemlist.createTime ? $util.dateFormat(new Date(Number(itemlist.createTime)), '-') : '暂无发布时间'}}</view>
								<view class="commentShow">{{itemlist.content || '暂无评论'}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--底部评论输入框方式解决-->
		<view class="cu-bar input" v-if="showComment" :style="[{bottom:InputBottom+'px', marginTop: '30rpx'}]">
			<input class="solid-bottom" :adjust-position="false" :focus="showComment"
				   placeholder="只言片语也如繁星璀璨"
				   maxlength="300" cursor-spacing="10"
				   @input="textareaAInput"
				   @focus="InputFocus" @blur="InputBlur"></input>
			<button class="cu-btn bg-green shadow" @tap="confirm" :disabled="!commentcontent">发送</button>
		</view>
	</view>
</template>

<script>
	import {addComment, getDreamBuildComment, praiseComment} from '../../../api/createdream'
	import {dreambuildPraise} from '../../../api/home'
	export default {
		data() {
			return {
				InputBottom: 0,
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				commentcontent: '',	// 评论内容
				commentArray: [], // 评论列表
				nowUserIs: 'detail', // 默认评论是添加梦想评论
				nowUserType: 'detail',
				showComment: false,
				DetailInfo: {},
				infoArrayShow: [{
					type: 'appreciate',
					number: 0,
					name: 'praiseNum',
					text: '点赞',
					needColor: 'isPraise'
				},{
					type: 'comment',
					number: 0,
					name: 'commentNum',
					text: '评论'
				}],
				swiperList: []
			}
		},
		onLoad(options) {
			// 在缓存中获取筑梦信息
			this.DetailInfo = uni.getStorageSync('dreamBuildContent')
			this.infoArrayShowInfo(this.DetailInfo)
			// 进行图片组获取
			if (this.DetailInfo.files && this.DetailInfo.files.length > 0) {
				this.DetailInfo.files.forEach(item => {
					this.swiperList.push({
						image: item.url,
						title: item.fileName
					})
				})
			}
			this.id = options.id
		},
		onShow() {
			this.getDreamBuildComment()
		},
		methods: {
			toHideInfo() {
				this.showComment = false
				this.commentcontent = ''
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			// 二级评论处理
			toCommentMore(item) {
				this.showComment = true
				this.nowUserIs = 'commentMore'
				this.nowUserType = item
			},
			builderAppreciate(item) {
				// 评论点赞
				praiseComment(`?id=${item.id}`).then(res => {
					this.getDreamBuildComment()
				})
			},
			// 获取筑梦评论
			getDreamBuildComment() {
				getDreamBuildComment(this.id).then(res => {
					this.commentArray = res.data
				})
			},
			confirm() {
				// 添加评论
				let params = {
					content: this.commentcontent,
					parentId: 0,
					businessId: this.DetailInfo.id,
					type: 1,
					level: 1,
				}
				if (this.nowUserIs === 'commentMore') {
					params.parentId = this.nowUserType.id
					params.level = 2
				}
				addComment(params).then(res => {
					this.showComment = false;
					this.commentcontent = ''
					this.getDreamBuildComment()
					this.nowUserIs = 'detail'
					this.nowUserType = 'detail'
					this.infoArrayShow[1].number = Number(this.infoArrayShow[1].number) + 1
				})
			},
			textareaAInput(e) {
				this.commentcontent = e.detail.value
			},
			toSetInfo(item, infoItem) {
				switch (infoItem.type) {
						// 评论
					case 'comment':
						this.commentcontent = ''
						this.showComment = true
						break;
						// 点赞
					case 'appreciate':
						dreambuildPraise(`?id=${item.id}`).then(res => {
							this.infoArrayShow[0].number = this.DetailInfo[infoItem.needColor] === 1 ? Number(this.infoArrayShow[0].number) - 1 : Number(this.infoArrayShow[0].number) + 1
							this.DetailInfo[infoItem.needColor] = this.DetailInfo[infoItem.needColor] === 1 ? 0 : 1
						})
						break;
				}
			},
			infoArrayShowInfo(content) {
				this.infoArrayShow.forEach(item => {
					item.number = content[item.name]
				})
				return this.infoArrayShow
			},
		}
	}
</script>

<style lang="scss">
	/*头部样式*/
	.my-testBlack {
		.userImg {
			display: inline-block;
			vertical-align: middle;
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.user-user-msg-page {
		.goods-detail-info {
			background: #ffffff;
			padding: 32rpx 24rpx;

			.goods-title {
				width: 100%;
				font-size: 30rpx;
				font-weight: 500;
				color: #333;
				line-height: 1.2;
				margin: 12rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.createTime {
					text-align: right;
					font-size: 20rpx;
					font-weight: 400;
					color: #BBBBBB;
				}
			}

			.goods-desc {
				line-height: 1.2;
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
			}

			/*点赞以及评论等操作*/
			.zj-dream-informShow {
				margin-top: 20rpx;
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
						margin-left: 4rpx;
					}
				}
			}
		}

		.detail-row {
			margin-bottom: 40rpx;
			.detail-rowTitle {
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
				margin: 20rpx 0 20rpx 20rpx;
			}
			.detail-Content-all {
				width: 96%;
				margin: 0 auto;
				.detail-Content {
					padding: 20rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					border-bottom: 1px solid #BBBBBB;
					margin: 0 20rpx;
					&:last-child {
						border-bottom: none;
					}
					.detail-left {
						font-size: 20rpx;
						font-weight: 400;
						color: #BBBBBB;
						width: calc(100% - 150rpx);
						.detail-left-title {
							font-size: 24rpx;
							font-weight: 500;
							color: #333333;
						}
						.detail-left-settting {
							margin-top: 20rpx;
							.zj-dream-informTitle {
								display: inline-block;
								vertical-align: middle;
								font-size: 24rpx;
								margin-right: 40rpx;
							}
						}
					}
					.detail-right {
						width: 128rpx;
						height: 128rpx;
						img {
							border-radius: 20rpx;
							width: 100%;
							height: 100%;
						}
					}
				}

				.detailShowMore {
					.detail-left {
						width: 98%;
					}
				}
			}

			/*评论*/
			.commentInfo {
				margin: 20rpx 0 20rpx 20rpx;
				.commentHeader {
					margin-bottom: 30rpx;
					.userImg {
						display: inline-block;
						vertical-align: top;
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right: 20rpx;
						background-color: #f06060;
					}
					.headerRight {
						display: inline-block;
						vertical-align: top;
						font-size: 28rpx;
						color: #999999;
						width: 84%;

						.name {
							display: flex;
							justify-content: space-between;
							align-items: center;
						}

						.time {
							font-size: 22rpx;
						}

						.commentShow {
							font-size: 30rpx;
							color: #333333;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
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

	.page-bottom {
		button {
			margin: 60rpx 24rpx 20rpx;
			border-radius: 47rpx;
			font-size: 34rpx;
			color: #FFFFFF;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			display: block;
		}
	}
</style>
