<template>
    <Componentsred :nowIndex="1">
        <template v-slot:code>
            <!--展示对应的页面信息-->
            <view class="content_pageInfo">
                <view>
                    <view>
                        <h3>导读介绍</h3>
                        <p>该组件库主要模拟uView-ui组件，实现uni-app组件开发</p>
                    </view>
                    <view style="margin-top: 20px">
                        <h3>组件使用方式如下</h3>

                        <div style="margin: 20px 0">
                            <p style="color: red">页面路径：<span>{{showPath}}</span></p>
                            <p style="color: red">当前页面代码： <a :href="codePath" target="_blank">点击打开链接即可查看该页面源码</a></p>
                        </div>
                    </view>
                </view>
            </view>
            <!--组件展示-->
            <iframe-item :iframeType="false">
                <template v-slot:code>
                    <!--<fhu-tabbar-item :tabList="tabList" :selectedTap="selectedTap" :themeColor="themeColor" @handleChangeTab="handleChangeTab"></fhu-tabbar-item>-->
                </template>
            </iframe-item>
        </template>
    </Componentsred>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2022/03/28 15:02
     */
    import Componentsred from '../read/componentsred'
    export default {
        data() {
            return {
                selectedTap: null,
                tabList: [
                    {
                        name: 'home',
                        icon: 'item01',
                        title: '首页',
                        barColor: 'white',
                        visible: true,
                        isFresh: false //是否刷新数据
                    }, {
                        name: 'shop',
                        icon: 'item02',
                        title: '权益',
                        barColor: 'white',
                        visible: true,
                        isFresh: false
                    },
                    {
                        name: 'shop',
                        icon: 'item02',
                        otherImage: '/static/images/icon/tab-code.png',
                        title: '一码通',
                        barColor: 'white',
                        visible: true,
                        isFresh: false
                    },
                    {
                        name: 'recommend',
                        icon: 'item04',
                        title: '购物车',
                        barColor: 'black',
                        visible: true,
                        isFresh: false
                    },
                    {
                        name: 'user',
                        icon: 'item05',
                        title: '我的',
                        barColor: 'black',
                        visible: true,
                        isFresh: false
                    }
                ],
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
            }
        },
        components: {
            Componentsred
        },
        onLoad() {

        },
        methods: {
            handleChangeTab(index, isShow = false) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .content_pageInfo {
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 310px);
    }
</style>
