<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">我的筑梦</block>
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
					  @click="toSetInfo(DetailInfo, infoItem)">
					<text :class="'myCuIcon cuIcon-' + infoItem.type" :style="{
								color: DetailInfo[infoItem.needColor] === 1 ? themeColor : '',
								fontWeight: DetailInfo[infoItem.needColor] === 1 ? 'bold' : ''}"></text>
					<text class="cuIcon-Number">{{infoItem.number}}</text>
				</view>
			</view>
		</view>

		<view class="detail-row">
			<view class="detail-rowTitle">历程</view>
			<view class="detail-Content-all" style="background-color: white;margin-top: 14rpx;border-radius: 20rpx 20rpx 0 0;">
				<view class="detail-Content">
					<view class="detail-left">
						<view class="detail-left-title">
							今天午饭没吃,我要饿瘦
						</view>
						<view>2022-04-13 19:00</view>
						<view class="detail-left-settting">
							<view class="zj-dream-informTitle">
								<text :class="'myCuIcon cuIcon-appreciate'"></text>
								<text class="cuIcon-Number">20</text>
							</view>
							<view class="zj-dream-informTitle">
								<text :class="'myCuIcon cuIcon-comment'"></text>
								<text class="cuIcon-Number">20</text>
							</view>
						</view>
					</view>
					<view class="detail-right"></view>
				</view>
			</view>
		</view>

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
	import {addComment, DreamDetail, putCollect, putPraise, putWatch, getDreamComment} from '../../../api/createdream'
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				DetailInfo: {},
				infoArrayShow: [{
					type: 'appreciate',
					number: 0,
					name: 'praiseNum',
					text: '点赞',
					needColor: 'isPraise'
				},{
					type: 'like',
					number: 0,
					name: 'collectNum',
					text: '收藏',
					needColor: 'isCollect'
				},{
					type: 'comment',
					number: 0,
					name: 'commentNum',
					text: '评论'
				},{
					type: 'forward',
					number: 0,
					name: 'watcheNum',
					text: '围观',
					needColor: 'isWatched'
				}],
				swiperList: []
			}
		},
		onLoad(options) {
			this.id = options.id
			this.DreamDetailFun()
			this.getDreamComment()
		},
		methods: {
			getDreamComment() {
				getDreamComment(this.id).then(res => {
					console.log(res)
				})
			},
			DreamDetailFun() {
				// 获取详情接口
				DreamDetail(this.id).then(res => {
					this.DetailInfo = res.data
					this.infoArrayShowInfo(res.data)
					// 进行图片组获取
					if (res.data.files && res.data.files.length > 0) {
						res.data.files.forEach(item => {
							this.swiperList.push({
								image: item.url,
								title: item.fileName
							})
						})
					}
				})
			},
			confirm() {
				// 添加评论
				addComment({
					content: this.commentcontent,
					parentId: 0,
					businessId: this.NowItem.id,
					type: 0,
					level: 0,
				}).then(res => {
					this.showComment = false;
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
						this.NowItem = item
						break;
						// 点赞
					case 'appreciate':
						putPraise({
							id: item.id
						}).then(res => {
							this.DetailInfo[infoItem.needColor] = this.DetailInfo[infoItem.needColor] === 1 ? 0 : 1
							this.DreamDetailFun()
						})
						break;
						// 收藏
					case 'like':
						putCollect({
							id: item.id
						}).then(res => {
							this.DetailInfo[infoItem.needColor] = this.DetailInfo[infoItem.needColor] === 1 ? 0 : 1
							this.DreamDetailFun()
						})
						break;
						// 围观
					case 'forward':
						putWatch({
							id: item.id
						}).then(res => {
							this.DetailInfo[infoItem.needColor] = this.DetailInfo[infoItem.needColor] === 1 ? 0 : 1
							this.DreamDetailFun()
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
						margin-left: 10rpx;
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
					padding: 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.detail-left {
						font-size: 20rpx;
						font-weight: 400;
						color: #BBBBBB;
						.detail-left-title {
							font-size: 24rpx;
							font-weight: 500;
							color: #333333;
						}
						.detail-left-settting {
							.zj-dream-informTitle {
								display: inline-block;
								vertical-align: middle;
								font-size: 24rpx;
								margin-right: 20rpx;
							}
						}
					}
					.detail-right {
						width: 128rpx;
						height: 128rpx;
						background: #D8D8D8;
						border-radius: 9rpx;
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
</style>
