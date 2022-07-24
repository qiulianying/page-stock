<template>
	<view style="padding-bottom: 100rpx;">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">分类</block>
		</cu-custom>
		<scroll-view class="mall-category-left" :style="{top: `${CustomBar}px`}" scroll-y enable-back-to-top>
			<view v-for="(item, index) in categoryData" :key="index" class="category-list" :class="[{ 'text-red bg-white text-bold': selectedIndex == index }]" @tap="onChangeType(index)">
				<view class="line" :class="[{ 'bg-red': selectedIndex == index }]"></view>
				{{ item.name }}
			</view>
		</scroll-view>
		<scroll-view scroll-y class="mall-category-right" enable-back-to-top scroll-with-animation>
			<view class="item-box" v-if="categoryData.length">
				<view class="category-item" v-for="(categoryItem, categoryIndex) in categoryData[selectedIndex].children" :key="categoryIndex" @tap="toGoodListView(categoryItem.id)">
					<image class="category-item-img" lazy-load :src="categoryItem.image" mode="aspectFill"></image>
					<text class="category-item-title">{{ categoryItem.name }}</text>
				</view>
				<view class="category-item" @tap="toGoodListView(categoryData[selectedIndex].id)">
					<view class="cuIcon- zjIcon-more" style="font-size: 76rpx; line-height: 150rpx; color: #A9A9A9;"></view>
					<text class="category-item-title">全部</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				selectedIndex: 0,
				categoryData: [{
					"id": 4,
					"name": "服饰鞋包",
					"children": [{
						"id": 6,
						"name": "男士衬衫",
						"image": "https://api.7wpp.com/uploads/20200929/80749ed38259d70d2347a9d3157421bd.png"
					}, {
						"id": 7,
						"name": "男士POLO衫",
						"image": "https://api.7wpp.com/uploads/20200929/80afcfb2714ffea3190d733188edb6e3.png"
					}, {
						"id": 8,
						"name": "男士外套",
						"image": "https://api.7wpp.com/uploads/20200929/d983527b292e17305e94f6be3b2f757f.jpg"
					}, {
						"id": 10,
						"name": "女士衬衫",
						"image": "https://api.7wpp.com/uploads/20200929/e7d6dd5cc11b863203287e05976d5665.jpg"
					}, {
						"id": 11,
						"name": "女士外套",
						"image": "https://api.7wpp.com/uploads/20200929/bdfb38417cb9058be3a89c6b8c8ee2c6.png"
					}]
				}, {
					"id": 13,
					"name": "居家生活",
					"children": [{
						"id": 15,
						"name": "床垫床褥",
						"image": "https://api.7wpp.com/uploads/20200930/06b66796800b7f4aeab8470cb4a89321.png"
					}, {
						"id": 16,
						"name": "床品件套",
						"image": "https://api.7wpp.com/uploads/20200930/33d7ec68ef16a1d5f6109d1eb9a11f2e.png"
					}, {
						"id": 17,
						"name": "被枕套毯",
						"image": "https://api.7wpp.com/uploads/20200930/c47d0495436320166f7bc43b420895db.png"
					}]
				}, {
					"id": 29,
					"name": "个护清洁",
					"children": [{
						"id": 31,
						"name": "护肤",
						"image": "https://api.7wpp.com/uploads/20200930/785a2e879c1542d4e678bed8a2ff1cd2.jpg"
					}]
				}, {
					"id": 41,
					"name": "蔬菜菌菇",
					"children": [{
						"id": 43,
						"name": "空心菜",
						"image": "https://api.7wpp.com/uploads/20201004/b26976d249f1572f8d6e826831b633f5.jpg"
					}, {
						"id": 44,
						"name": "荷兰豆",
						"image": "https://api.7wpp.com/uploads/20201004/109202a7577881a3ac1f2628e627a18d.jpg"
					}, {
						"id": 45,
						"name": "艾草3",
						"image": "https://api.7wpp.com/uploads/20201004/e789b2a95a14d1398480e40727dde864.jpg"
					}]
				}]
			}
		},
		computed: {},
		methods: {
			onChangeType(id) {
				this.selectedIndex = id
			},
			toGoodListView(id) {
				this.$toView(`mall/goods-list?categoryId=${id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mall-category-left {
		background-color: #F6F6F6;
		position: fixed;
		z-index: 1000;
		width: 200rpx;
		bottom: 100rpx;
		.category-list {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 84rpx;
			position: relative;
			width: 200rpx;
			font-size: 26rpx;
			.line {
				width: 6rpx;
				height: 100%;
				position: absolute;
				left: 0;
			}
		}
	}
	.mall-category-right {
		margin-left: 200rpx;
		width: auto;
		.item-box {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			padding: 10rpx;
			.category-item {
				width: 33.33%;
				padding: 26rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				&-img {
					width: 150rpx;
					height: 150rpx;
				}
				&-title {
					font-size: 24rpx;
					line-height: 24rpx;
					margin-top: 24rpx;
					width: 150rpx;
					text-align: center;
				}
			}
		}
	}
</style>
