/*设置公共枚举便于全局参数判断以及切换*/
export default {
	/**
	 * h5情况下客户端打开方式
	 * NONE：普通h5浏览器打开
	 * WECHAT：微信浏览器
	 * ALIPAY: 支付宝浏览器,
	 * UNIONPAY: 云闪付浏览器
	 */
	OPEN_TYPE: {
		NONE: 'NONE',
		WECHAT: 'WECHAT',
		ALIPAY: 'ALIPAY',
		UNIONPAY: 'UNIONPAY',
		UNIONPAYAPPLET: 'UNIONPAYAPPLET'
	},
	/**
	 * PT_WEIXIN   = 1 //微信
	 * PT_ALIPAY   = 2 //支付宝
	 * PT_UNIONPAY = 6 //云闪付
	 * PT_MONEY    = 7 //现金支付
	 * PT_CARD     = 8 //银行卡
	 * PT_UNIONMINI = 15 //银联云闪付小程序
	 * PT_WALLET = 16 //钱包支付
	 * PT_MEDICAL = 16 //医保卡
	 * 18 // 医保支付
	 */
	PAY_TYPE: {
		WECHAT: 1,
		ALIPAY: 2,
		UNIONPAY: 6,
		MONEY: 7,
		CARD: 16,
		// CARD: 8,
		UNIONPAYAPPLET: 15,
		WALLET: 16,
		YBZF: 18
	}
}
