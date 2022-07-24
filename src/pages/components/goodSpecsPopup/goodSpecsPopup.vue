<template>
	<!-- 规格弹窗 -->
	<view>
		<u-popup v-model="showPop" mode="bottom" border-radius="14" height="1100rpx" closeable @close="popupClose">
			<view class="popup">
				<!-- 商品基本信息 -->
				<view class="popup-top">
					<view class="popup-top-contain">
						<view class="popup-top-contain-left">
              <image v-if="goodsSpecData.goodsSpecs && goodsSpecData.goodsSpecs.length > 0" :src="spMatefileBaseURL + imgData + fixStr" mode="" class="popup-top-contain-left-img">
								</image>
              <image v-else :src="spMatefileBaseURL + imgShop + fixStr" mode="" class="popup-top-contain-left-img">
								</image>
						</view>
						<view class="popup-top-contain-right">
							<view class="popup-top-contain-right-name">
								{{ goodsSpecData.name }}
							</view>
							<view class="popup-top-contain-right-value">
								￥ {{ totalValue }}
							</view>
						</view>
					</view>
					<view class="popup-top-text">
						已选：{{ getCheckedDta }}
					</view>
				</view>
        <!-- 商品数量 -->
        <view class="popup-num">
					<view class="popup-num-contain">
            <view class="text-lg">数量</view>
            <view>
              <!-- <u-number-box v-model="productCount" color="#fff" :bg-color="themeColor" :min="1" :max="maxNumber" 
                @change="getChangeInfo" :disabled-input="true"></u-number-box> -->
                
              <!-- <zj-number-box @change="getChangeInfo" :zjType="true" :rowData="categoryItem" :merchantNo="merchantNo" :value="productCount" :color="themeColor" :min="1" :max="maxNumber">
              </zj-number-box> -->
              <zj-number-box @change="getChangeInfo" :zjType="true" :value="productCount" :color="themeColor" :min="1" :max="maxNumber">
              </zj-number-box>

            </view>
					</view>
				</view>
				<!-- 商品规格/属性 -->
				<view class="popup-main">
          <scroll-view scroll-y="true" style="height:100%">
            <!-- 规格 -->
            <view class="popup-main-contents" v-if="goodsSpecData.goodsSpecs && goodsSpecData.goodsSpecs.length > 0 && goodsSpecData.goodsSpecs[0].name != 'defaultSpec' && goodsSpecData.goodsSpecs[0].specOptions">
              <view class="popup-main-name text-lg">规格</view>
              <view class="popup-main-contain" v-if="goodsSpecData.goodsSpecs && goodsSpecData.goodsSpecs.length > 0 && goodsSpecData.goodsSpecs[0].specOptions">
                <view  v-for="(item, index) in goodsSpecData.goodsSpecs[0].specOptions" :key="index"
                  class="popup-main-contain-label">
                  <!-- <view v-if="item.isInfinite === 1 || ( item.isInfinite === 0 && item.stock !== 0)"  :class=" item.checked ? ' text-ellipsis isChecked' : 'text-ellipsis'"
                  :style="[{border: item.checked ? `${2}rpx solid ${themeColor}` : ''}, {background: item.checked ? themeColorRGB : ''}]"
                    @click="handelerSpec(item)" style="font-weight: 600;">{{ item.specification }}</view>
                  <view v-else class="text-ellipsis" style="color: grey !important;">{{ item.specification }}</view> -->
                  <view v-if="item.isInfinite === 1 || ( item.isInfinite === 0 && item.stock !== 0)"  :class=" item.checked ? ' text-ellipsis isChecked' : 'text-ellipsis'"
                  :style="[{color: item.checked ? themeColor : ''},{border: item.checked ? `${2}rpx solid ${themeColor}` : ''}, {background: item.checked ? themeColorRGB : ''}]"
                    @click="handelerSpec(item)">{{ item.specification }}</view>
                  <view v-else class="text-ellipsis" style="color: grey !important;">{{ item.specification }}</view>
                </view>
              </view>
            </view>
            <!-- 属性 -->
            <view v-if="goodsSpecData.goodsAttributes">
              <view class="popup-main-contents" v-for="(attribute, attributeIndex) in goodsSpecData.goodsAttributes" :key="attributeIndex">
                <view class="popup-main-name text-lg">{{ attribute.attribute }}</view>
                <view class="popup-main-contain">
                  <view  v-for="(attr, attrIndex) in attribute.value" :key="attrIndex" @click="handlerAttr(attribute, attr)" :class="attr.checked ? 'popup-main-contain-label text-ellipsis isChecked' : 'popup-main-contain-label text-ellipsis' "
                  :style="[{color: attr.checked ? themeColor : ''},{border: attr.checked ? `${2}rpx solid ${themeColor}` : ''}, {background: attr.checked ? themeColorRGB : ''}]">
                      {{ attr.value }}
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <!-- 底部确认选择按钮 -->
        <view class="confirm-btn">
          <view class="btn-box" @click="handlerConfirm" :style="{background: themeColor}">加入购物车</view>
        </view>
        <!-- 数量和选择按钮 -->
        <!-- <view class="popup-bottom">
          <view class="popup-bottom-contain">
            <view style="margin-left: 20rpx;">
              数量 <u-number-box v-model="productCount" color="#fff" :bg-color="themeColor" :min="1" :max="maxNumber" @change="getChangeInfo" :disabled-input="true" style="margin-left: 10rpx;"></u-number-box>
            </view>
            <view class="popup-bottom-contain-btn" :style="[{background: themeColor }]" @click="handlerConfirm">
              选好了
            </view>
          </view>
        </view> -->
			</view>
		</u-popup>
    <u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name: 'goodSpecsPopup',
		components: {},
		props: {
			show: {
				//   是否显示merchantData
				type: Boolean,
				default: false
			},
        goodsData: {
				//   商品信息
				type: Object,
				default: () => {}
			},
            merchantNo: {
				//   门店号
				type: String,
				default: ''
			},
            merchantData: {
				//   店铺数据
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
        themeColor: uni.getStorageSync('themeColor') || '#34A2E8',
				imgData: '',
        imgShop: '', // 外层商品的图片
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
        showPop:false,
        goodsSpecData: {},
        specChecked: {},
        attributeChecked: [],
        totalValue: '0',
        selectedGoods: {},
        isChoose: false,
        changeDataValue: {},
        productCount: 1,
        maxNumber: 1,
        themeColor: '',
        themeColorRGB: '',
        goodsPrice: 0 // 商品价格（未加规格和属性）
			};
		},
		onShow() {
      this.getSelectGoods()
    },
		watch: {
          goodsData:{
            handler(val){
              this.changeDataValue = {}
              this.selectedGoods = {}
                   if(val && JSON.stringify(val) !== '{}'){
                   	if (val.goodsSpecs && val.goodsSpecs.length > 0) {
						this.imgData = val.goodsSpecs[0].specOptions[0].pic
					}
          this.imgShop = val.productUrlList[0]
                    // 为了不直接修改父组件的值，所以在子组件中定义goodsSpecData进行赋值和修改
                    let data = JSON.stringify(this.goodsData)
                    this.goodsSpecData = JSON.parse(data)
                    this.goodsPrice = this.goodsSpecData.goodsPrice
                    console.log('商品数据信息', this.goodsSpecData)
                     this.addDataToSpec()
                   }else{
                    this.goodsSpecData = {}
                   }
                },
                deep: true,
                immediate: true
              },
            show:{
                handler(val){
                    this.showPop = val
                    this.getSelectGoods()
                }
            }
		},
		computed: {
             getCheckedDta(){
                let string = this.specChecked.specification == undefined ? '' : this.specChecked.specification
                // 多规格商品的初始价格，如果有规格，选规格时
                let tValue = parseFloat(this.specChecked.price) ? parseFloat(this.specChecked.price) : this.goodsPrice
                console.log('tValue0000000000000',tValue)
                let totalValue = isNaN(tValue) ? 0 : tValue
                this.attributeChecked.forEach((val, index) =>{
                  console.log('val============', val)
                  if (index == 0 && string == '') {
                    string = val.value.value
                  } else {
                    string += `、${val.value.value}`
                  }
                    // 计算总价
                    if(val.value.makeupPrice){
                        totalValue += parseFloat(val.value.makeupPrice)
                    }
                })
                // 保留两位小数
                this.totalValue = totalValue.toFixed(2)
                console.log('totalValue=================',totalValue,'string-------------',string)
                return string
            }
        },
		created() {},
		mounted() {
      this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
      this.themeColorRGB = this.$util.colorRgb(this.themeColor,0.06)  // rgba(53,61,150,0.2)
    },
		beforeDestroy() {},
		methods: {
            // async onShow() {
            //         this.getSelectGoods()

            // },
            getSelectGoods() {
                this.selectedGoods = this.$shopMall.getSelectedGoods(this.merchantNo) ? this.$shopMall
                    .getSelectedGoods(this.merchantNo) : {}
            },
            popupClose(){
                this.$emit('popupClose', false)
                // 关闭属性弹窗还原商品选项数字
                this.productCount = 1
            },
            //修改商品情况
            getChangeInfo(e) {
                // 点击选好了才需要传递数据
                console.log(e, this.maxNumber)
                this.productCount = e
            },
           // 给goodsData数据添加属性
            addDataToSpec(){
                    // 给规格添加checked属性
                    this.specChecked = ''
				if (this.goodsSpecData.goodsSpecs && this.goodsSpecData.goodsSpecs.length > 0) {
					this.goodsSpecData.goodsSpecs[0].specOptions.forEach((spec, index) => {
						if(index !== 0){
							this.$set(spec, 'checked', false)
						}else{
							this.$set(spec, 'checked', true)
							// 初始化选中的规格值
							this.specChecked = spec
							// 初始化库存最大值，开启了库存管理且不是负库存管理
							if( this.merchantData.enableNegativeStorage === 0 && this.merchantData.enableStorageManage === 1){
								if(spec.isInfinite === 0 || spec.isInfinite == undefined){
									this.maxNumber = spec.stock
								}else if(spec.isInfinite === 1){
									this.maxNumber = 99999
								}
							}else{
								// 否则，不限量
								this.maxNumber = 99999
							}
						}
					})
				} else {
          // 否则，不限量
          this.maxNumber = 99999
        }
        console.log('this.maxNumber', this.maxNumber)
                    // 给属性添加checked属性
                    this.attributeChecked = []
                    this.goodsSpecData.goodsAttributes.forEach(attribute => {
                        attribute.value.forEach((attr, attrIndex) => {
                            if(attrIndex !== 0){
                               this.$set(attr, 'checked', false)
                            }else{
                               this.$set(attr, 'checked', true)
                            //  初始化选中的属性值
                               let obj = {
                                   attribute: attribute.attribute,
                                   value: attr
                               }
                               this.attributeChecked.push(obj)
                            }
                        })
                        console.log('this.attributeChecked=================',this.attributeChecked)
                    })
            },
            // 修改规格
            handelerSpec(spec){
                this.goodsSpecData.goodsSpecs[0].specOptions.forEach(val => {
                        if(val.id !== spec.id){
                          val.checked = false
                        }else{
                          val.checked = true
                        // 选中的规格存储到specChecked
                          this.specChecked = val
                          this.imgData = val.pic
                          console.log('this.specChecked@##############',this.specChecked)
                          // 修改库存最大值，开启了库存管理且不是负库存管理
                          if( this.merchantData.enableNegativeStorage === 0 &&  this.merchantData.enableStorageManage === 1){
                            if(val.isInfinite === 0){
                              if(this.productCount > val.stock){
                                this.productCount = val.stock
                              }
                              this.maxNumber = val.stock
                            }else if(val.isInfinite === 1){
                              this.maxNumber = 99999
                            }
                          }else{
                            // 否则，不限量
                            this.maxNumber = 99999
                          }



                        }
                    })
            },
            // 修改属性
            handlerAttr(attribute,attr){
                this.goodsSpecData.goodsAttributes.forEach(val => {
                    // 找到属性所在数组，修改checked的值
                       if(val.attribute === attribute.attribute){
                            val.value.forEach(data => {
                            if(data.value !== attr.value){
                               data.checked = false
                            }else{
                               data.checked = true
                            // 选择的属性存储到attributeChecked
                            this.attributeChecked.forEach(checked => {
                                // 找到这个属性值，需要改变value的值
                                if(checked.attribute === attribute.attribute){
                                    checked.value = attr
                                }
                            })
                            }
                        })
                       }
                    })
            },
            // 点击选好了
            handlerConfirm(){
                this.isChoose = true
                this.showPop =  false
                this.$emit('popupClose', false)
                if(this.isChoose){
                        // this.getSelectGoods()
                        let selectedGoods = this.$shopMall.getSelectedGoods(this.merchantNo) ? this.$shopMall
                    .getSelectedGoods(this.merchantNo) : {}
                        let totalCount = 0
                        this.$set(this.changeDataValue, 'multilOptions', [])
                         this.changeDataValue = JSON.parse(JSON.stringify(this.goodsSpecData))

                         for( let key in selectedGoods){
                            //  到缓存数据里面找出一样店铺的数据，将多规格选择数据填入goodsSpecData
                            if(key === this.changeDataValue.id){
                                totalCount = selectedGoods[key].count
                                this.$set(this.changeDataValue, 'multilOptions',selectedGoods[key].multilOptions )
                            }
                         }

                          // 如果不是第一次选择多规格商品，则进行判断是否选的是同一个类型的商品
                            if(this.changeDataValue.multilOptions && this.changeDataValue.multilOptions.length !== 0){
                              console.log('this.changeDataValue.multilOptions', this.changeDataValue.multilOptions)
                              console.log('this.changeDataValue.multilOptions', this.specChecked)
                            let flagIndex = this.changeDataValue.multilOptions.findIndex(multilOption => this.isObjectEqual(multilOption.goodsAttributes, this.attributeChecked) && this.isObjectEqual(multilOption.goodsSpecs, this.specChecked))
                                // 如果是同一类型的商品,则只需要修改该商品类型的数量
                                console.log('flagIndex', flagIndex)
                                if(flagIndex !== -1){
                                  let goodSpec = this.changeDataValue.multilOptions[flagIndex].goodsSpecs
                                    // this.changeDataValue.multilOptions[flagIndex].count += this.productCount
                                    let count =  this.changeDataValue.multilOptions[flagIndex].count
                                    // 判断数量是否超过库存最大值
                                    if( this.merchantData.enableNegativeStorage === 0 &&  this.merchantData.enableStorageManage === 1){
                                      // 开启了库存管理且不是负库存管理
                                      if(goodSpec.isInfinite === 0){
                                        // 如果大于库存
                                        if(count + this.productCount > goodSpec.stock){
                                          this.$refs.uToast.show({
                                            title: `购物车数量商品添加数量不可以超过库存数（库存：${goodSpec.stock}）`,
                                            type: 'warning',
                                            duration: 4000
                                          })
                                          return
                                        }else{
                                          this.$set(this.changeDataValue.multilOptions[flagIndex], 'count', count + this.productCount)
                                          this.$set(this.changeDataValue, 'count', totalCount + this.productCount)

                                        }
                                      }else if(goodSpec.isInfinite === 1){
                                        // 如果库存是无限库存
                                        this.$set(this.changeDataValue.multilOptions[flagIndex], 'count', count + this.productCount)
                                          this.$set(this.changeDataValue, 'count', totalCount + this.productCount)
                                      }
                                    }else{
                                      // 否则，不限量
                                     this.$set(this.changeDataValue.multilOptions[flagIndex], 'count', count + this.productCount)
                                      this.$set(this.changeDataValue, 'count', totalCount + this.productCount)
                                    }

                                }else{
                                    // 否则需要将该商品类型的数据添加进数据
                                    let obj = {
                                        count: this.productCount, //商品总数
                                        goodsAttributes: this.attributeChecked, // 被选中的属性
                                        goodsSpecs: this.specChecked, // 被选中的规格
                                        totalPrice: parseFloat(this.totalValue), // 总价
                                        id: this.randomProductId() // id
                                    }
                                    this.changeDataValue.multilOptions.push(obj)
                                this.$set(this.changeDataValue, 'count', totalCount + this.productCount)
                                }
                            }else{
                                // 如果是第一次选中多规格商品，直接添加
                                let obj = {
                                            count: this.productCount, //商品总数
                                            goodsAttributes: this.attributeChecked, // 被选中的属性
                                            goodsSpecs: this.specChecked, // 被选中的规格
                                            totalPrice: parseFloat(this.totalValue), // 总价
                                            id: this.randomProductId() // id
                                        }
                                let arr =[]
                                arr.push(obj)
                                this.$set(this.changeDataValue, 'multilOptions', arr)
                                this.$set(this.changeDataValue, 'count', totalCount + this.productCount)
                            }
                        const newSelectedGoods = this.$shopMall.updateSelectedGoods(this.changeDataValue, selectedGoods, this.merchantNo,
                        this.merchantData.merchantName, this.merchantData.goodsTemplate, this.merchantData.enableStorageManage , this.merchantData.enableNegativeStorage)
                        // this.selectedGoods = JSON.parse(JSON.stringify(newSelectedGoods))
                        // 将数据传送给父组件
                        console.log('多规格数据-------newSelectedGoods',newSelectedGoods)
                        console.log('多规格数据-------changeDataValue',this.changeDataValue)
                        this.$emit('getSelectData', JSON.parse(JSON.stringify(newSelectedGoods)))

                        this.$emit('changeGoodData', this.changeDataValue)

                        this.isChoose = false

                }
                // 选好之后还原最初选项
                this.productCount = 1
            },
            // 判断两个对象是否相等
            isObjectEqual (a, b) {
                // 如果其中没有对象
                if (!this.isObject(a) || !this.isObject(b)) {
                    //值类型
                    return a === b
                }
                // 如果特意传的就是两个指向同一地址的对象
                if (a === b) {
                    return true
                }
                // 两个都是对象或者数组，而且不相等
                // 拿到对象key
                let aKeys = Object.keys(a)
                let bKeys = Object.keys(b)
                    // 先判断长度就可以过滤一些
                if (aKeys.length !== bKeys.length) {
                    return false
                }
                // 以a为基准 和 b 一次递归比较
                for (let key in a) {
                    // 递归比较当前每一项
                    const res = this.isObjectEqual(a[key], b[key])
                    // 如果碰到一个不一样的就返回 false
                    if (!res) {
                        // 跳出for循环
                        return false
                    }
                }
                // 否则全相等
                return true
            },
            // 判断是否是对象类型
            isObject(obj) {
                    return typeof obj === 'object' && obj !== null
            },
            // 生成随机数作为多规格商品的ID
            randomProductId(){
              let outTradeNo="";  // id
              for(let i=0;i<6;i++) //6位随机数，用以加在时间戳后面
              {
                  outTradeNo += Math.floor(Math.random()*10);
              }
              outTradeNo = new Date().getTime() + outTradeNo;  //时间戳，用来生成id
              return outTradeNo
            }
        }
	};
