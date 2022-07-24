<template>
	<view class="point-list">
		<cu-custom bgColor="bg-white" is-back :back-reload="backReload">
			<block slot="backText" class="text-black">{{title}}</block>
		</cu-custom>
    <view class="point-page">
      <!-- <view></view> -->
      <view class="point-head">
        <image class="head-img" src="https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/1639048045019/point_img.png"/>
        <view class="point-note-box">
          <view>可用积分</view>
          <view class="point-number">{{ account.pointAmount ? account.pointAmount : '0' }}</view>
        </view>
      </view>
      <!-- <view class="point-body" :style="{height: `calc(100vh - 290rpx - ${CustomBar}px)`}"> -->
        <scroll-view scroll-y='true' class="point-body" :style="{height: `calc(100vh - 290rpx - ${CustomBar}px)`}" @scrolltolower='lower'>
          <view class="point-body-title">积分记录</view>
          <view class="point-content-box">
            <view class="point-content" v-for="(item, index) in dataList" :key="index">
              <view class="content-title">{{item.remark}}</view>
              <view class="content-time">{{item.createTime | timeFormat}}</view>
              <view class="content-number" :class="item.amount>0?'content-number-plus':''">{{item.amount}}</view>
            </view>
          </view>
          <view v-if="noData" class="point-no-data">没有更多数据了</view>
        </scroll-view>
      <!-- </view> -->
    </view>
	</view>
</template>

<script>
import { getPoint } from '../../../api/infouser'
export default {
	data() {
		return {
      CustomBar: this.CustomBar,
			account: '',
      title: '积分',
      dataList: [],
      query: {
        pager: {
          curPageNum: 1,
          pageSize: 20
        }
      },
      total: '',
      totalPage: '',
      noData: false
		};
	},
  onLoad(option) {
    console.log('option',option.params)
    this.account = JSON.parse(option.params)
    this.getPointList()
  },
  filters: {
    timeFormat(value) {
      let time = ''
      if (value == '' || value == undefined) {
        time = ''
      } else {
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
        time = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
      return time
    }
  },
	methods: {
		getPointList() {
      let params = {
        accountId: this.account.accountId,
        pager: {
          curPageNum: this.query.pager.curPageNum,
          pageSize: this.query.pager.pageSize
        }
      }
      getPoint(params).then(res => {
        console.log('res', res)
        if (res.object.length > 0) {
          this.dataList.push(...res.object)
        } else {
          this.noData = false
        }
        this.total = res.pager.totalCount
        this.totalPage = Math.ceil(res.pager.totalCount/this.query.pager.pageSize)
      })
    },
    lower() {
      console.log('到底了')
      if (this.totalPage>this.query.pager.curPageNum) {
        this.query.pager.curPageNum++
        this.getPointList()
      } else {
        this.noData = true
      }

    }
	}
};
</script>

<style lang="scss" scoped>
.point-page{
  .point-head{
    padding: 34rpx 0 20rpx;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    background: #fff;
    .head-img{
      width: 666rpx;
      height: 198rpx;
    }
    .point-note-box{
      position: absolute;
      height: 198rpx;
      width: 400rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      left: 254rpx;
      top: 34rpx;
      text-align: left;
      color: #FFFFFF;
      font-weight: 400px;
      font-size: 28rpx;
      padding: 42rpx 0;
      .point-number{
        font-weight: 600px;
        font-size: 48rpx;
      }
    }
  }
  .point-body{
    width: 100%;
    margin-top: 22rpx;
    // height: calc(100vh - 334rpx);
    overflow: hidden;
    background: #fff;
    .point-body-title{
      text-align: center;
      color: #000000;
      font-weight: 500px;
      font-size: 32rpx;
      padding: 32rpx 0 22rpx;
    }
    .point-content-box{
      padding: 0 50rpx;
      .point-content{
        height: 134rpx;
        // height: 164rpx;
        border-top: 2rpx solid #EEEEEE;
        padding: 28rpx 12rpx 22rpx;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        position: relative;
        .content-title{
          color: #000000;
          font-weight: 400px;
          font-size: 28rpx;
        }
        .content-time{
          color: #000000;
          font-weight: 400px;
          font-size: 24rpx;
        }
        .content-number{
          color: #000000;
          font-weight: 400px;
          font-size: 40rpx;
          position: absolute;
          right: 12rpx;
          top: 48rpx;
        }
        .content-number-plus{
          color: #F7AD5B!important;
        }
      }
    }
    .point-no-data{
      text-align: center;
      padding: 50rpx 0;
    }
  }
}
</style>
