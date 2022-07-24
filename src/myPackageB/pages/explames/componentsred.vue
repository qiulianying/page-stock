<template>
    <Componentsred :nowIndex="0">
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
                        <pre>
0、依赖安装
npm i fhuview-ui
或者使用yarn add fhuview-ui 其实我们更加推荐用yarn

1、main.js
import fhuView from "fhuview-ui";
Vue.use(fhuView);

2、在引入fhuView的全局SCSS主题文件
暂无需引入主题样式(后续根据情况添加)

3、引入fhuView基础样式
暂无需引入基础样式(后续根据情况添加)

4、配置easycom组件模式
此配置需要在项目根目录的pages.json中进行。
	"easycom": {
		"^fhu-(.*)": "fhuview-ui/components/fhu-$1/fhu-$1.vue"
	},

5、写一个测试引入的组件，如果能够看到右边能正常显示，说明组件引入成功
fhu-test
<fhu-test :number="number"></fhu-test>
                                </pre>
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
                    <fhu-test :number="number"></fhu-test>
                </template>
            </iframe-item>
        </template>
    </Componentsred>
</template>

<script>
    import {ENV_BASE_URL} from "../../../common/env";
    import Componentsred from "../read/componentsred";

    /**
     * @author: 冯耀华
     * @Date: 2022/03/28 15:02
     */
    export default {
        data() {
            return {
                number: 10,
                nowIndex: 0,
                rightRouter: [],
                codePath: '',
                myPath: '',
                myHost: '',
                showPath: '',
                codeHost: 'https://gitlab.51zcm.cc/fzsp/pageStock/raw/devTest/src',
            }
        },
        components: {
            Componentsred
        },
        onLoad() {
            // 获取缓存路由
            this.rightRouter = uni.getStorageSync('myRouter').filter((item) => {
                return item.name === 'myPackageB' && !item.hideRouter
            })
            // 获取当前域名情况
            this.myHost = ENV_BASE_URL + '/page-stock/h5/#'
            this.myPath = this.myHost + '/myPackageB/pages/read/componentsred'
            this.showPath = this.myHost + '/myPackageB/pages/read/componentsred'
            this.codePath = this.codeHost + '/myPackageB/pages/read/componentsred' + '.vue'
        },
        methods: {
            toShowRouter(path, index) {
                // 页面定位
                this.nowIndex = index
                this.myPath = this.myHost + path
                this.showPath = this.myHost + path
                this.codePath = this.codeHost + path + '.vue'
            },
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
