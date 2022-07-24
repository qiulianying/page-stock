<template>
	<view :style="'padding-bottom: ' + (showNumBoard ? 570 : 50) + 'rpx;'" class="shop-shop-check">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ pageLang.title }}</block>
		</cu-custom>
		<view class="page-content" @tap="hiddenNumBoard">
			<view class="shop-page-top page-card flex flex-direction">
				<view class="shop-title">
					<view class="shop-info">
						<image class="shop-img"
							:src="$util.strIsEmpty(merchantData.logo) ? '/static/images/login-grey.png' : (fileBaseURL + merchantData.logo + fixStr)"
							mode="aspectFill" @error="onErrorShopLogo(merchantData)" />
						<text class="text-bold my-textInfo">{{  merchantData.merchantName }}</text>
					</view>
					<!--跳转到用户中心：注意这里只有h5才有-->
					<!-- #ifdef H5 -->
					<view class="myToCenter" @tap="toCenter" v-if="enableMember == 1">
						<text class="cuIcon-myfill text-theme"></text>
					</view>
					<!-- #endif -->
				</view>

				<!-- 代金券、满减：注意，这里德州农商行不进行显示 -->
				<view class="shop-detail-coupon" v-show="myRegionCtn"
					v-if="(parseInt(couponList.length) > 0 || parseInt(discounList.length) > 0 )"
					@click="clickCouponList">
					<view class="shop-coupon-list" v-if="couponList.length > 0">
						<view class="shop-coupon-list-dot shop-coupon-list-dot-left"></view>
						<view class="shop-coupon-list-money">￥<text
								class="shop-coupon-list-money_num">{{couponList[0].value}}</text>
							<text v-if="couponList[0].activityStatus == 1">已领</text>
							<text v-else>{{couponList[0].goodsPrice > 0 ? '购买' : '领取'}}</text>
						</view>
					</view>
					<view class="shop-detail-coupon-discount" v-if="discounList.length > 0">
						<image src="../../static/images/tab02.png" />{{discounList[0].activityName}}
					</view>
					<view class="shop-detail-coupon-more">更多<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<!--价格输入-->
				<view class="shop-input-item" :class="showNumBoard ? ' shop-input-animation' : ''"
					@tap.stop="showNumKeyBoard">
					<text>{{ pageLang.total }} ￥</text>
					<input class="shop-x-input text-right" v-model="inputMoney" disabled value=""
						placeholder-class="shop-x-input-placeholder" :placeholder="pageLang.confirm" />
				</view>
			</view>
			<!-- 存在优惠的情况 -->
			<view class="shop-page-act-coupon">
				<!-- 存在优惠的情况，显示满减 -->
				<view v-if="payObj.activities" class="shop-page-act">
					<view v-for="(act ,actIndex) in payObj.activities" :key="actIndex" class="shop-page-act-data">
						<view class="shop-page-act-data_name">
							<image src="../../static/images/tab01.png" /> {{act.activityName}}
						</view>
						<view class="shop-page-act-data_money">- ￥{{act.discountMoney}}</view>
					</view>
				</view>
				<!-- 存在优惠的情况，显示代金券 -->
				<view v-if="payObj.useCouponInfos" class="shop-page-coupon">
					<view v-for="(coupon ,couponIndex) in payObj.useCouponInfos" :key="couponIndex"
						class="shop-page-coupon-data">
						<view class="shop-page-coupon-data-value">
							<view class="shop-page-coupon-data-value_name">
								<image src="../../static/images/tab02.png" />代金券
							</view>
							<view class="shop-page-coupon-data-value_money">- ￥{{coupon.discountMoney}}</view>
						</view>
						<view class="shop-page-coupon-data-name">
							{{coupon.couponName}}
						</view>
					</view>
				</view>
			</view>
			<!--选择支付的支付控件-->
			<pay-radio  @getSelectCard="getSelectCard" :totalMoney="payObj.payMoney" :merchantNo="merchantNo">
			</pay-radio>
			<view class="page-bottom">
				<button v-if="inputMoney == '' || inputMoney <= 0" disabled class="cu-btn"
					type="">{{ pageLang.pay }}</button>
				<!-- <button v-else-if="loadingDiscount" disabled loading class="cu-btn"
						type="">{{ pageLang.calculating }}</button> -->
				<button v-else class="cu-btn" :disabled="loading" :loading="loading" type=""
					@tap="checkPay"><text>{{ pageLang.confirmPay }}</text><text
						v-if="(selectedAccount.accountId == null ? payObj.actualMoney : payObj.payMoney) > 0"
						class="margin-left-xs">￥{{Number(inputMoney)-0.02}}</text></button>
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
		<!-- 已经领取的代金券列表 -->
		<u-popup v-model="popShow" mode="bottom" :closeable="true" height="800">
			<view v-if="couponList.length > 0 || discounList.length > 0"
				class="coupon-activity flex flex-direction page-card margin-top-sm" style="padding: 20rpx;">
				<text class="coupon-title">{{ merchantData.merchantName }}</text>
				<scroll-view scroll-y="true" style="height: 650rpx;">
					<!-- 存在优惠的情况，显示满减 -->
					<view v-if="discounList.length > 0" class="shop-page-act">
						<text class="text-bold" style="font-size: 30rpx;">满减活动</text>
						<view v-for="(act ,actIndex) in discounList" :key="actIndex" class="shop-page-act-data">
							<view class="shop-page-act-data_name">
								<image src="../../static/images/tab02.png" /> {{act.activityName}}
							</view>
						</view>
					</view>
					<!-- 存在优惠的情况，显示代金券 -->
					<view v-if="couponList.length > 0">
						<text class="text-bold" style="font-size: 30rpx;">代金券</text>
						<block v-for="(couponItem, couIndex) in couponList" :key="couIndex">
							<view class="coupon-item">
								<view class="coupon-item-left">
									<view class="ticket">
										<view class="unit">￥</view>
										<view class="num">{{ couponItem.value }}</view>
									</view>
									<view class="criteria">满{{ couponItem.discountCondition }}可用</view>
								</view>
								<view class="coupon-item-center">
									<view class="title text-cut">
										{{couponItem.name}}
										<!-- {{ item.activitySrc != null ? item.activitySrc.orgName : '' }}{{ item.favourLimit.fullFavour[0].favourMoney }}元代金券 -->
									</view>
									<view class="term">
										<template>
											<template>
												有效期{{ couponItem.availableRelative }}天
											</template>
										</template>
									</view>
									<view class="gap-top"></view>
									<view class="gap-bottom"></view>
								</view>

								<view class="coupon-item-right invalid" v-if="couponItem.activityStatus == 1">
									<button class="cu-btn" v-if="couponItem.activityStatus == 1"
										@tap="$toView('user/user-code', true)">去使用</button>
								</view>
								<view class="coupon-item-right" v-else>
									<button class="cu-btn"
										v-if="couponItem.isOpenStore === 0 || (couponItem.isOpenStore === 1 && couponItem.remainStore > 0)"
										@tap="receiveCoupon(couponItem.id, couponItem.goodsPrice > 0, couponItem.isOpenStore, couponItem.remainStore)">
										<text>{{couponItem.goodsPrice > 0 ? '购买' : '领取'}}</text>
									</button>
									<button class="cu-btn" v-else :style="{background: '#d8d8d8'}"
										@tap="receiveCoupon(couponItem.id, false, couponItem.isOpenStore, couponItem.remainStore)">
										<text>已售罄</text>
									</button>
								</view>
							</view>
						</block>

					</view>

				</scroll-view>
			</view>
		</u-popup>
		<!-- 支付密码错误弹窗 -->
		<u-modal v-model="passwordErrorShow" :content="passwordErrorContent" @confirm="confirmPassword"
			@cancel="cancelPassword" :show-cancel-button="true" cancel-text="重试" confirm-text="忘记密码"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: {
					"identity": {
						"identityId": "b4a072edbc3d47088936cf20a15b7556",
						"appType": 1,
						"openid": "ozZZB5VqdBAgO7HMAe47Nq84cE2c",
						"appid": "wx67205035cdd52bc0",
						"dataSource": 1
					},
					"extra": {
						"amount": 0,
						"pointAmount": 0,
						"collectCount": 0,
						"couponCount": 4
					},
					"member": {
						"subjectIds": ["DL1333225698034458624", "MD1413109041353330688"],
						"identityIds": ["b4a072edbc3d47088936cf20a15b7556"],
						"regionId": "9999",
						"phone": "13012345678",
						"name": "用户372ce5",
						"memberId": "7e5ddd9493b647548469101d922c34ba",
						"status": 1
					},
					"companyStaffEntity": {
						"cellStyleMap": {},
						"id": "13110533785",
						"name": "m",
						"phone": "13110533785",
						"companyName": "超汇",
						"status": 1,
						"createTime": 1625723382472
					}
				},
				enterNormal: false,
				payHref: '',
				myRegionCtn: !(this.$const.REGION_NAME[uni.getStorageSync('regionNo')]), // 这些渠道进行特殊处理
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				havePrice: false, //路由中是否存在需要支付的金额
				bank: this.$const.BANK,
				merchantNo: null,
				enableMember: null,
				merchantData: {
					"id": "MD1413109041353330688",
					"merchantName": "精彩电影",
					"merchantAlias": null,
					"openTime": "09:00",
					"closeTime": "23:00",
					"logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
					"businessLicense": "service-org-7adc24dc/20211231/7f8324b5a089496c81bf97e2d0e7f0c4.png",
					"headPhoto": "service-org-7adc24dc/20211231/634098f99ab9484d8bfb0f7744d539f1.png",
					"indoorPhotos": "{\"data\":[\"service-org-7adc24dc/20211231/cae29b9fb615417b9ce6392d224ffd1a.png\"]}",
					"pauseBusiness": 0,
					"pauseOut": null,
					"pauseScanOrder": 1,
					"pauseDirectPay": 1,
					"enablePay": 1,
					"enableAdvert": 1,
					"enableMember": 1,
					"memberDiscountRate": null,
					"institutionalSettlement": null,
					"enableCall": 1,
					"enableOrder": 1,
					"enablePeddle": 1,
					"enableTakeout": 1,
					"enableShiftChange": 0,
					"enableStorageManage": 0,
					"enableNegativeStorage": 0,
					"rightsConfig": null,
					"isDelete": 0,
					"accountInfo": {
						"weiXinPay": 3,
						"aliPay": 3,
						"unionpay": 4
					},
					"createTime": "2021-07-08 20:13:44",
					"updateTime": "2022-03-25 14:27:53",
					"createUserId": "ab1a6e905ddc41949efdfb41246c1456",
					"merchantNo": "9ZLWBzob",
					"regionNo": "DL1333225698034458624",
					"managementType": 0,
					"merchantCategory": null,
					"categoryName": null,
					"categoryArray": [{
						"merchantCategory": "7d87cedb35734128be5185ebcaf2f854",
						"categoryName": "美食",
						"level": 1,
						"loadType": null,
						"goodsTemplate": null
					}],
					"address": "软件大道89号A区双创城",
					"linkman": "",
					"linkPhone": "13599098689",
					"region": "福州软件园",
					"province": "350000",
					"country": null,
					"countryName": null,
					"city": "350100",
					"district": "350102",
					"street": null,
					"provinceName": "福建省",
					"cityName": "福州市",
					"districtName": "鼓楼区",
					"streetName": null,
					"location": {
						"lat": 26.112792972395003,
						"lon": 119.2704301872128
					},
					"space": "9ZLWBzob",
					"pid": null,
					"userId": "daefc160e23a4b35877f1826d4f99ac2",
					"openAllHours": 0,
					"openVipPay": 0,
					"merchants": null,
					"recommendLevel": null,
					"loadType": 0,
					"terminal": {
						"directpay": 1,
						"sweepcodepay": 1,
						"recorder": 1,
						"autoReceipt": 0,
						"enableTakeout": 1,
						"enablePeddle": 1,
						"enableCall": 1,
						"enableMember": 1,
						"terminalModel": 1,
						"cashierModel": 2,
						"enableFlagTerminal": 1,
						"cashWay": 1,
						"cashPay": 1,
						"enableFixedAmount": 0,
						"enableCallNum": 0,
						"enableOrderNotice": 0
					},
					"eleAuthFlag": null,
					"meituanAuthFlag": null,
					"printList": null,
					"industry": 2,
					"origin": null,
					"mchId": null,
					"appid": null,
					"startDeliveryMoney": null,
					"payAppId": null,
					"takeoutConfig": {
						"businessMode": null,
						"isOpen": null,
						"enableMemberPay": null,
						"packType": 1,
						"packFee": null,
						"deliveryType": null,
						"deliveryCost": null,
						"distanceFeeNotice": null,
						"distanceItems": null,
						"weightItems": null,
						"weightFeeNotice": null,
						"freeShipping": 39,
						"enableAutoDistribution": null,
						"timeoutDelivery": null,
						"estimatedTime": null,
						"sinceAddressItems": null,
						"singleDiscountType": null,
						"excludeFavourGoods": null,
						"excludeMemberGoods": null,
						"isMemberDiscount": null,
						"isEnjoyOrderFavour": null,
						"disCountPriorityType": null,
						"isVoucher": null,
						"isVoucherDisabled": null,
						"isDiscountCoupon": null,
						"isDiscountDisabled": null,
						"isFullCutCoupon": null,
						"isFullCutDisabled": null,
						"enableDelivery": null,
						"enableReserve": null,
						"takeoutBusinessItems": null,
						"enableSince": null,
						"takeoutSinceItems": null,
						"enableOrder": null,
						"availableStartDays": null,
						"availableEndDays": null,
						"isAddArea": null,
						"pointArr": null,
						"deliveryScopeType": null,
						"radius": null,
						"enableAutoDelivery": 0,
						"dadaSourceId": null,
						"dadaShopId": null,
						"dadaCityCode": null,
						"sinceItem": {
							"enableSince": 1,
							"takeoutSinceItems": [],
							"startDeliveryMoney": 0.01,
							"sinceAddressItems": [{
								"sinceAddress": "详见商品详情说明",
								"phone": null,
								"name": null
							}],
							"prepareTime": null,
							"remark": "以上为线下兑换地址"
						},
						"deliveryItem": {
							"enableDelivery": 1,
							"startDeliveryMoney": 0.02,
							"deliveryCost": 0,
							"feeNotice": null,
							"distanceItems": [{
								"startDistance": null,
								"endDistance": null,
								"deliveryCost": null,
								"freeShipping": null
							}],
							"estimatedTime": 30,
							"freeShipping": 39,
							"isAddArea": 0,
							"pointArr": [],
							"deliveryScopeType": 2,
							"radius": null,
							"takeoutBusinessItems": [{
								"takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
								"timeItems": null,
								"businessStartTime": "08:00:00",
								"businessEndTime": "22:00:00"
							}],
							"deliveryType": 1,
							"remark": null
						},
						"fixItem": {
							"enableDelivery": 1,
							"startDeliveryMoney": 5,
							"deliveryCost": 0,
							"feeNotice": "",
							"distanceItems": [{
								"startDistance": null,
								"endDistance": null,
								"deliveryCost": null,
								"freeShipping": null
							}],
							"addressItems": [{
								"takeoutBusinessItems": [{
									"takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
									"timeItems": [{
										"orderTime": "09:00",
										"deliveryTime": "20:30"
									}, {
										"orderTime": "21:15",
										"deliveryTime": "08:15"
									}, {
										"orderTime": "20:33",
										"deliveryTime": "22:30"
									}, {
										"orderTime": "21:20",
										"deliveryTime": "23:30"
									}],
									"businessStartTime": null,
									"businessEndTime": null
								}],
								"address": "福州市鼓楼区福州软件园A区-17号楼",
								"location": {
									"lng": 119.20326071874541,
									"lat": 26.051783569304174,
									"type": "gcj02"
								}
							}],
							"deliveryType": 1,
							"freeShipping": 1,
							"remark": ""
						},
						"isOpenPostalTakeOut": null,
						"postalMerchantNo": null,
						"notice": {
							"onlyOrderMeal": null,
							"all": null,
							"enableNotice": false,
							"onlyStore": null,
							"noticeList": []
						}
					},
					"ownerPhone": "13599098689",
					"remark": null,
					"enableOrderUnOpenTime": 1,
					"enableDiffTerminalRefund": 0,
					"enableShowInStore": 1,
					"enableRights": 0,
					"pauseTakeOut": 0,
					"activateStatus": null,
					"approvalMsg": null,
					"batchNo": null,
					"pointConfig": {
						"subjectId": null,
						"subjectType": null,
						"openVipScore": 0,
						"enablePointPay": null,
						"pointAccMode": null,
						"pointExpireDays": null,
						"pointPayPAmount": null,
						"pointPayMAmount": null,
						"pointGainPAmount": null,
						"pointGainMAmount": null,
						"pointConsumeMoney": null,
						"pointPayLimitPercent": null,
						"pointPayLimitMoney": null,
						"noArray": null
					},
					"extra": null,
					"extend": null,
					"memberConfig": {
						"enabledMemberPassword": 0,
						"enablePhonePassword": 0,
						"enableCardNoPassword": 0,
						"enablePayCodePassword": 0
					},
					"firstCategory": null,
					"secondCategory": null,
					"jxwlUserId": null,
					"brdId": null,
					"thirdMerchantId": null,
					"yiyaoConfig": null,
					"goodsTemplate": null,
					"enableWalletPay": null,
					"qrcodeMode": 1,
					"collectMode": null,
					"terminalCashMode": null,
					"digitalRestaurantStatus": null,
					"directPayAlias": null,
					"scanOrderAlias": null,
					"rightsMarketingAlias": null,
					"walletPayAlias": null,
					"mallAlias": null,
					"creditRating": null,
					"tags": null,
					"language": null,
					"enableAppoint": 1,
					"postalCode": null,
					"printMsgTemplate": null,
					"extendStr": null
				},
				showNumBoard: true,
				inputMoney: '',
				loadingDiscount: false,
				loading: false,
				timer: null,
				member: {},
				companyStaffEntity: {},
				accountList: [
					// {			//软件园员工认证之后的支付方式
					// 	type: 'WECHAT',		//微信
					// 	cardId: 'WECHAT'	//微信支付默认id情况
					// }
				], //软件园没认证的情况下或者非软件园情况下的支付方式
				selectedAccount: {},
				cardList: [
					//   {			//软件园员工认证之后的支付方式
					// 	type: 'WECHAT',		//微信
					//     		cardId: 'WECHAT'	//微信支付默认id情况
					// }
				], //软件园认证情况下的支付情况
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
				popShow: false,
				couponList: [{
					"id": "5447080f1f4048bda5f8dcfdc9a07cbe",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "zKq98sux",
					"createTime": 1648453378000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "同名测试",
					"pic": "service-org-7adc24dc/20220209/31a105e04ffb482e959faa709b40380c.png",
					"categoryRegionPath": "",
					"goodsPrice": 0,
					"isOpenStore": 0,
					"remainStore": 20,
					"saleNum": 20,
					"isRefund": 0,
					"availableType": 2,
					"availableRelative": 7,
					"categoryRightsId": "1",
					"status": 1,
					"value": 0.02,
					"discountCondition": 0.02,
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 1,
					"transactionQueryType": "1,2,3,16",
					"transactionQueryTypes": [],
					"payType": "1,2,11,12",
					"payTypes": []
				}, {
					"id": "5e07dd8b28ed4c70b147ba3ca8a4345d",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "zKq98sux",
					"createTime": 1642058528000,
					"updateTime": 1640857829000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "测试数量卷",
					"pic": "service-org-7adc24dc/20211111/5430c35a377145f4bae826237b682cca.jpg",
					"categoryRegionPath": "",
					"goodsPrice": 0,
					"isOpenStore": 1,
					"remainStore": 0,
					"maxStore": 2,
					"saleNum": 4,
					"buyLimit": 1,
					"isRefund": 1,
					"refundType": 6,
					"availableType": 2,
					"availableRelative": 2,
					"categoryRightsId": "1",
					"status": 1,
					"value": 100,
					"discountCondition": 100,
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 1,
					"transactionQueryType": "1,2,3,16",
					"transactionQueryTypes": [],
					"payType": "1,2,11,12",
					"payTypes": []
				}, {
					"id": "78c06734cc7a47ee84627798c7f75ec9",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "20y76IkT",
					"createTime": 1647308280000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"description": "<p>领卷更实惠</p>",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "测试发领卷",
					"pic": "service-org-7adc24dc/20220113/feba9013c30a4af4bd254e3f7dfd7937.jpg",
					"categoryRegionPath": "",
					"goodsPrice": 0,
					"isOpenStore": 0,
					"remainStore": 3,
					"saleNum": 12,
					"isRefund": 0,
					"availableType": 2,
					"availableRelative": 5,
					"categoryRightsId": "1",
					"status": 1,
					"instructions": "<p>领卷更实惠</p>",
					"value": 100,
					"discountCondition": 100,
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 1,
					"transactionQueryType": "1,2,3,16",
					"transactionQueryTypes": [],
					"payType": "1,2,11,12",
					"payTypes": []
				}, {
					"id": "81a6a85f71b546448519f23b56e63a25",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "zKq98sux",
					"createTime": 1645695266000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "同名测试",
					"pic": "service-org-7adc24dc/20220209/e88a475b31f449d281951b9f2e93a46b.jpg",
					"categoryRegionPath": "",
					"goodsPrice": 0,
					"isOpenStore": 0,
					"remainStore": 10,
					"saleNum": 5,
					"isRefund": 0,
					"availableType": 2,
					"availableRelative": 3,
					"categoryRightsId": "1",
					"status": 1,
					"value": 0.01,
					"discountCondition": 0.01,
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 1,
					"transactionQueryType": "1,2,3,16",
					"transactionQueryTypes": [],
					"payType": "1,2,11,12",
					"payTypes": []
				}, {
					"id": "d3c345eadfc94234b1ef858b4094006a",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "eQZpFcP2",
					"createTime": 1640850455000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "1",
					"categoryRegionPath": "",
					"goodsPrice": 1,
					"isOpenStore": 1,
					"remainStore": 111,
					"maxStore": 111,
					"saleNum": 0,
					"isRefund": 0,
					"availableType": 2,
					"availableRelative": 1,
					"categoryRightsId": "1",
					"status": 1,
					"value": 1,
					"discountCondition": 1,
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 1,
					"transactionQueryType": "1,2,3,16",
					"transactionQueryTypes": [],
					"payType": "1,2,11,12",
					"payTypes": []
				}], // 代金券列表
				passwordErrorShow: false,
				passwordErrorContent: '支付密码错误，请重试！',
				themeColor: '',
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
		async mounted() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		},
		methods: {
			toHrefOpen111() {
				let _this = this

				upsdk.pluginReady(function () {
					alert(_this.payHref)
					upsdk.appletAuth({
						success: function (data) {
							alert(data.code)
							upsdk.qrPay({
								scanQrCodeContent: _this.payHref,
								success: function (data) {
									alert(JSON.stringify(data))
									console.log(data)
								},
								fail: function (error) {
									alert(JSON.stringify(error))
									console.log(error)
								}
							})
						},
						fail: function (error) {
							alert(JSON.stringify(error))
						}
					})
				})
			},

			// 支付方式
			getSelectCard(value) {
				this.selectedCard = value
			},
			async getMerchantDetail() {
				this.enableMember = this.merchantData.enableMember
			},

			async receiveCoupon(goodsId, isToPay, isOpenStore, remainStore) {
				if (isOpenStore === 0 || (remainStore > 0 && isOpenStore === 1)) {
					// 有库存
					if (!isToPay) {
						// 领券
						uni.showToast({
							title: '领取成功'
						})
						this.popShow = false

					} else {
						// 购买
						uni.navigateTo({
							url: `/myPackageA/pages/cash-coupon?couponId=${goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`
						})
						this.popShow = false
					}

				}

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
				// this.payObj = {}
			},
			changeAccountPayType(account) {
				if (this.selectedAccount.accountId == account.accountId) {
					this.selectedAccount = {}
				} else {
					this.selectedAccount = account
					if (this.inputMoney !== '') {
						this.timerStart()
					}
				}
			},
			changeCardType(card) {
				this.selectedCard = card
			},
			onErrorShopLogo(item) {
				this.$set(item, 'logo', null)
			},
			// 点击跳转到会员中心：门店的会员中心
			toCenter() {
				this.$refs['zj-num-keyboard'].hide()
				console.log('跳转到会员中心')
				let shopInfo = {
					merchantNo: this.merchantNo,
					merchantName: this.merchantData.merchantName,
					id: this.merchantData.id,
					linkPhone: this.merchantData.linkPhone,
					origin: this.merchantData.origin,
					userId: this.merchantData.userId,
				}
				shopInfo = JSON.stringify(shopInfo)
				this.$toView(
					`/myPackageA/pages/member/index?lon=${this.location.longitude}&lat=${this.location.latitude}&shopInfo=${shopInfo}`,
					true, false, true)

			},
			checkPay() {
				console.log(12365224);
				//软件园渠道且认证通过
				// 暂时删除
				// if (this.companyStaffEntity.status === 1) {
				if (true) {
					console.log('hah');

					if (this.selectedCard && (this.selectedCard.cardId === 'WECHAT' || this.selectedCard.cardId ===
							'ALIPAY' || this.selectedCard.cardId === 'UNIONPAY' || this.selectedCard.cardId ===
							'UNIONPAYAPPLET')) {
						//选择微信的情况下
						console.log('weixin');
						this.$refs['check-password-pop'].open()
						this.doPay()
						return
					} else if (this.selectedCard && this.$store.state.enableMemberPassword !== 1) {
						//验证当前账户是否需要免密支付，只要不为1，就是免密支付
						console.log('nopassword');
						this.$refs['check-password-pop'].open()
						this.doPay()
						return
					} else {
						this.$refs['check-password-pop'].open()
					}


				} else {
					this.$refs['check-password-pop'].open()
				}
			},
			doPay() {
				// 订阅消息添加
				let _this = this
				// 消息订阅这个只在小程序上面有，所以h5在公共方法里面有判断自动返回调用后续方法
				this.$plugin.app.subscribe('consumption', {
					returnBack: res => {

						_this.timerStart(obj => {
							_this.order(obj)
						})
					}
				})

			},
			passwordInputOk(value) {
				this.password = value
				this.doPay()
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
			// 显示代金券弹窗
			clickCouponList() {
				this.popShow = true
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
			this.location.longitude = option.lon || ''
			this.location.latitude = option.lat || ''
			//获取门店号
			this.merchantNo = option.merchantNo
			//获取金额信息，如果有传入就固定相关金额，并且不能修改金额
			if (option.price && option.price !== 'false' && option.price != "undefined" && option.price != undefined) {
				this.havePrice = true

			}
			this.getMerchantDetail()
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


				.shop-detail-coupon {
					display: flex;
					margin-top: 24rpx;
					align-items: center;

					.shop-coupon-list {
						display: flex;
						font-size: 24rpx;
						align-items: center;
						position: relative;
						width: fit-content;
						// margin-left: 56rpx;
						// background-image: url;

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
								right: 4rpx;
							}
						}

						&-money {
							margin-right: 15rpx;
							font-size: 20rpx;
							// background: #ea5757;
							color: #ffffff;
							padding: 6rpx 20rpx;
							background-image: url('../../static/images/bg_ticket_nor.png');
							background-size: cover;

							&_num {
								font-size: 26rpx;
								font-weight: bold;
								margin-right: 10rpx;

							}
						}

						&-discount {
							color: red;
							display: flex;
							align-content: center;
							font-size: 26rpx;

							image {
								width: 35rpx;
								height: 35rpx;
								margin: 0 10rpx;
							}
						}

						&-more {
							padding-left: 20rpx;
						}
					}


					&-discount {
						color: red;
						display: flex;
						align-content: center;
						font-size: 26rpx;

						image {
							width: 35rpx;
							height: 35rpx;
							margin: 0 10rpx;
						}
					}

				}
			}

			.pay-type-list {
				margin-top: 20rpx;
				padding: 8px 28rpx;

				.type-item {
					height: 108rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30rpx;

					radio {
						transform: scale(0.7, 0.7);
					}
				}

				image {
					width: 56rpx !important;
					height: 56rpx !important;
					margin-right: 24rpx !important;
				}

				.tit {
					font-size: 28rpx;
					color: #303133;
					display: flex;
					align-items: center;

					.cu-tag.z {
						border-radius: 20rpx 20rpx 20rpx 0;
						color: #FFFFFF;
						font-size: 22rpx;
						height: auto;
						margin-left: 32rpx;
					}
				}

				.con {
					flex: 1;
					display: flex;
					flex-direction: column;
					font-size: 22rpx;
					color: #909399;
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
