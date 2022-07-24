<template>
    <view class="order">
      	<cu-custom bgColor="bg-white" is-back >
          <block slot="backText" class="text-black">我的订单</block>
        </cu-custom>
        <view class="order-list">
          <!-- tab切换 -->
          <view>
            <u-tabs :list="list" :is-scroll="false" :current="current" @change="change" :active-color="themeColor"></u-tabs>
          </view>
          <!-- 页面 -->
          <view class="order-list-data">
            <view v-if="orderDetail.length >= 1">
            <!-- 商品 如果商品个数 = 1 -->
            <view class="order-list-data-list" v-for="(order, orderIndex) in orderDetail" :key="orderIndex">
              <!-- 店铺名称 -->
              <view :class="order.saler ? 'order-list-data-list-shop' : 'order-list-data-list-shop-end'">
                <!-- 图片 -->
                <view class="order-list-data-list-shop-img" v-if="order.saler">
                    <image :src="$util.strIsEmpty(order.saler.merchantLogo) ? '../../../static/logo.png' : (spMatefileBaseURL + order.saler.merchantLogo + fixStr)"
								      @error="onErrorLogo(order.saler)"/>
                    <!-- <image :src="order.saler.merchantLogo ? `${spMatefileBaseURL}${order.saler.merchantLogo}${fixStr}` : '../../../static/logo.png'" /> -->
                    <view class="order-list-data-list-shop-img_name">{{order.saler.merchantName}}</view>
                </view>
                <view class="order-list-data-list-shop-opt" :style="[{color: themeColor}]">
                  {{getStatus(order.positive, order.status, order.busiStatus,order.isSupportRepay)}}
                </view>
              </view>

              <!-- 基本信息 预约商品 -->
              <view v-if="order.extra.bizType == 'appointment'"  @click="toOrderDetail(order)">
                <view v-for="(product, productIndex) in order.items" :key="productIndex">
                  <view class="order-list-data-list-info" v-if="productIndex == 0">
                    <!-- 图片 -->
                    <view class="order-list-data-list-info-img">
                        <image :src="product.pic ? `${spMatefileBaseURL}${product.pic}${fixStr}` : '../../../static/logo.png'" />
                    </view>
                    <view class="order-list-data-list-info-data">
                      <view class="order-list-data-list-info-data_detail">
                        {{product.name}}
                      </view>
                      <view class="order-list-data-list-info-data_price">
                        <view class="order-list-data-list-info-data_price_value">
                          <!-- ￥{{order.actualAmount}} -->
                          ￥{{getDiscount(order.actualAmount,order.paymentList)}}
                        </view>
                        <view class="">
                          共 {{product.number}} 件
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 基本信息 普通商品和权益商品 1个-->
              <view v-if="order.extra.bizType != 'appointment' && order.transactionType !== 1 && order.transactionType !== 16 && order.items && order.items.length === 1"  @click="toOrderDetail(order)">
                <!-- <view v-if="order.items"> -->
                  <view class="order-list-data-list-info" v-for="(product, productIndex) in order.items" :key="productIndex">
                  <!-- 图片 -->
                  <view class="order-list-data-list-info-img">
                      <image :src="product.pic ? `${spMatefileBaseURL}${product.pic}${fixStr}` : '../../../static/logo.png'" />
                  </view>
                  <view class="order-list-data-list-info-data">
                    <view class="order-list-data-list-info-data_detail">
                      {{product.name}}
                    </view>
                    <view class="order-list-data-list-info-data_price">
                      <view class="order-list-data-list-info-data_price_value">
                        <!-- ￥{{order.actualAmount}} -->
                        ￥{{getDiscount(order.actualAmount,order.paymentList)}}
                      </view>
                      <view class="">
                        共 {{product.number}} 件
                      </view>
                    </view>
                  </view>
                <!-- </view> -->
              </view>
              </view>

              <!-- 基本信息 普通商品和权益商品  多个 -->
              <view v-if="order.extra.bizType != 'appointment' && order.transactionType !== 1 && order.transactionType !== 16 && order.items && order.items.length > 1"  @click="toOrderDetail(order)">
                <view class="order-list-data-list-info">
                <!-- 图片 -->
                <view class="order-list-data-list-info-img" style="display: flex; overflow-x: auto;">
                    <image style="flex: none" v-for="(product, productIndex) in order.items[0]" :key="productIndex" :src="product.pic ? `${spMatefileBaseURL}${product.pic}${fixStr}` : '../../../static/logo.png'" />
                    <view style="height: 144rpx; width: 144rpx;flex: none"></view>
                </view>
                <view class="order-list-data-list-info-data overflow-positon">
                  <!-- <view class="order-list-data-list-info-data_detail">
                    {{product.name}}
                  </view> -->
                  <view class="order-list-data-list-info-data_price">
                    <view class="order-list-data-list-info-data_price_value">
                      <!-- ￥{{order.actualAmount}} -->
                      ￥{{getDiscount(order.actualAmount,order.paymentList)}}

                    </view>
                    <view class="">
                      共 {{getProductNum(order.items)}} 件 ff
                    </view>
                  </view>
                </view>
              </view>
              </view>

              <!-- 基本信息  直接买单   收银台 -->
              <view v-if="order.transactionType === 1 || order.transactionType === 16"  @click="toOrderDetail(order)">
                <view class="order-list-data-list-info" :key="orderIndex">
                <!-- 图片 -->
                <view class="order-list-data-list-info-img">
                    <image :src="order.pic ? `${spMatefileBaseURL}${order.pic}${fixStr}` : '../../../static/logo.png'" />
                </view>
                <view class="order-list-data-list-info-data">
                  <view class="order-list-data-list-info-data_detail">
                    {{order.transactionType === 1 ? '直接买单' : '收银台'}}
                  </view>
                  <view class="order-list-data-list-info-data_price">
                    <view class="order-list-data-list-info-data_price_value">
                      ￥{{getDiscount(order.actualAmount,order.paymentList)}}
                      <!-- ￥{{order.actualAmount}} -->
                    </view>
                  </view>

                </view>
              </view>
              </view>

              <!-- 底部按钮 -->
              <view class="order-list-data-list-btn" @click="toOrderDetail(order)">
                <view class="order-list-data-list-btn-data" v-if="order.positive === 0 && (order.status === 1 || order.status === 3)">
                  <view class="order-list-data-list-btn-data_label" :style="{border: `2rpx solid ${themeColor}`,color: `${themeColor}`}">
                    退款单
                  </view>
                  <view>{{order.createTime}}</view>
                </view>
                <view class="order-list-data-list-btn-data" v-else>
                  <view class="order-list-data-list-btn-data_label" :style="{border: `2rpx solid ${themeColor}`,color: `${themeColor}`}">
                    <text v-if="order.transactionType === 1">直接买单</text>
                    <text v-else-if="order.transactionType === 2">点单订单</text>
                    <text v-else-if="order.transactionType === 3">商城订单</text>
                    <text v-else-if="order.transactionType === 2000">{{order.extra.bizType == 'appointment' ? '预约订单' : '权益订单'}}</text>
                    <text v-else-if="order.transactionType === 16">收银台</text>
                    <text v-else-if="order.transactionType === 4">充值订单</text>
                    <text v-else>其它</text>
                  </view>
                  <view>{{order.createTime}}</view>
                </view>
                <u-button :custom-style="customStyle" @click="toOrderDetail(order)" v-if="order.status === 0 && order.isSupportRepay">待支付</u-button>
                <u-button :custom-style="customStyle" @click="toOrderDetail(order)" v-else>订单详情</u-button>
              </view>
            </view>
            </view>


          </view>
        </view>
          <zj-empty v-if="orderDetail.length === 0" :img="`${imgUrl}1639019849000/pic_order.png`"
			 text="您还没有订单哦~" />
       <uni-load-more v-if="!isTest && orderDetail.length > 0" :status="record.status"></uni-load-more>
    </view>
