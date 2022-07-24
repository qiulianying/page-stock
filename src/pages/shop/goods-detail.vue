<template>
	<view class="mall-goods-detail-page">
		<cu-custom v-if="!isShare" bgColor="bg-white" is-back @tap="toIndex" :goBack="false">
			<block slot="backText" class="text-black">商品详情</block>
		</cu-custom>

		<!-- 分享的页面，显示返回首页的按钮 -->
		<topback-btn v-else :url="`/pages/index/index`" bgColor="bg-blue" :isBlue="true" :isShare="isShare">
			<block slot="backText" class="text-white text-ellipsis"></block>
		</topback-btn>
		<view style="width:100%;height:750rpx;margin:0 auto;align:center">
			<u-swiper :list="swiperList" height="750" class="detail-swiper">
			</u-swiper>
		</view>

		<view class="goods-detail-info">
			<view class="goods-title">全闽悦影券豪华版</view>
			<view class="goods-tags" v-if="goods.goodsTags && goods.goodsTags.length>0">
				<view class="goods-tags-box" :style="{color: themeColor, background: themeColorRGB}"
					v-for="(item,index) in goods.goodsTags" :key="index">
					{{item}}
				</view>
			</view>
			<view class="goods-num-box">
				<!-- 价格 -->
				<view>
					<text style="font-size:30rpx;" class="goods-price">￥</text><text class="goods-price">43</text>
					<text class="goods-old-price" v-show="goods.originPrice!=undefined">￥100</text>
				</view>

				<!--商品选中组件，如果之前有被选中需要进行回填-->
				<!-- 开启了库存管理，且没有开启负库存销售，不能超过库存数量 -->
				<view class="goods-num-box-right"
					v-if="merchantData.enableStorageManage === 1 && merchantData.enableNegativeStorage === 0">
					<!-- {{goods.stock}} -->
					<view style="position:absolute;right:20rpx;top:15rpx" v-if="!goods.isMultiSpec && goods.stock === 0"
						class="goods-stock">已售罄</view>
					<!--点击数量获取组件-->
					<!-- 单规格数据 -->
					<zj-number-box v-if="goods.stock !== 0 && goods.stockRemain !== 0 && !goods.isMultiSpec"
						:showModal="false" :color="themeColor" :rowData="goods"
						:value="selectedGoods[goodsId] ? selectedGoods[goodsId].count : 0" @change="getChangeInfo"
						@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo"
						:max="goods.stockRemain">
					</zj-number-box>
					<!-- 多规格数据 -->
					<zj-number-box v-if="goods.isMultiSpec" :showModal="false" :color="themeColor" :rowData="goods"
						:value="selectedGoods[goodsId] ? selectedGoods[goodsId].count : 0" @change="getChangeInfo"
						@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo">
					</zj-number-box>
				</view>
				<!-- 开启了库存管理，开启了负库存销售，可以无限量购买 -->
				<!-- 未开启库存管理，可以无限量购买 -->
				<view class="goods-num-box-right" v-else>
					<!--点击数量获取组件-->
					<zj-number-box :showModal="false" :color="themeColor" :rowData="goods"
						:value="selectedGoods[goodsId] ? selectedGoods[goodsId].count : 0" @change="getChangeInfo"
						@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo">
					</zj-number-box>
				</view>

			</view>
			<view class="goods-desc">福建线上约130家，线下约170家，含金逸万达GGV中瑞等主流影城。</view>

		</view>

		<view style="background-color: white;  margin-top: 14rpx">
			<view class="detail-row">
				<view>规格</view>
				<view>{{goods.unit}}</view>
			</view>
		</view>

		<view class="goods-detail-memo">
			<view class="goods-detail-explain">
				<view class="goods-detail-explain-title" id="explain">
					<text>详 情</text>
				</view>

				<view class="instructions-box">
					<image src="../../static/logo.png" mode="widthFix" style="width: 40rpx">
					</image>
					<text class="instructions-text" :style="{color: themeColor}">说明</text>
				</view>

				<!-- 详情图片 -->
				<view v-for="(item, index) in goods.detailPics" :key="index" style="width:650rpx;margin:0 auto;">
					<image style="width:100%;" mode="widthFix" :src="fileBaseURL + item  ">
					</image>
				</view>

				<view class="instructions-box">
					<image src="../../static/logo.png" mode="widthFix" style="width: 40rpx">
					</image>
					<text class="instructions-text" :style="{color: themeColor}">其他信息</text>
				</view>
				<view class="other-box">
					<view class="other-row">
						<view>生产产商</view>
						<view>北京韩美药品有限公司</view>
					</view>
					<view class="other-row">
						<view>禁忌</view>
						<view>尚不明确</view>
					</view>
				</view>
				<text style="font-size: 20rpx; text-align: center">以上说明信息仅供参考，使用时请严格按照药品说明书指示进行</text>
			</view>
			<!--结算组件-->
			<settle :distribution="distribution" :showTotal="address" :startPrice="0.01"
				:merchantStock="merchantData.enableStorageManage === 1 && merchantData.enableNegativeStorage === 0"
				:merchantNo="merchantNo" @change="getChangeInfo" :selectedGoods="selectedGoods"
				:isOrderSettlement="true" subtype="good" @delShopAllProduct="delShopAllProduct"
				:settleShowMOdule="settleShowMOdule" @changeShowModel="changeShowModel" :isDetailPage="true"
				:isShare="isShare">
			</settle>

			<!-- 规格选择弹窗 -->
			<good-specs-popup :show="ispopupShow" @popupClose="popupClose" :goodsData="goodsSpecsPopData"
				:merchantNo="merchantNo" :merchantData="merchantData" @getSelectData="getSelectData"
				@changeGoodData="changeGoodData"></good-specs-popup>

		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				swiperList: [
					"http://localhost:8082/platform-oss/internal-getfile/service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"
				],
				tempImage: '../../static/images/default-shop.png',
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				selectedGoods: {
					"405e274ea2ba4748b36d7b60af86a3a0": {
						"cellStyleMap": {},
						"categoryName": "影券套餐",
						"goodsType": 1,
						"goodsAttributes": [],
						"goodsSpecs": [{
							"name": "defaultSpec",
							"specOptions": [{
								"id": "405e274ea2ba4748b36d7b60af86a3a0",
								"price": 43,
								"stock": 10
							}]
						}],
						"garnishVo": [],
						"goodsVideos": [{
							"id": "e6c6aacd275443388d40f2ffdb3a21ba",
							"name": "全闽悦影券豪华版",
							"type": "普通话",
							"url": "Text2Audio-4JkmLeI/20210708/e0zaeD7cpbGqIgHtTRZ8nyti.mp3",
							"isDefault": 0,
							"size": null,
							"md5": "3bb30eada180edc84f6b4a2f931284c0"
						}],
						"id": "405e274ea2ba4748b36d7b60af86a3a0",
						"createUserId": "daefc160e23a4b35877f1826d4f99ac2",
						"goodsNo": "405e274ea2ba4748b36d7b60af86a3a0",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 1,
						"merchantNo": "9ZLWBzob",
						"isDelete": 0,
						"createTime": "2021-07-08T13:57:11.924+0000",
						"updateTime": 1625752983376,
						"name": "全闽悦影券豪华版",
						"unit": "张",
						"description": "福建线上约130家，线下约170家， 含金逸万达GGV中瑞等主流影城……\n万达影城-仓山万达广场店\t福建省福州市仓山区金山街道万达广场(仓山店)\n中瑞国际影城（福州白湖亭店）\t福建省则徐大道379号商业广场1层(盖山路口公交站后)\n金逸影城福州新天宇店\t仓山区城门镇福峡路新天宇城市广场4楼\n福州红星太平洋电影城\t仓山区浦上大道198号爱琴海购物公园7层\n福州观者城市影城首山店\t仓山区首山路45号新都汇5楼\n春天国际影城福州金源店\t仓山区林浦路世纪金源购物中心三楼春天国际影城\n观者国际影城福州奥体店\t仓山区建新镇建新大道南侧盘屿路东侧阳光天地2019商铺\n福清悦享中兴影城\t福清市音西街道清昌大道利嘉中心源创新天地3楼\n时代金典数字影院\t福清市玉屏街道官塘乾成龙花园8号楼1层\n大地影院（福清国际商展中心店）\t福建省融城西门元洪路福清国际商展中心南门一楼\n万达影城-福清万达广场店\t福建省福州市福清市音西街道福清万达广场\n万达影城-福清福和万达广场店\t 福建省音西街道福和路9号4层401（裕荣汇4楼）\n福建省海峡影城\t鼓楼区东街3号 （原福建省人民剧场）\n福州大戏院\t鼓楼区五四路212号\n福州大众电影院\t鼓楼区八一七北路192号\n福州伍肆横店影视城\t福建省福州市鼓楼区鼓东街道王府井百货\n中瑞国际影城（福州省体育中心店）\t福建省五四路320号省体育中心公交站\n中瑞国际影城（福州三坊七巷店）\t福建省三坊七巷南后街75号（博览苑对面）\n星聚汇影城(福州泰禾广场店)\t晋安区岳峰镇竹屿路6号东二环泰禾城市广场67层\n稻田影院（稻田创业小镇A9三楼）\t晋安区南平东路98号稻田创业小镇A9（国恵酒楼3楼）\n金逸影城福州紫阳店\t晋安区长乐路157号紫阳商贸中心大润发超市5层\n连江中影星美国际影城\t连江县马祖路万家城市广场3F中影星美影城\n完美世界影城（福州罗源店）\t罗源县滨海新城世纪金源购物中心A区3楼005号\n罗源东方影城\t罗源县凤山镇东外路16号东方星城D区商业楼F3号\n中瑞国际影城（福州马尾中环店）\t福建省马江园区罗星路西北侧马尾中环广场4楼\n幸福蓝海影城\t福建省福州市马尾区江滨东大道68-8号名城广场北区\n中影星美影城（闽侯店）\t闽侯县甘蔗街道昙石山大道北侧136号万家广场7#楼第三、四层\n横店电影城-福建闽侯横店电影城\t闽侯县南屿镇乌龙江南大道79号信通国际中心5号楼6层\n春天国际影城福州大学店\t闽侯县闽侯大学城永嘉天地4楼\n闽侯影狄影院\t闽侯县上街镇邱阳东路6号789共创园2号楼影狄国际影城\n中瑞国际影城（福州正荣财富店）\t福建省乌龙江大道与浦上大道交汇处正荣财富中心四楼\n闽清百荣国际影城\t闽清县梅城镇梅溪南路1号百荣新天地6号楼4层\n平潭星海影城\t平潭县翠园北路367-7号\n福州苏宁影城\t宁化街道长汀街6号福州苏宁广场C区\nMGF私影汇（APM店）\t福州市台江区鳌峰广场4楼\n中影UL影城（中亭街店）\t台江区中亭街区8090时尚广场3楼\n至潮影城(茶亭店)\t台江区八一七路茶亭国际五楼（居然之家）\n金逸福州IMAX万宝商圈\t工业路193号宝龙城市广场5层\n万达影城-金融街万达广场\t福建省福州市台江区鳌峰街道万达广场(金融街店)\n中瑞国际影城（福州红星美凯龙店）\t福建省工业路三迪广场红星美凯龙7楼\n冠景国际影城\t永泰县动车站西侧冠景天地广场四楼冠景国际影城\n长乐中兴星河影城\t长乐市长乐市漳港街道安平广场5楼星河国际影城\n大地影院（福州长山湖店）\t福建省长乐市广场路39号长山湖购物广场（沃尔玛）四楼\n中影UL影城（长乐金峰店）\t长乐市金峰镇胪峰大道好莱钨主题百货2楼\n金逸CC影城（长乐悦城店）\t长乐市航城街道吴航路555号皇庭名郡社会立体公共停车综合1-4层商业1#三层",
						"goodsPrice": 43,
						"stock": 11,
						"stockRemain": 11,
						"sellNum": 0,
						"productUrlList": ["service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"],
						"weightRange": 0,
						"publishStatus": 1,
						"barCode": "",
						"isInfinite": 0,
						"goodsSkus": [{
							"id": "405e274ea2ba4748b36d7b60af86a3a0",
							"sellNum": 21,
							"merchantNo": "9ZLWBzob",
							"isDelete": false,
							"createTime": "2021-07-08T14:03:03.379+0000",
							"name": "[{\"name\":\"defaultSpec\"}]",
							"price": 43,
							"stock": 11,
							"stockRemain": 11,
							"goodsId": "405e274ea2ba4748b36d7b60af86a3a0",
							"barCode": "",
							"isInfinite": 0
						}],
						"goodsTags": [],
						"detailPics": [],
						"originPrice": 100,
						"isMultiSpec": false,
						"count": 2,
						"merchantName": "精彩电影"
					}
				}, //当前选择的选中商品
				merchantNo: "9ZLWBzob", //门店号
				goodsId: "405e274ea2ba4748b36d7b60af86a3a0", //当前商品id

				total: 20.5,
				distribution: 1,
				address: "福州软件园A区1号楼10层福州软件园A区1号楼10层福州软件园A区1号楼10层",
				goods: {},
				merchantName: '精彩电影',
				stock: 110,
				ispopupShow: false,
				goodsSpecsPopData: {},
				settleShowMOdule: false,
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
				}, //门店详情
				themeColor: '',
				themeColorRGB: '',
				isShare: false,
				isCar: false

			};
		},
		mounted() {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.themeColorRGB = this.$util.colorRgb(this.themeColor, 0.1) // rgba(53,61,150,0.2)
		},
		onShareAppMessage(res) {
			return {
				title: `${this.goods.goodsVideos[0].name}`,
				path: `/pages/shop/goods-detail?merchantName=${this.merchantName}&id=${this.goodsId}&merchantNo=${this.merchantNo}&isShare=1`
			}
		},
		onShareTimeline() {
			return {
				title: `${this.goods.goodsVideos[0].name}`,
				path: `/pages/shop/goods-detail?merchantName=${this.merchantName}&id=${this.goodsId}&merchantNo=${this.merchantNo}&isShare=1`
			}
		},
		methods: {
			onLoad(option) {

			},
			gotoDetail() {
				uni.createSelectorQuery().select(".detail-row").boundingClientRect(data => {
					uni.createSelectorQuery().select(".mall-goods-detail-page").boundingClientRect((
						res) => {
						uni.pageScrollTo({
							duration: 300,
							scrollTop: data.top - res.top,
						})
					}).exec()
				}).exec();
			},
			//商品数量选择
			getChangeInfo(id, value, merchantNo, isPopUpShow) {
				// 如果不是有规格的商品，则可以直接外部添加数量
				if (!isPopUpShow) {
					const newSelectedGoods = this.$shopMall.updateSelectedGoods(value, this.selectedGoods, this.merchantNo,
						this.merchantData.merchantName, this.merchantData.goodsTemplate)
					this.selectedGoods = JSON.parse(JSON.stringify(newSelectedGoods))
				}

				// 如果有规格，则不进行操作
			},
			// 子组件--弹窗清空数据
			delShopAllProduct(value) {
				if (value) {
					this.selectedGoods = {}
					// 数据清空，则也需要情空传递给子组件的数据
					this.goodsSpecsPopData = {}
				}
			},
			// 子组件--显示规格弹窗
			popupShow(ispopupShow, data) {
				this.ispopupShow = ispopupShow
				if (data.goodsSpecs) {
					for (var i = 0; i < data.goodsSpecs[0].specOptions.length; i++) {
						if (data.goodsSpecs[0].specOptions[i].pic == undefined) {
							data.goodsSpecs[0].specOptions[i].pic = data.productUrlList[0]
						}
					}
				}
				console.log('data-------------data', data)
				this.goodsSpecsPopData = data
			},
			// 子组件--关闭规格弹窗
			popupClose(val) {
				this.ispopupShow = val
			},
			// 子组件 -- 传递选中商品的数据
			getSelectData(value) {
				this.selectedGoods = value
			},
			// 子组件 --- 点击减号让加购商品弹窗出现
			settleShow(val) {
				this.settleShowMOdule = val
			},
			// 子组件 --- 修改加购商品弹窗出现的值
			changeShowModel(value) {
				this.settleShowMOdule = value
			},
			// 子组件 ---  弹窗组件修改商品数据
			changeGoodData(value) {
				this.goodsSpecsPopData = value
			},
			toIndex() {
				if (this.isCar) {
					uni.navigateTo({
						url: `/pages/index/index?tabName=${3}`
					})
				} else {
					uni.navigateBack()
				}

			}
		},
	};
