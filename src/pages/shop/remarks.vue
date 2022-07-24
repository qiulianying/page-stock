<!--
 * @Descripttion: 
 * @Author: lif
 * @Date: 2021-06-18 17:46:38
-->
<template>
	<view class="remarks">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">备注</block>
		</cu-custom>
		<view class="remarks-input">
			<u-input v-model="value" :type="type" :border="border" :height="height" :auto-height="autoHeight"
				maxlength="50" placeholder="请输入备注,五十字以内" />
		</view>
		<view class="remarks-btn">
			<u-button type="primary" shape="circle" :custom-style="customStyle" @click="toSubmit">完成</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'remarks',
		components: {},
		props: {},
		data() {
			return {
				value: '',
				type: 'textarea',
				border: false,
				height: 200,
				autoHeight: true,
				shopData: {},
        customStyle: {
					background: 'linear-gradient(to right, #F46A6A , #E43838)'
				},
        themeColor: ''
			};
		},
		watch: {},
		computed: {},
		created() {},
		mounted() {
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
      this.customStyle.background = this.themeColor
    },
		beforeDestroy() {},
		onLoad(option) {
				this.value = option.remark
		},
		methods: {
			toSubmit() {
				uni.$emit("remarkBackTo", {
					remark: this.value
				})
				uni.navigateBack({
				})
        // 防止多次监听
        uni.$off("remarkBackTo")
			}
		}
	};
</script>
<style lang="scss" scoped>
	.remarks-input {
		margin: 20rpx;
		border-radius: 10rpx;
		background-color: white;
		height: 200rpx;
		padding: 10rpx;
	}

	.remarks-btn {
		position: fixed;
		bottom: 0;
		text-align: center;
		width: calc(100% - 20rpx);
		margin-bottom: 40rpx;
		left: 10rpx;
		right: 10rpx;
	}
</style>
