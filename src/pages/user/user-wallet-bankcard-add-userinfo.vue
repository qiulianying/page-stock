<template>
	<view class="user-user-wallet-bankcard-add-userinfo-page">
		<image src="../../static/images/bank_bg.png" mode="heightFix"
			style="position: absolute; width: 100vw; height: 1880rpx;"></image>

		<cu-custom bgColor="bg-white" is-back>
			<block slot="content">添加银行卡</block>
		</cu-custom>
		<view class="page-box flex flex-direction">
			<view class="page-box-subtitle" :style="[{background: themeColor}, {color: themeColor}]">
				<view class="page-box-subtitle-text">
					<text>为防范风险，保护当事人合法权益，需要添加银行卡进行实名认证</text>
				</view>
			</view>

			<!--身份证正面-->
			<view class="page-box-idCard flex flex-direction">
				<view class="page-box-subtitle text-center">
					<text>请上传本人有效的身份证正面照片</text>
				</view>
				<image v-if="$util.strIsEmpty(idcard1)" src="/static/images/idcard-1.png" @tap="chooseCardImg('front')"
					mode="aspectFill"></image>
				<image v-else :src="idcard1" @tap="chooseCardImg('front')" mode="aspectFill"></image>
				<view class="upload-info text-right text-theme text-lg"
					:style="[{color: themeColor}, {position: 'relative'}]" @tap="showUploadInfoPop">
					<text class="cuIcon-infofill margin-right-xs"></text>
					<text class="text-df">拍摄照片要求</text>
				</view>
			</view>

			<view class="page-box-form flex flex-direction">
				<view class="page-box-input">
					<text class="page-box-input-label">真实姓名</text>
					<input v-model="custName" :maxlength="19" placeholder="请输入本人真实姓名"
						placeholder-class="input-placeholder" />
				</view>
				<view class="page-box-input">
					<text class="page-box-input-label">身份证号</text>
					<input type="idcard" v-model="certNo" :maxlength="18" placeholder="请输入本人身份证号"
						placeholder-class="input-placeholder" />
				</view>
				<view class="page-box-input">
					<text class="page-box-input-label">手机号码</text>
					<input type="number" v-model="mobileNo" :maxlength="11" placeholder="请输入本人手机号码"
						placeholder-class="input-placeholder" />
				</view>
				<view class="page-box-input">
					<text class="page-box-input-label">性别</text>
					<!-- <text class="page-box-input-text"> -->
					<u-radio-group v-model="genderValue" @change="radioGroupChange">
						<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.name"
							:disabled="item.disabled">
							{{item.name}}
						</u-radio>
					</u-radio-group>
					<!-- </text> -->
				</view>
				<view class="page-box-input" style="position: relative">
					<text class="page-box-input-label">职业</text>
					<picker class="page-box-input-picker" @change="selectOccupation" :value="occupationIndex"
						:range="occupationArr" range-key="value">
						<view class="flex">
							<view class="flex-sub" :class="{ 'input-placeholder': occupationIndex == null }">
								{{ occupationIndex == null ? '请选择职业' : occupationArr[occupationIndex].value }}
							</view>
							<view class="cuIcon-right margin-left-xs text-gray"></view>
						</view>
					</picker>
				</view>
			</view>
			<button class="cu-btn page-box-btn" :class="nextDisabled ? 'bg-disabled' : 'bg-theme'"
				:style="{background: nextDisabled ? '' : themeColor}" @tap="doNextStep">下一步</button>
		</view>
		<view class="page-bottom"><text>中国工商银行保障账户安全</text></view>
		<!--拍摄要求-->
		<zj-popup ref="upload-info-pop" class="upload-info-pop" title="拍摄照片要求" height="auto">
			<view class="text-center" style="width: 100%; padding-bottom: 50rpx;">
				<!-- <image src="/static/images/idcard-demo.png" style="width: 686rpx; height: 618rpx; margin: 24rpx auto;"> -->
				<image :src="imgUrl + '1635818546743/idcard-demo.png'"
					style="width: 686rpx; height: 618rpx; margin: 24rpx auto;">
				</image>
			</view>
		</zj-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				idcard1: '', //身份证正面照片内容
				custName: '',
				certNo: '',
				mobileNo: '',
				occupationIndex: null,
				occupationArr: [{
					key: '1',
					value: '公务员'
				}, {
					key: '2',
					value: '事业单位员工'
				}, {
					key: '3',
					value: '公司员工'
				}, {
					key: '4',
					value: '军人警察'
				}, {
					key: '5',
					value: '工人'
				}, {
					key: '6',
					value: '农民'
				}, {
					key: '7',
					value: '管理人员'
				}, {
					key: '8',
					value: '技术人员'
				}, {
					key: '9',
					value: '私营业主'
				}, {
					key: '10',
					value: '文体明星'
				}, {
					key: '11',
					value: '自由职业者'
				}, {
					key: '12',
					value: '学生'
				}, {
					key: '13',
					value: '无职业'
				}],
				themeColor: '',
				// gender: null,
				// 1‐ 男。 2‐女
				gender: '',
				list: [{
						name: '男',
						disabled: false
					},
					{
						name: '女',
						disabled: false
					}
				],
				genderValue: null,
				imgUrl: ''
			}
		},
		onLoad() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			//获取身份证图片内容信息
			this.idcard1 = uni.getStorageSync('idcardFront') || ''
			//判断当前缓存是否存在身份证正面信息
			if (uni.getStorageSync('idCardOcr') && uni.getStorageSync('idCardOcr').number) {
				this.custName = uni.getStorageSync('idCardOcr').name
				this.certNo = uni.getStorageSync('idCardOcr').number
				this.gender = uni.getStorageSync('idCardOcr').sex || null
			}
			if (this.gender) {
				this.genderValue = this.gender
			}
			console.log('判断当前缓存是否存在身份证正面信息')
			console.log(uni.getStorageSync('idCardOcr'))
		},
		computed: {
			...mapState([
				'walletInfo'
			]),
			occupation() {
				if (this.occupationIndex == null) {
					return null
				}
				return parseInt(this.occupationArr[this.occupationIndex].key)
			},
			nextDisabled() {
				return this.$util.strIsEmpty(this.custName) ||
					this.$util.strIsEmpty(this.certNo) ||
					this.$util.strIsEmpty(this.mobileNo) ||
					this.occupationIndex == null
			},
			bankNoStr() {
				const mediumNo = this.walletInfo.mediumNo
				if (this.$util.strIsEmpty(mediumNo)) return ''
				return mediumNo.substr(0, 4) + ' **** ' + mediumNo.substr(mediumNo.length - 4)
			}
		},
		methods: {
			...mapMutations(['setWalletInfo']),
			showUploadInfoPop() {
				console.log('点击查看图片')
				this.$refs['upload-info-pop'].open()
			},
			clearImg() {
				this.setWalletInfo({
					...this.walletInfo,
					frontImgPath: null,
					backImgPath: null
				})
			},
			//身份证拍摄
			chooseCardImg(type) {
				this.clearImg()
				uni.navigateTo({
					url: `/myPackageA/pages/idcard-camera?direction=${type}`
				})
			},
			selectOccupation(e) {
				this.occupationIndex = e.detail.value
			},
			doNextStep() {
				// 判断手机号是否符合规范
				let phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				if (!phone.test(this.mobileNo)) {
					return uni.showToast({
						title: '请输入正确的手机号！',
						icon: 'none'
					})
				}
				if (!this.gender) {
					return uni.showToast({
						title: '请选择性别！',
						icon: 'none'
					})
				}
				this.setWalletInfo({
					...this.walletInfo,
					certNo: this.certNo, //身份证号码
					custName: this.custName, //姓名
					mobileNo: this.mobileNo, //手机号
					occupation: this.occupation, //职业
					gender: this.gender === '男' ? 1 : 2
				})
				this.$toView(`user/user-wallet-bankcard-add-userinfoMore`, true)
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log('选中任一radio时，由radio-group触发')
				console.log(e);
				this.gender = e === '男' ? 1 : 2
			},
		}
	}
