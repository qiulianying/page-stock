<template>
  <view style="height: 100%; overflow: hidden;">
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
        <view class="coupon-text" v-if="!webviewHide">
          <button open-type="share" class="coupon-text-btn">推荐给好友
            <u-icon name="share" style="margin-left: 20rpx" /></button>
        </view>
        <!-- #endif -->
        <!-- 轮播图 -->
        <!-- <u-swiper :list="urlPics" :height="440"></u-swiper> -->
        <view class="mySwripter">
          <swiper style="height: 50vw;" v-if="urlPics != null && urlPics.length > 0" class="index-home-swiper" autoplay
            indicator-dots indicator-active-color='#ffffff'>
            <swiper-item style="height:50vw" v-for="(item, index) in urlPics" :key="index"
              class="index-home-swiper-item">
              <image :src="item" class="index-home-swiper-item-img" style="height:50vw;width: 100vw;"
                mode="aspectFill" />
            </swiper-item>
          </swiper>
          <image v-else src="../../../static/images/pic_goods_default.png" style="height:50vw;width: 100vw;"
            mode="aspectFill"></image>
        </view>
        <view class="coupon-info item-bg">
          <view class="coupon-info-title">{{couponInfo.name}}</view>
          <view class="goods-tags" v-if="couponInfo.tags && couponInfo.tags.length>0">
            <view class="goods-tags-box" :style="{color: themeColor, background: themeColorRGB}"
              v-for="(item,index) in couponInfo.tags" :key="index">
              {{item}}
            </view>
          </view>
          <view class="coupon-info-goodprice">
            <view class="coupon-info-goodprice_price">
              ￥{{couponInfo.realPrice||'1.00'}}<text class="coupon-info-goodprice_price_text"
                v-if="couponInfo.chargeMode && couponInfo.chargeMode == 2">/小时</text>
              <text class="goods-old-price"
                v-if="couponInfo.originalPrice && couponInfo.originalPrice!=couponInfo.realPrice">￥原价{{couponInfo.originalPrice}}</text>
            </view>

            <view class="coupon-info-goodprice_originprice">
              <view class="coupon-info-goodprice_originprice_remain"
                v-if="couponInfo.isOpenStore && couponInfo.remainStore>=0">剩余：<text
                  class="coupon-info-goodprice_originprice_remain_data">{{couponInfo.remainStore}}</text></view>
            </view>
          </view>
          <view v-if="fromPage == 'appointment'" class="coupon-info-supportNum">{{appointNotice}}</view>
          <view v-else class="coupon-info-supportNum">
            <text v-if="couponInfo.supportNum>0">支持{{couponInfo.supportNum}}家门店，门店对应商品可用</text>
            <text v-else>支持所有门店，门店对应商品可用</text>
            <text
              style="float:right;font-size: 24rpx; color: #666666; margin-right: 24rpx">已售{{couponInfo.saleNum || 0}}份</text>
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
        <view class="coupon-num item-bg" v-if="!isAppointment">
          <view class="coupon-num-text">
            <view style="display: flex"><text>数量</text>
              <view v-if="buyLimit && buyLimit !== 99999 && buyType === 1"
                style="margin-left: 20rpx; font-size: 26rpx;">限购 <text
                  style="color: red; padding: 0 15rpx; fonnt-weight: bold;">{{buyLimit}}</text> 件
              </view>
              <view v-if="buyLimit && buyLimit !== 99999 && buyType === 0"
                style="margin-left: 20rpx; font-size: 26rpx;">最少购买 <text
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

        <view class="coupon-appointment item-bg" v-if="isAppointment">
          <u-cell-group>
            <u-cell-item title="预约时间" :title-style="titleStyle" :arrow="false" value=""></u-cell-item>
          </u-cell-group>
          <view class="coupon-appointment-time">
            <view v-if="timeZone.length==0" @click="openTimeBox" class="open-time-box"
              :style="{background: ` ${themeColor}`}">点击选择预约时间</view>
            <!-- linear-gradient(-44.29deg, ${themeShadow}, ${themeColor}) -->

            <view v-else class="appointment-time-box" @click="openTimeBox">
              <view class="time-box">
                <view class="time-box-top">使用时间</view>
                <view class="time-box-mid">
                  <view class="time-box-mid-time">{{timeZone[0] | clockFormat}}</view>
                  <view class="time-box-mid-line" :style="{background: themeShadow}"></view>
                </view>
                <view class="time-box-bot">{{appointmentTime | appointDateFormat}}</view>
              </view>
              <view class="time-box">
                <view class="time-box-top">离开时间</view>
                <view class="time-box-mid">
                  <view class="time-box-mid-time">{{timeZone[1] | clockFormat}}</view>
                  <view class="time-box-mid-line" :style="{background: themeShadow}"></view>
                  <!-- <view class="time-box-mid-line" :style="{background: `linear-gradient(-135.8deg, ${themeShadow}, ${themeColor})`}"></view> -->
                </view>
                <view class="time-box-bot">{{appointmentTime | appointDateFormat}}</view>
              </view>
              <view class="time-box">共{{hour}} <u-icon name="arrow-right"></u-icon>
              </view>
            </view>
          </view>
        </view>

        <view class="coupon-cinema item-bg">

          <u-cell-group>
            <u-cell-item title="适用店铺" :title-style="titleStyle" :arrow="true" arrow-direction="right"
              @click="goToShopdetail(couponInfo.supportNum)"
              :value="couponInfo.supportNum == 0 ? '适用于全部店铺' : `${couponInfo.supportNum}家店铺`">
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
        <view class="coupon-notice item-bg">
          <view style="font-size: 30rpx;">购买须知</view>
          <view>有效期</view>
          <view v-if="availableType === 1">{{(availDate.startDate)}} 至 {{(availDate.endDate)}}</view>
          <view v-if="availableType === 2">{{dateAvailable(availDay)}}</view>
          <view v-if="availableType === 0">永久有效</view>
          <view>使用须知</view>
          <view v-html="formatRichText(couponInfo.instructions)"></view>
        </view>
        <view class="coupon-notice item-bg" v-if="couponNotice">
          <view style="font-size: 30rpx;">商品详情</view>
          <!-- <image class="coupon-image" style="margin-top: 20rpx" v-for="(pic, picIndex) in urlPics" :key="picIndex"
                  :src="pic ? pic : ''" /> -->
          <view style="margin-top: 20rpx" v-html="formatRichText(couponNotice)"></view>

        </view>
      </view>

      <view class="goods-detail-bottom">
        <view class="goods-detail-bottom-like">
          <!-- <view class="cuIcon-favor goods-detail-bottom-like_icon"></view> -->
          <image v-if="isCollection" src="../../../static/images/icon/icon_collect_pre.png"
            class="goods-detail-bottom-like_icon" @tap="delCollection">
          </image>
          <image v-else src="../../../static/images/icon/icon_collect_nor.png" class="goods-detail-bottom-like_icon"
            @tap="delCollection">
          </image>
          <text :class=" isCollection ?  'color-blue' : 'goods-detail-bottom-like_text' ">收藏</text>
        </view>
        <view class="btn-box">
          <template v-if="couponInfo.isOpenStore && couponInfo.remainStore == 0">
            <button v-if="couponInfo.realPrice === 0" class="cu-btn btn-disabled">领取</button>
            <button v-else class="cu-btn btn-disabled">已售罄</button>
          </template>
          <template v-else>
            <button v-if="couponInfo.realPrice === 0" class="cu-btn btn-pay" @click="toGetWeChatPay">领取</button>
            <button v-else class="cu-btn btn-pay" @click="toGetWeChatPay">立即抢购</button>
          </template>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timeZone: [],
        selectArr: [],
        showTimePop: false,
        choiceDate: '',
        startDay: '',
        startTime: '08:00',
        endTime: '18:00',
        timeInterval: 0.5,
        appointmentTime: '',
        hour: 0,
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        themeShadow: uni.getStorageSync('themeShadow'),
        themeColorRGB: '',
        appointData: {
          "id": "b275cfdd7b604ed79c285a8edb48df96",
          "merchantId": "MD1413109041353330688",
          "name": "hot-tea",
          "startTime": "1646668800000",
          "endTime": "1650556799000",
          "createTime": 1646728413590,
          "description": "",
          "pics": ["service-org-7adc24dc/20220308/1af84bb22c2145c2a211aaea67dda0b9.jpg"],
          "weekDays": [1, 2, 4, 3, 5],
          "enableWeekDays": [{
            "start": "13:00:00",
            "end": "14:05:00",
            "bookLimit": 5
          }, {
            "start": "14:05:00",
            "end": "15:10:00",
            "bookLimit": 5
          }, {
            "start": "15:10:00",
            "end": "16:15:00",
            "bookLimit": 5
          }, {
            "start": "16:15:00",
            "end": "17:20:00",
            "bookLimit": 5
          }, {
            "start": "17:20:00",
            "end": "18:25:00",
            "bookLimit": 5
          }],
          "hours": -1,
          "hoursEnd": -1,
          "chargeMode": 2,
          "minute": 30,
          "minAmount": 0.01,
          "goodsNo": [],
          "tags": ["hot", "tea"],
          "instructions": "",
          "detail": "",
          "merchantNo": "9ZLWBzob"
        },
        couponInfo: {
          "name": "全闽悦影券豪华版(不要修改此商品信息)",
          "supportNum": 1,
          "saleNum": 6,
          "goodsPrice": 39.9,
          "realPrice": 39.9,
          "remainStore": 2,
          "isOpenStore": 1,
          "tags": [],
          "canUseMerchants": [{
            "type": "info-merchant",
            "id": "MD1413109041353330688",
            "version": 0,
            "index": "info-merchant",
            "sort": [1648218473000],
            "found": false,
            "seqNo": 0,
            "primaryTerm": 0,
            "merchantName": "精彩电影",
            "merchantNo": "9ZLWBzob",
            "linkPhone": "13599098689",
            "disance": 1648218473000,
            "logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
            "address": "软件大道89号A区双创城"
          }],
          instructions: ' <h3>【本商品不支持退款！】</h3><h3>【用“钱包支付”立享：满<strong>30</strong>元立减<strong>20</strong>元！每位用户可享受两次优惠！优惠100张，先到先得…】</h3><h3><br></h3><h3>使用说明</h3><p class="ql-align-justify">(1)凭本券可在线下合作影城柜台或线上适用影城兑换普通厅2D/3D/zmax电影票一张；</p><p class="ql-align-justify">柜台兑换：出示此券，告知影城工作人员您有<span style="color: rgb(255, 0, 0);">爱来电子券</span>，选择场次、座位，影城工作人员。</p><p class="ql-align-justify">电子券查看方式：</p><p class="ql-align-justify">1.下载<span style="color: rgb(255, 0, 0);">最美电影APP</span>, 点击我的-电影券，查看所获取的电影券。</p><p class="ql-align-justify">2.&nbsp;微信小程序搜索 ”<span style="color: rgb(255, 0, 0);">最美电影”，</span>可直接选择喜爱的电影，点击电影优惠券，选择电影券观影。</p><p class="ql-align-justify">3.&nbsp;关注最美电影FANS公众号-点击立即购票，点击我的-电影券。</p><p class="ql-align-justify">在线选座：微信小程序搜索<span style="color: rgb(255, 0, 0);">”最美电影”</span>或者下载最美电影APP, 关注最美电影FANS公众号-点击立即购票。购票成功后到选定影城取票观影。</p><p class="ql-align-justify">(2)&nbsp;因影城要求，如遇特殊节假日（如春节、国庆、情人节、圣诞节等）、限价片、特殊影片可能需补差，部分影城需客户购买或自备3D眼镜，以及其他未提及事项均以影城现场公告为准。</p><p class="ql-align-justify">(3)本券售出，不记名，不挂失，不得二次转卖，一经兑换不得退票，密码区一经刮开，影城柜台将不予兑换。</p><p class="ql-align-justify">(4)本券请在有效期内使用，逾期自动失效，自行撕角、损毁或擅自更改内容均视为票券作废无效。</p><p class="ql-align-justify">(5)线下合作影城柜台或线上适用影城，可查看线上券说明。</p><p class="ql-align-justify">(6)以上说明如有未尽事宜或更改，恕不另行通知，如有疑问请致电客服热线咨询。</p><p class="ql-align-justify">(7)&nbsp;在法律允许的范围内，本券最终解释权归福州爱来网络科技有限责任公司所有。</p><p class="ql-align-center">客服热线：400-0125-000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务时间：09:00-21:00(周一至周日)</p>'
        },

        couponNotice: '',
        appointNotice: '',
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
        shopDetail: [{
          "type": "info-merchant",
          "id": "MD1413109041353330688",
          "version": 0,
          "index": "info-merchant",
          "sort": [1648218473000],
          "found": false,
          "seqNo": 0,
          "primaryTerm": 0,
          "merchantName": "精彩电影",
          "merchantNo": "9ZLWBzob",
          "linkPhone": "13599098689",
          "disance": 1648218473000,
          "logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
          "address": "软件大道89号A区双创城"
        }], //门店详情
        urlPics: [
          "https://sptest.51zcm.cc/sp-mate/platform-oss/internal-getfile/service-org-7adc24dc/20210812/aa5c297239124de197acc62964025fb4.jpg"
        ],
        picsList: [],
        regionNo: '',
        buyLimit: null,
        availableType: 1,
        availDate: {
          startDate: '2021-01-01',
          endDate: '2024-01-01',
        },
        availDay: '2024-01-01',
        location: {
          latitude: null,
          longitude: null
        },
        shopLocation: {
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
        autoRefund: false,
        getPriceInfo: {},
        selectedCard: {},
        textValue: '',
        buttonLoading: true,
        isAppointment: false,
        fromPage: ''
      }
    },
    onShareAppMessage(res) { //发送给朋友
      return {
        title: this.couponInfo.name,
        path: `/myPackageA/pages/coupon/coupon-detail?goodsId=${this.goodsId}&lon=${this.location.longitude}&lat=${this.location.latitude}&isShare=1`,
      }
    },
    filters: {
      clockFormat(time) {
        let obj = time.substring(0, 5)
        return obj.replace(":", "：")
      },
      appointDateFormat(date) {
        return date.split("年")[1]
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
      if (option.fromPage && option.fromPage == 'appointment') {
        this.fromPage = option.fromPage
        this.isAppointment = true
      }
      this.themeColorRGB = this.$util.colorRgb(this.themeColor, 0.1)
      this.goodsId = option.goodsId
      this.location.latitude = option.lat
      this.location.longitude = option.lon
      // this.isDiscount = option.isDiscount || false
      this.isShare = option.isShare || false

      this.memberInfo()

      // #ifdef MP-WEIXIN
      // this.getAllData()
      this.getLocation()
      // #endif
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
      // #ifdef H5
      // this.getAllData()
      // this.getLocation()
      // #endif
    },
    methods: {
      getLocation() {
        this.$plugin.app.getLocation({
          success: res => {
            this.location = res
            if (this.fromPage == 'appointment') {
              this.getAppointData()
            } else {
              this.getAllData()
            }
          },
          fail: err => {
            if (this.fromPage == 'appointment') {
              this.getAppointData()
            } else {
              this.getAllData()
            }
          }
        })
      },
      getAllData() {
        this.buttonLoading = true

        this.couponInfo = {
          "name": "全闽悦影券豪华版(不要修改此商品信息)",
          "supportNum": 1,
          "saleNum": 6,
          "goodsPrice": 39.9,
          "realPrice": 39.9,
          "remainStore": 2,
          "isOpenStore": 1,
          "tags": [],
          "canUseMerchants": [{
            "type": "info-merchant",
            "id": "MD1413109041353330688",
            "version": 0,
            "index": "info-merchant",
            "sort": [1648218473000],
            "found": false,
            "seqNo": 0,
            "primaryTerm": 0,
            "merchantName": "精彩电影",
            "merchantNo": "9ZLWBzob",
            "linkPhone": "13599098689",
            "disance": 1648218473000,
            "logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
            "address": "软件大道89号A区双创城"
          }],

        }
        this.couponInfo.instructions =
          ' <h3>【本商品不支持退款！】</h3><h3>【用“钱包支付”立享：满<strong>30</strong>元立减<strong>20</strong>元！每位用户可享受两次优惠！优惠100张，先到先得…】</h3><h3><br></h3><h3>使用说明</h3><p class="ql-align-justify">(1)凭本券可在线下合作影城柜台或线上适用影城兑换普通厅2D/3D/zmax电影票一张；</p><p class="ql-align-justify">柜台兑换：出示此券，告知影城工作人员您有<span style="color: rgb(255, 0, 0);">爱来电子券</span>，选择场次、座位，影城工作人员。</p><p class="ql-align-justify">电子券查看方式：</p><p class="ql-align-justify">1.下载<span style="color: rgb(255, 0, 0);">最美电影APP</span>, 点击我的-电影券，查看所获取的电影券。</p><p class="ql-align-justify">2.&nbsp;微信小程序搜索 ”<span style="color: rgb(255, 0, 0);">最美电影”，</span>可直接选择喜爱的电影，点击电影优惠券，选择电影券观影。</p><p class="ql-align-justify">3.&nbsp;关注最美电影FANS公众号-点击立即购票，点击我的-电影券。</p><p class="ql-align-justify">在线选座：微信小程序搜索<span style="color: rgb(255, 0, 0);">”最美电影”</span>或者下载最美电影APP, 关注最美电影FANS公众号-点击立即购票。购票成功后到选定影城取票观影。</p><p class="ql-align-justify">(2)&nbsp;因影城要求，如遇特殊节假日（如春节、国庆、情人节、圣诞节等）、限价片、特殊影片可能需补差，部分影城需客户购买或自备3D眼镜，以及其他未提及事项均以影城现场公告为准。</p><p class="ql-align-justify">(3)本券售出，不记名，不挂失，不得二次转卖，一经兑换不得退票，密码区一经刮开，影城柜台将不予兑换。</p><p class="ql-align-justify">(4)本券请在有效期内使用，逾期自动失效，自行撕角、损毁或擅自更改内容均视为票券作废无效。</p><p class="ql-align-justify">(5)线下合作影城柜台或线上适用影城，可查看线上券说明。</p><p class="ql-align-justify">(6)以上说明如有未尽事宜或更改，恕不另行通知，如有疑问请致电客服热线咨询。</p><p class="ql-align-justify">(7)&nbsp;在法律允许的范围内，本券最终解释权归福州爱来网络科技有限责任公司所有。</p><p class="ql-align-center">客服热线：400-0125-000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务时间：09:00-21:00(周一至周日)</p>'
        this.refundType(res.object.refundType || 0)



        // 判断是是否收藏
        this.isCollection = true
      },
      getAppointData() {
        this.buttonLoading = true

        this.buttonLoading = false
        // this.appointData = res.object

        this.couponInfo = {
          "name": "全闽悦影券豪华版(不要修改此商品信息)",
          "supportNum": 1,
          "saleNum": 6,
          "goodsPrice": 39.9,
          "realPrice": 39.9,
          "remainStore": 2,
          "isOpenStore": 1,
          "tags": [],
          "canUseMerchants": [{
            "type": "info-merchant",
            "id": "MD1413109041353330688",
            "version": 0,
            "index": "info-merchant",
            "sort": [1648218473000],
            "found": false,
            "seqNo": 0,
            "primaryTerm": 0,
            "merchantName": "精彩电影",
            "merchantNo": "9ZLWBzob",
            "linkPhone": "13599098689",
            "disance": 1648218473000,
            "logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
            "address": "软件大道89号A区双创城"
          }]
        }

        this.merchantNo = res.object.merchantNo
        this.regionNo = this.$regionId
        // 轮播图数据
        this.urlPics = []
        if (res.object && res.object.pics) {
          res.object.pics.forEach(val => {
            let pic = `${this.spMatefileBaseURL}${val}`
            this.urlPics.push(pic)
            this.picsList.push(val)
          })
        } else if (res.object && res.object.pic) {
          let pic = `${this.spMatefileBaseURL}${res.object.pic}`
          this.urlPics.push(pic)
          this.picsList.push(val)
        }
        //商品简介
        this.appointNotice = res.object.description
        //购买须知
        // this.couponInfo.instructions = res.object.instructions ? res.object.instructions : ''
        this.couponInfo.instructions =
          ' <h3>【本商品不支持退款！】</h3><h3>【用“钱包支付”立享：满<strong>30</strong>元立减<strong>20</strong>元！每位用户可享受两次优惠！优惠100张，先到先得…】</h3><h3><br></h3><h3>使用说明</h3><p class="ql-align-justify">(1)凭本券可在线下合作影城柜台或线上适用影城兑换普通厅2D/3D/zmax电影票一张；</p><p class="ql-align-justify">柜台兑换：出示此券，告知影城工作人员您有<span style="color: rgb(255, 0, 0);">爱来电子券</span>，选择场次、座位，影城工作人员。</p><p class="ql-align-justify">电子券查看方式：</p><p class="ql-align-justify">1.下载<span style="color: rgb(255, 0, 0);">最美电影APP</span>, 点击我的-电影券，查看所获取的电影券。</p><p class="ql-align-justify">2.&nbsp;微信小程序搜索 ”<span style="color: rgb(255, 0, 0);">最美电影”，</span>可直接选择喜爱的电影，点击电影优惠券，选择电影券观影。</p><p class="ql-align-justify">3.&nbsp;关注最美电影FANS公众号-点击立即购票，点击我的-电影券。</p><p class="ql-align-justify">在线选座：微信小程序搜索<span style="color: rgb(255, 0, 0);">”最美电影”</span>或者下载最美电影APP, 关注最美电影FANS公众号-点击立即购票。购票成功后到选定影城取票观影。</p><p class="ql-align-justify">(2)&nbsp;因影城要求，如遇特殊节假日（如春节、国庆、情人节、圣诞节等）、限价片、特殊影片可能需补差，部分影城需客户购买或自备3D眼镜，以及其他未提及事项均以影城现场公告为准。</p><p class="ql-align-justify">(3)本券售出，不记名，不挂失，不得二次转卖，一经兑换不得退票，密码区一经刮开，影城柜台将不予兑换。</p><p class="ql-align-justify">(4)本券请在有效期内使用，逾期自动失效，自行撕角、损毁或擅自更改内容均视为票券作废无效。</p><p class="ql-align-justify">(5)线下合作影城柜台或线上适用影城，可查看线上券说明。</p><p class="ql-align-justify">(6)以上说明如有未尽事宜或更改，恕不另行通知，如有疑问请致电客服热线咨询。</p><p class="ql-align-justify">(7)&nbsp;在法律允许的范围内，本券最终解释权归福州爱来网络科技有限责任公司所有。</p><p class="ql-align-center">客服热线：400-0125-000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务时间：09:00-21:00(周一至周日)</p>'
        // 这里单独获取可用门店的数据



        // 判断是是否收藏

        this.isCollection = true

      },

      // 打开预约时间的组件
      openTimeBox() {
        this.$refs.child.openPopup()
        this.showTimePop = true
      },
      onTimeConfirm(date, time, hour, cDate) {
        this.appointmentTime = date
        if (time.length > 0) {
          this.timeZone[0] = this.couponInfo.enableWeekDays[time[0]].start
          this.timeZone[1] = this.couponInfo.enableWeekDays[time[time.length - 1]].end
        }
        // this.timeZone = time.split("-")
        // this.selectTime(date, time)
        this.hour = hour
        this.showTimePop = false

        let arr = []
        for (var i = 0; i < time.length; i++) {
          let info = this.couponInfo.enableWeekDays[time[i]]
          let obj = {}
          let fromTime = cDate + ' ' + info.start
          let toTime = cDate + ' ' + info.end
          obj.from = new Date(fromTime).getTime()
          obj.to = new Date(toTime).getTime()
          obj.count = 1
          obj.activityId = this.goodsId
          obj.activityName = this.couponInfo.name
          arr.push(obj)
        }
        this.selectArr = arr
        this.choiceDate = cDate
      },
      // 子组件--关闭规格弹窗
      popupClose(val) {
        this.showTimePop = val
      },
      selectTime(date, time) {
        this.getTime = date + ' ' + time
        let timeArr = time ? time.split('-') : []
        if (timeArr.length > 1 && timeArr[0] != '' && timeArr[1] != '') {
          let timeOne = timeArr[0].split(':')
          let timeTwo = timeArr[1].split(':')
          let h = parseInt(timeTwo[0]) - parseInt(timeOne[0])
          let m = parseInt(timeTwo[1]) - parseInt(timeOne[1])
          if (m < 0) {
            h = h - 1
          }
          h = h == 0 ? '' : `${h}小时`
          m = m == 0 ? '' : `${Math.abs(m)}分钟`
          this.hour = h + m
        }
      },
      //跳转对应的抢购页面
      toGetWeChatPay() {
        uni.navigateTo({
          url: `/myPackageA/pages/coupon/coupon-order?goodsId=${this.goodsId}&numValue=${this.numValue}&lon=${this.location.longitude}&lat=${this.location.latitude}&merchantNo=${this.merchantNo}`
        })
      },
      //调用支付方法
      getRightPayApi() {
        let mysptType = this.$const.SPT_TYPE.SPT_MINIPRO
        // #ifdef H5
        mysptType = this.$const.SPT_TYPE.SPT_NTPAYSPT_JSAPI
        // #endif

        this.buttonLoading = true
        //调用支付接口
        this.buttonLoading = false
        this.paySuccess(this.getPriceInfo.billNo)
        this.selectedCard.payType = this.$const.PAY_TYPE.WALLET

      },
      // 支付成功
      paySuccess(orderNo) {
        uni.showToast({
          title: '领取成功'
        })
        let params = {
          billNo: orderNo,
          amount: '0',
          actualAmount: '0',
          createTime: new Date().getTime(),
          transactionType: 2000,
          extra: {
            isBankCard: 0
          },
          saler: {

          },
          items: [{
            name: this.couponInfo.name,
            count: this.numValue
          }]
        }
        params = JSON.stringify(params)
        //跳转对应的订单查询页面
        setTimeout(() => {
          this.$nextTick(() => {
            uni.redirectTo({
              url: `/pages/shop/settlement?orderNo=${orderNo}&buyType=1`
            })
          })
        }, 800)
      },
      delCollection() {
        this.isCollection = !this.isCollection

      },
      // 可用门店
      goToShopdetail(num) {

        let canUseMerchants = []
        if (this.couponInfo) {
          if (this.couponInfo.canUseMerchants && this.couponInfo.canUseMerchants.length > 0) {
            for (var i = 0; i < this.couponInfo.canUseMerchants.length; i++) {
              canUseMerchants.push(this.couponInfo.canUseMerchants[i].merchantNo)
            }
          } else {
            canUseMerchants = []
          }
        }
        uni.navigateTo({
          url: `/myPackageA/pages/coupon/coupon-detail-shop?goodsId=${this.goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}&canUseMerchants=${canUseMerchants}`
        })

      },
      async memberInfo() {


      },
      // 导航
      openLocation() {
        return
        let latitude = parseFloat(this.shopLocation.latitude)
        let longitude = parseFloat(this.shopLocation.longitude)
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
    height: calc(100% - 260rpx);
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
    background-color: #fff;
    margin-bottom: 15rpx;
    height: auto;
  }

  .coupon-info {
    padding: 20rpx 0 20rpx 30rpx;

    .goods-tags {
      margin: 18rpx 0;
      height: 40rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &-box {
        padding: 0 10rpx;
        height: 32rpx;
        border-radius: 32rpx;
        font-size: 20rpx;
        margin-right: 10rpx;
        display: inline-block;
      }
    }

    &-goodprice {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &_price {
        color: #E43838;
        font-size: 36rpx;

        // font-weight: bold;
        &_text {
          font-size: 24rpx;
          color: #A9A9A9;
        }

        .goods-old-price {
          margin-left: 20rpx;
          font-size: 24rpx;
          color: #9e9e9e;
          text-decoration: line-through;
          flex: 1;
        }
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
      // padding-right: 20rpx;
      color: #333;
      line-height: 1.2;
      margin: 12rpx 0;
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

  .coupon-appointment {

    // padding: 30rpx;
    .coupon-appointment-time {
      width: 100%;
      height: 188rpx;
      overflow: hidden;

      .open-time-box {
        width: 600rpx;
        height: 88rpx;
        line-height: 88rpx;
        // background: linear-gradient(-44.29deg, rgba(68,85,234,1) 0%,rgba(134,133,253,1) 100%);
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        margin: 45rpx auto 0;
      }

      .appointment-time-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 0 30rpx;

        .time-box {
          color: #000000;
          font-size: 28rpx;

          .time-box-top {
            color: #7C7C7C;
            font-weight: 400px;
            font-size: 24rpx;
          }

          .time-box-mid {
            color: #000000;
            font-weight: bold;
            font-size: 36rpx;
            position: relative;

            .time-box-mid-time {
              z-index: 10;
            }

            .time-box-mid-line {
              // position: absolute;
              // left: 0;
              // bottom: 8rpx;
              margin-top: -20rpx;
              width: 120rpx;
              height: 10rpx;
              // background: linear-gradient(-135.8deg, rgba(77,107,255,1) 0%,rgba(134,133,253,1) 100%);
              background: linear-gradient(to right, #f97b42, #f35610);
              z-index: 9;
            }
          }

          .time-box-bot {
            color: #000000;
            font-weight: 400px;
            font-size: 28rpx;
          }
        }
      }
    }
  }

  .coupon-cinema {
    position: relative;

    // .icon {
    //     width: 700rpx;
    //     height: 50rpx;
    //     z-index: -9;
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

  .coupon-notice {
    padding: 30rpx;

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
    height: 140rpx;
    // height: 110rpx;
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

      .btn-disabled {
        background: #d8d8d8;
      }
    }
  }
</style>