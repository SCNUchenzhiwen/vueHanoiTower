# HanoiTower

# 汉诺塔游戏

# 实现思路
  ## 1、以父元素左上角为原点，初始化三个塔轴和传入数量的方块
  ## 2、以每个塔轴生成一个数组、数组用于存储方块序号
  ## 3、通过mousedown、mousemove、mouseup实现点击方块跟随鼠标移动
  ## 4、实现自动以最小步骤移动
     ## 一、观察通过递归数列得出不同数量的最小步骤算法
     ## 二、使用递归函数方式，每一次方块移动都是上一次所有移动改变移动目标轴的结果，递归改变移动目标轴生成位移数组
  ## 5、胜利判断

使用直接下载components/hanoiTower文件即可

# 效果图
![效果图](https://github.com/SCNUchenzhiwen/vueHanoiTower/blob/master/hanoiToer.png)
![效果图](https://github.com/SCNUchenzhiwen/vueHanoiTower/blob/master/move.png)
![效果图](https://github.com/SCNUchenzhiwen/vueHanoiTower/blob/master/win.png)


> hanoiPower

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
