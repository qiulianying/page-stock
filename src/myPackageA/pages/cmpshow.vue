<template>
    <view class="order">
        <cu-custom bgColor="bg-white" is-back>
            <block slot="backText" class="text-black">组件查看</block>
        </cu-custom>
        <view class="order-list">
            <h3 @click="showPopup">时间组件</h3>
            <XiujunTimeSelector ref="child" 
                :show="showTimePop" :selectedItemColor="themeColor"
                :startTime="startTime" :endTime="endTime" 
                @onConfirm="onTimeConfirm" @selectTime="selectTime" @popupClose="popupClose"
                :timeInterval="timeInterval" :timeSlot="1">
            </XiujunTimeSelector>
            <p>{{getTime}}，共{{hour}}</p>
        </view>
        <view class="time-picker">
            <h3 @click="openTime">时间选择器</h3>
            <!-- <u-picker v-model="show" mode="time" @confirm="onConfirm"></u-picker> -->
            <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="onConfirm">
                <view class="uni-input">{{date}}</view>
            </picker>
            <!-- <button :disabled="isHour">确定</button> -->
            <!-- <u-calendar v-model="show" mode="date" :min-date="minDate" :max-date="maxDate" @change="change"></u-calendar> -->
        </view>

    </view>
</template>

<script>
    import XiujunTimeSelector from '../components/xiujun-time-selector/index.vue';
    export default {
        data() {
            return {
                themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
                showTimePop: false,
                timeInterval: 0.5,
                getTime: '',
                hour: '',
                show: false,
                startDay: '',
                startTime: '08:00',
                endTime: '18:00',
                minDate: '',
                maxDate: '',
                date: '请选择',
                startDate: new Date(),
                endDate: ''
            }
        },
        components: {
            XiujunTimeSelector,
        },
        methods: {
            showPopup() {
                this.showTimePop = true
                this.$refs.child.openPopup()
                console.log(this.showTimePop)
            },
            onTimeConfirm(date, time, cDate) {
                console.log('date && time && cDate',date, time, cDate)
            },
            // 子组件--关闭规格弹窗
			popupClose(val) {
				this.showTimePop = val
			},
            selectTime(date, time) {
                this.getTime = date + ' ' + time
                console.log('selectTime-----------',date,'opiu',time)
                let timeArr = time ? time.split('-') : []
                console.log('timeArr============',timeArr)
                if (timeArr.length>1 && timeArr[0]!='' && timeArr[1]!='') {
                    let timeOne = timeArr[0].split(':')
                    let timeTwo = timeArr[1].split(':')
                    let h = parseInt(timeTwo[0]) - parseInt(timeOne[0])
                    let m = parseInt(timeTwo[1]) - parseInt(timeOne[1])
                    if (m < 0) {
                        h = h -1
                    }
                    h = h == 0 ? '' : `${h}小时`
                    m = m == 0 ? '' : `${Math.abs(m)}分钟`
                    this.hour = h + m
                }
                console.log('时间段选择',time,this.hour)
            },
            openTime() {
                console.log('显示日期选择器')
                this.show = true
            },
            onConfirm(e) {
                this.date = e.detail.value
                console.log('this.time', this.time, e)
                let startDay = `${e.year}-${e.month}-${e.day}`
                startDay = new Date(this.date)
                this.$refs.child.getDateList(startDay, 6, true)
            },
            change(e) {
                console.log('eeeeeeee', e)
            }
        },
        created() {}
    }
</script>

<style lang="scss" scoped>
    .order-list {
        font-size: 30rpx;

        .order-list-info {
            margin: 30rpx 0 30rpx 30rpx;
        }

        .myButton {
            margin: 20rpx 0;
        }
    }
</style>
