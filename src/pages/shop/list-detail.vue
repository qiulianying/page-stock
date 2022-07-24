<template>
    <view>
        <cu-custom bgColor="bg-white" is-back>
            <block slot="backText" class="text-black">{{listName}}</block>
        </cu-custom>

        <view class="my_header_top">
            <view class="my_header_top_search">
                <u-search placeholder="搜索门店......" v-model="keyword" :show-action="false" @search="inputSearch()"
                    bg-color="#fff" margin="22rpx 0 0 0">
                </u-search>
            </view>
        </view>
        <view class="tab-content" v-for="(tabItem, tabIndex) in merchantTabList" :key="tabIndex">

            <view :class="'merchant-swiper-item-' + tabIndex">
                <view  class="index-shop">

                    <view v-for="shopItem in categoryList" :key="shopItem.id" class="index-shop-item"
                        @tap="$toView(`shop/shop-detail?merchantNo=${shopItem.merchantNo}`)">
                        <!-- 店铺图片 -->
                        <image class="index-shop-item-logo"
                            :src="$util.strIsEmpty(shopItem.logo) ? '/static/images/login-grey.png' : (fileBaseURL + shopItem.logo)"
                            mode="aspectFit" @error="onErrorShopLogo(shopItem)" />
                        <view class="index-shop-item-box">
                            <!-- 店铺名 -->
                            <view class="index-shop-item-title text-black">{{ shopItem.merchantName }}
                            </view>

                            <view class="index-shop-item-type">
                                <!-- 小图标 -->
                                <text class="cuIcon- zjIcon-tag_type"
                                    style="font-size: 30rpx;vertical-align: middle;"></text>
                                <!-- 店铺类型 -->
                                <text class="margin-left-xs">{{ shopItem.categoryArray[0].categoryName}}</text>
                            </view>
                            <view class="index-shop-item-address text-black">
                                <!-- 地址 -->
                                <text v-if="$util.strIsNotEmpty(shopItem.address)">{{ shopItem.address }}</text>
                                <!-- 距离 -->
                                <text
                                    v-if="location != null && shopItem.location != null">{{ $util.getDistance(location.latitude, location.longitude, shopItem.location.lat, shopItem.location.lon) }}</text>
                            </view>
                           
                        </view>
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
                imgUrl: this.$imgUrl,
                keyword: '',
                searchValue: '',
                type: 'text',
                border: true,
                location: {},
                swiperList: [],
                merchanList: {},
                categoryList: [{
                    "id": "MD1413109041353330688",
                    "merchantName": "精彩电影",
                    "merchantAlias": null,
                    "openTime": "09:00",
                    "closeTime": "23:00",
                    "logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
                    "businessLicense": "service-org-7adc24dc/20211231/7f8324b5a089496c81bf97e2d0e7f0c4.png",
                    "headPhoto": "service-org-7adc24dc/20211231/634098f99ab9484d8bfb0f7744d539f1.png",
                    "indoorPhotos": "{\"data\":[\"service-org-7adc24dc/20211231/cae29b9fb615417b9ce6392d224ffd1a.png\"]}",
                    "pauseBusiness": 0,
                    "pauseOut": null,
                    "pauseScanOrder": 1,
                    "pauseDirectPay": 1,
                    "enablePay": 1,
                    "enableAdvert": 1,
                    "enableMember": 1,
                    "memberDiscountRate": null,
                    "institutionalSettlement": null,
                    "enableCall": 1,
                    "enableOrder": 1,
                    "enablePeddle": 1,
                    "enableTakeout": 1,
                    "enableShiftChange": 0,
                    "enableStorageManage": 0,
                    "enableNegativeStorage": 0,
                    "rightsConfig": null,
                    "isDelete": 0,
                    "accountInfo": {
                        "weiXinPay": 3,
                        "aliPay": 3,
                        "unionpay": 4
                    },
                    "createTime": "2021-07-08 20:13:44",
                    "updateTime": "2022-03-25 14:27:53",
                    "createUserId": "ab1a6e905ddc41949efdfb41246c1456",
                    "merchantNo": "9ZLWBzob",
                    "regionNo": "DL1333225698034458624",
                    "managementType": 0,
                    "merchantCategory": null,
                    "categoryName": null,
                    "categoryArray": [{
                        "merchantCategory": "7d87cedb35734128be5185ebcaf2f854",
                        "categoryName": "美食",
                        "level": 1,
                        "loadType": null,
                        "goodsTemplate": null
                    }],
                    "address": "软件大道89号A区双创城",
                    "linkman": "",
                    "linkPhone": "13599098689",
                    "region": "福州软件园",
                    "province": "350000",
                    "country": null,
                    "countryName": null,
                    "city": "350100",
                    "district": "350102",
                    "street": null,
                    "provinceName": "福建省",
                    "cityName": "福州市",
                    "districtName": "鼓楼区",
                    "streetName": null,
                    "location": {
                        "lat": 26.112792972395003,
                        "lon": 119.2704301872128
                    },
                    "space": "9ZLWBzob",
                    "pid": null,
                    "userId": "daefc160e23a4b35877f1826d4f99ac2",
                    "openAllHours": 0,
                    "openVipPay": 0,
                    "merchants": null,
                    "recommendLevel": null,
                    "loadType": 0,
                    "terminal": {
                        "directpay": 1,
                        "sweepcodepay": 1,
                        "recorder": 1,
                        "autoReceipt": 0,
                        "enableTakeout": 1,
                        "enablePeddle": 1,
                        "enableCall": 1,
                        "enableMember": 1,
                        "terminalModel": 1,
                        "cashierModel": 2,
                        "enableFlagTerminal": 1,
                        "cashWay": 1,
                        "cashPay": 1,
                        "enableFixedAmount": 0,
                        "enableCallNum": 0,
                        "enableOrderNotice": 0
                    },
                    "eleAuthFlag": null,
                    "meituanAuthFlag": null,
                    "printList": null,
                    "industry": 2,
                    "origin": null,
                    "mchId": null,
                    "appid": null,
                    "startDeliveryMoney": null,
                    "payAppId": null,
                    "takeoutConfig": {
                        "businessMode": null,
                        "isOpen": null,
                        "enableMemberPay": null,
                        "packType": 1,
                        "packFee": null,
                        "deliveryType": null,
                        "deliveryCost": null,
                        "distanceFeeNotice": null,
                        "distanceItems": null,
                        "weightItems": null,
                        "weightFeeNotice": null,
                        "freeShipping": 39,
                        "enableAutoDistribution": null,
                        "timeoutDelivery": null,
                        "estimatedTime": null,
                        "sinceAddressItems": null,
                        "singleDiscountType": null,
                        "excludeFavourGoods": null,
                        "excludeMemberGoods": null,
                        "isMemberDiscount": null,
                        "isEnjoyOrderFavour": null,
                        "disCountPriorityType": null,
                        "isVoucher": null,
                        "isVoucherDisabled": null,
                        "isDiscountCoupon": null,
                        "isDiscountDisabled": null,
                        "isFullCutCoupon": null,
                        "isFullCutDisabled": null,
                        "enableDelivery": null,
                        "enableReserve": null,
                        "takeoutBusinessItems": null,
                        "enableSince": null,
                        "takeoutSinceItems": null,
                        "enableOrder": null,
                        "availableStartDays": null,
                        "availableEndDays": null,
                        "isAddArea": null,
                        "pointArr": null,
                        "deliveryScopeType": null,
                        "radius": null,
                        "enableAutoDelivery": 0,
                        "dadaSourceId": null,
                        "dadaShopId": null,
                        "dadaCityCode": null,
                        "sinceItem": {
                            "enableSince": 1,
                            "takeoutSinceItems": [],
                            "startDeliveryMoney": 0.01,
                            "sinceAddressItems": [{
                                "sinceAddress": "详见商品详情说明",
                                "phone": null,
                                "name": null
                            }],
                            "prepareTime": null,
                            "remark": "以上为线下兑换地址"
                        },
                        "deliveryItem": {
                            "enableDelivery": 1,
                            "startDeliveryMoney": 0.02,
                            "deliveryCost": 0,
                            "feeNotice": null,
                            "distanceItems": [{
                                "startDistance": null,
                                "endDistance": null,
                                "deliveryCost": null,
                                "freeShipping": null
                            }],
                            "estimatedTime": 30,
                            "freeShipping": 39,
                            "isAddArea": 0,
                            "pointArr": [],
                            "deliveryScopeType": 2,
                            "radius": null,
                            "takeoutBusinessItems": [{
                                "takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
                                "timeItems": null,
                                "businessStartTime": "08:00:00",
                                "businessEndTime": "22:00:00"
                            }],
                            "deliveryType": 1,
                            "remark": null
                        },
                        "fixItem": {
                            "enableDelivery": 1,
                            "startDeliveryMoney": 5,
                            "deliveryCost": 0,
                            "feeNotice": "",
                            "distanceItems": [{
                                "startDistance": null,
                                "endDistance": null,
                                "deliveryCost": null,
                                "freeShipping": null
                            }],
                            "addressItems": [{
                                "takeoutBusinessItems": [{
                                    "takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
                                    "timeItems": [{
                                        "orderTime": "09:00",
                                        "deliveryTime": "20:30"
                                    }, {
                                        "orderTime": "21:15",
                                        "deliveryTime": "08:15"
                                    }, {
                                        "orderTime": "20:33",
                                        "deliveryTime": "22:30"
                                    }, {
                                        "orderTime": "21:20",
                                        "deliveryTime": "23:30"
                                    }],
                                    "businessStartTime": null,
                                    "businessEndTime": null
                                }],
                                "address": "福州市鼓楼区福州软件园A区-17号楼",
                                "location": {
                                    "lng": 119.20326071874541,
                                    "lat": 26.051783569304174,
                                    "type": "gcj02"
                                }
                            }],
                            "deliveryType": 1,
                            "freeShipping": 1,
                            "remark": ""
                        },
                        "isOpenPostalTakeOut": null,
                        "postalMerchantNo": null,
                        "notice": {
                            "onlyOrderMeal": null,
                            "all": null,
                            "enableNotice": false,
                            "onlyStore": null,
                            "noticeList": []
                        }
                    },
                    "ownerPhone": "13599098689",
                    "remark": null,
                    "enableOrderUnOpenTime": 1,
                    "enableDiffTerminalRefund": 0,
                    "enableShowInStore": 1,
                    "enableRights": 0,
                    "pauseTakeOut": 0,
                    "activateStatus": null,
                    "approvalMsg": null,
                    "batchNo": null,
                    "pointConfig": {
                        "subjectId": null,
                        "subjectType": null,
                        "openVipScore": 0,
                        "enablePointPay": null,
                        "pointAccMode": null,
                        "pointExpireDays": null,
                        "pointPayPAmount": null,
                        "pointPayMAmount": null,
                        "pointGainPAmount": null,
                        "pointGainMAmount": null,
                        "pointConsumeMoney": null,
                        "pointPayLimitPercent": null,
                        "pointPayLimitMoney": null,
                        "noArray": null
                    },
                    "extra": null,
                    "extend": null,
                    "memberConfig": {
                        "enabledMemberPassword": 0,
                        "enablePhonePassword": 0,
                        "enableCardNoPassword": 0,
                        "enablePayCodePassword": 0
                    },
                    "firstCategory": null,
                    "secondCategory": null,
                    "jxwlUserId": null,
                    "brdId": null,
                    "thirdMerchantId": null,
                    "yiyaoConfig": null,
                    "goodsTemplate": null,
                    "enableWalletPay": null,
                    "qrcodeMode": 1,
                    "collectMode": null,
                    "terminalCashMode": null,
                    "digitalRestaurantStatus": null,
                    "directPayAlias": null,
                    "scanOrderAlias": null,
                    "rightsMarketingAlias": null,
                    "walletPayAlias": null,
                    "mallAlias": null,
                    "creditRating": null,
                    "tags": null,
                    "language": null,
                    "enableAppoint": 1,
                    "postalCode": null,
                    "printMsgTemplate": null,
                    "extendStr": null
                }],
                idArray: [],
                merchantSwiperHeight: 0,
                merchantTabCurIndex: 0,
                listName: '',
                listIndex: '',
                merchantTabList: [{
                    text: '',
                    loaded: false,
                    status: 'more',
                    pager: {
                        curPageNum: 0
                    },
                    list: []
                }, ],
            }
        },
        computed: {
            merchant() {
                return this.merchantTabList[this.merchantTabCurIndex]
            }
        },
        watch: {
            'merchant.list': {
                handler(val) {
                    const className = ".merchant-swiper-item-" + this.merchantTabCurIndex
                    this.initSwiperHeight(className)
                },
                immediate: true
            }
        },
        methods: {
            async onLoad(option) {
                this.listName = option.categoryName;
                uni.setNavigationBarTitle({
                    title: this.listName
                })
                this.listIndex = option.categoryIndex;
                this.idArray = option.categoryMerchantId.split(",")
            
            },
       
            initSwiperHeight(list) {
                this.$nextTick(() => {
                    uni
                        .createSelectorQuery()
                        .in(this)
                        .select(list)
                        .boundingClientRect(data => {
                            if (this.merchant.list == null || this.merchant.list.length === 0) {
                                this.merchantSwiperHeight = 300
                            } else {
                                this.merchantSwiperHeight = data ? data.height + 10 : 500
                            }
                        })
                        .exec()
                })
            },
            reachBottom() {
                if (this.merchant.pager.curPageNum === 0) {
                    return
                }
                if (this.merchant.status === 'loading' || this.merchant.loaded && (this.merchant.list == null || this
                        .merchant.list.length === 0)) {
                    return
                }
                if (this.merchant.pager.curPageNum >= this.merchant.pager.totalPageNum) {
                    return
                }
             
            },
            onErrorShopLogo(item) {
                this.$set(item, 'logo', null)
            },
            tabSelect(e) {
                this.merchantTabCurIndex = e.currentTarget.dataset.id;
            },
            changeTab(e) {
                this.merchantTabCurIndex = e.target.current
                
            },
            toView(page) {
                this.$toView(page)
            },
            toGoodsDetailView(id) {
                this.$toView(`mall/goods-detail?id=${id}`)
            },
            gotoCoupon() {
                uni.navigateTo({
                    url: `/myPackageA/pages/coupon/index`,
                });
            },
            inputSearch({
                curPageNum = 1,
                merchantName = this.keyword
            } = {}) {
                this.merchantName = this.keyword;
               
            },
            stopTouchMove() {
                return true
            }

        }

    }
