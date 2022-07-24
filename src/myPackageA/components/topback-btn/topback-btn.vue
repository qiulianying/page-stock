<template>
    <view>
        <!-- #ifdef H5 -->
        <view></view>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
            <view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
                <view class="action" style="font-size: 34rpx; font-weight: bold;" @click="toUrl">
                    <text :class="bgColor !== 'bg-blue' ?  'text-black cuIcon-back' : 'cuIcon-back'"
                          style="font-size: 38rpx; font-weight: normal;"></text>
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
            //   标题
            //   title:{
            //       type: String,
            //       default: '',
            //       required: true
            //   },
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
            bgColor: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                StatusBar: this.StatusBar,
                CustomBar: this.CustomBar
            };
        },
        watch: {},
        computed: {
            style() {
                var StatusBar = this.StatusBar;
                var CustomBar = this.CustomBar;
                var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
                return style
            }
        },
        created() {},
        mounted() {},
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
        background-color: #34A2E8;
        color: #ffffff;
    }
</style>
