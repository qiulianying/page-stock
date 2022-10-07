<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">关注</block>
		</cu-custom>
		<view class="msg-box" v-if="list.length > 0">
			<view class="msg-item" v-for="(item, index) in list" :key="index" @tap="toRouter(item)">
				<view class="msg-item-left">
					<image :src="item.avatar" class="zj-dream-imgArrayList" mode="aspectFill"
						   :lazy-load="true"/>
				</view>
				<view class="msg-item-center">
					<view class="msg-item-center-top">
						<text class="mylistTitle">{{item.nickname || item.username || '暂无名称'}}</text>
						<text class="follow" @tap.stop="toFollow(item)">取消关注</text>
					</view>
				</view>
			</view>
		</view>
		<zj-empty v-if="list.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无消息通知~" />
	</view>
</template>

<script>
	import {follow, myFollow} from '../../api/platformgouc'
	export default {
		data() {
			return {
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
			this.getmyFollow()
		},
		methods: {
			getmyFollow() {
				myFollow(this.params).then(res => {
					this.list = res.data.records
					this.total = res.data.total
				})
			},
			toRouter(item) {
				this.$toView(`user/otherUser?id=${item.id}`, false, false, false)
			},
			toFollow(item) {
				follow({userId: item.id}).then(res => {
					uni.showToast({
						title: '已取消关注!',
						icon: 'success',
						duration: 2000
					});
					this.getmyFollow()
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
					.zj-dream-imgArrayList {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
					text {
						font-size: 64rpx;
						color: #FFFFFF;
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
							padding: 0 18rpx;
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
