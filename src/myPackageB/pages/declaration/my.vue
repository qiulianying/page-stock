<template>
  <view class="my_container">
    <view class="my_head">
      <view class="my_head_pic"></view>
      <view class="my_head_info">
        <view class="info_item">
          <view class="info_item_big">XXX</view>12345678901
        </view>
        <view class="info_item">abcacvasdaagag</view>
        <view class="info_item">
          asdadaddasfasfaf
          <view class="info_item_button"></view>
        </view>
      </view>
    </view>
    <view class="my_list">
      <u-cell-group>
        <u-cell-item icon="setting-fill" :title-style="{'fontSize': '30rpx'}" title="个人设置"></u-cell-item>
        <u-cell-item icon="integral-fill" :title-style="{'fontSize': '30rpx'}" title="会员等级"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        { name: "报餐记录", arrow: true },
        { name: "账单记录", arrow: true },
        { name: "卡管理", arrow: true },
        { name: "我的消息", arrow: true },
        {}
      ]
    };
  },
  components: {},
  methods: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.my_container {
  background-color: #f5f4f4;
  position: relative;
  .my_head {
    width: 100%;
    height: 339rpx;
    background-image: url(../../../static/images/my_purse_bg.png);
    background-size: cover;
    padding: 80rpx;
    display: flex;
    .my_head_pic {
      width: 140rpx;
      height: 140rpx;
      border-radius: 40rpx;
      margin-top: 10rpx;
      // overflow: hidden;
      background-image: url(../../../static/images/head.png);
      background-size: cover;
    }
    .my_head_info {
      margin: 32rpx 0 0 32rpx;
      .info_item {
        font-size: 20rpx;
        color: #a67c39;
        display: flex;
        align-items: center;
        .info_item_big {
          font-size: 40rpx;
          margin-right: 20rpx;
        }
        .info_item_button {
        }
      }
    }
  }
  .my_list {
  }
}
</style>
