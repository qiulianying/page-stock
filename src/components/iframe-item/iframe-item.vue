<template>
    <!--展示对应的iframe-->
    <view v-if="iframeType && myPath" class="content_iframe">
        <iframe :src="myPath" frameborder="0" scrolling="auto"
                class="iframeClass">
            <p>你的浏览器不支持 iframe。</p>
        </iframe>
    </view>
    <view class="content_iframe" v-else>
        <view class="codeInfo">
            <!--显示卡槽代码内容-->
            <slot name="code"/>
        </view>
    </view>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2022/04/11 11:39
     */
    export default {
        data() {
            return {}
        },
        props: {
            myPath: {
                type: String,
                default: ''
            },
            // 是否是iframe模式，如果还是，就展示iframe，如果不是，就展示插槽内容
            iframeType: {
                type: Boolean,
                default: true
            }
        },
        created() {
        },
        computed: {},
        components: {},
        methods: {}
    }
</script>

<style scoped lang="scss">
    /*iframe展示对应页面*/
    .content_iframe {
        display: inline-block;
        vertical-align: top;
        overflow-y: auto;
        background: url(../../static/images/iPhone13.png) no-repeat;
        background-size: 100% 100%;
        border-radius: 30px;
        padding: 48px 20px 25px;
        width: 310px;
        height: 1150rpx;

        .iframeClass {
            width: 100%;
            height: 100%;
        }

        .codeInfo {
            width: 100%;
            padding: 20rpx;
            background-color: #F5F5F5;
            min-height: 100%;
        }
    }
</style>
