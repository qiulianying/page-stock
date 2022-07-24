<template>
  <view class="coupon-page">
    <cu-custom bgColor="bg-white" is-back :goBack="true">
      <block slot="backText" class="text-black">预约</block>
    </cu-custom>

    <view class="main-page">
      <scroll-view scroll-y="true">
        <view class="item-bg" v-for="(item, index) in appointList" :key="index"  @click="gotoCouponDetail(item.id)">
          <view class="item-bg-img">
            <image class="item-image" :src="(item.pics && item.pics[0]) ? `${spMatefileBaseURL}${item.pics[0]}${fixStr}` : '/static/images/login-grey.png'" mode="widthFix">
            </image>
          </view>
          <view class="item-text">
            <view class="item-title">{{item.name}}</view>
            <view class="item-sale"></view>
            <view class="item-describe">
              <view class="goods-tags">
                <view class="goods-tags-box" :style="{color: themeColor, background: themeColorRGB}" v-for="(tag,idx) in item.tags" :key="idx">
                  {{tag}}
                </view>
              </view>
            </view>
            <view class="item-details">
              <view class="appoint-amount" v-if="item.chargeMode == 2">
                <span class="item-price" style="font-size:30rpx;">￥</span>
                <span class="item-price">{{item | moneyFormat}}</span>
                <span class="item-price-unit">/小时</span>
              </view>
              <view class="appoint-amount" v-else>
                <span class="item-price" style="font-size:30rpx;">￥</span>
                <span class="item-price">{{item.amount}}</span>
                <span class="item-price-unit"></span>
              </view>
              <view class="item-recommend">
                <button class="appoint-btn">预约</button>
              </view>
            </view>
           
          </view>
        </view>
      </scroll-view>
    </view>
    <zj-empty v-if="appointList.length === 0" text="暂无预约活动" :img="`${imgUrl}1639019849000/pic_coupon.png`"/>
    <uni-load-more v-else :status="record.status"></uni-load-more>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        imgUrl: this.$imgUrl,
        value: '',
        fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
        actList:{},
        location:{
          latitude: null,
          longitude: null
        },
        merchantId: '',
        appointList: [{"id":"b275cfdd7b604ed79c285a8edb48df96","merchantId":"MD1413109041353330688","name":"hot-tea","startTime":"1646668800000","endTime":"1650556799000","createTime":1646728413590,"description":"","pics":["service-org-7adc24dc/20220308/1af84bb22c2145c2a211aaea67dda0b9.jpg"],"weekDays":[1,2,4,3,5],"enableWeekDays":[{"start":"13:00:00","end":"14:05:00","bookLimit":5},{"start":"14:05:00","end":"15:10:00","bookLimit":5},{"start":"15:10:00","end":"16:15:00","bookLimit":5},{"start":"16:15:00","end":"17:20:00","bookLimit":5},{"start":"17:20:00","end":"18:25:00","bookLimit":5}],"hours":-1,"hoursEnd":-1,"chargeMode":2,"minute":30,"minAmount":0.01,"goodsNo":[],"status":2,"tags":["hot","tea"],"instructions":"","detail":""},{"id":"27193af7144d472db8f2bf3fdceb6dbc","merchantId":"MD1413109041353330688","name":"测试环境预约活动","startTime":"1646582400000","endTime":"1651334399000","createTime":1646726970945,"description":"茶香幽静适合各种会谈","pics":["service-org-7adc24dc/20220308/ebee806aa15a43aa89fd47deb4974199.jpg"],"weekDays":[1,2,3,4,5,6,7],"enableWeekDays":[{"start":"08:00:00","end":"09:00:00","bookLimit":5},{"start":"09:00:00","end":"10:00:00","bookLimit":5},{"start":"10:00:00","end":"11:00:00","bookLimit":5},{"start":"11:00:00","end":"12:00:00","bookLimit":5},{"start":"12:00:00","end":"13:00:00","bookLimit":0},{"start":"13:00:00","end":"14:00:00","bookLimit":5},{"start":"14:00:00","end":"15:00:00","bookLimit":5}],"hours":1,"hoursEnd":168,"chargeMode":1,"amount":0.01,"goodsNo":[],"status":2,"tags":["幽静","茶香"],"instructions":"<p><img src=\"https://sptest.51zcm.cc/platform-oss/internal-getfile//service-org-7adc24dc/20220308/e49228a5d74f4ec38727a3d0983a89aa.jpg\"></p>","detail":""}],
        pageType: '',
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        themeShadow: uni.getStorageSync('themeShadow'),
        themeColorRGB: '',
        record: {
          curPageNum: 1,
          pageSize: 10
        },
      }
    },
    filters: {
      moneyFormat(val) {
        let money = parseFloat((val.minAmount * 60) / val.minute)
        return money
      }
    },
    onLoad(option){
      this.themeColorRGB = this.$util.colorRgb(this.themeColor,0.1)
      this.location.latitude = option.lat
      this.location.longitude = option.lon
      this.merchantId = option.merchantId
      if (option.type && option.type == 'tea') {
        this.pageType = option.type
        console.log('这里是茶室预约',this.pageType)
        this.getAllList()
      } else {
        this.pageType = ''
      }
    },
    methods:{
      onReachBottom () {
        if (this.record.curPageNum === 0) {
          return
        }
        if (this.record.status === 'loading' || this.record.loaded && (this.navList[this.tabCurrentIndex].list == null || this.navList[this.tabCurrentIndex].list.length === 0)) {
          return
        }
        if (this.record.curPageNum >= this.record.totalPageNum) {
          return
        }
        this.record.curPageNum = ++this.record.curPageNum
        
      },
     
      gotoCouponDetail(id) {
        uni.navigateTo({
          url: `/myPackageA/pages/coupon/coupon-detail?goodsId=${id}&lon=${this.location.longitude}&lat=${this.location.latitude}&fromPage=appointment`,
        });
      }
    }
  }
