<template>
  <view class="declaration_container">
    <!-- 所选日期显示区域 -->
    <view class="declaration_head">
      <view class="declaration_head_Date">
        已选时间
        <u-input
          class="date_input"
          border-color="#6cb0ff"
          type="text"
          :border="true"
          placeholder=" "
          :value="selectDayText"
          disabled
        />
      </view>
    </view>
    <!-- 日历区域 -->
    <view class="declaration_calendar">
      <view class="declaration_calendar_content">
        <!--日历组件-->
        <wCalendar
          :pickDate="true"
          type="sign"
          @selectDay="SelectDay"
          @selectDayRange="SelectDayRange"
        />
      </view>
      <view class="declaration_calendar_button">
        <u-button class="button_sure" type="error" size="min" @click="DateSure">确认</u-button>
      </view>
    </view>
    <!-- 报餐弹出层 -->
    <u-popup v-model="popupShow" mode="bottom">
      <view class="popup_container">
        <u-cell-group v-if="mealDateShow">
          <u-cell-item :arrow="false" title="选择日期类型" v-if="mealDateTypeShow">
            <u-radio-group v-model="mealDateType" active-color="#129f31" @change="RadioChange">
              <u-radio
                v-for="(item, index) in mealDateTypeList"
                :key="index"
                :name="item.name"
              >{{item.name}}</u-radio>
            </u-radio-group>
          </u-cell-item>
          <u-cell-item :arrow="false" :title="'报餐天数共：'+mealTotalDays+' 天'"></u-cell-item>
        </u-cell-group>
        <view class="popup_separate"></view>
        <u-cell-group>
          <u-cell-item
            :arrow="false"
            :title="item.name"
            v-for="(item,index) in mealTypeList"
            :key="index"
          >
            <u-checkbox
              active-color="#129f31"
              shape="square"
              v-model="item.checked"
              :name="item.id"
              @change="CheckboxChange"
            ></u-checkbox>
          </u-cell-item>
        </u-cell-group>
        <view class="popup_bottom">
          <u-button class="popup_bottom_button" type="error" size="min" @click="MealSure">报餐</u-button>
        </view>
      </view>
    </u-popup>
    <u-modal
      v-model="mealSureShow"
      :show-title="false"
      :show-cancel-button="true"
      @confirm="MealDeclaration"
    >
      <view class="meal_sure">您确定要报餐吗?</view>
    </u-modal>
    <!-- 轻提示 -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import wCalendar from "../../../components/w-calendar/w-calendar";