</script>
<style lang="scss" scoped>
/deep/.u-number-input {
  background: none !important;
  color: #222222 !important;
}
.popup {
    height: 100%;
    overflow: hidden;
  .isChecked{
      // border: 2rpx solid #0884FE;
      // background: #0884FE !important;
      // color: white !important;
  }
  .popup-top {
    height: 300rpx;
    overflow: hidden;
    // max-height: 328rpx;
    .popup-top-contain {
        display: flex;
        align-items: center;
        margin: 30rpx 20rpx 10rpx 30rpx;
      .popup-top-contain-left {
            // width: 200rpx;
        .popup-top-contain-left-img{
            width: 152rpx;
            height: 152rpx;
            border-radius: 12rpx;
        }
      }

      .popup-top-contain-right {
          flex: 1;
          margin-left: 50rpx;
        .popup-top-contain-right-name {
            font-size: 32rpx;
            // font-weight: bold;

        }

        .popup-top-contain-right-value {
            color: red;
            font-size: 32rpx;
            bottom: 0;
            margin-top: 10rpx;

        }
      }
    }

    .popup-top-text {
      margin: 0 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #F6F6F6;
      height: 85rpx;
      // overflow: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #666;
      .checked-attr-box{
        display: inline-block;
        max-width: 210rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .popup-num{
    height: 90rpx;
    .popup-num-contain{
      display: flex;
      justify-content: space-between;
      padding: 20rpx 30rpx;
    }
  }

  .popup-main {
     margin-left: 30rpx;
     margin-right: 10rpx;
    // max-height: calc(100% - 355rpx - 115rpx);
    height: calc(100% - 300rpx - 90rpx - 120rpx);
     overflow: hidden;
        .popup-main-contents{
          margin-top: 20rpx;
             .popup-main-name{
                margin-bottom: 15rpx;
            }

            .popup-main-contain {
                height: calc(100% - 40rpx - 20rpx) ;
                overflow-y: auto;
            .popup-main-contain-label {
                display: inline-block;
                    background: #F6F6F6;
                    height: 68rpx;
                    // height: 80rpx;
                    // min-width: 30%;
                    min-width: 164rpx;
                    text-align: center;
                    // line-height: 80rpx;
                    line-height: 68rpx;
                    font-size: 28rpx;
                    margin-bottom: 5rpx;
                    margin-right: 15rpx;
                    // padding: 0 10rpx;
                    // border: 2rpx solid #f6f6f6;
                    border-radius: 8rpx;
                    box-sizing: border-box;
            }
            }

        }

  }

  .confirm-btn {
    height: 120rpx;
    width: 100%;
    padding-top: 15rpx;
    .btn-box {
      width: 380rpx;
      height: 86rpx;
      line-height: 86rpx;
      border-radius: 86rpx;
      font-size: 28rpx;
      color: #fff;
      margin: 0 auto;
      text-align: center;
    }
  }

  .popup-bottom {
    //   height: 200rpx;
    //   border-top: 2rpx solid black;

      box-shadow:0rpx -4rpx 10rpx rgb(209, 208, 208);
    .popup-bottom-contain {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100rpx;
        .popup-bottom-contain-btn{
            text-align: center;
            width: 200rpx;
            // background: #0884FE;
            color: white;
            height: 100rpx;
            line-height: 100rpx;
        }

    }
  }
}
.text-ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10rpx;
    border-radius: 8rpx;
    color: #666;
    border: 2rpx solid #f6f6f6;
    background: #f6f6f6;
    // margin-bottom: 20rpx;
}
</style>
