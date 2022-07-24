<template>
	<view class="user-user-bankcard-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">银行卡</block>
		</cu-custom>
		<view v-if="visible.page" class="page-box flex flex-direction">
			<view class="flex align-center">
				<view class="flex align-center">
					<text class="text-xl text-bold">银行卡</text>
					<text class="text-xl text-bold text-theme" :style="[{color: themeColor}]">（{{ cardCount }}）</text>
				</view>
				<text class="flex-sub"></text>
				<view class="flex align-center" @tap="$toView('user/user-bankcard-add')">
					<text class="text-xxl margin-right-xs">
						<text class="cuIcon-roundadd"></text>
					</text>
					<text class="text-df">添加</text>
				</view>
			</view>
			<view class="flex flex-direction">
				<bank-item style="margin-top:22rpx;" v-for="(item) in cardList" :key="item.cardId"
					:bank-code="item.bankTp" :card-code="item.bindMedium"
					@tap="$toView(`user/user-bankcard-detail?cardId=${ item.cardId }&bindMedium=${ item.bindMedium }&bankTp=${ item.bankTp }`, true)" />
			</view>
			<zj-empty v-if="cardList == null || cardList.length === 0" text="暂未绑定银行卡"
				:img="`${imgUrl}1639019849000/pic_cardbag.png`" />
			<button class="cu-btn bg-theme"  :style="{background: themeColor}" @tap="$toView('user/user-bankcard-add')">
			
				<text class="cuIcon-roundadd margin-right-xs"></text>添加银行卡</button>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				imgUrl: this.$imgUrl,
				visible: {
					page: true
				},
				cardList: [],
				cardCount: 0,
				themeColor: ''
			}
		},
		methods: {
			async queryAccBind() {
				this.cardList = [{
					"bindMedium": "623052*********1775",
					"protocolId": "02021121511401233680",
					"accountFlag": 1,
					"cardId": 1117,
					"bankTp": "103",
					"status": "0"
				}]
				this.cardCount = 1
			}
		},
		 onLoad(option) {
			 this.$onLaunched
			this.queryAccBind()
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.user-user-bankcard-page {
		.page-box {
			margin: 0 24rpx;
			padding: 24rpx;

			button {
				margin: 24rpx 0;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}
		}
	}
</style>