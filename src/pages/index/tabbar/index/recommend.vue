<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black">我的消息</block>
		</cu-custom>
		<view class="msg-box" v-if="list.length > 0">
			<view class="msg-item" v-for="(item, index) in list" :key="index">
				<view class="msg-item-left" :style="{
					'background-color': icon[0].bgColor
				}">
					<text class="cuIcon-notificationfill"></text>
				</view>
				<view class="msg-item-center">
					<view class="msg-item-center-top">
						<text>{{item.content}}</text>
						<text>{{item.createTime ? $util.dateFormat(new Date(Number(item.createTime)), '-') : '暂无时间'}}</text>
					</view>
					<!--<text class="msg-item-center-bottom">{{item.msg}}</text>-->
				</view>
			</view>
		</view>
		<zj-empty v-if="list.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
				  text="暂无消息通知~" />
	</view>
</template>

<script>
	import { getNewsPage } from '../../../../api/platformgouc'
	export default {
		data() {
			return {
				imgUrl: '',
				icon: [{
					bgColor: '#5ec39d'
				}, {
					bgColor: '#e5392d'
				}, {
					bgColor: '#65cce2'
				}, {
					bgColor: '#e97a26'
				}, {
					bgColor: '#60c962'
				}],
				list: [],
				params: {
					size: 30,
					current: 1
				}
			}
		},
		created() {
			this.toSearchList()
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.customStyle.background = this.themeColor
		},
		methods: {
			toSearchList() {
				getNewsPage(this.params).then(res => {
					this.list = res.data.records
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
</style>
