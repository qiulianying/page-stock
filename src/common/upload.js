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
const upload = (filePath, otherUrl, myName, myFormData) => {
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
		uni.uploadFile({
			url: otherUrl,
			filePath: filePath,
			name: myName ? myName : 'file',
			header: {
				token: token
			},
			formData: formData,
			success: res => {
				console.log('执行成功')
				console.log(res)
				uni.hideLoading()
				if (res.statusCode === 200) {
					let result = JSON.parse(res.data)
					if (result.code == '0') {
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
				console.log(err)
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
