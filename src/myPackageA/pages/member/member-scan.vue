<template>
  <view class="member-scan">
    <cu-custom bgColor="bg-white" is-back>
      <block slot="backText" class="text-black">会员码</block>
    </cu-custom>
    <view class="show-code-box">
      <view class="scan-box">
        <view class="barcode-box">
          请向服务员出示会员码
        </view>
        <view class="code-box">

          <view class="user-code-box">
            <view class="user-code-box-middle text-center">
              <!-- #ifdef H5 -->
             
              <view class="user-code-box-middle-barcode">
                <tki-barcode ref="barcode" onval :val="myPath" :load-make="true" :opations="barOpations" />
              </view>
              <view class="user-code-box-middle-code">2022033111245916513213</view>
              <view >
                <tki-qrcode ref="qrcode" onval icon="../../../static/logo.png" :val="myPath" :size="280" :icon-size="60"
                  :load-make="true" :show-loading="false" :using-components="false"></tki-qrcode>
              </view>
                <text class="user-code-box-middle-loading-text">
                 每分钟自动刷新，点击立即刷新
                </text>

              <!-- #endif -->
              <view class="user-code-box-middle-barcode">
                <tki-barcode ref="barcode" onval :val="code" :load-make="true" :opations="barOpations" />
              </view>
              <view class="user-code-box-middle-code">{{ $util.strIsNotEmpty(code) ? code : '　' }}</view>
              <!-- icon="/static/logo.png" -->
              <tki-qrcode ref="qrcode" onval :val="code" :size="280" :icon-size="60" :load-make="true"
                :show-loading="false" :using-components="false" />
              <view v-if="codeList.length > 0" class="user-code-box-middle-loading" @tap="genMemberPayCode(true)">
                <!-- <text class="cuIcon-text-theme" :style="[{color: themeColor}]" :class="{ 'roundImg': loading, 'zjIcon-refresh': !showSuccess, 'cuIcon-check': showSuccess }"></text> -->
                <text class="user-code-box-middle-loading-text">
                  <template v-if="loading">正在获取付款码，请稍候...</template>
                  <template v-else-if="showSuccess">已刷新</template>
                  <template v-else>每分钟自动刷新，点击立即刷新</template>
                  <!-- <template v-else>每<text class="text-theme" :style="[{color: themeColor}]">1分钟</text>自动刷新，点击立即刷新</template> -->
                </text>
              </view>
            </view>
            <view class="block-part"></view>]
          </view>
          <zj-popup ref="pay-list-pop" class="pay-list-pop" title="选择优先付款方式">

            <radio-group class="pay-type-list block">
              <block v-for="(cardItem, cardIndex) in cardList" :key="cardIndex">
                <label class="type-item" @tap="changeCardType(cardItem)">
                  <template v-if="cardItem.bindMedium == null">
                    <image :src="'/static/images/pay/4.png'" />
                    <view class="con">
                      <text>钱包(剩余 ¥{{ $util.toMoney(cardItem.balance / 100) }})</text>
                    </view>
                  </template>
                  <template v-else>
                    <image :src="`/static/images/bank/${cardItem.bankTp}.png`" />
                    <view class="con">
                      <text>{{ bank[cardItem.bankTp] }}({{ cardItem.bindMedium.substr(cardItem.bindMedium.length - 4) }})</text>
                    </view>
                  </template>
                  <view v-if="selectedCard.cardId == cardItem.cardId" class="text-xxl">
                    <text class="cuIcon-check text-blue"></text>
                  </view>
                  <radio v-show="false" :checked="selectedCard.cardId == cardItem.cardId" :value="cardItem.cardId" />
                </label>
              </block>
            </radio-group>
            <view class="pay-type-list block">
              <view class="type-item" @tap="$toView(`user/user-wallet-bankcard-add`)">
                <view style="font-size: 48rpx; padding-right: 24rpx;">
                  <text class="cuIcon-add"></text>
                </view>
                <view class="con">
                  <text>添加银行卡</text>
                </view>
                <view class="text-df">
                  <text class="cuIcon-right"></text>
                </view>
              </view>
            </view>
          </zj-popup>

          <!-- ====================================================== -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    queryAccBalance,
    queryAccBind
  } from '../../../api/paymentspmate'
  import {
    memberAccount,
    genMemberPayCode
  } from '../../../api/infomember'
  import {
    findOrderByByMemberPayCode
  } from '../../../api/infopay'

  export default {
    data() {
      return {
        myPath: 'http://localhost:8082/softwareparkweb/h5/#/myPackageA/pages/member/member-scan',
        myHost: '',
        codeHost: 'https://gitlab.51zcm.cc/fzsp/juhuimiao/raw/feature-store-yue/src',
        codePath: '',
        bank: this.$const.BANK,
        visible: {
          page: false
        },
        intervalSecond: 0,
        member: {},
        account: {},
        companyStaffEntity: {},
        loading: false,
        showSuccess: false,
        code: '',
        barOpations: {
          height: 180,
          displayValue: false
        },
        codeList: [],
        cardList: [],
        selectedCard: {
          balance: '0.00'
        },
        themeColor: '',
        genCodeTimer: '',
        searchOrdeTimer: '',
        screenBright: 0,
        shopInfo: ''
      }
    },
    onShow() {
      // 该API H5不支持 
      // uni.getScreenBrightness({
      //   success: res => {
      //     console.log('获取亮度')
      //     console.log(res.value)
      //     this.screenBright = res.value
      //   }
      // })
      // 将手机屏幕调制最亮
      // uni.setScreenBrightness({
      //   value: 1,
      //   success: () => {
      //     console.log('亮度设置成功')
      //   }
      // })
    },
    methods: {
      queryAccBalance() {
        return queryAccBalance({
          regionNo: this.$regionId,
          accountId: this.account.accountId
        })
      },
      queryAccBind() {
        return queryAccBind({
          regionNo: this.$regionId,
          accountId: this.account.accountId
        })
      },
      async memberAccount() {
        await memberAccount({
          subjectType: 1,
          accountType: 1,
          subjectId: this.shopInfo.id,
          appid: this.$appid,
          isOpen: 1
        }, {
          errorRedirect: !this.visible.page
        }).then(async res => {
          const obj = res.object
          this.member = obj.member || {}
          if (obj.account != null && obj.account.length > 0) {
            this.account = obj.account[0]
          } else {
            this.account = {}
          }
          this.companyStaffEntity = obj.companyStaffEntity || {}

          this.loadCode()
          this.visible.page = true
        })
      },
      async genMemberPayCode(hideLoading) {
        if (this.loading || this.showSuccess) {
          return
        }
        this.intervalSecond = 0
        this.loading = true
        await genMemberPayCode({
          // regionNo: this.$regionId,
          merchantId: this.shopInfo.id,
          vmcardId: this.selectedCard.cardId
        }, {
          hideLoading: hideLoading,
          errorRedirect: true
        }).then(res => {
          this.intervalSecond = 0
          const obj = res.object
          this.code = obj.payCode
          this.codeList.push(this.code)
          this.codeList = this.codeList.slice(-5)
          this.loading = false
          if (this.codeList.length > 1) {
            this.showSuccess = true
            setTimeout(() => {
              this.showSuccess = false
            }, 2000)
          }
        }).catch(err => {
          console.error(err)
          this.loading = false
          this.showSuccess = false
        })
      },
      async findOrderByByMemberPayCode() {
        if (this.codeList.length <= 0) {
          return
        }
        await findOrderByByMemberPayCode({
          regionNo: this.$regionId,
          payCode: this.codeList,
          extra: {
            isBankCard: this.selectedCard.balance ? 0 : 1
          }
        }, {
          hideLoading: true,
          hideMsg: true
        }).then(res => {
          const obj = res.object || {}
          const businessType = obj.businessType
          // const data = obj.data
          // 如果数据有返回data属性，判断status是否等于1或者3，如果是，则支付成功，否则，支付失败
          // 如果数据不包含data属性，则支付失败
          // 支付成功跳转成功页面，失败则提示支付失败并刷新页面
          // this.$toView(`user/user-code-success-pay?money=${1}&amount=${10}&payTypeName=支付&saler=卖家`, false, false)
          // clearInterval(this.genCodeTimer)
          // clearInterval(this.searchOrdeTimer)

          if (res.object && JSON.stringify(res.object) !== '{}') {
            if (res.object.paymentList) {
              if (obj.status === 1 || obj.status === 3) {
                if (obj.actualAmount != null) {
                  this.vibrate()
                  this.codeList = []
                  // 支付方式
                  let payType = ''
                  if (obj.extra && obj.extra.isBankCard) {
                    payType = obj.extra.isBankCard === 0 ? '钱包支付' : '银行卡支付'

                  } else {
                    payType = obj.paymentList[0].payTypeName
                  }
                  // 优惠金额
                  let discountMoney = parseFloat(obj.amount) - parseFloat(obj.actualAmount)
                  obj.paymentList.forEach(val => {
                    discountMoney = discountMoney + parseFloat(val.bankDiscount) || 0 + parseFloat(val
                      .vendorDiscount) || 0
                  })
                  // 订单金额
                  let acount = obj.amount

                  // 实付金额
                  let actualAmount = (parseFloat(obj.amount) - parseFloat(discountMoney)).toFixed(2)
                  // 支付成功的页面移到分包里
                  this.$toView(
                    `/myPackageA/pages/user/user-code-success-pay?money=${actualAmount}&discountMoney=${discountMoney.toFixed(2)}&payTypeName=${payType}&saler=${obj.saler.merchantName}&acount=${acount}`,
                    false, true, true)
                  // 支付成功，关闭计时器
                  clearInterval(this.genCodeTimer)
                  clearInterval(this.searchOrdeTimer)
                }
              } else if (obj.status !== 0 && obj.status !== 1 && obj.status !== 3) {
                uni.showToast({
                  icon: 'error',
                  title: '支付失败'
                })
                this.codeList.pop()
                this.genMemberPayCode(false)
              }
            } else {
              uni.showToast({
                icon: 'error',
                title: '支付失败'
              })
              this.codeList.pop()
              this.genMemberPayCode(false)
            }
          }
        })
      },
      vibrate() {
        // #ifndef H5
        uni.vibrateLong({
          success: () => {}
        })
        // #endif
      },
      intervalGenCode() {
        this.genCodeTimer = setInterval(() => {
          if (this.intervalSecond >= 60) {
            this.intervalSecond = 0
            this.genMemberPayCode(true)
          } else {
            this.intervalSecond++
          }
        }, 1000)
        this.$once('hook:beforeDestroy', () => {
          this.intervalSecond = 0
          clearInterval(this.genCodeTimer)
        })
      },
      intervalSearchOrder() {
        this.searchOrdeTimer = setInterval(() => {
          this.findOrderByByMemberPayCode()
        }, 5000)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(this.searchOrdeTimer)
        })
      },
      toChangePayType() {
        this.$refs['pay-list-pop'].open()
      },
      changeCardType(card) {
        this.selectedCard = card
        this.$refs['pay-list-pop'].close()
        this.showSuccess = false
        this.genMemberPayCode(false)
      },
      async loadCode() {
        await this.genMemberPayCode(true)
        await this.intervalGenCode()
        await this.intervalSearchOrder()
      }
    },
    async onLoad(option) {
      if (option.shopInfo) {
        this.shopInfo = JSON.parse(option.shopInfo)
      }
      await this.$onLaunched
      await this.memberAccount()
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
    },
    onReady() {
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000'
      })
    },
    beforeDestroy() {
      // 将手机屏幕调回原来的亮度
      uni.setScreenBrightness({
        value: this.screenBright,
        success: () => {
          console.log('调回原来的亮度成功')
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .member-scan {
    .show-code-box {
      padding: 64rpx 36rpx 0;
      box-sizing: border-box;

      .scan-box {
        border-radius: 27rpx;
        background-color: #FFFFFF;
        box-shadow: 0rpx 4rpx 7rpx 4rpx rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .barcode-box {
          height: 135rpx;
          line-height: 135rpx;
          background: linear-gradient(-75.93deg, rgba(234, 197, 137, 1) 0%, rgba(234, 208, 167, 1) 100%);
          color: #FFFFFF;
          font-weight: 400px;
          font-size: 36rpx;
          text-align: center;
        }

        .code-box {
          background-color: #FFFFFF;
        }

        .user-code-box {
          .user-code-box-middle {
            padding: 64rpx 40rpx;
            box-sizing: border-box;

            .user-code-box-middle-barcode {
              height: 164rpx;
              overflow: hidden;
            }

            .user-code-box-middle-code {
              color: #000000;
              font-weight: bold;
              font-size: 36rpx;
              margin: 24rpx auto 64rpx;
            }

            .user-code-box-middle-loading {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 40rpx;

              .cuIcon-text-theme {
                font-size: 36rpx;
              }

              .user-code-box-middle-loading-text {
                font-size: 24rpx;
              }
            }
          }

          .block-part {
            border-top: 2rpx solid #EDEDED;
            height: 105rpx;
          }
        }

        .user-code-box-type {
          display: flex;
          flex: 1;
        }
      }
    }
  }
</style>