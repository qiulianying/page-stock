<template>
	<view class="user-user-address-manage-page">
		<cu-custom bgColor="bg-white" is-back>
			<block slot="backText" class="text-black">{{ isEdit ? '编辑' : '新建' }}收货人</block>
		</cu-custom>
		<view style="padding: 36rpx 32rpx 16rpx; background: #FFFFFF;">
			<view class="row" style="align-items: baseline;">
				<text class="row-title">联系人</text>
				<view style="display: flex; flex-direction: column; flex: 1;">
					<input class="input" style="margin-bottom: 28rpx;" type="text" v-model="addressData.name"
						   maxlength="15" placeholder="请填写收货人姓名" placeholder-class="input-placeholder" />
					<view class="row-tag" style="padding: 28rpx 0; border-top: 1rpx solid #F5F5F5;">
						<text v-for="(item,index) in genderData" :key="index"
							:class=" item.checked ? 'cu-tag-selected cu-tag round' : 'cu-tag round'"
							@tap="changeGender(item)">
							{{ item.name }}
						</text>
					</view>
				</view>
			</view>
			<view class="row">
				<text class="row-title">手机号</text>
				<input class="input" type="number" v-model="addressData.phone" maxlength="11" placeholder="请填写收货人手机号码"
					placeholder-class="input-placeholder" />
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
		</view>
		<view class="margin-top-sm" style="padding: 16rpx 32rpx; background: #FFFFFF;">
			<view class="row">
				<text class="row-title">标签</text>
				<view class="row-tag">
					<text v-for="(item, index) in labelData"
					:key="index"
						:class=" item.checked ?  'cu-tag-selected cu-tag round' : 'cu-tag round'"
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
			<button @tap="saveAddress" class="cu-btn bg-theme" :style="{background: themeColor}" >保 存</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getAddAddress,
		getDefaultAddress,
		getEditAddress
	} from "../../../api/shopmall";
	export default {
		data() {
			return {
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
				merchantNo: '',
        themeColor: ''
			}
		},
		methods: {
			switchChange(e) {
				this.addressData.isDefault = e.detail
				let params = {
					id: this.addressData.id,
					isDefault: this.addressData.isDefault ? 1 : 0
				}
				getDefaultAddress(params).then(res => {
					console.log(res)
				})
			},
			chooseLocation() {
				//对应执行定位
				this.$plugin.app.getMapInfo({
					success: data => {
            console.log
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
				const params = {
					addressDetail: this.addressData.addressDetail,
					addressPrefix: this.addressData.addressPrefix,
					label: this.addressData.label,
					location: this.addressData.location,
					name: this.addressData.name,
					phone: this.addressData.phone,
					sex: this.addressData.gender, // 男： 1， 女： 2
          provinceName: this.addressData.provinceName,
					cityName: this.addressData.cityName,
					districtName: this.addressData.districtName,
				}
				if (this.isEdit) {
					if (params.addressDetail && params.addressPrefix && params.label && params.location && params.name &&
						params.phone && params.sex) {
							let phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
						if (!phone.test(params.phone)) {
							this.$refs.uToast.show({
								title: '请输入正确的手机号！',
								type: 'warning',
							})
						} else {
							params.id = this.addressData.id
							getEditAddress(params).then(res => {
								const address = JSON.stringify(this.addressData)
								if (res.errcode === '0') {
									this.$refs.uToast.show({
										title: '编辑成功',
										type: 'success',
									})
									uni.navigateTo({
										url: `/pages/shopMall/user/user-address-list?address=${address}&merchantNo=${this.merchantNo}`
									})
								}
							})
						}
					} else {
						this.$refs.uToast.show({
							title: '请填写完整信息！',
							type: 'warning'
						})
					}

				} else {
					if (params.addressDetail && params.addressPrefix && params.label && params.location && params.name &&
						params.phone && params.sex) {
							let phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
						if (!phone.test(params.phone)) {
							this.$refs.uToast.show({
								title: '请输入正确的手机号！',
								type: 'warning',
							})
						} else {
							getAddAddress(params).then(res => {
								if (res.errcode === '0') {
									this.$refs.uToast.show({
										title: '新增成功',
										type: 'success'
									})
									uni.navigateTo({
										url: `/pages/shopMall/user/user-address-list?merchantNo=${this.merchantNo}`
									})
								}
							})
						}

					} else {
						this.$refs.uToast.show({
							title: '请填写完整信息！',
							type: 'warning'
						})
					}

				}

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
			let data = JSON.parse(option.item)
			this.merchantNo = option.merchantNo
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
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
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
