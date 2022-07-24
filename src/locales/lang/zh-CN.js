module.exports = {
	pub: {
		loading: '加载中...',
		uploading: '上传中...',
		emptyText: '暂无数据'
	},
	js: {
		http: {
			sysErr: '系统处理失败',
			networkErr: '连接超时，请检查您的网络。',
			loginSuccessful: '登录成功！',
			loginTimeout: '登录已超时，开始重新登录'
		}
	},
	components: {
		zjNumKeyboard: {
			pay: {
				column: true, // 文字竖排
				text: '立即支付'
			}
		},
		zjPrompt: {
			maxlength: '最多${0}个字'
		}
	},
	pages: {
		shop: {
			shopCheck: {
				title: '买单',
				check: '买单',
				total: '消费金额',
				suggestion: '推荐',
				confirm: '请与服务员确认',
				balance: '会员余额',
				memberPay: '会员余额抵扣',
				unknownResult: '支付结果未知，请联系商家',
				paySuccess: '付款成功',
				maxMoney: '金额不能超过 ${0} 元',
				org: '机构',
				pay: '支付',
				confirmPay: '确认支付',
				calculating: '正在计算优惠信息',
				querying: '交易查询中',
				addRemark: '添加备注',
				editRemark: '修改备注',
				payeeVisible: '收款人可见'
			},
			shopCheckSuccess: {
				title: '买单',
				paySuccess: '支付成功！',
				balance: '账户余额：',
				continu: '继续买单',
				orders: '查看订单',
				confirmOrder: '确认订单',
				orderErr: '订单状态异常',
				paySuccessMsg: '您已成功支付${0}元',
			}
		},
		user: {
			userDealRecord: {
				title: '交易记录',
				emptyRecord: '暂无交易记录'
			},
			userDealRecordDetail: {
				title: '交易详情',
				orderAmount: '订单金额',
				orderDiscount: '订单优惠',
				orderCoupon: '优惠券',
				orderType: '订单类型',
				payment: '付款方式',
				morePayment: '组合支付',
				orderGoods: '商品',
				createTime: '创建时间',
				billNo: '订单号',
				orderNo: '商户订单号',
				platTradeNo: '支付渠道单号',
				total: '等',
				item: '件商品',
				remark: '备注'
			}
		}
	}
}