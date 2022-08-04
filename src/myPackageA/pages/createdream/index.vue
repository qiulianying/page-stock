<template>
  <view>
    <cu-custom :isBack="true">
      <block slot="backText"></block>
      <block slot="content">创建梦</block>
      <block slot="right">
        <button class='cu-btn bg-oblue' style="margin-right: 20rpx" :disabled="true">发表</button>
      </block>
    </cu-custom>
    <form class="cu-myDream">
      <view class="cu-form-group">
        <input placeholder="写梦想标题更有可能被人关注 (选填)" name="input" maxlength="30"></input>
      </view>
      <view class="cu-form-group">
        <textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="多行文本输入框"></textarea>
      </view>
      <view class="cu-bar bg-white">
<!--        <view class="action">
          梦想图片
        </view>
        <view class="action">
          {{imgList.length}}/6
        </view>-->
      </view>
      <view class="cu-form-group">
        <view class="grid col-4 grid-square flex-sub">
          <view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
            <image :src="imgList[index]" mode="aspectFill"></image>
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class='cuIcon-close'></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
            <text class='cuIcon-cameraadd'></text>
          </view>
        </view>
      </view>
      <view class="cu-form-group">
        <view class="title">截止时间</view>
        <picker mode="date" :value="date" start="2015-09-01" end="2024-09-01" @change="DateChange">
          <view class="picker">
            {{date}}
          </view>
        </picker>
      </view>

      <view class="cu-form-group margin-top">
        <view class="title">
          <text class="cuIcon-light text-theme"></text>
          <text>更新频次</text>
        </view>
        <picker @change="PickerChange" :value="index" :range="picker">
          <view class="picker">
            {{ index>-1? picker[index]:'默认每天打卡'}}
          </view>
        </picker>
      </view>
      <view class="cu-form-group" @tap="chooseLocation">
        <view class="title">
          <text class="cuIcon- zjIcon-address text-theme"></text>
          <text>在哪里</text>
        </view>
        <input placeholder="点击选择地址" name="input"></input>
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-form text-theme"></text>
          <text>公开</text>
        </view>
        <switch @change="SwitchA" :class="switchA?'checked':''" :checked="switchA?true:false"></switch>
      </view>
      <view class="cu-form-group">
        <view class="saveAlbum">
          <text class="saveAlbumTitle">保存相册</text>
          <checkbox class='round blue' :class="checkboxMe?'checked checkboxMe':'checkboxMe'" :checked="checkboxMe?true:false"></checkbox>
        </view>
      </view>
    </form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      index: -1,
      picker: ['每天打卡', '每周打卡', '每月打卡'],
      multiIndex: [0, 0, 0],
      date: '',
      switchA: false,
      checkboxMe: false,
      imgList: [],
      modalName: null,
      textareaAValue: '',
      textareaBValue: '',
    };
  },
  onLoad(options) {
    this.date = this.$util.dateFormat(new Date(), '-')
  },
  methods: {
    // 地图选择
    chooseLocation() {
      uni.chooseLocation({
        success: data => {
          this.addressData.addressName = data.name
          this.addressData.address = data.name
        }
      })
    },
    PickerChange(e) {
      this.index = e.detail.value
    },
    DateChange(e) {
      this.date = e.detail.value
    },
    SwitchA(e) {
      this.switchA = e.detail.value
    },
    ChooseImage() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.imgList.length != 0) {
            this.imgList = this.imgList.concat(res.tempFilePaths)
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
    textareaAInput(e) {
      this.textareaAValue = e.detail.value
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
}
</style>
