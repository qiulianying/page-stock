module.exports = {
	pub: {
		loading: 'Loading...',
		uploading: 'Uploading...',
		emptyText: 'No Data'
	},
	js: {
		http: {
			sysErr: 'System Error',
			networkErr: 'Network connection failed',
			loginSuccessful: 'Login Successful',
			loginTimeout: 'Login timeout, ReLogin...'
		}
	},
	components: {
		zjNumKeyboard: {
			pay: {
				column: false,
				text: 'Pay'
			}
		},
		zjPrompt: {
			maxlength: 'maximum ${0} words '
		}
	},
	pages: {
		shop: {
			shopCheck: {
				title: 'Pay',
				check: 'Pay',
				total: 'TOTAL',
				suggestion: 'Suggestion',
				confirm: 'ENTER AMOUNT',
				balance: 'Balance',
				memberPay: 'Member',
				unknownResult: 'Unknown result,please contact with merchant',
				paySuccess: 'Payment successful',
				maxMoney: 'Up to ${0} CNY for payment amount',
				org: 'Organization',
				pay: 'Pay',
				confirmPay: 'Pay',
				calculating: 'Calculating amount',
				querying: 'Query order result',
				addRemark: 'Add remarks',
				editRemark: 'Edit remarks',
				payeeVisible: 'Visible to payee only'
			},
			shopCheckSuccess: {
				title: 'Pay',
				paySuccess: 'Payment successful',
				balance: 'Balance: ',
				continu: 'Continus',
				orders: 'Orders',
				confirmOrder: 'Confirm Order',
				orderErr: 'Order error',
				paySuccessMsg: 'Success payment ${0} CNY',
			}
		},
		user: {
			userDealRecord: {
				title: 'Orders',
				emptyRecord: 'No Data'
			},
			userDealRecordDetail: {
				title: 'Payment Details',
				orderAmount: 'Order Amount',
				orderDiscount: 'Order Discount',
				orderCoupon: 'Coupon',
				orderType: 'Order Type',
				payment: 'Payment',
				morePayment: 'Mixed Payment',
				orderGoods: 'Goods',
				createTime: 'Create Time',
				billNo: 'Order Number',
				orderNo: 'Merchant Order Number',
				platTradeNo: 'Plat Order Number',
				total: ' total',
				item: ' items',
				remark: 'Remarks'
			}
		}
	}
}