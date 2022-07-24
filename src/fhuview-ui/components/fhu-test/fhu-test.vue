<template>
    <view>
        <view class="fhu-test" @click="handleClick">
            {{number}}
        </view>
    </view>
</template>

<script>
    /**
     * @author: 冯耀华
     * @Date: 2022/04/11 17:46
     */
    export default {
        name: 'fhu-test',
        data() {
        },
        props: {
            number: {
                type: Number,
                default: 0
            }
        },
        created() {
        },
        computed: {},
        components: {},
        methods: {
            handleClick() {
                this.number++
            }
        }
    }
</script>

<style scoped lang="scss">
    .fhu-test {
        width: 100px;
        height: 100px;
        line-height: 100px;
        border-radius: 50%;
        font-size: 30px;
        text-align: center;
        background: #24292e;
        color: white;
    }
</style>
