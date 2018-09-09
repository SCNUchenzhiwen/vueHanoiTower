<template>
    <div class="can-wrap" ref="canWrap" :style="{height: wrapH + 'px', width: wrapW + 'px'}">
        <canvas ref="canvasBg" id="canBg"></canvas>
        <canvas ref="vCanvas"
                id="canDraw"
                @touchstart="touchstart"
                @touchmove="touchmove"
                @touchend="touchend"
        ></canvas>
    </div>
</template>

<script>
    export default {
        name: 'vCanvas',
        props: {
            // 基础颜色，圆环颜色
            normalColor: {
                type: String,
                default: '#A0AAAD'
            },
            // 圆点颜色
            pointBgColor: {
                type: String,
                default: 'rgba(111, 122, 126, .7)'
            },
            // 圆点激活颜色
            pointActiveColor: {
                type: String,
                default: '#ffffff'
            },
            // 连接线激活颜色
            lineActiveColor: {
                type: String,
                default: 'rgba(255, 255, 255, .3)'
            },
            // 显示错误的时候的颜色
            errorColor: {
                type: String,
                default: '#FF3F3F'
            },
            // 绘制错误的时候的线条颜色
            errorLineColor: {
                type: String,
                default: 'rgba(255, 63, 63, .3)'
            },
            // 错误手势密码显示时间(ms)
            errorTime: {
                type: String,
                default: '3000'
            },
            // canvas宽度占屏幕宽度比例
            canWRatio: {
                type: Number,
                default: 0.7
            }
        },
        computed: {
            canW () {
                return (this.winW * this.canWRatio).toFixed(2)
            },
            canH () {
                return this.canW
            },
            wrapH () {
                return parseInt(this.canH / 4)
            },
            wrapW () {
                return parseInt(this.canW / 4)
            }
        },
        data () {
            return {
                // 窗口宽度
                winH: 0,
                winW: 0,
                // 内边距
                padding: 0,
                // 圆环半径
                ringR: 0,
                // 圆环边框宽度
                ringLineW: 0,
                // 圆环上下左右间距
                ringMargin: 0,
                // 内圆半径
                circleR: 0,
                // 连接线宽度
                lineW: 0,
                // 圆环数组，记录绘制起点及圆心位置
                ringArr: [],
                // 记录激活的点的坐标
                activeArr: [],
                // 触摸的最后的坐标
                lastX: 0,
                lastY: 0,
                // 记录激活坐标点对象, 用于判断是否重复的点
                activeIndex: {},
                // 存储手势密码坐标点数组，包括顺讯及所有激活的点
                handLock: [],
                ctx: null,
                // 错误显示定时器对象
                errorTimer: null
            }
        },
        methods: {
            touchstart (e) {
                this.clear()
                let pageX = e.targetTouches[0].pageX
                let pageY = e.targetTouches[0].pageY
                // 获取坐标
                let {x, y} = this.resolveLocation(pageX, pageY)
                this.lastX = x
                this.lastY = y
                // 判断是否在圆上
                this.isInRing(x, y)
                this.initAnimation()
            },
            touchmove (e) {
                e.preventDefault()
                let pageX = e.targetTouches[0].pageX
                let pageY = e.targetTouches[0].pageY
                // 获取坐标
                let {x, y} = this.resolveLocation(pageX, pageY)
                this.lastX = x
                this.lastY = y
                // 判断是否在圆上
                this.isInRing(x, y)
                this.initAnimation()
            },
            touchend (e) {
                this.initAnimation()
                let result = this.getHandLock()
                this.$emit('getHandLock', result)
            },
            // 定义动画执行的 一系列函数
            initAnimation () {
                this.clearCanvas()
                this.drawActiveLine()
                this.drawLastActiveLine(this.lastX, this.lastY)
                this.drawActiveRing()
            },
            // 初始化canvas
            initCanvas () {
                this.canvasBg = this.$refs.canvasBg
                this.canvas = this.$refs.vCanvas
                this.ctxBg = this.canvasBg.getContext('2d')
                this.ctx = this.canvas.getContext('2d')
                let canvas = this.canvas
                let canvasBg = this.canvasBg
                canvas.width = this.canW
                canvas.height = this.canH
                canvasBg.width = this.canW
                canvasBg.height = this.canH
                this.drawOpacityBg()
                this.drawAllRing(this.ctxBg)
            },
            // 输出手势密码结果
            // @return [1, 2, 3]
            getHandLock () {
                return this.handLock
            },
            // 清空画布
            clearCanvas () {
                this.ctx.clearRect(0, 0, this.canW, this.canH)
            },
            // 清空绘制的 reset
            clear () {
                this.clearTimer()
                this.handLock = []
                this.activeArr = []
                this.activeIndex = {}
                this.clearCanvas()
                this.$emit('clear')
            },
            // 错误显示绘制
            errorDraw () {
                this.clearCanvas()
                this.drawActiveRing(this.errorColor)
                this.drawActiveLine(this.errorLineColor)
                this.errorTimer = setTimeout(() => {
                    this.clear()
                    clearTimeout(this.errorTimer)
                    this.errorTimer = null
                }, this.errorTime)
            },
            // 清除定时器对象
            clearTimer () {
                if (this.errorTimer) {
                    clearTimeout(this.errorTimer)
                    this.errorTimer = null
                }
            },
            // 绘制透明背景
            drawOpacityBg () {
                this.ctxBg.fillStyle = 'rgba(255, 255, 255, 0)'
                this.ctxBg.fillRect(0, 0, this.canW, this.canH)
            },
            // 绘制圆环
            drawRing (ctx, x, y, ringBorderCol = this.normalColor) {
                let ringR = this.ringR
                let ringLineW = this.ringLineW
                ringBorderCol = ringBorderCol
                let ringBg = this.pointBgColor
                this.drawCircle(ctx, x, y, ringR, 'fill', ringBg)
                this.drawCircle(ctx, x, y, ringR, 'stroke', ringBorderCol, ringLineW)
            },
            // 绘制圆环或者圆
            drawCircle (ctx, x, y, r, type, styleCol, lineW = 1) {
                ctx.lineWidth = lineW
                ctx.beginPath()
                ctx.arc(x, y, r, 0, 2 * Math.PI)
                ctx.closePath()
                ctx[type + 'Style'] = styleCol
                ctx[type]()
            },
            // 生成九个圆环
            drawAllRing (ctx, ringBorderCol = this.normalColor) {
                // 圆环间距
                let margin = this.ringMargin
                let x0 = this.padding + this.ringR
                let y0 = this.padding + this.ringR
                let x, y
                for (let i = 0; i < 3; i++) {
                    y = y0 + i * (margin + 2 * this.ringR)
                    let arr = []
                    for (let j = 0; j < 3; j++) {
                        x = x0 + j * (margin + 2 * this.ringR)
                        this.drawRing(ctx, x, y, ringBorderCol)
                        arr.push(this.savePos(x, y))
                    }
                    this.ringArr.push(arr)
                }
            },
            // 存储圆环的绘制位置以及圆心位置
            savePos (x, y) {
                let obj = {
                    ringCenter: {
                        x,
                        y
                    }
                }
                return obj
            },
            // 绘制激活的圆环
            drawActiveRing (color = this.pointActiveColor) {
                for (let item of this.activeArr) {
                    let x = item.ringCenter.x
                    let y = item.ringCenter.y
                    let activeCircleR = this.circleR
                    this.drawCircle(this.ctx, x, y, this.ringR, 'stroke', color, this.ringLineW)
                    this.drawCircle(this.ctx, x, y, activeCircleR, 'fill', color)
                }
            },
            // 绘制连接线
            drawLine (startX, startY, endX, endY, lineColor) {
                let ctx = this.ctx
                ctx.lineWidth = 20
                ctx.beginPath()
                ctx.moveTo(startX, startY)
                ctx.lineTo(endX, endY)
                ctx.closePath()
                ctx.strokeStyle = lineColor
                ctx.stroke()
            },
            // 绘制激活的点的连接线
            drawActiveLine (lineColor = this.lineActiveColor) {
                if (this.activeArr.length < 2) return
                for (let i = 0; i < this.activeArr.length - 1; i++) {
                    let startX = this.activeArr[i].ringCenter.x
                    let startY = this.activeArr[i].ringCenter.y
                    let endX = this.activeArr[i + 1].ringCenter.x
                    let endY = this.activeArr[i + 1].ringCenter.y
                    this.drawLine(startX, startY, endX, endY, lineColor)
                }
            },
            // 绘制最后一点到手指位置的连接线
            drawLastActiveLine (lastX, lastY) {
                if (this.activeArr.length < 1) return
                let startX = this.activeArr[this.activeArr.length - 1].ringCenter.x
                let startY = this.activeArr[this.activeArr.length - 1].ringCenter.y
                this.drawLine(startX, startY, lastX, lastY)
            },
            // 获取当前窗口大小, 4 扩大四倍 ，解决高分屏模糊问题
            getWindowSize () {
                this.winW = window.innerWidth * 4
                this.winH = window.innerHeight * 4
            },
            // 以750px，100px为1rem为基准计算当前屏幕宽度的对象的值
            getSizePer100 (size) {
                if (!size) return
                size = Number(size)
                return (size * this.winW) / 750
            },
            // 初始化尺寸
            initSize () {
                this.padding = this.getSizePer100(18.5)
                // 圆环半径
                this.ringR = this.getSizePer100(58)
                // 圆环边框宽度
                this.ringLineW = this.getSizePer100(4)
                // 圆环上下左右间距
                this.ringMargin = this.getSizePer100(68)
                // 内圆半径
                this.circleR = this.getSizePer100(30)
                // 连接线宽度
                this.lineW = this.getSizePer100(12)
            },
            // 获取canvas左上角相对于窗口的距离
            getOffsetCanvas (target = this.$refs.canWrap) {
                let getOffsetTop = (target) => {
                    let offsetTop = target.offsetTop
                    if (target.offsetParent !== null) {
                        offsetTop += getOffsetTop(target.offsetParent)
                    }
                    return offsetTop
                }
                let getOffsetLeft = (target) => {
                    let offsetLef = target.offsetLeft
                    if (target.offsetParent !== null) {
                        offsetLef += getOffsetLeft(target.offsetParent)
                    }
                    return offsetLef
                }
                // canvas相对窗口位置
                this.canOffsetTop = getOffsetTop(target)
                this.canOffsetLeft = getOffsetLeft(target)
            },
            // 获取换算为缩放后的在canvas里面的坐标
            resolveLocation (pageX, pageY) {
                return {
                    // 因为canvas整体缩放了4
                    x: ((pageX - this.canOffsetLeft) * 4).toFixed(2),
                    y: ((pageY - this.canOffsetTop) * 4).toFixed(4)
                }
            },
            // 判断是否在坐标是否在点上
            isInRing (x, y) {
                for (let i = 0; i < this.ringArr.length; i++) {
                    for (let j = 0; j < this.ringArr[i].length; j++) {
                        let originX = this.ringArr[i][j].ringCenter.x
                        let originY = this.ringArr[i][j].ringCenter.y
                        // 勾股定理计算
                        let isLessThanR = Math.sqrt(Math.pow(Math.abs(x - originX), 2) + Math.pow(Math.abs(y - originY), 2)) < this.ringR ? true : false
                        if (isLessThanR) {
                            let key = (i * 3) + j
                            if (this.activeIndex[key]) {
                                return
                            } else {
                                this.handLock.push(key)
                                this.activeIndex[key] = true
                            }
                            this.activeArr.push(this.savePos(originX, originY))
                            this.lastX = originX
                            this.lastY = originY
                            return isLessThanR
                        }
                    }
                }
            }
        },
        mounted () {
            this.getWindowSize()
            this.initSize()
            this.initCanvas()
            this.$nextTick(() => {
                this.getOffsetCanvas()
            })
        }
    }
</script>

<style scoped>
    .can-wrap {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .can-wrap canvas {
      position: absolute;
      top: 0;
      left: 0;
      transform: scale3d(.25, .25, .25);
      transform-origin: left top;
      z-index: 2;
    }
    #canBg {
      z-index: 1;
    }
</style>
