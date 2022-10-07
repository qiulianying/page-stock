<template>
	<view :style="'padding-bottom: ' + (showNumBoard ? 570 : 50) + 'rpx;'" class="shop-shop-check">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">助梦金支付</block>
		</cu-custom>
		<view class="page-content" @tap="hiddenNumBoard">
			<view class="shop-page-top page-card flex flex-direction">
				<view class="shop-title">
					<view class="shop-info">
						<image class="shop-img"
							:src="'/static/images/head.jpg'"
							mode="aspectFill" />
						<text class="text-bold my-textInfo">用户名称</text>
					</view>
				</view>
				<!--价格输入-->
				<view class="shop-input-item" :class="showNumBoard ? ' shop-input-animation' : ''"
					@tap.stop="showNumKeyBoard">
					<text>助梦 ￥</text>
					<input class="shop-x-input text-right" v-model="inputMoney" disabled value=""
						placeholder-class="shop-x-input-placeholder" :placeholder="'请输入助梦金额'" />
				</view>
			</view>
			<!--选择支付的支付控件-->
			<pay-radio  @getSelectCard="getSelectCard"></pay-radio>
			<view class="page-bottom">
				<button v-if="inputMoney == '' || inputMoney <= 0" disabled class="cu-btn"
					type="">支付</button>
				<button v-else class="cu-btn" :disabled="loading" :loading="loading" type=""
					@tap="checkPay"><text>确认支付</text><text
						v-if="(selectedAccount.accountId == null ? payObj.actualMoney : payObj.payMoney) > 0"
						class="margin-left-xs">￥{{Number(inputMoney)}}</text>
				</button>
			</view>
		</view>
		<!-- 备注弹窗 -->
		<view class="shop-remark" :class="{'shop-remark-fixed' : showNumBoard}">
			<text v-if="$util.strIsEmpty(remark)" @tap="showRemarkModal">{{ pageLang.addRemark }}</text>
			<template v-else>
				<text class="text-black margin-right-xs">{{ remark }}</text>
				<text @tap="showRemarkModal">{{ pageLang.editRemark }}</text>
			</template>
		</view>
		<!-- 输入数字键盘 -->
		<zj-num-keyboard ref="zj-num-keyboard" bg-color="#E43838" @input="inputNum" @delete="doBack"
			@hide="showNumBoard = false" @pay="checkPay" />
		<zj-prompt ref="zj-prompt" :input-default-value="remark" confirm-text-color="#E43838"
			:modal-title="pageLang.addRemark" :input-placeholder="pageLang.payeeVisible" @onClickConfirm="setRemark" />
		<zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk"></zj-password-popup>
		<!-- 支付密码错误弹窗 -->
		<u-modal v-model="passwordErrorShow" :content="passwordErrorContent" @confirm="confirmPassword"
			@cancel="cancelPassword" :show-cancel-button="true" cancel-text="重试" confirm-text="忘记密码"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				enterNormal: false,
				payHref: '',
				merchantNo: null,
				enableMember: null,
				showNumBoard: true,
				inputMoney: '',
				loadingDiscount: false,
				loading: false,
				timer: null,
				member: {},
				companyStaffEntity: {},
				selectedAccount: {},
				selectedCard: {},
				password: null,
				payDiscountPromise: null,
				payObj: {
					"merchantNo": "9ZLWBzob",
					"mkOrderNo": "6a50e926-b5eb-4c5f-985e-d0c720689827",
					"billNo": "00011648518889540000042",
					"amount": 12,
					"actualMoney": 11.98,
					"discountMoney": 0.02,
					"deliveryMoney": 0,
					"payMoney": 11.98,
					"packMoney": 0,
					"goods": null,
					"useCouponInfos": [{
						"couponNo": "SPDJQ164819129545844940",
						"activityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"couponName": "同名测试",
						"discountMoney": 0.02
					}],
					"allCouponInfo": [{
						"couponNo": "SPDJQ164819129545844940",
						"activityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"parentActivityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"owner": {
							"regionName": "福州软件园",
							"regionNo": "DL1333225698034458624"
						},
						"status": 1,
						"activitySrc": {
							"orgName": "福州软件园"
						},
						"activityName": "同名测试",
						"activityLimit": {
							"scene": [1, 2, 3, 16],
							"goods": null,
							"goodsUseless": null,
							"validPeriod": {},
							"merchantSuit": null
						},
						"favourLimit": {
							"fullFavour": [{
								"minMoney": 0.02,
								"favourMoney": 0.02,
								"consume": 0.02
							}]
						},
						"couponValid": {
							"begin": "2022-03-25",
							"end": "2022-04-01"
						},
						"activityType": 0,
						"couponType": 1,
						"mkStatus": 2
					}, {
						"couponNo": "SPDJQ164845337255400310",
						"activityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"parentActivityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"owner": {
							"regionName": "福州软件园",
							"regionNo": "DL1333225698034458624"
						},
						"status": 1,
						"activitySrc": {
							"orgName": "福州软件园"
						},
						"activityName": "同名测试",
						"activityLimit": {
							"scene": [1, 2, 3, 16],
							"goods": null,
							"goodsUseless": null,
							"validPeriod": {},
							"merchantSuit": null
						},
						"favourLimit": {
							"fullFavour": [{
								"minMoney": 0.02,
								"favourMoney": 0.02,
								"consume": 0.02
							}]
						},
						"couponValid": {
							"begin": "2022-03-28",
							"end": "2022-04-04"
						},
						"activityType": 0,
						"couponType": 1,
						"mkStatus": 1
					}, {
						"couponNo": "SPDJQ164845337592870600",
						"activityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"parentActivityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"owner": {
							"regionName": "福州软件园",
							"regionNo": "DL1333225698034458624"
						},
						"status": 1,
						"activitySrc": {
							"orgName": "福州软件园"
						},
						"activityName": "同名测试",
						"activityLimit": {
							"scene": [1, 2, 3, 16],
							"goods": null,
							"goodsUseless": null,
							"validPeriod": {},
							"merchantSuit": null
						},
						"favourLimit": {
							"fullFavour": [{
								"minMoney": 0.02,
								"favourMoney": 0.02,
								"consume": 0.02
							}]
						},
						"couponValid": {
							"begin": "2022-03-28",
							"end": "2022-04-04"
						},
						"activityType": 0,
						"couponType": 1,
						"mkStatus": 1
					}, {
						"couponNo": "SPDJQ164845337858626430",
						"activityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"parentActivityId": "5447080f1f4048bda5f8dcfdc9a07cbe",
						"owner": {
							"regionName": "福州软件园",
							"regionNo": "DL1333225698034458624"
						},
						"status": 1,
						"activitySrc": {
							"orgName": "福州软件园"
						},
						"activityName": "同名测试",
						"activityLimit": {
							"scene": [1, 2, 3, 16],
							"goods": null,
							"goodsUseless": null,
							"validPeriod": {},
							"merchantSuit": null
						},
						"favourLimit": {
							"fullFavour": [{
								"minMoney": 0.02,
								"favourMoney": 0.02,
								"consume": 0.02
							}]
						},
						"couponValid": {
							"begin": "2022-03-28",
							"end": "2022-04-04"
						},
						"activityType": 0,
						"couponType": 1,
						"mkStatus": 1
					}],
					"account": {
						"accountId": "d69fbe140eb6499f9d38f3759fbc798c",
						"subjectType": 5,
						"actualMoney": 0,
						"actualPoint": 0,
						"pointDeductMoney": 0
					}
				},
				queryResultCount: 0,
				queryMaxCount: 4,
				remark: '',
				passwordErrorShow: false,
				passwordErrorContent: '支付密码错误，请重试！',
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				accountBalance: null,
				isWallet: true,
				location: {
					longitude: '',
					latitude: ''
				},
				discounList: [],
				pageTypePrice: null
			}
		},
		computed: {
			pageLang() {
				return this.$t('pages.shop.shopCheck')
			}
		},
		watch: {
			'inputMoney': {
				handler: function (curVal, oldVal) {
					if (this.inputMoney === '0' && oldVal === '') {
						this.inputMoney = '0.'
					}
					if (this.inputMoney != '0' && oldVal === '0') {
						this.inputMoney = curVal
					}
				},
				deep: true
			}
		},
		methods: {
			// 支付方式
			getSelectCard(value) {
				console.log('输出value')
				console.log(value)
				this.selectedCard = value
			},
			showNumKeyBoard() {
				// if (this.havePrice) return
				this.showNumBoard = true
				this.$refs['zj-num-keyboard'].show()
			},
			hiddenNumBoard() {
				this.$refs['zj-num-keyboard'].hide()
			},
			showRemarkModal() {
				this.$refs['zj-prompt'].showModal()
			},
			setRemark(value) {
				this.remark = value
			},
			inputNum(num) {
				if (num === '.' && this.inputMoney.indexOf(".") > 0) { //当有小数点时，再次输入时不再处理
					return
				}
				if (this.inputMoney.indexOf('.') > 0 && this.inputMoney.split('.')[1].length > 1) { //当小数位超过两位时，不再处理
					return
				}
				if (num === '.' && this.inputMoney.length == 0) { //当开始就输入.时，自动补位
					this.inputMoney = '0.';
					return
				}
				const maxMoney = 999999
				if (parseFloat(this.inputMoney + num) > maxMoney) {
					uni.showToast({
						title: this.pageLang.maxMoney.replace('${0}', maxMoney),
						icon: 'none'
					})
					return
				}
				this.inputMoney = this.inputMoney + num
				this.timerStart()
			},
			doBack() {
				this.inputMoney = this.inputMoney.substr(0, this.inputMoney.length - 1)
				if (this.inputMoney === '0') {
					this.inputMoney = ''
				}
				this.timerStart()
			},
			timerStart(callback) {
				this.timerStop()
				if (this.inputMoney === '' || parseFloat(this.inputMoney) <= 0) {
					this.unuseDiscount()
					this.loadingDiscount = false
					this.payDiscount(callback)
					return
				}
				this.loadingDiscount = true
				this.timer = setTimeout(() => {
					this.payDiscount(callback)
				}, 100)
			},
			timerStop() {
				this.$util.promiseAbort(this.payDiscountPromise)
				if (this.timer != null) {
					clearTimeout(this.timer)
				}
			},
			payDiscount(callback) {
				if (this.inputMoney === 0) {
					return
				}
				this.$util.promiseAbort(this.payDiscountPromise)
				let account = null
				if (this.selectedAccount.accountId != null) {
					account = {
						accountId: this.selectedAccount.accountId,
						subjectType: this.selectedAccount.subjectType
					}
				}
				this.loadingDiscount = true

			},
			unuseDiscount() {
			},
			changeCardType(card) {
				this.selectedCard = card
			},
			onErrorShopLogo(item) {
				this.$set(item, 'logo', null)
			},
			checkPay() {
				console.log(this.selectedCard)
				// 选择了微信支付到的情况写下
				if (this.selectedCard && (this.selectedCard.cardId === 'WECHAT')) {
					this.order()
				}
				// 弹出密码框进行输入
				// this.$refs['check-password-pop'].open()
			},
			passwordInputOk(value) {
				this.password = value
				this.order()
				uni.showToast({
					title: '支付成功',
				})
				this.$refs['check-password-pop'].close()
				uni.navigateTo({
					url: `pages/shop/shop-check-success?orderNo=123&pageTypePrice=1`
				})
			},
			/*最终支付：需要注意微信小程序*/
			order(obj) {
				this.loading = true
				let paymentList = []
				let orderObj = {
					timeStamp: '',
					nonceStr: '',
					package: '',
					signType: 'MD5',
					paySign: '',
				}
				// 如果选择的是微信支付
				if (this.selectedCard && (this.selectedCard.cardId === 'WECHAT')) {
					// 调用公共适配支付方法，底层有根据不同环境以及手机情况以及支付方法进行判断
					this.$plugin.app.requestPayment(orderObj, {
						success: res => {
							uni.hideLoading()
						},
						fail: err => {
							this.loading = false
							uni.hideLoading()
							console.log('支付失败了')
						}
					})
				}
			},
			queryOrder(billNo) {
				this.queryResultCount = 0
				uni.showLoading({
					title: '交易查询中',
					mask: true
				})
				this.queryConsumeOrder(billNo, result => {
					uni.hideLoading()
					if (result) {
						this.paySuccess(billNo)
					} else {
						uni.showToast({
							title: this.pageLang.unknownResult,
							icon: 'none'
						})
					}
					this.loading = false
				})
			},
			queryConsumeOrder(orderNo, callback) {
				this.queryResultCount++
				setTimeout(() => {
					confirm({
						transactionType: 1,
						billNo: orderNo,
						event: {
							message: '确认订单'
						}
					}, {
						hideLoading: true,
						hideMsg: true
					}).then(res => {
						let obj = res.object
						if (obj.status === 3) {
							callback(true)
						} else if (this.queryResultCount <= this.queryMaxCount) {
							this.queryConsumeOrder(orderNo, callback)
						} else {
							callback(false)
						}
					}).catch(err => {
						if (this.queryResultCount <= this.queryMaxCount) {
							this.queryConsumeOrder(orderNo, callback)
						} else {
							callback(false)
						}
						console.error(err)
					})
				}, this.queryResultCount * 1000)
			},
			paySuccess(orderNo) {
				uni.showToast({
					title: this.pageLang.paySuccess
				})
				setTimeout(() => {
					this.$nextTick(() => {

						if (this.pageTypePrice) {
							this.$toView(
								`shop/shop-check-success?orderNo=${orderNo}&pageTypePrice=${this.pageTypePrice}`,
								false, true)
						} else {
							this.$toView(`shop/shop-check-success?orderNo=${orderNo}`, false, true)
						}
					})
				}, 800)
			},
			//密码错误---重试
			cancelPassword() {
				this.$refs['check-password-pop'].open()
			},
			//密码错误---忘记密码
			confirmPassword() {
				uni.navigateTo({
					url: '/myPackageA/pages/user/user-wallet-password'
				})
				this.$refs['check-password-pop'].close()
			},

		},
		onLoad(option) {

		}
	}
