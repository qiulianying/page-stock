<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black">我的消息</block>
		</cu-custom>
		<view class="msg-box" v-if="list.length > 0">
			<scroll-view scroll-y class="zj-dream-list-data" @scrolltolower="lower">
				<view class="msg-item" v-for="(item, index) in list" :key="index" @longpress="deleteThisInfo(item, index)">
					<view class="msg-item-left">
						<image :src="item.createAvatar || '/static/images/head.jpg'" />
					</view>
					<view class="msg-item-center">
						<view class="msg-item-center-top">
							<text>{{item.createName}}</text>
							<text>{{item.createTime ? $util.getTime(new Date(Number(item.createTime))) : '暂无时间'}}</text>
						</view>
						<text class="msg-item-center-bottom">{{item.content}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<zj-empty v-if="list.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无消息通知~" />
		<u-modal v-model="showDelete" :content="'请确认是否删除该消息!'" @confirm="sureDelete" :async-close="true" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import { getNewsPage, deletePage } from '../../../../api/platformgouc'
	export default {
		data() {
			return {
				imgUrl: '',
				list: [],
				params: {
					size: 20,
					current: 1
				},
				total: 0, // 总数
				NowIndex: '',
				NowItem: '',
				showDelete: false
			}
		},
		created() {
			this.toSearchList()
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			sureDelete() {
				// 判断不同调用不同接口
				deletePage(this.NowItem.id).then(res => {
					// 直接清理数组
					this.list.splice(this.NowIndex, 1)
					this.showDelete = false
				})
			},
			deleteThisInfo(item, index) {
				this.NowIndex = index
				this.NowItem = item
				this.showDelete = true
			},
			lower() {
				if (this.total > this.list.length) {
					this.params.current += 1
					this.toSearchList()
				}
			},
			toSearchList() {
				getNewsPage(this.params).then(res => {
					this.list = this.list.concat(res.data.records)
					this.total = res.data.total
				})
			}
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
						text {
							&:first-child {
								font-weight: 500;
								font-size: 32rpx;
								color: #333;
								flex: 1;
							}
							&:last-child {
								text-align: right;
								font-size: 26rpx;
								color: #8c8c8c;
							}
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

	.zj-dream-list-data {
		height: calc(100vh - 170rpx - 130upx);
	}
</style>
