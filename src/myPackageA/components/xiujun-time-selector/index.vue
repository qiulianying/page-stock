<template>
	<view class="all-box">
		<u-popup v-model="showPop" mode="bottom" border-radius="14" height="1000rpx" closeable @close="popupClose">
			<view class="notice">这里是公告</view>
			<view class="container appointment-time-box">
				<!-- tab栏 -->
				<view class="scroll-view_H b-t b-b" scroll-x>
					<block v-for="(item, index) in dateArr" :key="index">
						<view v-if="index < dateArr.length-1" @click="selectDateEvent(index, item)" 
							class="flex-box" :class="[index == dateActive ? 'active-date' : '']"
							:style="{ 'background': index == dateActive ? `linear-gradient(0, ${selectedItemColor}, ${themeShadow})` : ''}">
							<view class="date-box">
								<text class="days" :style="{ color: index == dateActive ? '#fff' : '#878787' }">{{ item.week }}</text>
								<text class="date" :style="{ color: index == dateActive ? '#fff' : selectedItemColor }">{{ item.date | dateFormat }}</text>
							</view>
						</view>
						<view v-if="index == dateArr.length-1" class="flex-box other-time">
							<view class="date-box">
								<u-icon style="margin-top:-12rpx;" name="calendar" size="50" :color="selectedItemColor"></u-icon>
								<!-- 微信的日期选择器 -->
								<picker mode="date" :value="cDate" :start="startDate" :end="endDate" @change="onDateConfirm">
									<view class="date date-picker" :style="{ color: index == dateActive ? '#fff' : selectedItemColor }">
										<text style="visibility: hidden;">{{cDate}}</text>
										<text>其他日期</text>
									</view>
								</picker>
							</view>
						</view>
					</block>
				</view>
				<!-- 时间选项 -->
				<scroll-view scroll-y="true" class="time-box">
					<view class="time-box-box">
						<block v-for="(item, _index) in timeArr" :key="_index">
							<view class="item">
								<!-- 选中的格子 -->
								<view
									v-if="_index == timeActive[0] || _index == timeActive[1] || (_index <= timeActive[1] && _index >= timeActive[0])"
									class="item-box text-bold"
									:style="{border: `4rpx solid ${selectedItemColor}`, background: themeColorRGB, color: selectedItemColor}"
									@click="selectTimeEvent(_index, item)"
								>
									<text>{{ item.time }}</text>
								</view>
								<!-- 其他的格子 -->
								<view v-else class="item-box" 
									:class="{ disable: item.disable, active: timeActive.indexOf(_index) >= 0 }" 
									@click="selectTimeEvent(_index, item)">
									<text>{{ item.time }}</text>
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
			<view class="bot-btn">
				<view class="btn btn-left" @click="popupClose">取消</view>
				<view class="btn btn-right" 
					:style="{ 'background': `linear-gradient(0, ${themeShadow}, ${selectedItemColor})`}"
					@click="confirmTime">确定<text v-if="hour">（{{hour}}）</text></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { dateData, timeData, timeStamp } from './date.js';
