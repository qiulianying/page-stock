<template>
	<view>
		<scroll-view scroll-x class="zj-dream-list-data" @scrolltolower="lower">
			<view v-if="list.length > 0" class="zj-dream-list-item"
				  v-for="(item,index) in list" :key="index" @tap="itemClick(item)">
				<view class="zj-dream-header">
					<image :src="item.createAvatar" class="zj-dream-headerImg" mode="aspectFill"
						   :lazy-load="true"/>
					<view class="zj-dream-headerContent">
						<view>{{item.createName}}</view>
						<view class="zj-dream-headerContentTime">{{$util.dateFormat(new Date(Number(item.createTime)), '-')}}发布了</view>
					</view>
					<view class="zj-dream-title">{{item.title}}</view>
					<view class="zj-dream-content">{{item.content}}</view>
					<view v-for="itemImg in item.imagesArray" class="zj-dream-imgArray" v-if="item.imagesArray && item.imagesArray.length > 0">
						<image :src="spMatefileBaseURL + itemImg + fixStr" class="zj-dream-imgArrayList" mode="aspectFill"
							   :lazy-load="true"/>
					</view>
					<view class="zj-dream-informShow">
						<view class="zj-dream-informTitle" v-for="infoItem in infoArrayShowInfo(item)">
							<text :class="'myCuIcon cuIcon-' + infoItem.type"></text>
							<text class="cuIcon-Number">{{infoItem.number}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				infoArrayShow: [{
					type: 'appreciate',
					number: 0,
					name: 'praiseNum',
					text: '点赞'
				},{
					type: 'like',
					number: 0,
					name: 'collectNum',
					text: '收藏'
				},{
					type: 'comment',
					number: 0,
					name: 'commentNum',
					text: '评论'
				},{
					type: 'forward',
					number: 0,
					name: 'watcheNum',
					text: '围观'
				}]
			}
		},
		props: {
			moreTitle: {
				type: String,
				default: '更多'
			},
			list: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			infoArrayShowInfo(content) {
				this.infoArrayShow.forEach(item => {
					item.number = content[item.name]
				})
				return this.infoArrayShow
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
	.zj-dream-list-data {
		.zj-dream-list-item {
			width: 100%;
			padding: 30rpx 32rpx;

			.zj-dream-header {
				.zj-dream-headerImg {
					width: 66rpx;
					height: 66rpx;
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
	}
</style>
