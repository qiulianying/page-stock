<template>
  <view class="index_container">
    <view class="index_head">
      <view class="index_head_part">
        <view>今日报餐情况</view>
        <view class="index_head_part_big">未报餐</view>
        <view class="index_head_part_small">明日报餐情况：无</view>
      </view>
      <view class="index_head_part">
        <view>智慧第一食堂</view>
        <u-button
          size="mini"
          shape="circle"
          class="index_head_part_button"
          @click="MealDeclaration"
        >立即报餐</u-button>
      </view>
    </view>
    <view class="index_balance">
      <view class="index_balance_item">
        <view class="big_font_size">
          余额：
          <span class="font_color">188.00</span>
        </view>
        <view class="small_font_size">
          赠送金：
          <span class="font_color">12.00</span>
        </view>
      </view>
      <view class="index_balance_order">
        <view class="order_pic"></view>
        <view class="order_title">账单记录</view>
      </view>
    </view>
    <view class="index_notice">
      <view class="index_notice_pic"></view>
      <view class="index_notice_text">每日菜谱已更新，看看今天吃什么。</view>
      <view class="index_notice_button">立即查看 ></view>
    </view>
    <view class="index_service">
      <view class="index_service_content">
        <view class="index_service_content_title">服务类型</view>
        <view class="index_service_content_item">
          <view
            :class="index%2?'service_item pink':'service_item yellow'"
            v-for="(item,index) in serviceList"
            :key="index"
            @click="Jump(item.url)"
          >
            <view class="service_item_pic"></view>
            <view class="service_item_text">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="index_swipe">
      <u-swiper :list="swiperList" :height="360" :border-radius="20"></u-swiper>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      serviceList: [], //服务类型数据
      swiperList: [
        "../../../static/images/idcard-1.png",
        "../../../static/images/idcard-2.png"
      ] //轮播图数据
    };
  },
  components: {},
  methods: {
    /* 报餐 */
    MealDeclaration() {
      uni.navigateTo({ url: "/myPackageB/pages/declaration/my" });
    },
    Jump(url) {
      uni.navigateTo({ url: url });
    }
  },
  created() {
    this.serviceList = [
      {
        name: "在线报餐",
        url: "/myPackageB/pages/declaration/mealDeclaration"
      },
      {
        name: "在线充值",
        url: "/myPackageB/pages/declaration/mealDeclaration"
      },
      { name: "人脸识别", url: "/myPackageB/pages/declaration/mealDeclaration" }
    ];
  }
};
</script>

<style lang="scss" scoped>
.index_container {
  background-color: #f5f4f4;
  position: relative;
  .index_head {
    width: 100%;
    height: 339rpx;
    background-image: url(../../../static/images/my_purse_bg.png);
    background-size: cover;
    padding: 80rpx;
    display: flex;
    justify-content: space-between;
    .index_head_part {
      font-size: 30rpx;
      color: #a67c39;
      text-align: center;
      .index_head_part_small {
        font-size: 20rpx;
        height: 30rpx;
      }
      .index_head_part_big {
        margin-top: 4rpx;
        font-size: 40rpx;
        font-weight: bold;
        height: 80rpx;
      }
      .index_head_part_button {
        margin-top: 30rpx;
        height: 60rpx;
        padding: 10rpx 32rpx;
        font-size: 26rpx;
        line-height: 26rpx;
        color: #a67c39;
      }
    }
  }
  .index_balance {
    height: 120rpx;
    width: 100%;
    display: flex;
    flex: 0 0 50%;
    background-color: white;
    .index_balance_item {
      width: 50%;
      padding-left: 100rpx;
      .big_font_size {
        font-size: 30rpx;
        border-right: 1px solid #e0e0e0;
      }
      .small_font_size {
        font-size: 20rpx;
        border-right: 1px solid #e0e0e0;
      }
      .font_color {
        color: #a67c39;
      }
    }
    .index_balance_order {
      width: 50%;
      display: flex;
      justify-content: center;
      .order_pic {
        width: 70rpx;
        height: 70rpx;
        background-image: url(../../../static/images/pay/bank_money.png);
        background-size: cover;
      }
      .order_title {
        margin: 10rpx 0 0 10rpx;
        font-size: 32rpx;
      }
    }
  }
  .index_notice {
    margin-top: 30rpx;
    height: 80rpx;
    background-color: white;
    padding: 10rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .index_notice_pic {
      width: 40rpx;
      height: 40rpx;
      margin-left: 40rpx;
      background-image: url(../../../static/images/icon/icon_integration.png);
      background-size: cover;
    }
    .index_notice_text {
      font-size: 24rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
    .index_notice_button {
      color: #a67c39;
      font-size: 30rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  .index_service {
    width: 100%;
    padding: 30rpx 30rpx;
    .index_service_content {
      background-color: white;
      border-radius: 20rpx;
      .index_service_content_title {
        height: 80rpx;
        font-size: 40rpx;
        font-weight: bold;
        padding: 30rpx 0 0 36rpx;
      }
      .index_service_content_item {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        padding: 30rpx;
        .service_item {
          height: 160rpx;
          flex: 0 0 48%;
          margin: 15rpx 0;
          border-radius: 15rpx;
          padding: 10rpx;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .service_item_pic {
            width: 100rpx;
            height: 100rpx;
            background-image: url(../../../static/images/icon/icon-shop-pay.png);
            background-size: cover;
          }
          .service_item_text {
            font-size: 32rpx;
          }
        }
        .pink {
          background-color: #fdf1f1;
        }
        .yellow {
          background-color: #fef8ef;
        }
      }
    }
  }
  .index_swipe {
    height: 400rpx;
    padding: 20rpx 30rpx;
  }
}
</style>
