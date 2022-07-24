<template>
    <view class="cu-bar tabbar foot"
          v-show="tabList.length > 0"
          style="background: #ffffff; box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);">
        <block v-for="(item, index) in tabList" :key="index">
            <view v-if="index === tabListCode" class="action" @tap.stop="$toView('user/user-code', true)"
                  style="background: transparent; margin-top: -16rpx;">
                <view class="cuIcon-" style="width: auto;">
                    <!-- <image src="/static/images/icon/tab-code.png" style="width: 120rpx; height: 120rpx;"></image> -->
                    <view class="bot-code-box">
                        <!-- background: linear-gradient(-45deg, #57a1e2,#0d8cfc); -->
                        <view class="bot-code" :style="{background: `linear-gradient(-45deg, ${themeColor}, ${themeShadow})`}">
                            <view class="image-box">
                                <image mode="widthFix" src="/static/images/icon/little-code.png"></image>
                            </view>
                            <view class="bot-code-note">一码通</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="item.visible" class="action" @tap.stop="handleChangeTab(index)"
                  :style="[{color: selectedTap === item.name ? themeColor : '#aaaaaa'}]">
                <view class="cuIcon-" :class="'zjIcon-' + item.icon + (selectedTap === item.name ? '_on' : '')">
                </view>
                <text>{{ item.title }}</text>
            </view>
        </block>
    </view>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2022/03/01 15:20
     */
    export default {
        name: 'fhu-tabbar-item',
        data() {
            return {}
        },
        props: {
            tabList: {
                type: Array,
                default: () => []
            }
        },
        created() {
        },
        computed: {},
        components: {},
        methods: {}
    }
</script>

<style scoped>

</style>
