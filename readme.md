# Let's start making a 3d renderer in WebGL!

## 说在前面
### 本项目的定位

以学习实践为目的，基于WebGl1实现的3D渲染器[renderer]。

开发计划线路如下：

![开发计划线路](http://assets.processon.com/chart_image/61de9348e401fd06a8c75cc5.png)


### 起因
一开始学习WebGL是在2020年，断断续续地把《WebGL编程指南》和learnopengl都敲了一遍，但是对里面的一些概念和内容未能有很好的实践。想着总有一天会实践落地，那么就是今天吧。

```
“The best time to plant a tree is 20 years ago. The second-best time is now.”
“种一棵树最好的时间是十年前，其次是现在。”

```

### 构建打包：ts+esm
ecmascript的模块管理方案比较多，直到es6才出现了官方规范：ESM模块化，本项目使用rollup打包导出umd和esm模块的文件。

### 项目目录结构
```
- dist  // 测试案例预览地址
- example // 测试案例
- public // 公共资源
- src 
    - camera // 摄像机
    - core
    - gl // webgl程序
        - shader // shader相关
    - loader // 加载器
    - light // 光照相关
    - math  // 数学库
    - object // 模型相关
    - texture // 纹理相关
    -    
```

## 开发日志



