<template>
  <view>
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">创建梦</block>
    </cu-custom>
    <form class="cu-myDream">
      <view class="cu-form-group">
        <input placeholder="写梦想标题更有可能被人关注(限制30字)" name="input" maxlength="30" @input="titeInput"></input>
      </view>
      <view class="cu-form-group">
        <textarea maxlength="200" @input="textareaAInput" placeholder="分享你的梦想Plan, 发布状态的图片 视频 影集动态 更有机会获得关注和奖励哦(限制200字)"></textarea>
      </view>
      <view style="text-align: right;background: #fff;padding-right: 20rpx;font-size: 20rpx" v-show="dreamContent.content.length > 0">您还能输入{{200 - dreamContent.content.length}}字</view>
      <view class="cu-bar bg-white">
        <view class="action">
          梦想图片
        </view>
        <view class="action">
          {{imgList.length}}/6
        </view>
      </view>
      <view class="cu-form-group">
        <view class="grid col-4 grid-square flex-sub">
          <view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
            <image :src="imgList[index]" mode="aspectFill"></image>
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class='cuIcon-close'></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="imgList.length < 6">
            <text class='cuIcon-cameraadd'></text>
          </view>
        </view>
      </view>
      <view class="cu-form-group">
        <view class="title">截止时间</view>
        <picker mode="date" :value="lastTime" start="2015-09-01" end="2024-09-01" @change="DateChange">
          <view class="picker">
            {{lastTime}}
          </view>
        </picker>
      </view>

      <view class="cu-form-group margin-top">
        <view class="title">
          <text class="cuIcon-light text-theme"></text>
          <text>更新频次</text>
        </view>
        <picker @change="PickerChange" :value="dreamContent.updateRate" :range="picker">
          <view class="picker">
            {{ picker[dreamContent.updateRate] }}
          </view>
        </picker>
      </view>
        <view class="cu-form-group" @tap="topicSelect">
            <view class="title">
                <text class="cuIcon- zjIcon-address text-theme"></text>
                <text>选话题</text>
            </view>
            <input placeholder="点击选择或生成话题" name="input" disabled :value="titleInfo"></input>
        </view>
      <view class="cu-form-group" @tap="chooseLocation">
        <view class="title">
          <text class="cuIcon- zjIcon-address text-theme"></text>
          <text>在哪里</text>
        </view>
        <input readonly placeholder="点击选择地址" name="input" :value="dreamContent.address"></input>
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-form text-theme"></text>
          <text>公开</text>
        </view>
        <switch @change="SwitchAChange" :class="dreamContent.isPublic === 1?'checked':''" :checked="dreamContent.isPublic === 1 ? true :false"></switch>
      </view>
<!--      <view class="cu-form-group">
        <view class="saveAlbum">
          <text class="saveAlbumTitle">保存相册</text>
          <checkbox class='round blue' :class="checkboxMe?'checked checkboxMe':'checkboxMe'" :checked="checkboxMe?true:false"></checkbox>
        </view>
      </view>-->
        <!--   保存按钮   -->
        <view class="page-bottom">
            <button class="cu-btn bg-theme" :style="{background: themeColor}" @tap="saveAddress">创建梦</button>
        </view>
    </form>
      <!--   弹出层搜索框   -->
      <u-popup v-model="showInput" mode="bottom" :closeable="true">
          <view class="mySearch">
              <zy-search :isFocus="true" :theme="'circle'" ref="zysearchInfo" :showWant="true" @mySearchInfo="mySearchInfo"></zy-search>
          </view>
      </u-popup>
  </view>
</template>