</script>

<style lang="scss">
	.user-user-wallet-bankcard-add-userinfo-page {
		padding-bottom: 80rpx;

		//身份证图片
		.page-box-idCard {
			padding-top: 30rpx;

			&-subtitle {
				font-size: 30rpx;
			}

			image {
				width: 630rpx;
				height: 416rpx;
				margin: 14rpx auto;
				border-radius: 10rpx;
			}

			.upload-info {
				margin: 12rpx 60rpx;
				line-height: 36rpx;

				text {
					vertical-align: middle;
				}
			}

			&-btn {
				margin: 50rpx 60rpx;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}
		}

		.page-box {
			&-subtitle {
				font-size: 26rpx;

				&-text {
					opacity: 0.9;
					padding: 24rpx 42rpx;
					background: white;

				}
			}

			&-form {
				margin: 24rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
			}

			.bank-info {
				height: 126rpx;
				padding: 0 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0 2rpx 0px 0px #F4F5F7;

				image {
					width: 48rpx !important;
					height: 48rpx !important;
					margin-right: 24rpx !important;
				}

				.con {
					flex: 1;
					font-size: 30rpx;
					color: #333333;
					font-weight: bold;
				}
			}

			&-input {
				display: flex;
				align-items: center;
				justify-items: center;
				height: 124rpx;
				margin: 0 32rpx;
				color: #161616;
				font-size: 30rpx;

				&:not(:last-of-type) {
					box-shadow: 0 2rpx 0 0 #F4F5F7;
				}

				&-label {
					width: 144rpx;
				}

				&-picker {
					flex: 1;
					text-align: left;
				}

				input {
					flex: 1;
					text-align: left;
				}

				.input-placeholder {
					color: #A9A9A9;
				}
			}

			&-btn {
				margin: 50rpx 60rpx;
				border-radius: 48rpx;
				font-size: 34rpx;
				color: #FFF7F7;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				display: block;
			}

			.bg-disabled {
				background: #BCCBD6;
			}

			&-info {
				margin: 0 24rpx;
				color: #666666;
				font-size: 26rpx;
				align-items: flex-start;

				.radio-label {
					transform: scale(0.7, 0.7);
				}
			}
		}

		.page-bottom {
			// position: fixed;
			text-align: center;
			color: #A9A9A9;
			font-size: 26rpx;
			bottom: 0;
			padding-top: 20rpx;
			padding-bottom: 30rpx;
			width: 100%;
		}
	}
</style>