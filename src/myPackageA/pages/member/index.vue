<template>
  <view class="member">
    <!-- <cu-custom bgColor="bg-white" is-back :back-reload="backReload"> -->
    <cu-custom bgColor="bg-white" is-back>
      <block slot="backText" class="text-black">{{shopInfo.merchantName}}</block>
    </cu-custom>
    <view class="member-list">
      <!-- <view></view> -->
      <!-- 会员信息部分 -->
      <view class="member-head">
        <view class="member-head-top">
          <image class="member-info-face" src="../../../static/images/member/user.png" mode="widthFix">
            <view class="member-info-user">
              <view class="member-info-user-name">{{memberName||'用户21asd'}}</view>
              <view class="member-info-user-phone">132****2222</view>
              <!-- {{ $util.phoneDesensitization(memberPhone) || '待绑定手机号' }} -->
            </view>
            <view class="member-info-bg">
              <image @click="goScan" class="member-info-scan" src="../../../static/images/member/scan.png"
                mode="widthFix">
                <view class="member-info-detail">
                  <view class="member-detail-box" @click="goJump(1)">
                    <view>7.70</view>
                    <view class="member-detail-box-text">余额·充值</view>
                    <view class="left-line"></view>
                  </view>
                  <view class="member-detail-box" @click="goJump(2)">
                    <view>{{accountInfo.pointAmount || 0}}</view>
                    <view class="member-detail-box-text">积分</view>
                  </view>
                  <view class="member-detail-box" @click="goJump(3)">
                    <view>{{couponCount || 0}}</view>
                    <view class="member-detail-box-text">代金券</view>
                    <view class="right-line"></view>
                  </view>
                </view>
            </view>
        </view>
        <!-- <image class="member-cover-img" src="../../../static/images/member/member_white_bg.png" mode="widthFix"> -->
        <view class="member-head-bottom">
          <view class="block-part">
            <view class="yellow-block"></view>
          </view>
          <view class="member-head-bottom-block"></view>
          <view class="member-sort-title">我的订单</view>
          <view class="member-sort-box">
            <view class="member-sort-child" @click="goOrderList(0)">
              <image src="../../../static/images/member/icon_1.png" mode="widthFix">
                <view>待付款</view>
            </view>
            <view class="member-sort-child" @click="goOrderList(1)">
              <image src="../../../static/images/member/icon_2.png" mode="widthFix">
                <view>待收货</view>
            </view>
            <view class="member-sort-child" @click="goOrderList(2)">
              <image src="../../../static/images/member/icon_3.png" mode="widthFix">
                <view>退款</view>
            </view>
            <view class="member-sort-child" @click="goOrderList(3)">
              <image src="../../../static/images/member/icon_4.png" mode="widthFix">
                <view>全部</view>
            </view>
          </view>
        </view>
      </view>

      <view class="member-body">
        <view class="member-fun">
          <view class="member-fun-title">会员功能</view>
          <view class="member-fun-box" @click="goJump(4)">
            <view class="member-fun-detail">
              <image class="fun-img-left" src="../../../static/images/member/fun_1.png" mode="widthFix">
                <view>会员充值明细</view>
            </view>
            <image class="fun-img-right" src="../../../static/images/member/right_arrow.png" mode="widthFix">
          </view>
          <view class="member-fun-box" @click="goJump(5)">
            <view class="member-fun-detail">
              <image class="fun-img-left" src="../../../static/images/member/fun_2.png" mode="widthFix">
                <view>收货地址</view>
            </view>
            <image class="fun-img-right" src="../../../static/images/member/right_arrow.png" mode="widthFix">
          </view>
          <view class="member-fun-box" @click="callPhone">
            <view class="member-fun-detail">
              <image class="fun-img-left" src="../../../static/images/member/fun_3.png" mode="widthFix">
                <view>服务电话</view>
            </view>
            <image class="fun-img-right" src="../../../static/images/member/right_arrow.png" mode="widthFix">
          </view>
        </view>
      </view>
    </view>

    <!-- <member-scan v-if="showScan"></member-scan> -->

    <!-- 弹出层，未绑定手机 -->
    <u-popup v-model="showPopup" mode="center" closeable @close="closePopup" :border-radius='10'>
      <view class="popup-box">
        <view class="phone-box">
          <view class="phone-input">
            <input type="number" v-model="phone" placeholder="请输入手机号码" maxlength="11">
          </view>
          <view v-if="!counting" class="send-code" @click="sendCode">发送验证码</view>
          <view v-if="counting" class="send-code">{{countNum}}s</view>
        </view>
        <view class="code-box">
          <view class="code-word">验证码</view>
          <view class="code-input">
            <input type="number" v-model="code" placeholder="请输入验证码" maxlength="6">
          </view>
        </view>
        <button class="btn" @click="bindPhone">确认</button>
      </view>
    </u-popup>
  </view>
</template>

