<template>
	<view class="user-user-bankcard-support-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">支持银行卡列表</block>
		</cu-custom>
		<view class="bank-list block">
			<block v-for="(name, no) in bank" :key="no">
				<label class="bank-item">
					<image :src="`/static/images/bank/${no}.png`"/>
					<view class="con">
						<text>{{ name }}</text>
					</view>
				</label>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bank: this.$const.BANK
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.user-user-bankcard-support-page{
		.bank-list {
			padding: 0 24rpx 0 48rpx;
			.bank-item{
				height: 96rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0px 2rpx 0px 0px #F4F5F7;
			}
			image {
				width: 48rpx!important;
				height: 48rpx!important;
				margin-right: 24rpx!important;
			}
			.con{
				flex: 1;
				font-size: 34rpx;
				color: #333333;
			}
		}
	}
</style>
