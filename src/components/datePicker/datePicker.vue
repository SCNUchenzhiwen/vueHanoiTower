<template>
  <div class="date-picker-wrap">
    <div class="picker-content">
      <div class="content-title">{{rotateDeg}}</div>
      <div class="data-wrap">
        <ul class="data-list"
            ref="dataList"
            :style="{transform: 'rotate3d(1, 0, 0, ' + touchRotateR + 'deg)',transformOrigin: 'center center -' + rotateR + 'px'}"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
        >
          <li class="item"
              v-for="(item, index) in data"
              :key="index"
              :style="{ transform: 'rotate3d(1, 0, 0, ' + index * rotateDeg + 'deg)',transformOrigin: 'center center -' + rotateR + 'px' }"
          >
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'datePicker',
    props: {
      data: {
        type: Array,
        default () {
          return [
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
            '二峰'
          ]
        }
      }
    },
    data () {
      return {
        // 每一个li的旋转角度
        rotateDeg: 0,
        // 旋转半径
        rotateR: 200,
        // 总弧度
        totalRotate: 0,
        // 加速度
        AddSpeed: 5,
        // 滑动旋转角度
        touchRotateR: 0
      }
    },
    methods: {
      // 获取旋转角度
      getRotateDeg () {
        this.$nextTick(() => {
          let parentNode = this.$refs.dataList
          let itemEl = parentNode.querySelector('.item')
          console.dir(itemEl)
          let itemH = itemEl.clientHeight
          // 开始计算
          this.rotateDeg = 2 * (Math.asin(parseFloat((itemH / 2) / this.rotateR))*180 / Math.PI).toFixed(2)
          this.totalRotate = this.data.length * this.rotateDeg
          console.log(this.rotateDeg)
        })
      },
      touchStart (e) {
        console.log(e)
        // 记录初始pageY值
        let touch = e.touches[0]
        // touchmove需要使用
        this.startY = touch.pageY
        // 初始时间戳
        this.startTime = 0
        // 计时
        this.startTimer = setInterval(() => {
          this.startTime += 20
        }, 20)
      },
      touchMove (e) {
        let touch = e.touches[0]
        let moveY = touch.pageY
        let dis = moveY - this.startY
        this.touchRotateR = this.touchRotateR - this.resolveDeg(dis)
      },
      touchEnd (e) {

      },
      // @param {String | Number} s - 线距离
      resolveDeg (s) {
        return 360 * s / this.ringL
      },
      initData () {
        // 旋转圆周长
        this.ringL = 2 * Math.PI * this.rotateR
      }
    },
    mounted () {
      this.getRotateDeg()
    },
    created () {
      this.initData()
    }
  }
</script>

<style scoped>
  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .data-list{
    position: relative;
    transform-style: preserve-3d;
  }
  .item{
    position: absolute;
    top: 0;
    left: 0;
    background-color: greenyellow;
    width: 200px;
    color: #333;
    backface-visibility: hidden;
  }
  .data-wrap{
    transform-style: preserve-3d;
  }

</style>