</script>
<style>
    page {
        background-color: #f5f5f5;
    }
</style>

<style lang="scss" scoped>
    .my_header_top {
        position: relative;

        /*顶部搜索栏*/
        .mp-search-box {
            display: flex;
            height: 90upx;
            line-height: 90upx;
            width: 100%;
            padding: 0 40upx;
        }

        .my_header_top_search {
            width: 95%;
            margin: auto;

        }
    }

    .index-shop {
        margin: 24rpx;

        &-item {
            margin-bottom: 20rpx;
            padding: 32rpx 20rpx;
            border-radius: 16rpx;
            background: #FFFFFF;
            display: flex;

            &-logo {
                width: 144rpx;
                height: 144rpx;
                border-radius: 8rpx;
                border: 2rpx solid #F5F5F5;
            }

            &-box {
                flex: 1;
                margin-left: 24rpx;
            }

            &-title {
                width: 494rpx;
                margin-top: 2rpx;
                height: 44rpx;
                font-size: 34rpx;
                font-weight: 500;
                line-height: 44rpx;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &-type,
            &-fav,
            &-address {
                height: 34rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: #666666;
                line-height: 34rpx;
                margin-top: 16rpx;
            }

            &-address {
                display: flex;

                text {
                    &:first-child {
                        flex: 1;
                        overflow: hidden;
                        margin-right: 6rpx;
                    }
                }
            }
        }
    }
</style>