import { copyFileSync } from "fs"


/*专用于购物组件的通用方法*/
export default {
	updateSelectedGoods(good, selectedGoods, merchantNo, merchantName, goodsTemplate, enableStorageManage ,enableNegativeStorage) {
		let goods = JSON.parse(JSON.stringify(good))
		goods.merchantName = merchantName
		if(goodsTemplate){
			goods.goodsTemplate = goodsTemplate
		}
    if(enableStorageManage && enableNegativeStorage){
      // 存储店铺开启库存和负库存情况
      goods.enableStorageManage = enableStorageManage
      goods.enableNegativeStorage = enableNegativeStorage
    }
		if (goods.count || (typeof goods.mutilOptions === 'object' && +goods.mutilOptions !== 0)) {
			selectedGoods[goods.id] = goods
		} else {
			delete selectedGoods[goods.id]
		}
		//执行缓存
		this.setSelectedGoods(selectedGoods, merchantNo)
		//返回计算数据
		return selectedGoods
	},
	//保存购物缓存
	setSelectedGoods(goods, merchantNo) {
		let allSelect = uni.getStorageSync('SELECTED_GOODS_All') || {}
		allSelect[merchantNo] = goods
		//uni.setStorageSync(`SELECTED_GOODS_${merchantNo}`, goods)		//根据当前店铺以及相应门店号进行缓存
		uni.setStorageSync('SELECTED_GOODS_All', allSelect)
	},
	//清空对应门店购物缓存
	clearSelectedGoods(merchantNo) {
		//uni.setStorageSync(`SELECTED_GOODS_${merchantNo}`, {})
		let allSelect = uni.getStorageSync('SELECTED_GOODS_All')
		delete allSelect[merchantNo]
		uni.setStorageSync('SELECTED_GOODS_All', allSelect)
	},
	//清空所有门店购物缓存
	clearAllSelectedGoods() {
		uni.setStorageSync('SELECTED_GOODS_All', {})
	},
	//清空某个门店的某件商品   单规格
	clearSelectedSomeGood(merchantNo, thingId) {
		//uni.setStorageSync(`SELECTED_GOODS_${merchantNo}`, {})
		let allSelect = uni.getStorageSync('SELECTED_GOODS_All')
		delete allSelect[merchantNo][thingId]
		uni.setStorageSync('SELECTED_GOODS_All', allSelect)
	},
	//获取当前门店下的购物缓存
	getSelectedGoods(merchantNo) {
		//return uni.getStorageSync(`SELECTED_GOODS_${merchantNo}`)
		return (uni.getStorageSync(`SELECTED_GOODS_All`))[merchantNo]
	},
    // 判断是否是购物车进去的订单
	updateIsCart(isCart){
		uni.getStorageSync('ISCART')
		uni.setStorageSync('ISCART', isCart)
	},
	// 获取iscart
	getIsCart(){
		return uni.getStorageSync('ISCART')
	},
	//清空某个门店的某件商品   多规格    index: 表示多规格商品的数组下标   multilOption:规格商品详情
	clearSelectedMultilGood(merchantNo, thingId, index,multilOption) {
		let allSelect = uni.getStorageSync('SELECTED_GOODS_All')
    // 找出这个商品
    let product = allSelect[merchantNo][thingId]
    // 找出多规格数据下标
    let mulIndex = product.multilOptions.findIndex(mul => this.isObjectEqual(mul.goodsAttributes, multilOption.goodsAttributes) && this.isObjectEqual(mul.goodsSpecs, multilOption.goodsSpecs))
    // 记录商品总数
    let totalCount = product.count
    // 记录药被删除的多规格数据总数
    let count = product.multilOptions[mulIndex].count
    // 改变值和数量
    totalCount = totalCount - count
    product.multilOptions.splice(mulIndex, 1)
    allSelect[merchantNo][thingId].multilOptions = product.multilOptions
    allSelect[merchantNo][thingId].count = totalCount
    // 还需要判断是否是该多规格商品的最后一个商品
    // 是的话，需要全部数据删除,即如果总量为零，那么删除店铺
    if(totalCount === 0){
      delete allSelect[merchantNo][thingId]
    }
		uni.setStorageSync('SELECTED_GOODS_All', allSelect)

    

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
  }
}
