<template>
	<view style="position:fixed;height:1300rpx;width: 100%">
		<cu-custom bgColor="bg-blue" is-back>
            <block slot="backText" class="text-white text-ellipsis">{{merchantData.merchantName || '药店名称'}}</block>
        </cu-custom>

		<!-- 分享的页面，显示返回首页的按钮 -->
		<topback-btn  :url="`/pages/index/index`" bgColor="bg-blue" :isBlue="true" :isShare="isShare">
			<block slot="backText" class="text-white text-ellipsis"></block>
		</topback-btn>
		<view class="headBox">
			<view class="head-bg" :style="[{top: CustomBar + 'px'}, {backgroundColor: themeColor}]">
			</view>
			<!--搜索-->
			<view class="search" :style="[{backgroundColor: themeColor}]">
				<input class="search-box" v-model="searchValue" type="text" :border="border" placeholder="请输入您要搜索的商品名称"
					@click="handleSearch" />
			</view>
			<view class="shop-detail">
				<!-- 店铺信息 -->
				<view class="shop-detail-desc">
					<!-- 图片 -->
					<view class="shop-detail-desc-img">
						<image :src="merchantData.logo ? spMatefileBaseURL + merchantData.logo + fixStr : tempImage"
							style="width: 164rpx;height: 164rpx; border-radius: 8rpx;" lazy-load></image>
					</view>
					<!-- 店铺具体信息 -->
					<view class="shop-detail-desc-data">
						<view class="name" @click="goOpen">{{merchantData.merchantName || ''}}</view>
						<view class="address">{{merchantData.address || ''}}</view>
						<view class="time">营业时间：{{merchantData.openTime || '07：00'}} -
							{{merchantData.closeTime || '21：30'}}
						</view>
						<view class="phone">联系商户：{{merchantData.linkPhone || '--'}}</view>
					</view>
					<!-- 打电话按钮 -->
					<view class="shop-detail-desc-phone">
						<!-- <image v-if="merchantData.linkPhone != null" @tap="callPhone()"
							src="../../static/images/icon/icon_phone.png" style="width:40rpx;height:40rpx">
						</image> -->
						<view class="icon-box" v-if="merchantData.linkPhone != null" @tap="callPhone()">
							<u-icon name="phone-fill" :color="themeColor" size="30"></u-icon>
						</view>
					</view>
				</view>

				<view class="shop-detail-coupon"
					v-if="(parseInt(couponList.length) > 0 || parseInt(discounList.length) > 0 )"
					@click="clickCouponList">
					<view class="shop-coupon-list-box" v-if="couponList.length > 0">
						<view v-for="(item, index) in couponList" :key="index">
							<view v-if="index<=1" class="shop-coupon-list">
								<view class="shop-coupon-list-dot shop-coupon-list-dot-left"></view>
								<view class="shop-coupon-list-dot shop-coupon-list-dot-right"></view>
								<view class="shop-coupon-list-money">
									￥<text class="shop-coupon-list-money_num">{{item.value}}</text>
								</view>
								<view class="shop-coupon-status">
									<text v-if="item.activityStatus == 1">已领</text>
									<text style="font-size:20rpx;" v-else>{{item.goodsPrice > 0 ? '购买' : '领取'}}</text>
								</view>
							</view>
						</view>
						<view v-if="couponList.length > 2" class="shop-coupon-more">···</view>
					</view>
					<view class="shop-detail-coupon-discount" v-if="discounList.length > 0">
						<!-- <image src="../../static/images/tab02.png" />{{discounList[0].activityName}} -->
						<view class="shop-detail-condition">满减</view>
						<view class="shop-detail-activityName">
							{{activityObj}}
						</view>
						<view class="shop-detail-activityName-num">
							<text>共{{discounList.length}}个优惠</text>
							<image mode="widthFix" src="../../static/images/arrow_line_right.png" />
						</view>
					</view>
					<!-- <view class="shop-detail-coupon-more">更多<u-icon name="arrow-right"></u-icon>
					</view> -->
				</view>
				<!-- 公告栏 -->
				<view class="notice-box" v-if="noticeList.length>0" @click="clickCouponList">
					<u-notice-bar mode="horizontal" bg-color='#ffffff' font-size="24" color='#9e9e9e'
						:list="noticeList"></u-notice-bar>
				</view>
			</view>

		</view>
		<!--门店详情分类数据-->
		<view v-if="categoryData.length > 0" class="myStoreInfo">
			<scroll-view class="mall-category-left" scroll-y enable-back-to-top>
				<view v-for="(item, index) in categoryData" :key="index" class="category-list"
					:class="[{ 'text-blue bg-white text-bold': selectedIndex == index }]"
					:style="[{color: selectedIndex == index ? themeColor : ''}]" @tap="onChangeType(index)">
					<view class="line" :class="[{ 'bg-blue': selectedIndex == index }]"
						:style="[{backgroundColor: selectedIndex == index ? themeColor : ''}]"></view>
					{{ item.name }}

				</view>
			</scroll-view>

			<scroll-view scroll-y class="mall-category-right" enable-back-to-top>
				<!-- 开启了库存管理，且没有开启负库存销售，不能超过库存数量 -->
				<view class="item-box"
					v-if="merchantData.enableStorageManage === 1 && merchantData.enableNegativeStorage === 0">
					<view class="category-item"
						v-for="(categoryItem, categoryIndex) in categoryData[selectedIndex].goodsList"
						:key="categoryIndex"
						@tap="toGoodListView(categoryItem.id, !categoryItem.stockRemain ? categoryItem.stock : categoryItem.stockRemain)">
						<image class="category-item-img" lazy-load
							:src="categoryItem.productUrlList && categoryItem.productUrlList[0] ? spMatefileBaseURL + categoryItem.productUrlList[0] + fixStr : tempImage"
							mode="aspectFill"></image>
						<view class="category-item-title">
							<view class="category-item-title_name">{{ categoryItem.name }}</view>
							<!-- <view class="category-item-title_sellNum">已售：{{categoryItem.sellNum || 0}}</view> -->
							<view class="category-item-title_pStock">
								<view class="category-item-title_pStock_price">{{ '￥'+ categoryItem.goodsPrice || 0 }}
								</view>
								<!-- 只有非多规格商品才要展示已售罄 -->
								<view class="category-item-title_pStock_stock"
									v-if="(categoryItem.stock === 0 && !categoryItem.isMultiSpec) || (categoryItem.stockRemain === 0 && !categoryItem.isMultiSpec)">
									已售罄</view>
							</view>

						</view>
						<!--点击数量获取组件-->
						<!-- 单规格数据 -->
						<zj-number-box :showModal="false" :color="themeColor" :rowData="categoryItem"
							v-if="categoryItem.stock !== 0 && categoryItem.stockRemain !== 0 && !categoryItem.isMultiSpec"
							:value="selectedGoods[categoryItem.id] ? selectedGoods[categoryItem.id].count : 0"
							@change="getChangeInfo" style="position:absolute;bottom:0;right:2rpx;"
							@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo"
							:max="categoryItem.stockRemain">
						</zj-number-box>
						<!-- 多规格数据 -->
						<zj-number-box :showModal="false" :color="themeColor" :rowData="categoryItem"
							v-if="categoryItem.isMultiSpec"
							:value="selectedGoods[categoryItem.id] ? selectedGoods[categoryItem.id].count : 0"
							@change="getChangeInfo" style="position:absolute;bottom:0;right:2rpx;"
							@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo">
						</zj-number-box>
					</view>
					<view class="category-item" style="height:450rpx">
					</view>
				</view>
				<!-- 开启了库存管理，开启了负库存销售，可以无限量购买 -->
				<!-- 未开启库存管理，可以无限量购买 -->
				<view class="item-box" v-else>
					<view class="category-item"
						v-for="(categoryItem, categoryIndex) in categoryData[selectedIndex].goodsList"
						:key="categoryIndex"
						@tap="toGoodListView(categoryItem.id, !categoryItem.stockRemain ? categoryItem.stock : categoryItem.stockRemain)">
						<image class="category-item-img" lazy-load
							:src="categoryItem.productUrlList && categoryItem.productUrlList[0] ? spMatefileBaseURL + categoryItem.productUrlList[0] + fixStr : tempImage"
							mode="aspectFill"></image>
						<view class="category-item-title">
							<view class="category-item-title_name">{{ categoryItem.name }}</view>
							<!-- <view class="category-item-title_sellNum">已售：{{categoryItem.sellNum || 0}}</view> -->
							<view class="category-item-title_pStock">
								<view class="category-item-title_pStock_price">{{ '￥'+ categoryItem.goodsPrice || 0 }}
								</view>
							</view>

						</view>
						<!--点击数量获取组件-->
						<zj-number-box :showModal="false" :color="themeColor" :rowData="categoryItem"
							:value="selectedGoods[categoryItem.id] ? selectedGoods[categoryItem.id].count : 0"
							@change="getChangeInfo" style="position:absolute;bottom:0;right:2rpx;"
							@popupShow="popupShow" :isInPopup="true" @settleShow="settleShow" :merchantNo="merchantNo">
						</zj-number-box>
					</view>
					<view class="category-item" style="height:450rpx">
					</view>
				</view>
				<!-- 、、 -->

			</scroll-view>
		</view>
		<view v-else class="myStoreInfo">
			<zj-empty v-show="categoryData.length === 0" :img="`${imgUrl}1639019849000/pic_search.png`"
				text="暂无相关数据~" />
		</view>
		<!--结算组件-->
		<settle :distribution="distribution" :showTotal="address" :startPrice="0.01"
			:merchantStock="merchantData.enableStorageManage === 1 && merchantData.enableNegativeStorage === 0"
			:merchantNo="merchantNo" :selectedGoods="selectedGoods" @change="getChangeInfo" :isOrderSettlement="true"
			subtype="good" @delShopAllProduct="delShopAllProduct" :settleShowMOdule="settleShowMOdule"
			@changeShowModel="changeShowModel" cardId="cardId">
		</settle>
		<!-- 规格选择弹窗 -->
		<good-specs-popup :show="ispopupShow" @popupClose="popupClose" :goodsData="goodsSpecsPopData"
			:merchantNo="merchantNo" :merchantData="merchantData" @getSelectData="getSelectData"
			@changeGoodData="changeGoodData"></good-specs-popup>
		<!-- 已经领取的代金券列表 -->
		<u-popup v-model="popCouponShow" mode="bottom" :closeable="true" height="1000">
			<view v-if="couponList.length > 0 || discounList.length > 0"
				class="coupon-activity flex flex-direction page-card" style="padding: 0 24rpx;">
				<!-- <text class="coupon-title">{{ merchantData.merchantName }}</text> -->
				<view class="coupon-title">{{ merchantData.merchantName }}</view>
				<scroll-view scroll-y="true" style="height: 900rpx;">
					<!-- 存在优惠的情况，显示代金券 -->
					<view v-if="couponList.length > 0">
						<text style="font-size: 30rpx;color:#333333;">代金券</text>
						<block v-for="(couponItem, couIndex) in couponList" :key="couIndex">
							<view class="coupon-item">
								<view class="coupon-item-left">
									<view class="ticket">
										<view class="unit">￥</view>
										<view class="num">{{ couponItem.value }}</view>
									</view>
									<view class="criteria">满{{ couponItem.discountCondition }}可用</view>
								</view>
								<view class="coupon-item-center">
									<view class="title text-cut">
										{{couponItem.name}}
									</view>
									<view class="term">
										<template>
											<template>
												有效期{{ couponItem.availableRelative }}天
											</template>
										</template>
									</view>
									<view class="gap-top"></view>
									<view class="gap-bottom"></view>
								</view>
								<view class="coupon-item-right invalid" v-if="couponItem.activityStatus == 1">
									<button class="cu-btn" v-if="couponItem.activityStatus == 1"
										@tap="$toView('user/user-code', true)">去使用</button>
								</view>
								<view class="coupon-item-right" v-else>
									<button class="cu-btn"
										v-if="couponItem.isOpenStore === 0 || (couponItem.isOpenStore === 1 && couponItem.remainStore > 0)"
										@tap="receiveCoupon(couponItem.id, couponItem.goodsPrice > 0, couponItem.isOpenStore, couponItem.remainStore)">
										<text>{{couponItem.goodsPrice > 0 ? '购买' : '领取'}}</text>
									</button>
									<button class="cu-btn" v-else :style="{background: '#d8d8d8'}"
										@tap="receiveCoupon(couponItem.id, false, couponItem.isOpenStore, couponItem.remainStore)">
										<text>已售罄</text>
									</button>
								</view>
							</view>
						</block>

					</view>

					<!-- 存在优惠的情况，显示满减 -->
					<view v-if="discounList.length > 0" class="shop-page-act">
						<text style="font-size: 30rpx;color:#333333;">店铺优惠</text>
						<view class="shop-page-act-data_name">
							<view class="shop-detail-condition">满减</view>
							<view class="shop-detail-activityName">
								{{activityObjAll}}
							</view>
						</view>
					</view>

					<!-- 存在公告的情况，显示公告 -->
					<view class="notice-word-box" v-if="noticeListCopy.length>0">
						<text style="font-size: 30rpx;color:#333333;">店铺公告</text>
						<view class="notice-word" v-for="(item,index) in noticeListCopy" :key="index">
							{{item}}
						</view>
					</view>
					<!-- 用于底部增加空白块，达到与底部有间距的作用 -->
					<view style="height:80rpx;"></view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [

				],
				memberInfo: {
					"identity": {
						"identityId": "dca1cee6c43143ca9f5b81b459a474fb",
						"appType": 1,
						"openid": "ozZZB5dlQD2DhQm4B1d6jgt82ecQ",
						"appid": "wx67205035cdd52bc0",
						"dataSource": 1
					},
					"extra": {
						"amount": 0,
						"pointAmount": 0,
						"collectCount": 2,
						"couponCount": 7
					},
					"member": {
						"subjectIds": ["MD1400029938156965888", "MD1296349752773971968", "9999", "MD1147075206523785216",
							"MD1146690069998997504", "MD1174868589975572480", "MD1336992351234691072",
							"DL1306153654495223808", "MD1187313477199466496", "MD1189384342942650368",
							"MD1338323869265694720", "MD1230397503766138880", "MD1233329431049801728",
							"MD1338319450872614912", "MD1338321807954022400", "MD1157207976998735872",
							"MD1171242223111639040", "MD1424973734221058048", "MD1232913510757961728"
						],
						"identityIds": ["bb95ca9e2a1041a88b2eba690528371f"],
						"locationA": "柯桥区",
						"locationC": "绍兴市",
						"regionId": "9999",
						"phone": "18060570125",
						"name": "用户76768d",
						"memberId": "14474b989a4947f1bba8c7a5f4f2be65",
						"status": 1,
						"locationP": "浙江省"
					},
					"companyStaffEntity": {
						"cellStyleMap": {},
						"id": "18060570125",
						"name": "锋浩",
						"phone": "18060570125",
						"companyName": "超汇",
						"status": 1,
						"createTime": 1625659843964
					}
				},
				noticeListCopy: [], // 用于弹窗里的显示
				barCode: true, //是否扫码直接进入门店
				tempImage: '../../static/images/default-shop.png',
				fixStr: '?x-oss-process=image/resize,m_fill,h_144,w_144&x-image-process=image/resize,m_fill,h_144,w_144', //图片后缀
				merchantNo: '',
				merchantData: {}, //门店详情
				categoryData: [{
					"id": "e98338823c0449e5b0c69afeef595a93",
					"name": "影券套餐",
					"goodsList": [{
						"categoryName": "影券套餐",
						"goodsAttributes": [],
						"garnishVo": [],
						"id": "405e274ea2ba4748b36d7b60af86a3a0",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 1,
						"productUrlList": [
							"service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"
						],
						"goodsSkus": [{
							"price": 43,
							"stock": 10,
							"stockRemain": 11,
							"id": "405e274ea2ba4748b36d7b60af86a3a0",
							"goodsId": "405e274ea2ba4748b36d7b60af86a3a0",
							"sellNum": 21,
							"isInfinite": 0
						}],
						"name": "全闽悦影券豪华版",
						"unit": "张",
						"description": "福建线上约130家，线下约170家， 含金逸万达GGV中瑞等主流影城……\n万达影城-仓山万达广场店\t福建省福州市仓山区金山街道万达广场(仓山店)\n中瑞国际影城（福州白湖亭店）\t福建省则徐大道379号商业广场1层(盖山路口公交站后)\n金逸影城福州新天宇店\t仓山区城门镇福峡路新天宇城市广场4楼\n福州红星太平洋电影城\t仓山区浦上大道198号爱琴海购物公园7层\n福州观者城市影城首山店\t仓山区首山路45号新都汇5楼\n春天国际影城福州金源店\t仓山区林浦路世纪金源购物中心三楼春天国际影城\n观者国际影城福州奥体店\t仓山区建新镇建新大道南侧盘屿路东侧阳光天地2019商铺\n福清悦享中兴影城\t福清市音西街道清昌大道利嘉中心源创新天地3楼\n时代金典数字影院\t福清市玉屏街道官塘乾成龙花园8号楼1层\n大地影院（福清国际商展中心店）\t福建省融城西门元洪路福清国际商展中心南门一楼\n万达影城-福清万达广场店\t福建省福州市福清市音西街道福清万达广场\n万达影城-福清福和万达广场店\t 福建省音西街道福和路9号4层401（裕荣汇4楼）\n福建省海峡影城\t鼓楼区东街3号 （原福建省人民剧场）\n福州大戏院\t鼓楼区五四路212号\n福州大众电影院\t鼓楼区八一七北路192号\n福州伍肆横店影视城\t福建省福州市鼓楼区鼓东街道王府井百货\n中瑞国际影城（福州省体育中心店）\t福建省五四路320号省体育中心公交站\n中瑞国际影城（福州三坊七巷店）\t福建省三坊七巷南后街75号（博览苑对面）\n星聚汇影城(福州泰禾广场店)\t晋安区岳峰镇竹屿路6号东二环泰禾城市广场67层\n稻田影院（稻田创业小镇A9三楼）\t晋安区南平东路98号稻田创业小镇A9（国恵酒楼3楼）\n金逸影城福州紫阳店\t晋安区长乐路157号紫阳商贸中心大润发超市5层\n连江中影星美国际影城\t连江县马祖路万家城市广场3F中影星美影城\n完美世界影城（福州罗源店）\t罗源县滨海新城世纪金源购物中心A区3楼005号\n罗源东方影城\t罗源县凤山镇东外路16号东方星城D区商业楼F3号\n中瑞国际影城（福州马尾中环店）\t福建省马江园区罗星路西北侧马尾中环广场4楼\n幸福蓝海影城\t福建省福州市马尾区江滨东大道68-8号名城广场北区\n中影星美影城（闽侯店）\t闽侯县甘蔗街道昙石山大道北侧136号万家广场7#楼第三、四层\n横店电影城-福建闽侯横店电影城\t闽侯县南屿镇乌龙江南大道79号信通国际中心5号楼6层\n春天国际影城福州大学店\t闽侯县闽侯大学城永嘉天地4楼\n闽侯影狄影院\t闽侯县上街镇邱阳东路6号789共创园2号楼影狄国际影城\n中瑞国际影城（福州正荣财富店）\t福建省乌龙江大道与浦上大道交汇处正荣财富中心四楼\n闽清百荣国际影城\t闽清县梅城镇梅溪南路1号百荣新天地6号楼4层\n平潭星海影城\t平潭县翠园北路367-7号\n福州苏宁影城\t宁化街道长汀街6号福州苏宁广场C区\nMGF私影汇（APM店）\t福州市台江区鳌峰广场4楼\n中影UL影城（中亭街店）\t台江区中亭街区8090时尚广场3楼\n至潮影城(茶亭店)\t台江区八一七路茶亭国际五楼（居然之家）\n金逸福州IMAX万宝商圈\t工业路193号宝龙城市广场5层\n万达影城-金融街万达广场\t福建省福州市台江区鳌峰街道万达广场(金融街店)\n中瑞国际影城（福州红星美凯龙店）\t福建省工业路三迪广场红星美凯龙7楼\n冠景国际影城\t永泰县动车站西侧冠景天地广场四楼冠景国际影城\n长乐中兴星河影城\t长乐市长乐市漳港街道安平广场5楼星河国际影城\n大地影院（福州长山湖店）\t福建省长乐市广场路39号长山湖购物广场（沃尔玛）四楼\n中影UL影城（长乐金峰店）\t长乐市金峰镇胪峰大道好莱钨主题百货2楼\n金逸CC影城（长乐悦城店）\t长乐市航城街道吴航路555号皇庭名郡社会立体公共停车综合1-4层商业1#三层",
						"goodsPrice": 43,
						"stock": 11,
						"stockRemain": 11,
						"sellNum": 21,
						"originPrice": 100,
						"createTime": "2021-07-08T13:57:11.924+0000",
						"isMultiSpec": false,
						"barCode": ""
					}, {
						"categoryName": "影券套餐",
						"goodsAttributes": [],
						"garnishVo": [],
						"id": "b0e845bc44594120a32d5de046f91b0f",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 2,
						"productUrlList": [
							"service-org-7adc24dc/20210708/fa1463d9f45244fa975796b425b7a9e7.jpeg"
						],
						"goodsSkus": [{
							"price": 38,
							"stock": 10,
							"stockRemain": 10,
							"id": "b0e845bc44594120a32d5de046f91b0f",
							"goodsId": "b0e845bc44594120a32d5de046f91b0f",
							"sellNum": 4,
							"isInfinite": 0
						}],
						"name": "全闽悦影券精英版",
						"unit": "张",
						"description": "福建线上约90家，线下约120家， 含金逸，中瑞等主流影城……",
						"goodsPrice": 38,
						"stock": 10,
						"stockRemain": 10,
						"sellNum": 4,
						"originPrice": 80,
						"createTime": "2021-07-08T13:58:21.216+0000",
						"isMultiSpec": false,
						"barCode": ""
					}, {
						"categoryName": "影券套餐",
						"goodsAttributes": [{
							"displayOrder": 1,
							"attribute": "辣的",
							"value": [{
								"makeupPrice": 1,
								"value": "很辣"
							}, {
								"makeupPrice": 1,
								"value": "中辣"
							}, {
								"makeupPrice": 1,
								"value": "微辣"
							}]
						}, {
							"displayOrder": 1,
							"attribute": "鸳鸯锅",
							"value": [{
								"makeupPrice": null,
								"value": "甜的"
							}, {
								"makeupPrice": null,
								"value": "半甜"
							}]
						}],
						"garnishVo": [],
						"goodsSpecs": [{
							"name": "default",
							"specOptions": [{
								"id": "0edd80311f1d4e11ba997fcda9c0563c",
								"specification": "送薯条",
								"pic": "service-org-7adc24dc/20220325/e5b796e86a0a4e6f951db8839dc4eb0f.jpg",
								"price": 2,
								"isInfinite": 1
							}, {
								"id": "90bd245ba3f64f02ade9d768f80ca423",
								"specification": "麻辣烫",
								"price": 2,
								"isInfinite": 1
							}]
						}],
						"id": "1c77094ea7d4450292f861ea6e572f6d",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 99999999,
						"productUrlList": [
							"service-org-7adc24dc/20220325/17bc9839fe2c4431817473777b4d6ad1.jpg"
						],
						"name": "火锅套餐",
						"unit": "份",
						"description": "",
						"goodsPrice": 20,
						"stock": 0,
						"sellNum": 0,
						"originPrice": 20,
						"createTime": "2022-03-25T06:26:13.505+0000",
						"isMultiSpec": true,
						"barCode": ""
					}]
				}], //门店分类详情，保留测试数据
				total: 0, //结算组件价格
				selectedGoods: {}, //选中的商品对象
				distribution: 1, //配送费
				address: false,
				CustomBar: this.CustomBar,
				selectedIndex: 0,
				searchValue: '',
				border: true,
				ispopupShow: false,
				goodsSpecsPopData: {},
				settleShowMOdule: false,
				couponList: [], // 代金券列表
				discounList: [], // 满减列表
				activityObj: '', // 满减的字段拼接
				activityObjAll: '', // 满减字段的完全版，用在不同地方
				popCouponShow: false,
				detailData: {},
				themeColor: '',
				isShare: false,
				location: {
					longitude: '',
					latitude: ''
				},
				imgUrl: '',
				isOrder: null // 判断是否是点单
			};
		},
		onReady() {
			// 判断是否存在桌台号
			if (uni.getStorageSync('deskNo')) {
				uni.setNavigationBarTitle({
					title: '桌台号：' + uni.getStorageSync('deskNo')
				})
			} else {
				uni.setNavigationBarTitle({
					title: uni.getStorageSync('regionName')
				})
			}
		},
		watch: {
			categoryData: {
				handler(val) {
					if (val.length !== 0) {
						this.address = true
					} else {
						this.address = false
						this.selectedGoods = {}
					}
				},
			}
		},
		computed: {},

		onShareAppMessage(res) {
			return {
				title: `${this.merchantData.merchantName}`,
				path: `/pages/shop/categories?barCode=${this.barCode}&id=${this.merchantNo}&isShare=1`
			}
		},
		onShareTimeline() {
			return {
				title: `${this.merchantData.merchantName}`,
				path: `/pages/shop/categories?barCode=${this.barCode}&id=${this.merchantNo}&isShare=1`
			}
		},
		onShow() {},
		methods: {
			goOpen() {
				// uni.navigateTo({
				// 	url: '/pages/openId-page/index'
				// })
			},
			async onShow() {

				this.getSelectGoods()

				//获取当前门店下的缓存记录
				if (this.categoryData.length > 0) {
					this.getSelectGoods()
				}
			},
			getSelectGoods() {
				this.selectedGoods = this.$shopMall.getSelectedGoods(this.merchantNo) ? this.$shopMall
					.getSelectedGoods(this.merchantNo) : {}
				// let selectData = JSON.parse(JSON.stringify(this.selectedGoods))
				// 更新缓存数据
				let timer = setTimeout(function () {
					console.log('更新缓存数据')
					// 设置定时器，避免缓存还未请求，就对数据进行操作
					for (let key in this.selectedGoods) {
						this.categoryData.forEach(good => {
							let arr = good.goodsList.find(data => data.id === key)
							if (arr) {
								//  如果单规格/多规格的属性没有改变
								if (this.selectedGoods[key].isMultiSpec === arr.isMultiSpec) {
									if (!arr.isMultiSpec) {
										//  如果是单规格商品
										let merchantName = this.selectedGoods[key].merchantName
										let count = this.selectedGoods[key].count
										this.selectedGoods[key] = arr
										this.$set(this.selectedGoods[key], 'merchantName', merchantName)
										this.$set(this.selectedGoods[key], 'count', count)
										this.$set(this.selectedGoods[key], 'enableNegativeStorage', this
											.merchantData.enableNegativeStorage)
										this.$set(this.selectedGoods[key], 'enableStorageManage', this
											.merchantData.enableStorageManage)
									} else {
										//  如果是多规格商品
										let count = this.selectedGoods[key].count
										let merchantName = this.selectedGoods[key].merchantName
										let multilOptions = this.selectedGoods[key].multilOptions
										this.selectedGoods[key] = arr
										this.$set(this.selectedGoods[key], 'merchantName', merchantName)
										this.$set(this.selectedGoods[key], 'count', count)
										this.$set(this.selectedGoods[key], 'multilOptions', multilOptions)
										this.$set(this.selectedGoods[key], 'enableNegativeStorage', this
											.merchantData.enableNegativeStorage)
										this.$set(this.selectedGoods[key], 'enableStorageManage', this
											.merchantData.enableStorageManage)
										// 然后要重新计算价格
										this.selectedGoods[key].multilOptions.forEach(selData => {
											// 规格
											if (arr.goodsSpecs && arr.goodsSpecs.length > 0) {
												arr.goodsSpecs[0].specOptions.forEach(spec => {
													if (spec.id === selData.goodsSpecs
														.id) {
														selData.goodsSpecs.price = spec
															.price
													}
												})
											}
											// 属性
											if (arr.goodsAttributes && arr.goodsAttributes.length >
												0) {
												selData.goodsAttributes.forEach(attribute => {
													arr.goodsAttributes.forEach(ad => {
														if (ad.attribute ===
															attribute
															.attribute) {
															let newAttriValue = ad
																.value.find(
																	dav => dav
																	.value ===
																	attribute
																	.value.value)
															// 找到属性的价格并修改
															attribute.value
																.makeupPrice =
																newAttriValue
																.makeupPrice
															// 修改总价
															selData.totalPrice =
																parseInt(selData
																	.goodsSpecs
																	.price
																) + parseInt(
																	attribute.value
																	.makeupPrice)
														}
													})
												})
											}
										})

									}
									// 更新缓存
									// uni.setStorageSync('SELECTED_GOODS_All', this.selectedGoods)
									this.$shopMall.setSelectedGoods(this.selectedGoods, this.merchantNo)
									// this.selectedGoods = JSON.parse(JSON.stringify(newSelectedGoods))
								} else {
									//  如果规格属性更改了，那么直接清除该商品
									delete this.selectedGoods[key]
									// 更新缓存
									this.$shopMall.setSelectedGoods(this.selectedGoods, this.merchantNo)

								}
							}
						});
					}
				}, 1000)



			},
			async onLoad(option) {
				this.getMemberMsg()
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000'
				})
				// 判断是否是点单
				this.isOrder = uni.getStorageSync('ISORDER')
				this.imgUrl = this.$imgUrl

				this.isShare = option.isShare || false
				this.selectedGoods = {}
				this.merchantNo = option.id
				this.barCode = option.barCode || true
				this.location.longitude = option.lon || ''
				this.location.latitude = option.lat || ''
				this.merchantData = {
					"id": "MD1413109041353330688",
					"merchantName": "精彩电影",
					"merchantAlias": null,
					"openTime": "09:00",
					"closeTime": "23:00",
					"logo": "service-org-7adc24dc/20210708/e146701857a042db9ecc2a8f0ffe479c.jpg",
					"businessLicense": "service-org-7adc24dc/20211231/7f8324b5a089496c81bf97e2d0e7f0c4.png",
					"headPhoto": "service-org-7adc24dc/20211231/634098f99ab9484d8bfb0f7744d539f1.png",
					"indoorPhotos": "{\"data\":[\"service-org-7adc24dc/20211231/cae29b9fb615417b9ce6392d224ffd1a.png\"]}",
					"pauseBusiness": 0,
					"pauseOut": null,
					"pauseScanOrder": 1,
					"pauseDirectPay": 1,
					"enablePay": 1,
					"enableAdvert": 1,
					"enableMember": 1,
					"memberDiscountRate": null,
					"institutionalSettlement": null,
					"enableCall": 1,
					"enableOrder": 1,
					"enablePeddle": 1,
					"enableTakeout": 1,
					"enableShiftChange": 0,
					"enableStorageManage": 0,
					"enableNegativeStorage": 0,
					"rightsConfig": null,
					"isDelete": 0,
					"accountInfo": {
						"weiXinPay": 3,
						"aliPay": 3,
						"unionpay": 4
					},
					"createTime": "2021-07-08 20:13:44",
					"updateTime": "2022-03-25 14:27:53",
					"createUserId": "ab1a6e905ddc41949efdfb41246c1456",
					"merchantNo": "9ZLWBzob",
					"regionNo": "DL1333225698034458624",
					"managementType": 0,
					"merchantCategory": null,
					"categoryName": null,
					"categoryArray": [{
						"merchantCategory": "7d87cedb35734128be5185ebcaf2f854",
						"categoryName": "美食",
						"level": 1,
						"loadType": null,
						"goodsTemplate": null
					}],
					"address": "软件大道89号A区双创城",
					"linkman": "",
					"linkPhone": "13599098689",
					"region": "福州软件园",
					"province": "350000",
					"country": null,
					"countryName": null,
					"city": "350100",
					"district": "350102",
					"street": null,
					"provinceName": "福建省",
					"cityName": "福州市",
					"districtName": "鼓楼区",
					"streetName": null,
					"location": {
						"lat": 26.112792972395003,
						"lon": 119.2704301872128
					},
					"space": "9ZLWBzob",
					"pid": null,
					"userId": "daefc160e23a4b35877f1826d4f99ac2",
					"openAllHours": 0,
					"openVipPay": 0,
					"merchants": null,
					"recommendLevel": null,
					"loadType": 0,
					"terminal": {
						"directpay": 1,
						"sweepcodepay": 1,
						"recorder": 1,
						"autoReceipt": 0,
						"enableTakeout": 1,
						"enablePeddle": 1,
						"enableCall": 1,
						"enableMember": 1,
						"terminalModel": 1,
						"cashierModel": 2,
						"enableFlagTerminal": 1,
						"cashWay": 1,
						"cashPay": 1,
						"enableFixedAmount": 0,
						"enableCallNum": 0,
						"enableOrderNotice": 0
					},
					"eleAuthFlag": null,
					"meituanAuthFlag": null,
					"printList": null,
					"industry": 2,
					"origin": null,
					"mchId": null,
					"appid": null,
					"startDeliveryMoney": null,
					"payAppId": null,
					"takeoutConfig": {
						"businessMode": null,
						"isOpen": null,
						"enableMemberPay": null,
						"packType": 1,
						"packFee": null,
						"deliveryType": null,
						"deliveryCost": null,
						"distanceFeeNotice": null,
						"distanceItems": null,
						"weightItems": null,
						"weightFeeNotice": null,
						"freeShipping": 39,
						"enableAutoDistribution": null,
						"timeoutDelivery": null,
						"estimatedTime": null,
						"sinceAddressItems": null,
						"singleDiscountType": null,
						"excludeFavourGoods": null,
						"excludeMemberGoods": null,
						"isMemberDiscount": null,
						"isEnjoyOrderFavour": null,
						"disCountPriorityType": null,
						"isVoucher": null,
						"isVoucherDisabled": null,
						"isDiscountCoupon": null,
						"isDiscountDisabled": null,
						"isFullCutCoupon": null,
						"isFullCutDisabled": null,
						"enableDelivery": null,
						"enableReserve": null,
						"takeoutBusinessItems": null,
						"enableSince": null,
						"takeoutSinceItems": null,
						"enableOrder": null,
						"availableStartDays": null,
						"availableEndDays": null,
						"isAddArea": null,
						"pointArr": null,
						"deliveryScopeType": null,
						"radius": null,
						"enableAutoDelivery": 0,
						"dadaSourceId": null,
						"dadaShopId": null,
						"dadaCityCode": null,
						"sinceItem": {
							"enableSince": 1,
							"takeoutSinceItems": [],
							"startDeliveryMoney": 0.01,
							"sinceAddressItems": [{
								"sinceAddress": "详见商品详情说明",
								"phone": null,
								"name": null
							}],
							"prepareTime": null,
							"remark": "以上为线下兑换地址"
						},
						"deliveryItem": {
							"enableDelivery": 1,
							"startDeliveryMoney": 0.02,
							"deliveryCost": 0,
							"feeNotice": null,
							"distanceItems": [{
								"startDistance": null,
								"endDistance": null,
								"deliveryCost": null,
								"freeShipping": null
							}],
							"estimatedTime": 30,
							"freeShipping": 39,
							"isAddArea": 0,
							"pointArr": [],
							"deliveryScopeType": 2,
							"radius": null,
							"takeoutBusinessItems": [{
								"takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
								"timeItems": null,
								"businessStartTime": "08:00:00",
								"businessEndTime": "22:00:00"
							}],
							"deliveryType": 1,
							"remark": null
						},
						"fixItem": {
							"enableDelivery": 1,
							"startDeliveryMoney": 5,
							"deliveryCost": 0,
							"feeNotice": "",
							"distanceItems": [{
								"startDistance": null,
								"endDistance": null,
								"deliveryCost": null,
								"freeShipping": null
							}],
							"addressItems": [{
								"takeoutBusinessItems": [{
									"takeoutBusinessWeeks": [1, 2, 3, 4, 5, 6, 7],
									"timeItems": [{
										"orderTime": "09:00",
										"deliveryTime": "20:30"
									}, {
										"orderTime": "21:15",
										"deliveryTime": "08:15"
									}, {
										"orderTime": "20:33",
										"deliveryTime": "22:30"
									}, {
										"orderTime": "21:20",
										"deliveryTime": "23:30"
									}],
									"businessStartTime": null,
									"businessEndTime": null
								}],
								"address": "福州市鼓楼区福州软件园A区-17号楼",
								"location": {
									"lng": 119.20326071874541,
									"lat": 26.051783569304174,
									"type": "gcj02"
								}
							}],
							"deliveryType": 1,
							"freeShipping": 1,
							"remark": ""
						},
						"isOpenPostalTakeOut": null,
						"postalMerchantNo": null,
						"notice": {
							"onlyOrderMeal": null,
							"all": null,
							"enableNotice": false,
							"onlyStore": null,
							"noticeList": []
						}
					},
					"ownerPhone": "13599098689",
					"remark": null,
					"enableOrderUnOpenTime": 1,
					"enableDiffTerminalRefund": 0,
					"enableShowInStore": 1,
					"enableRights": 0,
					"pauseTakeOut": 0,
					"activateStatus": null,
					"approvalMsg": null,
					"batchNo": null,
					"pointConfig": {
						"subjectId": null,
						"subjectType": null,
						"openVipScore": 0,
						"enablePointPay": null,
						"pointAccMode": null,
						"pointExpireDays": null,
						"pointPayPAmount": null,
						"pointPayMAmount": null,
						"pointGainPAmount": null,
						"pointGainMAmount": null,
						"pointConsumeMoney": null,
						"pointPayLimitPercent": null,
						"pointPayLimitMoney": null,
						"noArray": null
					},
					"extra": null,
					"extend": null,
					"memberConfig": {
						"enabledMemberPassword": 0,
						"enablePhonePassword": 0,
						"enableCardNoPassword": 0,
						"enablePayCodePassword": 0
					},
					"firstCategory": null,
					"secondCategory": null,
					"jxwlUserId": null,
					"brdId": null,
					"thirdMerchantId": null,
					"yiyaoConfig": null,
					"goodsTemplate": null,
					"enableWalletPay": null,
					"qrcodeMode": 1,
					"collectMode": null,
					"terminalCashMode": null,
					"digitalRestaurantStatus": null,
					"directPayAlias": null,
					"scanOrderAlias": null,
					"rightsMarketingAlias": null,
					"walletPayAlias": null,
					"mallAlias": null,
					"creditRating": null,
					"tags": null,
					"language": null,
					"enableAppoint": 1,
					"postalCode": null,
					"printMsgTemplate": null,
					"extendStr": null
				}

				this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			},
			getMemberMsg() {
				this.memberInfo = {
					"identity": {
						"identityId": "dca1cee6c43143ca9f5b81b459a474fb",
						"appType": 1,
						"openid": "ozZZB5dlQD2DhQm4B1d6jgt82ecQ",
						"appid": "wx67205035cdd52bc0",
						"dataSource": 1
					},
					"extra": {
						"amount": 0,
						"pointAmount": 0,
						"collectCount": 2,
						"couponCount": 7
					},
					"member": {
						"subjectIds": ["MD1400029938156965888", "MD1296349752773971968", "9999",
							"MD1147075206523785216", "MD1146690069998997504", "MD1174868589975572480",
							"MD1336992351234691072", "DL1306153654495223808", "MD1187313477199466496",
							"MD1189384342942650368", "MD1338323869265694720", "MD1230397503766138880",
							"MD1233329431049801728", "MD1338319450872614912", "MD1338321807954022400",
							"MD1157207976998735872", "MD1171242223111639040", "MD1424973734221058048",
							"MD1232913510757961728"
						],
						"identityIds": ["bb95ca9e2a1041a88b2eba690528371f"],
						"locationA": "柯桥区",
						"locationC": "绍兴市",
						"regionId": "9999",
						"phone": "18060570125",
						"name": "用户76768d",
						"memberId": "14474b989a4947f1bba8c7a5f4f2be65",
						"status": 1,
						"locationP": "浙江省"
					},
					"companyStaffEntity": {
						"cellStyleMap": {},
						"id": "18060570125",
						"name": "锋浩",
						"phone": "18060570125",
						"companyName": "超汇",
						"status": 1,
						"createTime": 1625659843964
					}
				}
			},
			getMemberListApi() {
				this.categoryData = [{
					"id": "e98338823c0449e5b0c69afeef595a93",
					"name": "影券套餐",
					"goodsList": [{
						"categoryName": "影券套餐",
						"goodsAttributes": [],
						"garnishVo": [],
						"id": "405e274ea2ba4748b36d7b60af86a3a0",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 1,
						"productUrlList": [
							"service-org-7adc24dc/20210708/6527da911b994bcc9c56027428560c2b.jpeg"
						],
						"goodsSkus": [{
							"price": 43,
							"stock": 10,
							"stockRemain": 11,
							"id": "405e274ea2ba4748b36d7b60af86a3a0",
							"goodsId": "405e274ea2ba4748b36d7b60af86a3a0",
							"sellNum": 21,
							"isInfinite": 0
						}],
						"name": "全闽悦影券豪华版",
						"unit": "张",
						"description": "福建线上约130家，线下约170家， 含金逸万达GGV中瑞等主流影城……\n万达影城-仓山万达广场店\t福建省福州市仓山区金山街道万达广场(仓山店)\n中瑞国际影城（福州白湖亭店）\t福建省则徐大道379号商业广场1层(盖山路口公交站后)\n金逸影城福州新天宇店\t仓山区城门镇福峡路新天宇城市广场4楼\n福州红星太平洋电影城\t仓山区浦上大道198号爱琴海购物公园7层\n福州观者城市影城首山店\t仓山区首山路45号新都汇5楼\n春天国际影城福州金源店\t仓山区林浦路世纪金源购物中心三楼春天国际影城\n观者国际影城福州奥体店\t仓山区建新镇建新大道南侧盘屿路东侧阳光天地2019商铺\n福清悦享中兴影城\t福清市音西街道清昌大道利嘉中心源创新天地3楼\n时代金典数字影院\t福清市玉屏街道官塘乾成龙花园8号楼1层\n大地影院（福清国际商展中心店）\t福建省融城西门元洪路福清国际商展中心南门一楼\n万达影城-福清万达广场店\t福建省福州市福清市音西街道福清万达广场\n万达影城-福清福和万达广场店\t 福建省音西街道福和路9号4层401（裕荣汇4楼）\n福建省海峡影城\t鼓楼区东街3号 （原福建省人民剧场）\n福州大戏院\t鼓楼区五四路212号\n福州大众电影院\t鼓楼区八一七北路192号\n福州伍肆横店影视城\t福建省福州市鼓楼区鼓东街道王府井百货\n中瑞国际影城（福州省体育中心店）\t福建省五四路320号省体育中心公交站\n中瑞国际影城（福州三坊七巷店）\t福建省三坊七巷南后街75号（博览苑对面）\n星聚汇影城(福州泰禾广场店)\t晋安区岳峰镇竹屿路6号东二环泰禾城市广场67层\n稻田影院（稻田创业小镇A9三楼）\t晋安区南平东路98号稻田创业小镇A9（国恵酒楼3楼）\n金逸影城福州紫阳店\t晋安区长乐路157号紫阳商贸中心大润发超市5层\n连江中影星美国际影城\t连江县马祖路万家城市广场3F中影星美影城\n完美世界影城（福州罗源店）\t罗源县滨海新城世纪金源购物中心A区3楼005号\n罗源东方影城\t罗源县凤山镇东外路16号东方星城D区商业楼F3号\n中瑞国际影城（福州马尾中环店）\t福建省马江园区罗星路西北侧马尾中环广场4楼\n幸福蓝海影城\t福建省福州市马尾区江滨东大道68-8号名城广场北区\n中影星美影城（闽侯店）\t闽侯县甘蔗街道昙石山大道北侧136号万家广场7#楼第三、四层\n横店电影城-福建闽侯横店电影城\t闽侯县南屿镇乌龙江南大道79号信通国际中心5号楼6层\n春天国际影城福州大学店\t闽侯县闽侯大学城永嘉天地4楼\n闽侯影狄影院\t闽侯县上街镇邱阳东路6号789共创园2号楼影狄国际影城\n中瑞国际影城（福州正荣财富店）\t福建省乌龙江大道与浦上大道交汇处正荣财富中心四楼\n闽清百荣国际影城\t闽清县梅城镇梅溪南路1号百荣新天地6号楼4层\n平潭星海影城\t平潭县翠园北路367-7号\n福州苏宁影城\t宁化街道长汀街6号福州苏宁广场C区\nMGF私影汇（APM店）\t福州市台江区鳌峰广场4楼\n中影UL影城（中亭街店）\t台江区中亭街区8090时尚广场3楼\n至潮影城(茶亭店)\t台江区八一七路茶亭国际五楼（居然之家）\n金逸福州IMAX万宝商圈\t工业路193号宝龙城市广场5层\n万达影城-金融街万达广场\t福建省福州市台江区鳌峰街道万达广场(金融街店)\n中瑞国际影城（福州红星美凯龙店）\t福建省工业路三迪广场红星美凯龙7楼\n冠景国际影城\t永泰县动车站西侧冠景天地广场四楼冠景国际影城\n长乐中兴星河影城\t长乐市长乐市漳港街道安平广场5楼星河国际影城\n大地影院（福州长山湖店）\t福建省长乐市广场路39号长山湖购物广场（沃尔玛）四楼\n中影UL影城（长乐金峰店）\t长乐市金峰镇胪峰大道好莱钨主题百货2楼\n金逸CC影城（长乐悦城店）\t长乐市航城街道吴航路555号皇庭名郡社会立体公共停车综合1-4层商业1#三层",
						"goodsPrice": 43,
						"stock": 11,
						"stockRemain": 11,
						"sellNum": 21,
						"originPrice": 100,
						"createTime": "2021-07-08T13:57:11.924+0000",
						"isMultiSpec": false,
						"barCode": ""
					}, {
						"categoryName": "影券套餐",
						"goodsAttributes": [],
						"garnishVo": [],
						"id": "b0e845bc44594120a32d5de046f91b0f",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 2,
						"productUrlList": [
							"service-org-7adc24dc/20210708/fa1463d9f45244fa975796b425b7a9e7.jpeg"
						],
						"goodsSkus": [{
							"price": 38,
							"stock": 10,
							"stockRemain": 10,
							"id": "b0e845bc44594120a32d5de046f91b0f",
							"goodsId": "b0e845bc44594120a32d5de046f91b0f",
							"sellNum": 4,
							"isInfinite": 0
						}],
						"name": "全闽悦影券精英版",
						"unit": "张",
						"description": "福建线上约90家，线下约120家， 含金逸，中瑞等主流影城……",
						"goodsPrice": 38,
						"stock": 10,
						"stockRemain": 10,
						"sellNum": 4,
						"originPrice": 80,
						"createTime": "2021-07-08T13:58:21.216+0000",
						"isMultiSpec": false,
						"barCode": ""
					}, {
						"categoryName": "影券套餐",
						"goodsAttributes": [{
							"displayOrder": 1,
							"attribute": "辣的",
							"value": [{
								"makeupPrice": 1,
								"value": "很辣"
							}, {
								"makeupPrice": 1,
								"value": "中辣"
							}, {
								"makeupPrice": 1,
								"value": "微辣"
							}]
						}, {
							"displayOrder": 1,
							"attribute": "鸳鸯锅",
							"value": [{
								"makeupPrice": null,
								"value": "甜的"
							}, {
								"makeupPrice": null,
								"value": "半甜"
							}]
						}],
						"garnishVo": [],
						"goodsSpecs": [{
							"name": "default",
							"specOptions": [{
								"id": "0edd80311f1d4e11ba997fcda9c0563c",
								"specification": "送薯条",
								"pic": "service-org-7adc24dc/20220325/e5b796e86a0a4e6f951db8839dc4eb0f.jpg",
								"price": 2,
								"isInfinite": 1
							}, {
								"id": "90bd245ba3f64f02ade9d768f80ca423",
								"specification": "麻辣烫",
								"price": 2,
								"isInfinite": 1
							}]
						}],
						"id": "1c77094ea7d4450292f861ea6e572f6d",
						"categoryNo": "e98338823c0449e5b0c69afeef595a93",
						"displayOrder": 99999999,
						"productUrlList": [
							"service-org-7adc24dc/20220325/17bc9839fe2c4431817473777b4d6ad1.jpg"
						],
						"name": "火锅套餐",
						"unit": "份",
						"description": "",
						"goodsPrice": 20,
						"stock": 0,
						"sellNum": 0,
						"originPrice": 20,
						"createTime": "2022-03-25T06:26:13.505+0000",
						"isMultiSpec": true,
						"barCode": ""
					}]
				}]
				//获取缓存
				this.getSelectGoods()



			},
			//修改商品情况
			getChangeInfo(id, value, merchantNo, isPopUpShow) {
				// 如果不是有规格的商品，则可以直接外部添加数量
				if (!isPopUpShow) {
					const newSelectedGoods = this.$shopMall.updateSelectedGoods(value, this.selectedGoods, this.merchantNo,
						this.merchantData.merchantName, this.merchantData.goodsTemplate, this.merchantData
						.enableStorageManage, this.merchantData.enableNegativeStorage)
					this.selectedGoods = JSON.parse(JSON.stringify(newSelectedGoods))
				}

				// 如果有规格，则不进行操作
			},
			//切换分类
			onChangeType(id) {
				this.selectedIndex = id;
			},
			toGoodListView(id, stock) {
				if (stock.toString()) {
					this.$toView(
						`shop/goods-detail?id=${id}&merchantNo=${this.merchantNo}&merchantName=${this.merchantData.merchantName}&stock=${stock}`
					);
				} else {
					this.$toView(
						`shop/goods-detail?id=${id}&merchantNo=${this.merchantNo}&merchantName=${this.merchantData.merchantName}`
					);
				}
			},
			handleSearch() {
				uni.navigateTo({
					url: `/pages/shop/shopSearch?merchantNo=${this.merchantNo}&merchantName=${this.merchantData.merchantName}`
				})
			},
			// 子组件--弹窗清空数据
			delShopAllProduct(value) {
				if (value) {
					// 清空全部数据
					console.log('清空全部数据')
					this.getSelectGoods()
					// this.selectedGoods = {}
					// 数据清空，则也需要情空传递给子组件的数据
					this.goodsSpecsPopData = {}
				}
			},
			// 子组件--显示规格弹窗
			popupShow(ispopupShow, data) {
				// console.log('data-=-==--=-=',data)
				this.ispopupShow = ispopupShow
				if (data.goodsSpecs) {
					for (var i = 0; i < data.goodsSpecs[0].specOptions.length; i++) {
						if (data.goodsSpecs[0].specOptions[i].pic == undefined) {
							data.goodsSpecs[0].specOptions[i].pic = data.productUrlList[0]
						}
					}
				}
				this.goodsSpecsPopData = data
				console.log('data=============data', data)
			},
			// 子组件--关闭规格弹窗
			popupClose(val) {
				this.ispopupShow = val
			},
			// 拨打电话
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.merchantData.linkPhone
				})
			},
			// 子组件 -- 传递选中商品的数据
			getSelectData(value) {
				this.selectedGoods = value
			},
			// 子组件 --- 点击减号让加购商品弹窗出现
			settleShow(val) {
				this.settleShowMOdule = val
			},
			// 子组件 --- 修改加购商品弹窗出现的值
			changeShowModel(value) {
				this.settleShowMOdule = value
			},
			// 子组件 ---  弹窗组件修改商品数据
			changeGoodData(value) {
				this.goodsSpecsPopData = value
			},
			settleChangeData(value) {
				this.getSelectGoods()
			},
			// 显示代金券弹窗
			clickCouponList() {
				this.popCouponShow = true
			},
			async receiveCoupon(goodsId, isToPay, isOpenStore, remainStore) {
				// 先判断用户是否是会员
				if (this.memberInfo.member == undefined) {
					console.log('跳转到登陆', this.merchantNo, this.location)
					uni.navigateTo({
						url: `/pages/login/login?fromurl=${encodeURIComponent(`/pages/shop/categories`)}&id=${this.merchantNo}&lon=${this.location.longitude}&lat=${this.location.latitude}`
					})
					return
				}
				if (isOpenStore === 0 || (remainStore > 0 && isOpenStore === 1)) {
					// 有库存
					if (!isToPay) {
						uni.showToast({
							title: '领取成功'
						})
						this.popShow = false
					} else {
						// 购买
						uni.navigateTo({
							url: `/myPackageA/pages/cash-coupon?couponId=${goodsId}&lat=${this.location.latitude}&lon=${this.location.longitude}`
						})
						this.popShow = false
					}

				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.category-item {
		/deep/ .zj-numbox {
			width: 240rpx !important;
			height: 100rpx !important;
			padding: 10rpx 16rpx 20rpx !important;
			box-sizing: border-box !important;

		}
	}

	/deep/ .u-notice-bar .u-icon__icon {
		color: #FFAF2E !important;
	}

	/deep/ .u-notice-bar {
		padding: 24rpx 0 4rpx !important;
	}

	/deep/.u-number-input {
		background: none !important;
		color: #222222 !important;
	}

	/deep/ .u-icon-plus {
		width: 50rpx !important;
		height: 50rpx !important;
		border-radius: 50rpx !important;
	}

	/deep/ .u-icon-minus {
		width: 50rpx !important;
		height: 50rpx !important;
		border-radius: 50rpx !important;
	}

	.myStoreInfo {
		position: relative;
		// margin-top: 200rpx;
		margin-top: 30rpx;

		.myStoreInfo_title {
			text-align: center;
			font-size: 40rpx;
			margin-top: 180rpx;
		}
	}

	.mall-category-left {
		background-color: #f6f6f6;
		position: absolute;
		z-index: 99;
		width: 200rpx;
		bottom: 600rpx;
		top: 1px;

		.category-list {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 84rpx;
			position: relative;
			width: 200rpx;
			font-size: 26rpx;

			.line {
				width: 6rpx;
				height: 100%;
				position: absolute;
				left: 0;
			}
		}
	}

	.mall-category-right {
		//margin-top: 100rpx;
		margin-left: 200rpx;
		background-color: #fff;
		width: auto;
		height: 1200rpx;
		// padding-bottom: 450rpx;

		.item-box {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			padding: 10rpx;
			margin-bottom: 100rpx;

			.category-item {
				position: relative;
				width: 100%;
				padding: 20rpx 0;

				&-img {
					float: left;
					width: 150rpx;
					height: 150rpx;
					border-radius: 8rpx;
				}

				&-title {
					width: calc(100% - 170rpx);
					float: left;
					font-size: 24rpx;
					margin-left: 20rpx;

					&_name {
						font-size: 28rpx;
						font-weight: 600;
						margin-bottom: 12rpx;
						height: 99rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					&_sellNum {
						font-size: 24rpx;
						color: grey;
						margin-bottom: 12rpx;
					}

					&_pStock {
						display: flex;
						justify-content: space-between;
						align-items: center;

						&_price {
							font-size: 32rpx;
							font-weight: 600;
							color: #ed3c30;
							margin-bottom: 12rpx;
						}

						&_stock {
							font-size: 34rpx;
							color: rgb(170, 165, 165);
							margin-bottom: 12rpx;
							margin-right: 60rpx;
						}
					}
				}
			}
		}
	}

	.headBox {
		width: 100%;

		.head-bg {
			// background-image: linear-gradient(#34A2E8, #87bbee);
			width: 100%;
			height: 260rpx;
			border-radius: 0 0 60rpx 60rpx;
			position: absolute;
			// top: 120rpx;
			z-index: -1;
		}

		.search {
			padding: 24rpx 0;

			.search-box {
				width: 94%;
				height: 60rpx;
				margin: 0 auto;
				text-align: center;
				border: 1px solid #fff;
				border-radius: 50rpx;
				background-color: #fff;
			}

		}



		.shop-detail {
			background: white;
			padding: 20rpx;
			margin: 0 30rpx;
			border-radius: 8rpx;

			.shop-detail-desc {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.shop-detail-desc-img {
					width: 162rpx;
					margin-right: 24rpx;

					image {}
				}

				.shop-detail-desc-data {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					.name {
						font-size: 15px;
						font-weight: 600;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;

					}

					.address {
						font-size: 12px;
						color: #666666;
						font-weight: 500;
						margin-bottom: 20rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;

					}

					.time {
						font-size: 10px;
						color: #A9A9A9;

					}

					.phone {
						font-size: 10px;
						color: #A9A9A9;

					}
				}

				.shop-detail-desc-phone {
					margin-top: 120rpx;

					image {}

					.icon-box {
						width: 40rpx;
						height: 40rpx;
						border-radius: 40rpx;
						background: #f6f6f6;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}

			.shop-detail-coupon {
				// display: flex;
				margin-top: 24rpx;
				align-items: center;

				.shop-coupon-list-box {
					display: flex;

					.shop-coupon-more {
						font-weight: bold;
						color: #9e9e9e;
					}
				}

				.shop-coupon-list {
					display: flex;
					font-size: 24rpx;
					align-items: center;
					position: relative;
					width: 142rpx;
					height: 44rpx;
					background: #EF5353;
					border-radius: 6rpx;
					margin-right: 10rpx;
					position: relative;
					// margin-left: 56rpx;
					// background-image: url;

					&-dot {
						position: absolute;
						width: 14rpx;
						height: 14rpx;
						background: white;
						border-radius: 14rpx;

						&-left {
							left: -7rpx;
						}

						&-right {
							right: -7rpx;
						}
					}

					.shop-coupon-status {
						position: absolute;
						right: 18rpx;
						height: 44rpx;
						line-height: 44rpx;
						color: #fff;
						height: 100%;

					}

					&-money {
						// margin-right: 15rpx;
						font-size: 18rpx;
						// background: #ea5757;
						color: #ffffff;
						padding: 8rpx 18rpx;
						// background-image: url('../../static/images/bg_ticket_nor.png');
						background-size: cover;
						position: relative;

						&_num {
							font-size: 30rpx;
							font-weight: bold;
							margin-right: 16rpx;

						}
					}

					&-discount {
						color: red;
						display: flex;
						// align-content: center;
						align-items: center;
						font-size: 26rpx;
						height: 44rpx;

						image {
							width: 35rpx;
							height: 35rpx;
							margin: 0 10rpx;
						}
					}

					&-more {
						padding-left: 20rpx;
					}
				}


				&-discount {
					color: #333333;
					display: flex;
					// align-items: center;
					font-size: 22rpx;
					height: 46rpx;
					margin-top: 10rpx;
					position: relative;

					.shop-detail-condition {
						margin-top: 9rpx;
						width: 50rpx;
						height: 28rpx;
						// line-height: 26rpx;
						text-align: center;
						border-radius: 4rpx;
						background: #EF5353;
						font-size: 20rpx;
						color: #ffffff;
						margin-right: 16rpx;
					}

					.shop-detail-activityName {
						height: 46rpx;
						line-height: 46rpx;
					}

					.shop-detail-activityName-num {
						height: 46rpx;
						line-height: 46rpx;
						position: absolute;
						color: #a9a9a9;
						right: 0;
						top: 0;

						image {
							width: 10rpx !important;
						}
					}

					image {
						width: 35rpx;
						height: 35rpx;
						margin: 0 10rpx;
					}
				}

			}

			.notice-box {
				margin-top: 20rpx;
				border-top: 2rpx solid #f5f5f5;
			}
		}

		.shopCard {
			position: relative;
			width: 94%;
			//height: 210rpx;
			border-radius: 20rpx;
			margin: 10rpx auto;
			background-color: #fff;
			padding: 30rpx 0 0 0;

			.shopCard_all {
				width: 94%;
				margin: 0 auto;
			}

			.shopRouterToposition {
				width: 94%;
				margin: 0 auto;
				display: flex;
				justify-content: space-around;
				align-items: center;
				// height: 117rpx;
				height: 80rpx;
				position: relative;
				top: 24rpx;


				&-data {
					display: flex;
					align-items: center;

					&-img {
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
					}
				}

			}

			.shopRouterTo {
				width: 94%;
				margin: 0 auto;
				display: flex;
				justify-content: space-around;
				align-items: center;
				// height: 111rpx;
				height: 80rpx;


				&-data {
					display: flex;
					align-items: center;

					&-img {
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
					}
				}
			}



			&-image {
				float: left;
				width: 130rpx;
				height: 130rpx;
			}

			&-texts {
				float: left;
				margin-left: 10rpx;

				&-merchant {
					font-size: 32rpx;
					font-weight: 600;
					margin-top: -20rpx;
					margin-bottom: 8rpx;
				}

				&-address {
					width: 500rpx;
					font-size: 26rpx;
					color: grey;
					margin-bottom: 8rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.shopCard-texts-time,
				.shopCard-texts-phone {
					font-size: 22rpx;
					color: grey;
					margin-bottom: 8rpx;
				}

			}
		}
	}

	.shop-page-act {
		margin-top: 40rpx;

		&-data {
			display: flex;
			padding: 15rpx 30rpx;
			justify-content: space-between;

			&_name {
				display: flex;
				align-items: center;
				margin-top: 10rpx;

				.shop-detail-condition {
					width: 50rpx;
					height: 28rpx;
					// line-height: 26rpx;
					text-align: center;
					border-radius: 4rpx;
					background: #EF5353;
					font-size: 20rpx;
					color: #ffffff;
					margin-right: 16rpx;
				}

				.shop-detail-activityName {
					height: 46rpx;
					line-height: 46rpx;
					color: #666;
					font-size: 24rpx;
				}

				image {
					width: 35rpx;
					height: 35rpx;
					margin-right: 10rpx;
				}

			}

			&_money {
				color: red;

			}
		}
	}

	.notice-word-box {
		margin-top: 40rpx;

		.notice-word {
			color: #666;
			font-size: 22rpx;
			margin-top: 22rpx;
		}
	}

	.coupon-activity {
		.coupon-title {
			text-align: center;
			font-size: 34rpx;
			font-weight: 400;
			height: 100rpx;
			line-height: 100rpx;
			// border-bottom: 2rpx solid #000;
			// margin-top: -16rpx;
		}

		.coupon-item {
			height: 136rpx;
			margin: 20rpx 0 0;
			position: relative;
			overflow: hidden;
			background-color: #FFFBFB;
			display: flex;

			&-left {
				width: 150rpx;
				border-left: 1px solid #FFC3C3;
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				border-top-left-radius: 12rpx;
				border-bottom-left-radius: 12rpx;
				text-align: center;
				color: #E43838;

				.ticket,
				.criteria {
					width: 100%;
					justify-content: center;
				}

				.ticket {
					line-height: 1;
					margin-top: 26rpx;
					display: flex;
					align-items: baseline;

					.num {
						font-size: 44rpx;
					}

					.unit {
						font-size: 24rpx;
					}
				}

				.criteria {
					font-size: 20rpx;
					margin-top: 12rpx;
				}
			}

			&-center {
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				flex: 1;
				display: flex;
				flex-direction: column;
				position: relative;
				padding: 0 10rpx;
				min-width: 0;

				.title {
					padding-top: 30rpx;
					font-size: 25rpx;
					font-weight: 500;
					line-height: 1.1;
					overflow: hidden;
					flex: 1;
				}

				.term {
					font-size: 20rpx;
					color: #999999;
					height: 50rpx;
				}

				.gap-top,
				.gap-bottom {
					position: absolute;
					width: 24rpx;
					height: 24rpx;
					right: -12rpx;
					border-radius: 100%;
					background-color: #FFFFFF;
					border: 1px solid #FFC3C3;
				}

				.gap-top {
					top: -12rpx;
				}

				.gap-bottom {
					bottom: -12rpx;
				}
			}

			&-right {
				display: flex;
				flex-wrap: wrap;
				text-align: center;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
				width: 180rpx;
				color: #fff;
				border-top: 1px solid #FFC3C3;
				border-bottom: 1px solid #FFC3C3;
				border-top: 1px solid #FFC3C3;
				border-right: 1px solid #FFC3C3;
				border-left: 1px dotted #FFC3C3;
				border-top-right-radius: 12rpx;
				border-bottom-right-radius: 12rpx;

				&.invalid {
					button {
						color: #c1c1c1;
						border: 2rpx solid #c1c1c1;
						background: #FFFFFF;
					}
				}

				button {
					width: 128rpx;
					height: 44rpx;
					line-height: 44rpx;
					font-size: 22rpx;
					padding: 0 28rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, #E83E3E 0%, #CD1D1D 100%);
					border-radius: 44rpx;
				}
			}
		}
	}

	.text-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
