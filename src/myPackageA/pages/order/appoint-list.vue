<template>
    <view class="order">
      	<cu-custom bgColor="bg-white" is-back >
          <block slot="backText" class="text-black">我的预约</block>
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
                <view class="order-list-data-list-shop-img">
                    <image :src="$util.strIsEmpty(order.merchantLogo) ? '../../../static/logo.png' : (spMatefileBaseURL + order.merchantLogo + fixStr)"
								      @error="onErrorLogo(order)"/>
                    <!-- <image :src="order.saler.merchantLogo ? `${spMatefileBaseURL}${order.saler.merchantLogo}${fixStr}` : '../../../static/logo.png'" /> -->
                    <view class="order-list-data-list-shop-img_name">{{order.merchantName}}</view>
                </view>
                <view class="order-list-data-list-shop-opt" :style="[{color: themeColor}]">
                  {{getStatus(order.positive, order.status, order.busiStatus,order.isSupportRepay)}}
                </view>
              </view>
              <!-- 基本信息 普通商品和权益商品 1个-->
              <view @click="toOrderDetail(order)">
                <view class="order-list-data-list-info">
                  <!-- 图片 -->
                  <view class="order-list-data-list-info-img">
                      <image :src="order.activityLogo ? `${spMatefileBaseURL}${order.activityLogo}${fixStr}` : '../../../static/logo.png'" />
                  </view>
                  <view class="order-list-data-list-info-data">
                    <view class="order-list-data-list-info-data_detail">
                      {{order.activityName}}
                    </view>
                    <view class="order-list-data-list-info-data_price">
                      <view class="order-list-data-list-info-data_price_value">
                        <!-- ￥{{getDiscount(order.actualAmount,order.paymentList)}} -->
                        ￥{{order.amount || 0}}
                      </view>
                      <view class="">
                        共 {{product.number || 1}} 件
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
                    <text>预约订单</text>
                  </view>
                  <view>{{order.createTime | timeFormat}}</view>
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
      list: [
        { name: '未核销' }, 
        { name: '已核销' }, 
        { name: '已取消' }, 
        { name: '已过期' }],
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
        orderDetail:[],
        record:{},
        imgUrl: '',
        shopInfo: {},
        fromMember: false,
        fromPage: '',
        account: ''
    };
  },
  filters: {
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
    this.account = option.account ? JSON.parse(option.account) : ''
    console.log('this.account', this.account, option.account)
    this.change(this.current)

  },
  beforeDestroy() {},
  methods: {
    change(index) {
				this.current = index;
        this.params = {
          status: index + 1,
          pager:{
            curPageNum: 1,
            pageSize: 6
          },
          userId: this.account.accountId,
          accountId: this.account.accountId
        }
        this.orderDetail= []
			},
     
      // 获取数据
    getDetail(){
      if (this.fromMember == 'true') {
        // this.params.
        this.params.merchantNo = this.shopInfo.merchantNo
      }
   
    },
    onErrorLogo(item) {
      this.$set(item, 'merchantLogo', null)
    },
    toOrderDetail(order){
      uni.navigateTo({
        url: `/myPackageA/pages/order/user-order-detail?billNo=${order.billNo}&actualAmount=${order.amount}&transactionType=2000&current=${this.current}&bizType=appointment`
      })
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
      // this.getDetail()
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