export default {
  data() {
    return {
      selectDay: null, //日历单选日期
      selectDayRange: [], //日历多选日期
      selectDayText: null, //输入框显示日期
      popupShow: false, //报餐弹出层显示
      mealDateShow: false, //报餐日期类型和天数展示
      mealDateTypeShow: false, //报餐日期类型展示
      /* 报餐日期类型数组 */
      mealDateTypeList: [
        { name: "全部" },
        { name: "工作日" },
        { name: "休息日" }
      ],
      mealDateType: "全部", //报餐日期类型
      selectTotalDays: null, //多选总天数
      dayOff: null, //多选范围休息日天数
      mealTotalDays: null, //报餐总天数
      /* 报餐类型数组 */
      mealTypeList: [
        { id: "01", name: "早餐", checked: false },
        { id: "02", name: "午餐", checked: false },
        { id: "03", name: "晚餐", checked: false },
        { id: "04", name: "夜宵", checked: false }
      ],
      mealSureShow: false //报餐确认弹窗展示
    };
  },
  components: {
    wCalendar
  },
  methods: {
    /* 日历单选取得日期 */
    SelectDay(val) {
      this.selectDay = val;
      this.selectDayText = this.selectDay ? this.selectDay.date : "";
    },
    SelectDayRange(val) {
      this.selectDayRange = val;
      this.selectDayText = this.selectDayRange.length
        ? this.selectDayRange[0].date + " 至 " + this.selectDayRange[1].date
        : "";
    },
    /* 确认日期，进行下一步 */
    DateSure() {
      /* 需选择日期 */
      if (this.selectDay || this.selectDayRange.length) {
        /* 单选隐藏多选的日期类型选择，多选进入计算 */
        if (this.selectDayRange.length) {
          /* 计算多选的总天数 */
          this.selectTotalDays =
            (new Date(this.selectDayRange[1].date) -
              new Date(this.selectDayRange[0].date)) /
              (1000 * 60 * 60 * 24) +
            1;
          /* 进入时默认日期类型单选为“全部”，所选天数即为报餐总天数 */
          this.mealTotalDays = this.selectTotalDays;
          /* 获取多选范围内有多少休息日 */
          this.GetDayOff();
          if (this.dayOff === 0) {
            this.mealDateShow = true;
            this.mealDateTypeShow = false;
          } else {
            this.mealDateShow = true;
            this.mealDateTypeShow = true;
          }
        } else {
          this.mealDateShow = false;
          this.mealDateTypeShow = false;
        }
        /* 弹窗打开 */
        this.popupShow = true;
      } else {
        this.$refs.uToast.show({
          title: "请先选择日期",
          type: "warning"
        });
      }
    },
    /* 多选计算休息日*/
    GetDayOff() {
      let week = null; //星期
      this.dayOff = 0;
      for (let i = 0; i < this.selectTotalDays; i++) {
        week = new Date(
          new Date(this.selectDayRange[0].date).getTime() +
            1000 * 60 * 60 * 24 * i
        ).getDay();
        if (week === 0 || week === 6) {
          this.dayOff += 1;
        }
      }
    },
    /* 报餐日期类型单选 */
    RadioChange() {
      if (this.mealDateType === "休息日") {
        this.mealTotalDays = this.dayOff;
      } else if (this.mealDateType === "工作日") {
        this.mealTotalDays = this.selectTotalDays - this.dayOff;
      } else if (this.mealDateType === "全部") {
        this.mealTotalDays = this.selectTotalDays;
      } else {
      }
    },
    /* 报餐类型多选 */
    CheckboxChange() {
      console.log(this.mealTypeList);
    },
    /* 报餐确认 */
    MealSure() {
      this.mealSureShow = true;
    },
    /* 报餐 */
    MealDeclaration() {
      this.popupShow = false;
      this.$refs.uToast.show({
        title: "报餐成功",
        type: "success"
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.declaration_container {
  background-color: #f5f4f4;
  position: relative;
  .declaration_head {
    width: 100%;
    // padding: 80rpx;
    .declaration_head_Date {
      padding: 40rpx;
      display: flex;
      align-items: center;
      .date_input {
        margin-left: 40rpx;
      }
    }
  }
  .declaration_calendar {
    padding: 10rpx 20rpx;
    .declaration_calendar_content {
      padding: 20rpx 20rpx 40rpx 20rpx;
      background-color: white;
    }
    .declaration_calendar_button {
      padding: 30rpx 20rpx 40rpx 20rpx;
      background-color: white;
      border-top: 1px solid #c7c7c7;
      .button_sure {
        font-size: 28rpx;
        width: 160rpx;
        height: 54rpx;
        border-radius: 40rpx;
      }
    }
  }
  .popup_container {
    /deep/ .u-cell-item-box {
      padding-top: 20rpx;
    }
    /deep/.u-cell {
      padding: 20rpx 40rpx;
    }
    /deep/.u-cell_title {
      font-size: 32rpx;
    }
    .popup_separate {
      background-color: #f0f0f0;
      height: 40rpx;
    }
    .popup_bottom {
      padding: 30rpx 20rpx 40rpx 20rpx;
      background-color: white;
      border-top: 1px solid #f0f0f0;
      .popup_bottom_button {
        font-size: 28rpx;
        width: 160rpx;
        height: 54rpx;
        border-radius: 40rpx;
      }
    }
  }
  .meal_sure {
    width: 100%;
    height: 200rpx;
    line-height: 200rpx;
    text-align: center;
  }
}
</style>
