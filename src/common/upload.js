import Vue from 'vue'
import dayjs from 'dayjs'
import { SECRETFILE_URL } from './config'

const showToast = (title) => {
	uni.showToast({
		title: title,
		icon: 'none'
	})
}

//图片流调用传递接口
const upload = (filePath, baseUrl, otherUrl, myName, myFormData) => {
	let token = ''
	try {
		token = uni.getStorageSync('mspToken')
	} catch(e) {
		console.error(e)
	}
	uni.showLoading({
		title: Vue.prototype.$t('pub').uploading,
		mask: true
	})
	return new Promise((resolve, reject) => {
		const httpLang = Vue.prototype.$t('js.http')
		let formData = myFormData || {}
		if (baseUrl != null) {
			formData.keyurl = baseUrl + '/' + dayjs().format('YYYYMMDD') + '/' + Vue.prototype.$util.getUuid() + filePath.substr(filePath.lastIndexOf("."))
		}
		uni.uploadFile({
			url: otherUrl ? otherUrl : `${SECRETFILE_URL}`,
			filePath: filePath,
			name: myName ? myName : 'file',
			header: {
				token: token
			},
			formData,
			success: res => {
				uni.hideLoading()
				if (res.statusCode === 200) {
					let result = JSON.parse(res.data)
					if (result.errcode === '0') {
						resolve(result)
						return
					}
					reject(result.errmsg || result.error)
					showToast(result.errmsg || result.error)
				} else {
					showToast('[' + res.statusCode + '] ' + httpLang.sysErr)
					reject('[' + res.statusCode + '] ' + httpLang.sysErr)
				}
			},
			fail: (err) => {
				uni.hideLoading()
				if (err.errMsg != 'request:fail abort') {
					showToast(httpLang.networkErr)
					reject(httpLang.networkErr)
				}
			}
		})
	})
}
export default upload
