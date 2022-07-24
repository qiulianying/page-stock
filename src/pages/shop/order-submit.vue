<template>
	<view>
		<view class="mall-order-submit-page" style="padding-bottom: 100rpx;">
			<cu-custom bgColor="bg-white" is-back>
				<block slot="backText" class="text-black">提交订单</block>
			</cu-custom>
			
			<view class="order-tab" v-if="tabList.length === 3">
				<view v-for="(tab, index) in tabList" :key="index" @tap="changeTab(tab,index)"
					:class="tab.checked ? 'order-tab-item3 order-tab-item_checked' : 'order-tab-item3' "
					:style="[{borderBottom: tab.checked ? `${2}rpx solid ${themeColor}` : ''}, {color: tab.checked ? themeColor : ''}]">
					{{tab.name}}
				</view>
			</view>
			<view class="order-tab" v-if="tabList.length === 2">
				<view v-for="(tab, index) in tabList" :key="index" @tap="changeTab(tab,index)"
					:class="tab.checked ? 'order-tab-item2 order-tab-item_checked' : 'order-tab-item2' "
					:style="[{borderBottom: tab.checked ? `${2}rpx solid ${themeColor}` : ''}, {color: tab.checked ? themeColor : ''}]">
					{{tab.name}}
				</view>
			</view>
			<view class="order-tab" v-if="tabList.length === 1">
				<view v-for="(tab, index) in tabList" :key="index" @tap="changeTab(tab,index)" class="order-tab-item1"
					:style="[{borderBottom: `${2}rpx solid ${themeColor}`}, {color: themeColor}]">
					{{tab.name}}
				</view>
			</view>
			<!--用户地址以及支付方式-->
			<view class="order-top">
				<view class="order-top-content">
					<view class="flex flex-direction">
						<view class="cu-list menu padding-tb-sm">
							<!-- 配送 -->
							<view class="cu-item arrow" style="border-bottom: 2rpx solid #e8e8e8;" @click="toAddress"
								v-if="current === 0 ">
								<view class="cu-item-icon">
									<u-icon name="map-fill" :color="themeColor" size="68"></u-icon>
								</view>
								<view class="content padding-tb-sm">
									<view class="text-xl text-bold" style="word-break: break-all;">
										{{ initState.buyer.address }}{{initState.buyer.addressDetail}}
									</view>
									<view class="text-df">
										<span
											style="word-break: break-all;width: 480rpx;padding-right: 15rpx;">{{initState.buyer.name}}{{initState.buyer.sex === 1 ? '先生' : '女士'}}</span>
										<span>{{initState.buyer.phone}}</span>
									</view>
								</view>
								<!-- <view class="content padding-tb-sm text-bold text-xl" v-else>添加联系人信息</view> -->
								<view class="action"></view>
							</view>
							<!-- 到店自提 -->
							<view v-if="current === 1 && !isOrder" class="cu-self">
								<view class="cu-self-address">{{saler.address}} <text v-if="saler.phone"><text
											style="margin: 0 10rpx"></text>{{saler.phone}}</text></view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">自取时间</view>
									<view class="cu-self-all_edit" @tap="selfGetTime">
										<view class="cu-self-time-date">约{{ selfGetDetailTime }}到店</view>
										<u-icon name="arrow-right"></u-icon>
									</view>
								</view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">自取人姓名</view>
									<view class="cu-self-all_edit">
										<view class="cu-self-all_num">
											<u-input v-model="selfGet.name" input-align="right" type="input" />
										</view>
										<u-icon name="edit-pen"></u-icon>
									</view>
								</view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">预留电话</view>
									<view class="cu-self-all_edit">
										<view class="cu-self-all_num">
											<u-input maxlength="11" v-model="selfGet.phone" input-align="right"
												type="input" />
										</view>
										<u-icon name="edit-pen"></u-icon>
									</view>
								</view>
							</view>
							<!-- 定点配送 -->
							<view v-if="current === 2 && !isOrder" class="cu-self">
								<view class="cu-self-address" @tap="pointGet">{{fixGetSaler.address}}
									<u-icon name="arrow-right"></u-icon>
								</view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">定点配送时间</view>
									<view class="cu-self-all_edit">
										<view class="cu-self-time-date" @tap="fixGetTime">约{{ fixSelected }}</view>
										<u-icon name="arrow-right"></u-icon>
									</view>
								</view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">接收人姓名</view>
									<view class="cu-self-all_edit">
										<view class="cu-self-all_num">
											<u-input v-model="selfGet.name" input-align="right" type="input" />
										</view>
										<u-icon name="edit-pen"></u-icon>
									</view>
								</view>
								<view class="cu-self-all">
									<view class="cu-self-all_text">预留电话</view>
									<view class="cu-self-all_edit">
										<view class="cu-self-all_num">
											<u-input maxlength="11" v-model="selfGet.phone" input-align="right"
												type="input" />
										</view>
										<u-icon name="edit-pen"></u-icon>
									</view>
								</view>
							</view>


							<view class="cu-item arrow">
								<view class="content">
									<text class="text-bold">支付方式</text>
									<view style="display: inline-block;margin-left: 20rpx;" @click="showTip">
										<u-icon name="question-circle" size="28"></u-icon>
									</view>
								</view>
								<view class="action" @click="clickSheet">
									<text class="text-red text-df text-bold">{{payTypeTest}}</text>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
			<!--购买详情-->
			<view class="order-goods">
				<view class="order-goods-shop text-overflow">
					{{ merchantData.merchantName||'精彩电影' }}
				</view>
				<view class="order-goods-item" v-for="(item, index) in goodsList" :key="index">
					<!-- 单规格商品 -->
					<view v-if="!item.isMultiSpec" class="order-goods-item">
						<view class="order-goods-item-left">
							<image
								:src="item.productUrlList && item.productUrlList[0] ? spMatefileBaseURL + item.productUrlList[0] + fixStr : tempImage " />
						</view>
						<view class="order-goods-item-center">
							<text class="text-overflow">{{item.name}}</text>
							<text class="text-overflow">单位规格：{{item.unit || ''}}</text>
							<text>×{{item.count || 0}}</text>
						</view>
						<view class="order-goods-item-right">
							<text class="text-bold text-red">￥{{(item.count * item.goodsPrice).toFixed(2)}}</text>
						</view>
					</view>
					<!-- 多规格商品 -->
					<view v-else style="width: 100%">
						<view v-for="(mul, mulIndex) in item.multilOptions" :key="mulIndex" class="order-goods-item">
							<view class="order-goods-item-left">
								<image
									:src="mul.goodsSpecs.pic ? spMatefileBaseURL + mul.goodsSpecs.pic + fixStr : spMatefileBaseURL + item.productUrlList[0] + fixStr " />
							</view>
							<view class="order-goods-item-center">
								<text class="text-overflow">{{item.name}}</text>
								<text
									class="text-overflow4">单位规格：{{getCheckedDta(mul.goodsSpecs,mul.goodsAttributes) || ''}}</text>
								<text>×{{mul.count || 0}}</text>
							</view>
							<view class="order-goods-item-right">
								<text class="text-bold text-red">￥{{(mul.count * mul.totalPrice).toFixed(2)}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--价格计算-->
			<view class="order-money">
				<view class="cu-list menu padding-tb-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-black">商品价格</text>
						</view>
						<view class="action">
							<text
								class="text-df text-bold">￥{{ getProductMoney(priceInfo.amount, priceInfo.deliveryMoney) }}</text>
						</view>
					</view>
					<view class="cu-item" v-if="!isOrder">
						<view class="content">
							<text class="text-black">配送费</text>
						</view>
						<view class="action">
							<text class="text-df text-bold">￥ {{priceInfo.deliveryMoney}}</text>
						</view>
					</view>
					<!-- 存在优惠的情况 -->
					<view class="shop-page-act-coupon">
						<!-- 存在优惠的情况，显示满减 -->
						<view v-if="priceInfo.activities" class="shop-page-act">
							<view v-for="(act ,actIndex) in priceInfo.activities" :key="actIndex"
								class="shop-page-act-data">
								<view class="shop-page-act-data_name">
									<image src="../../static/images/tab01.png" /> {{act.activityName}}
								</view>
								<view class="shop-page-act-data_money">- ￥{{act.discountMoney}}</view>
							</view>
						</view>
						<!-- 存在优惠的情况，显示优惠券 -->
						<view v-if="priceInfo.useCouponInfos" class="shop-page-coupon">
							<view v-for="(coupon ,couponIndex) in priceInfo.useCouponInfos" :key="couponIndex"
								class="shop-page-coupon-data">
								<view class="shop-page-coupon-data-value">
									<view class="shop-page-coupon-data-value_name">
										<image src="../../static/images/tab02.png" />优惠券
									</view>
									<view class="shop-page-coupon-data-value_money">- ￥{{coupon.discountMoney}}</view>
								</view>
								<view class="shop-page-coupon-data-name">
									{{coupon.couponName}}
								</view>
							</view>
						</view>
					</view>

					<view class="cu-item">
						<view class="content">
							<text class="text-black">合计</text>
						</view>
						<view class="action">
							<text class="text-df text-bold text-red">￥
								<!-- {{ (parseFloat(priceInfo.amount) + parseFloat(priceInfo.deliveryMoney)).toFixed(2) }} -->
								{{parseFloat(priceInfo.payMoney).toFixed(2)}}
							</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 备注 -->
			<view class="cu-list menu" style="margin: 0 20rpx 60rpx 20rpx;border-radius: 10rpx;" @click="toRemark">
				<view class="cu-item arrow">
					<view class="content">
						<text class="text-black">备注</text>
					</view>
					<view class="action" style="flex: 1;">
						<text class="text-df text-bold text-overflow"
							style="color: #c7c7c7; float: right;">{{ textValue ? textValue : '去填写备注' }}</text>
					</view>
				</view>
			</view>
			<view class="order-bottom">
				<settle :totalMoney="priceInfo.payMoney" :distribution="priceInfo.deliveryMoney"
					:showTotal="initState.buyer.address || params.buyer.address || isOrder ?  true : false"
					:toPayment="true" @toPayment="toPayment" :isOrderSettlement="true" :errorCode="errorCode"
					:cardId="selectPayType.cardId" :isSubmit="true">
				</settle>

			</view>
			<u-modal v-model="show" :content="content" title="支付方式" confirm-text="我知道了"></u-modal>
			<!--轻提示-->
			<u-toast ref="uToast" />
			<!-- 到店自提时间选择器 -->
			<u-picker mode="multiSelector" v-model="selfTimeShow" :default-selector='defaultSelectedTime'
				:range="multiSelSelector" @confirm="multiSelfConfirm"></u-picker>
			<!--输入密码支付-->
			<zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk"></zj-password-popup>
			<!-- 定点配送地址 -->
			<u-picker v-model="pointShow" mode="selector" :range="ponitSelector" @confirm="fixGetConfirm"></u-picker>
			<!-- 定点配送时间 -->
			<u-select v-model="fixGetTimeShow" mode="mutil-column-auto" :list="fixGetTimeSelector"
				@confirm="fixGetTimeConfirm" :default-value="defaultFixGetTimeSel"></u-select>
			<!-- 支付密码错误弹窗 -->
			<u-modal v-model="passwordErrorShow" :content="passwordErrorContent" @confirm="confirmPassword"
				@cancel="cancelPassword" :show-cancel-button="true" cancel-text="重试" confirm-text="忘记密码"></u-modal>
		</view>

		<!--选择支付方式-->
		<view class="popup" v-show="showAction">
			<view class="popup-select">
				<view class="popup-select-paytype">
					<view>请选择支付方式</view>
				</view>
				<view class="popup-select-icon" @click="showAction = !showAction">
					<u-icon name="close"></u-icon>
				</view>
			</view>

		</view>
	</view>
</template>

<script>

	import {
		BASE_DOMAIN_NAME
	} from "../../common/config";

	//价格计算接口传递参数
	const initState = () => ({
		activities: [],
		appid: '',
		brandNo: '',
		buyer: {}, //收货人地址
		couponsID: [],
		disableMemberPay: true, //不使用会员支付
		disablePointPay: true, //不使用积分支付
		enterRegionNo: "",
		goodsInfos: [], //购买信息
		location: {},
		memberName: "",
		merchantId: "",
		merchantLogo: "",
		merchantName: "",
		merchantNo: "",
		phone: "",
		pickType: '', //下单类型，默认外卖下单
		regionNo: "",
		remark: '', //备注
		saler: {
			phone: "",
			address: ""
		},
		scheduleTime: null,
		terminalNo: "",
		transactionType: '', //当前购买类型，这里默认为外卖
		useActivity: true,
		useCoupon: true,
	})
	//支付接口传参
	const initOrder = () => ({
		appid: "",
		billNo: "",
		event: {},
		extra: {},
		mkOrderNo: "",
		paymentList: [],
		platform: "default",
		transactionType: null
	})
	export default {
		data() {
			return {
				merchantNos: '',
				h5OpenForm: uni.getStorageSync('h5OpenForm'), // 当前打开的是什么设备和软件
				myp: '',
				password: null, //支付密码
				bank: this.$const.BANK,
				// nowPayType: this.$const.PAY_TYPE.WECHAT, //默认使用微信支付1
				nowPayType: '', //默认没有
				member: {}, //用户人员信息
				companyStaffEntity: {},
				merchantNo: '', //门店号
				goodsList: {}, //该门店下的购买商品
				merchantData: {}, //门店详情
				getApiPriceInfo: {}, //所有计价接口返回数据
				
				priceInfo: {
					account: {
						accountId: "d69fbe140eb6499f9d38f3759fbc798c",
						actualMoney: 0,
						actualPoint: 0,
						pointDeductMoney: 0,
						subjectType: 5,
					},
					actualMoney: 43,
					amount: 43,
					billNo: "00031648534459685000049",
					deliveryMoney: 0,
					discountMoney: 0,
					goods: [{
						actualMoney: 43,
						amount: 43,
						count: 1,
						discountMoney: 0,
						goodsAttributes: null,
						goodsGarnishs: null,
						goodsId: "405e274ea2ba4748b36d7b60af86a3a0",
						price: 43,
						skuId: "405e274ea2ba4748b36d7b60af86a3a0",
					}],
					merchantNo: "9ZLWBzob",
					mkOrderNo: "f5b2e4cd-595a-4651-a96e-b8b5d2779f03",
					packMoney: 0,
					payMoney: 43,
				}, //支付金额

				initState: {
					...initState()
				}, //计价接口
				initOrder: {
					...initOrder()
				}, //支付接口
				preSettleCalcApi: {}, //医保结算
				show: false,
				queryResultCount: 0,
				content: '支付方式：默认使用当前支付方式。',
				showAction: false,
				actionList: [],
				selectPayType: {}, //选择的支付方式
				tips: {
					text: '请选择支付方式',
					color: '#909399',
					fontSize: 24
				},
				payTypeTest: '',
				// payTypeTest: '',
				textValue: '',
				address: '',
				isGetAddress: false,
				tempImage: '../../static/images/default-shop.png',
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				isCart: false,
				errorCode: '',
				tabList: [{
					"name": "配送",
					"checked": true
				}, {
					"name": "到店自提",
					"checked": false
				}, {
					"name": "定点配送",
					"checked": false
				}],
				current: 0,
				formId: '',
				goodsIdArray: [], // 购买的商品情况
				selfGet: {
					name: '',
					phone: ''
				},
				selfTimeList: [],
				selfTimeShow: false,
				shopOpenTime: 0, // 开店时间
				shopCloseTime: 0, // 关店时间
				selfGetDetailTime: '',
				saler: {
					address: '',
					phone: ''
				},
				fixGetSaler: {
					address: '',
					phone: '',
					location: {}
				},
				selfScheduleTime: null,
				fixScheduleTime: null, // 定点配送时间时间戳
				params: {
					buyer: {
						address: ''
					}
				},
				multiSelSelector: [], // 自提时间选择
				prepareTime: 0, // 准备时间
				defaultSelectedTime: [0, 0, 0], // 默认选择的自提时间
				pointShow: false,
				ponitSelector: [], // 定点配送数据
				fixAddressItems: [], // 定点配送全部地址数据
				fixGetTimeShow: false,
				fixGetTimeSelector: [], //定点配送时间数组
				defaultFixGetTimeSel: [0, 0], // 定点配送时间默认数据
				fixSelected: '', // 定点配送时间选择
				fixAddressIndex: 0, // 定点配送地址数组下标
				isOrder: false, // 判断是否是点单
				orderParams: {}, // 点单请求参数
				passwordErrorShow: false,
				passwordErrorContent: '支付密码错误，请重试！',
				isOpenPurse: false,
				selectedAccount: {}, // 用户信息
				payTypeName: '', // 银行卡的尾数
				themeColor: '',
				isShare: false,
				accountBalance: null,
				estimatedTime: 0, //预计送达时间

			}
		},
		onShow() {
			this.isOrder = uni.getStorageSync('ISORDER')

			// 获取判断是否是购物车进入的订单参数
			this.isCart = this.$shopMall.getIsCart() || false


		},
		computed: {
			pageLang() {
				return this.$t('pages.shop.shopCheck')
			}
		},
		watch: {
			current: {
				handler(val) {
					this.params = JSON.parse(JSON.stringify(this.initState))
					// 如果是外卖的情况
					if (!this.isOrder) {
						if (val === 0) {
							this.getPriceInfo()
						} else if (val === 1) {
							delete this.params.location
							this.params.buyer = {
								name: this.selfGet.name,
								phone: this.selfGet.phone + '',
								address: this.saler.address
							}
							this.params.saler = this.saler
							this.params.pickType = this.$const.PICK_TYPE.TAKE_SELF //自提
							this.params.scheduleTime = this.selfScheduleTime
							this.getPriceInfo(this.params)
						} else if (val === 2) {
							this.params.location = this.fixGetSaler.location
							this.params.buyer = {
								name: this.selfGet.name,
								phone: this.selfGet.phone + '',
								address: this.fixGetSaler.address
							}
							this.params.saler.address = this.fixGetSaler.address
							this.params.saler.phone = this.fixGetSaler.phone
							this.params.pickType = this.$const.PICK_TYPE.TAKE_FIXED_POINT //定点配送
							this.params.scheduleTime = this.fixScheduleTime
							this.getPriceInfo(this.params)
						}
					}
				}
			},
			fixAddressIndex: {
				handler(val) {
					// 自提地址改变
					this.getFixData()
					this.fixSelected =
						`${this.fixGetTimeSelector[0].label} ${this.fixGetTimeSelector[0].children[0].label}`
					// 初始化时间戳
					let dataValue = [{
							label: this.fixGetTimeSelector[0].label,
							value: this.fixGetTimeSelector[0].value
						},
						{
							label: this.fixGetTimeSelector[0].children[0].label,
							value: this.fixGetTimeSelector[0].children[0].value
						}
					]
					this.fixGetTimeConfirm(dataValue)
					// 重新调取计价接口
					this.params = JSON.parse(JSON.stringify(this.initState))
					this.params.location = this.fixGetSaler.location
					this.params.buyer = {
						name: this.selfGet.name,
						phone: this.selfGet.phone + '',
						address: this.fixGetSaler.address
					}
					this.params.saler.address = this.fixGetSaler.address
					this.params.saler.phone = this.fixGetSaler.phone
					this.params.pickType = this.$const.PICK_TYPE.TAKE_FIXED_POINT //定点配送
					this.params.scheduleTime = this.fixScheduleTime
					this.getPriceInfo(this.params)
				}
			}
		},
		methods: {
			getProductMoney(amount, delivery) {
				if (delivery == '' || delivery == 0 || delivery == undefined) {
					delivery = 0
				}
				let sum = ((amount * 100) - (delivery * 100)) / 100
				return sum
			},
			// 弹窗不展示
			selectShow(value) {
				console.log('从组件返回的值')
				console.log(this.showAction)
				this.showAction = value
			},
			// 支付方式
			getSelectCard(value, type) {
				//通过type识别解决在h5情况下无论如何在u-pop中组件都会重新运行

				if (!value) {
					this.payTypeName = null
					this.showAction = false
					return
				}
				this.selectPayType = value
				this.payTypeTest = value.name
				this.nowPayType = this.$const.PAY_TYPE[value.type.toUpperCase()]
				if (value.type === 'card') {
					this.payTypeName =
						`银行卡（${value.bindMedium.substr(value.bindMedium.length - 4)}）`
					this.showAction = false
				} else {
					this.payTypeName = null
					this.showAction = false
				}

			},
			//点击输入密码
			passwordInputOk(value) {
				this.password = value
				this.doPay()
			},
			doPay() {
				//验证对应密码
				//调用支付
				this.toPayLast(this.formId, this.goodsIdArray)
			},
			//获取当前用户的支付方式
			getHowToPay() {


			},
			onLoad(option) {
				console.log('order-submit   option', option)
				// let data = JSON.parse(decodeURIComponent(option.shopData))
				this.isShare = option.isShare || false
				this.getHowToPay()
				this.isGetAddress = false
				this.merchantNo = option.merchantNo //门店号
				this.merchantNos = this.merchantNo + new Date().getTime()
				//该门店下的购买商品
				let goods = this.$shopMall.getSelectedGoods(this.merchantNo)
				this.merchantData.merchantName = Object.values(goods)[0].merchantName
				this.goodsList = goods
				this.initState.buyer = {
					address: "福州市鼓楼区人民政府",
					addressDetail: "222",
					cityName: "福州市",
					districtName: "鼓楼区",
					name: "王",
					phone: "13222222222",
					provinceName: "福建省",
					sex: 1,
					location: {
						lat: 26.08198,
						lon: 119.30405,
						type: "gcj02"
					}
				}
				//获取门店地址
				if (option.address) {
					const address = JSON.parse(option.address)
					this.isGetAddress = true
					this.getStoreInfo()
				} else {
					//获取当前收货人情况地址
					this.getDeliveryAddress()
				}
				this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			},
			//获取门店详情
			getStoreInfo() {

			},
			//计价接口
			getPriceInfo(params) {

			},
			showUViewToast(res) {
				this.$refs.uToast.show({
					title: res,
					type: 'default'
				})
			},
			//获取收货地址，默认使用第一个
			getDeliveryAddress() {
				this.initState.buyer = {
					address: "福州市鼓楼区人民政府",
					addressDetail: "222",
					cityName: "福州市",
					districtName: "鼓楼区",
					name: "王",
					phone: "13222222222",
					provinceName: "福建省",
					sex: 1,
				}
				this.getStoreInfo()
			},
			//获取
			showTip() {
				this.show = true
			},
			clickSheet() {
				this.showAction = true
			},
			toRemark() {
				uni.navigateTo({
					url: `/pages/shop/remarks?remark=${this.textValue}`
				})
			},
			//进行支付
			toPayment(formId) {
				this.formId = formId
				//支付之前进行重新计价
				if (!this.isOrder) {
					let phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
					if (this.current === 1) {
						delete this.params.location
						this.params.buyer = {
							name: this.selfGet.name,
							phone: this.selfGet.phone + '',
							address: this.saler.address
						}
						this.params.saler = this.saler
						this.params.pickType = 2
						this.params.scheduleTime = this.selfScheduleTime
					} else if (this.current === 2) {
						// 重新调取计价接口
						this.params = JSON.parse(JSON.stringify(this.initState))
						this.params.location = this.fixGetSaler.location
						this.params.buyer = {
							name: this.selfGet.name,
							phone: this.selfGet.phone + '',
							address: this.fixGetSaler.address
						}
						this.params.saler.address = this.fixGetSaler.address
						this.params.saler.phone = this.fixGetSaler.phone
						this.params.pickType = this.$const.PICK_TYPE.TAKE_FIXED_POINT //定点配送
						this.params.scheduleTime = this.fixScheduleTime
					}
					let p = this.current === 0 ? this.initState : this.params
					// 只要是计价，就要传account参数
					p.account = {
						accountId: this.selectedAccount.accountId,
						subjectType: this.selectedAccount.subjectType
					}
					if (JSON.stringify(p.buyer) === '{}') {
						this.$refs.uToast.show({
							title: '请添加地址！',
							type: 'warning',
						})
					} else if (p.buyer.name == '') {
						this.$refs.uToast.show({
							title: '请输入姓名！',
							type: 'warning',
						})
					} else if (!phone.test(p.buyer.phone)) {
						this.$refs.uToast.show({
							title: '请输入正确的手机号！',
							type: 'warning',
						})
					} else {
						//重新计价

					}

				}

			},
			//最终支付并是否订阅
			toPayLast(formId, goodsIdArray) {
				//消息订阅
				let _this = this

				// #ifdef MP-WEIXIN
				this.$plugin.app.subscribe('consumption', {
					returnBack: res => {
						_this.toPayMoneyLast(formId, goodsIdArray)
					}
				})
				// #endif

				// #ifdef H5
				_this.toPayMoneyLast(formId, goodsIdArray)
				// #endif
			},
			//最终支付
			toPayMoneyLast(formId, goodsIdArray) {
				let _this = this
				this.initOrder = {
					appid: this.$appid,
					billNo: this.priceInfo.billNo, //订单号
					collects: uni.getStorageSync('qidInfo').id ? [ //2021.11.17日高老师说需要传这个
						{
							"key": uni.getStorageSync('qidInfo').id || '', //码Id
							"type": "qrcode" //固定写死
						}
					] : [],
					event: { //审计信息
						info: {},
						message: "外卖下单"
					},
					extra: { //extra各类信息
						vociceTerminal: uni.getStorageSync('qidInfo').terminalNo ||
							null, //2021.11.17日高老师说需要传这个 音箱终端号，高老师说的小程序的返回参数叫
						authorFlag: 0,
						remark: this.initState.remark,
						deskNo: uni.getStorageSync('deskNo'), //获取桌台号
						openid: (uni.getStorageSync('unionpayOptions')).openId || '',
						nonce: (uni.getStorageSync('unionpayOptions')).nonce || ''
					},
					paymentList: [{ //商品信息
						amount: this.priceInfo.payMoney,
						payType: this.nowPayType,
						protocolId: this.getApiPriceInfo.protocolId || '',
						subPayType: this.selectPayType.cardId === 'WECHAT' || this.selectPayType.cardId ===
							'UNIONPAY' || this
							.selectPayType.cardId === 'ALIPAY' || this.selectPayType.cardId ===
							'UNIONPAYAPPLET' ? this.$plugin.app.returnSubPayType() :
							'BARPAY', //subPayType根据具体情况判断
						barcode: 'ZREMO1H9', //传递验证码，后台估计不验证，只要不为空
						returnPage: BASE_DOMAIN_NAME +
							`/softwareparkweb/h5/#/pages/shop/categories?pageType=2&id=${this.merchantNo}`,
						successUrlPage: BASE_DOMAIN_NAME + "/webappUser/success.html", //注意给银行的链接不能有#或者中文字符
						failUrlPage: BASE_DOMAIN_NAME +
							"/softwareparkweb/otherh5/fail.html", //注意给银行的链接不能有#或者中文字符
					}],
					platform: "default",
					transactionType: this.nowPayType === this.$const.PAY_TYPE.YBZF ? 2000 : this.$const.TRANSATION_TYPE
						.TAKE_OUT, //非医保购买类型，这里默认为外卖
				}
				if (this.isOrder) {
					this.initOrder.transactionType = 2
				}
				if (formId) {
					this.initOrder.formId = formId
				}
				this.initOrder.mkOrderNo = this.priceInfo.mkOrderNo
				//不同类型的支付类型需要操作不同的支付参数
			
				switch (this.nowPayType) {
					//钱包或者银行卡支付
					case this.$const.PAY_TYPE.CARD:
					case this.$const.PAY_TYPE.WALLET:
						this.initOrder.paymentList[0].payPassword = this.password
						if (this.$store.state.enableMemberPassword === 1) {
							this.initOrder.paymentList[0].passwordType = 3
						}
						// this.initOrder.paymentList[0].passwordType = this.$store.state.enableMemberPassword !== 1 ? null : 3		//默认密码类型为3
						this.initOrder.paymentList[0].protocolId = this.selectPayType.cardId
						if (this.payTypeName) {
							this.initOrder.paymentList[0].subPayTypeName = this.payTypeName
						}
						//   // isBankCard 0:钱包 1:银行卡
						this.initOrder.extra.isBankCard = this.payTypeName ? 1 : 0
						break;
					default:
						break
				}
				this.initOrder.receiver = {
					...this.initState.buyer,
					location: this.params.location || {}
				}
				// 具体的收货地址需要在这一步重新赋值
				if (this.current == 1) {
					this.initOrder.receiver.address = this.saler.address
					delete this.initOrder.receiver.addressDetail
				} else if (this.current == 2) {
					this.initOrder.receiver.address = this.fixGetSaler.address
					delete this.initOrder.receiver.addressDetail
				}
				// 具体的收货人姓名和手机需要在这一步重新赋值
				this.initOrder.receiver.name = this.selfGet.name
				this.initOrder.receiver.phone = this.selfGet.phone
				// 如果是点单，需要删除所有地址信息
				if (this.isOrder) {
					delete this.initOrder.receiver
				}
				myFunction(this.initOrder, {
					hideLoading: false,
					hideMsg: false,
				}).then(res => {
					let orderObj = res.object
					uni.showLoading({
						title: '加载中'
					})
					switch (this.nowPayType) {
						//如果是微信情况下，调用微信支付模块
						case this.$const.PAY_TYPE.WECHAT:
							this.$plugin.app.requestPayment(orderObj, {
								success: res => {
									//支付成功
									this.queryOrder(_this.priceInfo.billNo)
									uni.hideLoading()
								},
								fail: err => {
									uni.hideLoading()
									//支付失败
									this.loading = false
									// 此页面只被预约和点单调用了，所以参数可以写死
									setTimeout(() => {
										uni.redirectTo({
											url: `/myPackageA/pages/order/user-order-detail?status=${'0'}&id=${JSON.stringify(orderObj.orderInfo.items)}&billNo=${orderObj.orderInfo.billNo}&transactionType=${orderObj.orderInfo.transactionType}`
										})
									}, 1000)
									// 待支付状态，把商品从缓存中去掉
									this.$shopMall.clearSelectedGoods(this.merchantNo)
								}
							}, this.merchantNo)
							break;
							//钱包或者银行卡支付，直接跳转支付成功
						case this.$const.PAY_TYPE.WALLET:
						case this.$const.PAY_TYPE.CARD:
							this.paySuccess(orderObj.orderInfo.billNo)
							this.payTypeName = ''
							break;
						default:
							//默认情况下都使用支付组件
							this.$plugin.app.requestPayment(orderObj, {
								success: res => {
									//支付成功
									this.queryOrder(_this.priceInfo.billNo)
									uni.hideLoading()
								},
								fail: err => {
									uni.hideLoading()
									//支付失败
									this.loading = false
									// 此页面只被预约和点单调用了，所以参数可以写死
									setTimeout(() => {
										uni.redirectTo({
											url: `/myPackageA/pages/order/user-order-detail?status=${'0'}&id=${JSON.stringify(orderObj.orderInfo.items)}&billNo=${orderObj.orderInfo.billNo}&transactionType=${orderObj.orderInfo.transactionType}`
										})
									}, 1000)
									// 待支付状态，把商品从缓存中去掉
									this.$shopMall.clearSelectedGoods(this.merchantNo)
								}
							}, this.merchantNo)
							break;
					}
				})
			},
			//支付成功
			queryOrder(billNo) {
				this.queryResultCount = 0
				uni.showLoading({
					title: '交易查询中',
					mask: true
				})
				//清空选择的商品缓存
				this.$shopMall.clearSelectedGoods(this.merchantNo)

			},
			//支付成功页面跳转
			paySuccess(orderNo) {
				uni.showToast({
					title: '支付成功'
				})

				// 支付成功之后，把商品从缓存中去掉
				this.$shopMall.clearSelectedGoods(this.merchantNo)

				//跳转对应的订单查询页面
				setTimeout(() => {
					this.$nextTick(() => {
						if (this.isShare) {
							// 如果是分享的数据，那么要传到订单详情页面，给返回的路径传值
							uni.redirectTo({
								url: `/pages/shop/settlement?orderNo=${orderNo}&merchantNo=${this.merchantNo}&isShare=${this.isShare}`
							})
						} else {
							uni.redirectTo({
								url: `/pages/shop/settlement?orderNo=${orderNo}&merchantNo=${this.merchantNo}`
							})
						}

					})
				}, 800)
			},
		
			toAddress() {
				uni.redirectTo({
					url: `/pages/shop/user/user-address-list?merchantNo=${this.merchantNo}`
				})
			},
			// 格式化规格
			getCheckedDta(specChecked, attributeChecked) {
			
				let string = specChecked.specification == undefined || specChecked.specification == '' ? '' : specChecked
					.specification
				attributeChecked.forEach((val, index) => {
					if (index == 0 && string == '') {
						string = val.value.value
					} else {
						string += `、${val.value.value}`
					}
				})
				return string
			},
			//切换配送方式
			changeTab(tab, index) {
				if (tab.name === '配送') {
					this.current = 0
				} else if (tab.name === '到店自提') {
					this.current = 1
				} else if (tab.name === '定点配送') {
					this.current = 2
				}
				this.tabList.forEach((val, valIndex) => {
					if (valIndex === index) {
						val.checked = true
					} else {
						val.checked = false
					}
				})
			},
			// 获取配送时间列表
			getmultiSelSelector() {
				let today = new Date()
				// 明天的时间
				let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
				// 获取今天是周几
				let todayWeek = today.getDay()
				// 获取明天的周几
				let tomorrowWeek = tomorrow.getDay()
				// 获取第一列的值
				let dateArr = [`今天(${this.getWeek(todayWeek)})`, `明天(${this.getWeek(tomorrowWeek)})`]
				this.multiSelSelector = []
				// 获取第二列的值
				let hourArr = []
				for (let i = 0; i <= 23; i++) {
					if (i < 10) {
						hourArr.push(`0${i} 时`)
					} else {
						hourArr.push(`${i} 时`)
					}
				}
				// 获取第三列的值
				let minArr = []
				for (let i = 0; i <= 59; i++) {
					if (i < 10) {
						minArr.push(`0${i} 分`)
					} else {
						minArr.push(`${i} 分`)
					}
				}
				this.multiSelSelector.push(dateArr, hourArr, minArr)
			},
			// 自提时间选择
			multiSelfConfirm(value) {
				let selectDate = ''
				let today = new Date()
				// 明天的时间
				let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
				// 准备时间转换成时间戳
				let prepareTime = this.prepareTime ? this.prepareTime * 60 * 1000 : 0
				// 获取对应的年月日
				let todayY = today.getFullYear()
				let todayM = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1
				let todayD = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
				let tomorrowY = tomorrow.getFullYear()
				let tomorrowM = (tomorrow.getMonth() + 1) < 10 ? `0${tomorrow.getMonth() + 1}` : tomorrow.getMonth() + 1
				let tomorrowD = tomorrow.getDate() < 10 ? `0${tomorrow.getDate()}` : tomorrow.getDate()
				let tDate = `${todayY}-${todayM}-${todayD}`
				let tomoDate = `${tomorrowY}-${tomorrowM}-${tomorrowD}`
				// 计算今天营业时间的时间戳
				let tStartTime = this.getTargetTime(`${tDate} ${this.shopOpenTime}:00`)
				let tEndTime = this.getTargetTime(`${tDate} ${this.shopCloseTime}:00`)
				// 计算明天营业时间的时间戳
				let toStartTime = this.getTargetTime(`${tomoDate} ${this.shopOpenTime}:00`)
				let toEndTime = this.getTargetTime(`${tomoDate} ${this.shopCloseTime}:00`)
				// 获取当前时间的时间戳
				let todayTime = today.getTime()

				// 格式化选择的时间
				if (value[0] === 0) {
					// 选择今天
					selectDate = tDate
				} else {
					// 明天
					selectDate = tomoDate
				}
				let selectHour = value[1] < 10 ? `0${value[1]}` : value[1]
				let selectMinute = value[2] < 10 ? `0${value[2]}` : value[2]
				let selectedTime = `${selectDate} ${selectHour}:${selectMinute}:00`
				// 获得选择时间的时间戳
				let selected = this.getTargetTime(selectedTime)

				// 判断选择的时间是否符合要求
				if (value[0] === 0) {
					// 如果是选的今天
					// 先判断是否在营业时间内
					if (selected >= tStartTime && selected <= tEndTime) {
						if (selected > (todayTime + prepareTime)) {
							// 如果选择的时间比当前时间加上准备时间大，那就符合要求
							this.selfScheduleTime = selected
							// 把默认时间设置为选择的值
							this.defaultSelectedTime = value
							this.selfGetDetailTime = this.getDateHM(selected)
						} else {
							this.$refs.uToast.show({
								title: '太早啦，请选择晚一点的时间！',
								type: 'error'
							})
						}
					} else {
						// 不在营业时间内
						this.$refs.uToast.show({
							title: '不在营业时间，请重新选择！',
							type: 'error'
						})
					}
				} else {
					// 如果选择是明天
					// 判断是否在营业时间内
					if (selected >= toStartTime && selected <= toEndTime) {
						this.selfScheduleTime = selected
						// 把默认时间设置为选择的值
						this.defaultSelectedTime = value
						this.selfGetDetailTime = `明天 ${this.getDateHM(selected)}`
					} else {
						// 不在营业时间内
						this.$refs.uToast.show({
							title: '不在营业时间，请重新选择！',
							type: 'error'
						})
					}
				}
			},
			// 获取自提时间
			selfGetTime() {
				this.selfTimeShow = true
			},
			// 获取定点配送地址
			pointGet() {
				this.pointShow = true
			},
			// 定点配送地址数据切换
			fixGetConfirm(value) {
				this.fixAddressIndex = value[0]
				this.fixGetSaler.address = this.fixAddressItems[value[0]].address
				this.fixGetSaler.location = this.fixAddressItems[value[0]].location
			},
			// 定点配送时间切换
			fixGetTime() {
				this.fixGetTimeShow = true
			},
			// 获取定点配送时间列表
			getFixData() {
				this.fixGetTimeSelector = []
				// 根据目前选择的地址选择配送时间
				let fixTimeList = this.fixAddressItems.find(val => JSON.stringify(val.location) === JSON.stringify(this
					.fixGetSaler.location) && val.address === this.fixGetSaler.address)
				//  let fixTimeList = []
				// 获取今天周几
				let todayWeek = new Date().getDay() === 0 ? 7 : new Date().getDay()
				// 获取星期选择
				let fixTimeWeek = []
				// 将时间戳转换成时间
				let today = new Date()
				let todayY = today.getFullYear()
				let todayM = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1
				let todayD = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
				// 获取到今天的年月日
				let tDate = `${todayY}-${todayM}-${todayD}`
				fixTimeList.takeoutBusinessItems.forEach(item => {
					// 获取时间点
					let time = []
					item.timeItems.forEach(t => {
						// time.push(this.getTargetTime(`${tDate} ${t.deliveryTime}:00`))
						let timeObj = {
							start: this.getTargetTime(`${tDate} ${t.orderTime}:00`),
							end: this.getTargetTime(`${tDate} ${t.deliveryTime}:00`)
						}
						time.push(timeObj)
						console.log('timeObj----------timeObj', `${tDate} ${t.orderTime}:00`,
							`${tDate} ${t.deliveryTime}:00`)
					})
					console.log('time-----------time', time)
					// return
					let preTime = time.sort(this.compare('end', true))
					let lastTime = []
					preTime.forEach(val => {
						let objTime = {
							value: this.getDateHM(val.start),
							label: this.getDateHM(val.end),
						}
						lastTime.push(objTime)
					})
					// 存入星期几
					item.takeoutBusinessWeeks.forEach(week => {
						// 确保时间不重复
						let obj = {}
						let fIndex = fixTimeWeek.findIndex(f => f === week)
						if (fIndex === -1) {
							// 之前没有存过的星期，那么就存入时间
							fixTimeWeek.push(week)
							obj = {
								value: week,
								label: this.getWeek(week),
								children: lastTime
							}
							this.fixGetTimeSelector.push(obj)
						}

					})
				})
				// 升序：这里会获取到的数据安装星期六排序并重新得到对应数据顺便
				let arr = this.fixGetTimeSelector.sort(this.compare('value', true));
				// 用于保本周会进行选择的时间数据
				let arrTemp = []
				// 属于今天的第二天明天的选择时间数据
				let tomorrowTemp = []
				arr.forEach((a, aIndex) => {
					// 判断星期，大于今天的数据必然会进行配送选择的，今天的第二天额外计算
					if (a.value > todayWeek + 1) {
						arrTemp.push(a)
					} else if (a.value === todayWeek + 1) {
						// 今天的第二天额外计算
						// 加入今天的第二天能够进行配送的数据
						let tomorrowChild = JSON.parse(JSON.stringify(a))
						if (tomorrowTemp.length !== 0) {
							tomorrowChild.children = tomorrowTemp
							arrTemp.push(tomorrowChild)
						}
					} else if (a.value === todayWeek) {
						// 如果是今天
						// 判断配送时间是否存在
						let child = JSON.parse(JSON.stringify(a))
						// 今天的选择时间数据
						let timeFixArr = []
						a.children.forEach((dd, index) => {
							// 对比时间时间戳
							let time = parseInt(this.getTargetTime(`${tDate} ${dd.value}:00`))
							// 当前时间时间戳
							let nowTime = parseInt(new Date().getTime())
							console.log('现在时间是：', nowTime, this.timeFormat(nowTime))
							console.log('time', time, parseInt(new Date().getTime()), time > parseInt(
								new Date().getTime()))


							// 如果当天下单截止时间小于现在的时间，那么今天当天表示不可以配送
							if (parseInt(this.getTargetTime(`${tDate} ${dd.value}:00`)) >= parseInt(
									new Date().getTime())) {
								if (this.getTargetTime(`${tDate} ${dd.value}:00`) < this.getTargetTime(
										`${tDate} ${dd.label}:00`)) {
									// value表示下单截止时间，label表示配送时间
									// 如果下单截止时间小于配送时间，表示今天配送
									timeFixArr.push(dd)
									// 今天能够选择的，在第二天也一定能够选择，所以加入
									tomorrowTemp.push(dd)
								} else {
									// value表示下单截止时间，label表示配送时间
									// 如果下单截止时间大于配送时间，表示明天配送的
									tomorrowTemp.push(dd)
								}
							} else {
								if (this.getTargetTime(`${tDate} ${dd.value}:00`) < this.getTargetTime(
										`${tDate} ${dd.label}:00`)) {
									// 今天能够选择的，在第二天也一定能够选择，所以加入
									tomorrowTemp.push(dd)
								}
							}
							// let time = parseInt(this.getTargetTime(`${tDate} ${dd.label}:00`))
							// console.log('time', time, parseInt(new Date().getTime()))

							// if (parseInt(this.getTargetTime(`${tDate} ${dd.label}:00`)) >= parseInt(
							// 		new Date().getTime())) {
							// 	// 如果时间小于现在的时间，表示不可以配送
							// 	timeFixArr.push(dd)

							// }
						})
						// 加入今天能够进行配送的数据
						if (timeFixArr.length !== 0) {
							child.children = timeFixArr
							arrTemp.push(child)
						}

						// -------------------------------- 旧代码
						// // 如果是今天
						// // 判断配送时间是否存在
						// let child = JSON.parse(JSON.stringify(a))
						// let timeFixArr = []

						// a.children.forEach((dd, index) => {
						// 	if (parseInt(this.getTargetTime(`${tDate} ${dd.label}:00`)) >= parseInt(
						// 			new Date().getTime())) {
						// 		// 如果时间小于现在的时间，表示不可以配送
						// 		timeFixArr.push(dd)

						// 	}
						// })
						// if (timeFixArr.length !== 0) {
						// 	child.children = timeFixArr
						// 	arrTemp.push(child)
						// }
						// -------------------------------- 旧代码

					}
				})

				// this.fixGetTimeSelector = arrTemp
				// 判断这周是否还能配送
				if (arrTemp.length === 0) {
					// 如果这周不能配送，那么则显示下周所有能配送的时间
					arr.forEach(a => {
						// 修改value的值，方便计算几天之后的时间
						a.value = 7 - todayWeek + a.value
						a.label = `下${a.label}`
					})
					// 下周一的第一条数据要根据周天情况决定，需要额外处理
					if (tomorrowTemp.length !== 0) {
						arr[0].children = tomorrowTemp
					}
					this.fixGetTimeSelector = arr
				} else {
					// 这周还可以配送
					this.fixGetTimeSelector = arrTemp
				}

				// 获取最终显示的时间数组
				for (let i = 0; i < this.fixGetTimeSelector.length; i++) {
					this.fixGetTimeSelector[i].children = this.fixGetTimeSelector[i].children.sort(this.compare('label',
						true))
				}
				console.log('最后的this.fixGetTimeSelector', this.fixGetTimeSelector, '08:15' < '10:20')
			},
			// 将时间戳转化为年月日时分
			timeFormat(value) {
				let time = ''
				if (value == '' || value == undefined) {
					time = ''
				} else {
					let date = new Date(value);
					let y = date.getFullYear();
					let MM = date.getMonth() + 1;
					MM = MM < 10 ? ('0' + MM) : MM;
					let d = date.getDate();
					d = d < 10 ? ('0' + d) : d;
					let h = date.getHours();
					h = h < 10 ? ('0' + h) : h;
					let m = date.getMinutes();
					m = m < 10 ? ('0' + m) : m;
					let s = date.getSeconds();
					s = s < 10 ? ('0' + s) : s;
					time = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
				}
				return time
			},
			// 选择了定点配送时间
			fixGetTimeConfirm(value) {
				this.fixGetTimeSelector.forEach((val, index) => {
					if (val.label === value[0].label) {
						let i = val.children.findIndex(dd => dd.label === value[1].label)
						this.defaultFixGetTimeSel = [index, i]
						this.fixSelected = `${value[0].label} ${value[1].label}`
						// 获取选择的时间的时间戳
						let todayWeek = new Date().getDay() === 0 ? 7 : new Date().getDay()
						let num = parseInt(value[0].label) - parseInt(todayWeek)
						if (num !== 0) {
							let font = value[0].label.split('', 1)
							if (font[0] === '下') {
								// 下周
								let tem = new Date(new Date().getTime() + (value[0].label * 24 * 3600 * 1000))
								// 将时间戳转换成时间
								let y = tem.getFullYear()
								let m = (tem.getMonth() + 1) < 10 ? `0${tem.getMonth() + 1}` : tem.getMonth() + 1
								let d = tem.getDate() < 10 ? `0${tem.getDate()}` : tem.getDate()
								let tDate = `${y}-${m}-${d}`
								this.fixScheduleTime = this.getTargetTime(`${tDate} ${value[1].label}:00`)
							} else {
								// 本周
								let tem = new Date(new Date().getTime() + (num * 24 * 3600 * 1000))
								// 将时间戳转换成时间
								let y = tem.getFullYear()
								let m = (tem.getMonth() + 1) < 10 ? `0${tem.getMonth() + 1}` : tem.getMonth() + 1
								let d = tem.getDate() < 10 ? `0${tem.getDate()}` : tem.getDate()
								let tDate = `${y}-${m}-${d}`
								this.fixScheduleTime = this.getTargetTime(`${tDate} ${value[1].label}:00`)
							}
						} else {
							// 如果是今天
							let today = new Date()
							let todayY = today.getFullYear()
							let todayM = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today
								.getMonth() + 1
							let todayD = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
							let tDate = `${todayY}-${todayM}-${todayD}`
							this.fixScheduleTime = this.getTargetTime(`${tDate} ${value[1].label}:00`)
						}
					}
				})
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
			// 获取某个时刻的时间戳
			getTargetTime(t) {
				let d = t.split(" ")[0]
				let h = t.split(" ")[1]
				let date = new Date()

				date.setYear(d.split("-")[0])
				date.setMonth(d.split("-")[1] - 1)
				date.setDate(d.split("-")[2])

				date.setHours(h.split(":")[0])
				date.setMinutes(h.split(":")[1])
				date.setSeconds(h.split(":")[2])

				return new Date(date).getTime()
			},
			// 只获取时间的时分
			getDateHM(value) {
				if (typeof (value) == 'undefined') {
					return ''
				} else {
					let date = new Date(parseInt(value))
					let y = date.getFullYear()
					let MM = date.getMonth() + 1
					MM = MM < 10 ? ('0' + MM) : MM
					let d = date.getDate()
					d = d < 10 ? ('0' + d) : d
					let h = date.getHours()
					h = h < 10 ? ('0' + h) : h
					let m = date.getMinutes()
					m = m < 10 ? ('0' + m) : m
					let s = date.getSeconds()
					s = s < 10 ? ('0' + s) : s
					return h + ':' + m
				}
			},
			// 判断是周几
			getWeek(week) {
				switch (week) {
					case 0:
						return '周天';
					case 1:
						return '周一';
					case 2:
						return '周二';
					case 3:
						return '周三';
					case 4:
						return '周四';
					case 5:
						return '周五';
					case 6:
						return '周六';
					case 7:
						return '周天'
				}
			},
			// 对数组里面的对象进行排序 data对象属性
			compare(key, desc) {
				console.log('compare-----------------------------------')
				//key:  用于排序的数组的key值
				//desc： 布尔值，true是升序排序，false是降序排序
				return function (a, b) {
					let value1 = a[key];
					let value2 = b[key];
					console.log('value1-value2', value1, value2)
					if (desc == true) {
						// 升序排列
						return value1 - value2;
					} else {
						// 降序排列
						return value2 - value1;
					}
				};
			}
		}
	}
</script>

<style lang="scss">
	.mall-order-submit-page {
		.cu-list.menu>.cu-item:after {
			border-bottom: none;
		}

		.cu-list.menu>.cu-item {
			min-height: 80rpx;
		}

		.cu-item-icon {
			margin-right: 20rpx;
		}

		.order-tab {
			display: flex;
			margin: 0 24rpx;
			align-items: center;
			height: 70rpx;
			background: white;
			margin-top: 20rpx;

			&-item_checked {
				// border-bottom: 2rpx solid #34A2E8;
				// color: #34A2E8;
				font-weight: bold;
			}

			&-item3 {
				width: 33.33%;
				padding: 20rpx 0;
				text-align: center;
			}

			&-item2 {
				width: 50%;
				padding: 20rpx 0;
				text-align: center;
			}

			&-item1 {
				width: 100%;
				text-align: center;
				// border-bottom: 2rpx solid #34A2E8;
				// color: #34A2E8;
				font-weight: bold;
				padding: 20rpx 0;
			}
		}

		.order-top {
			padding: 0rpx 24rpx 24rpx;

			&-head {
				>view {
					text-align: center;
					font-size: 24rpx;
					width: 50%;
					display: flex;
					align-items: flex-end;

					.tit-box {
						position: relative;
						height: 72rpx;
						line-height: 72rpx;
						border-top-left-radius: 12rpx;
						border-top-right-radius: 12rpx;
						background-color: #ECECEC;
						width: 100%;
					}

					&:first-child.active {
						.tit-box:after {
							content: ' ';
							position: absolute;
							z-index: 1;
							right: -24rpx;
							bottom: 0;
							border-top: 24rpx solid transparent;
							border-right: 24rpx solid transparent;
							border-bottom: 72rpx solid #FFFFFF;
						}
					}

					&:last-child.active {
						.tit-box:after {
							content: ' ';
							position: absolute;
							z-index: 1;
							left: -24rpx;
							bottom: 0;
							border-top: 24rpx solid transparent;
							border-left: 24rpx solid transparent;
							border-bottom: 72rpx solid #FFFFFF;
						}
					}
				}

				.active {
					font-weight: bold;
					color: #E43838;
					font-size: 30rpx;

					.tit-box {
						height: 80rpx;
						line-height: 80rpx;
						background-color: #FFFFFF;
					}
				}
			}

			&-content {
				background-color: #FFFFFF;

				.address-bottom {
					width: 100%;
					height: 8rpx;
				}

				.cu-self {
					padding: 0 30rpx;

					.cu-self-address {
						font-weight: bold;
						margin-bottom: 20rpx;
						font-size: 36rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}

					.cu-self-all {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						align-items: center;
					}

					.cu-self-all_edit {
						display: flex;
					}

					.cu-self-time-date {
						margin-right: 15rpx;
						color: #e54d42;
						font-weight: bold;

					}

					.cu-self-all_text {
						width: 170rpx
					}

					.cu-self-all_num {
						flex: 1;
						margin-right: 15rpx;
						font-weight: bold;

					}

				}


			}
		}


		.order-goods {
			background: #FFFFFF;
			margin: 0 24rpx 24rpx;
			border-radius: 12rpx;
			padding: 30rpx;

			&-shop {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 32rpx;
			}

			&-item {
				// padding: 12rpx;
				position: relative;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				-webkit-box-align: center;
				-webkit-align-items: center;
				align-items: center;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;

				&-left {
					margin-right: 24rpx;
					display: flex;

					image {
						width: 110rpx;
						height: 110rpx;
						background: #fff;
						border-radius: 8rpx;
						border: 2rpx solid #F5F5F5;
					}
				}

				&-center {
					display: flex;
					flex-direction: column;
					flex: 1;
					// width: 316rpx;

					text {
						&:first-child {
							font-weight: 500;
							font-size: 30rpx;
							color: #161616;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}

						&:not(:first-child) {
							color: #666666;
							font-size: 24rpx;
							line-height: 1.2;
							margin-top: 8rpx;
						}

						&:last-child {
							margin-top: 12rpx;
						}
					}
				}

				&-right {
					font-size: 32rpx;
					font-weight: 500;
					color: #161616;
					min-width: 125rpx;
					text-align: end;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		.order-money {
			background: #FFFFFF;
			margin: 0 24rpx 24rpx;
			border-radius: 12rpx;
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

		.order-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 900;
			height: 100rpx;
			background: #FFFFFF;
			border-top: 1rpx solid #F5F5F5;
			display: flex;
			align-items: center;
			padding: 0 24rpx;

			button {
				background: linear-gradient(90deg, #E83E3E 0%, #CD1D1D 100%);
				border-radius: 50rpx;
				font-size: 30rpx;
				color: #FFFFFF;
			}
		}

		.text-overflow {
			display: -webkit-box !important;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			-webkit-box-orient: vertical !important;
			-webkit-line-clamp: 1;
		}

		.text-overflow4 {
			display: -webkit-box !important;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			-webkit-box-orient: vertical !important;
			-webkit-line-clamp: 4;
		}
	}

	//这里控制长度即可
	.text {
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}


	/*遮罩*/
	.popup {
		width: 100vw;
		height: 100%;
		background-color: rgba($color: #000000, $alpha: 0.5);
		z-index: 999;
		position: fixed;
		top: 0;

		.popup-select {
			background-color: #ffffff;
			min-height: 500rpx;
			width: 100%;
			position: fixed;
			bottom: 0;
			animation: popup 0.6s;


			.popup-select-paytype {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 15rpx;
				font-size: 34rpx;
				font-weight: 600;
				background-color: white;
			}

			.popup-select-icon {
				position: absolute;
				top: 24rpx;
				right: 50rpx;
			}
		}

		@keyframes popup {
			from {
				bottom: -100%;
			}

			to {
				bottom: 0;
			}
		}
	}
</style>
