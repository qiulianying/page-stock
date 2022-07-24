<template>
	<view class="user-recharge-record-detail-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{optionMemo}}详情</block>
		</cu-custom>

		<view v-if="visible.page" class="page-box flex flex-direction ">
			<!-- ============ 受理成功 ============ -->
			<view v-if="appStatus == 1" class="flex" style="margin-left:30rpx">
				<view class="status-during-box">

					<image class="during-img" src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638943201821/check_success.png">
					</image>
					<view class="during-note-box">
						<view class="action-text-item text-gray">发起{{detailData.memo}}申请</view>
						<view class="action-text-item text-center">
							<view style="font-size:32rpx">受理成功，银行处理中</view>
							<view class="text-gray" style="font-size:24rpx">预计10分钟内到账</view>
						</view>
						<view class="action-text-item text-bottom text-gray">
							{{detailData.memo}}{{appStatusContent[appStatus]}}
						</view>
					</view>
				</view>
			</view>
			<!-- ============ 充值成功 ============ -->
			<view v-if="appStatus == 4" class="flex">
				<view class="status-box">
					<image class="status-img" src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638904504000/green_circle.png">
					<view class="status-note">充值成功</view>
				</view>
			</view>
			<!-- ============ 失败 ============ -->
			<view v-if="appStatus == 5" class="flex">
				<view class="status-box">
					<image class="status-img" src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1638904502000/red_circle.png">
					<view class="status-note">充值失败</view>
					<view class="status-note-fail">{{errMsg}}</view>
				</view>
			</view>

			<view class="flex flex-direction info">
				<view class="action-info">
					<text class="action-info-title">{{detailData.memo}}金额</text>
					<text class="action-info-detail">¥ 0.01</text>
				</view>
				<view class="action-info">
					<text class="action-info-title">创建时间</text>
					<text
						class="action-info-detail">2022-03-30 15:20:21</text>
				</view>
				<view class="action-info">
					<text class="action-info-title">订单号</text>
					<text class="action-info-detail">20220330152021165465</text>
				</view>
			</view>

			<view class="back-btn" @click="goBack">
				完成
			</view>
		</view>


	</view>
</template>

<script>

	export default {
		data() {
			return {
				appStatus: 4,
				appStatusContent: {
					1: '受理成功',
					4: '充值成功',
					5: '失败'
				},
				visible: {
					page: true
				},
				notice: '',
				errMsg: '',
				ORDER_STATUS: this.$const.ORDER_STATUS,
				billNo: null,
				detailData: {
					memo: ''
				},
				optionMemo: '',
				id: ''
			}
		},
		methods: {
		
			// 时间格式化
			dateFormat(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},
			goBack() {
				uni.navigateBack()
			}
		},
		onLoad(option) {
			let op = JSON.parse(option.item)
			console.log('option',op)
			this.detailData.memo = option.memo
			this.billNo = JSON.parse(option.item).billNo
			this.id = JSON.parse(option.item).id
			this.optionMemo = op.memo
			if (op.memo == '提现') {
				this.appStatus = 4
				this.notice = '提现成功'
			} else if (op.memo == '充值') {
				// 根据orderType确定属于那种情况：8为充值
				if (op.orderType == 8) {
				
				}
			}
		}
	}
</script>

<style lang="scss">
	.user-recharge-record-detail-page {
		.back-btn{
			width: 300rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 90rpx;
			text-align: center;
			border: 2rpx solid #002FA7;
			color: #002FA7;
			font-weight: 400px;
			font-size: 34rpx;
			margin: 130rpx auto 0;
		}
		.page-box {
			padding: 10% 40rpx 20rpx;
			.status-during-box{
				width: 100%;
				height: 430rpx;
				display: flex;
				.during-img{
					width: 80rpx;
					height: 304rpx;
					margin-top: 50rpx;
				}
				.during-note-box{
					margin-top: 50rpx;
					height: 310rpx;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
				}
			}
			.status-box{
				width: 100%;
				height: 430rpx;
				text-align: center;
				position: relative;
				.status-img{
					width: 160rpx;
					height: 160rpx;
					margin-top: 50rpx;
				}
				.status-note{
					margin-top: 50rpx;
					font-size: 36rpx;
					font-weight: 500px;
				}
				.status-note-fail{
					color: #6A6A6A;
					font-weight: 400px;
					font-size: 28rpx;
					margin-top: 24rpx;
				}
			}
			.action-text {
				height: 460rpx;
				display: flex;
				flex-direction: column;
				position: relative;
				text-align: left;
				margin: 0 30rpx;

				&-item {
					flex: 1;
				}
			}

			.info {
				margin: 10rpx 0 20rpx;
				border-top: 4rpx solid #ececec;
				padding-top: 10rpx;

				.action-info {
					margin: 14rpx 0;
					display: flex;

					&-title {
						width: 30%;
						color: #8a8a8a;
					}

					&-detail {
						width: 100%;
						text-align: right;
					}
				}
			}


			.text-bottom {
				display: flex;
				align-items: flex-end;
			}

			.text-center {
				display: flex;
				justify-content: center;
				flex-direction: column;
				text-align: left;
			}

			image {
				width: 260rpx;
				height: 260rpx;
			}

			&-btn {
				margin: 0 15rpx;
				border-radius: 47rpx;
				font-size: 34rpx;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				display: block;
				flex: 1;
				color: $zj-color-primary;
				border: 2rpx solid $zj-color-primary;
				background: #FFFFFF;
				box-sizing: border-box;
			}

		}

		.order-detail-box {
			image {
				width: 200rpx;
				height: 200rpx;
				margin: 60rpx auto 0;
			}

			.page-list {
				margin: 60rpx 32rpx 32rpx;
				padding: 20rpx 32rpx;
				background-color: #FFFFFF;
				border-radius: 8rpx;

				view {
					padding: 18rpx 0;
					display: flex;

					text {
						font-size: 28rpx;

						&:first-child {
							color: #666666;
							padding-right: 24rpx;
						}

						&:last-child {
							text-align: right;
							flex: 1;
							word-break: break-word;
						}
					}
				}
			}
		}
	}
</style>
