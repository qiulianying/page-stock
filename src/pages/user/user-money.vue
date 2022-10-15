<template>
    <view class="index-user-page" style="padding-bottom: 110rpx;">
        <cu-custom bgColor="bg-white" is-back>
            <block slot="backText" class="content">助梦中心</block>
        </cu-custom>
        <view class="index-user-info">
            <image class="image-bg" src="/static/images/Mask.png" />
            <view class="index-user-statistics">
                <!--需要在存在用户手机号且作为软件园项目的时候才会存在钱包的情况-->
                <view class="index-user-statistics-item">
                    <text class="index-user-statistics-item-num">2</text>
                    <text>已获得</text>
                </view>
                <view class="index-user-statistics-item">
                    <text class="index-user-statistics-item-num">0</text>
                    <text>已提现</text>
                </view>
                <view class="index-user-statistics-item" @tap="toGetMoney">
                    <text class="index-user-statistics-item-num">2</text>
                    <text>待提现</text>
                </view>
            </view>
        </view>

        <view class="index-user-menu cu-list menu">
            <view class="cu-item arrow" @tap="$toView('/myPackageA/pages/createdream/index', false, false, true)">
                <view class="content">
                    <text class="text-black">发布笔记获得更多助梦金</text>
                </view>
            </view>
            <view class="cu-item arrow" @tap="$toView('index/index?tabName=1', false, false, false)">
                <view class="content">
                    <text class="text-black">看看大家的笔记</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
            }
        },
        onLoad() {
          // 获取用户当前金额情况
        },
        methods: {
            toGetMoney() {
                this.$toView('user/user-recharge', false,false,true)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .index-user-page {
        .index-user-info {
            width: 100%;
            height: 360rpx;
            position: relative;
            z-index: 0;

            &-box {
                position: absolute;
                left: 40rpx;
                right: 40rpx;
                top: 118rpx;
                display: flex;
                justify-items: center;
                align-items: center;

                image {
                    width: 128rpx;
                    height: 128rpx;
                    margin-right: 14rpx;
                }

                &-content {
                    flex: 1;

                    view {
                        &:first-child {
                            height: 64rpx;
                            font-size: 36rpx;
                            font-weight: 500;
                            line-height: 64rpx;
                            color: #161616;
                            overflow: hidden;
                        }

                        &:nth-child(2) {
                            height: 40rpx;
                            font-size: 28rpx;
                            font-weight: 400;
                            line-height: 40rpx;
                            margin-top: 4rpx;
                        }

                        &:nth-child(3) {
                            height: 34rpx;
                            font-size: 24rpx;
                            font-weight: 400;
                            line-height: 34rpx;
                            margin-top: 4rpx;
                            color: #666666;
                        }
                    }
                }

                &-cert {
                    background: linear-gradient(90deg, #D9B679 0%, #D5B57F 100%);
                    border-radius: 38rpx;
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #FFFFFF;
                    padding: 14rpx 42rpx;
                }

                &-certed,
                &-certing {
                    color: #FFFFFF;
                    padding: 0 12rpx;
                    display: flex;
                    height: 40rpx;
                    line-height: 40rpx;
                    border-radius: 20rpx;
                }
            }

            .index-user-statistics {
                position: absolute;
                left: 32rpx;
                right: 32rpx;
                bottom: 0;
                display: flex;
                justify-content: space-around;
                align-content: center;
                background: #FFFFFF;
                border-radius: 8rpx;
                padding: 50rpx 0;

                &-item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    font-size: 26rpx;
                    color: #737373;
                    flex: 1;

                    &:not(:last-child) {
                        border-right: 2rpx solid #F5F5F5;
                    }

                    &-num {
                        font-size: 36rpx;
                        color: #333333;
                        margin-bottom: 8rpx;
                        font-weight: 500;
                    }

                    button {
                        border-radius: 4rpx;
                        height: 48rpx;
                        padding: 0 20rpx;
                        font-size: 24rpx;
                        margin: 8rpx 0;
                    }
                }
            }
        }

        .index-user-menu {
            border-radius: 8rpx;
            margin: 32rpx;
        }

        .user-bottom {
            font-size: 30rpx;
            text-align: center;
            padding-bottom: 48rpx;
        }
    }

    .slot-content {
        margin: 20rpx;

        &-circle {
            // width: 33%;
            // height: 70rpx;
            // line-height: 70rpx;
            padding: 20rpx;
            display: inline-block;

            &-data {
                width: 50rpx;
                height: 50rpx;
                border-radius: 50rpx;
            }
        }
    }
</style>