</template>

<script>
export default {
  name: 'user-order-list',
  components: {},
    props:{
      isTest:{// 是否刷新
        type: Boolean,
        default: false
      }
    },
  data() {
    return {
      themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
      list: [{
					name: '待付款'
				}, {
					name: '待收货'
				}, {
					name: '退款'
				}, {
					name: '全部'
				}],
				current: 0,
        fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
        customStyle: {
          color: uni.getStorageSync('themeColor') || '#34A2E8',
          borderColor: uni.getStorageSync('themeColor') || '#34A2E8',
          width: '144rpx',
          marginRight: '24rpx',
          height: '56rpx',
          fontSize: '26rpx'
        },
        params: {},
        orderDetail:[{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-30 12:01:14","billNo":"00161648612874708001344","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648612875188190786","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220330120112653.png"]}},{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-29 11:53:13","billNo":"00161648525993584001334","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648525994102159409","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220329115313086.png"]}},{"actualAmount":13.05,"amount":14.5,"positive":1,"createTime":"2022-03-28 11:52:58","billNo":"00161648439578356001248","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648439578862443921","amount":13.05,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220328115258803.png"]}},{"actualAmount":13.05,"amount":14.5,"positive":1,"createTime":"2022-03-25 12:04:56","billNo":"00161648181096743001173","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648181097250849379","amount":13.05,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220325120453668.png"]}},{"actualAmount":13.95,"amount":15.5,"positive":1,"createTime":"2022-03-24 11:56:10","billNo":"00161648094170538001183","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648094171062901969","amount":13.95,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220324115611962.png"]}},{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-23 12:01:52","billNo":"00161648008112553001252","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648008113016297183","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220323120154848.png"]}}],
        record:{},
        imgUrl: '',
        shopInfo: {},
        fromMember: false
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
  },
  onLoad(option){
    this.imgUrl = this.$imgUrl
    console.log('op',option)
    if(option.current){
      this.current = parseInt(option.current)
    }
    if (option.fromMember && option.fromMember=='true') {
      this.fromMember = option.fromMember
      this.shopInfo = JSON.parse(option.shopInfo)
    }
    this.change(this.current)

  },
  beforeDestroy() {},
  methods: {
    change(index) {
				this.current = index;
        if(this.current === 1){
          // 待收货
          this.params = {
            regionNo:this.$regionId,
            pager:{
              curPageNum:1,
              pageSize:6
              },
            statuses:[this.current],
            busiStatuses: [0, 1, 2],
            positive: 1
            }
            this.orderDetail= []
        }else if(this.current === 0){
          // 待付款
          this.params = {
            regionNo:this.$regionId,
            pager:{
              curPageNum:1,
              pageSize:6
              },
            statuses:[this.current],
            positive: 1
            }
            this.orderDetail= []
        }else if(this.current === 2){
          // 退款
          this.params = {
            orPositiveRefund: 0,
            regionNo:this.$regionId,
            pager:{
              curPageNum:1,
              pageSize:6
              },
            // statuses:[this.current]
          }
          this.orderDetail= []
        }else if(this.current === 3){
          // 全部
          this.params = {
            regionNo:this.$regionId,
            pager:{
              curPageNum:1,
              pageSize:6
              }
          }
          this.orderDetail= []
        }
        this.getDetail()
			},
      // 获取数据
    getDetail(){
    
            this.orderDetail = [{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-30 12:01:14","billNo":"00161648612874708001344","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648612875188190786","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220330120112653.png"]}},{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-29 11:53:13","billNo":"00161648525993584001334","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648525994102159409","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220329115313086.png"]}},{"actualAmount":13.05,"amount":14.5,"positive":1,"createTime":"2022-03-28 11:52:58","billNo":"00161648439578356001248","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648439578862443921","amount":13.05,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220328115258803.png"]}},{"actualAmount":13.05,"amount":14.5,"positive":1,"createTime":"2022-03-25 12:04:56","billNo":"00161648181096743001173","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648181097250849379","amount":13.05,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220325120453668.png"]}},{"actualAmount":13.95,"amount":15.5,"positive":1,"createTime":"2022-03-24 11:56:10","billNo":"00161648094170538001183","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648094171062901969","amount":13.95,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220324115611962.png"]}},{"actualAmount":12.15,"amount":13.5,"positive":1,"createTime":"2022-03-23 12:01:52","billNo":"00161648008112553001252","transactionType":16,"status":3,"saler":{"merchantName":"久号食堂（软件园店）","merchantLogo":"service-org-7adc24dc/20211214/bb0f2e1683f24d41ada50a0b5df06ab8.png"},"isSupportRepay":false,"paymentList":[{"orderNo":"1648008113016297183","amount":12.15,"payType":16,"payTypeName":"钱包支付","subPayType":"BARPAY","vendorDiscount":"0","bankDiscount":"0","protocolId":"90"}],"extra":{"scheduleTime":0,"totalGoodsNum":0,"deliveryAmount":0,"packAmount":0,"thumbUrl":["laiqianba-efk/fyb/5mHEXRL1/86f6f6271f55b4f09ba843d4af100cfa/5mHEXRL10cfa20220323120154848.png"]}}]
        
  
    },
    onErrorLogo(item) {
      this.$set(item, 'merchantLogo', null)
    },
    toOrderDetail(order){
      console.log(order)
      let status = order.status.toString()
      if(order.items && order.items.length > 0){
        // uni.redirectTo({
        // 获取order.items中的goodsId传送过去
        let myArray = new Array()
        order.items.forEach(myItem => {
          myArray.push({
            goodsId: myItem.goodsId
          })
        })
        uni.navigateTo({
           url: `/myPackageA/pages/order/user-order-detail?status=${status}&id=${JSON.stringify(myArray)}&billNo=${order.billNo}&actualAmount=${order.actualAmount}&transactionType=${order.transactionType}&current=${this.current}&isSupportRepay=${order.isSupportRepay}&bizType=${order.extra.bizType}`
        })
      }else {
        // uni.redirectTo({
        uni.navigateTo({
           url: `/myPackageA/pages/order/user-order-detail?status=${status}&id=${-1}&number=${-1}&billNo=${order.billNo}&actualAmount=${order.actualAmount}&transactionType=${order.transactionType}&current=${this.current}&isSupportRepay=${order.isSupportRepay}&bizType=${order.extra.bizType}`
        })
      }
    },
		onPullDownRefresh () {
			this.getDetail()
		},
		onReachBottom () {
			if (this.record.curPageNum === 0) {
				return
			}
			if (this.record.status === 'loading' || this.record.loaded && (this.orderDetail == null || this.orderDetail.length === 0)) {
				return
			}
			if (this.record.curPageNum >= this.record.totalPageNum) {
				return
			}
      this.params.pager.curPageNum = ++this.record.curPageNum
      this.getDetail()
		},
    getProductNum(item){
      let total = 0
      item.map(m => total = total + m.number)
      return total
    },
    // 判断订单状态
    getStatus(positive, status, busiStatuses, isSupportRepay){
       if(positive === 0 && (status === 1 || status === 3)){
         return '交易完成'
       }
       if(positive === 1){
         if(status === 4 || status === 5){
           return '已退款'
         }
         if(status === 2){
           if(busiStatuses === 4 || busiStatuses === 7){
             return '已退单'
           }else{
             return '已取消'
           }
         }
         if(status === 1){
           return '待收货'
         }
         if(status === 0 && isSupportRepay){
           return '待付款'
         }
         if(status === 0 && !isSupportRepay){
           return '已取消'
         }
         if(status === 3){
           return '交易完成'
         }
       }
       return ''
    },
    getDiscount(actualAmount,paymentList){
      let totalDiscount = 0
      paymentList.forEach(val => {
        totalDiscount = parseFloat(val.bankDiscount) || 0 + parseFloat(val.vendorDiscount) || 0
      })
      let value = (actualAmount - totalDiscount).toFixed(2)
      return value
    }

  }
};
</script>
<style lang="scss" scoped>
.order {

  &-list {
    // height: 100vh;

    &-data {
      margin-bottom: 20rpx;
      // height: calc(100% - 100rpx);
      // overflow-y: auto;

      &-list {
        &-shop-end{
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 20rpx 24rpx 10rpx;
          margin-top: 20rpx;
          background: white;
          border-bottom: 2rpx solid #F4F5F7;
          margin-top: 20rpx;

        }

        &-shop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 24rpx 10rpx;
          margin-top: 20rpx;
          background: white;
          border-bottom: 2rpx solid #F4F5F7;

          &-img {
              display: flex;
              align-items: center;
              flex: 1;
            image {
                height: 80rpx;
                width: 80rpx;
                margin-right: 20rpx;
                border-radius: 80rpx;

            }
            &_name{
              font-size: 30rpx;
              font-weight: bold;
              width: 450rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &-opt{
            font-size: 26rpx;
            width: 120rpx;
            text-align: end;
          }

        }

         &-info {
          display: flex;
          align-items: center;
          background: white;
          padding: 20rpx 24rpx 10rpx 24rpx;
          border-bottom: 2rpx solid #F4F5F7;
          position: relative;
          &-img {
            image {
              height: 144rpx;
              width: 144rpx;
              margin-right: 20rpx;
              border-radius: 10rpx;

            }
          }
          .overflow-positon{
            position: absolute;
            /* float: right; */
            right: 24rpx;
            background: rgba(255,255,255,0.9);
            height: 144rpx;
            align-items: center;
          }
          &-data {
            flex: 1;
            display: flex;
            height: 80rpx;
            &_detail {
              font-size: 26rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
              font-weight: bold;
              flex: 1;
            }

            &_price {
                // display: flex;
                // justify-content: space-between;
                // margin-right: 20rpx;
                // align-items: center;
                // margin-top: 20rpx;
                    width: 150rpx;
                 text-align: right;
                &_value{
                  // color: #E43838;
                  font-size: 30rpx;
                  font-weight: bold;
                }

            }
            &_price1 {
                margin-right: 20rpx;
                text-align: end;
                margin-top: 20rpx;
                &_value{
                  color: #E43838;
                  font-size: 30rpx;
                  font-weight: bold;
                }

            }
          }
        }

        &-btn {
            display: flex;
            // justify-content: flex-end;
            justify-content: space-between;
            background: white;
            padding: 20rpx 0rpx 20rpx 24rpx;
            &-data{
              display: flex;
              align-items: center;
              font-size: 24rpx;
              &_label{
                // border: 2rpx solid #34A2E8;
                // color: #34A2E8;
                height: 48rpx;
                border-radius: 24rpx;
                padding: 0 20rpx;
                line-height: 46rpx;
                margin-right: 20rpx;
                font-size: 20rpx;
              }
            }
        }
      }
    }
  }

  ::v-deep .uni-load-more {
    margin-bottom: 60px;
  }
}

</style>
