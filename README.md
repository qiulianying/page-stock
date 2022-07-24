# pageStock
该项目作为页面库使用
有关该uni-app相关优化如下，是的项目更加方便可控
1、新增vue.config.js进行对应uni-app配置的快捷操作，分离了部分manifest.json的操作

2、编写小程序环境切换工具实现环境快速切换

3、设置setting快速项目配置，详细可见setting配置情况

4、使用动态生成pages.json，根据对应引入的数据自动化匹配并写入对应路由以及对应路由守护，实现方式如下
(1)、如果想依赖引入的更少，可以通过node.js的方式，读取文件自动生成路由，然后写入并生成一个pages.json
缺点：这里需要每次运行对应的node生成新的pages.json
(2)、uni-app自带一个webpack loader钩子文件pages.js，在项目src目录下建立pages.js(与pages.json同级)即可生效(pages.json仍然需要存在，内容为{}即可)
缺点以及注意点：这里对于page.js需要准守CommonJS规范，且对应引入的js也必须满足CommonJs规范，所以代码编写上会有一定问题，
而且发现使用pages.js在添加路由之后无法实时更新路由情况，每次还要重新启动，效果更差，而且容易导致挂掉，这里决定不不使用，了解下即可
最终结果：
这里由于uni-app项目进行了有关dcloudio/webpack的处理，所以无法类似vue.js的脚手架工具直接使用webpack下api require.context
但是这里都有一个共同的问题，如果只是需要·进行有关路由的自动化获取，是没有问题的，但是这里如果说要对路由进行展示以及其他附带内容
的操作，发现还是不行看的，所以这里提供一个build.js用于进行普通项目的自动化抓取方式，提供index.js进行路由获取以及读取

# 页面库访问地址
页面库访问地址：https://spdev.51zcm.cc/page-stock/h5/index.html#/myPackageB/pages/read/read

# 页面结构路径如下
docker-build   // 项目打包构建以及配置文件
Jenkinsfile    // 项目构建文件
README.md      // 项目注解
vue.config.js  // 项目配置文件
fhuview-ui     // 模拟uView组件编写的组件，到时候作为组件库使用
src/myPackageA // 主要页面库所在页面
src/myPackageB // 主要页面库以及组件库文档所在页面 

# 有关项目命令说民如下
## 项目依赖安装
```
yarn install
```

### 项目运行为h5模式
```
yarn serve
```

### 项目打包h5模式
```
yarn build
```