</script>

<style lang="scss">
	/deep/.u-number-input {
		background: none !important;
		color: #222222 !important;
	}

	/deep/ .u-icon-plus {
		width: 50rpx !important;
		height: 50rpx !important;
		border-radius: 50rpx !important;
	}

	/deep/ .u-icon-minus {
		width: 50rpx !important;
		height: 50rpx !important;
		border-radius: 50rpx !important;
	}

	.mall-goods-detail-page {
		display: flex;
		flex-direction: column;
		padding-bottom: 100rpx;

		image {
			height: auto;
		}

		.goods-detail-info {
			background: #ffffff;
			padding: 32rpx 24rpx;

			.goods-num-box {
				display: flex;
				align-items: center;
				position: relative;
				height: 80rpx;
				justify-content: space-between;

				.goods-num-box-right {
					height: 100%;
					width: 220rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				.goods-price {
					font-size: 36rpx;
					color: #e43838;
					font-weight: 600;
					// width: 15%;
				}

				.goods-old-price {
					margin-left: 20rpx;
					font-size: 32rpx;
					color: #a9a9a9;
					text-decoration: line-through;
					flex: 1;
				}

				.goods-stock {
					font-size: 34rpx;
					color: #aaa5a5;
					margin-bottom: 12rpx;
					margin-left: 160rpx;
				}
			}

			.goods-title {
				font-size: 40rpx;
				// font-weight: 600;
				color: #333;
				line-height: 1.2;
				margin: 12rpx 0;
			}

			.goods-tags {
				margin: 18rpx 0;
				height: 40rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				&-box {
					padding: 0 10rpx;
					height: 32rpx;
					border-radius: 32rpx;
					font-size: 20rpx;
					margin-right: 10rpx;
					display: inline-block;
				}
			}


			.goods-desc {
				font-size: 22rpx;
				color: #666666;
				line-height: 1.2;
			}

			.goods-spec {
				display: flex;
				font-size: 26rpx;
				color: #666666;
				margin-top: 24rpx;
				align-items: center;

				text:nth-child(odd) {
					margin-right: 8rpx;
					font-size: 48rpx;
				}

				text:nth-child(even) {
					margin-right: 32rpx;
				}
			}
		}

		.goods-detail-memo {
			margin-top: 12rpx;
			background: #ffffff;
			display: flex;
			flex-direction: column;
			padding: 32rpx 24rpx;

			.goods-detail-explain {
				background: #f5f5f5;
				display: flex;
				flex-direction: column;
				margin-bottom: 20rpx;

				&-title {
					width: 170rpx;
					border: 50rpx solid;
					border-right: 12rpx solid;
					border-left: 32rpx solid;
					border-bottom: none;
					border-color: #666666;
					border-right-color: transparent;
					font-size: 26rpx;
					position: relative;

					text {
						position: absolute;
						font-size: 26rpx;
						color: #ffffff;
						top: -44rpx;
					}
				}

				>text {
					padding: 36rpx;
					font-size: 24rpx;
					color: #666666;
					line-height: 1.8;
				}
			}

			>image {
				margin-bottom: 20rpx;
			}
		}

		.goods-detail-bottom {
			display: flex;
			position: fixed;
			bottom: 0;
			background: #ffffff;
			border-top: 1rpx solid #f5f5f5;
			left: 0;
			right: 0;
			min-height: 100rpx;
			z-index: 999;
			align-items: center;
			justify-items: center;

			>view {
				width: 100rpx;
				font-size: 46rpx;
				height: 100%;
				line-height: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-items: center;
				color: #444444;

				text {
					font-size: 22rpx;
					margin-top: 10rpx;
				}
			}

			.btn-box {
				flex: 1;
				flex-direction: row;
				margin-left: 12rpx;

				button {
					flex: 1;
					height: 76rpx;
					border-radius: 40rpx;
					font-size: 30rpx;
					font-weight: 500;
					color: #ffffff;
					margin-right: 20rpx;
				}

				.btn-add {
					box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
					background: linear-gradient(90deg,
							rgba(233, 180, 97, 1),
							rgba(238, 204, 137, 1));
				}

				.btn-pay {
					background: linear-gradient(93deg,
							rgba(208, 19, 37, 1),
							rgba(237, 60, 48, 1));
					box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
				}
			}
		}
	}

	// 查看详细说明
	.look-detail {
		border: 1px solid red;
		color: red;
		background-color: white;
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.detail-row {
		display: flex;
		height: 80rpx;
		align-items: center;

		view:nth-child(odd) {
			width: 13%;
			color: #555555;
			margin-left: 20rpx;
		}

		view:nth-child(even) {
			width: 66%;
			font-size: 26rpx;
			font-weight: 600;
		}
	}

	// 说明书
	.instructions-box {
		width: 100%;
		height: 50rpx;
		margin-top: 40rpx;
	}

	.instructions-text {
		position: absolute;
		left: 85rpx;
		font-size: 30rpx;
		font-weight: 600;
		// color: #4399fc;
	}

	// 其他信息
	.other-box {
		border: 1px solid #c9c9c9;
		width: 95%;
		height: 300rpx;
		margin: 20rpx auto;
		padding: 20rpx;

		.other-row {
			display: flex;
			height: 80rpx;
			align-items: center;
			border-bottom: 1px solid #aeaeae;
			margin-bottom: 20rpx;

			view:nth-child(odd) {
				width: 30%;
				color: #555555;
				margin-left: 20rpx;
				font-size: 26rpx;
			}

			view:nth-child(even) {
				width: 70%;
				font-size: 26rpx;
				font-weight: 600;
			}
		}
	}

	.detail-swiper {
		image {
			margin: 0 auto;
		}
	}
</style>