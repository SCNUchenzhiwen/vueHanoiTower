<template>
  <div class="gobang-wrap">
    <canvas id="gobang-can1"></canvas>
    <canvas id="gobang-can2"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'gobang',
    props: {
      // 默认15个格子
      size: {
        type: Number,
        default: 15
      },
      // 线与线之间的间距
      lineMargin: {
        type: Number,
        default: 20
      },
      // 周边留空
      boxPadding: {
        type: Number,
        default: 20
      }
    },
    methods: {
      // 初始化
      init () {
        this.initData()               // 初始化数据
        this.initSize()               // 初始化canvas尺寸
        this.saveCoordinate()         // 存储线的焦点的坐标，就是棋子的坐标
        this.getCtx()
        this.drawBackground()         // 绘制棋盘
      },
      // 初始化尺寸
      initSize () {
        this.can1 = document.getElementById('gobang-can1')
        this.can2 = document.getElementById('gobang-can2')
        this.can1.width = this.canWidth
        this.can1.height = this.canWidth
        this.can2.width = this.canWidth
        this.can2.height = this.canWidth
      },
      // 初始化定义数据
      initData () {
        this.canWidth = this.boxPadding * 2 + this.size * this.lineMargin
        // 二维坐标数组
        this.coordinate = []
        // 已经下的白棋棋子
        this.chessWhiteArr = []
        // 已经下的黑棋棋子
        this.chessBlackArr = []
      },
      // 获取画笔
      getCtx () {
        this.ctx1 = this.can1.getContext("2d")
        this.ctx2 = this.can2.getContext("2d")
      },
      // 绘制所有棋子
      drawAllChess () {
        // 遍历黑白棋子绘制对应棋子图片

      },
      //
      drawChess () {

      },
      // 绘制背景
      drawBackground () {
        this.ctx1.fillStyle = '#d3a180'
        this.ctx1.fillRect(0, 0, this.canWidth, this.canWidth)
        this.drawBox()
      },
      // 绘制格子
      drawBox () {
        this.ctx1.strokeStyle = '#333333'
        let startX = this.boxPadding
        let startY = this.boxPadding
        let drawLine = (x0, y0, x1, y1, strokeStyle = '#331100') => {
          this.ctx1.moveTo(x0, y0)
          this.ctx1.lineTo(x1, y1)
          this.ctx1.strokeStyle = strokeStyle
          this.ctx1.stroke()
        }
        // 绘制网格
        for (let i = 0; i < this.size + 1; i ++) {
          // 先绘制横线
          let x0 = startX
          let y0 = startY + i * this.lineMargin
          let x1 = startX + this.size * this.lineMargin
          let y1 = y0
          drawLine(x0, y0, x1, y1)
          // 再绘制竖线
          let colX0 = startX + i * this.lineMargin
          let colY0 = startY
          let colX1 = colX0
          let colY1 = startY + this.size * this.lineMargin
          drawLine(colX0, colY0, colX1, colY1)
        }
      },
      // 存储坐标
      saveCoordinate () {
        let x = 0
        let y = 0
        for (let i = 0; i < this.size + 1; i ++) {
          let arr = []
          x = this.boxPadding + this.lineMargin * i
          for (let j = 0; j < this.size + 1; j ++) {
            y = this.boxPadding + this.lineMargin * j
            let obj = {
              x,
              y,
              hasChess: false
            }
            arr.push(obj)
          }
          this.coordinate.push(arr)
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>
  .gobang-wrap {
    position: relative;
  }
  #gobang-can1, #gobang-can2 {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  #gobang-can1 {
    z-index: 10;
  }
  #gobang-can2 {
    z-index: 20;
  }
</style>
