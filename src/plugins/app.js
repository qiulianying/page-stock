import consts from '../common/const'
import shopMall from '../common/shopMall'

const $app = () => {
	const fn = {}
	//根据当前的支付模式以及开启方式确定当前subPayType支付类型 这里需要加key
	fn.returnSubPayType = () => {
		// #ifdef MP-WEIXIN
		//微信情况下，subPayType只能是微信小程序
		return consts.SPT_TYPE.SPT_MINIPRO
		// #endif

		// #ifdef H5
		//h5公众号的情况下，需要进行判断
		let mySubPayType
		if (uni.getStorageSync('h5OpenForm') === 'WECHAT') {
			mySubPayType = consts.SPT_TYPE.SPT_NTPAYSPT_JSAPI
			//如果是银联支付通道的数字餐厅，就使用SPT_NTPAY这个特殊情况
			if (uni.getStorageSync('regionName').indexOf("数字餐厅") !== -1) {
				mySubPayType = consts.SPT_TYPE.SPT_NTPAY
			}
		} else if (uni.getStorageSync('h5OpenForm') === 'ALIPAY') {
			mySubPayType = consts.SPT_TYPE.SPT_NTPAYSPT_JSAPI
			if (uni.getStorageSync('regionName').indexOf("数字餐厅") !== -1) {
				mySubPayType = consts.SPT_TYPE.SPT_NTPAY
			}
		} else if (uni.getStorageSync('h5OpenForm') === 'UNIONPAY') {
			mySubPayType = consts.SPT_TYPE.SPT_NTPAYSPT_JSAPI
			if (uni.getStorageSync('regionName').indexOf("数字餐厅") !== -1) {
				mySubPayType = consts.SPT_TYPE.SPT_NTPAY
			}
		} else {
			mySubPayType = consts.SPT_TYPE.SPT_NTPAYSPT_JSAPI
			if (uni.getStorageSync('regionName').indexOf("数字餐厅") !== -1) {
				mySubPayType = consts.SPT_TYPE.SPT_NTPAY
			}
		}
		return mySubPayType
		// #endif
	}

	fn.getPlatform = () => {
		let type = -1
		// #ifdef MP-WEIXIN
		type = 3
		// #endif
		return type
	}

	//腾讯地图打开定位地点
	fn.openLocation = ({ latitude, longitude, scale = 18, name, address }) => {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		uni.openLocation({
			latitude,
			longitude,
			scale,
			name,
			address,
			complete: () => {
				setTimeout(() => {
					uni.hideLoading()
				}, 500)
			}
		})
	}

	//腾讯地图获取到当前定位
	fn.getLocation = ({ type = 'gcj02', success, fail, needPageType }) => {
		let hasLocation = false
		let mcLocation = {}
		try {
			mcLocation = uni.getStorageSync('mcLocation') || {}
		} catch(e) {
			console.error(e)
		}
		let time = mcLocation.time
		if (time != null && new Date().getTime() - time <= 600000) {
			hasLocation = true
			if (success) {
				success(mcLocation.res)
			}
		}
		if (!hasLocation) {
			uni.showLoading({
				title: '定位中...',
				mask: true
			})
		}
		if (needPageType === 0) {
			uni.getLocation({
				type: type,
				success: res => {
					console.log('当前位置：' + res.longitude + ',' + res.latitude)
					try {
						uni.setStorageSync('mcLocation', {time: new Date().getTime(), res: res})
					} catch (e) {
						console.error(e)
					}
					if (!hasLocation) {
						uni.hideLoading()
						if (success) {
							success(res)
						}
					}
				},
				fail: err => {
					if (!hasLocation) {
						uni.hideLoading()
						uni.showToast({
							title: '无法获取位置信息',
							icon: 'none'
						})
						if (fail) {
							fail(err)
						}
					}
				}
			})
		} else {
			fail('false')
		}
	}

	//兼容多端打开地图获取定位点并返回详细信息(包括省市区名称)
	// fn.getMapInfo = ({success}) => {
	// 	uni.chooseLocation({
	// 		success: data => {
	// 			if (!data.name || data.name === '') return
	// 			let addressData = data			//最终返回数据
	// 			//额外获取省市区地址
	// 			let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
	// 			let REGION_PROVINCE = [];
	// 			let addressBean = {
	// 				REGION_PROVINCE:null,		//省
	// 				REGION_CITY:null,			//市
	// 				REGION_COUNTRY:null,		//区
	// 				ADDRESS:null
	// 			};
	// 			function regexAddressBean(address, addressBean){
	// 				regex = /^(.*?[市]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
	// 				let addxress = regex.exec(address);
	// 				addressBean.REGION_CITY = addxress[1];
	// 				addressBean.REGION_COUNTRY = addxress[2];
	// 				addressBean.ADDRESS=addxress[3]+"("+data.name+")";
	// 			}
	// 			if(!(REGION_PROVINCE = regex.exec(data.address))){
	// 				regex = /^(.*?(省|自治区))(.*?)$/;
	// 				REGION_PROVINCE = regex.exec(data.address);
	// 				addressBean.REGION_PROVINCE= REGION_PROVINCE[1];
	// 				regexAddressBean(REGION_PROVINCE[3],addressBean);
	// 			} else {
	// 				addressBean.REGION_PROVINCE= REGION_PROVINCE[1];
	// 				regexAddressBean(data.address, addressBean);
	// 			}
	// 			addressData.provinceName = addressBean.REGION_PROVINCE
	// 			addressData.cityName = addressBean.REGION_CITY
	// 			addressData.districtName = addressBean.REGION_COUNTRY
	// 			success(addressData)
	// 		}
	// 	})
	// }

	fn.getMapInfo = ({success}) => {
		uni.chooseLocation({
			success: data => {
				if (!data.name || data.name === '') return
				let addressData = data			//最终返回数据
				//额外获取省市区地址
				let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
				let REGION_PROVINCE = [];
				let addressBean = {
					REGION_PROVINCE:null,		//省
					REGION_CITY:null,			//市
					REGION_COUNTRY:null,		//区
					ADDRESS:null
				};
				function regexAddressBean(address, addressBean){
					regex = /^(.*?[市]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
					let addxress = regex.exec(address);
					addressBean.REGION_CITY = addxress[1];
					addressBean.REGION_COUNTRY = addxress[2];
					addressBean.ADDRESS=addxress[3]+"("+data.name+")";
				}
				if(!(REGION_PROVINCE = regex.exec(data.address))){
					regex = /^(.*?(省|自治区))(.*?)$/;
					REGION_PROVINCE = regex.exec(data.address);
					addressBean.REGION_PROVINCE= REGION_PROVINCE[1];
					regexAddressBean(REGION_PROVINCE[3],addressBean);
				} else {
					addressBean.REGION_PROVINCE= REGION_PROVINCE[1];
					regexAddressBean(data.address, addressBean);
				}
				addressData.provinceName = addressBean.REGION_PROVINCE
				addressData.cityName = addressBean.REGION_CITY
				addressData.districtName = addressBean.REGION_COUNTRY
				success(addressData)
			}
		})
	}

	/*
	* 订阅不同订阅消息
	* 微信小程序：会进行相关消息定于
	* h5：无消息订阅，会返回继续执行后续方法
	* */
	fn.subscribe = (type, { returnBack }) => {
		// #ifdef MP-WEIXIN
		let tmplIds = []
		switch (type) {
			case 'consumption':
				//消费成功以及退款通知
				tmplIds = ['oEfQGFxyYLYlC3HQ6SAwE6tojQmj3NiXBq30_EUX6Kw', 'JJIRrwacKX6tfFGfxv9OU1bwPwW3qwe-M_aR3WxRUYw']
				break;
			case "recharge":
				//充值成功通知
				tmplIds = ['XM7LrcRmUWi0PVT1kvW2V8I8rHOnKclXbFh3Pmvp_gw']
				break;
			default:
				//消费成功以及退款通知
				tmplIds = ['oEfQGFxyYLYlC3HQ6SAwE6tojQmj3NiXBq30_EUX6Kw', 'JJIRrwacKX6tfFGfxv9OU1bwPwW3qwe-M_aR3WxRUYw']
				break;
		}
		wx.requestSubscribeMessage({
			tmplIds: tmplIds,
			success (res) {
				//允许
				returnBack(res)
			},
			fail (res) {
				//拒绝订阅或者失败
				returnBack(res)
			}
		})
		// #endif

		// #ifdef H5
		returnBack('success')
		// #endif
	}

	/*
	* 调用支付模块
	* 微信小程序：调用微信小程序支付
	* h5：调用对应的h5支付，例如支付宝是支付宝，小程序是小程序，云闪付是云闪付
	* */
	fn.requestPayment = (data = {}, { success, fail }, merchantNo) => {
		// #ifdef H5
		/*
		* h5支付：目前需要通过跳转重定向的支付通道
		* */

		// 存在data.qrDataUrl的一律使用外部
		if (data.qrDataUrl) {
			//执行跳转其他页面操作的，一律清空缓存
			if (merchantNo) {
				shopMall.clearSelectedGoods(merchantNo)
			}
			return window.location.replace(data.qrDataUrl)
		}

		// if (data.channelType || (data.paymentList && data.paymentList.length > 0 && data.paymentList[0].channelType)) {
		// 	let myChannelType =  data.channelType || data.paymentList[0].channelType
		// 	if (data.qrDataUrl && consts.Channel_Type[myChannelType]) {
		// 		//执行跳转其他页面操作的，一律清空缓存
		// 		if (merchantNo) {
		// 			shopMall.clearSelectedGoods(merchantNo)
		// 		}
		// 		return window.location.replace(data.qrDataUrl)
		// 	}
		// }

		// 云闪付小程序的情况下，如果不是云闪付小程序而是云闪付h5，就需要使用其他跳转方式
		if (data.qrDataUrl && (uni.getStorageSync('h5OpenForm') === 'UNIONPAY' || uni.getStorageSync('h5OpenForm') === 'UNIONPAYAPPLET')) {
			// 云闪付小程序情况下的支付方式
			if (uni.getStorageSync('h5OpenForm') === 'UNIONPAYAPPLET') {
				//执行跳转其他页面操作的，一律清空缓存，保证订单能够执行!
				if (merchantNo) {
					shopMall.clearSelectedGoods(merchantNo)
				}
				upsdk.pluginReady(function(){
					// 云闪付小程序下使用云闪付二维码组件，自动扫码打开返回的链接
					upsdk.qrPay({
						scanQrCodeContent: data.qrDataUrl,
						success: function (data) {
							// 成功进入云闪付二维码组件打开的支付页面，这种情况下需要返回
						},
						fail: function (error) {
							alert(JSON.stringify(error))
						}
					})
				})
				return
			} else {
				// 这里可能要注意，如果跳转支付，这里云闪付h5情况下需要使用另外一种方式
				return window.location.replace(data.qrDataUrl)
			}
		}

		if (uni.getStorageSync('h5OpenForm') === consts.OPEN_TYPE.WECHAT) {
			// 微信公众号支付
			function onBridgeReady () {
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
					appId: data.appid || data.appId,
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType || 'MD5',
					paySign: data.paySign
				}, res => {
					if (res.err_msg === 'get_brand_wcpay_request:ok') {
						if (success) {
							success(res)
						}
					} else {
						uni.showToast({
							title: '支付已取消或失败',
							icon: 'none'
						})
						if (fail) {
							fail('支付已取消或失败')
						}
					}
				})
			}
			if (typeof WeixinJSBridge == "undefined") {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
				}
			} else {
				onBridgeReady()
			}
			return
		} else if (uni.getStorageSync('h5OpenForm') === consts.OPEN_TYPE.ALIPAY) {
			if (window.AlipayJSBridge) { // 支付宝 H5 支付
				return window.AlipayJSBridge.call('tradePay', {
					tradeNO: data.tradeNO
				}, res => {
					const { resultCode } = res
					if (+resultCode === 9000) {
						if (success) {
							success(res)
						}
					} else {
						uni.showToast({
							title: '支付已取消或失败',
							icon: 'none'
						})
						if (fail) {
							fail('支付已取消或失败')
						}
					}
				})
			}
		} else if (uni.getStorageSync('h5OpenForm') === consts.OPEN_TYPE.UNIONPAY) {
			//云闪付h5支付

		}
		// #endif

		// #ifndef H5
		return uni.requestPayment({
			timeStamp: data.timeStamp,
			nonceStr: data.nonceStr,
			package: data.package,
			signType: data.signType || 'MD5',
			paySign: data.paySign,
			success: res => {
				if (success) {
					success(res)
				}
				console.log('success:' + JSON.stringify(res));
			},
			fail: err => {
				uni.showToast({
					title: '支付已取消或失败',
					icon: 'none'
				})
				if (fail) {
					fail(err)
				}
				console.log('fail:' + JSON.stringify(err));
			}
		})
		// #endif

		uni.showToast({
			title: '不支持或无可用支付方式',
			icon: 'none'
		})
		fail('不支持或无可用支付方式')
	}
	return fn
}
export default $app()
