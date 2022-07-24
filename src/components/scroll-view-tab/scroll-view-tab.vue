<template>
    <!--修改默认样式的切换组件-->
    <scroll-view scroll-x class="nav">
        <view class="flex text-center scrollViewMy" :style="[{background: themeColor}]">
            <view v-for="(item, index) in navList" :key="index" @tap="tabSelect" :data-id="index"
                  class="cu-item flex-sub" :class="index == tabCurrentIndex ? 'text-theme cur' : 'oth'"
                  :style="[{color: index == tabCurrentIndex ? themeColor : ''}]">
                <view class="curContent">
                    {{ item.text }}
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2021/12/01 11:45
     */
    export default {
        data() {
            return {
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
            }
        },
        props: {
            navList:{
                type: Array,
                default: []
            },
            tabCurrentIndex: {
                type: Number,
                default: 0
            }
        },
        created() {
        },
        // 计算属性，一般任何复杂的逻辑，都应该放置在计算属性中
        computed: {},
        components: {},
        methods: {
            tabSelect(e) {
                this.$emit('tabSelect', e)
            }
        }
    }
</script>

<style scoped lang="scss">
    .scrollViewMy {
        border-radius: 80px;
        width: 100%;
        color: #fff;
        font-weight: bold;

        .cur {
            justify-content: center;
            align-items: center;
            display: flex;
            border-bottom: none !important;
            .curContent {
                background: #FFFFFF;
                border-radius: 70rpx;
                height: 76rpx;
                line-height: 76rpx;
                width: 100%;
            }
        }
        .oth {
            .curContent{
                height: 90rpx;
                line-height: 90rpx;
                width: 100%;
            }
        }
    }
</style>
