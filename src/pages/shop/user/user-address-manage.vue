<template>
	<view class="user-user-address-manage-page">
		<topback-btn v-if="merchantNo" :url="`/pages/shop/user/user-address-list?merchantNo=${merchantNo}`"
			bgColor="bg-white">
			<block slot="backText" class="text-black">个人资料</block>
		</topback-btn>
		<view style="padding: 36rpx 32rpx 16rpx; background: #FFFFFF;">
			<view class="row" style="align-items: baseline;">
				<text class="row-title">姓名</text>
				<view style="display: flex; flex-direction: column; flex: 1;">
					<input class="input" style="margin-bottom: 28rpx;" type="text" v-model="addressData.name"
						maxlength="15" placeholder="请填写姓名" placeholder-class="input-placeholder" />
					<view class="row-tag" style="padding: 28rpx 0; border-top: 1rpx solid #F5F5F5;">
						<text v-for="(item,index) in genderData" :key="index"
							:class=" item.checked ? 'cu-tag-selected cu-tag round' : 'cu-tag round'"
							:style="[{border: item.checked ?  `2rpx solid ${themeColor}` : `2rpx solid #F5F5F5`},{color: item.checked ? themeColor : '#A9A9A9'}]"
							@tap="changeGender(item)">
							{{ item.name }}
						</text>
					</view>
				</view>
			</view>
			<view class="row">
				<text class="row-title">手机号</text>
				<input class="input" type="number" v-model="addressData.phone" maxlength="11" placeholder="请填写手机号码"
					placeholder-class="input-placeholder" />
			</view>
			<view class="row">
				<text class="row-title">生日</text>
				<picker class="page-box-input-picker input" mode="date" :end="today" @change="selectSignDate"
						:value="signDate">
					<view class="flex">
						<view class="flex-sub" :class="{ 'input-placeholder': signDate == null }">
							{{ signDate == null ? '请选择日期' : signDate }}
						</view>
						<view class="cuIcon-right margin-left-xs text-gray"></view>
					</view>
				</picker>
			</view>
			<view class="row" @tap="chooseLocation">
				<text class="row-title">地址</text>
				<text class="input">
					{{ $util.strIsNotEmpty(addressData.addressPrefix) ? addressData.addressPrefix : '请在地图上选择' }}
				</text>
				<text class="cuIcon- zjIcon-address icon-address"></text>定位
			</view>
			<view class="row">
				<text class="row-title">门牌号</text>
				<input class="input" type="text" v-model="addressData.addressDetail" placeholder="请填写街道楼牌号等"
					placeholder-class="placeholder" />
			</view>
			<view class="row">
				<text class="row-title">职业</text>
				<input class="input" v-model="addressData.phone" placeholder="请填写职业"
					   placeholder-class="input-placeholder" />
			</view>
			<view class="row">
				<text class="row-title">爱好</text>
				<input class="input" v-model="addressData.phone" placeholder="请填写爱好"
					   placeholder-class="input-placeholder" />
			</view>
		</view>
		<view class="margin-top-sm" style="padding: 16rpx 32rpx; background: #FFFFFF;">
			<view class="row">
				<text class="row-title">标签</text>
				<view class="row-tag">
					<text v-for="(item, index) in labelData" :key="index"
						:class=" item.checked ?  'cu-tag-selected cu-tag round' : 'cu-tag round'"
						:style="[{border: item.checked ?  `2rpx solid ${themeColor}` : `2rpx solid #F5F5F5`},{color: item.checked ? themeColor : '#A9A9A9'}]"
						@click="changeLabel(item)">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view class="margin-top-sm" style="padding: 16rpx 32rpx; background: #FFFFFF;" v-if="isEdit">
			<view class="row">
				<view style="display: flex; flex-direction: column; flex: 1;">
					<text class="row-title" style="width: auto;">设为默认地址</text>
					<text style="font-size: 22rpx; color: #666666;">提醒：设置成默认地址下单时会推荐使用该地址</text>
				</view>
				<switch :checked="addressData.isDefault" class="theme" @change="switchChange" />
			</view>
		</view>
		<view class="page-bottom">
			<button @tap="saveAddress" class="cu-btn bg-theme" :style="{background: themeColor}">保 存</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				signDate: '',
				isEdit: false,
				addressData: {
					name: '',
					phone: '',
					addressDetail: '',
					addressPrefix: '',
					// area: '',
					isDefault: 0,
					location: {},
					gender: 1,
					label: '家'
				},
				genderData: [{
						name: '先生',
						checked: true,
						id: 1
					},
					{
						name: '女士',
						checked: false,
						id: 2
					}
				],
				labelData: [{
						name: '家',
						checked: true
					},
					{
						name: '公司',
						checked: false,
					},
					{
						name: '学校',
						checked: false,
					}
				],
				merchantNo: null,
				changeIsDefault: false,
				themeColor: ''
			}
		},
		computed: {
			today() {
				return dayjs().format('YYYY-MM-DD')
			}
		},
		methods: {
			selectSignDate(e) {
				this.signDate = e.detail.value
			},
			switchChange(e) {
					this.addressData.isDefault = e.detail
					this.changeIsDefault = true

				},
				chooseLocation() {
					//对应执行定位
					this.$plugin.app.getMapInfo({
						success: data => {
							this.addressData.addressDetail = data.address
							this.addressData.addressName = data.name
							this.addressData.addressPrefix = data.name
							this.addressData.location = {
								lat: data.latitude,
								lon: data.longitude
							}
							this.addressData.provinceName = data.provinceName
							this.addressData.cityName = data.cityName
							this.addressData.districtName = data.districtName
						}
					})
				},
				saveAddress() {
					this.$refs.uToast.show({
						title: '保存成功'
					})
				},
				// 选择性别
				changeGender(item) {
					this.genderData.forEach(val => {
						if (val.name === item.name) {
							if (!item.checked) {
								val.checked = true
							}
							this.addressData.gender = val.id
						} else {
							val.checked = false
						}
					})
				},
				// 选择标签
				changeLabel(item) {
					this.labelData.forEach(val => {
						if (val.name === item.name) {
							if (!item.checked) {
								val.checked = true
							}
							this.addressData.label = val.name
						} else {
							val.checked = false
						}
					})
				}
		},
		onLoad(option) {
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.merchantNo = option.merchantNo || null
			if (option.item) {
				let data = JSON.parse(option.item)
				this.isEdit = data != null
				this.addressData = data
				this.genderData.forEach(val => {
					if (val.id === data.sex) {
						val.checked = true
						this.addressData.gender = data.sex
					} else {
						val.checked = false
					}
				})
				this.labelData.forEach(val => {
					if (val.name === data.label) {
						val.checked = true
						this.addressData.label = data.label
					} else {
						val.checked = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-user-address-manage-page {
		.row {
			display: flex;
			align-items: center;
			min-height: 96rpx;

			&:not(:last-child) {
				border-bottom: 1rpx solid #F5F5F5;
			}

			.row-title {
				flex-shrink: 0;
				width: 144rpx;
				font-size: 28rpx;
				color: #282828;
			}

			.row-tag {
				.cu-tag {
					background: #F5F5F5;
					border: 2rpx solid #F5F5F5;
					color: #A9A9A9;
					height: 52rpx;
					line-height: 52rpx;
					padding: 0 32rpx;
					border-radius: 26px;
				}

				.cu-tag-selected {
					background: #EAF0FB;
					border: 2rpx solid #34A2E8;
					color: #34A2E8;
				}
			}

			.input {
				flex: 1;
				font-size: 28rpx;
			}

			.input-placeholder {
				color: #A9A9A9;
			}

			.icon-address {
				font-size: 48rpx;
				margin-right: 8rpx;
				color: #A9A9A9;
			}
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
</style>
