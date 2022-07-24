<template>
    <Componentsred :nowIndex="2">
        <template v-slot:code>
            <!--展示对应的页面信息-->
            <view class="content_pageInfo">
                <view>
                    <view>
                        <h3>导读介绍</h3>
                        <p>全局方法：this.$fhu.journalweb()</p>
                        <p>该方法主要会调用王丰接口，进行不同项目埋点访问量等各类数据统计</p>
                        <p>只要fhu对应依赖有按照文档引入，即可使用该方法，方法中自动写入了参数判断</p>
                    </view>
                    <view style="margin-top: 20px">
                        <button class="cu-btn" @click="toJournalweb()">点击执行日志处理</button>
                        <p>点击按钮可以通过控制台查看接口调用情况，有调用：该接口就是成功</p>
                        <h3 style="margin-top: 30px">组件使用案例代码如下：</h3>
                        <pre>
button class="cu-btn" @click="toJournalweb()"
toJournalweb() {this.$fhu.journalweb()}

this.$fhu.journalweb()可选传入参数：
userinfo：用户信息 String || Object || Number   //任何能表面用户身份的信息均可，包括用户id，名称，或者一起都传过来
projectinfo：项目名称 String

范例：
let userinfo = { name: '小明' }
let projectinfo = '福元宝'
this.$fhu.journalweb(userinfo, projectinfo)

                        </pre>
                    </view>
                    <view style="margin: 20px 0">
                        <p>如果是属于jsp的旧版本项目的微信公众号页面，不方便依赖下载的，可以通过下载或者引入下面对应js引入实现</p>
                        <button class="cu-btn" @click="toUrl()">https://spdev.51zcm.cc/page-stock/otherh5/js/journal.js</button>
                        <pre>
// 全局引入js之后，执行埋点日志，参数同上
myPrivate.myJournalFunction(userinfo, projectinfo)
                        </pre>
                    </view>
                </view>
            </view>
        </template>
    </Componentsred>
</template>

<script>
    import Componentsred from "../read/componentsred";

    /**
     * @author: 冯耀华
     * @Date: 2022/05/06 16:53
     */
    export default {
        data() {
            return {}
        },
        created() {
        },
        computed: {},
        components: {
            Componentsred
        },
        methods: {
            toJournalweb() {
                this.$fhu.journalweb()
            },
            toUrl() {

                uni.downloadFile({
                    url: 'https://spdev.51zcm.cc/page-stock/otherh5/js/journal.js',
                    success: (res) => {
                        if (res.statusCode === 200) {
                                console.log('下载成功');
                                console.log(res)
                                const a = document.createElement("a");
                                a.download = 'journal.js';
                                    a.href = res.tempFilePath
                                a.click();
                        }
                    },
                    fail:(err)=>{
                        console.log(err)
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
