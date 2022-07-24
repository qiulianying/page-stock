<template>
    <view class="user-user-coupon-list-page my-rights-page">
        <cu-custom bgColor="bg-white" is-back>
            <block slot="backText" class="text-black">{{pageTitle}}</block>
        </cu-custom>

        <view class="coupon-all">
            <view class="tab-box">
                <!--修改默认样式的切换组件-->
                <view class="scroll-box" v-if="fromMember!='true'">
                    <scroll-view-tab :navList="navList" :tabCurrentIndex="tabCurrentIndex" @tabSelect="tabSelect">
                    </scroll-view-tab>
                </view>
                <view class="show-textInfo">
                    <view>可使用(共{{record.totalCount || 0}}张)</view>
                    <view @tap="tabSelectHistory">历史记录</view>
                </view>
            </view>
            <view :style="{'padding-top': `${tabBar}rpx`}">
                <scroll-view class="list-scroll-content" scroll-y>
                    <view v-for="(row, index) in navList[tabCurrentIndex].list" :key="index"
                        class="list-scroll-content-item">
                        <!-- 代金券列表 -->
                        <view v-if="tabCurrentIndex === 0">
                            <view class="coupon-item" @tap="toCouponDetail(row)">
                                <view class="coupon-item-left">
                                    <!--如果没有图片就使用默认图片-->
                                    <image
                                        :src="row.pic ? spMatefileBaseURL + row.pic + fixStr : '../../../static/logo.png'"
                                        mode="aspectFit" />
                                </view>
                                <view class="coupon-item-center">
                                    <view class="title">{{ row.title }}</view>
                                    <view class="term" v-if="row.expiry.startDate && row.expiry.endDate">
                                        <view>有效期：</view>{{ row.expiry.startDate }} ~ {{ row.expiry.endDate }}
                                    </view>
                                    <view class="term" v-else>
                                        <view>有效期：</view>永久有效
                                    </view>
                                </view>
                                <view class="coupon-item-right invalid">
                                    <view class="ticket" :style="{color: themeColor}">
                                        <view class="unit">￥</view>
                                        <view class="num">{{ row.ticket }}</view>
                                    </view>
                                    <view class="criteria">满{{ row.criteria }}可用</view>
                                </view>
                            </view>
                            <view class="showRule">
                                <view class="showRuleClick" @tap="showRuleClick(row.id)">
                                    使用规则
                                    <image class="arrow-img" v-if="showRuleInfo === row.id"
                                        :src="'/static/images/down-arrow.png'" />
                                    <image class="arrow-img" v-else :src="'/static/images/right-arrow.png'" />
                                </view>
                                <!--这里的去使用只有绑定钱包情况下的小程序才有-->
                                <!-- #ifdef MP-WEIXIN -->
                                <view class="use">
                                    <button class="my-cu-btn bg-theme" :style="{background: themeColor}"
                                        @tap.stop="toUserCodeView(navList[tabCurrentIndex].status === 0)">去使用</button>
                                </view>
                                <!-- #endif -->
                            </view>
                            <!--对应展示规则-->
                            <view v-show="showRuleInfo === row.id" class="showRuleInfoClass">
                                <view v-html="formatRichText(row.useRule)" v-if="row.useRule"></view>
                                <view v-else>暂无使用规则</view>
                            </view>
                        </view>
                        <!-- 权益列表 -->
                        <view v-else>
                            <view class="coupon-item" @tap="toCardDetail(row)">
                                <view class="coupon-item-left">
                                    <!--如果没有图片就使用默认图片-->
                                    <image
                                        :src="row.rightLogo ? spMatefileBaseURL + row.rightLogo + fixStr : '/static/logo.png'"
                                        mode="aspectFit" />
                                </view>
                                <view class="coupon-item-center">
                                    <view class="title">{{ row.rightsName }}</view>
                                    <view class="term" v-if="row.expireTime">
                                        <!-- <view>有效期：</view>{{ getDate(row.createTime) }} ~
                                        {{ getDate(new Date(row.expireTime).getTime()) }} -->
                                        <view v-if="row.startTime">
                                            <view>有效期：</view>{{ getDate(new Date(row.startTime).getTime()) }} ~
                                            {{ getDate(new Date(row.expireTime).getTime()) }}
                                        </view>
                                        <view v-else>
                                            <view>有效期：</view>{{ getDate(row.createTime) }} ~
                                            {{ getDate(new Date(row.expireTime).getTime()) }}
                                        </view>
                                    </view>
                                    <view class="term" v-else>
                                        <view>有效期：</view>永久有效
                                    </view>
                                    <view class="right-num" v-if="row.channelType==2 && row.num">x{{row.num || 0}}
                                    </view>
                                </view>

                            </view>
                            <view class="showRule">
                                <view class="showRuleClick" @tap="showRuleClick(row.id)">
                                    使用规则
                                    <image class="arrow-img" v-if="showRuleInfo === row.id"
                                        :src="'/static/images/down-arrow.png'" />
                                    <image class="arrow-img" v-else :src="'/static/images/right-arrow.png'" />
                                </view>
                                <view class="use" @tap="toCardDetail(row)">
                                    <button class="my-cu-btn bg-theme" :style="{background: themeColor}">去使用</button>
                                </view>
                            </view>
                            <!--对应展示规则-->
                            <view v-show="showRuleInfo === row.id" class="showRuleInfoClass">
                                <view v-html="formatRichText(row.useRule)" v-if="row.useRule"></view>
                                <view v-else>暂无使用规则</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <zj-empty v-if="navList[tabCurrentIndex].list.length === 0" :text="textNote"
                :img="`${imgUrl}1639019849000/pic_coupon.png`" />
            <!-- <uni-load-more v-else :status="record.status"></uni-load-more> -->
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                imgUrl: this.$imgUrl,
                textNote: '没有可用的优惠券哦~',
                pageTitle: '',
                fromMember: false,
                shopInfo: {},
                showRuleInfo: '',
                CustomBar: this.CustomBar,
                tabBar: 250, // 除列表外的顶部高度
                tabCurrentIndex: 0,
                scrollLeft: 0,
                navList: [{
                        status: 0,
                        text: '代金券',
                        list: [{
                            criteria: 1.01,
                            expiry: {
                                endDate: "2022-04-29",
                                startDate: "2022-03-30"
                            },
                            id: "SPDJQ164860914777369830",
                            pic: "service-org-7adc24dc/20211216/32d15c25d8164cb08f2383534d8976e9.png",
                            ticket: 1,
                            title: "导出代金券",
                            useRule: undefined,
                        }]
                    },
                    {
                        status: 1,
                        text: '权益卡',
                        list: []
                    }
                ],
                params: {}, //代金券传参
                paramsCard: {}, //卡传参
                fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
                paramsCopy: {},
                themeColor: '',
                record: {
                    curPageNum: 1,
                    pageSize: 20
                },
                subjectType: 5, //1代表门店  5代表渠道
                navBag: [{
                    rightsName: '1元权益',
                    id: '11123',
                    rightNo: 'fwurwie2',
                    rightId: 'jjk3'
                }, {
                    rightsName: '2元权益',
                    id: '111231',
                    rightNo: 'fwurwie21',
                    rightId: 'jjk31'
                }]
            }
        },
        onLoad(option) {
            let _this = this
            this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
            // 判断从代金券还是权益卡跳回来
            // if (option && option.tabIndex) {
            //     this.tabCurrentIndex = parseInt(option.tabIndex)
            // }
            this.pageTitle = '我的卡劵包'
            // 判断是否从门店会员中心进来
            console.log(option)
            if (option && option.fromMember) {
                this.fromMember = option.fromMember
                this.shopInfo = JSON.parse(option.shopInfo)
                this.tabCurrentIndex = 0
                this.pageTitle = '我的代金券' // todo需要判断h5还是小程序
                this.tabBar = 140 // 去掉切换，高度减少
            }
           
        },
        onShow() {
           
            this.record.curPageNum = 1
            let data = JSON.parse(uni.getStorageSync('loginInfo'))
            if (data.phone && data.phone !== '' && data.phone !== undefined) {
                this.params = {
                    appid: data.appid,
                    openid: data.openid,
                    phone: data.phone,
                }
                this.paramsCopy = {
                    appid: data.appid,
                    openid: data.openid,
                    phone: data.phone,
                }
                this.couponData()
            }
        },
        methods: {
            // 时间戳格式化
            getDate(value) {
                if (typeof (value) == 'undefined') {
                    return ''
                } else {
                    let date = new Date(parseInt(value))
                    let y = date.getFullYear()
                    let MM = date.getMonth() + 1
                    MM = MM < 10 ? ('0' + MM) : MM
                    let d = date.getDate()
                    d = d < 10 ? ('0' + d) : d
                    let h = date.getHours()
                    h = h < 10 ? ('0' + h) : h
                    let m = date.getMinutes()
                    m = m < 10 ? ('0' + m) : m
                    let s = date.getSeconds()
                    s = s < 10 ? ('0' + s) : s
                    return y + '.' + MM + '.' + d
                }
            },
            tabSelectHistory() {
                switch (this.tabCurrentIndex) {
                    case 0:
                        // 传递判断是否是门店会员进来的标识
                        let fromMember = this.fromMember
                        if (this.fromMember) {
                            let shopInfo = JSON.stringify(this.shopInfo)
                            this.$toView(
                                `/myPackageA/pages/userCoupon/user-coupon-list?fromMember=${fromMember}&shopInfo=${shopInfo}`,
                                true, false, true)
                        } else {
                            this.$toView(`/myPackageA/pages/userCoupon/user-coupon-list?fromMember=${fromMember}`, true,
                                false, true)
                        }
                        break;
                    case 1:
                        // this.$toView(`user/user-card-list?subjectId=${this.$regionId}&subjectType=${this.subjectType}`, true)
                        this.$toView(
                            `/myPackageA/pages/user/user-card-list?subjectId=${this.$regionId}&subjectType=${this.subjectType}`,
                            true, false, true)
                        break;
                    default:
                        break
                }
            },
            tabSelect(e) {
                if (this.tabCurrentIndex == e.currentTarget.dataset.id) {
                    return
                }
                this.tabCurrentIndex = e.currentTarget.dataset.id
                this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
                if (this.tabCurrentIndex == 0) {
                    this.textNote = '没有可用的优惠券哦~'
                } else {
                    this.textNote = '没有可用的权益卡哦~'
                }
                // 切换时将页数置为1
                this.record.curPageNum = 1
                this.couponData()
            },
            changeTab(e) {
                this.tabCurrentIndex = e.target.current
                if (this.tabCurrentIndex == 0) {
                    this.textNote = '没有可用的优惠券哦~'
                } else {
                    this.textNote = '没有可用的权益卡哦~'
                }
                this.couponData()
            },
            toUserCodeView(canUse) {
                if (canUse) {
                    this.$toView('user/user-code', true)
                }
            },
            onReachBottom() {
                if (this.record.curPageNum === 0) {
                    return
                }
                if (this.record.status === 'loading' || this.record.loaded && (this.navList[this.tabCurrentIndex]
                        .list == null || this.navList[this.tabCurrentIndex].list.length === 0)) {
                    return
                }
                if (this.record.curPageNum >= this.record.totalPageNum) {
                    return
                }
                this.record.curPageNum = ++this.record.curPageNum
                this.couponData()
            },
            couponData() {
                let storeLogo = ''
                switch (this.tabCurrentIndex) {
                    case 0:
                        this.params.requestPage = {
                            curPageNum: this.record.curPageNum,
                            pageSize: this.record.pageSize
                        }
                        this.params.regionNo = this.$regionId
                        this.params.status = [this.tabCurrentIndex]
                        // 从门店会员进来需要加字段
                        if (this.fromMember) {
                            this.params.merchantID = this.shopInfo.merchantNo
                        }
                        // 调用代金券查询接口
                   
                        break;
                    case 1:
                        // 调用卡包查询接口
                        this.paramsCard = {
                            pager: {
                                curPageNum: this.record.curPageNum,
                                pageSize: this.record.pageSize
                            },
                            subjectId: this.$regionId, //传渠道Id或者门店Id
                            subjectType: this.subjectType, //1代表门店  5代表渠道
                            status: 1 //1代表未使用，2代表已使用 3代表已过期
                        }
                   
                        break;
                    default:
                        break
                }
            },
            // 代金券
            toCouponDetail(row) {
                if (this.tabCurrentIndex === 0) {
                    uni.navigateTo({
                        url: `/myPackageA/pages/userCoupon/user-coupon-detail?id=${row.id}&isCoupon=${true}&orgName=${row.title}&params=${this.paramsCopy}&status=${this.tabCurrentIndex}`
                    })
                }
            },
            // 跳转卡劵包
            // toCardDetail(rightNo, rightId, id) {
            toCardDetail(row) {
                console.log('row----------', row)
                uni.navigateTo({
                    url: `/myPackageA/pages/userCoupon/user-coupon-detail?channelType=${row.channelType}&id=${row.rightNo}&goodsId=${row.rightId}&subjectId=${this.$regionId}&subjectType=${this.subjectType}&cardId=${row.id}&status=${0}`
                })
            },
            showRuleClick(id) {
                console.log('id', id)
                this.showRuleInfo === id ? this.showRuleInfo = '' : this.showRuleInfo = id
                console.log('showRuleInfo', this.showRuleInfo)
            },
            /**
             * 控制小程序中图片大小
             */
            formatRichText(html) {
                if (html) {
                    return html.replace(/\<img/gi, '<img style="width: 100%"; height: 370rpx')
                }
                return
            },
        }
    }
