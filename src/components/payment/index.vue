<template>
    <view>
        <!--非软件园开通情况下-->
        <radio-group v-if="companyStaffEntity.status !== 1 && accountList != null && accountList.length > 0" class="pay-type-list page-card block">
            <block v-for="(accountItem, accountIndex) in accountList" :key="accountIndex">
                <label class="type-item" @tap="changeAccountPayType(accountItem)">
                    <image :src="'/static/images/pay/4.png'"/>
                    <view class="con">
                        <view class="tit">
                            <text>{{ accountItem.subjectType == 5 ? pageLang.org : '' }}{{ pageLang.memberPay }}</text>
                            <view class="cu-tag z" style="background-color: #E43838">{{ pageLang.suggestion }}</view>
                        </view>
                        <text>{{ pageLang.balance }}: ￥{{ accountItem.amount }}</text>
                    </view>
                    <radio class="blue" :class="selectedAccount.accountId == accountItem.accountId ? 'checked' : ''" :checked="selectedAccount.accountId == accountItem.accountId" :value="accountItem.accountId"/>
                </label>
            </block>
        </radio-group>
        <!--软件园开通情况下的支付方式-->
        <radio-group v-if="companyStaffEntity.status === 1 && cardList != null && cardList.length > 0" class="pay-type-list page-card block">
            <block v-for="(cardItem, cardIndex) in cardList" :key="cardIndex">
                <label class="type-item" @tap="changeCardType(cardItem)">
                    <!--钱包-->
                    <image v-if="cardItem.type === 'wallet'" :src="'/static/images/pay/4.png'"/>
                    <!--银行卡-->
                    <image v-if="cardItem.type === 'bankcard'" :src="`/static/images/bank/${cardItem.bankTp}.png`"/>
                    <!--微信支付-->
                    <image v-if="cardItem.type === 'WECHAT'" :src="'/static/images/pay/1.png'"/>
                    <view class="con">
                        <view class="tit">
                            <text v-if="cardItem.type === 'wallet'">钱包(剩余 ¥{{ $util.toMoney(cardItem.balance / 100) }})</text>
                            <text v-if="cardItem.type === 'bankcard'">{{ bank[cardItem.bankTp] }}({{ cardItem.bindMedium.substr(cardItem.bindMedium.length - 4) }})</text>
                            <text v-if="cardItem.type === 'WECHAT'">微信支付</text>
                            <view class="cu-tag z" style="background-color: #E43838"></view>
                        </view>
                        <text></text>
                    </view>
                    <radio class="blue"
                           :class="selectedCard.cardId == cardItem.cardId ? 'checked' : ''"
                           :checked="selectedCard.cardId == cardItem.cardId"
                           :value="cardItem.cardId"
                    />
                </label>
            </block>
        </radio-group>
        <!--支付按钮-->
        <view class="page-bottom">
            <button :style="[{backgroundColor: themeColor}]" :class=" btnBlue ? 'cu-btn': 'cu-btn btn-none'" @tap="checkPay">
            <!-- <button :class=" btnBlue ? 'cu-btn btnBlue': 'cu-btn'" @tap="checkPay"> -->
                <text>确认</text>
            </button>
        </view>
        <!--密码支付组件-->
        <zj-password-popup ref="check-password-pop" @input-ok="passwordInputOk"></zj-password-popup>
    </view>
</template>

