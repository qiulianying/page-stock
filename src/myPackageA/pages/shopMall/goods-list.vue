<template>
	<view>
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">休闲零食</block>
		</cu-custom>
		
		<view class="cu-bar search goods-list-search-box">
			<view class="search-form round">
				<text class="cuIcon-search"/>
				<text>搜索商品</text>
			</view>
			<view class="action">
				<text class="cuIcon-cart"></text>
			</view>
		</view>
		<view style="height: 100rpx;"></view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-search-box {
		position: fixed;
		width: 100%;
		z-index: 9999;
		background-color: #FFFFFF;
		padding-bottom: 10rpx;
	}
</style>
