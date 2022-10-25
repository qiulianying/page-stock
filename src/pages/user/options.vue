<template>
    <view>
        <cu-custom bgColor="bg-white" is-back>
            <block slot="content" class="text-black">意见反馈</block>
        </cu-custom>
        <form>
            <view class="cu-form-group">
                <textarea maxlength="500" class="cu-form-groupText"
                          :value="dreamContent.content"
                          @input="textareaAInput" placeholder="请输入反馈的详细内容"></textarea>
            </view>
            <!--   保存按钮   -->
            <view class="page-bottom">
                <button class="cu-btn bg-theme" :style="{background: themeColor}" @tap="saveAddress">提交反馈</button>
            </view>
        </form>
    </view>
</template>

<script>
    import { feedback } from '../../api/platformgouc'
    export default {
        name: "options",
        data() {
            return {
                userId: uni.getStorageSync('userId') || '',
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
                feedback({
                    id: this.userId,
                    content: this.dreamContent.content
                }).then(res => {
                    uni.showToast({
                        title: '反馈意见已成功提交!',
                        icon: 'success',
                        duration: 2000
                    })
                    this.dreamContent.content = ''
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .cu-form-group {
        .cu-form-groupText {
            height: 600rpx;
        }
    }

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
