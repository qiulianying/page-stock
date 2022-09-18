<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white">
			<block slot="backText" class="text-black">我的消息</block>
		</cu-custom>
		<view class="msg-box">
			<view class="msg-item" v-for="(item, index) in list" :key="index">
				<view class="msg-item-left" :style="{
					'background-color': icon[item.type-1].bgColor
				}">
					<text class="cuIcon-notificationfill"></text>
				</view>
				<view class="msg-item-center">
					<view class="msg-item-center-top">
						<text>{{item.title}}</text>
						<text>{{item.time}}</text>
					</view>
					<text class="msg-item-center-bottom">{{item.msg}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				list: [{
					type: 1,
					title: '订单通知',
					msg: '您有待支付订单，请及时处理。',
					time: '08:48'
				}, {
					type: 2,
					title: '交易通知',
					msg: '您成功充值 100.00 元。',
					time: '昨天 08:48'
				}, {
					type: 3,
					title: '取餐通知',
					msg: '您有订餐已出餐，请及时领取。',
					time: '周五 08:48'
				}, {
					type: 4,
					title: '物流通知',
					msg: '你购买的宝贝物流有变动，请及时关注。',
					time: '11-01 08:48'
				}, {
					type: 5,
					title: '服务通知',
					msg: '您在 2019-01-02 10:10:10 进行密码修改，如非本人操作，请及时修改密码。',
					time: '2019-01-02 08:48'
				}]
			}
		},
		methods: {
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