<script>
    import { memberAccount } from '../../api/infomember'
    import {queryAccBalance, queryAccBind} from "../../api/paymentspmate";
    export default {
        name: "index",
        props:{
          btnBlue:{
            type: Boolean,
            default: false
          }
        },
        data() {
            return {
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
                havePrice: false,			//路由中是否存在需要支付的金额
                bank: this.$const.BANK,
                merchantNo: null,
                merchantData: {},
                showNumBoard: true,
                inputMoney: '',
                loadingDiscount: false,
                loading: false,
                timer: null,
                member: {},
                companyStaffEntity: {},
                accountList: [],		//软件园没认证的情况下的支付方式
                selectedAccount: {},
                cardList: [],			//软件园认证情况下的支付情况
                selectedCard: {},
                password: null,
                payDiscountPromise: null,
                payObj: {},
                queryResultCount: 0,
                queryMaxCount: 4,
                remark: '',
                popShow: false,
                couponList: [],// 优惠券列表
            }
        },
        methods: {
            //调用钱包组件查询剩余钱包金额
            queryAccBalance(accountId) {
                return queryAccBalance({
                    regionNo: this.$regionId,
                    accountId: accountId
                })
            },
            //调用银行卡组件进行查询银行卡信息
            queryAccBind(accountId) {
                return queryAccBind({
                    regionNo: this.$regionId,
                    accountId: accountId
                })
            },
            async memberAccount() {
                await memberAccount({
                    accountType: 1,
                    subjectNo: this.merchantNo,
                    appid: this.$appid,
                    isOpen: 1,
                    subjectType: 5,			//软件园项目固定是5机构会员
                    subjectId: this.$regionId,
                }, {
                    hideLoading: true,
                    hideMsg: true
                }).then(res => {
                    const obj = res.object
                    this.member = obj.member || {}
                    let account = {}
                    if (obj.account != null && obj.account.length > 0) {
                        account = obj.account[0]
                        this.accountList = obj.account.filter(item => {
                            return item.amount > 0
                        })
                        if (this.accountList.length > 0) {
                            this.selectedAccount = this.accountList[0]
                        }
                    }
                    this.companyStaffEntity = obj.companyStaffEntity || {}
                    if (this.companyStaffEntity.status === 1) { // 软件园渠道且认证通过
                        if (account.isOpenPurse != null && account.isOpenPurse === 0) { // 已开通钱包
                            uni.showLoading({
                                title: this.$t('pub').loading,
                                mask: true
                            })
                            Promise.all([
                                this.queryAccBalance(account.accountId),
                                this.queryAccBind(account.accountId)
                            ]).then(arr => {
                                let blanceObj = arr[0].object
                                this.cardList.push({
                                    cardId: blanceObj.cardId,
                                    balance: blanceObj.accountBalance,
                                    type: 'wallet'		//钱包
                                })
                                arr[1].object.records.forEach(item => {
                                    this.cardList.push({
                                        cardId: item.cardId,
                                        bankTp: item.bankTp,
                                        bindMedium: item.bindMedium,
                                        type: 'bankcard'		//银行卡
                                    })
                                })
                                if (this.cardList.length > 0) {
                                    this.selectedCard = this.cardList[0]
                                }
                                //开通钱包的情况下可以选择微信支付
                                this.cardList.push({
                                    type: 'WECHAT',		//微信
                                    cardId: 'WECHAT'	//微信支付默认id情况
                                })
                                uni.hideLoading()
                            }).catch(err => {
                                console.error(err)
                                uni.hideLoading()
                            })
                        } else {
                            //软件园渠道且认证通过但未开通钱包情况下，暂时添加微信支付，默认使用
                            this.cardList.push({
                                type: 'WECHAT',		//微信
                                cardId: 'WECHAT'	//微信支付默认id情况
                            })
                            this.selectedCard = this.cardList[0]
                            uni.hideLoading()
                            //
                            // uni.showToast({
                            // 	title: '暂未开通钱包，请先开通！',
                            // 	icon: 'none'
                            // })
                        }
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            //切换获取到的支付方式详情
            changeCardType(card) {
                this.selectedCard = card
                this.$emit('changeSelect', card)
            },
            //点击确认支付按钮
            checkPay() {
                //软件园渠道且认证通过
                if (this.companyStaffEntity.status === 1) {
                    if (this.selectedCard.cardId == null) {
                        return uni.showToast({
                            title: '没有选择支付方式',
                            icon: 'none'
                        })
                    } else if (this.selectedCard.cardId === 'WECHAT') {
                        //选择微信的情况下
                        this.doPay()
                        return
                    } else if (this.$store.state.enableMemberPassword !== 1) {
                        //验证当前账户是否需要免密支付，只要不为1，就是免密支付
                        this.doPay()
                        return
                    }
                    this.$refs['check-password-pop'].open()
                } else {
                    this.doPay()
                }
            },
            passwordInputOk(value) {
                this.password = value
                this.doPay()
                // 给父组件传递密码
                this.$emit('doPay',value)
            },
            //回调支付方式
            doPay() {

            }
        },
        created() {
            //获取当前金额情况
            this.memberAccount()
        }
    }
</script>

<style lang="scss" scoped>
    .pay-type-list {
        margin-top: 20rpx;
        padding: 8px 28rpx;
        .type-item{
            height: 108rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 30rpx;
            radio {
                transform: scale(0.7, 0.7);
            }
        }
        image {
            width: 56rpx!important;
            height: 56rpx!important;
            margin-right: 24rpx!important;
        }
        .tit{
            font-size: 28rpx;
            color: #303133;
            display: flex;
            align-items: center;
            .cu-tag.z {
                border-radius: 20rpx 20rpx 20rpx 0;
                color: #FFFFFF;
                font-size: 22rpx;
                height: auto;
                margin-left: 32rpx;
            }
        }
        .con{
            flex: 1;
            display: flex;
            flex-direction: column;
            font-size: 22rpx;
            color: #909399;
        }
    }
    .page-bottom {
        margin: 40rpx auto 0;
        text-align: center;
        button {
            background: #E43838;
            border-radius: 50rpx;
            font-size: 30rpx;
            color: #FFFFFF;
            width: 100%;
            height: 96rpx;
            line-height: 96rpx;
        }
        .btnBlue{
            background: #34A2E8 !important;
            width: 90%;
        }
        .btn-none{
            background: none !important;
            width: 90%;
        }
    }
</style>