</script>

<style>
    page {
        height: 100%;
    }

    .my-rights-page .nav .cu-item {
        padding: 0 0;
    }

    .my-rights-page .my-cu-btn {
        width: 144rpx !important;
        height: 46rpx !important;
        line-height: 46rpx !important;
        font-size: 28rpx !important;
        border-radius: 46rpx !important;
        overflow: hidden;
    }
</style>
<style lang="scss">
    .user-user-coupon-list-page {
        height: 100%;

        .tab-box {
            padding: 20rpx;
            box-sizing: border-box;
            width: 100%;
            // height: 230rpx;
            position: fixed;
            left: 0;
            z-index: 100;
            background: #f5f5f5;
        }

        .scroll-box {
            margin-bottom: 20rpx;
        }

        .show-textInfo {
            width: 100%;
            height: 100rpx;
            background: #FFFFFF;
            padding: 0 50rpx;
            display: inline-flex;
            animation-fill-mode: backwards;
            justify-content: space-between;
            align-items: center;
            font-size: 30rpx;
        }

        .coupon-list-box {
            overflow: hidden;
        }

        .list-scroll-content {
            height: 100%;
            display: block;
            position: relative;


            .list-scroll-content-item {
                background-color: #fff;
                border-radius: 12rpx;
                margin: 0 22rpx 20rpx;

                .coupon-item {
                    max-height: 180rpx;
                    position: relative;
                    overflow: hidden;
                    display: flex;

                    &:first-child {
                        // margin-top: 32rpx;
                    }

                    &:last-child {
                        // margin-bottom: 32rpx;
                    }

                    &-left {
                        image {
                            width: 120rpx;
                            height: 120rpx;
                            margin: 30rpx 10rpx 0 30rpx;
                            border: 2rpx solid rgba(0, 0, 0, 0.01);
                            border-radius: 50%;
                        }
                    }

                    &-center {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        position: relative;

                        .right-num {
                            position: absolute;
                            right: 50rpx;
                            top: 104rpx;
                            font-size: 32rpx;
                        }

                        .title {
                            padding-top: 40rpx;
                            width: 300rpx;
                            margin: 0 5%;
                            font-size: 30rpx;
                            line-height: 1.2;
                            overflow: hidden;
                            flex: 1;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            align-content: normal;
                        }

                        .term {
                            width: 90%;
                            margin: 0 5%;
                            font-size: 24rpx;
                            color: #999999;
                            // height: 66rpx;
                            height: 90rpx;
                        }
                    }

                    &-right {
                        display: flex;
                        flex-wrap: wrap;
                        text-align: center;
                        flex-shrink: 0;
                        justify-content: center;
                        width: 28%;

                        .ticket,
                        .criteria {
                            width: 100%;
                        }

                        .ticket {
                            line-height: 1;
                            margin-top: 40rpx;
                            display: flex;
                            justify-content: center;
                            align-items: baseline;

                            .num {
                                font-size: 68rpx;
                            }

                            .unit {
                                font-size: 24rpx;
                            }
                        }

                        .criteria {
                            justify-content: center;
                            font-size: 24rpx;
                            margin-top: 20rpx;
                        }

                        .use {
                            height: 40rpx;
                            line-height: 40rpx;
                            font-size: 24rpx;
                            background-color: #fff;
                            color: #34A2E8;
                            border-radius: 28rpx;
                            padding: 0 20rpx;
                            margin-top: -10rpx;
                        }
                    }
                }

                .showRule {
                    display: inline-flex;
                    justify-content: space-between;
                    align-content: center;
                    width: 100%;
                    padding: 10rpx 30rpx 26rpx;

                    .showRuleClick {
                        margin-top: 10rpx;
                        font-size: 26rpx !important;
                        display: flex;
                        align-items: center;

                        .arrow-img {
                            width: 16rpx;
                            height: 16rpx;
                            margin-left: 2rpx;
                        }
                    }
                }

                .showRuleInfoClass {
                    color: #666666;
                    padding: 10rpx 30rpx;
                }
            }
        }
    }

    ::v-deep .uni-load-more {
        margin-bottom: 60px;
    }
</style>