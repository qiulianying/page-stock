<template>
    <view class="menu-list">
      <cu-custom bgColor="bg-white" is-back>
			  <block slot="backText" class="text-black">推荐商品</block>
		  </cu-custom>
      <view class="menu-list-data">
        <!-- 头部 -->
        <view class="menu-list-data-title">推荐商品（8）</view>
        <!-- 商品内容 -->
        <view class="menu-list-data-detail">
          <!-- 图片 -->
          <view class="menu-list-data-detail-img">
            <image src="/static/images/icon/icon_integration.png"></image>
            <view class="label">TOP1</view>
          </view>
          <!-- 商品标题 -->
          <view class="menu-list-data-detail-desc">是好吃的东西啊啊啊啊啊</view>
          <!-- 点赞 -->
          <view class="menu-list-data-detail-top">
            <view class="menu-list-data-detail-top-circle">
              <u-icon name="thumb-up" color="#A9A9A9" size="32"></u-icon>
              <text class="num">12</text>
            </view>
          </view>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  name: 'user-menu-list',
  components: {},
  props: {},
  data() {
    return {

    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.menu-list{
  background: white;
  &-data {
    margin-top: 32rpx;

      &-title {
        padding-left: 24rpx;
        font-size: 34rpx;
        font-weight: bold;

      }

      &-detail {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin: 20rpx 0;
        padding: 0 24rpx;

        &-img {
          flex: 1;
          position: relative;
          image {
            width: 260rpx;
            height: 195rpx;
            border-radius: 5rpx;

          }
          .label{
            position: absolute;
            top: 0;
            background: #F05353;
            width: 94rpx;
            height: 40rpx;
            border-radius: 5rpx 5rpx 20rpx 5rpx;
            color: white;
            padding-left: 4rpx;
          }
        }

        &-desc {
          flex: 1;
          font-size: 30rpx;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-right: 10rpx;

        }

        &-top {
          width: 128rpx;
          height: 48rpx;
          &-circle {
            border: 2rpx solid #A9A9A9;
            border-radius: 48rpx;
            text-align: center;
            .num {
              margin-left: 10rpx;

            }
          }
        }
      }
  }

}

</style>