let maxIndex;
export default {
	props: {
		show: {
			//   是否显示
			type: Boolean,
			default: false
		},
		//开始时间选项
		startTime: {
			type: String,
			default: '08:00'
		},
		//结束时间选项
		endTime: {
			type: String,
			default: '18:00'
		},
		// 提前预约的时间
		advanceTime: {
			type: Number,
			default: 0
		},
		// 默认选择的时间段间隔
		timeSlot: {
			type: Number,
			default: 2
		},
		//时间间隔
		timeInterval: {
			type: [Number, String],
			default: 0.5 //半小时
		},
		//选中的tab颜色
		selectedTabColor: {
			type: String,
			default: '#0092D5'
		},
		//选中的时间颜色
		selectedItemColor: {
			type: String,
			default: '#0094D7'
		},

		//禁用显示的文本
		disableText: {
			type: String,
			default: '约满'
		}
	},
	data() {
		return {
			showPop: false,
			today: '',
			cDate: '请选择', // 当前选中的日期
			oldCDate: '', // 点击确认时将日期存下
			tempCDate: '',
			hour: '',
			startDate: new Date(), // 选择器的开始日期
			themeShadow: uni.getStorageSync('themeShadow'),
			themeColorRGB: '',
			dateArr: [], //日期数据
			timeArr: [], //时间数据
			dateActive: 0, //选中的日期索引
			timeActive: [], //选中的时间索引
			oldTimeActive: [], //保存用户筛选的时间
			tempTimeActive: [], //保存用户筛选的时间
			selectDate: '', //选择的日期数据
			selectTime: [], //选择的时间
			oldSelectTime: '',
			tempSelectTime: '',
			currentTimeStamp: '',
			currentTime: '',
			count: 0
		};
	},
	filters: {
		dateFormat(val) {
			return val.substring(5).replace(/\//g, ".")
		}
	},
	watch: {
		show:{
			handler(val){
				this.showPop = val
				// this.getSelectGoods()
			}
		}
	},
	created() {
		this.today = timeStamp(new Date()).allDate
		this.cDate = timeStamp(new Date()).allDate
		//获取日期tab数据
		console.log('new Date()000',new Date())
		// this.dateArr = dateData(6);
		this.dateArr = this.getDateList(new Date(this.cDate), 6);
		this.oldDateArr = JSON.parse(JSON.stringify(this.dateArr)) // 点击取消时使用
		//获取时间数据
		this.timeArr = timeData(this.startTime, this.endTime, this.timeInterval);
		maxIndex = this.timeArr[this.timeArr.length - 1]['index'];
		//当前时间戳
		this.currentTimeStamp = Date.now() + this.advanceTime * 3600 * 1000;
		this.currentTime = timeStamp(this.currentTimeStamp).hour;
		this.timeArr.map(item => {
			if (item.time > this.currentTime) {
				return (item.disable = 0); //判断当前时间大于时间选项则禁用
			} else {
				return (item.disable = 1);
			}
		});
		//默认选中的日期
		this.selectDate = `${this.dateArr[0]['fullDate']}（${this.dateArr[0]['week']}）`;
		// this.timeArr.some((item, index) => {
		// 	// 默认选中的时间段
		// 	const endIndex = this.timeSlot / this.timeInterval + index > maxIndex ? maxIndex : this.timeSlot / this.timeInterval + index;
		// 	this.selectTime = [this.timeArr[index]['time'], this.timeArr[endIndex]['time']]; //默认选中的时间
		// 	this.oldSelectTime = JSON.parse(JSON.stringify(this.selectTime)); //存储选中的时间
		// 	this.timeActive = [index, endIndex]; //选中的时间索引
		// 	this.oldTimeActive = [index, endIndex];
		// 	return !item.disable;
		// });
		// this.calcTime()
	},
	mounted() {
		this.themeColorRGB = this.$util.colorRgb(this.selectedItemColor,0.06)
	},
	methods: {
		openPopup() {
			console.log('打开弹窗',this.oldCDate,this.oldTimeActive,this.oldSelectTime,this.dateArr)
			if (this.oldCDate) {
				// this.cDate = this.oldCDate
				this.dateArr = JSON.parse(JSON.stringify(this.oldDateArr))
				let targetDate = this.oldCDate.substring(5)
				for (var i = 0; i < this.dateArr.length - 1; i++) {
					if (this.dateArr[i].date.indexOf(targetDate) > -1) {
						this.dateActive = i
						this.selectDateEvent(i, this.dateArr[i])
						break
					}
				}
				this.timeActive = JSON.parse(JSON.stringify(this.oldTimeActive))
				this.selectTime = JSON.parse(JSON.stringify(this.oldSelectTime))
				this.tempTimeActive = JSON.parse(JSON.stringify(this.oldTimeActive))
				this.tempSelectTime = JSON.parse(JSON.stringify(this.oldSelectTime))
			}
		},
		onDateConfirm(e) {
			// console.log('eeeeeeeeeeeeeeeeeeeeeeeeee',e)
			let cDate = e.detail.value.replace(/-/g, "/")
			let targetDate = cDate.substring(5)
			let check = true
			for (var i = 0; i < this.dateArr.length - 1; i++) {
				if (this.dateArr[i].date.indexOf(targetDate) > -1) {
					this.dateActive = i
					this.selectDateEvent(i, this.dateArr[i])
					check = false
					break
				}
			}
			if (check) {
				this.dateArr = this.getDateList(new Date(cDate), 6, true)
				this.selectDateEvent(0, this.dateArr[0])
			}
		},
		getDateList(date, days, out) {
			const time = []
			const one = date.getTime() // 获取起始日期的时间戳
			const nowDate = timeStamp(new Date()).allDate // 今天的日期
			let timeStr = 3600 * 24 * 1000 //一天的时间戳
			for (let i = 0; i < days; i++) {
				const timeObj = {}
				if (i == days - 1) {
					time.push(timeObj)
				} else {
					timeObj.date = timeStamp(one + timeStr * i).allDate //保存日期
					timeObj.fullDate = timeStamp(one + timeStr * i).fullDate //保存日期
					timeObj.timeStamp = one + timeStr * i //保存时间戳
					if (timeObj.date == nowDate) {
						timeObj.week = '今天'
						// timeObj.week = timeStamp(one + timeStr * i).day
					} else {
						timeObj.week = timeStamp(one + timeStr * i).day
					}
					time.push(timeObj)
				}
			}
			console.log('获取日期数组', time)
			// 这里是选择了新日期时需要重新渲染头部日期tab栏
			if (out) {
				this.selectDateEvent(0, time[0])
			}
			return time
		},
		// 切换日期
		selectDateEvent(index, item) {
			if (this.cDate == item.date) {
				return
			}
			this.count = 0 // 切换日期后要重新计数
			let time = new Date(item.date)
			console.log('切换日期', index, item, time)
			this.cDate = item.date // 记录当前选中的日期
			this.dateActive = index;
			this.selectDate = `${this.dateArr[index]['fullDate']}（${this.dateArr[index]['week']}）`;
			if (this.cDate == this.tempCDate) {
				this.timeActive = JSON.parse(JSON.stringify(this.tempTimeActive))
				this.selectTime = JSON.parse(JSON.stringify(this.tempSelectTime))
				this.calcTime()
			} else {
				this.timeActive = []
				this.selectTime = []
				this.hour = ''
			}
			if (this.currentTimeStamp < item.timeStamp) {
				console.log(11111)
				// const endIndex = this.timeSlot / this.timeInterval;
				// this.timeActive = [0, endIndex];
				// this.selectTime = [this.timeArr[0]['time'], this.timeArr[endIndex]['time']];
				this.timeArr.map(item => {
					return (item.disable = 0);
				});
			} else {
				console.log(22222)
				// this.timeActive = this.oldTimeActive;
				// this.selectTime = this.oldSelectTime;
				this.timeArr.map(item => {
					if (item.time > this.currentTime) {
						return (item.disable = 0);
					} else {
						return (item.disable = 1);
					}
				});
			}
		},
		// 选择时间段
		selectTimeEvent(index, item) {
			console.log('item', item)
			// 第一步判断点击的时间是否可用
			if (item.disable) {
				uni.showToast({
					title: '您所选的时段不在营业时间',
					icon: 'none',
					duration: 2000
				})
				return
			}

			// 已经选好一个时间段，重新选择或者刚进来时count为0
			if (this.count == 0) {
				this.selectTime[0] = ''
				this.selectTime[1] = ''
				this.timeActive = []
				this.tempTimeActive = []
				this.tempSelectTime = []
				this.hour = ''
			}
			// 第二次有效点击前（现在count的值为1）
			if (this.count ==  1 && this.timeActive.indexOf(index) > -1) {
				this.selectTime[0] = ''
				this.selectTime[1] = ''
				this.timeActive = []
				this.tempTimeActive = []
				this.tempSelectTime = []
				this.hour = ''
				this.count = 0
				return
			}
			// 一次有效点击，计数一次
			this.count++;
			if (this.count ==  1) {
				this.$set(this.timeActive, 0, index);
				this.selectTime[0] = this.timeArr[index]['time'];
			} else if (this.count ==  2) {
				let min = this.timeActive[0] < index ? this.timeActive[0] : index
				let max = this.timeActive[0] > index ? this.timeActive[0] : index
				console.log('min&&max',min ,max)
				for (let i = min; i < max; i++) {
					if (this.timeArr[i].disable == 1) {
						/*uni.showToast({
							title: '您所选的时段不在营业时间',
							icon: 'none',
							duration: 2000
						}) */
						this.$set(this.timeActive, 0, index);
						this.selectTime[0] = this.timeArr[index]['time'];
						this.count = 1
						return
					}
				}
				this.$set(this.timeActive, 1, index);
				this.selectTime[1] = this.timeArr[index]['time'];
				// 已经选择好了一个完整的时间段，将count置为0，用于下次重新计数
				this.count = 0
				// let ooo = this.timeActive.indexOf(index)
				console.log('this.timeActive',this.timeActive)
				// 最后将选择的时间进行排序
				if (this.timeActive[0] > this.timeActive[1]) {
					const tempTime = this.selectTime[0];
					const tempIndex = this.timeActive[0];
					this.selectTime[0] = this.selectTime[1];
					this.selectTime[1] = tempTime;
					this.$set(this.timeActive, 0, this.timeActive[1]);
					this.$set(this.timeActive, 1, tempIndex);
				}
				this.tempCDate = this.cDate
				this.tempSelectTime = JSON.parse(JSON.stringify(this.selectTime))
				this.tempTimeActive = JSON.parse(JSON.stringify(this.timeActive))
				this.calcTime()
			}
			return
			// 点击格子直接返回选中的数据
			this.$emit('selectTime', this.selectDate, this.selectTime.join('-'));
		},
		calcTime() {
			let timeOne = this.selectTime[0].split(':')
			let timeTwo = this.selectTime[1].split(':')
			let h = parseInt(timeTwo[0]) - parseInt(timeOne[0])
			let m = parseInt(timeTwo[1]) - parseInt(timeOne[1])
			if (m < 0) {
					h = h -1
			}
			h = h == 0 ? '' : `${h}小时`
			m = m == 0 ? '' : `${Math.abs(m)}分钟`
			this.hour = h + m
		},
		// 点击确认选择时间
		confirmTime() {
			if (this.selectTime[0] && this.selectTime[1] && this.hour) {
				this.oldTimeActive = JSON.parse(JSON.stringify(this.timeActive))
				this.oldSelectTime = JSON.parse(JSON.stringify(this.selectTime))
				this.oldCDate = this.cDate
				this.oldDateArr = JSON.parse(JSON.stringify(this.dateArr))
				this.$emit('onConfirm', this.selectDate, this.selectTime.join('-'), this.hour,this.cDate)
			} else {
				uni.showToast({
					title: '预约时间不能小于1小时',
					icon: 'none'
				})
			}
		},
		popupClose() {
			// this.showPop = false
			this.$emit('popupClose', false)
		}
	}
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.notice{
	height: 110rpx;
	line-height: 100rpx;
	padding: 8rpx 120rpx 0 24rpx;
}
.appointment-time-box{
	padding: 24rpx 24rpx 0;
	background: #fff;
	height: calc(100% - 110rpx - 96rpx);
	.time-box{
		height: calc(100% - 118rpx);
		overflow: auto;
		.time-box-box{
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
}
.bot-btn{
	width: 100%;
	height: 96rpx;
	line-height: 96rpx;
	display: flex;
	.btn{
		font-size: 30rpx;
		text-align: center;
	}
	.btn-left{
		width: 50%;
		height: 100%;
		background: linear-gradient(0deg, rgba(232,234,250,1) 0%,rgba(240,241,249,1) 100%);
		color: #34A2E8;
	}
	.btn-right{
		width: 50%;
		height: 100%;
		color: #fff;
	}
}
</style>
