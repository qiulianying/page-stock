<template>
	<view class="user-user-msg-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">我的消息</block>
		</cu-custom>
		<view class="msg-box">
			<view class="msg-item" v-for="(item, index) in list" :key="index">
				<!-- <view class="msg-item-left" :style="{
					'background-color': icon[item.type-1].bgColor
				}">
					<text class="cuIcon-notificationfill"></text>
				</view> -->
				<view class="msg-item-center">
					<view class="msg-item-center-top" style="">
						<view>
							{{item.title}}
							<text v-if="item.tag"
								style="color:grey;font-weight:normal;font-size:24rpx;border:1px solid grey;padding:2rpx 6rpx;margin:10rpx">{{item.tag}}</text>
						</view>
						<view v-if="item.num>0&&!readflag" class="goods-tags-box" :style="{color: 'white', background: '#FF0000'}">
							{{item.num}}
						</view>
						<view>{{item.time}}</view>
					</view>
					<text class="msg-item-center-bottom">{{item.msg}}</text>
				</view>
			</view>
		</view>
		<view class="read-btn"> <button @click="readflag=!readflag">一键已读</button></view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				readflag:false,
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
					title: '系统提示',
					num: 1,
					tag: '',
					msg: '您有待支付订单，请及时处理。',
					time: '08：48'
				}, {
					type: 2,
					num: 1,
					tag: '商家',
					title: '智慧第一食堂',
					msg: '您成功充值 100.00 元。',
					time: '昨天 08：48'
				}, {
					type: 3,
					num: 1,
					tag: '骑手',
					title: '吴**',
					msg: '您有订餐已出餐，请及时领取。',
					time: '周五 08：48'
				}, {
					type: 4,
					num: 0,
					tag: '骑手',
					title: '金**',
					msg: '你购买的宝贝物流有变动，请及时关注。',
					time: '11月01日'
				}, {
					type: 5,
					num: 0,
					title: '金**',
					msg: '您在 2019-01-02 10：10：10 进行密码修改，如非本人操作，请及时修改密码。',
					time: '2019年01月02日'
				}]
			}
		},
		methods: {}
	}
</script>

<style lang="scss">
	.user-user-msg-page {
		.msg-box {

			.msg-item {
				background: #FFFFFF;
				margin: 30rpx;
				padding: 20rpx;
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
					border-radius: 16rpx;

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
						align-items: center;
						padding-bottom: 10rpx ;
						border-bottom: 2rpx solid #CFCEC8;

						view {
							&:first-child {
								font-weight: 500;
								font-size: 30rpx;
								color: #333;
								font-weight: bold;
								flex: 1;
							}

							&:last-child {
								text-align: right;
								font-size: 26rpx;
							}
						}
					}

					&-bottom {
						
						font-size: 26rpx;
						line-height: 1.2;
						overflow: hidden;
						margin: 20rpx 0;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
			}
		}

		.goods-tags {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			&-box {
				padding: 0 20rpx;
				height: 32rpx;
				line-height: 32rpx;
				border-radius: 32rpx;
				font-size: 20rpx;
				margin-right: 10rpx;
				display: inline-block;
			}
		}

		.read-btn {
			position: absolute;
			bottom: 0;
			width: 100%;


			button {
				background: #FFFFFF;
				padding: 20rpx;
			}

		}
	}
</style>