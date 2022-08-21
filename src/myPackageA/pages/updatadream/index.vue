<template>
    <view>
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="content">更新梦</block>
        </cu-custom>
        <form class="cu-myUpdateDream">
            <view class="cu-form-group">
                <view class="grid col-4 grid-square flex-sub">
                    <view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
                        <image :src="imgList[index]" mode="aspectFill"></image>
                        <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
                            <text class='cuIcon-close'></text>
                        </view>
                    </view>
                    <view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
                        <text class='cuIcon-cameraadd'></text>
                    </view>
                </view>
            </view>
            <view class="cu-form-group">
                <view class="updataDreamTitle">{{modalName}}</view>
            </view>
            <view class="cu-form-group">
                <textarea maxlength="-1" @input="textareaAInput" placeholder="请描述你的努力,奋斗的样子真好看"></textarea>
            </view>
            <!--   保存按钮   -->
            <view class="page-bottom">
                <button class="cu-btn bg-theme" :disabled="!havaContent" :style="{background: themeColor}" @tap="saveAddress">保 存</button>
            </view>
        </form>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                havaContent: false,
                showInput: false,
                index: -1,
                picker: ['每天打卡', '每周打卡', '每月打卡'],
                multiIndex: [0, 0, 0],
                date: '',
                imgList: [],
                modalName: '2024 考研上岸成功',
                textareaAValue: '',
                themeColor: ''
            };
        },
        onLoad(options) {
            this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
            // 屏蔽微信右上角工具栏
            wx.hideShareMenu()
            this.date = this.$util.dateFormat(new Date(), '-')
        },
        methods: {
            PickerChange(e) {
                this.index = e.detail.value
            },
            DateChange(e) {
                this.date = e.detail.value
            },
            ChooseImage() {
                uni.chooseImage({
                    count: 9, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: (res) => {
                        if (this.imgList.length != 0) {
                            this.imgList = this.imgList.concat(res.tempFilePaths)
                        } else {
                            this.imgList = res.tempFilePaths
                        }
                    }
                });
            },
            ViewImage(e) {
                uni.previewImage({
                    urls: this.imgList,
                    current: e.currentTarget.dataset.url
                });
            },
            DelImg(e) {
                uni.showModal({
                    title: '亲爱的',
                    content: '确定要删除这段回忆吗？',
                    cancelText: '再看看',
                    confirmText: '再见',
                    success: res => {
                        if (res.confirm) {
                            this.imgList.splice(e.currentTarget.dataset.index, 1)
                        }
                    }
                })
            },
            textareaAInput(e) {
                this.textareaAValue = e.detail.value
            }
        }
    }
</script>

<style lang="scss">
    .cu-myUpdateDream {
        .cu-form-group {
            padding-top: 10rpx;

            .updataDreamTitle {
                font-weight: bold;
                color: #333333;
                font-size: 30rpx;
            }

            .saveAlbum {
                width: 100%;
                display: inline-flex;
                justify-content: space-between;
                align-items: center;
                .saveAlbumTitle {
                    margin-right: 10rpx;
                }
            }
        }

        .text-theme {
            margin-right: 15rpx;
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
    }
</style>
