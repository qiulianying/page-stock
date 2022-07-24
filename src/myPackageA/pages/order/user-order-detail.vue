<template>
	<view class="order">
		<cu-custom bgColor="bg-white" is-back :back-reload="backReload">
			<block slot="backText" class="text-black">订单详情</block>
		</cu-custom>
		<view class="order-detail">
			<view class="order-detail-bg"
				:style="{backgroundImage: `linear-gradient(${themeColor}, ${themeColor}, #f5f5f5)`}"></view>

			<!-- 头部-商品信息 -->
			<view class="order-detail-top" style="overflow:hidden;">
				<view class="order-detail-top-title"
					v-if="status === '0' && orderData.positive === 1 && isSupportRepay === 'true'">
					<u-icon name="clock" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>支付未完成，订单已取消
				</view>
				<view class="order-detail-top-title"
					v-else-if="status === '0' && orderData.positive === 1 && isSupportRepay === 'false'">
					<u-icon name="clock" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>支付未完成，订单已取消

				</view>
				<!-- 商城商品且状态为已支付，则显示待收货 -->
				<view class="order-detail-top-title"
					v-else-if="status === '1' && transactionType === '3' && orderData.positive === 1">
					<u-icon name="clock" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>等待收货 <view
						style="font-size: 13px; margin-left: 76rpx">正在配送中，请耐心等待...</view>
				</view>
				<!-- 点单且状态为已支付 -->
				<view class="order-detail-top-title" v-else-if="status === '1' && transactionType === '2'">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 买单且状态为已支付 -->
				<view class="order-detail-top-title" v-else-if="status === '1' && transactionType === '1'">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>支付成功
				</view>
				<!-- 权益商品且状态为已支付 -->
				<view class="order-detail-top-title" v-else-if="status === '1' && transactionType === '2000'">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 商城且状态为取消 -->
				<view class="order-detail-top-title"
					v-else-if="status === '2' && orderData.positive === 1 && !orderData.busiStatus">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易已取消
				</view>
				<!-- 点单且状态为完成 -->
				<view class="order-detail-top-title"
					v-else-if="status === '3' && transactionType === '2' && orderData.positive === 1">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 买单且状态为完成 -->
				<view class="order-detail-top-title"
					v-else-if="status === '3' && transactionType === '1' && orderData.positive === 1">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>支付成功
				</view>
				<!-- 商城商品且状态为完成 -->
				<view class="order-detail-top-title"
					v-else-if="status === '3' && transactionType === '3' && orderData.positive === 1">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 权益商品且状态为已完成 -->
				<view class="order-detail-top-title" v-else-if="status === '3' && transactionType === '2000'">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 退款 -->
				<view class="order-detail-top-title" v-else-if="status === '4' && orderData.positive === 1">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易完成
					<view style="font-size: 13px; margin-left: 76rpx">已退款</view>
				</view>
				<view class="order-detail-top-title" v-else-if="status === '5' && orderData.positive === 1">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易完成
					<view style="font-size: 13px; margin-left: 76rpx">部分退款成功</view>
				</view>
				<view class="order-detail-top-title" v-else-if="status === '1' && orderData.positive === 0">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>退款成功
				</view>
				<view class="order-detail-top-title" v-else-if="status === '3' && orderData.positive === 0">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>退款成功
				</view>
				<!-- 退单 -->
				<view class="order-detail-top-title"
					v-else-if="status === '2' && orderData.positive === 1 && orderData.busiStatus === 4">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>已退单
				</view>
				<view class="order-detail-top-title"
					v-else-if="status === '2' && orderData.positive === 1 && orderData.busiStatus === 7">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>已退单
				</view>
				<!-- 未知情况 -->
				<view class="order-detail-top-title" v-else-if="status === '0' && orderData.positive === 0">
					<u-icon name="minus-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>退款成功
				</view>
				<!-- 收银台 -->
				<view class="order-detail-top-title" v-else-if="status === '3' && transactionType === '16'">
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>交易成功
				</view>
				<!-- 其它情况 -->
				<view class="order-detail-top-title" v-else>
					<u-icon name="checkmark-circle" size="52" color="#fff" style="margin-right: 24rpx"></u-icon>商品详情
				</view>

				<view class="order-detail-top-product">
					<!-- 商品详情 -->
					<!-- 普通商品 -->
					<view>
						<view v-for="(good, goodIndex) in goodData" :key="goodIndex"
							class="order-detail-top-product-detail">
							<view class="order-detail-top-product-detail_img">
								<image
									:src="good.productUrlList[0] ? spMatefileBaseURL + good.productUrlList[0] + fixStr :' ../../../static/logo.png'">
								</image>
							</view>
							<view class="order-detail-top-product-detail_desc">
								<view class="name">{{good.name}}</view>
								<!-- <view class="desc">支持随时退 过期退</view> -->
								<view style="display: flex; justify-content: space-between; margin-top:20rpx">
									<view class="value">￥{{good.goodsPrice || ''}}</view>
									<view class="num">
										x1
									</view>
								</view>
							</view>

						</view>
					</view>
					<!-- 权益商品和预约活动 -->
					<view v-if="transactionType === '2000'" class="order-detail-top-product-detail">
						<view class="order-detail-top-product-detail_img">
							<!-- 预约商品 -->
							<template v-if="orderData.extra.bizType == 'appointment'">
								<image
									:src="appointData.activityLogo ? spMatefileBaseURL + appointData.activityLogo + fixStr :' ../../../static/logo.png'">
								</image>
							</template>
							<!-- 目前默认其他的是权益商品 -->
							<template v-else>
								<image
									:src="rightGoodData.pic ? spMatefileBaseURL + rightGoodData.pic + fixStr :' ../../../static/logo.png'">
								</image>
							</template>
						</view>
						<view class="order-detail-top-product-detail_desc">
							<template v-if="orderData.extra.bizType == 'appointment'">
								<view class="name">{{appointData.activityName}}</view>
							</template>
							<template v-else>
								<view class="name">{{rightGoodData.name}}</view>
							</template>
							<view class="desc">
								<span v-if="anyTimeRefund" style="margin-right:10rpx;">
									<u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="10"
										label="支持随时退" label-size="24">
									</u-icon>
								</span>
								<span v-if="overdueRefund" style="margin-right:10rpx;">
									<u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="10"
										label="支持过期退" label-size="24">
									</u-icon>
								</span>
								<span v-if="autoRefund">
									<u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="10"
										label="支持自动退" label-size="24">
									</u-icon>
								</span>
								<span v-if="!autoRefund && !overdueRefund && !anyTimeRefund">
									<u-icon name="close-circle" color="#F05353" size="28" margin-left="10" label="不支持退款"
										label-size="24">
									</u-icon>
								</span>
							</view>
						</view>
						<view class="order-detail-top-product-detail_value">
							<template v-if="orderData.extra.bizType == 'appointment'">
								<view class="value">
									￥{{(appointData.amount || appointData.amount === 0) ? appointData.amount : ''}}
								</view>
							</template>
							<template v-else>
								<view class="value">
									￥{{(rightGoodData.realPrice || rightGoodData.realPrice === 0) ? rightGoodData.realPrice.toFixed(2) : ''}}
								</view>
							</template>
							<view class="num">
								x{{(orderData.items && orderData.items.length > 0 && orderData.items[0].number) ? orderData.items[0].number : ''}}
							</view>
						</view>
						<!-- </view> -->
					</view>
					<!-- 直接支付 -->
					<view class="order-detail-top-product-detail" v-if="transactionType === '1'">
						<view class="order-detail-top-product-detail_img">
							<image
								:src="orderData.saler.merchantLogo ? spMatefileBaseURL + orderData.saler.merchantLogo + fixStr :' ../../../static/logo.png'">
							</image>
						</view>
						<view class="order-detail-top-product-detail_desc">
							<view class="name">{{orderData.saler.merchantName}} </view>
							<view class="desc_self">
								<view style="font-weight: 300;">自助买单</view>
								<view>实付： <text style="color: #E02020">￥ {{orderData.actualAmount || ''}}</text></view>
							</view>
						</view>

					</view>
					<!-- 按钮 -->
					<view class="order-detail-top-product-btn"
						v-if="orderData.status === 0 && orderData.positive === 1 && isSupportRepay === 'true'">
						<u-button shape="circle" :custom-style="customStyleCancel" style="margin-right: 20rpx"
							@click="cancelOrder">取消订单</u-button>
						<!--暂时屏蔽去支付-->
						<u-button shape="circle" :custom-style="customStylePay" @click="repayOrder" v-if="false">去支付
						</u-button>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="order-coupon"
				v-if="transactionType === '2000' && orderData.extra.bizType == 'appointment' && appointData.from">
				<view class="order-coupon-title">预约码</view>
				<view class="coupon-item-box">
					<view class="coupon-item">
						<view class="coupon-item-center">
							<view class="title text-cut" style="font-weight:bold">
								{{appointData.activityName || '  ' }}
							</view>
							<view class="term">
								<view v-if="orderData.items.length>0">{{appointTime(orderData.items)}}</view>
								<span v-else>永久有效</span>
							</view>
						</view>
						<view class="coupon-item-right invalid">
							<button v-if="appointData.status == 1" class="cu-btn"
								@tap="toAppointCardDetail(appointData.appointNo, appointData.billNo, appointData.id)">立即使用</button>
							<button v-if="appointData.status == 2" class="cu-btn btn-disabled">已使用</button>
							<button v-if="appointData.status == 3" class="cu-btn btn-disabled">已取消</button>
							<button v-if="appointData.status == 4" class="cu-btn btn-disabled">已过期</button>
						</view>
					</view>
					<view class="coupon-code">
						<view class="coupon-code-left">
							<view class="coupon-code-num" :class="appointData.status == 1 ? '' : 'color-grey'">
								{{appointData.appointNo}}</view>
							<view v-if="appointData.status == 1" class="coupon-code-copy"
								@tap="copyCode(appointData.appointNo)">复制券码</view>
						</view>
					</view>
					<view class="gap-top"></view>
					<view class="gap-bottom"></view>
					<view class="gap-mid-line"></view>
					<image v-if="appointData.status == 2" class="image-status" mode="widthFix"
						src="../../../static/images/coupon_used.png"></image>
					<image v-if="appointData.status == 3" class="image-status" mode="widthFix"
						src="../../../static/images/coupon_cancel.png"></image>
					<image v-if="appointData.status == 4" class="image-status" mode="widthFix"
						src="../../../static/images/coupon_expired.png"></image>
				</view>
			</view>
			<!-- 订单中的卡券 -->
			<view class="order-coupon" v-if="transactionType === '2000' && couponList.length>0">
				<view class="order-coupon-title">订单中的卡券</view>
				<block v-for="(couponItem, couponIndex) in couponList" :key="couponIndex">
					<view v-if="couponIndex <= 1 || (couponIndex > 1 && showMore)" class="coupon-item-box">
						<view class="coupon-item">
							<view class="coupon-item-center">
								<view class="title text-cut" style="font-weight:bold">
									{{couponItem.rightsName || '  ' }}
								</view>
								<view class="term">
									<span v-if="couponItem.startTime">{{dateFormat(couponItem.startTime)}} -
										{{dateFormat(couponItem.expireTime)}}</span>
									<span v-else>永久有效</span>
								</view>
							</view>
							<view class="coupon-item-right invalid">
								<button v-if="couponItem.status == 1" class="cu-btn"
									@tap="toCardDetail(couponItem.rightNo, couponItem.rightId, couponItem.id)">立即使用</button>
								<button v-if="couponItem.status == 2" class="cu-btn btn-disabled">已使用</button>
								<button v-if="couponItem.status == 3" class="cu-btn btn-disabled">已过期</button>
								<button v-if="couponItem.status == 4" class="cu-btn btn-disabled">已退款</button>
							</view>
						</view>
						<view class="coupon-code">
							<view class="coupon-code-left">
								<view class="coupon-code-num" :class="couponItem.status == 1 ? '' : 'color-grey'">
									{{couponItem.rightNo}}</view>
								<view v-if="couponItem.status == 1" class="coupon-code-copy"
									@tap="copyCode(couponItem.rightNo)">复制券码</view>
							</view>
						</view>
						<view class="gap-top"></view>
						<view class="gap-bottom"></view>
						<view class="gap-mid-line"></view>
						<image v-if="couponItem.status == 2" class="image-status" mode="widthFix"
							src="../../../static/images/coupon_used.png"></image>
						<image v-if="couponItem.status == 3" class="image-status" mode="widthFix"
							src="../../../static/images/coupon_expired.png"></image>
						<image v-if="couponItem.status == 4" class="image-status" mode="widthFix"
							src="../../../static/images/coupon_refund.png"></image>
					</view>
				</block>
				<view class="see-more" @tap="clickMore" v-if="couponList.length>2">
					<template v-if="!showMore">
						<text>查看更多</text>
						<image class="image-right" mode="widthFix" src="../../../static/images/arrow_line_right.png">
						</image>
					</template>
					<template v-if="showMore">
						<text>收起更多</text>
						<image class="image-up" mode="heightFix" src="../../../static/images/arrow_line_up.png"></image>
					</template>
				</view>
			</view>
			<!-- #endif -->
			<!-- 使用店铺 --权益商品 -->
			<view class="order-detail-shop" v-if="transactionType === '2000'">
				<view class="order-detail-shop-top">
					<view class="order-detail-shop-top_title">适用店铺</view>
					<view class="order-detail-shop-top_btn">
						<view class="name"
							@click="goToShopdetail(rightGoodData.canUseMerchants ? rightGoodData.canUseMerchants.length : 0)">
							<span
								v-if="!rightGoodData.canUseMerchants || (rightGoodData.canUseMerchants && rightGoodData.canUseMerchants.length==0)">
								适用于全部店铺
							</span>
							<span v-else>
								{{rightGoodData.canUseMerchants ? rightGoodData.canUseMerchants.length : 0}}家店铺
							</span>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<!-- </template> -->
				</view>
				<view class="order-detail-shop-bottom"
					v-if="rightGoodData.canUseMerchants && rightGoodData.canUseMerchants.length !== 0">
					<view class="order-detail-shop-bottom_desc">
						<view class="shop">
							<view class="shop-name">{{rightGoodData.canUseMerchants[0].merchantName}}
								<u-icon name="arrow-right"></u-icon>
							</view>
							<view class="shop-btn">离我最近</view>
						</view>
						<view class="btn" @click="callPhone(rightGoodData.canUseMerchants[0].linkPhone)">
							<u-icon name="phone-fill" :color="themeColor"></u-icon>
						</view>
					</view>
					<template v-if="orderData.extra.bizType == 'appointment'">
						<view class="order-detail-shop-bottom_address">
							{{rightGoodData.canUseMerchants[0].address}} |
							{{rightGoodData.canUseMerchants[0].sort[0].toFixed(2)}}km
						</view>
					</template>
					<template v-else>
						<view class="order-detail-shop-bottom_address">
							{{rightGoodData.canUseMerchants[0].address}} |
							{{rightGoodData.canUseMerchants[0].disance.toFixed(2)}}km
						</view>
					</template>
				</view>
			</view>
			<!-- 温馨提示 --权益商品 -->
			<view class="order-detail-tip" v-if="transactionType === '2000'">
				<view class="order-detail-tip_title">温馨提示</view>
				<view class="order-detail-tip_date">有效期</view>
				<template v-if="orderData.extra.bizType == 'appointment'">
					<view class="order-detail-tip_data">
						<view v-if="orderData.items.length>0">{{appointTime(orderData.items)}}</view>
						<view v-else>永久有效</view>
					</view>
				</template>
				<template v-else>
					<view class="order-detail-tip_data">
						<view v-if="rightGoodData.availableType === 1">{{dateFormat(rightGoodData.availableBeginTime)}}
							至
							{{dateFormat(rightGoodData.availableEndTime)}}</view>
						<view v-if="rightGoodData.availableType === 2">
							{{dateAvailable(rightGoodData.availableRelative)}}
						</view>
						<view v-if="rightGoodData.availableType === 0">永久有效</view>
					</view>
				</template>
				<view class="order-detail-tip_use">使用须知</view>
				<view class="order-detail-tip_tips" v-if="rightGoodData.instructions"
					v-html="formatRichText(rightGoodData.instructions)"></view>
			</view>
			<!-- 配送信息  外卖商品才有 -->
			<view class="order-detail-info">
				<view class="order-detail-info-title">配送信息</view>
				<view class="order-detail-info-data">
					<view class="name">{{orderData.extra.pickType === 2 ? '自提时间' : '预计送达时间'}}</view>
					<view class="data">2022-03-29 14:07:03</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">配送地址</view>
					<view class="data">福州市鼓楼区人民政府</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">预留信息</view>
					<view class="data">王先生 13222222222</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="order-detail-info">
				<view class="order-detail-info-title">订单信息</view>
				<view class="order-detail-info-data">
					<view class="name">单号</view>
					<view class="data" @longtap="copy(orderData.billNo)">{{orderData.billNo || ''}}</view>
				</view>
				<view class="order-detail-info-data" v-if="orderData.originalNo">
					<view class="name">原单号</view>
					<view class="data" @longtap="copy(orderData.originalNo)">{{orderData.originalNo || ''}}</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">订单金额</view>
					<view class="data">
						{{(orderData.amount || orderData.amount === 0) ? orderData.amount.toFixed(2) : ''}}</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">支付金额</view>
					<view class="data">{{(parseFloat(orderData.actualAmount) - parseFloat(totalDiscount)).toFixed(2)}}
					</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">优惠金额</view>
					<view class="data">
						{{(parseFloat(orderData.amount) - parseFloat(orderData.actualAmount) + parseFloat(totalDiscount)).toFixed(2) || 0}}
					</view>
				</view>
				<view class="order-detail-info-data">
					<view class="name">支付方式</view>
					<view class="data" v-if="orderData.paymentList && orderData.paymentList.length > 1">
						组合支付
					</view>
					<view
						v-else-if="orderData.paymentList && orderData.paymentList.length === 1 && orderData.paymentList[0] && orderData.paymentList[0].payType === 16 && orderData.extra.isBankCard">
						{{orderData.extra.isBankCard === 1 ? (orderData.paymentList[0].subPayTypeName ? orderData.paymentList[0].subPayTypeName  : '银行卡支付' ) : '钱包支付'}}
					</view>
					<view class="data" v-else>
						{{ orderData.paymentList[0].payTypeName || orderData.paymentList[0].channelTypeName || ''}}
					</view>
				</view>
				<view class="order-detail-info-data" v-if="orderData.transactionType">
					<view class="name">订单类型</view>
					<view class="data" v-if="orderData.transactionType === 1">买单</view>
					<view class="data" v-else-if="orderData.transactionType === 2">点单</view>
					<view class="data" v-else-if="orderData.transactionType === 3">商城</view>
					<view class="data"
						v-else-if="orderData.transactionType === 2000 && orderData.extra.bizType != 'appointment'">权益
					</view>
					<view class="data"
						v-else-if="orderData.transactionType === 2000 && orderData.extra.bizType == 'appointment'">预约
					</view>
					<view class="data" v-else-if="orderData.transactionType === 4">充值</view>
					<view class="data" v-else-if="orderData.transactionType === 16">收银台</view>
					<view class="data" v-else>--</view>
				</view>
				<view class="order-detail-info-data" v-if="orderData.createTime">
					<view class="name">下单时间</view>
					<view class="data">{{dateFormat(orderData.createTime, true) || ''}}</view>
				</view>
				<view class="order-detail-info-data"
					v-if="(status === '2' && orderData.positive === 1 && (orderData.busiStatus === 4 || orderData.busiStatus === 7)) && orderData.refuseInfo && orderData.refuseInfo.refuseTime ">
					<view class="name">退单时间</view>
					<view class="data">{{dateFormat(orderData.refuseInfo.refuseTime, true) || ''}}</view>
				</view>
				<view class="order-detail-info-data"
					v-else-if="(status === '1' && transactionType === '3' && orderData.positive === 1) && orderData.paymentList && orderData.paymentList[0].finishTime ">
					<view class="name">支付时间</view>
					<view class="data">{{dateFormat(orderData.paymentList[0].finishTime, true) || ''}}</view>
				</view>
				<view class="order-detail-info-data" v-else-if="orderData.finishTime ">
					<view class="name">完成时间</view>
					<view class="data">{{dateFormat(orderData.finishTime, true) || ''}}</view>
				</view>
				<view class="order-detail-info-data"
					v-if="orderData.status === 0 && orderData.positive === 1 && isSupportRepay === 'false'">
					<view class="name">订单状态</view>
					<view class="data">已取消</view>
				</view>

			</view>
		</view>
		<!-- 支付弹窗 -->
		<u-popup v-model="payShow" mode="bottom" border-radius="14" close-icon-pos="top-left" height="50%"
			:closeable="true">
			<view class="popup">
				<view class="popup-title">选择付款方式</view>
				<view class="popup-data">
					<!--引入支付方式组件-->
					<payment @changeSelect="changeSelect" @doPay="doPay" :btnBlue="true"></payment>
				</view>
			</view>
		</u-popup>
		<!-- 支付密码错误弹窗 -->
		<u-modal v-model="passwordErrorShow" :content="passwordErrorContent" @confirm="confirmPassword"
			@cancel="cancelPassword" :show-cancel-button="true" cancel-text="重试" confirm-text="忘记密码"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name: 'user-order-detail',
		props: {},
		data() {
			return {
				themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				nowTime: new Date().getTime(),
				couponList: [],
				backReload: false,
				customStyleCancel: {
					// marginTop: '20px',
					color: '#A9A9A9',
					width: '128rpx',
					height: '56rpx',
					border: '2rpx solid #A9A9A9',
					fontSize: '24rpx'
				},
				customStylePay: {
					// marginTop: '20px',
					color: '#F05353',
					width: '128rpx',
					height: '56rpx',
					border: '2rpx solid #F05353',
					fontSize: '24rpx'
				},
				status: 1,
				payShow: false,
				goodData: [{
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
					"stock": 9,
					"stockRemain": 9,
					"sellNum": 0,
					"productUrlList": ["service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"],
					"weightRange": 0,
					"publishStatus": 1,
					"barCode": "",
					"isInfinite": 0,
					"goodsSkus": [{
						"id": "405e274ea2ba4748b36d7b60af86a3a0",
						"sellNum": 19,
						"merchantNo": "9ZLWBzob",
						"isDelete": false,
						"createTime": "2021-07-08T14:03:03.379+0000",
						"name": "[{\"name\":\"defaultSpec\"}]",
						"price": 43,
						"stock": 9,
						"stockRemain": 9,
						"goodsId": "405e274ea2ba4748b36d7b60af86a3a0",
						"barCode": "",
						"isInfinite": 0
					}],
					"goodsTags": [],
					"detailPics": [],
					"originPrice": 100,
					"isMultiSpec": false
				}], //普通商品
				number: 0, //商品数量
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				location: {},
				appointData: {}, // 预约商品
				appointShop: {}, // 预约商品的适用门店
				rightGoodData: {
					canUseMerchants: []
				}, //权益商品
				goodsId: '',
				billNo: '',
				orderData: {
					actualAmount: 127,
					actualPoint: 0,
					amount: 127,
					appid: "wx67205035cdd52bc0",
					billNo: "00031648540028359000056",
					busiStatus: 0,
					buyer: {
						appid: "wx67205035cdd52bc0",
						identityId: "2f2cacbd362749fb8d6102f4bae12156",
						member: {
							accountId: "8ca285caf52842cca0a0f49ff9ad931f",
							cardNo: "507c3a2e833a4695b8dda1feda08882c",
							memberId: "2470c65434714867bac357169ed6751c",
							memberName: "用户e162c5",
							subjectId: "DL1333225698034458624",
							subjectType: 5,
						},
						openid: "ozZZB5dlQD2DhQm4B1d6jgt82ecQ",
						phone: "18060570125",
					},
					createTime: 1648540028452,
					discountAmount: 0,
					donationAmount: 0,
					event: {
						message: "外卖下单"
					},
					extra: {
						authorFlag: 0,
						deliveryAmount: 0,
						packAmount: 0,
						pickType: 2,
						scheduleTime: 1648539635289,
						totalGoodsNum: 4,
					},
					formId: "123456789",
					items: [{
						changed: {
							remind: 9,
							version: 18
						},
						createTime: 1648540028452,
						extra: {},
						goodsId: "405e274ea2ba4748b36d7b60af86a3a0",
						name: "全闽悦影券豪华版",
						number: 2,
						price: 43,
						productPic: "service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg",
						skuId: "405e274ea2ba4748b36d7b60af86a3a0"
					}],
					mkOrderNo: "4a132c79-ee85-465e-833f-08068cb36b00",
					paymentList: [{
						amount: 127,
						barcode: "ZREMO1H9",
						channelType: 33,
						channelTypeName: "聚富通",
						divideValue: 0.89,
						failUrlPage: "/softwareparkweb/otherh5/fail.html",
						payType: 1,
						payTypeName: "微信支付",
						returnPage: "/softwareparkweb/h5/#/pages/shop/categories?pageType=2&id=9ZLWBzob",
						subPayType: "MINIPRO",
						successUrlPage: "/webappUser/success.html"
					}],
					platform: "default",
					pointDeductAmount: 0,
					positive: 1,
					receiver: {
						address: "详见商品详情说明",
						name: "为2",
						phone: "13222222222",
						sex: 1
					},
					requestSource: "3",
					saler: {
						address: "详见商品详情说明",
						brandNo: "9ZLWBzob",
						enableNegativeStorage: 0,
						enableStorageManage: 0,
						enterRegionNo: "DL1333225698034458624",
						merchantId: "MD1413109041353330688",
						merchantLogo: "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
						merchantName: "精彩电影",
						merchantNo: "9ZLWBzob",
						regionNo: "DL1333225698034458624"
					},
					status: 0,
					transactionType: 3,
					updateTime: 1648540033199,
					version: 3,
					visitIp: "112.51.7.247",
				},
				actualAmount: '--',
				transactionType: 1,
				passwordErrorShow: false,
				passwordErrorContent: '支付密码错误，请重试！',
				password: '',
				queryResultCount: 0,
				current: -1,
				totalDiscount: 0,
				isSupportRepay: 'true',
				showMore: false,
				overdueRefund: false,
				anyTimeRefund: false,
				autoRefund: false,
				channelType: '' // 2 表示是中石油的券，跳转到详情需要绑定
			};
		},
		watch: {},
		computed: {},
		onLoad(option) {
			this.status = 0
			this.number = option.number
			this.billNo = option.billNo
			this.current = option.current || -1
			this.isSupportRepay = option.isSupportRepay
			// 订单类别
			this.transactionType = 3
			// 自助买单才有实付款的参数
			this.actualAmount = option.actualAmount
			// 获取订单信息


		},
		created() {},
		mounted() {},
		beforeDestroy() {},
		methods: {
			getShopList(arr) {
				// 调用适用门店接口

			},
			//复制文本内容
			copyCode(data) {
				//设置系统剪贴板的内容  提示：API `setClipboardData` is not yet implemented  表示当前并不支持H5 此功能
				uni.setClipboardData({
					data: data,
					success: function (res) {
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			},
			clickMore() {
				this.showMore = !this.showMore
			},
			toAppointCardDetail(appointNo, billNo, id) {
				uni.navigateTo({
					url: `/myPackageA/pages/userCoupon/user-coupon-detail?id=${appointNo}&billNo=${billNo}&subjectId=${this.$regionId}&subjectType=${this.subjectType}&cardId=${id}&status=${0}&pageType=appointment`
				})
			},
			toCardDetail(rightNo, rightId, id) {
				uni.navigateTo({
					url: `/myPackageA/pages/userCoupon/user-coupon-detail?id=${rightNo}&goodsId=${rightId}&subjectId=${this.$regionId}&subjectType=${this.subjectType}&channelType=${this.channelType}&cardId=${id}&status=${0}`
				})
			},
			// 可用门店
			goToShopdetail(num) {
				uni.navigateTo({
					url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}&canUseMerchants=${canUseMerchants}`
				})

			},
			// 打电话
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			clikePay() {
				this.payShow = true
			},
			getLocation({
				curPageNum = 1
			} = {}) {

			},
			// 预约时间格式化
			appointTime(arr) {
				let start = arr[0].extra.from
				let end = arr[arr.length - 1].extra.to
				start = this.dateFormat(start, false, true)
				end = this.dateFormat(end, false, true)
				return `${start} - ${end}`
			},
			// 格式化时间
			dateFormat(time, isTotal, noMin) {
				console.log('time', time)
				if (time > 0) {
					let date = new Date(time)
					let y = date.getFullYear()
					let m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
					let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
					let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
					let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
					let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
					if (isTotal) {
						return `${y}-${m}-${d} ${h}:${mm}:${ss}`
					} else if (noMin) {
						return `${y}-${m}-${d} ${h}:${mm}`
					} else {
						return `${y}-${m}-${d}`
					}
				} else {
					return ''
				}
			},
			/**
			 * 控制小程序中图片大小
			 */
			formatRichText(html) {
				return html.replace(/\<img/gi, '<img style="width: 100%"; height: 370rpx')
			},
			// 取消订单
			cancelOrder() {
				uni.showLoading({
					title: '取消订单中'
				})
				// 权益商品的取消订单接口与其它商品不同


			},
			//密码错误---重试
			cancelPassword() {
				console.log('重试')
				this.$refs['check-password-pop'].open()
			},
			//密码错误---忘记密码
			confirmPassword() {
				console.log('忘记密码')
				uni.navigateTo({
					url: '/myPackageA/pages/user/user-wallet-password'
				})
				this.$refs['check-password-pop'].close()
			},
			changeSelect(card) {},
			// 重新支付
			repayOrder() {

			},
			//调用微信支付方法
			getRightPayApi(orderObj) {

			},
			//支付成功
			queryOrder(billNo) {

			},
			queryConsumeOrder(orderNo, callback) {},
			//支付成功页面跳转
			paySuccess(orderNo) {
				uni.showToast({
					title: '支付成功'
				})
				//跳转对应的订单查询页面
				setTimeout(() => {
					this.$nextTick(() => {
						this.$toView(
							`shop/settlement?orderNo=${orderNo}`);
					})
				}, 800)
			},
			doPay(val) {
				this.password = val
				// this.oder()
			},
			// 普通商品的支付接口
			oder(obj) {
				this.loading = true
				let paymentList = []
				if (this.companyStaffEntity.status === 1) {
					if (this.selectedCard.cardId === 'WECHAT') {
						//微信支付
						paymentList.push({
							payType: 1,
							amount: obj.payMoney,
							subPayType: 'MINIPRO'
						})
					} else {
						paymentList.push({
							payType: 16,
							amount: obj.payMoney,
							subPayType: 'BARPAY',
							protocolId: this.selectedCard.cardId + '',
							payPassword: this.password,
							// passwordType:  3
						})
						if (this.$store.state.enableMemberPassword === 1) {

							paymentList[0].passwordType = 3
						}

					}
				} else {
					if (obj.account != null && obj.account.actualMoney > 0) {
						paymentList.push({
							payType: 3,
							amount: obj.account.actualMoney,
							subPayType: 'MINIPRO'
						})
					}
					if (obj.payMoney > 0) {
						paymentList.push({
							payType: 1,
							amount: obj.payMoney,
							subPayType: 'MINIPRO'
						})
					}
				}

			},
			// 判断退款类型
			refundType(type) {
				// 转换成二进制
				// 111 过期退款&随时退款&自动退款   11  过期退款&随时退款  1 过期退款   0 不支持退款  101 过期退款&自动退款 。。。。。。
				let num = type.toString(2)
				// 往前面补0，保持三位数
				let data = (Array(3).join(0) + num).slice(-3)
				console.log('type && num', type, num, data)
				// 判断退款类型
				this.overdueRefund = data[0] === '0' ? false : true
				this.anyTimeRefund = data[1] === '0' ? false : true
				this.autoRefund = data[2] === '0' ? false : true


			},
			copy(value) {
				//提示模板
				uni.showModal({
					content: value, //模板中提示的内容
					confirmText: '复制内容',
					success: () => { //点击复制内容的后调函数
						//uni.setClipboardData方法就是将内容复制到粘贴板
						uni.setClipboardData({
							data: value, //要被复制的内容
							success: () => { //复制成功的回调函数
								uni.showToast({ //提示
									title: '复制成功'
								})
							}
						});
					}
				});
			},
			// 计算有效期
			dateAvailable(available) {
				let start = this.dateFormat(new Date().getTime())
				let end = this.dateFormat(new Date().getTime() + (parseInt(available) * 24 * 3600 * 1000))
				return start + ' 至 ' + end
			}
		}
	};
</script>
<style lang="scss" scoped>
	.order {

		&-detail {
			&-bg {
				position: absolute;
				// top: 0;
				z-index: -1;
				height: 452rpx;
				width: 100vw;
			}

			&-top {
				padding: 0 24rpx;

				&-title {
					color: #fff;
					font-size: 40rpx;
					margin: 40rpx 0;
				}

				&-product {
					background: white;
					border-radius: 10rpx;
					padding: 30rpx;

					&-detail {
						display: flex;
						margin-bottom: 20rpx;

						&_img {
							width: 144rpx;
							height: 144rpx;
							margin-right: 24rpx;

							image {
								width: 144rpx;
								height: 144rpx;

							}
						}

						&_desc {
							flex: 1;
							height: 144rpx;

							// line-height: 72rpx;
							.name {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								height: 92rpx;
								font-size: 30rpx;
								font-weight: bold;

							}

							.desc {
								color: #A9A9A9;
								font-size: 20rpx;
								margin-top: 20rpx;
								position: absolute;
							}

							.desc_self {
								color: #333;
								font-size: 30rpx;
								margin-top: 20rpx;
								// float: right;
								font-weight: bold;
								display: flex;
								justify-content: space-between;

							}
						}

						&_value {
							margin-left: 24rpx;

							.value {}

							.num {
								text-align: right;

							}
						}
					}

					&-btn {
						margin-top: 24rpx;
						display: flex;
						justify-content: flex-end;
						padding-top: 24rpx;
						border-top: 2rpx solid #F4F5F7;
					}
				}
			}

			&-shop {
				margin: 24rpx;
				background: white;
				padding: 0 24rpx;
				border-radius: 10rpx;

				&-top {
					display: flex;
					justify-content: space-between;
					height: 96rpx;
					align-items: center;

					&_title {
						font-size: 30rpx;
						font-weight: bold;

					}

					&_btn {
						.name {
							font-size: 26rpx;
							color: #666666;
						}
					}
				}

				&-bottom {
					border-top: 2rpx solid #F4F5F7;
					padding: 20rpx 0;

					&_desc {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.shop {
							display: flex;
							align-items: center;

							.shop-name {
								font-size: 28rpx;
								color: #333;
								font-weight: bold;
								max-width: 440rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.shop-btn {
								border: 2rpx solid #FFB025;
								border-radius: 5rpx;
								color: #FFB025;
								font-size: 20rpx;
								margin-left: 10rpx;
								padding: 0rpx 20rpx;

							}
						}

						.btn {}
					}

					&_address {
						font-size: 24rpx;
						color: #666;
						margin-top: 12rpx;

					}
				}
			}



			&-tip {
				margin: 24rpx;
				background: white;
				padding: 24rpx;
				border-radius: 10rpx;

				&_title {
					font-size: 30rpx;
					color: #333;
					font-weight: bold;

				}

				&_date {
					color: #999999;
					font-size: 26rpx;

				}

				&_data {
					font-size: 22rpx;
					color: #333;

				}

				&_use {
					color: #999999;
					font-size: 26rpx;
					margin-top: 20rpx;

				}

				&_tips {}
			}



			&-info {
				margin: 24rpx;
				background: white;
				padding: 24rpx;
				border-radius: 10rpx;

				&-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;

				}

				&-data {
					display: flex;
					justify-content: space-between;
					height: 84rpx;
					align-items: center;

					.name {
						font-size: 28rpx;
						color: #666666;
						min-width: 210rpx;

					}

					.data {
						font-size: 28rpx;
						color: #333;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						word-break: break-all;

					}
				}
			}

		}

		.order-coupon {
			margin: 24rpx;
			background: white;
			padding: 0 24rpx 24rpx 24rpx;
			border-radius: 10rpx;

			&-title {
				height: 96rpx;
				line-height: 96rpx;
				font-size: 30rpx;
				font-weight: bold;
			}

			.see-more {
				color: #707070;
				display: flex;
				justify-content: center;
				align-items: center;

				.image-right {
					width: 14rpx;
					margin-left: 8rpx;
				}

				.image-up {
					height: 14rpx;
					margin-left: 8rpx;
				}
			}

			.coupon-item-box {
				background-color: #FFFBFB;

				border-radius: 12rpx;
				margin-bottom: 20rpx;
				position: relative;
				overflow: hidden;

				.gap-top,
				.gap-bottom {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					right: 168rpx;
					border-radius: 100%;
					background-color: #FFFFFF;
					border: 1px solid #FFC3C3;
					z-index: 3;
				}

				.gap-top {
					top: -12rpx;
				}

				.gap-bottom {
					bottom: -12rpx;
				}

				.gap-mid-line {
					position: absolute;
					height: 100%;
					top: 0;
					right: 179rpx;
					width: 2rpx;
					border-right: 1px dotted #FFC3C3;
					z-index: 1;
				}

				.image-status {
					width: 180rpx;
					position: absolute;
					right: -50rpx;
					top: -50rpx;
				}

				.coupon-code {
					height: 60rpx;
					line-height: 60rpx;
					border: 1px solid #FFC3C3;
					border-top: none !important;
					border-radius: 0 0 12rpx 12rpx;

					&-left {
						height: 100%;
						border-top: 1px solid rgba(255, 203, 203, 0.3);
						width: calc(100% - 184rpx);
						display: flex;
						font-size: 22rpx;
						padding-left: 40rpx;
					}

					.color-grey {
						color: #A5A5A5 !important;
					}

					&-num {
						color: #FC7070;
						width: 240rpx;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					&-copy {
						text-decoration: underline;
						color: #E64040;
						margin-left: 20rpx;
					}
				}

				.coupon-item {
					border: 1px solid #FFC3C3;
					border-bottom: none !important;
					border-radius: 12rpx 12rpx 0 0;
					height: 120rpx;
					position: relative;
					overflow: hidden;
					// background-color: #FFFBFB;
					display: flex;

					&-left {
						width: 150rpx;
						// border-left: 1px solid #FFC3C3;
						// border-top: 1px solid #FFC3C3;
						// border-bottom: 1px solid #FFC3C3;
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
						// border-top: 1px solid #FFC3C3;
						// border-bottom: 1px solid #FFC3C3;
						flex: 1;
						display: flex;
						flex-direction: column;
						position: relative;
						padding: 0 10rpx;
						min-width: 0;

						.title {
							padding-top: 30rpx;
							padding-left: 30rpx;
							font-size: 30rpx;
							font-weight: 500;
							line-height: 1.1;
							overflow: hidden;
							flex: 1;
						}

						.term {
							font-size: 22rpx;
							color: #A7A7A7;
							height: 50rpx;
							line-height: 50rpx;
							padding-left: 30rpx;
						}
					}

					&-right {
						display: flex;
						flex-wrap: wrap;
						text-align: center;
						flex-shrink: 0;
						justify-content: center;
						// align-items: center;
						width: 180rpx;
						color: #fff;
						// border-top: 1px solid #FFC3C3;
						// border-bottom: 1px solid #FFC3C3;
						// border-top: 1px solid #FFC3C3;
						// border-right: 1px solid #FFC3C3;
						// border-left: 1px dotted #FFC3C3;
						border-top-right-radius: 12rpx;
						border-bottom-right-radius: 12rpx;

						&.invalid {
							button {
								color: #fff;
								border: 2rpx solid #E43838;
								// background: #FFFFFF;
							}
						}

						.btn-disabled {
							background: #A5A5A5 !important;
							border: 2rpx solid #A5A5A5 !important;
						}

						button {
							color: #fff;
							border: 2rpx solid #E43838;
							width: 120rpx;
							height: 50rpx;
							line-height: 50rpx;
							border-radius: 50rpx;
							font-size: 22rpx;
							padding: 0 !important;
							color: #FFFFFF;
							background: linear-gradient(90deg, rgba(244, 106, 106, 1) 0%, rgba(228, 56, 56, 1) 100%);
							margin-top: 62rpx;
						}
					}
				}
			}
		}

		.popup {
			&-title {
				text-align: center;
				padding-top: 20rpx;
				font-size: 34rpx;
				font-weight: bold;
			}

			&-data {
				margin-top: 24rpx;
				border-top: 2rpx solid #F4F5F7;

			}

		}
	}
</style>
