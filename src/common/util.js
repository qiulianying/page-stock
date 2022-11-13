export default {
	/*
	* 微信小程序情况下页面直接输出需要展示的数据
	* content：展示内容
	* durationTime: 需要展示的时间
	* afterTime：是否需要延时展示
	* */
	weixinShowToast(content, durationTime, afterTime) {
		if (uni.getStorageSync('weixinShowToast') === 'on') {
			setTimeout(() => {
				uni.showToast({
					title: content || '没有数据',
					icon: 'none',
					duration: durationTime || 1500
				})
			}, afterTime || 10)
		}
	},
	//返回年月日时分秒
	getTime(value) {
		let date = new Date(value);
		let y = date.getFullYear();
		let MM = date.getMonth() + 1;
		MM = MM < 10 ? ('0' + MM) : MM;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let m = date.getMinutes();
		m = m < 10 ? ('0' + m) : m;
		let s = date.getSeconds();
		s = s < 10 ? ('0' + s) : s;
		return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
	},
	dateFormat(value) {
		let date = new Date(value);
		let y = date.getFullYear();
		let MM = date.getMonth() + 1;
		MM = MM < 10 ? ('0' + MM) : MM;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let m = date.getMinutes();
		m = m < 10 ? ('0' + m) : m;
		let s = date.getSeconds();
		s = s < 10 ? ('0' + s) : s;
		return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
	},
	// /**
	//  * @name 时间格式化函数
	//  * @author hyx
	//  * @param {Date} data
	//  * @param {String} separator //分隔文本
	//  * @param {Boolean} Chinese // 是否为中文分隔
	//  * @returns String
	//  */
	// dateFormat(data, separator, Chinese) {
	// 	const date = data ? new Date(data) : new Date()
	// 	if (!separator) separator = ''
	// 	if (Chinese) {
	// 		return `${date.getFullYear()}年${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() +
	// 			1}月${date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()}日`
	// 	} else {
	// 		return `${date.getFullYear()}${separator}${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() +
	// 			1}${separator}${date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()}`
	// 	}
	// },
	strIsEmpty(str) {
		return str == null || str === ''
	},
	strIsNotEmpty(str) {
		return str != null && str !== ''
	},
	strToDate(str) {
		return strIsEmpty(data) ? '' : new Date(data)
	},
	// 转金额并四舍五入 只能用于显示，不能用于数据比较
	toMoney(num) {
		if (num == null || num === '') return ''
		num = parseFloat(num).toFixed(2).toString().split('.')
		num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,')
		return num.join('.')
	},
	phoneDesensitization(data) { // 手机号脱敏处理
		return data.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
	},
	getDistance(lat1, lng1, lat2, lng2) {
		if (null == lat1 || null == lng1 || null == lat2 || null == lng2) {
			return ''
		}
		let radLat1 = lat1 * Math.PI / 180.0
		let radLat2 = lat2 * Math.PI / 180.0
		let a = radLat1 - radLat2
		let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
		s = Math.round(s * 6378.137 * 10000) / 10000
		return s > 1 ? `${s.toFixed(2)} km` : `${Math.round(s * 1000)} m`
	},
	// 返回刷新
	toBack(delta, reload) {
		uni.navigateBack({
			delta: delta,
			success: () => {
				if (reload) {
					const pages = getCurrentPages()
					let page = pages[Math.max(pages.length - delta, 0)]
					if (page.onLoad) {
						page.onLoad(page.options)
					}
				}
			}
		})
	},
	promiseWithAbort(fetchPromise) {
		let abort = null
		const abortPromise = new Promise((resolve, reject) => {
			abort = () => reject('abort')
		})
		let promiseWithAbort = Promise.race([fetchPromise, abortPromise])
		promiseWithAbort.abort = abort
		return promiseWithAbort
	},
	promiseAbort(promiseWithAbort) {
		if (promiseWithAbort != null && promiseWithAbort.abort) {
			promiseWithAbort.abort()
		}
	},
	getUuid() {
		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
			return v.toString(16)
		})
	},
	colorRgb(color, opacityNum){
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		var sColor = color.toLowerCase();
		if(sColor && reg.test(sColor)){
			if(sColor.length === 4){
				var sColorNew = "#";
				for(var i=1; i<4; i+=1){
					sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
				}
				sColor = sColorNew;
			}
			//处理六位的颜色值
			var sColorChange = [];
			for(var i=1; i<7; i+=2){
				sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
			}
			let newColor = ''
			if (opacityNum != undefined) {
				newColor = "rgba(" + sColorChange.join(",") + "," + opacityNum + ")";
			} else {
				newColor = "rgba(" + sColorChange.join(",") + ")";
			}
			return newColor
		}else{
			return sColor;
		}
	}
}
