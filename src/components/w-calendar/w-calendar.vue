/* w日历组件-改使用说明w: 
适用于uni-app项目，使用rpx作为单位，默认rpx=1/2px，使用了uni的选择器、提示
提供日期多选、日期单选、年月切换、清空选择
传入参数详见props
返回：
1、selectDay：单选模式下所选日期参数，包含年、月、日、星期、日期
2、selectDayRange:多选模式下所选日期参数，包含年、月、日、星期、日期
*/
<template>
  <view class="calendar-box">
    <!-- 顶部年月选择 -->
    <view class="month">
      <view class="month_button">
        <view
          @click="LastYear"
          :class="lastYearButton ? 'month_last' : 'month_last month_button_close'"
        ><<</view>
        <view
          @click="LastMonth"
          :class="lastMonthButton ? 'month_last' : 'month_last month_button_close'"
        ><</view>
      </view>
      <!--选择器选择当前年月-->
      <picker
        v-if="pickDate"
        :start="startDate"
        :end="endDate"
        class="month_now"
        mode="date"
        fields="month"
        @change="ChangeDate"
      >
        <view>{{year}} 年 {{month}} 月</view>
      </picker>
      <view class="month_button">
        <view
          @click="NextMonth"
          :class="nextMonthButton ? 'month_next' : 'month_next month_button_close'"
        >></view>
        <view
          @click="NextYear"
          :class="nextYearButton ? 'month_next' : 'month_next month_button_close'"
        >>></view>
      </view>
    </view>
    <!-- 操作区域 -->
    <view class="handle">
      <picker
        v-if="pickModel"
        class="select_model"
        mode="selector"
        :value="modelIndex"
        :range="modelList"
        @change="ChangeModel"
      >{{modelList[modelIndex]}}</picker>
      <view class="clear" @click="ClearSelect">清空选择</view>
    </view>
    <!-- 星期显示 -->
    <view class="week">
      <view
        :style="'color:'+(item===todayWeek?colorOne+';font-size:36rpx;font-weight:bold;':'')"
        v-for="(item, index) in weekArr"
        :key="index"
      >{{item}}</view>
    </view>
    <!-- 具体日期 -->
    <view class="day">
      <view
        :class="[{'blank':item.type==='last'||item.type==='next'||(startDate&&item.date<startDate)||(endDate&&item.date>endDate)}]"
        v-for="(item,index) in dayArr"
        :key="index"
        @click="SelectDay(item,index)"
      >
        <view
          :style="'color:'+(item.date===today?colorOne+';font-size:36rpx;font-weight:bold;':'')"
          :class="['myDay', {'radio': item.date === selectDay },{'checkBox':item.date===selectDayRangeOne||item.date===selectDayRangeTwo},{'checkBoxRange':item.date>selectDayRangeOne&&item.date<selectDayRangeTwo}]"
        >{{item.day}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    /* 星期切换中英文参数，默认中文 */
    lang: {
      type: String,
      default: "zh"
    },
    /* 年月范围限制,格式为yyyy-mm-dd,
    组件传参格式为需为字符串:startDate="'2021-01-15'"，
    默认无限制 */
    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    },
    /* 年月选择器开关，默认开启 */
    pickDate: {
      type: Boolean,
      default: true
    },
    /* 选择模式控制，默认可切换单选多选 */
    pickModel: {
      type: Boolean,
      default: true
    },
    /* 关闭模式切换时使用，控制日历选择模式，0单选，1多选 */
    pickModelIndex: {
      type: Number,
      default: 0
    },
    /* 基础色调 */
    colorOne: {
      type: String,
      default: "#FF8F22"
    }
  },
  data() {
    return {
      /* 年月按钮样式控制参数 */
      lastYearButton: true,
      nextYearButton: true,
      lastMonthButton: true,
      nextMonthButton: true,
      today: null, // 今日日期
      todayWeek: null, // 今日星期
      dayArr: [], // 当前月显示的日期集合
      day: new Date().getDate(), // 选择的日期，默认今日
      month: new Date().getMonth() + 1, // 选择的月份，默认本月
      year: new Date().getFullYear(), // 选择的年份，默认今年
      weekArr: ["日", "一", "二", "三", "四", "五", "六"], // 星期名称集合
      selectDay: null, //单选已选择日期
      selectDayRange: [], //多选已选择日期
      selectDayRangeOne: null, //第一个多选日期，从对象数组中取出使用避免出现问题
      selectDayRangeTwo: null, //第二个多选日期，从对象数组中取出使用避免出现问题
      modelIndex: 0, //日历选择模式序号
      modelList: ["日期单选", "日期多选"] //模式列表
    };
  },
  mounted() {
    /* 中英切换 */
    if (this.lang != "zh") {
      this.weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    } else {
    }
    /* 今日日期yyyy-mm-dd格式 */
    this.today = this.FormatDate(this.year, this.month, this.day);

    /* 今日星期 */
    this.todayWeek = this.weekArr[new Date().getDay()];

    /* 关闭模式选择时，定义日历日期选择模式 */
    if (!this.pickModel) {
      this.modelIndex = this.pickModelIndex;
    } else {
    }

    /* 获取本月显示的所有日期 */
    this.GetDays();
  },
  methods: {
    // 格式化日期
    FormatNum(num) {
      return num < 10 ? "0" + num : num;
    },
    FormatDate(year, month, day) {
      return year + "-" + this.FormatNum(month) + "-" + this.FormatNum(day);
    },
    // 上个月
    LastMonth() {
      if (this.month == 1) {
        /* 日期选择范围限制判断 */
        if (
          (this.startDate &&
            this.FormatDate(this.year - 1, 12, 31) >= this.startDate) ||
          !this.startDate
        ) {
          this.year -= 1;
          this.month = 12;
        } else {
          uni.showToast({
            icon: "none",
            title: "最小选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      } else {
        /* 日期选择范围限制判断,天数取最大值31进行判断 */
        if (
          (this.startDate &&
            this.FormatDate(this.year, this.month - 1, 31) >= this.startDate) ||
          !this.startDate
        ) {
          this.month -= 1;
        } else {
          uni.showToast({
            icon: "none",
            title: "最小选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      }
      //日期变化
      this.GetDays();
    },
    // 下个月
    NextMonth() {
      if (this.month == 12) {
        /* 日期选择范围年月限制判断 */
        if (
          (this.endDate &&
            this.FormatDate(this.year + 1, 1, 1) <= this.endDate) ||
          !this.endDate
        ) {
          this.year += 1;
          this.month = 1;
        } else {
          uni.showToast({
            icon: "none",
            title: "最大选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      } else {
        /* 日期选择范围年月限制判断 */
        if (
          (this.endDate &&
            this.FormatDate(this.year, this.month + 1, 1) <= this.endDate) ||
          !this.endDate
        ) {
          this.month += 1;
        } else {
          uni.showToast({
            icon: "none",
            title: "最大选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      }
      //日期变化
      this.GetDays();
    },
    // 上一年
    LastYear() {
      /* 日期选择范围年月限制判断 */
      if (
        (this.startDate &&
          this.FormatDate(this.year - 1, 12, 31) >= this.startDate) ||
        !this.startDate
      ) {
        this.year -= 1;
      } else {
        /* 此时年份大于等于限制最小值的年份，但月份小于限制最大值的月份，因此判断此时月份是否等于，不等于则将限制最小值月份值赋予 */
        let monthMin = Number(this.startDate.split("-")[1]);
        if (this.month !== monthMin) {
          this.month = monthMin;
        } else {
          uni.showToast({
            icon: "none",
            title: "最小选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      }
      //日期变化
      this.GetDays();
    },
    // 下一年
    NextYear() {
      /* 日期选择范围年月限制判断 */
      if (
        (this.endDate &&
          this.FormatDate(this.year + 1, this.month, 1) <= this.endDate) ||
        !this.endDate
      ) {
        this.year += 1;
      } else {
        /* 此时年份小于等于限制最大值的年份，但月份大于限制最大值的月份，因此判断此时月份是否等于，不等于则将限制最大值月份值赋予 */
        let monthMax = Number(this.endDate.split("-")[1]);
        if (this.month !== monthMax) {
          this.month = monthMax;
        } else {
          uni.showToast({
            icon: "none",
            title: "最大选择为" + this.year + "年" + this.month + "月",
            duration: 2000
          });
        }
      }
      //日期变化
      this.GetDays();
    },
    // 选择器变更年月
    ChangeDate(e) {
      this.year = parseInt(e.detail.value.split("-")[0]);
      this.month = parseInt(e.detail.value.split("-")[1]);
      //日期变化
      this.GetDays();
    },
    /* 模式变更 */
    ChangeModel(e) {
      this.modelIndex = e.detail.value;
      /* 切换清空选择 */
      this.ClearSelect();
    },
    /* 清空选择 */
    ClearSelect() {
      this.selectDay = null;
      this.selectDayRange = [];
      this.selectDayRangeOne = null;
      this.selectDayRangeTwo = null;
      this.$emit("selectDay", this.selectDay);
      this.$emit("selectDayRange", this.selectDayRange);
    },
    // 获取本月日期(包括空白日期，即空白补前一个月的结尾，补后一个月的开始)
    GetDays() {
      /* 清空 */
      this.dayArr = [];
      /* 获取当前选择月份总天数 */
      let totalDay = new Date(this.year, this.month, 0).getDate();
      /* 当前月份的数据 */
      let nowDaysArr = [];
      for (let i = 1; i <= totalDay; i++) {
        nowDaysArr.push({
          day: i,
          month: this.month,
          year: this.year,
          week: new Date(this.year + "-" + this.month + "-" + i).getDay(),
          date: this.FormatDate(this.year, this.month, i),
          type: "now"
        });
      }
      /* 前空白补上月月尾 */
      let addLastDaysArr = this.AddLastDays();
      /* 后空白补下月月头 */
      let addNextDaysArr = this.AddNextDays(totalDay);
      /* 获得当前可显示所有日期 */
      this.dayArr = this.dayArr
        .concat(addLastDaysArr)
        .concat(nowDaysArr)
        .concat(addNextDaysArr);
    },
    /* 补充每月前面的空白日期，即上个月的最后几天 */
    AddLastDays() {
      /* 获取当前选择月份第一天的星期 */
      let beginDayweek = new Date(this.year + "-" + this.month + "-1").getDay();
      /* 获取当前选择月份上个月总天数 */
      let lastDays = new Date(this.year, this.month - 1, 0).getDate();
      /* 补前天数 */
      let addLastDays = 0;
      /* 补前数据 */
      let addLastDaysArr = [];
      /* 以周日开头，可以直接以0判断 */
      if (beginDayweek) {
        /* 补前天数=本月开始日期星期 */
        addLastDays = beginDayweek;
        /* 存入数据 */
        for (let i = 0; i < addLastDays; i++) {
          addLastDaysArr.push({
            day: lastDays - i,
            month: this.month - 1,
            year: this.month === 1 ? this.year - 1 : this.year,
            week: new Date(
              (this.month === 1 ? this.year - 1 : this.year) +
                "-" +
                (this.month - 1) +
                "-" +
                (lastDays - i)
            ).getDay(),
            date: this.FormatDate(
              this.month === 1 ? this.year - 1 : this.year,
              this.month - 1,
              lastDays - i
            ),
            type: "last"
          });
        }
        addLastDaysArr = addLastDaysArr.reverse();
      } else {
      }
      return addLastDaysArr;
    },
    /* 补充每月后面的空白日期，即下个月的头几天 */
    AddNextDays(totalDay) {
      /* 获取当前选择月份最后一天的星期,0为周日*/
      let endDayweek = new Date(
        this.year + "-" + this.month + "-" + totalDay
      ).getDay();
      /* 补后天数 */
      let addNextDays = 0;
      /* 以周六为结尾，判断6 */
      if (endDayweek !== 6) {
        addNextDays = endDayweek ? 6 - endDayweek : 6;
      } else {
      }
      /* 补后数据 */
      let addNextDaysArr = [];
      if (addNextDays) {
        /* 存入数据 */
        for (let i = 1; i <= addNextDays; i++) {
          addNextDaysArr.push({
            day: i,
            month: this.month + 1,
            year: this.month === 12 ? this.year + 1 : this.year,
            week: new Date(
              (this.month === 12 ? this.year + 1 : this.year) +
                "-" +
                (this.month + 1) +
                "-" +
                i
            ).getDay(),
            date:
              this.month === 12
                ? this.year + 1
                : this.FormatDate(this.year, this.month + 1, i),
            type: "next"
          });
        }
      } else {
      }
      return addNextDaysArr;
    },
    /* 选择日期 */
    SelectDay(val, index) {
      /* 非本月日期（即空白补充日期）不可点击,超出日期限制范围的也不可点击 */
      if (
        val.type === "now" &&
        (this.startDate ? val.date >= this.startDate : true) &&
        (this.endDate ? val.date <= this.endDate : true)
      ) {
        /* 判断选择模式 */
        if (this.modelIndex === 0) {
          /* 单选模式下如果点击当前选中，不进行任何操作 */
          if (this.selectDay === val.date) {
            return;
          } else {
            this.selectDay = val.date;
            this.$emit("selectDay", val);
          }
        } else if (this.modelIndex === 1) {
          /* 多选模式判断 */
          if (this.selectDayRange.length === 0) {
            this.selectDayRange[0] = val;
            this.selectDayRangeOne = this.selectDayRange[0].date;
          } else if (this.selectDayRange.length !== 0) {
            if (this.selectDayRange[0] && !this.selectDayRange[1]) {
              this.selectDayRange[1] = val;
              /* 判断时间前后，倒置就进行倒序 */
              if (this.selectDayRange[1].date < this.selectDayRange[0].date) {
                this.selectDayRange = this.selectDayRange.reverse();
              } else {
              }
              this.$emit("selectDayRange", this.selectDayRange);
              this.selectDayRangeOne = this.selectDayRange[0].date;
              this.selectDayRangeTwo = this.selectDayRange[1].date;
            } else {
              this.selectDayRange = [];
              this.selectDayRange[0] = val;
              this.selectDayRangeTwo = null;
              this.selectDayRangeOne = this.selectDayRange[0].date;
            }
          } else {
            return;
          }
        } else {
        }
      } else {
        if (val.type === "now") {
          uni.showToast({
            icon: "none",
            title: "超出选择范围",
            duration: 2000
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.calendar-box {
  width: 100%;
  flex-direction: column;
  justify-content: center;
}

.calendar-box,
.month,
.week,
.day {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.month,
.week,
.day {
  width: 700rpx;
}

.month {
  justify-content: space-around;
  margin: 30rpx 0;
  position: relative;
}

.month .month_last {
  margin-left: 40rpx;
  font-size: 34rpx;
}

.month .month_next {
  margin-right: 40rpx;
  font-size: 34rpx;
}

.month_button_close {
  color: #c7c7c7;
}

.month .month_now {
  font-size: 34rpx;
}

.month_button {
  display: flex;
}
.picker {
  width: 160rpx;
  height: 40rpx;
  position: absolute;
  top: 20rpx;
  left: 50%;
  transform: translate(-50%, -50%);
}

.day {
  flex-wrap: wrap;
}

.week > view,
.day > view {
  width: 100rpx;
  height: 100rpx;
  text-align: center;
  position: relative;
  line-height: 100rpx;
}

.day .myDay {
  width: 80rpx;
  height: 80rpx;
  margin: 10rpx auto;
  line-height: 80rpx;
  border-radius: 5rpx;
}

.blank {
  color: #c7c7c7;
}

.circle {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio,
.checkBox {
  background-color: #ff181c !important;
  color: white !important;
}

.checkBoxRange {
  background-color: #ff181c31 !important;
  color: white !important;
}
.handle {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.select_model {
  padding: 10rpx;
  text-align: center;
}
.clear {
  font-size: 30rpx;
  padding: 10rpx;
  text-align: center;
  background-color: unset;
}
</style>
