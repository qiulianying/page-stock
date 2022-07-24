export default {
	// 根据不同环境渠道号确认属于渠道类型，如果后面有需要就不断添加，这里默认写死需要屏蔽的
	REGION_NAME: {
		"DL1324639692901326848": "德州农商行",
		"DL1319562230953680896": "德州农商行",
		"DL1374191580302548992": "德州农商行",
		"DL1451366668709404672": "德州农商行",
		"DL1451452004064043008": "齐河农商行",
		"DL1451451800833236992": "陵城农商行",
		"DL1451451657320931328": "乐陵农商行",
		"DL1451451737226616832": "禹城农商行",
		"DL1451451855879282688": "平原农商行",
		"DL1451451923864756224": "夏津农商行",
		"DL1451451970664800256": "武城农商行",
		"DL1451452052034297856": "临邑农商行",
		"DL1451452088797372416": "宁津农商行",
		"DL1451452131763822592": "庆云农商行",
	},
	// 根据接口获取到的不同的支付通道进行不同操作：目前需要通过跳转重定向的支付通道
	Channel_Type: {
		29: '德州农商行',
		2: '银联系',
		38: '银商开放平台'
	},
	// 接口域名汇总
	API_TYPE: {
		PLATFORM_GOUC: 'platform-gouc',
		INFO_USER: 'info-user',
		INFO_MEMBER: 'info-member',
		INFO_PRODUCT: 'info-product',
		MARKETING_CACL: 'marketing-cacl',
		BUSI_INT: 'busi-int',
		INFO_PAY: 'info-pay',
		PAYMENT_SPMATE: 'payment-spmate',
		SMSAPI: 'smsapi',
		RIGHTS_MARKETING:'rights-marketing',
		BUSI_RIGHT:'busi-right'
	},
	// 支付枚举
	ORDER_STATUS: {
		0: '待支付',
		1: '已支付',
		2: '已取消',
		3: '支付成功',
		4: '退货',
		// 5: '接单',
		5: '部分退货',
		6: '拒单',
		7: '配送中',
		8: '配送完成'
	},
	BANK: {
		'102': '中国工商银行',
		'103': '中国农业银行',
		'104': '中国银行',
		'105': '中国建设银行',
		'301': '交通银行',
		'403': '中国邮政储蓄银行'
	},
	BANKNAME: {
		'102': '工商银行',
		'103': '农业银行',
		'104': '中国银行',
		'105': '建设银行',
		'301': '交通银行',
		'403': '邮政储蓄银行'
	},
	// 1表示收银台，2表示点餐，3表示外卖
	TRANSATION_TYPE: {
		CASH: 1,
		ORDER: 2,
		TAKE_OUT: 3,
		RECHARGE: 4,
	},
	/**
	 * 外卖下单 1 配送 2 自提 3 定点配送
	 **/
	PICK_TYPE: {
		TAKE_OUT: 1,
		TAKE_SELF: 2,
		TAKE_FIXED_POINT: 3,
	},
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
	},
	/**
	 * SPT_NTPAYSPT_JSAPI       = "JSAPI"       //微信公众号支付
	 * SPT_MINIPRO     = "MINIPRO"     //微信小程序
	 * SPT_APPPAY      = "APP"         //app支付
	 * SPT_BARPAY      = "BARPAY"      //被扫支付
	 * SPT_NTPAY       = "NATIVE"      //主扫支付
	 * SPT_FACE        = "FACEPAY"     //刷脸支付
	 * SPT_ALIPAY_LITE = "ALIPAY_LITE" //支付宝小程序
	 */
	SPT_TYPE: {
		SPT_NTPAYSPT_JSAPI: "JSAPI",
		SPT_MINIPRO: "MINIPRO",
		SPT_BARPAY: 'BARPAY',
		SPT_NTPAY: 'NATIVE',
		SPT_ALIPAY_LITE: 'ALIPAY_LITE'
	},
	environment: {
		devTest: '开发环境',
		develop: '测试环境',
		master: '生产环境'
	},
	// 判断微信小程序版本
	AccountInfoSync: {
		develop: '开发版',
		trial: '体验版',
		release: '正式版'
	},
	// 通过subjectType参数，这里分为不同的情况
	subjectType: {
		0: '机构',
		1: '门店'
	}
}
