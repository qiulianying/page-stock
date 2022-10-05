<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">个人信息</block>
		</cu-custom>
		<view class="userInfoTable">
			<view class="userHeader">
				<image :src="formInfo.avatar" class="userImg" mode="aspectFill"
					   :lazy-load="true"/>
				<view class="userName">{{formInfo.username || '用户名'}}</view>
			</view>
			<form class="cu-myDream">
				<view class="cu-form-group ">
					<view class="title">昵称</view>
					<input placeholder="两字短标题" name="input" v-model="formInfo.nickname"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">性别</view>
					<picker @change="sexChange" v-model="formInfo.gender" :range="sexArray">
						<view class="picker">
							{{sexArray[formInfo.gender]}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">手机号码</view>
					<input placeholder="请输入您的手机号码" name="input" v-model="formInfo.phone" maxlength="11"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">简介</view>
					<input placeholder="请输入您的简介" name="input" v-model="formInfo.introduction" maxlength="15"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">地址选择</view>
					<picker mode="region" @change="RegionChange" :value="region">
						<view class="picker">
							{{region[0]}}，{{region[1]}}，{{region[2]}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">生日</view>
					<picker mode="date" :value="date" start="2015-09-01" end="2024-09-01" @change="DateChange">
						<view class="picker">
							{{date}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">学历</view>
					<input placeholder="请输入您的学历" name="input" maxlength="15"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">职业</view>
					<input placeholder="请输入您的职业" name="input" maxlength="20" v-model="formInfo.occupation"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">爱好</view>
					<input placeholder="请输入您的爱好" name="input" maxlength="15" v-model="formInfo.hobby"></input>
				</view>
				<!--   保存按钮   -->
				<view class="page-bottom">
					<button class="cu-btn bg-theme" :disabled="!havaContent" :style="{background: themeColor}" @tap="saveAddress">编 辑</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import { getUserInfo, userInfoSet } from '../../api/platformgouc'
	export default {
		data() {
			return {
				gender: 0,
				// 表单内容数据
				formInfo: {
					avatar: '',
					nickname: '',
					gender: 0,
					introduction: '',
					birthday: '',
					occupation: '',
					hobby: ''
				},
				themeColor: '',
				havaContent: true,
				index: -1,
				sexArray: ['男', '女'],
				region: ['广东省', '广州市', '海珠区'],
				date: '',
				lastParams: {
					province: '',
					city: ''
				}
			};
		},
		onLoad(options) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			// 屏蔽微信右上角工具栏
			wx.hideShareMenu()
			this.date = this.$util.dateFormat(new Date(), '-')
			// 获取用户信息
			getUserInfo().then(res => {
				this.formInfo = res.data
				// 编写相关修改编辑内容
			})
		},
		methods: {
			sexChange(e) {
				this.formInfo.gender = e.detail.value
			},
			saveAddress() {
				let lastParams = {
					id: this.formInfo.id,
					nickname: this.formInfo.nickname,
					gender: this.formInfo.gender,
					introduction: this.formInfo.introduction,
					occupation: this.formInfo.occupation,
					hobby: this.formInfo.hobby,
					province: this.lastTime.province,
					city: this.lastTime.city,
				}
				userInfoSet(lastParams).then(res => {
					if (res) {
						uni.showToast({
							title: '用户信息更新成功!',
							icon: 'success',
							duration: 2000
						})
					}
				})
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			RegionChange(e) {
				this.region = e.detail.value
				this.lastParams.province = this.region[0]
				this.lastParams.city = this.region[1]
			}
		}
	}
</script>

<style lang="scss">
	.userInfoTable {
		background-color: #ffffff;
		padding-top: 30rpx;
		.userHeader {
			margin: 30rpx 0 30rpx 20rpx;
			.userImg {
				display: inline-block;
				vertical-align: middle;
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				// background-color: #ff9700;
			}
			.userName {
				display: inline-block;
				vertical-align: middle;
				font-size: 28rpx;
				font-weight: 600;
				color: #2A2A2A;
				padding-left: 20rpx;
			}
		}

		.cu-myDream {
			.cu-form-group {
				text-align: right;
				.title {
					min-width: calc(4em + 15px);
				}

				.saveAlbum {
					width: 100%;
					display: inline-flex;
					justify-content: space-between;
					align-items: center;
					.saveAlbumTitle {
						margin-right: 10rpx;
					}

					.checkboxMe {
						/deep/ .uni-checkbox-input {
							width: 35rpx;
							height: 35rpx;
						}
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
	}
</style>
