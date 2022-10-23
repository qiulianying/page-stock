<template>
  <view>
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">更新历程</block>
    </cu-custom>
    <form class="cu-myDream">
      <view class="cu-form-group">
        <input name="input" :disabled="true" :value="title"></input>
      </view>
      <view class="cu-form-group">
        <textarea maxlength="200" @input="textareaAInput" placeholder="请描述你的努力,奋斗的样子真好看"></textarea>
      </view>
      <view class="cu-bar bg-white">
        <view class="action">
          历程图片
        </view>
        <view class="action">
          {{imgList.length}}/4
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
          <view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
            <text class='cuIcon-cameraadd'></text>
          </view>
        </view>
      </view>
        <!--   保存按钮   -->
        <view class="page-bottom">
            <button class="cu-btn bg-theme" :style="{background: themeColor}" @tap="saveAddress">保 存</button>
        </view>
    </form>
  </view>
</template>

<script>
import { dreambuild } from '../../../api/createdream'
export default {
  data() {
    return {
        title: '',
        dreamContent: {
            "dreamId": null,
            "content": "",
            "fileGroupId": null, // 文件组id
        },
      havaContent: false,
      imgList: [],
      textareaBValue: '',
      themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
    };
  },
  onLoad(options) {
      this.title = decodeURIComponent(options.title)
      this.dreamContent.dreamId = options.id
  },
  methods: {
    // 创建梦
    saveAddress() {
      let _this = this
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
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.createInfo()
      }
    },
      // 最终创建新数据
      createInfo(fileGroupId) {
          // 如果存在图片就先调用图片上传
          if (fileGroupId) {
              this.dreamContent.fileGroupId = fileGroupId
          }
          dreambuild(this.dreamContent).then(res => {
              uni.hideLoading()
              uni.showToast({
                  title: '梦想创建成功',
                  icon: 'success',
                  duration: 2000
              });
              // this.$toView(`/myPackageA/pages/dream/dream-detail?id=${this.dreamContent.dreamId}`, false, true, true)
            uni.navigateBack();
          })
      },
    ChooseImage() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
            console.log(res)
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
