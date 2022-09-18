<!--这里对zy-search组件进行修改，部分图片直接改为字体icon模式-->
<template name="zy-search">
	<view>
		<view class="search">
			<!-- #ifdef APP-PLUS -->
<!--				<image src="../../static/zy-search/voice.svg" mode="aspectFit" @click="startRecognize()" class="voice-icon"></image>-->
			<!-- #endif -->
<!--			<template v-if="isFocus">
				<input maxlength="20" class="mysearchInput" focus type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词" v-model.trim="searchText"/>
			</template>-->
			<template>
				<input maxlength="20" class="mysearchInput" type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词" v-model.trim="searchText"/>
			</template>
		</view>
<!--		<view :class="'s-' + theme" v-if="hList.length > 0">
			<view class="header">
				历史记录
        <text class="cuIcon-delete text-theme imageIcon" @click="delhistory"></text>
			</view>
			<view class="list">
				<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>-->
		<view :class="'wanted-' + theme" v-if="showWant">
			<view class="header">猜你想要的</view>
			<view class="list">
				<view v-for="(item,index) in hotList" :key="index" @click="keywordsClick(item)">{{item.topicName}}</view>
			</view>
		</view>
<!--  删除历史记录  -->
<!--    <u-modal v-model="showDeleteHistory" :show-cancel-button="true" :content="content" @cancel="showDeleteHistory = false" @confirm="delhistory">
    </u-modal>-->
	</view>
</template>

<script>
	import { getTopic, CreateTopic } from '../../api/createdream'
	export default{
		name:"zy-search",
		props:{
			isFocus:{	//是否自动获取焦点
				type: Boolean,
				default: false
			},
			theme:{	//选择块级显示还是圆形显示
				type: String,
				default: 'block'
			},
			showWant:{	//是否展示推荐菜单
				type: Boolean,
				default: false
			},
			speechEngine: { //语音引擎=>讯飞:iFly,百度:'baidu'
				type: String,
				default: 'baidu'
			}
		},
		data() {
			return {
        		showDeleteHistory: false,
        		content: '该操作将删除之前的历史记录，请确认是否继续',
				searchText:'',								//搜索关键词
				hList:uni.getStorageSync('search_cache'),		//历史记录
				hotList: []
			};
		},
		methods: {
			clearInfo() {
				this.searchText = ''
			},
			searchStart: function() {	//触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
				} else {
          			// 进行历史记录搜索缓存保存
					_this.$emit('getSearchText', _this.searchText);
					// 根据输入内容进行搜索，如果没有内容就直接创建并关闭
					getTopic(`?name=${_this.searchText}`).then(res => {
						if (res.code == '0' && res.data) {
							if (res.data.length > 0) {
								this.hotList = res.data
							} else {
								CreateTopic({
									topicName: _this.searchText
								}).then(response => {
									// 创建完成直接关闭并返回填写
									this.$emit('mySearchInfo', response.data)
								})
							}
						}
					})
					uni.getStorage({
						key:'search_cache',
						success(res){
							let list = res.data;
							if(list.length > 5){
								for(let item of list){
									if(item == _this.searchText){
										return;
									}
								}
								list.pop();
								list.unshift(_this.searchText);
							}else{
								for(let item of list){
									if(item == _this.searchText){
										return;
									}
								}
								list.unshift(_this.searchText);
							}
							_this.hList = list;
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						},
						fail() {
							_this.hList = [];
							_this.hList.push(_this.searchText);
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
							_this.$emit('getSearchText', _this.searchText);
						}
					})
				}
			},
			keywordsClick (item) {	//关键词搜索与历史搜索
				this.searchText = item;
				// this.searchStart();
				this.$emit('mySearchInfo', item)
			},
			delhistory () {		//清空历史记录
				this.hList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			},
			startRecognize: function() {	//语音输入
				let _this = this;
				let options = {};
				options.engine = _this.speechEngine;
				options.punctuation = false; // 是否需要标点符号
				options.timeout = 10 * 1000;
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search{
		width: 80%;
		margin: 30rpx auto 0;
		position: relative;

    .mysearchInput {
      background-color: #F7F7F7;
      border-radius: 50rpx;
      font-size: 28rpx;
      padding: 10rpx 44rpx;
      height: 70rpx;
      line-height: 70rpx;
    }
		.voice-icon{
			width: 36rpx;
			height: 36rpx;
			padding: 16rpx 20rpx 16rpx 0;
			position: absolute;
			left: 16rpx;
			top: 4rpx;
			z-index: 10;
		}
		.search-icon{
			width: 36rpx;
			height: 36rpx;
			padding: 16rpx 20rpx 16rpx 0;
			position: absolute;
			right: 0;
			top: -2rpx;
			z-index: 10;
		}
	}
  /**/
	.s-block{
		margin-top: 30rpx;
		.header{
			font-size: 32rpx;
			padding: 30rpx;
			position: relative;
			image{
				width: 36rpx;
				height: 36rpx;
				padding: 10rpx;
				position: absolute;
				right: 40rpx;
				top: 24rpx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28rpx;
				box-sizing: border-box;
				text-align: center;
				padding: 20rpx 0;
				border-top: 2rpx solid #FFF;
    			border-left: 2rpx solid #FFF;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				background-color: #F7F7F7;
			}
		}
	}
  /*环形*/
	.s-circle{
		margin-top: 30rpx;
		.header{
			font-size: 32rpx;
			padding: 30rpx;
			border-bottom: 2rpx solid #F9F9F9;
			position: relative;
			.imageIcon{
				position: absolute;
				right: 40rpx;
				top: 24rpx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30rpx 20rpx;
			view{
				padding: 8rpx 30rpx;
				margin: 20rpx 30rpx 0 0;
				font-size: 28rpx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20rpx;
			}
		}
	}
	.wanted-block{
		margin-top: 30rpx;
		.header{
			font-size: 32rpx;
			padding: 30rpx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28rpx;
				box-sizing: border-box;
				text-align: center;
				padding: 20rpx 0;
				border-top: 2rpx solid #FFF;
				border-left: 2rpx solid #FFF;
				background-color: #F7F7F7;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.wanted-circle{
		margin-top: 30rpx;
		.header{
			font-size: 32rpx;
			padding: 30rpx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30rpx 20rpx;
			view{
				padding: 8rpx 30rpx;
				margin: 20rpx 30rpx 0 0;
				font-size: 28rpx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20rpx;
			}
		}
	}
</style>
