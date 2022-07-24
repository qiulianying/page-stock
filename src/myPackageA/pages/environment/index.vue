<template>
    <view class="order">
        <cu-custom bgColor="bg-white" is-back :back-reload="backReload">
            <block slot="backText" class="text-black">环境切换</block>
        </cu-custom>
        <view class="order-list">
            <view style="margin-top: 20px">
                <view>
                    <h3>环境切换</h3>
                </view>
                <view class="order-list-info">
                    <view>当前小程序环境：{{envTitle}}</view>
                    <view>当前小程序链接后端环境：{{environmentTitle}}</view>
                </view>
                <view>
                    <button class="myButton" type="default" @click="toChange('devTest')">改为开发环境</button>
                    <button class="myButton" type="default" @click="toChange('develop')">改为测试环境</button>
                    <button class="myButton" type="primary" @click="toChange('master')">改为生产环境</button>
                    <button class="myButton" type="warn" @click="toChange()">改为默认选项</button>
                </view>
                <view class="order-list-info">
                    <view>
                        备注：如果点击默认选项，将会默认为开发版-开发环境；体验版-测试环境；生产-生产环境
                    </view>
                    <view style="color: red">
                        点击切换成功之后，需要点击小程序头部菜单栏，点击重新进入小程序，重新进入之后就是切换好的环境
                    </view>
                </view>
            </view>
            <view style="margin-top: 20px">
                <view>
                    <h3>显示输出内容</h3>
                </view>
                <view>
                    <button class="myButton" type="default" @click="toShowToast('on', '开启微信输出内容')">开启微信输出内容</button>
                    <button class="myButton" type="warn" @click="toShowToast('off', '关闭微信输出内容')">关闭微信输出内容</button>
                </view>
                <view class="order-list-info">
                    <view style="color: red">
                        开启微信输出内容：页面会输出所有代码中写好的需要显示的东西展示在页面上 <br>
                        关闭微信输出内容：页面不会输出所有代码中写好的需要显示的东西 <br>
                        输出案例：this.$util.weixinShowToast()
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                env: '',
                envTitle: '',
                environmentTitle: ''
            }
        },
        components: {},
        methods: {
            toShowToast(type, content) {
                uni.showLoading({
                    title: '修改中',
                    mask: true
                })
                setTimeout(() => {
                    uni.setStorageSync('weixinShowToast', type)
                    uni.showToast({
                        title: content,
                        icon: 'none'
                    })
                }, 2000)
            },
            toChange(type) {
                uni.showLoading({
                    title: '环境切换中',
                    mask: true
                })
                if (type) {
                    uni.setStorageSync('environment', type)
                } else {
                    uni.removeStorageSync('environment')
                }
                //清空购物车缓存，保证不同环境下缓存不冲突
                uni.setStorageSync('SELECTED_GOODS_All', {})
                setTimeout(() => {
                    uni.showToast({
                        title: '环境切换成功，重新进入小程序即可',
                        icon: 'none'
                    })
                }, 2000)
            }
        },
        created() {
            const accountInfo = uni.getAccountInfoSync();
            this.env = accountInfo.miniProgram.envVersion;
            this.environmentTitle = uni.getStorageSync('environment') ? this.$const.environment[uni.getStorageSync('environment')] : '默认选项'
            this.envTitle = this.$const.AccountInfoSync[this.env]
        }
    }
</script>

<style lang="scss" scoped>
    .order-list {
        font-size: 30rpx;

        .order-list-info {
            margin: 30rpx 0 30rpx 30rpx;
        }

        .myButton {
            margin: 20rpx 0;
        }
    }
</style>
