<template>
    <view v-show="isDialog" class="dialog">
        <view class="content">
            <view class="content-inset">
                <view class="content-inset-text color-3A1">
                    <span class="font-size-16">{{ text }}</span>
                </view>
                <view @click="isDialog=false" class="content-inset-bottom">
                    <span>关闭的情况</span>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        data () {
            return {
                isDialog: false,
                text: ''
            }
        },
        methods: {
            show (text) {

                console.log(342342342343)

                this.text = text
                this.isDialog = true
            },
            hide () {
                this.text = ''
                this.isDialog = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .dialog{
        .content{
            width: 272px;
            height: 144px;
            background: #fff;
            padding: 2px;
            border-radius: 5px;
            margin-top: 115px;
            .content-inset{
                border: 2px solid #B77F29;
                position: relative;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border-radius: 5px;
                box-shadow: 0 0 4px #ECCDA5 inset;
                background: #FFD98D;
                .close{
                    width: 24px;
                    height: 24px;
                    position: absolute;
                    right: 6px;
                    top: 6px;
                }
                .content-inset-text{
                    display: flex;
                    margin: 32px 16px 16px;
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }
                    span{
                        flex: 1;
                    }

                }
                .content-inset-bottom{
                    display: flex;
                    justify-content: center;
                    img{
                        width: 80px;
                        height: 50px;
                    }
                }
            }
        }
    }
</style>
