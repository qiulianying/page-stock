# fhuview-ui

### DEMO


### GitHub


### NPM
[https://www.npmjs.com/package/fhuview-ui](https://www.npmjs.com/package/fhuview-ui)

### 依赖下载
```
npm i fhuview-ui
```

### uni-app项目使用流程
```
1、main.js
import fhuView from "fhuview-ui";
Vue.use(fhuView);

2、在引入fhuView的全局SCSS主题文件
暂无主题样式(后续添加)

3、引入fhuView基础样式
暂无基础样式(后续添加)

4、配置easycom组件模式
  此配置需要在项目根目录的pages.json中进行。
	"easycom": {
		"^fhu-(.*)": "fhuview-ui/components/fhu-$1/fhu-$1.vue"
	},
```

### 启动
```
npm run serve
```

### 登录npm
```
npm login
```

### 更新组件库到对应依赖
```
npm publish
```
