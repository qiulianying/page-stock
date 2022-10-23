<template>
    <view>
        <cu-custom bgColor="bg-white" is-back>
            <block slot="content" class="text-black">意见反馈</block>
        </cu-custom>
        <form>
            <view class="cu-form-group margin-top">
                <view class="title">简要概括</view>
                <input placeholder="请输入简要概括" name="input"></input>
            </view>
            <view class="cu-form-group">
                <textarea maxlength="500" @input="textareaAInput" placeholder="请输入反馈的详细内容"></textarea>
            </view>
            <!--   保存按钮   -->
            <view class="page-bottom">
                <button class="cu-btn bg-theme" :style="{background: themeColor}" @tap="saveAddress">保 存</button>
            </view>
        </form>
    </view>
</template>

<script>
    export default {
        name: "options",
        data() {
            return {
                dreamContent: {
                    content: ''
                },
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8'
            }
        },
        components: {},
        watch: {},
        created() {
        },
        mounted() {
        },
        methods: {
            textareaAInput(e) {
                this.dreamContent.content = e.detail.value
            },
            saveAddress() {

            }
        }
    }
</script>

<style scoped lang="scss">
    .page-bottom {
        button {
            margin: 64rpx 24rpx 24rpx;
            border-radius: 47rpx;
            font-size: 34rpx;
            color: #FFFFFF;
            height: 94rpx;
            line-height: 94rpx;
            text-align: center;
            display: block;
        }
    }
</style>