<script>
  export default {
    name: 'member',
    components: {},
    data() {
      return {
        showScan: false,
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        shopInfo: '',
        memberInfo: '',
        memberName: '',
        memberPhone: '',
        showPopup: false,
        phone: '',
        code: '',
        countNum: 10,
        countNumCopy: 10,
        timeControl: null,
        counting: false,
        accountInfo: {},
        balance: null,
        rightsCount: 0,
        couponCount: 0
      };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    onLoad(option) {
      if (option.shopInfo) {
        this.shopInfo = JSON.parse(option.shopInfo)
      }
    },
    onShow() {
      // this.getMemberAccount()
    },
    beforeDestroy() {},
    methods: {
     
    
      callPhone() {
        uni.makePhoneCall({
          phoneNumber: this.shopInfo.linkPhone
        })
      },
      goScan() {
        let shopInfo = JSON.stringify(this.shopInfo)
        this.$toView(`/myPackageA/pages/member/member-scan?shopInfo=${shopInfo}`, true, false, true)
      },
      addZero(balance) {
        if (balance != '') {
          return balance.toFixed(2)
        } else {
          return '--.--'
        }
      },
      goJump(num) {
        let shopInfo = {
					"merchantNo": "9ZLWBzob",
					"merchantName": "精彩电影",
					"id": "MD1413109041353330688",
					"linkPhone": "13599098689",
					"origin": null,
					"userId": "daefc160e23a4b35877f1826d4f99ac2"
				}
        console.log('shopInfo',shopInfo);
        shopInfo.memberId = this.memberInfo.memberId
        switch (num) {
          case 1:
            // this.$toView('user/user-wallet', true) // 跳转到钱包
            uni.navigateTo({
              url: `/myPackageA/pages/member/recharge?title=充值&shopInfo=${shopInfo}`
            })
            // this.$toView(`/myPackageA/pages/member/recharge?title=充值&shopInfo=${shopInfo}`, true, false, true) // 跳转到充值
            break;
          case 2:
            // 跳转到积分
            uni.navigateTo({
              url: `/myPackageA/pages/pointList/index?params=${JSON.stringify(this.account)}`
            })
            // this.$toView(`/myPackageA/pages/pointList/index?params=${JSON.stringify(this.account)}`, true, false, true)
            break;
          case 3:
            // 跳转到代金券
            // let accountId = this.accountInfo.accountId
            // console.log('代金券', accountId, shopInfo)
            // let shopInfo = JSON.stringify(this.shopInfo)
            uni.navigateTo({
              url: `/myPackageA/pages/userCoupon/user-coupon-all?shopInfo=${shopInfo}&fromMember=true`
            })
            // this.$toView(`/myPackageA/pages/userCoupon/user-coupon-all?shopInfo=${shopInfo}&fromMember=true`, true,
            //   false, true)
            break;
          case 4:
            // 跳转到会员充值明细
            // this.$toView(`/pages/user/user-wallet-record`,true, false, true)
            uni.navigateTo({
              url: `/myPackageA/pages/member/recharge-order?shopInfo=${shopInfo}`
            })
            // this.$toView(`/myPackageA/pages/member/recharge-order?shopInfo=${shopInfo}`, true, false, true)
            break;
          case 5:
            // 跳转到地址列表
            uni.navigateTo({
              url: `/pages/shop/user/user-address-list`
            })
            // this.$toView(`/pages/shop/user/user-address-list`, true, false, true)
            break;
          default:
        }
      },
      goOrderList(num) {
        let current = num
        let shopInfo = JSON.stringify(this.shopInfo)
        this.$toView(`/myPackageA/pages/order/user-order-list?current=${current}&shopInfo=${shopInfo}&fromMember=true`,
          true, false, true)
      }
    }
  };
</script>
<style lang="scss" scoped>
  .member {
    .member-list {
      .member-head {
        position: relative;
        height: 554rpx;
        width: 100%;

        .member-head-top {
          width: 100%;
          height: 450rpx;
          padding: 50rpx 32rpx 0;
          z-index: 99;
          position: relative;

          .member-info-face {
            position: absolute;
            z-index: 100;
            width: 146rpx;
            height: 146rpx;
            top: 5rpx;
            left: 82rpx;
          }

          .member-info-user {
            position: absolute;
            z-index: 100;
            width: 260rpx;
            height: 86rpx;
            top: 80rpx;
            left: 254rpx;

            .member-info-user-name {
              font-weight: bold;
              font-size: 30rpx;
              line-height: 42rpx;
              color: #A46112;
            }

            .member-info-user-phone {
              margin-top: 12rpx;
              font-weight: 400px;
              font-size: 24rpx;
              line-height: 34rpx;
              color: #C7883E;
            }
          }

          .member-info-bg {
            position: relative;
            height: 100%;
            background: linear-gradient(to right, rgba(245, 224, 190, 1) 0%, rgba(244, 205, 145, 1) 100%);
            box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.12);
            border-radius: 20rpx;
            // border-radius: 20rpx 20rpx 50% 50%; 
            margin: 0 auto;
            overflow: hidden;

            .member-info-scan {
              width: 46rpx;
              height: 46rpx;
              position: absolute;
              right: 60rpx;
              top: 50rpx;
            }

            .member-info-detail {
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-top: 152rpx;
              padding: 0 40rpx;
              box-sizing: border-box;

              .member-detail-box {
                width: 190rpx;
                color: #A46112;
                font-weight: 400px;
                font-size: 40rpx;
                text-align: center;
                position: relative;

                .left-line {
                  position: absolute;
                  height: 42rpx;
                  width: 2rpx;
                  top: 38rpx;
                  right: 0;
                  background-color: rgba(164, 97, 18, 0.44);
                  border-right: 2rpx solid rgba(164, 97, 18, 0.44);
                }

                .right-line {
                  position: absolute;
                  height: 42rpx;
                  width: 2rpx;
                  top: 38rpx;
                  left: 0;
                  background-color: rgba(164, 97, 18, 0.44);
                  border-right: 2rpx solid rgba(164, 97, 18, 0.44);
                }

                .member-detail-box-text {
                  font-size: 20rpx !important;
                  margin-top: -8rpx;
                }
              }
            }
          }
        }

        .member-cover-img {
          width: 100%;
          height: 268rpx;
          position: absolute;
          z-index: 100;
          left: 0;
          bottom: 0;
        }

        .member-head-bottom {
          width: 100%;
          height: 272rpx;
          position: absolute;
          z-index: 101;
          left: 0;
          bottom: 0;
          padding: 66rpx 58rpx 0;
          background: #fff;
          overflow: hidden;

          .block-part {
            border-radius: 0 0 50% 50%;
            width: 100%;
            height: 110rpx;
            left: 0;
            top: -64rpx;
            position: absolute;
            padding: 0 32rpx;
            box-sizing: border-box;
            overflow: hidden;
            background: #F5F5F5;

            .yellow-block {
              height: 100%;
              width: 100%;
              background: linear-gradient(to right, rgba(245, 224, 190, 1) 0%, rgba(244, 205, 145, 1) 100%);
              box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.12);
            }
          }

          .member-sort-title {
            color: #282828;
            font-weight: bold;
            font-size: 30rpx;
          }

          .member-sort-box {
            color: #282828;
            font-weight: bold;
            font-size: 30rpx;
            display: flex;
            justify-content: space-between;
            margin-top: 28rpx;

            .member-sort-child {
              width: 100rpx;
              height: 110rpx;
              text-align: center;
              color: #333333;
              font-weight: 400px;
              font-size: 26rpx;

              image {
                width: 68rpx;
                height: 68rpx;
              }
            }
          }
        }
      }

      .member-body {
        padding: 30rpx 20rpx;
        box-sizing: border-box;

        .member-fun {
          background: #fff;
          padding: 32rpx 41rpx;
          box-sizing: border-box;
          font-size: 30rpx;
          color: #282828;
          font-weight: 400px;

          .member-fun-title {
            font-weight: bold;
          }

          .member-fun-box {
            width: 100%;
            height: 100rpx;
            border-bottom: 2rpx solid #F5F5F5;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .member-fun-detail {
              display: flex;
              align-items: center;

              .fun-img-left {
                width: 37rpx;
                height: 37rpx;
                margin: 0 12rpx;
              }
            }

            .fun-img-right {
              width: 48rpx;
              height: 48rpx;
            }
          }
        }
      }
    }

    .popup-box {
      width: 646rpx;
      // height: 422rpx;
      background-color: #FFFFFF;
      padding: 62rpx 29rpx 54rpx;

      .phone-box {
        border-bottom: 2rpx solid #E4E4E4;
        height: 92rpx;
        display: flex;
        padding: 10rpx;
        box-sizing: border-box;

        .phone-input {
          width: 70%;
          border-right: 2rpx solid #E4E4E4;

          input {
            line-height: 72rpx;
            height: 100%;
            padding-left: 20rpx;
          }
        }

        .send-code {
          color: #5C7BFD;
          font-weight: 400px;
          font-size: 24rpx;
          width: 29%;
          line-height: 72rpx;
          text-align: center;
        }
      }

      .code-box {
        border-bottom: 2rpx solid #E4E4E4;
        height: 92rpx;
        display: flex;
        padding: 10rpx;
        box-sizing: border-box;

        .code-word {
          color: #343434;
          font-weight: 400px;
          font-size: 28rpx;
          width: 39%;
          line-height: 72rpx;
          margin-left: 20rpx;
        }

        .code-input {
          width: 60%;

          input {
            line-height: 72rpx;
            height: 100%;
          }
        }
      }

      .btn {
        width: 302rpx;
        height: 66rpx;
        line-height: 66rpx;
        border-radius: 66rpx;
        margin: 52rpx auto 0;
        background-color: #002FA7;
        color: #fff;
        font-size: 28rpx;
      }
    }
  }
</style>