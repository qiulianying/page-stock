//字符串拼接
function strFormat(str) {
	return str < 10 ? `0${str}` : str
}
//时间戳转日期
export function timeStamp(time) {
	const dates = new Date(time)
	const year = dates.getFullYear()
	const month = dates.getMonth() + 1
	const date = dates.getDate()
	const day = dates.getDay()
	const hour = dates.getHours()
	const min = dates.getMinutes()
	const days = ['日', '一', '二', '三', '四', '五', '六']
	return {
		allDate: `${year}/${strFormat(month)}/${strFormat(date)}`,//注:此处ios系统如"-"分割无法显示,只能用"/"分割符
		fullDate: `${year}年${strFormat(month)}月${strFormat(date)}日`,//注:此处ios系统如"-"分割无法显示,只能用"/"分割符
		date: `${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
		day: `周${days[day]}`, //返回的礼拜天数  星期一
		dayNum: day,
		hour: strFormat(hour) + ':' + strFormat(min) //返回的时钟 08:00
	}
}
//获取最近7天的日期和礼拜天数
export function dateData(days) {
	const time = []
	const date = new Date()
	const now = date.getTime() //获取当前日期的时间戳
	let timeStr = 3600 * 24 * 1000 //一天的时间戳
	for (let i = 0; i < days; i++) {
		const timeObj = {}
		timeObj.date = timeStamp(now + timeStr * i).date //保存日期
		timeObj.timeStamp = now + timeStr * i //保存时间戳
		// if (i == 0) {
		// 	timeObj.week = '今天'
		// } else if (i == 1) {
		// 	timeObj.week = '明天'
		// } else if (i == 2) {
		// 	timeObj.week = '后天'
		// } else {
		// 	timeObj.week = timeStamp(now + timeStr * i).day
		// }
		if (i == 0) {
			timeObj.week = '今天'
		} else {
			timeObj.week = timeStamp(now + timeStr * i).day
		}
		time.push(timeObj)
	}
	return time
}
//时间数组
export function timeData(startTime = '08:00', endTime = '18:30', timeInterval = 0.5) {
	const time = []
	const date = timeStamp(Date.now()).allDate
	const startDate = `${date} ${startTime}`
	const endDate = `${date} ${endTime}`
	const startTimeStamp = new Date(startDate).getTime()
	const endTimeStamp = new Date(endDate).getTime()
	const timeStr = 3600 * 1000 * timeInterval
	console.log(startTimeStamp)
	let count = 0
	for (let i = startTimeStamp; i <= endTimeStamp; i = i + timeStr) {
		const timeObj = {}
		timeObj.time = timeStamp(i).hour
		timeObj.disable = 1
		timeObj.index = count
		time.push(timeObj)
		count ++
	}
	console.log(JSON.stringify(time))
	return time
}

