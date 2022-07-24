<template>
    <view class="coupon-page">
        <cu-custom bgColor="bg-white" is-back @tap="toIndex" :goBack="false">
            <block slot="backText" class="text-black">特惠活动</block>
        </cu-custom>

        <view class="main-page">
            <!-- 图片 -->
            <image class="main-image" :src="actList.acticon ? `${spMatefileBaseURL}${actList.acticon}` : '/static/images/login-grey.png'" />
            <!-- 优惠券 -->
            <view>
                 <view class="item-bg" v-for="(item, index) in shoprightList" :key="index"  @click="gotoCouponDetail(item.id)">
                   <view class="item-bg-img">
                      <image class="item-image" :src="item.pic ? `${spMatefileBaseURL}${item.pic}${fixStr}` : '/static/images/login-grey.png'" mode="widthFix">
                      </image>
                   </view>
                    <view class="item-text">
                        <view class="item-title">{{item.name}}</view>
                        <view class="item-details">
                            <text class="item-price">￥{{item.realPrice || item.goodsPrice}}</text>
                            <text class="item-old-price" v-if="item.goodsPrice">￥{{item.goodsPrice}}</text>
                        </view>
                        <button>马上抢</button>
                    </view>
                 </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { orgHomeConfig } from '@/api/infouser'
    import { getPreSettleCalc } from '@/api/rightsmarketing'
    export default {
      components: {
        },
        data() {
            return {
                value: '',
                fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
                actList:{},
                location:{
                  latitude: null,
                  longitude: null
                },
                shoprightList: [],
                imgId: ''
            }
        },
        mounted(){
          this.orgHomeConfig()
        },
        onLoad(option){
          this.location.latitude = option.lat
          this.location.longitude = option.lon
          this.imgId = parseInt(option.imgId)
        },
        onPullDownRefresh() {
          var that = this;
          uni.showLoading({
            title: '下拉刷新',
            mask: true
          })
          // 下拉刷新
          setTimeout(function() {
            that.orgHomeConfig()
            uni.stopPullDownRefresh();
            uni.hideLoading()

          }, 1000);
        },
        methods:{
          orgHomeConfig() {
            let ids = []
            uni.showLoading({
              title: '加载中',
               mask: true
            })
            orgHomeConfig(this.$regionId + '1').then(res => {
              const modules = res.object != null ? res.object.modules : null
              if (modules != null && modules.length > 0) {
                let actObj = modules.find(item => item.name === 'act')
                if (actObj != null) {
                  // this.actList = actObj.dataSource.act
                  this.actList = actObj.dataSource.act.find(i => i.id === this.imgId)
                  ids = this.actList.shoprightList.map(m => m.id)
                  let params = {
                      goodsIds: ids,
                      regionNo: this.$regionId
                  }

                    getPreSettleCalc(params).then(res => {
                      this.shoprightList = res.object
                    })
                    uni.hideLoading()
                }
              }
            })
          //  setTimeout(() => {
          //    console.log('全部id')
          //    console.log(ids)
          //    let params = {
          //     goodsIds: ids,
          //     regionNo: this.$regionId
          //  }

          //   getPreSettleCalc(params).then(res => {
          //     this.shoprightList = res.object
          //   })
          //   uni.hideLoading()
          //  }, 1000)
          },
          gotoCouponDetail(id) {
                uni.navigateTo({
                    url: `/myPackageA/pages/coupon/coupon-detail?goodsId=${id}&lon=${this.location.longitude}&lat=${this.location.latitude}`,
                });
            },
          toIndex(){
             //关闭所有页面，跳转到首页
            uni.reLaunch({
              url: `/pages/index/index`
            })
          }
        }
    }
</script>
<style>
    page {
        background-color: #fef4ee;
    }
</style>
<style lang="scss" scoped>
    .coupon-page {
        .main-page {
            background-color: #fef4ee;

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
            }

            .item-details {
                position: absolute;
                bottom: 30rpx;

                .item-price {
                    font-size: 30rpx;
                    font-weight: 600;
                    color: #E43838;
                }

                .item-old-price {
                    margin-left: 20rpx;
                    font-size: 24rpx;
                    color: #A9A9A9;
                    text-decoration: line-through;
                }
            }

            button {
                position: absolute;
                right: 30rpx;
                bottom: 20rpx;
                width: 150rpx;
                height: 60rpx;
                line-height: 60rpx;
                border-radius: 40rpx;
                font-size: 28rpx;
                background: linear-gradient(to right, #f06060, #e63e3e);
                color: #fff;
            }
        }
    }
</style>
