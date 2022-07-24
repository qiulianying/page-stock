<template>
  <view style="overflow: hidden;">
    <cu-custom bgColor="bg-white" is-back v-if="!isShare">
      <block slot="backText" class="text-black">商品详情</block>
    </cu-custom>
    <!-- 分享的页面，显示返回首页的按钮 -->
    <topback-btn v-else :url="`/pages/index/index`" bgColor="bg-blue" :isBlue="true" :isShare="isShare">
      <block slot="backText" class="text-white text-ellipsis"></block>
    </topback-btn>
  
    <view style="position: relative; height: 100%; overflow-y: hidden;">
      <view class="coupon">
        <!-- #ifdef MP-WEIXIN -->
        <!-- <view class="coupon-text" v-if="!webviewHide">
                  <button open-type="share" class="coupon-text-btn">推荐给好友<u-icon name="share" style="margin-left: 20rpx"/></button>
              </view> -->
        <!-- #endif -->
        <view class="coupon-info item-bg">
          <!-- 基本信息 -->
          <view class="coupon-info-pro">
            <!-- 图片 -->
            <view class="coupon-info-pro-img">
              <image :src="pic ? `${spMatefileBaseURL}${pic}${fixStr}` : '../../static/logo.png'" />

            </view>
            <view class="coupon-info-pro-data">
              <view class="coupon-info-pro-data_detail">
                {{couponInfo.name}}
              </view>
              <view class="coupon-info-pro-data_price">
                <view class="coupon-info-pro-data_price_value">
                  ￥{{couponInfo.realPrice || 0}}元
                  <text style="text-decoration: line-through; color: black; margin-left: 10rpx"
                    v-if="couponInfo.value">￥{{couponInfo.value}}元</text>
                </view>
                <view class="coupon-info-pro-data_price_label" v-if="couponInfo.value && couponInfo.discountCondition">
                  消费满{{couponInfo.discountCondition || 0}}元减{{couponInfo.value || 0}}元
                </view>
              </view>
            </view>
          </view>
          <view class="coupon-info-desc">
            <span v-if="anyTimeRefund">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="支持随时退" label-size="24">
              </u-icon>
            </span>

            <span v-if="overdueRefund">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="支持过期退" label-size="24">
              </u-icon>
            </span>
            <span v-if="autoRefund">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="支持自动退" label-size="24">
              </u-icon>
            </span>
            <span v-if="!autoRefund && !overdueRefund && !anyTimeRefund">
              <u-icon name="close-circle" color="#F05353" size="28" margin-left="15" label="不支持退款" label-size="24">
              </u-icon>
            </span>

          </view>
        </view>
        <view class="coupon-num item-bg gapItem">
          <view class="coupon-num-text">
            <view style="display: flex"><text>数量</text>
              <view v-if="buyLimit && buyLimit !== 99999 && buyType === 1"
                style="margin-left: 20rpx; font-size: 26rpx;">
                限{{couponInfo.realPrice && couponInfo.realPrice > 0 ? '购' : '领取'}} <text
                  style="color: red; padding: 0 15rpx; fonnt-weight: bold;">{{buyLimit}}</text> 件
              </view>
              <view v-if="buyLimit && buyLimit !== 99999 && buyType === 0"
                style="margin-left: 20rpx; font-size: 26rpx;">
                最少{{couponInfo.realPrice && couponInfo.realPrice > 0 ? '购买' : '领取'}} <text
                  style="color: red; padding: 0 15rpx; fonnt-weight: bold;">{{buyLimit}}</text> 件
              </view>
              <view v-if="buyLimit && buyLimit === 99999" style="margin-left: 20rpx; font-size: 26rpx;">不限量</view>
            </view>
            <!-- <zj-number-box :value="item.number" :rowData="item" color="#34A2E8" :content="delContent"
                        :productId="item.id" @delProduct="delProduct" @change="changeNum"
                        style="position: absolute; right: 40rpx;top:15rpx;font-weight:500"></zj-number-box> -->
            <u-number-box v-model="numValue" color="#fff" :bg-color="themeColor" :min="minNum" :disabled-input="true"
              :max="maxNum"></u-number-box>
          </view>
        </view>
        <view class="coupon-cinema item-bg gapItem">

          <u-cell-group>
            <u-cell-item title="适用店铺" :title-style="titleStyle" :arrow="true" arrow-direction="right"
              @click="goToShopdetail(couponInfo.supportNum)"
              :value="couponInfo.supportNum ? `${couponInfo.supportNum}家店铺` : '适用于全部店铺'">
            </u-cell-item>
          </u-cell-group>
          <view v-if="couponInfo.supportNum" class="coupon-cinema-item">
            <u-cell-group style="width:85%;" :border="false">
              <u-cell-item :title="shopDetail[0].merchantName" :arrow="true" :title-style="addrStyle"
                :border-bottom="false" :value-style="arrowStyle" @tap="openLocation()">
              </u-cell-item>
            </u-cell-group>
            <button>离我最近</button>
            <view class="icon-box" @tap="callPhone(shopDetail[0].linkPhone)">
              <u-icon name="phone-fill" :color="themeColor" size="28"></u-icon>
            </view>
          </view>
          <view class="coupon-cinema-address" v-if="couponInfo.supportNum">
            {{shopDetail[0].address}} |
            {{parseFloat(shopDetail[0].disance).toFixed(2)}}km</view>

        </view>
        <view class="transation gapItem" v-if="couponInfo.transactionQueryType">
          <view class="transation-title">
            使用场景
          </view>
          <view class="transation-data">
            <view v-if="couponInfo.transactionQueryTypes.indexOf('1') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="直接买单" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.transactionQueryTypes.indexOf('2') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="扫码点单" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.transactionQueryTypes.indexOf('3') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="外卖/商城" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.transactionQueryTypes.indexOf('16') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="收银台" label-size="24">
              </u-icon>
            </view>
          </view>
        </view>
        <view class="transation gapItem">
          <view class="transation-title">
            活动时间
          </view>
          <view class="transation-data">
            <span v-if="couponInfo.activityBeginTime && couponInfo.activityEndTime">
              {{couponInfo.activityBeginTime}} 至 {{couponInfo.activityEndTime}}
            </span>
            <span v-else>不限制</span>
          </view>
        </view>
        <view class="transation gapItem" v-if="couponInfo.payType">
          <view class="transation-title">
            支持支付方式
          </view>
          <view class="transation-data">
            <view v-if="couponInfo.payTypes.indexOf('1') > -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="微信" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.payTypes.indexOf('2') > -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="支付宝" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.payTypes.indexOf('11') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="银联" label-size="24">
              </u-icon>
            </view>
            <view v-if="couponInfo.payTypes.indexOf('12') !== -1" class="transation-data-type">
              <u-icon name="checkmark-circle" color="#09c14a" size="28" margin-left="15" label="钱包" label-size="24">
              </u-icon>
            </view>
          </view>
        </view>
        <view class="coupon-notice item-bg gapItem">
          <view style="font-size: 30rpx;">购买须知</view>
          <view v-if="couponInfo.availableType">有效期</view>
          <view v-if="couponInfo.availableType === 1">{{couponInfo.availableBeginTime}} 至
            {{couponInfo.availableEndTime}}</view>
          <view v-if="couponInfo.availableType === 2">{{dateAvailable(couponInfo.availableRelative)}}</view>
          <view v-if="couponInfo.availableType === 0">永久有效</view>
          <view v-if="couponInfo.instructions">使用须知</view>
          <view v-html="formatRichText(couponInfo.instructions)"></view>
        </view>
        <view class="coupon-notice item-bg gapItem" v-if="couponInfo.description">
          <view style="font-size: 30rpx;">商品详情</view>
          <view style="margin-top: 20rpx" v-html="formatRichText(couponInfo.description)"></view>

        </view>
      </view>

      <view class="goods-detail-bottom" style="justify-content: center;">
        
        <view class="btn-box">
          <button v-if="couponInfo.realPrice > 0" class="cu-btn btn-pay" @click="toGetWeChatPay">立即抢购</button>
          <button v-else class="cu-btn btn-pay" @click="toGetCoupon">领取</button>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
  import {
    getRightPrice,
  } from '../../api/rightsmarketing'
  import {
    memberAccount
  } from '../../api/infomember'

  export default {
 
    data() {
      return {
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        couponInfo: {
          name: '',
          supportNum: 0, //支持的门店数
          saleNum: 0, //已售份数
          goodsPrice: '0.00',
          originPrice: '0.00',
          pics: [],
          remainStore: 0,
          realPrice: '0.00',
          instructions: ''
        },
        couponNotice: '',
        item: {
          number: 1
        },
        titleStyle: {
          color: '#333333',
          fontWeight: '600',
          fontSize: '30rpx'
        },
        addrStyle: {
          color: '#333333',
        },
        arrowStyle: {
          position: 'absolute',
          left: '0',
          color: '#333'
        },
        numValue: 1,
        isCollection: false,
        goodsId: '',
        fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
        shopDetail: [], //门店详情
        pic: null,
        urlPics: [],
        regionNo: '',
        buyLimit: null,
        availableType: null,
        availDate: {
          startDate: '',
          endDate: '',
        },
        availDay: null,
        location: {
          latitude: null,
          longitude: null
        },
        webviewHide: false,
        buyType: -1,
        minNum: 1,
        maxNum: 99999,
        selectedAccount: {},
        // isDiscount: false,
        isShare: false,
        merchantNo: '',
        overdueRefund: false,
        anyTimeRefund: false,
        autoRefund: false
      }
    },
    onShareAppMessage(res) { //发送给朋友
      return {
        title: this.couponInfo.name,
        path: `/myPackageA/pages/coupon/coupon-detail?goodsId=${this.goodsId}&lon=${this.location.longitude}&lat=${this.location.latitude}&isShare=1`,
      }
    },
    watch: {
      numValue: {
        handler(val) {
          if (this.buyType === 1) {
            if (val === this.buyLimit) {
              this.$refs.uToast.show({
                title: '数量达到限购数量，不可以增加了！',
                type: 'warning'
              })
            }
          } else if (this.buyType === 0) {
            if (val === this.buyLimit) {
              this.$refs.uToast.show({
                title: `至少购买${this.buyLimit}件商品！`,
                type: 'warning'
              })
            }
          }

        }
      },
      deep: true,
      immediate: true
    },
    onLoad(option) {
      this.goodsId = option.couponId
      // this.goodsId = option.goodsId
      this.location.latitude = option.lat
      this.location.longitude = option.lon
      if (option.lat == undefined || option.lat == '' || option.lat == null) {
        // this.getLocation()
      }
      // this.isDiscount = option.isDiscount || false
      this.isShare = option.isShare || false
      // 请求代金券数据
      this.merchantNo = "oZKYnvrg"

      this.couponInfo = {
        availableRelative: 30,
        availableType: 2,
        canUseMerchants: [{
          address: "软件园A区",
          disance: 1.044613179839424,
          found: false,
          id: "MD1504289920506793984",
          index: "info-merchant",
          linkPhone: "18370892238",
          logo: "service-org-7adc24dc/20220317/110a5cc4c23e4bcbb50b12f949e04c2d.jpeg",
          merchantName: "聚会喵食堂门店",
          merchantNo: "oZKYnvrg",
          primaryTerm: 0,
          seqNo: 0,
          sort: [1.044613179839424, 1648578038000],
          type: "info-merchant",
          version: 0,
        }],
        categoryRightsId: "1",
        createTime: 1648205570000,
        creator: "e955ac6167bf4237842330eb23bd0dc7",
        discountCondition: 1.01,
        goodsPrice: 0,
        id: "44fa34e4657c4c769202e53981c502aa",
        instructions: "",
        isOpenStore: 1,
        isRefund: 0,
        merchantNo: "sCKrHdUB",
        name: "代金券202203",
        payType: "1,2,11,12",
        payTypes: ["1", "2", "11", "12"],
        pics: "",
        realPrice: 0,
        regionNo: "DL1306153654495223808",
        regionPath: "9999_DL1306153654495223808",
        remainStore: 9985,
        saleNum: 15,
        status: 1,
        supportNum: 1,
        tags: [],
        transactionQueryType: "1,2,3,16",
        transactionQueryTypes: ["1", "2", "3", "16"],
        updateTime: 1648608740000,
        value: 1,
      }
      this.couponInfo.supportNum = 1
      this.refundType(this.couponInfo.refundType || 0)
      this.urlPics = []
      // 店铺数据
      this.shopDetail = this.couponInfo.canUseMerchants || []
      // 轮播图数据
      if (this.couponInfo && this.couponInfo.pics) {
        this.couponInfo.pics.forEach(val => {
          let pic = `${this.spMatefileBaseURL}${val}`
          this.urlPics.push(pic)
        })
      } else if (this.couponInfo && this.couponInfo.pic) {
        let pic = `${this.spMatefileBaseURL}${this.couponInfo.pic}`
        this.urlPics.push(pic)
      }
      // 商品logo
      this.pic = this.couponInfo.pic

      // 有效期数据
      this.availableType = this.couponInfo.availableType
      if (this.availableType === 1) {
        this.availDate = {
          startDate: this.couponInfo.availableBeginTime,
          endDate: this.couponInfo.availableEndTime
        }
      } else if (this.availableType === 2) {
        this.availDay = this.couponInfo.availableRelative
      }
      this.regionNo = this.couponInfo.regionNo

      this.buyType = this.couponInfo.buyType
      // 购买限制
      if (this.couponInfo.buyLimit !== 0) {
        this.buyLimit = this.couponInfo.buyLimit ? this.couponInfo.buyLimit : 99999
      } else {
        this.buyLimit = 0
      }
      if (this.buyType === 0) {
        this.minNum = this.buyLimit
      } else if (this.buyType === 1) {
        this.maxNum = this.buyLimit
      }
      //购买须知
      this.couponInfo.instructions = this.couponInfo.instructions ? this.couponInfo.instructions : ''

      //商品详情
      this.couponNotice = this.couponInfo.description

    },
    mounted() {
      // #ifdef APP-PLUS
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener('hide', () => {
        this.webviewHide = true
      })
      currentWebview.addEventListener('show', () => {
        this.webviewHide = false
      })
      // #endif


      // 判断是是否收藏
      // checkCollection(
      //   {
      //     collectId: this.goodsId
      //   }
      // ).then(res => {
      //   if(res.object.isCollect === 1){
      //     this.isCollection = true
      //   }else{
      //     this.isCollection = false
      //   }
      // })
    },
    methods: {
      getLocation() {
        this.$plugin.app.getLocation({
          success: res => {
            this.location = res
          },
          fail: err => {}
        })
      },
      //跳转对应的抢购页面
      toGetWeChatPay() {
        if (!this.$isMemmber()) {
          uni.navigateTo({
            url: `/pages/login/login?fromurl=${encodeURIComponent(`/myPackageA/pages/coupon/coupon-detail`)}&goodsId=${this.goodsId}&lon=${this.location.longitude}&lat=${this.location.latitude}`
          })

        } else {
          let params = {
            reqTs: new Date().getTime(), //请求时间戳 必填
            goodsInfos: [{
              id: this.goodsId, //商品id
              count: this.numValue, //购买数量必填
              type: 1, //权益商品为1
              name: this.couponInfo.name //商品名称
            }],
            bizType: "rights", //类型为权益商品订单
            regionNo: this.$regionId, //机构号
            merchantNo: this.merchantNo
          }
          if (JSON.stringify(this.selectedAccount) === '{}') {
            console.log('空的')
            memberAccount({
              accountType: 1,
              appid: this.$appid,
              isOpen: 1,
              subjectType: 5, //软件园项目固定是5机构会员
              subjectId: this.$regionId,
            }, {
              hideLoading: true,
              hideMsg: true
            }).then(res => {
              const obj = res.object
              if (obj.account != null && obj.account.length > 0) {
                this.accountList = obj.account
                if (this.accountList.length > 0) {
                  this.selectedAccount = this.accountList[0]
                }
              }
              let account = {
                accountId: this.selectedAccount.accountId || '',
                subjectType: this.selectedAccount.subjectType || ''
              }
              params.account = account
              // 调用计价接口，判断能不能结算
              getRightPrice(
                params, {
                  hideLoading: false,
                  hideMsg: false
                }).then(res => {
                if (res.errcode === '0') {
                  uni.navigateTo({
                    url: `/myPackageA/pages/coupon/coupon-order?goodsId=${this.goodsId}&numValue=${this.numValue}&lon=${this.location.longitude}&lat=${this.location.latitude}&merchantNo=${this.merchantNo}`
                  })
                }
              })
            })
          } else {
            let account = {
              accountId: this.selectedAccount.accountId || '',
              subjectType: this.selectedAccount.subjectType || ''
            }
            params.account = account
            // 调用计价接口，判断能不能结算
            getRightPrice(params).then(res => {
              if (res.errcode === '0') {
                uni.navigateTo({
                  url: `/myPackageA/pages/coupon/coupon-order?goodsId=${this.goodsId}&numValue=${this.numValue}&lon=${this.location.longitude}&lat=${this.location.latitude}&merchantNo=${this.merchantNo}`
                })
              }
            })
          }
        }
      },
      // delCollection(){
      //   let params = {
      //     collectId: this.goodsId,
      //     type: 3
      //   }
      //   if(!this.isCollection){
      //     addCollection(params).then(res => {
      //       if(res.errcode === '0'){
      //           this.isCollection = !this.isCollection
      //       }
      //     })
      //   }else{
      //     delCollection(params).then(res => {
      //       if(res.errcode === '0'){
      //           this.isCollection = !this.isCollection
      //       }
      //     })
      //   }
      // },
      // 可用门店
      goToShopdetail(num) {
        // if (this.couponInfo.supportNum && num !== 0) {
        //   uni.navigateTo({
        //     url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`
        //   })
        // }
        this.toShopDetail(num)
        return
        let _this = this
        // 点击可用门店的时候查询对应定位信息
        this.$plugin.app.getLocation({
          success: res => {
            console.log('获取经纬度', res)
            _this.location = res
            _this.toShopDetail(num)
          },
          fail: err => {
            _this.toShopDetail(num)
          }
        })
      },
      // 进入可用门店
      toShopDetail() {
        let canUseMerchants = []
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
        uni.navigateTo({
          url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}&canUseMerchants=${canUseMerchants}`
        })
      },
      // 领取优惠券
      toGetCoupon() {
            uni.showToast({
              title: '领取成功',
              duration: 3000,
              icon: 'success'
            })
            // uni.navigateTo({
            //   url: '/myPackageA/pages/userCoupon/user-coupon-all'
            // })
      },
      async memberInfo() {
        await memberAccount({
          accountType: 1,
          appid: this.$appid,
          isOpen: 1,
          subjectType: 5, //软件园项目固定是5机构会员
          subjectId: this.$regionId,
        }, {
          hideLoading: true,
          hideMsg: true
        }).then(res => {
          this.selectedAccount = res.object.account[0] && res.object.account.length > 0 ? res.object.account[0] :
          {}
        })
      },
      // 导航
      openLocation() {
        return
        let latitude = parseFloat(this.location.latitude)
        let longitude = parseFloat(this.location.longitude)
        // 注意openLocation的经纬度需要时浮点型
        this.$plugin.app.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: this.shopDetail[0].merchantName,
          address: this.shopDetail[0].address
        })
      },
      // 打电话
      callPhone(phone) {
        uni.makePhoneCall({
          phoneNumber: phone
        })
      },
      // 格式化时间
      dateFormat(time) {
        let date = new Date(time)
        let y = date.getFullYear()
        let m = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        return `${y}-${m}-${d}`
        // return `${y}-${m}-${d} ${h}:${mm}:${ss}`
      },
      /**
       * 控制小程序中图片大小
       */
      formatRichText(html) {
        if (html) {
          return html.replace(/\<img/gi, '<img style="width: 100%"; height: 370rpx')
        }
      },
      // 计算有效期
      dateAvailable(available) {
        let start = this.dateFormat(new Date().getTime())
        let end = this.dateFormat(new Date().getTime() + (parseInt(available) * 24 * 3600 * 1000))
        return start + ' 至 ' + end
      },
      // 判断退款类型
      refundType(type) {
        // 转换成二进制
        // 111 过期退款&随时退款&自动退款   11  过期退款&随时退款  1 过期退款   0 不支持退款  101 过期退款&自动退款 。。。。。。
        let num = type.toString(2)
        // 往前面补0，保持三位数
        let data = (Array(3).join(0) + num).slice(-3)
        // 判断退款类型
        this.overdueRefund = data[0] === '0' ? false : true
        this.anyTimeRefund = data[1] === '0' ? false : true
        this.autoRefund = data[2] === '0' ? false : true


      }
    }
  }
</script>
<style>
  page {
    background-color: #f4f5f7;
  }
</style>
<style lang="scss" scoped>
  .coupon {
    // height: calc(100% - 143rpx);
    height: 100%;
    padding-bottom: 150rpx;
    overflow-y: auto;
    // padding-bottom: 80rpx;
    position: relative;

    &-text {
      margin-right: 30rpx;
      margin-top: 20rpx;
      position: absolute;
      right: 3px;
      background: black;
      opacity: 0.5;
      height: 50rpx;
      line-height: 50rpx;
      color: white;
      padding: 0 36rpx;
      border-radius: 50rpx;
      font-size: 26rpx;
      z-index: 99999999;

      &-btn {
        background: black;
        opacity: 0.5;
        height: 50rpx;
        line-height: 50rpx;
        color: white;
        font-size: 24rpx;
      }

      .mySwripter {
        width: 100vw;
        height: 50vw;
        margin-left: 2.5%;
        position: absolute;
        margin-top: 30rpx;

        .index-home-swiper {
          width: 100%;
          height: 50vw;

          &-item {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            &-img {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              width: 100%;
            }
          }
        }
      }
    }
  }

  .coupon-image {
    width: 100%;
    height: 370rpx;
    // border: 2px solid red;
  }

  .item-bg {
    // background-color: #fff;
    margin-bottom: 15rpx;
    height: auto;
  }

  .coupon-info {
    // padding: 20rpx 0 20rpx 30rpx;
    margin: 20rpx 30rpx;

    &-pro {
      display: flex;
      align-items: center;
      background: white;
      padding: 20rpx;
      border-radius: 10rpx;

      &-img {
        height: 120rpx;
        width: 120rpx;
        margin-right: 20rpx;

        image {
          height: 120rpx;
          width: 120rpx;
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

          &_label {
            // border: 2rpx solid #f97b42;
            padding: 8rpx 10rpx;
            border-radius: 40rpx;
            color: #f97b42;
            font-size: 24rpx;
            background: rgba($color: #f97b42, $alpha: 0.3);
          }

        }
      }
    }

    &-goodprice {
      &_price {
        color: #E43838;
        font-size: 36rpx;
        font-weight: bold;
      }

      &_originprice {
        display: flex;
        justify-content: space-between;
        margin-right: 30rpx;
        align-content: center;
        font-size: 26rpx;

        &_data {
          color: #9F9F9F;
          text-decoration: line-through;
          font-size: 24rpx;
        }

        &_remain {
          font-size: 24rpx;
          color: #9F9F9F;

          &_data {
            font-size: 24rpx;
            color: #FFB025;
          }
        }
      }
    }

    &-title {
      font-size: 40rpx;
      font-weight: 600;
      padding-right: 20rpx;
      margin-bottom: 10rpx;
    }

    &-supportNum {
      font-size: 26rpx;
      color: #666666;
      margin-bottom: 15rpx;
    }

    &-desc {
      font-size: 22rpx;
      color: #666666;
      margin-bottom: 10rpx;
      background: white;
      border-radius: 10rpx;
      padding: 20rpx;
      border-top: 2rpx dashed #b3a8a8;

      // margin-right: 30rpx;
      span:nth-child(2) {
        margin-left: 30rpx;
      }

      span:nth-child(3) {
        margin-left: 30rpx;
      }

      text {
        margin-right: 50rpx;
      }
    }
  }

  .coupon-num {
    font-size: 36rpx;
    font-weight: 600;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
    background-color: white;

    &-text {
      font-weight: 600;
      font-size: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      /deep/.u-icon-minus {
        width: 48rpx !important;
        height: 48rpx !important;
        border-radius: 50rpx !important;
        // border: 1rpx solid #34A2E8;
        // color: #39AEF7 !important;
      }

      /deep/.u-icon-plus {
        width: 50rpx !important;
        height: 50rpx !important;
        border-radius: 50rpx !important;
        // background-color: #34A2E8 !important;
        // color: #fff !important;
      }

      /deep/.u-number-input {
        background: none !important;
        color: #222222 !important;
      }
    }
  }

  .coupon-cinema {
    position: relative;
    background-color: white;

    // .icon {
    //   width: 680rpx;
    //   height: 50rpx;
    //   z-index: -9;
    //   padding-right: 30rpx;
    // }

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 32rpx;
      position: relative;

      /deep/.u-cell {
        width: 90%;
      }

      /deep/.u-cell_title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .icon-box {
        width: 10%;
        height: 100%;
        text-align: right;
      }
    }



    button {
      position: absolute;
      right: 140rpx;
      top: 50%;
      margin-top: -20rpx;
      width: 100rpx;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 20rpx;
      color: orange;
      background-color: transparent;
      border: 2rpx solid orange;
    }

    &-address {
      font-size: 24rpx;
      color: #727272;
      margin-left: 30rpx;
      margin-top: -7rpx;
      padding-bottom: 20rpx;
    }
  }

  .transation {
    padding: 30rpx;
    background-color: white;
    margin-bottom: 15rpx;

    &-title {
      font-size: 30rpx;
      font-weight: 600;

    }

    &-data {
      display: flex;

      &-type {
        margin-right: 24rpx;
      }
    }
  }

  .coupon-notice {
    padding: 30rpx;
    background-color: white;

    view:nth-child(1) {
      font-size: 36rpx;
      font-weight: 600;
    }

    view:nth-child(2),
    view:nth-child(4) {
      font-size: 26rpx;
      color: #a9a9a9;
    }

    view:nth-child(3) {
      font-size: 22rpx;
      color: #4a4a4a;
      margin-bottom: 15rpx;
    }

    view:nth-child(n+5) {
      font-size: 28rpx;
    }
  }

  .goods-detail-bottom {
    // position: absolute;
    display: flex;
    bottom: 0;
    background: #FFFFFF;
    border-top: 1rpx solid #F5F5F5;
    // height: 266rpx;
    width: 100vw;
    // line-height: 120rpx;
    justify-content: space-between;
    padding: 0 30rpx;
    // height: 246rpx;
    // line-height: 80px;
    align-items: center;
    // height: 110rpx;
    height: 140rpx;
    position: fixed;

    &-like {
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;
      padding-left: 30rpx;

      &_icon {
        width: 50rpx;
        height: 50rpx;
      }

      &_text {
        // margin-top: 15rpx;
      }
    }

    .color-blue {
      // margin-top: 15rpx;
      color: #34A2E8;
    }

    .btn-box {
      button {
        // right: 30rpx;
        width: 300rpx;
        height: 78rpx;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #FFFFFF;
      }

      .btn-pay {
        background: linear-gradient(to right, #f97b42, #f35610);
        box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
      }
    }
  }

  .gapItem {
    width: 92%;
    margin: 15rpx auto;
  }
</style>