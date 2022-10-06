<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">个人信息</block>
		</cu-custom>
		<view class="index-user-page" style="padding-bottom: 110rpx;">
			<view class="index-user-info">
				<image class="image-bg" src="/static/images/my-bg.png" />
				<!--消息以及相关设置-->
				<view class="userSetting">
<!--					<text :class="'myCuIcon cuIcon-comment'" @tap="toNews"></text>-->
					<text :class="'myCuIcon cuIcon-moreandroid'" @tap="toPayMoney"></text>
				</view>
				<view class="index-user-info-box">
					<image :src="this.$isMemmber() && userInfo.avatar && userInfo.avatar !== '' ? userInfo.avatar : '/static/images/head.png'" @tap="handleLogin"/>
					<view class="index-user-allArray">
						<view class="index-user-ArrayList" v-for="(item, index) in ArrayList" :key="index">
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
						<!--关注按钮-->
						<view class="followButton" @click="toFollow">+ 关注</view>
						<!--<view class="visitor" v-if="this.$isMemmber()">访客：{{userInfo.visited || 0}}</view>-->
					</view>
					<view class="myid">id:{{userInfo.id || '' }}</view>
				</view>
				<view class="index-user-dreamList">
					<view class="flex flex-direction" v-if="cartList.length > 0">
						<zj-dream-list :list="cartList" :key="myKey" @itemClick="toShowList" @addcommnt="addcommnt"></zj-dream-list>
					</view>
					<zj-empty v-if="cartList.length === 0" :img="`${imgUrl}1639019849000/pic_shoping.png`"
							  text="暂无梦圆数据~" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUserInfo, follow } from '../../api/platformgouc'
	import {addComment} from "../../api/createdream";

	export default {
		data() {
			return {
				commentcontent: '',	// 评论内容
				NowItem: {},
				showComment: false,
				switchA: false,
				myKey: 0,
				modalArrayInfo: [
					{
						routerUrl: '',
						title: '修改密码',
						type: 'default'
					},
					{
						routerUrl: '',
						title: '隐身访问',
						type: 'checkbox'
					},
					{
						routerUrl: '',
						title: '关于我们',
						type: 'default'
					},
					{
						routerUrl: '',
						title: '意见反馈',
						type: 'default'
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
						name: '筑梦'
					},
					{
						number: '',
						name: '金梦'
					}
				],
				imgUrl: '',
				cartList: [],	// 梦想对应数据
				userInfo: {
					avatar: ''
				},
				id: ''
			}
		},
		computed: {},
		onLoad(option) {
			this.imgUrl = this.$imgUrl
			this.id = option.id
			this.getUserInfoApi(option.id)
		},
		methods: {
			toPayMoney() {
				this.$toView('shop/shop-check', false, false, false)
			},
			addcommnt(item) {
				this.commentcontent = ''
				this.NowItem = item
				this.showComment = true
			},
			textareaAInput(e) {
				this.commentcontent = e.detail.value
			},
			getUserInfoApi(id) {
				// 获取个人详细信息
				getUserInfo({id: id}).then(res => {
					uni.setStorageSync('userId', res.data.id);
					this.userInfo = res.data
					this.ArrayList[0].number = res.data.fans
					this.ArrayList[1].number = res.data.follows
					this.ArrayList[2].number = res.data.dreamBuilds
					this.ArrayList[3].number = res.data.dreams
					this.cartList = res.data.myDreams
					this.myKey += 1
				})
			},
			toNews() {
				this.$toView('user/user-msg')
			},
			toFollow() {
				follow().then(res => {

				})
			},
			toShowList(item) {
				this.$toView(`myPackageA/pages/dream/dream-detail?id=${item.id}`, false, false, true)
			},
			handleLogin() {
				this.$toView(`user/index?id=${this.id}`, false, false, false)
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
			height: 400rpx;
			position: relative;
			z-index: 0;

			.userSetting {
				position: absolute;
				right: 40rpx;
				top: 80rpx;
				color: #ffffff;
				.cuIcon-comment {
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
				width: 90%;
				margin: 0 auto 20rpx;
				.index-user-dreamTiteInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
					position: relative;
					.name {
						margin-bottom: 10rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #2A2A2A;
						line-height: 36rpx;
					}

					.followButton {
						position: absolute;
						top: -20rpx;
						right: 0;
						font-size: 26rpx;
						font-weight: 500;
						color: #2A2A2A;
						width: 140rpx;
						height: 54rpx;
						background: #FFD15A;
						border-radius: 10px;
						line-height: 54rpx;
						text-align: center;
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
				height: calc(100vh - 500rpx - 130upx);
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