</script>

<style lang="scss">
	.shop-shop-check {
		.page-card {
			background: #FFFFFF;
			border-radius: 8rpx;
			padding: 20rpx;
		}

		.page-content {
			padding: 24rpx;

			.shop-page-top {
				.shop-title {
					font-size: 36rpx;
					color: #282828;
					margin: 24rpx 0;

					.shop-info {
						float: left;

						.shop-img {
							border-radius: 50%;
							width: 80rpx;
							height: 80rpx;
							display: inline-block;
							vertical-align: middle;
							margin-right: 12rpx;
						}

						.my-textInfo {
							display: inline-block;
							vertical-align: middle;
						}
					}

					.myToCenter {
						float: right;
						margin-right: 10rpx;
						font-size: 50rpx;
						color: #ee2d28;
					}
				}

				.shop-coupon-list {
					display: flex;
					font-size: 24rpx;
					align-items: center;
					position: relative;
					width: fit-content;
					margin-left: 6rpx;

					&-dot {
						position: absolute;
						width: 20rpx;
						height: 20rpx;
						background: white;
						border-radius: 20rpx;

						&-left {
							left: -10rpx;
						}

						&-right {
							right: 76rpx;
						}
					}

					&-money {
						margin-right: 15rpx;
						font-size: 20rpx;
						background: #ea5757;
						color: #ffffff;
						padding: 10rpx 24rpx;

						&_num {
							font-size: 26rpx;
							font-weight: bold;
							margin-right: 10rpx;

						}
					}

					&-more {}
				}

				.shop-input-item {
					margin: 10rpx 6rpx 20rpx 6rpx;
					background: #F5F5F5;
					border-radius: 1rpx;
					box-sizing: border-box;
					padding: 0 32rpx;
					height: 160rpx;
					display: -webkit-box;
					display: -webkit-flex;
					display: flex;

					text {
						line-height: 160rpx;
						font-size: 28rpx;
						color: #161616;
					}

					.shop-x-input {
						line-height: 90rpx;
						height: 160rpx;
						font-size: 52rpx;
						background: transparent;
						width: 100%;
						border: 0;
						color: #E43838;
						-webkit-box-flex: 1;
						-webkit-flex: 1;
						flex: 1;

						&-placeholder {
							color: #A9A9A9;
							font-size: 36rpx;
						}
					}
				}

				.shop-input-item::after {
					content: '';
					display: block;
					width: 4rpx;
					margin: 52rpx 0;
					margin-left: 6rpx;
					margin-right: -2rpx;
					border-radius: 4rpx;
				}

				.shop-input-animation::after {
					animation: blink 1s infinite steps(1, start)
				}

				@keyframes blink {
					0% {
						background-color: transparent;
					}

					50% {
						background-color: #1C6CFE;
					}

					100% {
						background-color: transparent;
					}
				}
			}

			.page-bottom {
				margin: 40rpx auto 0;

				button {
					background: #E43838;
					border-radius: 50rpx;
					font-size: 30rpx;
					color: #FFFFFF;
					width: 100%;
					height: 96rpx;
					line-height: 96rpx;
				}
			}
		}

		.shop-remark {
			width: 100%;
			text-align: center;
			font-size: 30rpx;
			color: #E43838;
		}

		.shop-remark-fixed {
			position: fixed;
			bottom: 480rpx;
			padding: 20rpx 0;
			background-color: #F5F5F5;
		}
	}

	.coupon-activity {
		background-color: red;

		.coupon-title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 600;
			margin-top: -16rpx;
		}

		.shop-page-act {
			&-data {
				display: flex;
				padding: 30rpx;
				justify-content: space-between;

				&_name {
					display: flex;
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
						margin-right: 10rpx;
					}

				}

				&_money {
					color: red;

				}
			}
		}

		.coupon-item {
			height: 136rpx;
			margin: 10rpx 0;
			position: relative;
			overflow: hidden;
			background-color: #FFFBFB;
			display: flex;

			&-left {
				width: 150rpx;
				border-left: 1px solid #FFC3C3;
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				border-top-left-radius: 12rpx;
				border-bottom-left-radius: 12rpx;
				text-align: center;
				color: #E43838;

				.ticket,
				.criteria {
					width: 100%;
					justify-content: center;
				}

				.ticket {
					line-height: 1;
					margin-top: 26rpx;
					display: flex;
					align-items: baseline;

					.num {
						font-size: 44rpx;
					}

					.unit {
						font-size: 24rpx;
					}
				}

				.criteria {
					font-size: 20rpx;
					margin-top: 12rpx;
				}
			}

			&-center {
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				flex: 1;
				display: flex;
				flex-direction: column;
				position: relative;
				padding: 0 10rpx;
				min-width: 0;

				.title {
					padding-top: 30rpx;
					font-size: 25rpx;
					font-weight: 500;
					line-height: 1.1;
					overflow: hidden;
					flex: 1;
				}

				.term {
					font-size: 20rpx;
					color: #999999;
					height: 50rpx;
				}

				.gap-top,
				.gap-bottom {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					right: -12rpx;
					border-radius: 100%;
					background-color: #FFFFFF;
					border: 1px solid #FFC3C3;
				}

				.gap-top {
					top: -12rpx;
				}

				.gap-bottom {
					bottom: -12rpx;
				}
			}

			&-right {
				display: flex;
				flex-wrap: wrap;
				text-align: center;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
				width: 180rpx;
				color: #fff;
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				border-top: 1px solid #FFC3C3;
				border-right: 1px solid #FFC3C3;
				border-left: 1px dotted #FFC3C3;
				border-top-right-radius: 12rpx;
				border-bottom-right-radius: 12rpx;

				&.invalid {
					button {
						color: #c1c1c1;
						border: 2rpx solid #c1c1c1;
						background: #FFFFFF;
					}
				}

				button {
					height: 58rpx;
					font-size: 26rpx;
					padding: 0 28rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, #E83E3E 0%, #CD1D1D 100%);
					border-radius: 44rpx;
				}
			}
		}
	}


	.shop-page-act-coupon {
		background: white;
		margin-top: 20rpx;
		border-radius: 5rpx;

		.shop-page-act {
			&-data {
				display: flex;
				padding: 30rpx;
				justify-content: space-between;

				&_name {
					display: flex;
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
						margin-right: 10rpx;
					}

				}

				&_money {
					color: red;

				}
			}
		}

		.shop-page-coupon {
			&-data {
				&-value {
					display: flex;
					padding: 30rpx 30rpx 0rpx 30rpx;
					justify-content: space-between;

					&_name {
						display: flex;
						align-items: center;

						image {
							width: 35rpx;
							height: 35rpx;
							margin-right: 10rpx;
						}

					}

					&_money {
						color: red;

					}
				}

				&-name {
					color: red;
					padding-left: 75rpx;
					padding-bottom: 30rpx;

				}
			}
		}

	}
</style>
