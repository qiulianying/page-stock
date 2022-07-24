<template>
    <!--该组件判断h5以及小程序情况下不同的展示-->
    <view>
        <!-- #ifdef H5 -->
        <view></view>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <view :class="isBlue ? 'cu-custom-blue' : 'cu-custom'" :style="[{height:CustomBar + 'px'}]">
            <view class="cu-bar fixed" :style="style" :class="[bgImage !==''?'none-bg text-white bg-img':'',bgColor]">
            <!-- <view class="cu-bar" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]"> -->
                <view class="action" style="font-size: 34rpx; font-weight: bold;" @click="toUrl">
                    <text v-if="!isShare" :class="bgColor !== 'bg-blue' ?  'text-black cuIcon-back' : 'cuIcon-back'"
                        style="font-size: 38rpx; font-weight: normal;"></text>
                    <view v-else><u-icon name="home" color="#fff" size="46"></u-icon></view>
                    <slot name="backText"></slot>
                </view>
                <view class="content" style="font-size: 34rpx; font-weight: bold;" :style="[{top:StatusBar + 'px'}]">
                    <slot name="content"></slot>
                </view>
                <slot name="right"></slot>
            </view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
    export default {
        name: 'topback-btn',
        components: {},
        props: {
            //   跳转路由
            url: {
                type: String,
                default: '',
                required: true
            },
            //   传递的参数
            parameter: {
                type: Object,
                default: () => {}
            },
            // 判断是否需要蓝色背景
            isBlue: {
                type: Boolean,
                default: false
            },
            bgColor: {
                type: String,
                default: ''
            },
            isShare:{
              type: Boolean,
              default: false
            },
            isBgBlue: {
                type: Boolean,
                default: true
            },
            bgImage: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                StatusBar: this.StatusBar,
                CustomBar: this.CustomBar,
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
            };
        },
        watch: {},
        computed: {
            style() {
                var StatusBar = this.StatusBar;
                var CustomBar = this.CustomBar;
                var style = ''
                if(this.bgColor === 'bg-white'){
                  style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
                }else{
                  style = `height:${CustomBar}px;padding-top:${StatusBar}px;background-color:${this.themeColor};`;
                }
                return style
            }
        },
        created() {},
        beforeDestroy() {},
        methods: {
            toUrl() {
                uni.redirectTo({
                    url: this.url
                })

            }
        }
    };
</script>
<style lang="scss">
    .back-btn {
        height: 60px;
        // line-height: 160rpx;
        font-size: 34rpx;
        font-weight: bold;
        padding-left: 10rpx;
        padding-top: 20px;
        display: flex;
        align-items: center;

        &-text {
            margin-left: 20rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 68%;
        }
    }

    .bg-blue {
        // background-color: #34A2E8;
        color: #ffffff;
    }
    .cu-custom {

    }
    .cu-custom-blue{
      display: block;
      position: relative;
    }
</style>
