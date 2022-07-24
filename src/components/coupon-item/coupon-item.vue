<template>
    <view class="item-bg">
        <image class="item-image" :src="item.pic" mode="widthFix">
        </image>
        <view class="item-text">
            <view class="item-title">{{item.title}}</view>
            <view class="item-details">
                <text class="item-price">￥{{item.sellPrice}}</text>
                <text class="item-old-price">￥{{item.price}}</text>

            </view>
            <button @click="gotoCouponDetail">马上抢</button>
        </view>
    </view>
</template>

<script>
    export default {
        name: "couponItem",
        data() {
            return {
                item: {
                    pic: 'https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png',
                    sellPrice: '9.9',
                    price: '40.00',
                    title: '观影券9.9元特惠，全城影院通用观影兑换券',
                }
            }
        },
        methods: {
            gotoCouponDetail() {
                uni.navigateTo({
                    url: `/myPackageA/pages/coupon/coupon-detail`,
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-bg {
        position: relative;
        width: 92%;
        height: 200rpx;
        margin: 30rpx auto;
        padding: 18rpx 15rpx 0;
        background-color: #fff;
        border-radius: 10rpx;
        box-shadow: 0px 4px 13px -1px rgba(158, 158, 158, 0.31);

        .item-image {
            float: left;
            width: 170rpx;
            border-radius: 16rpx;
            border: 2px solid red;
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
                bottom: 10rpx;

                .item-price {
                    font-size: 40rpx;
                    font-weight: 600;
                    color: #E43838;
                }

                .item-old-price {
                    margin-left: 20rpx;
                    font-size: 32rpx;
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