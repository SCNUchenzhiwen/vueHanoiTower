<template>
  <transition name="fade">
    <div class="picker-wrap" v-show="value" @click.self="closePicker">
      <transition name="jump-up">
        <div class="content-wrap" v-show="value">
          <header class="title">
            <span @click="closePicker">取消</span>
            <h1>
              日期选择




              <div class="ui-switch-btn" @click="handleSwitch" v-show="selType === 'date'">
                <div class="point left" :style="{background: switchBg}"></div>
                <div class="middle" :style="{background: switchBg}"></div>
                <div class="point right" :style="{background: switchBg}"></div>
                <div class="ball" :class="{active: switchBtn}"></div>
              </div>
            </h1>

            <span @click="getPickerResult">确定</span>
          </header>
          <div class="data-wrap"
               ref="dataParent"
               :class="{active: switchBtn}"
          >
            <div class="date-wrap">
              <div class="wrap">
                <ul class="data-list"
                    @touchstart="touchStart($event, 0)"
                    @touchmove="touchMove($event, 0)"
                    @touchend="touchEnd($event, 0)"
                    :style="{ transform: 'translate3d(0, ' + translateY0 + 'px, 0)' }"
                >
                  <li class="item" v-for="(item, index) in dataList[0]" :key="index">
                    {{item}}








                  </li>
                </ul>
              </div>
              <div class="wrap">
                <ul class="data-list"
                    @touchstart="touchStart($event, 1)"
                    @touchmove="touchMove($event, 1)"
                    @touchend="touchEnd($event, 1)"
                    :style="{ transform: 'translate3d(0, ' + translateY1 + 'px, 0)' }"
                >
                  <li class="item" v-for="(item, index) in dataList[1]" :key="index">
                    {{item}}












                  </li>
                </ul>
              </div>
              <div class="wrap">
                <ul class="data-list"
                    @touchstart="touchStart($event, 2)"
                    @touchmove="touchMove($event, 2)"
                    @touchend="touchEnd($event, 2)"
                    :style="{ transform: 'translate3d(0, ' + translateY2 + 'px, 0)' }"
                >
                  <li class="item" v-for="(item, index) in dataList[2]" :key="index">
                    {{item}}












                  </li>
                </ul>
              </div>
            </div>
            <div class="time-wrap">
              <div class="wrap">
                <ul class="data-list"
                    @touchstart="touchStart($event, 3)"
                    @touchmove="touchMove($event, 3)"
                    @touchend="touchEnd($event, 3)"
                    :style="{ transform: 'translate3d(0, ' + translateY3 + 'px, 0)' }"
                >
                  <li class="item" v-for="(item, index) in dataList[3]" :key="index">
                    {{item}}












                  </li>
                </ul>
              </div>
              <div class="wrap">
                <ul class="data-list"
                    @touchstart="touchStart($event, 4)"
                    @touchmove="touchMove($event, 4)"
                    @touchend="touchEnd($event, 4)"
                    :style="{ transform: 'translate3d(0, ' + translateY4 + 'px, 0)' }"
                >
                  <li class="item" v-for="(item, index) in dataList[4]" :key="index">
                    {{item}}












                  </li>
                </ul>
              </div>
            </div>

            <div class="sel-bar"></div>
            <!--<div class="sel-bg">-->
            <!--<div class="sel-bar"></div>-->
            <!--<div class="data-sel">-->
            <!--<div class="top"></div>-->
            <!--<div class="bottom"></div>-->
            <!--</div>-->
            <!--<div class="data-sel">-->
            <!--<div class="top"></div>-->
            <!--<div class="bottom"></div>-->
            <!--</div>-->
            <!--<div class="data-sel">-->
            <!--<div class="top"></div>-->
            <!--<div class="bottom"></div>-->
            <!--</div>-->
            <!--</div>-->
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import city from './city'
  console.log(city)
  export default {
    name: 'pickerPlugin',
    props: {
      // 控制是否显示
      value: [Boolean],
      data: {
        type: Array,
        default () {
          return [
            '',
            '',
            '',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '小胜',
            '傻逼雷',
            '狗逼想',
            '雷工',
            '二峰',
            '',
            '',
            ''
          ]
        }
      },
      selType: {
        type: String,
        default: 'date'
      },
      btnBg: {
        type: String,
        default: '#7FFF00'
      },
      closeBtnBg: {
        type: String,
        default: '#f3f3f3'
      }
    },
    computed: {
      switchBg () {
        return this.switchBtn ? this.btnBg : this.closeBtnBg
      }
    },
    data () {
      return {
        // 定义 750px 屏幕下 100px 为 1rem
        remPx: 0,
        // 定义 滑动的时候的减速度
        deceleration: 800,
        // 滚动距离
        translateY0: 0,
        translateY1: 0,
        translateY2: 0,
        translateY3: 0,
        translateY4: 0,
        // 记录每次滑动后的滑动距离
        endTranslateY0: 0,
        endTranslateY1: 0,
        endTranslateY2: 0,
        endTranslateY3: 0,
        endTranslateY4: 0,
        // 数据高度数组
        dataSizes: [],
        // 父元素高度
        parentSize: 0,
        // 回弹的时候的加速度
        reAccSpeed: 0,
        // 回弹时间，单位毫秒
        reTime: 100,
        // 回弹总路程
        reTotalS: 0,
        // 最大滚动距离
        maxTranslate: 0,
        // 最大回弹距离 px
        maxReSwipe: 100,
        // 滚动scrollTo, 时间比例基数。@ex: time = dis / scrollRate (ms)
        scrollRate: 0.1,
        // 存储位移数组
        dataListDisArrs: [],
        // 数据数组
        dataList: [],
        // 滑动结束临界值
        swipeEndRate: 0,
        // 变化时间，越小精度越高
        changTime: 0.0167,
        // 最小滑动速度临界值
        minSpeed: 80,
        // 存储数据的初始化位置index
        dataScrollIndex: [],
        switchBtn: false
      }
    },
    methods: {
      touchStart (e, index) {
        e.stopPropagation()
        e.preventDefault()
        this.clearSwipeTimer(index)
        this.clearReSwipeTimer(index)
        this.clearScrollToTimer(index)
        let touch = e.touches[0]
        // touchmove需要使用
        this.startY = touch.pageY
        this.clearTimer(index)
        this.initStartTimer(index)
      },
      touchMove (e, index) {
        e.stopPropagation()
        e.preventDefault()

        let touch = e.touches[0]
        let moveY = touch.pageY
        let dis = moveY - this.startY
        this['translateY' + index] = this['endTranslateY' + index] + dis
      },
      touchEnd (e, index) {
        e.stopPropagation()
        e.preventDefault()
        let touch = e.changedTouches[0]
        let endPageY = touch.pageY
        this.clearTimer(index)
        // 获取当前瞬时速度
        let v = 1000 * (endPageY - this.startY) / this['startTime' + index]
        this.swipe(v, index)
      },
      // 清除计时定时器对象
      clearTimer (index) {
        if (this['startTimer' + index]) {
          clearInterval(this['startTimer' + index])
          this['startTimer' + index] = null
        }
      },
      // 初始化计时器
      initStartTimer (index) {
        // 初始时间戳
        this['startTime' + index] = 0
        // 计时
        this['startTimer' + index] = setInterval(() => {
          this['startTime' + index] += 20
        }, 20)
      },
      // 惯性滑动
      swipe (v, index) {
        let t = 0
        this['endTranslateY' + index] = this['translateY' + index]
        this.dir = v < 0 ? 1 : -1

        let carouselFun = () => {
          t += this.changTime
          // 加速度方向
          let _v = v + t * this.deceleration * this.dir
          // 瞬时路程
          let _s = (_v + v) * t * 0.5
          let {type, dis} = this.isOutSize(this['translateY' + index], index)
          let isOverMaxReSwipe = type && (dis >= this.maxReSwipe)
          // 速度接近0 或者 越界到临界值
          if (_v * this.dir >= this.swipeEndRate || isOverMaxReSwipe) {
            cancelAnimationFrame(this['reqIdSwipe' + index])
            this['endTranslateY' + index] = this['translateY' + index]
            // 如果停止的时候越界或者达到醉倒越界临界值，回滚
            if (type || isOverMaxReSwipe) {
              this.reSwipe(type, index)
            }
            if (!type) {
              this.autoScrollToItem(index)
            }
            return
          }
          this['translateY' + index] = this['endTranslateY' + index] + _s
          this['reqIdSwipe' + index] = requestAnimationFrame(carouselFun)
        }
        this['reqIdSwipe' + index] = requestAnimationFrame(carouselFun)
      },
      // 清除swipe定时器
      clearSwipeTimer (index) {
        if (!this['reqIdSwipe' + index]) return
        cancelAnimationFrame(this['reqIdSwipe' + index])
        this['reqIdSwipe' + index] = null
        this['endTranslateY' + index] = this['translateY' + index]
      },
      // 回弹滚动 @param {Number} type - -1上回弹，1下回弹
      reSwipe (type = -1, index) {
        let dis = 0
        let t = 0
        let s = 0
        let dir = type
        let tran0 = this['translateY' + index]
        // 上回弹，回弹到0
        if (type === -1) {
          dis = Math.abs(this['translateY' + index])
        } else {
          dis = Math.abs(this.maxTranslate - Math.abs(this['translateY' + index]))
        }
        let carouselFun = () => {
          t += this.changTime * 1000
          if (t >= this.reTime) {
            s = dis
            this['translateY' + index] = tran0 + dir * s
            this.clearReSwipeTimer(index)
            return
          }
          s = this.reFun(t, dis)
          this['translateY' + index] = tran0 + dir * s
          this['reqIdReSwipe' + index] = requestAnimationFrame(carouselFun)
        }
        this['reqIdReSwipe' + index] = requestAnimationFrame(carouselFun)
      },
      // 清除回弹定时器
      clearReSwipeTimer (index) {
        if (!this['reqIdReSwipe' + index]) return
        cancelAnimationFrame(this['reqIdReSwipe' + index])
        this['reqIdReSwipe' + index] = null
        this['endTranslateY' + index] = this['translateY' + index]
        this.forceUpdate(index)
      },
      // 滚动到固定位置 @param {Number} pos - 滚动到的位置
      scrollTo (pos, index) {
        let _dis = pos - this['translateY' + index]
        let tran0 = this['translateY' + index]
        let scrollTotalTime = Math.abs((_dis / this.scrollRate).toFixed(2))
        let t = 0
        let carouselFun = () => {
          t += this.changTime * 1000
          let {type, dis} = this.isOutSize(this['translateY' + index], index)
          let isOverMaxReSwipe = type && (dis >= this.maxReSwipe)
          if (t >= scrollTotalTime || isOverMaxReSwipe) {
            this.clearScrollToTimer(index)
            // 如果停止的时候越界或者达到醉倒越界临界值，回滚
            if (type || isOverMaxReSwipe) {
              this.reSwipe(type, index)
            }
            return
          }
          let s = this.reFun(t, _dis)
          this['translateY' + index] = tran0 + s
          this['reqIdScrollTo' + index] = requestAnimationFrame(carouselFun)
        }
        this['reqIdScrollTo' + index] = requestAnimationFrame(carouselFun)
      },
      // 清除滚动定时器
      clearScrollToTimer (index) {
        if (!this['reqIdScrollTo' + index]) return
        cancelAnimationFrame(this['reqIdScrollTo' + index])
        this['reqIdScrollTo' + index] = null
        this.forceUpdate(index)
      },
      // 属性元素高度
      refreshSize () {
        this.$nextTick(() => {
          setTimeout(() => {
            let parent = this.$refs.dataParent
            // ********************** 这里的querySelectorAll返回的是一个静态NodeList，即dom刷新也不会刷新NodeList*****************
            // 详细查阅 https://blog.csdn.net/tel13259437538/article/details/79049191
            // let childs = parent.querySelectorAll('.data-list')
            let childs = parent.getElementsByTagName('ul')
            this.dataSizes = []
            Array.prototype.forEach.call(childs, (item) => {
              this.dataSizes.push(item.offsetHeight)
            })
            this.parentSize = parent.offsetHeight
          }, 10)
        })
      },
      // 判断是否边界
      isOutSize (translate, index) {
        this.maxTranslate = this.dataSizes[index] - this.parentSize
        if (this.dir > 0 && Math.abs(translate) > this.maxTranslate)
          return {
            type: 1,
            dis: Math.abs(translate) - this.maxTranslate
          }
        if (this.dir < 0 && translate > 0)
          return {
            type: -1,
            dis: translate
          }
        return {
          type: '',
          dis: 0
        }
      },
      // 滚动函数，用于回弹或者自主滚动
      reFun (t, dis) {
        return -(dis / (Math.pow(this.reTime, 2))) * t * (t - 2 * this.reTime)
      },
      // 初始化位移数组
      initDataDis (index = 0) {
        let arr = [0]
        this.itemH = this.$refs.dataParent.querySelector('.item').offsetHeight
        for (let i = 0; i < this.dataList[index].length; i++) {
          arr.push(-(this.itemH * (i + 1)).toFixed(2))
        }
        this.dataListDisArrs[index] = arr
      },
      // 自动跳跃到item整数位
      autoScrollToItem (dataIndex) {
        let arr = (Math.abs(this['translateY' + dataIndex] / this.itemH)).toFixed(2).toString().split('.')
        let index = arr[0]
        let dec = Number('0.' + arr[1])
        if (dec > 0.5) {
          index++
        }
        let scrollTo = this.dataListDisArrs[dataIndex][index]
        this.scrollTo(scrollTo, dataIndex)
      },
      // 生成时间数组
      initDate () {
        if (this.selType !== 'date') return
        let arrY = []
        let arrM = []
        let arrD = []
        let arrH = []
        let arrMin = []
        let yearLen = 50
        let nowDate = new Date()
        let recentY = nowDate.getFullYear()
        let recentM = nowDate.getMonth() + 1
        let recentD = nowDate.getDate()
        let recentH = nowDate.getHours()
        let recentMin = nowDate.getMinutes()
        this.getArr(parseInt(recentY - yearLen / 2), arrY, yearLen)
        this.getArr(1, arrM, 12)
        let dateLen = this.getDayCount(recentY, recentM)
        this.getArr(1, arrD, dateLen)
        this.getArr(0, arrH, 24)
        this.getArr(0, arrMin, 60)
        this.dataList.push(...[arrY, arrM, arrD, arrH, arrMin])
        this.dataScrollIndex.push(...[parseInt(yearLen / 2), recentM - 1, recentD - 1, recentH, recentMin])
      },
      // 生成数据数组
      getArr (startNum, arr, len) {
        for (let i = 0; i < len; i++) {
          arr[i] = startNum + i
        }
        arr.push(...['', '', ''])
        arr.unshift(...['', '', ''])
        return arr
      },
      // 获取当前月多少天
      getDayCount (y, m) {
        console.log(y, m)
        if (m == 12) {
          m = 0
          y += 1
        }
        let date = new Date(y + '/' + (m + 1) + '/' + 1).getTime()
        // 一天毫秒数
        let dayMm = 86400000
        let monLastDay = new Date(date - dayMm).getDate()
        return monLastDay
      },
      // 初始化位移数组
      initDis () {
        let len = this.dataList.length
        for (let i = 0; i < len; i++) {
          this.initDataDis(i)
        }
      },
      // 获取当前显示数据的index
      getItemIndex (index) {
        let itemH = this.itemH
        let tran = this['translateY' + index]
        return Math.abs(Math.ceil(Math.abs(tran / itemH).toFixed(0)))
      },
      // 获取当前的所有index
      getAllItemIndex () {
        let arr = []
        this.dataList.forEach((item, index) => {
          arr.push(this.getItemIndex(index))
        })
        return arr
      },
      /*
       ** 跳转到制定index
       * @param {Number} dataIndex - 操作的data序号
       * @param {Number} index - 跳转的序号
       */
      scrollToIndex (dataIndex, index) {
        let pos = -(this.itemH * index).toFixed(2)
        this['translateY' + dataIndex] = this['endTranslateY' + dataIndex] = pos
      },
      // 初始化滚动位置
      initScrollIndex () {
        this.dataScrollIndex.forEach((item, index) => {
          this.scrollToIndex(index, item)
        })
      },
      // 更新日期
      refreshDate (index) {
        if (this.selType !== 'date' || !(index == 1 || index == 0)) return
        let arr = this.getAllItemIndex()
        let year = this.dataList[0][arr[0] + 3]
        let mon = this.dataList[1][arr[1] + 3]
        if (mon != 2 && index == 0) return
        let dateLen = this.getDayCount(year, mon)
        let dateArr = []
        this.getArr(1, dateArr, dateLen)
        // 这里赋值二层数组，要是响应的必须用$set
        this.$set(this.dataList, 2, dateArr)
        this['translateY2'] = this['endTranslateY2'] = 0
        this.$nextTick(() => {
          this.refreshData()
        })
      },
      // 刷新数据
      refreshData () {
        this.refreshSize()
        this.initDis()
      },
      // 选择
      handleSwitch () {
        this.switchBtn = !this.switchBtn
      },
      // 判断是否闰年 能被4整除但是不能被100整除的年份，能被400整除
      isLeapYear (year) {
        if (!year) return
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
          return true
        return false
      },
      // 关闭
      closePicker () {
        this.$emit('input', false)
      },
      getPickerResult () {
        let arr = this.getAllItemIndex()
        let resultArr = []
        arr.forEach((item, index) => {
          resultArr.push(this.dataList[index][item + 3])
        })
        let yearArr = resultArr.slice(0, 3)
        let reArr = this.switchBtn ? resultArr : yearArr
        this.$emit('pickerData', reArr)
        this.closePicker()
      },
      /* 处理传入的数据
       * @param {Array | String} keys - 键，为string时单个key，为array时为多个key
       */
      resolveData (keys) {
        if (!Array.isArray(this.data)) return
        if (typeof keys === 'string' || typeof keys === 'number') {
          keys = [keys]
        }
        let index = keys.length - 1
        let arr = []
        switch (index) {
          case 0:
            arr = this.data.map((item) => {
              return item.value
            });
            arr.push(...['', '', '']);
            arr.unshift(...['', '', '']);
            this.$set(this.dataList, 0, arr);
            break;
          case 1:
            arr = this.data[keys[0]].child.map((item) => {
              return item.value
            });
            arr.push(...['', '', '']);
            arr.unshift(...['', '', '']);
            this.$set(this.dataList, 1, arr);
            break;
          case 2:
            arr = this.data[keys[0]].child[keys[1]].child.map((item) => {
              return item.value
            });
            arr.push(...['', '', '']);
            arr.unshift(...['', '', '']);
            this.$set(this.dataList, 2, arr);
            break;
        }
      },
      // 初始化数据
      initPickerData () {
        this.resolveData('0')
        this.resolveData(['0', '0'])
        this.resolveData(['0', '0', '0'])
        this.dataScrollIndex.push(...[0, 0, 0])
        this.$nextTick(() => {
          this.refreshData()
        })
      },
      // 根据选择结果选择更新数据
      refreshPickerData (index) {
        if (index == 2) return
        let arr = this.getAllItemIndex()
        switch (index) {
          case 0:
            this.resolveData([arr[0], '']);
            this.resolveData([arr[0], '0', '']);
            this.dataScrollIndex[1] = 0;
            this.dataScrollIndex[2] = 0;
            this['translateY2'] = this['endTranslateY2'] = 0
            this['translateY1'] = this['endTranslateY1'] = 0
            break;
          case 1:
            this.resolveData([arr[0], arr[1], '']);
            this.dataScrollIndex[2] = 0;
            this['translateY2'] = this['endTranslateY2'] = 0
            break;
        }
        this.$nextTick(() => {
          this.refreshData()
        })
      },
      init () {
        if (this.selType === 'date') {
          this.initDate()
        } else {
          this.initPickerData()
        }
      },
      forceUpdate (index) {
        if (this.selType === 'date') {
          this.refreshDate(index)
        } else {
          this.refreshPickerData(index)
        }
      }
    },
    mounted () {
      document.body.appendChild(this.$el)
      this.refreshSize()
      this.initDis()
      this.initScrollIndex()
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  ul, li {
    list-style: none;
  }

  div, header, p, ul, li, h1 {
    padding: 0;
    margin: 0;
  }

  h1, h2, h3 {
    font-size: 1em;
    font-weight: normal;
  }

  .picker-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    background: rgba(0, 0, 0, .5);
    color: #333;
    font-size: 1em;
    z-index: 999999;
  }

  .picker-wrap .content-wrap {
    height: 17em;
    width: 100%;
    background: #ffffff;
  }

  .picker-wrap .title {
    height: 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em;
    position: relative;
    border-bottom: 1px solid #b9b9b9;
    flex: none;
  }

  .title h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    display: flex;
    align-items: center;
  }

  .data-list {
    overflow: hidden;
    height: auto;
  }

  .data-list .item {
    height: 2em;
    line-height: 2em;
    padding: 0 .5em;
    /*border-bottom: 1px solid #f0f0f0;*/
  }

  .data-wrap {
    overflow: hidden;
    display: flex;
    position: relative;
    width: 200%;
    transition: all .3s;
    transform: translate3d(0, 0, 0);
  }

  .data-wrap.active {
    transform: translate3d(-50%, 0, 0);
  }

  .data-wrap .date-wrap, .data-wrap .time-wrap {
    display: flex;
  }

  .data-wrap .date-wrap {
    width: 50%;
  }

  .data-wrap .time-wrap {
    width: 50%;
  }

  .data-wrap .wrap {
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 3;
    width: 20%;
  }

  .data-wrap .sel-bar {
    position: absolute;
    height: 2em;
    width: 100%;
    border: 1px solid red;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 2;
  }

  .content-wrap {
    display: flex;
    flex-direction: column;
  }

  .ui-switch-btn {
    position: relative;
    width: 2.4em;
    height: 1.2em;
  }

  .point, .middle, .ball {
    transition: all .3s;
  }

  .point {
    width: 1.2em;
    height: 1.2em;
    border-radius: 50%;
    position: absolute;
    top: 0;
    z-index: 1;
    border: 1px solid #f3f3f3;
  }

  .middle {
    width: 1.2em;
    height: 1.2em;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    z-index: 2;
    border-top: 1px solid #f3f3f3;
    border-bottom: 1px solid #f3f3f3;
  }

  .left {
    left: 0;
  }

  .right {
    right: 0;
  }

  .ball {
    width: 1.2em;
    height: 1.2em;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 .8em #888888;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate3d(0, 0, 0);
    z-index: 3;
  }

  .ball.active {
    transform: translate3d(1.2em, 0, 0);
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }

  .fade-enter-to, .fade-leave {
    opacity: 1;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .jump-up-enter-active, .jump-up-leave-active {
    transition: all .3s;
  }

  .jump-up-enter-to, .jump-up-leave {
    transform: translate3d(0, 0, 0);
  }

  .jump-up-enter, .jump-up-leave-to {
    transform: translate3d(0, 100%, 0);
  }
</style>
