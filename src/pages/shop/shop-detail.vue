<template>
	<view class="shop-shop-detail">
		<cu-custom bgColor="bg-white" is-back @tap="toIndex" :goBack="false">
			<block slot="backText" class="text-black">门店详情</block>
		</cu-custom>
		<view class="page-content">
			<view class="shop-detail-box page-card">
				<view class="shop-info flex">
					<!-- 为了不影响页面加载速度，图片采用缩略图，加后缀fixStr -->
					<image class="shop-info-logo"
						:src="$util.strIsEmpty(detailData.logo) ? '/static/images/login-grey.png' : (fileBaseURL + detailData.logo + fixStr)"
						mode="aspectFit" @error="onErrorShopLogo(detailData)" />
					<view class="shop-info-box flex-sub">
						<view class="shop-info-title text-black">{{ detailData.merchantName ||'商户名称'}}</view>
						<view class="shop-info-type">
							<text class="cuIcon- zjIcon-tag_type"
								style="font-size: 30rpx;vertical-align: middle;"></text>
							<text class="margin-left-xs">电影</text>
							<!--** {{ detailData.categoryArray[detailData.categoryArray.length - 1].categoryName||'分类名称' }} -->
						</view>
					</view>
					<!-- 收藏图标 -->
					<view class="shop-collect-box margin-left-xs" style="font-size: 42rpx;">
						<u-icon v-if="isCollection" name="star-fill" :color="themeColor" size="40" @tap="delCollection">
						</u-icon>
						<u-icon v-else name="star" :color="themeColor" size="40" @tap="addCollection"></u-icon>

					</view>
				</view>


				<view class="flex align-center">
					<view class="flex-sub flex flex-direction">
						<text class="text-df text-bold"
							style="line-height: 1.1; margin: 8rpx 0;">{{ detailData.address ||'商户地址'}}</text>
						<text class="text-sm bg-white">距您：1km</text>
						<!-- ** {{ $util.getDistance(location.latitude, location.longitude, detailData.location.lat, detailData.location.lon) }} -->
					</view>

					<view class="icon-box" style="margin-right:30rpx">
						<u-icon name="map-fill" :color="themeColor" size="40" @tap="openLocation()"></u-icon>
					</view>

					<view class="icon-box">
						<u-icon name="phone-fill" :color="themeColor" size="40" @tap="callPhone()"></u-icon>
					</view>
				</view>

				<!-- 公告栏 -->
				<view class="notice-box" v-if="noticeList.length>0">
					<u-notice-bar mode="horizontal" bg-color='#ffffff' font-size="24" color='#9e9e9e'
						:list="noticeList"></u-notice-bar>
				</view>


				<view class="flex text-center shop-tools">
					<view v-if="pauseDirectPay === 1" class="flex-sub"
						@tap="$toView(`shop/shop-check?merchantNo=${ merchantNo }&lat=${location.latitude}&lon=${location.longitude}`, false)">
						<view class="flex-img">
							<image src="/static/images/icon/icon-shop-pay.png" mode="widthFix" />
						</view>
						<text class="text-bold">{{detailData.directPayAlias || '买单'}}</text>
					</view>
					<view v-if="enableTakeout === 1" class="flex-sub" @tap="gotoMerchant(merchantNo, false)">
						<view class="flex-img">
							<image src="/static/images/icon/icon-shop-takeout.png" mode="widthFix" />
						</view>
						<text class="text-bold">{{detailData.mallAlias || '商城'}}</text>
					</view>
					<view v-if="pauseScanOrder === 1" class="flex-sub" @tap="gotoMerchant(merchantNo, true)">
						<view class="flex-img">
							<image src="/static/images/icon/icon_integration.png" mode="widthFix" />
						</view>
						<text class="text-bold">{{detailData.scanOrderAlias || '点单'}}</text>
					</view>
					<view v-if="enableAppoint === 1" class="flex-sub" @tap="gotoAppoint(merchantNo, false)">
						<view class="flex-img">
							<image src="/static/images/icon/icon_appointment.png" mode="widthFix" />
						</view>
						<text class="text-bold">预约</text>
					</view>
					<view v-if="enableMember === 1" class="flex-sub" @tap="gotoMember(merchantNo, true)">
						<view class="flex-img">
							<image src="/static/images/icon/icon_member.png" mode="widthFix" />
						</view>
						<text class="text-bold">{{detailData.scanOrderAlias || '会员中心'}}</text>
					</view>
				</view>
			</view>
			<template>

				<!-- <view style="margin: 40rpx 0 4rpx;">
					<text class="text-xl text-bold" style="color: 161616;">优惠</text>
				</view> -->
				<view class="order-activity flex flex-direction page-card margin-top-sm"
					v-if="activityList.length > 0 || discountList.length > 0">
					<text class="text-xl text-bold card-title padding-bottom-xs">买单立减</text>
					<!-- <text class="order-activity-item">钱包买单立享9折优惠</text> -->
					<view v-if="activityList.length > 0">
						<view v-for="(activityItem, activityIndex) in activityList" :key="activityIndex"
							class="order-activity-item">
							{{getScene(activityItem.activityLimit.scene)}}用钱包支付满{{ activityItem.favourLimit.fullFavour[0].minMoney || '  ' }}元减{{ activityItem.favourLimit.fullFavour[0].favourMoney || '  '  }}元
						</view>
					</view>
					<view v-if="discountList.length > 0">
						<view v-for="(discountItem, discountIndex) in discountList" :key="discountIndex"
							class="order-activity-item">{{getScene(discountItem.activityLimit.scene)}}用钱包支付
							<text
								v-if="discountItem.favourLimit.fixFavour.consume">满{{ discountItem.favourLimit.fixFavour.consume || '  ' }}元</text>
							<text v-if="discountItem.favourLimit.fixFavour.consume === 0"></text>
							打{{ parseFloat(discountItem.favourLimit.fixFavour.favourRate) * 10|| '  '  }}折
						</view>
					</view>

				</view>
				<view v-if="couponList.length > 0" class="coupon-activity flex flex-direction page-card margin-top-sm">
					<view class="text-more">
						<text class="text-xl text-bold card-title">代金券</text>
						<view @click="toListHandler('coupon',couponListNum)" v-if="couponListNum">查看更多<u-icon
								name="arrow-right" size="28" style="margin-left: 10rpx"></u-icon>
						</view>
					</view>
					<block v-for="(couponItem, couponIndex) in couponList" :key="couponIndex">
						<view class="coupon-item">
							<view class="coupon-item-left" @tap="clickToCoupon(couponItem)">
								<view class="ticket">
									<view class="unit">￥</view>
									<view class="num" style="font-weight:bold">{{ couponItem.value || 0 }}</view>
								</view>
								<view class="criteria">满{{ couponItem.discountCondition || 0 }}可用</view>
							</view>
							<view class="coupon-item-center" @tap="clickToCoupon(couponItem)">
								<view class="title text-cut" style="font-weight:bold">
									{{couponItem.name || '  ' }}
									<!-- {{ item.activitySrc != null ? item.activitySrc.orgName : '' }}{{ item.favourLimit.fullFavour[0].favourMoney }}元代金券 -->
								</view>
								<view class="term">

									<view>
										<span v-if="couponItem.availableRelative" style="margin-right: 10rpx">
											有效期{{ couponItem.availableRelative || '  '  }}天
										</span>
										<span>点击查看使用规则</span>
									</view>
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

				<!-- 特惠商品 -->
				<view v-if="couponProduct.length > 0"
					class="order-activity flex flex-direction page-card margin-top-sm">
					<view class="text-more">
						<text class="text-xl text-bold card-title padding-bottom-xs">特惠商品</text>
						<view @click="toListHandler('product',couponProductNum)" v-if="couponProductNum">查看更多<u-icon
								name="arrow-right" size="28" style="margin-left: 10rpx"></u-icon>
						</view>
					</view>
					<view>
						<view v-for="(product, proIndex) in couponProduct" :key="proIndex" class="product-detail"
							@click="toCouponDetail(product)">
							<view class="product-detail-img">
								<image :src="product.pic ? spMatefileBaseURL + product.pic + fixStr : tempImage">
								</image>
							</view>
							<view class="product-detail-data">
								<view class="product-detail-data-name">{{product.name}}</view>
								<view class="product-detail-data-value">
									<view class="money">￥{{product.goodsPrice.toFixed(2)}}</view>
									<view class="button">
										<view v-if="product.isOpenStore === 1 && product.remainStore <= 0">已售罄</view>
										<u-button v-else type="error" :hair-line="false" shape="circle"
											@click="toCouponDetail(product)">马上抢
										</u-button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 商家信息 -->
				<view v-if="detailData.remark" class="coupon-activity flex flex-direction page-card margin-top-sm">
					<text class="text-xl text-bold card-title">商家信息</text>
					<view>
						<view style="color: #666666">{{detailData.remark}}</view>
					</view>
				</view>



			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: {
					page: true
				},
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				isCollection: null,
				location: {},
				merchantNo: null,
				detailData: {
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
				activityList: [],
				couponList: [{
					"id": "5447080f1f4048bda5f8dcfdc9a07cbe",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "zKq98sux",
					"createTime": 1648191295000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"name": "同名测试",
					"pic": "service-org-7adc24dc/20220209/31a105e04ffb482e959faa709b40380c.png",
					"categoryRegionPath": "",
					"goodsPrice": 0,
					"isOpenStore": 0,
					"remainStore": 20,
					"saleNum": 17,
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
				}],
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				// 是否开启扫码点单   0：否    1：是
				pauseScanOrder: 1,
				// 是否开启直接付款
				pauseDirectPay: 1,
				// 是否开启商城
				enableTakeout: 1,
				// 是否开启会员
				enableMember: 1,
				// 是否开启预约
				enableAppoint: 1,
				couponProduct: [{
					"id": "9a687221c18c43d1a8f304e1b5fa1316",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "sTUuuhN9",
					"createTime": 1635504369000,
					"updateTime": 1635411701000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"description": "",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"rightsType": "asdasd",
					"rightsTypeId": "1",
					"name": "全闽悦影券豪华版(不要修改此商品信息)",
					"categoryRights": "电影演出",
					"pic": "service-org-7adc24dc/20210812/aa5c297239124de197acc62964025fb4.jpg",
					"categoryRegion": "4248b307ac57a7f7c77a1c487a9029a9",
					"categoryRegionPath": "4248b307ac57a7f7c77a1c487a9029a9",
					"barCode": "",
					"skuCode": "poKy0QMvcqEOaxkt",
					"costPrice": 38,
					"goodsPrice": 39.9,
					"isOpenStore": 1,
					"remainStore": 2,
					"isReset": 0,
					"saleNum": 6,
					"saleTimeType": 0,
					"saleMode": 1,
					"isRefund": 0,
					"availableType": 2,
					"availableBeginTime": "1970-01-01 08:00:00",
					"availableEndTime": "1970-01-01 08:00:00",
					"availableRelative": 180,
					"availableCount": 1,
					"categoryRightsId": "4063f87d3cd84a8fa260e472ce1c21e7",
					"status": 1,
					"categoryPath": "4063f87d3cd84a8fa260e472ce1c21e7",
					"instructions": "<h3>【本商品不支持退款！】</h3><h3>【用“钱包支付”立享：满<strong>30</strong>元立减<strong>20</strong>元！每位用户可享受两次优惠！优惠100张，先到先得…】</h3><h3><br></h3><h3>使用说明</h3><p class=\"ql-align-justify\">(1)凭本券可在线下合作影城柜台或线上适用影城兑换普通厅2D/3D/zmax电影票一张；</p><p class=\"ql-align-justify\">柜台兑换：出示此券，告知影城工作人员您有<span style=\"color: rgb(255, 0, 0);\">爱来电子券</span>，选择场次、座位，影城工作人员。</p><p class=\"ql-align-justify\">电子券查看方式：</p><p class=\"ql-align-justify\">1.下载<span style=\"color: rgb(255, 0, 0);\">最美电影APP</span>, 点击我的-电影券，查看所获取的电影券。</p><p class=\"ql-align-justify\">2.&nbsp;微信小程序搜索 ”<span style=\"color: rgb(255, 0, 0);\">最美电影”，</span>可直接选择喜爱的电影，点击电影优惠券，选择电影券观影。</p><p class=\"ql-align-justify\">3.&nbsp;关注最美电影FANS公众号-点击立即购票，点击我的-电影券。</p><p class=\"ql-align-justify\">在线选座：微信小程序搜索<span style=\"color: rgb(255, 0, 0);\">”最美电影”</span>或者下载最美电影APP, 关注最美电影FANS公众号-点击立即购票。购票成功后到选定影城取票观影。</p><p class=\"ql-align-justify\">(2)&nbsp;因影城要求，如遇特殊节假日（如春节、国庆、情人节、圣诞节等）、限价片、特殊影片可能需补差，部分影城需客户购买或自备3D眼镜，以及其他未提及事项均以影城现场公告为准。</p><p class=\"ql-align-justify\">(3)本券售出，不记名，不挂失，不得二次转卖，一经兑换不得退票，密码区一经刮开，影城柜台将不予兑换。</p><p class=\"ql-align-justify\">(4)本券请在有效期内使用，逾期自动失效，自行撕角、损毁或擅自更改内容均视为票券作废无效。</p><p class=\"ql-align-justify\">(5)线下合作影城柜台或线上适用影城，可查看线上券说明。</p><p class=\"ql-align-justify\">(6)以上说明如有未尽事宜或更改，恕不另行通知，如有疑问请致电客服热线咨询。</p><p class=\"ql-align-justify\">(7)&nbsp;在法律允许的范围内，本券最终解释权归福州爱来网络科技有限责任公司所有。</p><p class=\"ql-align-center\">客服热线：400-0125-000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务时间：09:00-21:00(周一至周日)</p>",
					"isDivide": 1,
					"divideMode": 1,
					"divideRate": 500,
					"recommend": 0,
					"voucherFlag": 0,
					"transactionQueryTypes": [],
					"payTypes": []
				}, {
					"id": "edb27fe9173a41d39c44b2db100b7018",
					"regionNo": "DL1333225698034458624",
					"merchantNo": "zKq98sux",
					"createTime": 1644373910000,
					"updateTime": 1644373910000,
					"creator": "1235b00b894c451eb9c2e5c91c6b5deb",
					"description": "<p>青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉</p>",
					"regionPath": "9999_DL1333225698034458624",
					"ownerRegionNo": "DL1333225698034458624",
					"rightsType": "",
					"rightsTypeId": "1",
					"isImport": 0,
					"importSource": 1,
					"name": "肉炒青椒",
					"categoryRights": "宠物",
					"pic": "service-org-7adc24dc/20220209/9e87f115e3cc4b3fa3f4c3a997bc10bb.jpg",
					"categoryRegion": "c30b7daea9ee992d1fb24dbaee8d27f7",
					"categoryRegionPath": "c30b7daea9ee992d1fb24dbaee8d27f7",
					"barCode": "12312313354545",
					"skuCode": "",
					"costPrice": 10,
					"goodsPrice": 25,
					"isOpenStore": 0,
					"remainStore": 0,
					"maxStore": 0,
					"saleNum": 0,
					"saleTimeType": 0,
					"saleMode": 1,
					"isRefund": 1,
					"refundType": 7,
					"availableType": 0,
					"availableBeginTime": "1970-01-01 08:00:00",
					"availableEndTime": "1970-01-01 08:00:00",
					"categoryRightsId": "2b9ad14eaf2c42228abd5e48aedeaada",
					"status": 1,
					"categoryPath": "1a3c8c7111984edca9b9b891e7d2183f",
					"instructions": "<p>青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉青椒炒肉v青椒炒肉青椒炒肉</p>",
					"isDivide": 0,
					"divideMode": 1,
					"voucherFlag": 0,
					"transactionQueryTypes": [],
					"payTypes": [],
					"sourceAddress": ""
				}],
				tempImage: '../../static/images/default-shop.png',
				couponProductNum: true,
				couponListNum: true,
				discountList: [],
				noticeList: [],
				menuList: [{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西1好吃的东西1好吃的东西1好吃的东西1'
					},
					{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西2'
					},
					{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西3'
					},
					{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西4'
					},
					{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西5'
					},
					{
						img: '/static/images/icon/icon_integration.png',
						name: '好吃的东西6'
					}
				]


			}
		},
		methods: {


			async addCollection() {
				this.isCollection = true
				uni.showToast({
					title: '收藏成功'
				})
			},
			async delCollection() {
				this.isCollection = false
				uni.showToast({
					title: '取消成功'
				})
			},
		
			async receiveCoupon(goodsId, isToPay, isOpenStore, remainStore) {
				if (isOpenStore === 0 || (remainStore > 0 && isOpenStore === 1)) {
					// 有库存
					if (!isToPay) {
						// 领券
						uni.showToast({
							title: '领取成功'
						})
					} else {
						// 购买
						uni.navigateTo({
							url: `/myPackageA/pages/cash-coupon?couponId=${goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`
						})
					}

				}

			},
			onErrorShopLogo(item) {
				this.$set(item, 'logo', null)
			},
			getLocation() {

			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.detailData.linkPhone
				})
			},
			openLocation() {
				this.$plugin.app.openLocation({
					latitude: this.detailData.location.lat,
					longitude: this.detailData.location.lon,
					name: this.detailData.merchantName,
					address: this.detailData.address
				})
			},
			gotoMerchant(merchantNo, isOrder) {
				//确认是否点单，点单的情况下不需要收货地址
				uni.setStorageSync('ISORDER', isOrder)
				let myUrl =
					`shop/categories?pageType=1&id=${ this.merchantNo }&lat=${this.location.latitude}&lon=${this.location.longitude}`
				if (uni.getStorageSync('deskNo')) {
					myUrl =
						`shop/categories?pageType=1&deskNo=${uni.getStorageSync('deskNo')}&id=${ this.merchantNo }&lat=${this.location.latitude}&lon=${this.location.longitude}`
				}
				this.$toView(myUrl, false)
			},
			gotoAppoint(merchantNo) {
				console.log('跳转到预约茶室')
				uni.navigateTo({
					url: `/myPackageA/pages/coupon/appointment?lon=${this.location.longitude}&lat=${this.location.latitude}&merchantId=${this.detailData.id}&type=tea`
				})
				// this.$toView(
				// 	`/myPackageA/pages/coupon/appointment?lon=${this.location.longitude}&lat=${this.location.latitude}&merchantId=${this.detailData.id}&type=tea`,
				// 	false, false, false)

			},
			gotoMember(merchantNo) {
				console.log('跳转到会员中心')
				let shopInfo = {
					"merchantNo": "9ZLWBzob",
					"merchantName": "精彩电影",
					"id": "MD1413109041353330688",
					"linkPhone": "13599098689",
					"origin": null,
					"userId": "daefc160e23a4b35877f1826d4f99ac2"
				}
				// shopInfo = JSON.stringify(shopInfo)
				uni.navigateTo({
					url: `/myPackageA/pages/member/index?lon=${this.location.longitude}&lat=${this.location.latitude}&shopInfo=${shopInfo}`
				})
				// this.$toView(
				// 	`/myPackageA/pages/member/index?lon=${this.location.longitude}&lat=${this.location.latitude}&shopInfo=${shopInfo}`,
				// 	true, false, true)

			},
			toIndex() {
				//关闭所有页面，跳转到首页
				uni.reLaunch({
					url: `/pages/index/index`
				})
			},
			navClick(index) {
				this.currentTab = index
				this.navIndex = index
			},
			swiperChange(e) {
				this.navIndex = e.target.current || e.detail.current
			},
			toCouponDetail(item) {
				uni.navigateTo({
					url: `/myPackageA/pages/coupon/coupon-detail?goodsId=${item.id}&lon=${this.location.longitude}&lat=${this.location.latitude}`,
				});
			},
			toListHandler(type, isGo) {
				console.log('type', type);
				console.log('isGo', isGo);
				if (isGo) {
					uni.navigateTo({
						url: `/myPackageA/pages/userCoupon/user-shop-coupon-list?type=${type}&merchantNo=${this.merchantNo}&lat=${this.location.latitude}&lon=${this.location.longitude}`
					})
					// this.$toView(`/myPackageA/pages/userCoupon/user-shop-coupon-list?type=${type}&merchantNo=${this.merchantNo}`, true,false,true)
				}
			},
			clickToCoupon(couponItem) {
				this.$toView(
					`/myPackageA/pages/cash-coupon?couponId=${couponItem.id}&lat=${this.location.latitude}&lon=${this.location.longitude}`,
					true, false, true)
			},
			getScene(scene) {
				let sceneString = ''
				let sceneArr = []
				if (scene.length !== 0) {
					scene.forEach(val => {
						if (val === 1) {
							sceneArr.push('直接买单')
						}
						if (val === 2) {
							sceneArr.push('点单')
						}
						if (val === 3) {
							sceneArr.push('商城')
						}
						if (val === 16) {
							sceneArr.push('收银台')
						}
					})
				}
				if (sceneArr.length !== 0) {
					sceneArr.forEach(s => {
						if (sceneString) {
							sceneString = sceneString + `、${s}`
						} else {
							sceneString = s
						}
					})
				}
				return sceneString
			},
			clickImg(img) {
				let arr = [img]
				wx.previewImage({
					urls: arr,
					current: '',
					indicator: 'number',
					loop: true
				})
			},
			toMenuList() {
				uni.navigateTo({
					url: '/myPackageA/pages/userCoupon/user-menu-list'
				})
			}
		},
		async onLoad(option) {
			this.merchantNo = option.merchantNo
			await this.$onLaunched
			this.getLocation()
		}

	}