<script>
import { addDream, upload } from '../../../api/createdream'
export default {
  data() {
    return {
        needReturn: false,
        titleInfo: '',
        dreamContent: {
            title: '', // 标题
            "id": null,
            "content": "",
            "fileGroupId": null, // 文件组id
            "deadLine": '',  // 截止日期
            "isPublic": 1, // 是否公开
            "updateRate": 1, // 默认每天打卡
            "topicIds": [], // 话题id列表
            "longitude": "",
            "latitude": "",
            "province": "",
            "city": "",
            "address": ""
        },
      havaContent: false,
      showInput: false,
      picker: ['每小时打卡', '每天打卡', '每周打卡', '每月打卡', '每年打卡'],
      multiIndex: [0, 0, 0],
      switchA: false,
      checkboxMe: false,
      imgList: [],
      textareaBValue: '',
      themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
        lastTime: '',
    };
  },
  onLoad(options) {
    // 屏蔽微信右上角工具栏
    wx.hideShareMenu()
    this.lastTime = this.$util.dateFormat(new Date(), '-')
    this.dreamContent.deadLine = new Date().getTime()
  },
  methods: {
      // 填写话题
      mySearchInfo(item) {
          this.showInput = false
          this.titleInfo = item.topicName
          this.dreamContent.topicIds.push(item.id)
      },
      // 创建梦
      saveAddress() {
        let _this = this
        if (this.needReturn) {
          return;
        }
        this.needReturn = true
          if (!this.dreamContent.title) {
              uni.showToast({
                  title: '请输入梦想标题',
                  icon: 'error',
                  duration: 2000
              })
              _this.needReturn = false
              return
          }
          uni.showLoading({
              title: '梦想创建中...',
              mask: true
          })
          if (this.imgList.length > 0) {
              console.log(this.imgList)
              // 使用uni-app方法进行文件流上传
              this.$upload(this.imgList[0], this.$baseUrl + '/file/upload', 'files', {
                  isSystem: 0
              }).then(res => {
                  if (this.imgList.length === 1) {
                      if (res.data.length > 0) {
                          this.createInfo(res.data[0].fileGroupId)
                      }
                  } else {
                      this.imgList.forEach((item, index) => {
                          if (index === 0) {
                              return
                          }
                          this.$upload(item, this.$baseUrl + '/file/upload', 'files', {
                              fileGroupId: res.data[0].fileGroupId,
                              isSystem: 0
                          }).then(response => {
                              if (index === this.imgList.length - 1) {
                                  _this.createInfo(res.data[0].fileGroupId)
                              }
                          }).finally(() => {
                            _this.needReturn = false
                          })
                      })
                  }
              }).catch(err => {
                  console.log(err)
              }).finally(() => {
                _this.needReturn = false
              })
          } else {
              this.createInfo()
            _this.needReturn = false
          }
      },
      // 最终创建新数据
      createInfo(fileGroupId) {
          // 如果存在图片就先调用图片上传
          if (fileGroupId) {
              this.dreamContent.fileGroupId = fileGroupId
          }
          addDream(this.dreamContent).then(res => {
              uni.hideLoading()
              uni.showToast({
                  title: '梦想创建成功',
                  icon: 'success',
                  duration: 2000
              });
              this.$toView('index/index', false, true, false)
          })
      },
    // 话题选择
      topicSelect() {
          this.showInput = true
          this.$refs.zysearchInfo.searchInfo()
          this.$refs.zysearchInfo.clearInfo()
      },
      // 地图选择
    chooseLocation() {
        //对应执行定位
        this.$plugin.app.getMapInfo({
            success: data => {
                console.log(data)
                this.dreamContent.longitude = data.longitude.toString()
                this.dreamContent.latitude = data.latitude.toString()
                this.dreamContent.province = data.provinceName
                this.dreamContent.city = data.cityName
                this.dreamContent.address = data.name
            }
        })
      // uni.chooseLocation({
      //   success: data => {
      //     this.addressData.addressName = data.name
      //     this.addressData.address = data.name
      //   }
      // })
    },
    PickerChange(e) {
      this.dreamContent.updateRate = e.detail.value
    },
    DateChange(e) {
        this.lastTime = e.detail.value
        this.dreamContent.deadLine = new Date(e.detail.value).getTime()
    },
    SwitchAChange(e) {
      this.dreamContent.isPublic = e.detail.value ? 1 : 0
    },
    ChooseImage() {
      uni.chooseImage({
        count: 6, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
            console.log(res)
          if (this.imgList.length != 0) {
            // 如果图片超出，进行截取
            if (this.imgList.length + res.tempFilePaths.length > 6) {
              let ax = this.imgList.concat(res.tempFilePaths)
              ax.splice(6, (ax.length) - 6)
              this.imgList = ax
            } else {
              this.imgList = this.imgList.concat(res.tempFilePaths)
            }
          } else {
            this.imgList = res.tempFilePaths
          }
        }
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      uni.showModal({
        title: '亲爱的',
        content: '确定要删除这段回忆吗？',
        cancelText: '再看看',
        confirmText: '再见',
        success: res => {
          if (res.confirm) {
            this.imgList.splice(e.currentTarget.dataset.index, 1)
          }
        }
      })
    },
      titeInput(e) {
          this.dreamContent.title = e.detail.value
      },
    textareaAInput(e) {
      this.dreamContent.content = e.detail.value
    }
  }
}
</script>

<style lang="scss">
.cu-myDream {
  .cu-form-group {
    .title {
      min-width: calc(4em + 15px);
    }

    .saveAlbum {
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
      .saveAlbumTitle {
        margin-right: 10rpx;
      }

      .checkboxMe {
        /deep/ .uni-checkbox-input {
          width: 35rpx;
          height: 35rpx;
        }
      }
    }
  }

  .text-theme {
    margin-right: 15rpx;
  }

    .page-bottom {
        button {
            margin: 64rpx 24rpx 24rpx;
            border-radius: 47rpx;
            font-size: 34rpx;
            color: #FFFFFF;
            height: 94rpx;
            line-height: 94rpx;
            text-align: center;
            display: block;
        }
    }
}
/*弹出层搜索框*/
.mySearch {
    height: 700rpx;
}
</style>