</script>
<style>
  page {
  }
</style>
<style lang="scss" scoped>
  .coupon-page {
    .main-page {
      .main-image {
        width: 100%;
        height: 390rpx;
      }
    }
  }
  .item-bg {
    display: flex;
    position: relative;
    width: 92%;
    height: 236rpx;
    margin: 30rpx auto;
    padding: 28rpx 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    box-shadow: 0px 4px 13px -1px rgba(158, 158, 158, 0.31);
    &-img{
      width: 180rpx;
      height: 180rpx;
      .item-image {
        float: left;
        width: 180rpx;
        border-radius: 16rpx;
        // border: 2px solid red;
      }
    }
    

    .item-text {
      float: left;
      width: 450rpx;
      height: 200rpx;
      margin-left: 20rpx;

      .item-title {
        font-size: 30rpx;
        font-weight: 600;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .item-sale{
        font-size: 22rpx;
        font-weight: 400;
        color: #A9A9A9;
        margin-top: 12rpx;
      }
      .item-describe{
        height: 44rpx;
        display: flex;
        justify-content: space-between;
        .appoint-btn{
          font-size: 22rpx;
          color: #fff;
          width: 120rpx;
          height: 44rpx;
          line-height: 44rpx;
          background: linear-gradient(90deg, #F46A6A 0%, #E43838 100%);
          border-radius: 44rpx;
          margin: 0;
        }
        .goods-tags{
          // margin: 18rpx 0;
          width: 320rpx;
          height: 40rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &-box{
            padding: 0 10rpx;
            height: 32rpx;
            border-radius: 32rpx;
            font-size: 20rpx;
            margin-right: 10rpx;
            display: inline-block;
          }
        }
        .item-describe-box{
          display: inline-block;
          padding: 0 12rpx;
          height: 36rpx;
          line-height: 36rpx;
          text-align: center;
          background: #E9F3F9;
          border-radius: 32rpx;
          font-size: 20rpx;
          font-weight: 400;
          color: #34A2E8;
          margin-right: 12rpx;
        }
      }

      .item-details {
        // position: absolute;
        // bottom: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items:flex-end;
        margin-top: 14rpx;
        .item-price {
          font-size: 34rpx;
          font-weight: 600;
          color: #E43838;
          margin-right: 4rpx;
        }
        .item-price-unit{
          font-size: 22rpx;
          color: #A9A9A9;
        }

        .item-old-price {
          margin-left: 20rpx;
          font-size: 24rpx;
          color: #A9A9A9;
          text-decoration: line-through;
        }
        .appoint-amount{
          height: 50rpx;
          line-height: 70rpx;
        }
        .item-recommend{
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
          .appoint-btn{
            font-size: 22rpx;
            color: #fff;
            width: 120rpx;
            height: 44rpx;
            line-height: 44rpx;
            background: linear-gradient(90deg, #F46A6A 0%, #E43838 100%);
            border-radius: 44rpx;
            margin: 0;
          }
        }
      }

      // button {
      //     position: absolute;
      //     right: 30rpx;
      //     bottom: 20rpx;
      //     font-size: 22rpx;
      //     color: #fff;
      //     width: 120rpx;
      //     height: 44rpx;
      //     line-height: 44rpx;
      //     background: linear-gradient(90deg, #F46A6A 0%, #E43838 100%);
      //     border-radius: 44rpx;
      // }
    }
  }
</style>
