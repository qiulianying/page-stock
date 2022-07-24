<template>
  <view class="page-openid">
    <view class="open-box">
      openId：<view id="copy-openid">{{openId}}</view>
    </view>
    <button @click="copyOpenId">复制</button>
  </view>
</template>
<script>
import Cookies from 'js-cookie'
import Vue from 'vue'
import {BASE, BASE_URL, PLATFORM_ID} from '../../common/config'
import uniCopy from '../../common/uni-copy'
import consts from '../../common/const'
const API_TYPE = consts.API_TYPE.INFO_MEMBER
import {getAppIdOpenId} from '../../api/infomember'
export default {
  data() {
    return {
      openId: '',
      token: ''
    }
  },
  onLoad(options) {
    this.token = uni.getStorageSync('mspToken')
    this.getOpenID()
  },
  methods: {
    getOpenID() {
      getAppIdOpenId().then(res => {
        this.openId = res.object.openId
      })
    },
    copyOpenId() {
      if (!this.openId) {
        uni.showToast({
          title: '当前没有openid可供复制',
        });
      } else {
        uniCopy({
          content: this.openId,
          success: res => {
            uni.showToast({
              title: res,
              icon: 'success',
              duration: 3000
            })
          },
          error: e =>{
            uni.showToast({
              title: e,
              icon: 'error',
              duration: 3000
            })
          }
        })
      }
      return
      //设置系统剪贴板的内容  提示：API `setClipboardData` is not yet implemented  表示当前并不支持H5 此功能
      let data = this.openId
      console.log('this.openId', data, this.openId)
      if (!data) {
        uni.showToast({
          title: '当前没有openid可供复制',
        });
      } else {
        uni.setClipboardData({
          data: data,
          success: function(res) {
            uni.showToast({
              title: '复制成功',
            });
          }
        });
      }
    }
  }
}
</script>
<style scoped>
.page-openid{
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.open-box{
  margin-top: 350rpx;
  text-align: center;
  font-size: 36rpx;
}
button{
  margin-top: 40rpx;
  background: #353D96;
  width: 40%;
  color: #fff;
}
</style>
