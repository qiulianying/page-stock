<template>
  <view class="coupon-order">
    <cu-custom bgColor="bg-white" is-back>
      <block slot="backText" class="text-black">立即抢购</block>
    </cu-custom>
    <!-- <button @click="testTo">快点我</button> -->
    <!-- 商品信息 -->
    <view class="coupon-info">
      <view class="coupon-order-desc">
        <!-- 基本信息 -->
        <view class="coupon-order-desc-info">
          <!-- 图片 -->
          <view class="coupon-order-desc-info-img">
            <image :src="pic ? `${spMatefileBaseURL}${pic}${fixStr}` : '../../../static/logo.png'" />
          </view>
          <view class="coupon-order-desc-info-data">
            <view class="coupon-order-desc-info-data_detail">
              {{name}}
            </view>
            <view class="coupon-order-desc-info-data_price">
              <view class="coupon-order-desc-info-data_price_value">
                ￥{{realPrice || getPriceInfo.amount || 0}}
              </view>
              <view class="">
                x1
              </view>
            </view>
          </view>
        </view>

        <view style="margin-bottom:20rpx;" v-if="fromPage && fromPage == 'appointment'">
          <!-- 预约活动 -->
          <view class="coupon-order-desc-name">
            <view class="coupon-order-desc-name_label">预约活动</view>
            <view style="width:90%;">
              <u-input :disabled="true" v-model="form.activityName" />
            </view>
          </view>
          <!-- 预约时间 -->
          <view class="coupon-order-desc-name">
            <view class="coupon-order-desc-name_label">预约时间</view>
            <view style="width:90%;">
              <u-input :disabled="true" v-model="form.time" />
            </view>
          </view>
          <!-- 预约总时长 -->
          <view class="coupon-order-desc-name">
            <view class="coupon-order-desc-name_label">总时长</view>
            <view style="width:90%;">
              <u-input :disabled="true" v-model="form.timeLong" />
            </view>
          </view>
        </view>

        <!-- 可用门店 -->
        <view class="coupon-order-desc-shop">
          <u-cell-item title="可用门店" :value="store" @click="goToShopdetail"></u-cell-item>
        </view>
        <!-- 联系人 -->
        <view class="coupon-order-desc-name">
          <view class="coupon-order-desc-name_label">联系人</view>
          <view>
            <u-input :disabled="true" v-model="form.name" />
          </view>
        </view>
        <!-- 手机号 -->
        <view class="coupon-order-desc-phone">
          <view class="coupon-order-desc-phone_label">手机号</view>
          <view>
            <u-input :disabled="true" v-model="form.phone" />
          </view>
        </view>
        <!-- 备注 -->
        <view class="cu-list menu" style="border-bottom: 1rpx solid #f7f7f7" @click="toRemark">
          <view class="cu-item arrow">
            <view class="content">
              <text style="font-size: 30rpx">备注</text>
            </view>
            <view class="action" style="flex: 1;">
              <text class="text-df text-bold text-overflow"
                style="color: #c7c7c7; float: right;">{{ textValue ? textValue : '去填写备注' }}</text>
            </view>
          </view>
        </view>
        <!-- 小计 -->
        <view class="coupon-order-desc-total">
          小计：<text class="coupon-order-desc-total_val">￥{{ getPriceInfo.actualMoney || 0}}</text>
        </view>
      </view>
      <!--选择支付方式-->
      <view class="coupon-order-discount marginButton">
      </view>
    </view>
    <!-- 支付按钮 -->
    <view class="coupon-order-btn">
      <view class="coupon-order-btn-total">支付：<text
          class="coupon-order-btn-total_val">￥39.9</text></view>
      <view class="coupon-order-btn-num">合计：<text>1件</text></view>
      <view class="coupon-order-btn-pay">
        <!-- 暂时删除 -->
        <!-- <u-button type="default" :custom-style="customStyle" shape="circle" v-if="companyStaffEntity.status && companyStaffEntity.status === 1 && selectedCard.cardId == null">立即支付</u-button> -->
        <u-button type="default" :custom-style="customStyle" shape="circle" @click="toh5pay"
          v-if="!selectedCard.cardId">立即支付</u-button>
        <u-button type="primary" :custom-style="customStyle" shape="circle" :loading="buttonLoading"
          @click="toSubscribe" v-else>立即支付</u-button>
      </view>
    </view>
    <!--支付密码校验-->
    <zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk" @close-popup="closePopup">
    </zj-password-popup>
    <!-- 支付密码错误弹窗 -->
    <u-modal v-model="passwordErrorShow" :content="passwordErrorContent" @confirm="confirmPassword"
      @cancel="cancelPassword" :show-cancel-button="true" cancel-text="重试" confirm-text="忘记密码"></u-modal>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
  import {
    confirmDrug
  } from "../../../api/shopmall";

  export default {
    name: 'coupon-order',
    props: {},
    data() {
      return {
        showAppoint: false,
        buttonLoading: false,
        openId: '', //当前用户openId
        bank: this.$const.BANK,
        form: {
          name: '小**',
          phone: '188****8888',
          remark: ''
        },
        goodsId: '',
        fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
        pic: 'service-org-7adc24dc/20210812/aa5c297239124de197acc62964025fb4.jpg',
        name: '全闽悦影券豪华版(不要修改此商品信息)',
        store: '精彩电影',
        numValue: 1,
        realPrice: 39.9,
        member: {},
        companyStaffEntity: {},
        accountList: [{
          type: 'WECHAT', //微信
          cardId: 'WECHAT', //微信支付默认id情况
          payType: this.$const.PAY_TYPE.WECHAT
        }], //软件园没认证的情况下或者非软件园情况下的支付方式
        selectedAccount: {},
        cardList: [
          // 先屏蔽微信支付 ---- 后续需要开放
          // {
          //   type: 'WECHAT',		//微信
          //   cardId: 'WECHAT',	//微信支付默认id情况
          //   payType: this.$const.PAY_TYPE.WECHAT
          // }
        ], //软件园认证情况下的支付情况
        selectedCard: {},
        location: {
          latitude: null,
          longitude: null
        },
        regionNo: 'DL1333225698034458624',
        getPriceInfo: {}, //获取计价接口返回数据
        queryResultCount: 0,
        textValue: '',
        isWallet: false, // 是否可以用钱包支付
        passwordErrorShow: false,
        passwordErrorContent: '支付密码错误，请重试！',
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        customStyle: {
          color: '#fff',
          backgroundColor: uni.getStorageSync('themeColor') || '#34A2E8',
        },
        merchantNo: '',
        couponInfo: {
          canUseMerchants: [{
            address: "软件大道89号A区双创城",
            disance: 4.796891022851411,
            found: false,
            id: "MD1413109041353330688",
            index: "info-merchant",
            linkPhone: "13599098689",
            logo: "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
            merchantName: "精彩电影",
            merchantNo: "9ZLWBzob",
            primaryTerm: 0,
            seqNo: 0,
            sort: [4.796891022851411, 1648218473000],
            type: "info-merchant",
            version: 0
          }]
        },
        fromPage: '',
        selectArr: []
      };
    },
    watch: {},
    computed: {
      pageLang() {
        return this.$t('pages.shop.shopCheck')
      }
    },
    created() {},
    onShow() {
      uni.$on('remarkBackTo', res => {
        this.textValue = res.remark
      })
    },
    onLoad(option) {
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
      this.numValue = option.numValue
      this.goodsId = option.goodsId
      this.merchantNo = option.merchantNo || ''
      this.location = {
        latitude: option.lat,
        longitude: option.lon
      }
      //获取身份信息以及支付类型
      console.log('option', option, option.fromPage)
      if (option.fromPage && option.fromPage == 'appointment') {
        this.fromPage = option.fromPage
        let appointInfo = JSON.parse(option.appointInfo)
        this.selectArr = appointInfo.selectArr
        this.form.activityName = appointInfo.name
        this.form.time = appointInfo.time
        this.form.timeLong = appointInfo.timeLong
        this.regionNo = this.$regionId
        this.pic = appointInfo.pic
      }
    },
    mounted() {
      // 获取用户信息

    },
    beforeDestroy() {},
    methods: {
      toh5pay() {
        uni.navigateTo({
          url: `/myPackageA/pages/order/user-order-detail`
        })
      },
      // 支付方式
      getSelectCard(value) {
        this.selectedCard = value
        console.log('当前选择支付方式')
        console.log(this.selectedCard)
      },
      //调用计价接口
      getPriceInfoApi(itemType) {

      },
      changeAccountPayType(account) {
        if (this.selectedAccount.accountId == account.accountId) {
          this.selectedAccount = {}
        } else {
          this.selectedAccount = account
          if (this.inputMoney !== '') {
            this.timerStart()
          }
        }
      },
      // 替换成组件
      // //调用钱包组件查询剩余钱包金额
      // queryAccBalance(accountId) {
      //     return queryAccBalance({
      //         regionNo: this.$regionId,
      //         accountId: accountId
      //     })
      // },
      // //调用银行卡组件进行查询银行卡信息
      // queryAccBind(accountId) {
      //     return queryAccBind({
      //         regionNo: this.$regionId,
      //         accountId: accountId
      //     })
      // },
      //支付成功页面跳转
      paySuccess(orderNo) {
        uni.showToast({
          title: '支付成功'
        })
        //跳转对应的订单查询页面
        setTimeout(() => {
          this.$nextTick(() => {
            uni.redirectTo({
              url: `/pages/shop/settlement?orderNo=${orderNo}`
            })
            // this.$toView(
            //     `shop/settlement?orderNo=${orderNo}`);
          })
        }, 800)
      },

      changeCardType(card) {
        if (this.isWallet) {
          this.selectedCard = card
        } else {
          // 如果钱包不能使用，则点击了也不切换
          if (card.type !== 'wallet') {
            this.selectedCard = card
          }

        }
      },
      showRemarkModal() {
        this.$refs['zj-prompt'].showModal()
      },
      passwordInputOk(value) {
        this.password = value
        this.doPay()
      },
      closePopup() {
        this.buttonLoading = false
      },
      //调用支付
      doPay() {
        //建议调用支付之前，先调用计价，以免取消支付之后订单号错误等问题

      },
      //调用支付方法
      getRightPayApi() {
        let mysptType = this.$const.SPT_TYPE.SPT_MINIPRO
        // #ifdef H5
        mysptType = this.$const.SPT_TYPE.SPT_NTPAYSPT_JSAPI
        // #endif
        uni.showToast({
          title: "支付成功",
          duration: 2000
        });
        //调用支付接口
        uni.navigateTo({
          url: `/myPackageA/pages/order/user-order-detail?status=${'0'}&id=${JSON.stringify(items)}&billNo=${orderObj.orderInfo.billNo}&transactionType=${orderObj.orderInfo.transactionType}`
        })
      },

      //支付成功
      queryOrder(billNo) {
        this.queryResultCount = 0
        uni.showLoading({
          title: '交易查询中',
          mask: true
        })
        this.queryConsumeOrder(billNo, result => {
          uni.hideLoading()
          if (result) {
            this.paySuccess(billNo)
          } else {
            uni.showToast({
              title: this.pageLang.unknownResult,
              icon: 'none'
            })
          }
          this.loading = false
        })
      },
      queryConsumeOrder(orderNo, callback) {
        this.queryResultCount++
        setTimeout(() => {
          confirmDrug({
            transactionType: 2000, //当前购买类型，这里默认为外卖,
            billNo: orderNo,
            event: {
              info: {},
              message: "确认订单"
            },
            platform: "default"
          }, {
            hideLoading: true,
            hideMsg: true
          }).then(res => {
            let obj = res.object
            if (obj.status === 1 || obj.status === 3) {
              callback(true)
            } else if (this.queryResultCount <= this.queryMaxCount) {
              this.queryConsumeOrder(orderNo, callback)
            } else {
              callback(false)
            }
          }).catch(err => {
            if (this.queryResultCount <= this.queryMaxCount) {
              this.queryConsumeOrder(orderNo, callback)
            } else {
              callback(false)
            }
            console.error(err)
          })
        }, this.queryResultCount * 1000)
      },
      //点击订阅
      toSubscribe() {
        _this.clickOrder()
        //订阅消息添加
        this.buttonLoading = true
        // console.log('点击订阅')
        let _this = this
        this.$plugin.app.subscribe('consumption', {
          returnBack: res => {
            _this.clickOrder()
          }
        })

      },
      //点击去支付
      clickOrder() {
        console.log(11);
        //软件园渠道且认证通过
        // 暂时删除
        // if (this.companyStaffEntity.status === 1) {
        if (true) {
          console.log(22);
          if (!this.selectedCard || !this.selectedCard.cardId) {
            this.buttonLoading = false
            return uni.showToast({
              title: '没有选择能够使用的支付方式',
              icon: 'none'
            })
          } else if (this.selectedCard.cardId === 'WECHAT') {
            //选择微信的情况下
            this.doPay()
            return
          } else if (this.$store.state.enableMemberPassword !== 1) {
            //验证当前账户是否需要免密支付，只要不为1，就是免密支付
            this.doPay()
            return
          }
          this.$refs['check-password-pop'].open()
        } else {
          this.doPay()
        }
      },
      // 可用门店
      goToShopdetail() {


        let canUseMerchants = []
        if (this.fromPage == 'appointment') {
          canUseMerchants.push(this.merchantNo)
        } else {
          if (this.couponInfo) {
            if (this.couponInfo.canUseMerchants && this.couponInfo.canUseMerchants.length > 0) {
              for (var i = 0; i < this.couponInfo.canUseMerchants.length; i++) {
                canUseMerchants.push(this.couponInfo.canUseMerchants[i].merchantNo)
              }
            } else {
              canUseMerchants = []
            }
            console.log('canUseMerchants', this.couponInfo.canUseMerchants, canUseMerchants)
          }
        }
        uni.navigateTo({
          url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}&canUseMerchants=${canUseMerchants}`
        })

      },
      toRemark() {
        uni.navigateTo({
          url: `/pages/shop/remarks?remark=${this.textValue}`
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
    }
  };
</script>
<style lang="scss" scoped>
  .coupon-order {
    height: 100vh;
    overflow: hidden;
    position: relative;

    .coupon-info {
      overflow-y: auto;
      height: calc(100vh - 250rpx);
    }

    &-desc {
      &-info {
        display: flex;
        align-items: center;
        background: white;
        padding: 40rpx 20rpx 20rpx 20rpx;

        &-img {
          image {
            height: 120rpx;
            width: 120rpx;
            margin-right: 20rpx;
            border-radius: 10rpx;

          }
        }

        &-data {
          flex: 1;

          &_detail {
            font-size: 26rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
          }

          &_price {
            display: flex;
            justify-content: space-between;
            margin-right: 20rpx;
            align-items: center;
            margin-top: 20rpx;

            &_value {
              color: #E43838;
              font-size: 30rpx;
            }

          }
        }
      }

      &-shop {
        background: white;

        /deep/.u-cell__value {
          // word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 20rpx;
          font-size: 24rpx;
        }

        /deep/.u-cell_title {
          font-size: 30rpx;
        }
      }

      &-phone,
      &-name {
        display: flex;
        align-items: center;
        padding: 10rpx 30rpx;
        background: white;
        height: 88rpx;
        border-bottom: 1rpx solid #f7f7f7;

        &_label {
          width: 200rpx;
          font-size: 30rpx;
        }
      }

      &-remark {
        background: white;
        padding: 20rpx 30rpx;

        /deep/.u-input__textarea {
          padding: 20rpx;
          background: #F4F5F7;
        }
      }


      &-total {
        text-align: right;
        padding: 20rpx 30rpx;
        background: white;

        &_val {
          color: red;
          font-size: 34rpx;
        }
      }

    }

    &-discount {
      background: white;
      margin-top: 20rpx;
      // padding: 0 30rpx;
    }


    &-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 62px;
      background: white;
      padding: 0 30rpx;
      position: absolute;
      bottom: 0rpx;
      width: 100%;

      &-total {
        &_val {
          color: red;
          font-size: 36rpx;
        }
      }

      &-pay {
        // /deep/.u-btn--primary{
        //   border-color: #34A2E8;
        //    background-color: #34A2E8;
        // }
      }
    }
  }

  /*支付方式选择样式*/
  // .pay-type-list {
  //     margin-top: 20rpx;
  //     padding: 8px 28rpx;
  //     .type-item{
  //         height: 102rpx;
  //         display: flex;
  //         justify-content: space-between;
  //         align-items: center;
  //         font-size: 30rpx;
  //         radio {
  //             transform: scale(0.7, 0.7);
  //         }
  //     }
  //     image {
  //         width: 56rpx!important;
  //         height: 56rpx!important;
  //         margin-right: 24rpx!important;
  //     }
  //     .tit{
  //         font-size: 28rpx;
  //         color: #303133;
  //         display: flex;
  //         align-items: center;
  //         .cu-tag.z {
  //             border-radius: 20rpx 20rpx 20rpx 0;
  //             color: #FFFFFF;
  //             font-size: 22rpx;
  //             height: auto;
  //             margin-left: 32rpx;
  //         }
  //         .text-grey{
  //           color: #A9A9A9;
  //         }
  //     }
  //     .con{
  //         flex: 1;
  //         display: flex;
  //         flex-direction: column;
  //         font-size: 22rpx;
  //         color: #909399;
  //     }
  // }

  .marginButton {
    margin-bottom: 40rpx;
  }
</style>
