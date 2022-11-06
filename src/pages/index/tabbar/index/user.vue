<template>
	<view class="index-user-page">
		<view class="index-user-info">
			<image class="image-bg" src="/static/images/my-bg.jpg" />
			<!--消息以及相关设置-->
			<view class="userSetting">
				<text :class="'myCuIcon cuIcon-recharge'" @tap="toUserMoney"></text>
				<text :class="'myCuIcon cuIcon-moreandroid'" @tap="modalName = true"></text>
			</view>
			<view class="index-user-info-box">
				<image :src="this.$isMemmber() && userInfo.avatar && userInfo.avatar !== '' ? userInfo.avatar : '/static/images/head.jpg'" @tap="handleLogin"/>
				<view class="index-user-allArray">
					<view class="index-user-ArrayList" @tap="toTypeList(item)" v-for="(item, index) in ArrayList" :key="index">
						<view class="listNumber">{{item.number || 0}}</view>
						<view class="listName">{{item.name || ''}}</view>
					</view>
				</view>
			</view>
			<!--底部栏-->
			<view class="index-bottom"></view>
		</view>
		<!--我的梦想-->
		<view class="index-user-dream">
			<view class="index-user-dreamTite">
				<view class="index-user-dreamTiteInfo">
					<view class="name">{{userInfo.username || '请点击头像进行登录'}}</view>
					<view class="visitor" v-if="this.$isMemmber()">访客：{{userInfo.visited || 0}}</view>
				</view>
			</view>
			<view class="index-user-dreamList">
				<view class="flex flex-direction" v-if="cartList.length > 0">
					<zj-dream-list :noPayMoney="true" :headerNo="true" :list="cartList" :key="myKey" @itemClick="toShowList" @addcommnt="addcommnt"></zj-dream-list>
				</view>
				<zj-empty v-if="cartList.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
						  text="暂无梦圆数据~" />
			</view>
		</view>
		<!--底部弹窗-->
		<view class="cu-modal bottom-modal" :class="modalName ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<!--<view class="action text-green">确定</view>-->
					<view class="action">相关设置</view>
					<view class="action text-blue" @tap="modalName = false">取消</view>
				</view>
				<view class="cu-list menu text-left">
					<view @tap="toRouter(item)" class="cu-item" :class="{arrow: item.type !== 'checkbox'}" v-for="(item,index) in modalArrayInfo" :key="index">
						<view class="content mySwitchContent" v-if="item.type === 'checkbox'">
							<view>{{item.title}}</view>
							<view><switch @change="SwitchA" :class="switchA?'checked':''" :checked="switchA?true:false"></switch></view>
						</view>
						<view class="content" v-else>
							<view>{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--退出登录弹窗-->
		<u-modal v-model="showLogin" :content="'请确认是否退出登录'" @confirm="logout" :async-close="true" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import { getUserInfo, loginOut } from '../../../../api/platformgouc'
	import {addComment} from "../../../../api/createdream";

	export default {
		data() {
			return {
				showLogin: false,
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				switchA: false,
				myKey: 0,
				modalArrayInfo: [
					// {
					// 	routerUrl: '',
					// 	title: '修改密码',
					// 	type: 'default'
					// },
					// {
					// 	routerUrl: '',
					// 	title: '隐身访问',
					// 	type: 'checkbox'
					// },
					{
						routerUrl: '',
						title: '退出登录',
						type: 'logout'
					},
					{
						routerUrl: '',
						title: '意见反馈',
						type: 'opinion'
					}
				],
				modalName: false,
				ArrayList: [
					{
						number: '',
						name: '粉丝'
					},
					{
						number: '',
						name: '关注'
					},
					{
						number: '',
						name: '梦想'
					},
					{
						number: '',
						name: '榜单'
					}
				],
				customStyle:{
					background: "#34A2E8"
				},
				imgUrl: '',
				cartList: [],	// 梦想对应数据
				userInfo: {
					avatar: ''
				}
			}
		},
		computed: {},
		created() {
			// 获取当前用户信息
			if (!this.$isMemmber()) {
				console.log('没有当前用户信息')
			} else {
				this.getUserInfoApi()
			}
		},
		mounted() {
			this.imgUrl = this.$imgUrl
			this.themeColor = uni.getStorageSync('themeColor') || '#34A2E8'
			this.customStyle.background = this.themeColor
		},
		methods: {
			toRouter(item) {
				this.modalName = false
				switch (item.type) {
					case 'opinion':
						this.$toView('user/options', false, false, false)
						break;
					case 'logout':
						this.showLogin = true
						break;
				}
			},
			logout() {
				loginOut().then(res => {
					uni.removeStorageSync('mspToken');
					uni.removeStorageSync('userId');
					uni.removeStorageSync('userInfo');
					this.$toView('login/login', false, false, false, true)
				})
			},
			confirm() {
				// 添加评论
				addComment({
					content: this.commentcontent,
					businessId: this.NowItem.id,
					type: 0,
					level: 0,
				}).then(res => {
					this.showComment = false;
					this.commentcontent = ''
					this.getUserInfoApi()
				})
			},
			addcommnt(item) {
				this.commentcontent = ''
				this.NowItem = item
				this.showComment = true
			},
			textareaAInput(e) {
				this.commentcontent = e.detail.value
			},
			getUserInfoApi() {
				// 获取个人详细信息
				getUserInfo().then(res => {
					uni.setStorageSync('userId', res.data.id);
					this.userInfo = res.data
					this.ArrayList[0].number = res.data.fans
					this.ArrayList[1].number = res.data.follows
					this.ArrayList[2].number = res.data.dreams
					this.ArrayList[3].number = res.data.goldDreams
					this.cartList = res.data.myDreams
					this.myKey += 1
				})
			},
			// 筑梦中心
			toUserMoney() {
				this.$toView(`user/user-money`, false, false, false)
			},
			toShowList(item) {
				this.$toView(`/myPackageA/pages/dream/dream-detail?id=${item.id}`, false, false, true)
			},
			handleLogin() {
				// 如果没有登录，先跳转登录页面
				if (this.$isMemmber()) {
					this.$toView('user/index', false, false, false)
				} else {
					this.$toView('login/login', false, false, false)
				}
			},
			toTypeList(item) {
				switch (item.name) {
					case '粉丝':
						this.$toView('user/user-fans')
						break
					case '关注':
						this.$toView('user/user-msg')
						break
					default:
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-user-page {
		.index-user-info {
			width: 100%;
			height: 500rpx;
			position: relative;
			z-index: 0;

			.userSetting {
				position: absolute;
				right: 40rpx;
				top: 160rpx;
				color: #ffffff;
				.cuIcon-recharge {
					margin-right: 60rpx;
				}
				.myCuIcon {
					font-size: 40rpx;
					display: inline-block;
					vertical-align: middle;
				}
			}

			.index-user-info-box {
				position: absolute;
				left: 40rpx;
				right: 40rpx;
				bottom: 40rpx;
				display: flex;
				justify-items: center;
				align-items: center;
				z-index: 300;

				image {
					width: 200rpx;
					height: 200rpx;
					margin-right: 14rpx;
					border-radius: 50%;
				}

				.index-user-allArray {
					margin-left: 10rpx;
					.index-user-ArrayList {
						margin-right: 80rpx;
						display: inline-block;
						vertical-align: middle;
						font-size: 22rpx;
						font-weight: 600;
						color: #FFFFFF;
						text-align: center;
						&:last-child {
							margin-right: 0;
						}
						.listNumber {
							font-size: 32rpx;
						}
					}
				}
			}

			.index-bottom {
				width: 100%;
				z-index: 200;
				position: absolute;
				bottom: 0;
				left: 0;
				background: #ffffff;
				box-shadow: 0px -6px 40px 0px rgba(98,119,192,0.07);
				backdrop-filter: blur(9px);
				height: 80rpx;
				border-radius: 20rpx 20rpx 0 0;
			}
		}

		.index-user-dream {
			background-color: #ffffff;
			.index-user-dreamTite {
				width: 85%;
				margin: 0 auto 50rpx;
				.index-user-dreamTiteInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name {
						margin-left: 20rpx;
						margin-bottom: 10rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #2A2A2A;
						line-height: 36rpx;
					}

					.visitor {
						font-size: 22rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #2A2A2A;
					}
				}
				.myid {
					font-size: 18rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #D8D8D8;
					line-height: 16rpx;
				}
			}

			.index-user-dreamList {
				height: calc(100vh - 750rpx);
				overflow-y: auto;
			}
		}

		/*设置弹窗内容*/
		.bottom-modal {
			.cu-item {
				&:after {
					border-bottom: none;
				}
				.mySwitchContent {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}
	}

	.comment-content {
		width: 80%;
		margin: 0 auto;

		.comment-textarea {
			width: 100%;
			height: 360rpx;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}
</style>
