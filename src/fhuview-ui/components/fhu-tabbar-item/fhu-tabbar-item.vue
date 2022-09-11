<template>
    <view class="cu-bar tabbar foot"
          v-show="tabList.length > 0"
          style="background: #ffffff; box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);">
        <block v-for="(item, index) in tabList" :key="index">
            <view v-if="item.otherImage && item.visible" class="action" @tap.stop="$toView('myPackageA/pages/createdream/index', true, false, true)"
                  style="background: transparent; margin-top: -16rpx;">
                <view class="cuIcon-" style="width: auto;">
                    <view class="bot-code-box">
                        <view class="bot-code" :style="{background: `linear-gradient(-45deg, ${themeColor}, ${themeShadow})`}">
                            <view class="image-box">
                                <image mode="widthFix" :src="item.otherImage"></image>
                            </view>
                            <view class="bot-code-note">{{ item.title }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="!item.otherImage && item.visible" class="action" @tap.stop="handleChangeTab(index)"
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
            // 底部导航内容
            tabList: {
                type: Array,
                default: () => [
                    {
                        name: 'home',
                        icon: 'item01',
                        title: '首页',
                        visible: true,  //是否显示
                        isFresh: false  //是否刷新数据
                    },
                    {
                        name: 'shop',
                        icon: 'item02',
                        title: '权益',
                        visible: false,
                        isFresh: false
                    }
                ]
            },
            // 底部导航默认选中
            selectedTap: {
                type: String,
                default: 'home'
            },
            // 主题样式
            themeColor: {
                type: String,
                default: '#34A2E8'
            },
            tabListCode: {
                type: Number,
                default: 1
            },
            // 阴影样式
            themeShadow: {
                type: String,
                default: '#34A2E8'
            },
        },
        created() {
        },
        computed: {},
        components: {},
        methods: {
            handleChangeTab(index, item) {
                this.$emit('handleChangeTab', index)
            }
        }
    }
</script>

<style scoped lang="scss">
    .bot-code-box{
        width: 140rpx;
        height: 140rpx;
        border-radius: 140rpx;
        background: #fff;
        margin: -8rpx auto 0;
        overflow: hidden;
        .bot-code{
            width: 116rpx;
            height: 116rpx;
            border-radius: 116rpx;
            margin: 12rpx auto;
            overflow: hidden;
            .image-box{
                width: 38rpx;
                height: 36rpx;
                margin: 20rpx auto 0;
                image{
                    width: 38rpx;
                }
            }
            .bot-code-note{
                font-size: 18rpx;
                margin-top: 20rpx;
                color: #fff;
            }
        }
    }
</style>