</script>

<style lang="scss">
	/deep/ .u-notice-bar .u-icon__icon {
		color: #FFAF2E !important;
	}

	/deep/ .u-notice-bar {
		padding: 4rpx 0 !important;
	}

	.shop-shop-detail {
		.page-card {
			background: #FFFFFF;
			border-radius: 8rpx;
			padding: 20rpx;

			.card-title {
				margin: 12rpx 0;
			}
		}

		.page-content {
			padding: 24rpx;

			.shop-detail-box {
				.shop-info {
					margin: 12rpx 0;
					border-radius: 16rpx;
					background: #FFFFFF;

					&-logo {
						width: 144rpx;
						height: 144rpx;
						border-radius: 8rpx;
						border: 2rpx solid #F5F5F5;
					}

					&-box {
						margin-left: 24rpx;
						min-width: 0;
					}

					&-title {
						margin-top: 2rpx;
						font-size: 34rpx;
						font-weight: 500;
						line-height: 44rpx;
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					&-type {
						height: 34rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
						line-height: 34rpx;
						margin-top: 16rpx;
					}
				}

				.shop-collect-box {
					.u-icon__icon {
						top: -10rpx !important;
					}
				}

				.icon-box {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50rpx;
					background: #f6f6f6;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.shop-tools {
					align-content: center;
					margin-top: 20rpx;
					padding: 40rpx 0 20rpx 0;
					border-top: 1rpx solid #F4F5F7;

					.flex-img {
						width: 64rpx;
						height: 64rpx;
						margin: 0 auto;

						image {
							width: 64rpx;
							height: 64rpx;
						}
					}

					text {
						font-size: 28rpx;
						color: #161616;
					}
				}
			}

			.notice-box {
				margin-top: 20rpx;
				// border-top: 2rpx solid #f5f5f5;
			}

			.order-activity {
				&-item {
					color: #E43838;
					font-size: 26rpx;
					margin-bottom: 6rpx;
				}
			}

			.coupon-activity {
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
								color: #E43838;
								border: 2rpx solid #E43838;
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
		}


		.product-detail {
			display: flex;
			border: 2rpx solid #F4F5F7;
			margin-bottom: 20rpx;
			padding: 24rpx 20rpx;
			border-radius: 8rpx;

			&-img {
				width: 180rpx;
				margin-right: 20rpx;

				image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 8rpx;
				}
			}

			&-data {
				flex: 1;

				&-name {
					font-size: 30rpx;
					font-weight: 600;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 390rpx;
				}

				&-value {
					margin-top: 46rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.money {
						font-size: 36rpx;
						color: #E43838;
						font-weight: 600;
						margin-right: 20rpx;

					}

					.button {}
				}
			}
		}

		.menu {

			display: flex;
			overflow-x: auto;

			.menu-detail {
				text-align: center;

				&-img {
					image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 8rpx;
						margin: 0 20rpx;
					}

					&-name {
						font-size: 28rpx;
						font-weight: bold;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						width: 180rpx;
					}
				}
			}


		}


		.text-more {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>