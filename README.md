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

# 该快速项目使用功能到的ui库
1、fhuview-ui：这个是自己编写的uni-app组件库，目前测试阶段，组件不多，慎用
2、uview-ui：主要使用功能的是这个，对应使用方式可以直接查看官网
3、colroui：作为优秀的css组件库，有进行是使用功能，详细使用接入方式可以查看src/colorui/reader
参考页面库访问地址：https://spdev.51zcm.cc/page-stock/h5/index.html#/myPackageB/pages/read/read

# 页面结构路径如下
docker-build   // 项目打包构建以及配置文件
public         // 类似vue-cli3.0以上版本打包使用功能的pbulic一样功能html
src/api        // 接口地址
src/colorui    // colorui相关css组件库
src/common/const.js // 封装项目公用枚举
src/common/https.js // 封装uni-app接口调用方法
src/common/util.js  // 封装公用方法
src/fhuview-ui // 自己编写的模拟uView组件编写的组件，到时候作为组件库使用
src/locales    // 用于处理多语言切换
src/myPackageA // 主要页面库所在页面
src/myPackageB // 主要页面库以及组件库文档所在页面
src/static     // 对应图片以及icon相关
src/store      // 对应store，这里为了方便全局性快速开发，进行了分组处理
src/main.js    // 提供了类似
src/manifest.json // uni-app的相关配置项
src/pages.json // uni-app路由方法的存放
src/setting    // 相关全局设置
vue.config.js  // 这里是类似vue-cli3.0以上版本的配置方式，新增vue.config.js进行对应uni-app配置的快捷操作，分离了部分manifest.json的操作
README.md      // 项目注解

# 对应分支所属功能
master          // 包括完整页面库以及uni-app组件库以及全部配置在内的详细总体项目
(1)、包括组件库以及页面库
(2)、保留了之前详细的接口调用以及所有内容，方便用于查看

develop         // 可以用于搭建一个基础的vue-cli的uni-app项目
(1)、只保留了部分常用页面，以及部分常用组件，其他的需要去master分支进行获取
(2)、针对store，main.js，以及封装的https都有处理，便于快捷开发
(3)、包括微信小程序环境切换等主要配置也进行了保留

feature-dream   // 作为一个初步项目，在develop基础上，根据master页面库进行的开发新项目

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
