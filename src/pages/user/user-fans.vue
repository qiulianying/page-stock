<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">粉丝</block>
		</cu-custom>
		<view class="msg-box" v-if="list.length > 0">
			<scroll-view scroll-y class="zj-dream-list-data" @scrolltolower="lower">
<!--				<view class="msg-item" v-for="(item, index) in list" :key="index" @longpress="deleteThisInfo(item, index)">

					<view class="msg-item-center">
						<view class="msg-item-center-top">
							<text>{{item.createName}}</text>
							<text>{{item.createTime ? $util.getTime(new Date(Number(item.createTime))) : '暂无时间'}}</text>
						</view>
						<text class="msg-item-center-bottom">{{item.content}}</text>
					</view>
				</view>-->

				<view class="msg-item" v-for="(item, index) in list" :key="index">
					<view class="msg-item-left">
						<image :src="item.avatar || '/static/images/head.jpg'" />
					</view>
					<view class="msg-item-center">
						<view class="msg-item-center-top">
							<text class="mylistTitle">{{item.username || item.nickname || ''}}</text>
							<text class="follow" @click="toFollow(item)">
								{{item.isFollowed == 1 ? '已关注' : '+ 关注'}}
							</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<zj-empty v-if="list.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无粉丝信息~" />
	</view>
</template>

<script>
	import {follow, getNewsPage, myFollowed} from '../../api/platformgouc'
	export default {
		data() {
			return {
				havaGet: false,
				list: [],
				params: {
					size: 30,
					current: 1
				},
				imgUrl: '',
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
			}
		},
		onLoad() {
			this.imgUrl = this.$imgUrl
			this.toSearchList()
		},
		methods: {
			lower() {
				if (this.total > this.list.length) {
					this.params.current += 1
					this.toSearchList()
				}
			},
			toSearchList() {
				myFollowed(this.params).then(res => {
					this.list = res.data.records
				})
			},
			toFollow(item) {
				follow({userId: item.id}).then(res => {
					item.isFollowed = item.isFollowed == 1 ? 0 : 1
				})
			},
		}
	}
</script>

<style lang="scss">
	.user-user-msg-page {
		.msg-box {
			background: #FFFFFF;
			.msg-item {
				padding: 32rpx;
				position: relative;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				-webkit-box-align: center;
				-webkit-align-items: center;
				align-items: center;
				&:not(:last-child):before {
					content: '';
					position: absolute;
					z-index: 2;
					bottom: 0;
					left: 32rpx;
					right: 0;
					height: 1px;
					border-bottom: 1px solid #EEEEEE;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
				}
				&-left {
					margin-right: 24rpx;
					width: 96rpx;
					height: 96rpx;
					line-height: 96rpx;
					text-align: center;
					background: #fff;
					border-radius: 50%;
					image {
						width: 100rpx;
						height: 100rpx;
						background: #fff;
						border-radius: 50%;
						border: 2rpx solid #F5F5F5;
					}
				}
				&-center {
					-webkit-box-flex: 1;
					-webkit-flex: 1;
					flex: 1;
					min-width: 0;
					&-top {
						display: flex;
						.mylistTitle {
							font-weight: 500;
							font-size: 32rpx;
							color: #333;
							flex: 1;
						}

						.follow {
							text-align: center;
							font-size: 22rpx;
							color: #8c8c8c;
							width: 95rpx;
							height: 50rpx;
							border-radius: 26rpx;
							line-height: 46rpx;
							border: 2px solid #FFD15A;
						}
					}
					&-bottom {
						color: #848689;
						font-size: 26rpx;
						line-height: 1.2;
						overflow: hidden;
						margin-top: 16rpx;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
			}
		}
	}
</style>
