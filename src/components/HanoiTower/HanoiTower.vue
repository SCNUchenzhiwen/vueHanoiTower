<template>
  <div class="ui-tower">
    <div class="tower-wrap" ref="towers">
      <div class="tower">
        <div class="middle"></div>
        <div class="bottom"></div>
      </div>
      <div class="tower">
        <div class="middle"></div>
        <div class="bottom"></div>
      </div>
      <div class="tower">
        <div class="middle"></div>
        <div class="bottom"></div>
      </div>
    </div>
    <div class="disk-wrap"
         ref="diskParent"
         @mousedown="mouseDown"
         @mousemove="mouseMove"
         @mouseup="mouseUp"
    >
      <div class="disk1"></div>
      <div class="disk2"></div>
      <div class="disk3"></div>
    </div>
    <p class="black">{{'最小步骤数: ' + lestStep}}</p>
    <div class="btn-wrap">
      <button @click.stop="handleAutoMove">自动搞事</button>
      <button @click.stop="getLestStep">最小步骤数</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hanoiPower',
    props: {
      diskCount: {
        type: Number,
        default: 4
      }
    },
    data () {
      return {
        lestStep: '233',
        isAutoMove: false
      }
    },
    methods: {
      // 初始化
      init () {
        this.initData()
        this.initOrigins()
        this.mkDisks()
      },
      // 初始化三个塔的0点坐标位置和顶点位置坐标，相对于父元素左上角为原点
      initOrigins () {
        this.$nextTick(() => {
          let parent = this.$refs.towers
          let towers = parent.querySelectorAll('.tower')
          towers.forEach((item, index) => {
            let pos = {}
            pos.x = parseFloat((parseFloat(item.offsetLeft) + parseFloat(item.clientWidth / 2)).toFixed(2))
            pos.y = -parseFloat((parseFloat(item.offsetTop) + parseFloat(item.clientHeight)).toFixed(2))
            this.towersOrigin[index] = pos
            this.towersTop[index] = {
              x: pos.x,
              y: -parseFloat(item.offsetTop)
            }
          })
        })
      },
      // 初始化、声明数据
      initData () {
        // 三个塔的圆心坐标数组
        this.towersOrigin = []
        // 三个塔的中轴顶点的坐标数组
        this.towersTop = []
        // 存储三个轴上面的方块数组
        this.towersDiskArrs = {
          0: [],
          1: [],
          2: []
        }
        // 每个方块的高度
        this.diskH = 20
        // 记录初始pageX，Y用于计算
        this.startPageX = 0
        this.startPageY = 0
        // transition过渡时间(ms)
        this.transitionDelay = 300
        // 存储移动之前的轴的序号，用于移动之后从原轴上数组去除改元素
        this.diskOldAxis = 0
      },
      // 生成随机颜色
      getRandomColor () {
        let getRanNum = (max, min) => {
          return (Math.random() * (max - min) + min).toFixed(2)
        }
        return `rgba(${getRanNum(255, 0)}, ${getRanNum(255, 0)}, ${getRanNum(255, 0)}, 0.7)`
      },
      // 生成方块
      mkDisks () {
        this.$nextTick(() => {
          let parent = this.$refs.diskParent
          let html = ''
          let baseStyle = `position:absolute;height:20px;transform:translate3d(0,0,0);`
          let y = Math.abs(this.towersOrigin[0].y)
          let x = Math.abs(this.towersOrigin[0].x)
          for (let i = 0; i < this.diskCount; i++) {
            let diskWidth = 40 + i * 10
            let top = y - (this.diskCount - i) * 20
            let left = x - (diskWidth / 2)
            let bg = this.getRandomColor()
            let diskStyle = `width:${diskWidth}px;top:${top}px;left:${left}px;${baseStyle};background:${bg}`
            // data-index - 块标识
            // data-axis - 当前元素所在轴上标识
            html += `<div data-index="${i}" data-axis="0" style="${diskStyle}" class="disk${i}"></div>`
            this.towersDiskArrs[0].push(i)
          }
          parent.innerHTML = html
          console.log('塔数组')
          console.log(this.towersDiskArrs)
        })
      },
      // 鼠标按下
      mouseDown (e) {
        let target = e.target
        let reg = /^disk\d$/ig
        if (!reg.test(target.className) || this.isAutoMove) {
          this.down = false
          return
        }
        // 点击元素所在轴坐标
        let axisIndex = target.getAttribute('data-axis')
        // 点击元素标识
        let dataIndex = target.getAttribute('data-index')
        if (this.towersDiskArrs[axisIndex].length === 0) return
        // 当前轴最后一个元素
        let lastData = this.towersDiskArrs[axisIndex].slice(0, 1)[0]
        // 如果当前元素不是最后一个元素就吃屎
        if (lastData != dataIndex) return
        !this.down && (this.down = true)
        this.startPageX = e.pageX
        this.startPageY = e.pageY
        this.target = target
        let {x, y, z} = this.getTranslate(this.target.style.transform)
        this.startTranX = x
        this.startTranY = y
        this.startTranZ = z
      },
      mouseMove (e) {
        if (this.down) {
          let offsetPageX = e.pageX - this.startPageX
          let offsetPageY = e.pageY - this.startPageY
          let tranX = parseFloat(this.startTranX) + parseFloat(offsetPageX)
          let tranY = parseFloat(this.startTranY) + parseFloat(offsetPageY)
          this.target.style.transform = `translate3d(${tranX}px, ${tranY}px, 0)`
        }
      },
      // 松开鼠标
      mouseUp (e) {
        console.log('松开鼠标')
        if (!this.down) return
        this.down = false
        this.diskOldAxis = this.target.getAttribute('data-axis')
        let {isInTowers, finaAxis} = this.isInTowers(this.target)
        let newDiskAxis = this.target.getAttribute('data-axis')
        let elDataIndex = this.target.getAttribute('data-index')
        if (newDiskAxis != this.diskOldAxis && this.towersDiskArrs[newDiskAxis].length > 0) {
          console.log('进入判断----')
          // 新轴上最上面的disk序号
          let topDiskIndex = this.towersDiskArrs[newDiskAxis][0]
          console.log(topDiskIndex)
          console.log(elDataIndex)
          console.log(topDiskIndex > elDataIndex)
          if (topDiskIndex < elDataIndex) {
            console.log('进入序号判断-----')
            this.target.setAttribute('data-axis', this.diskOldAxis)
          }
        }
        console.log('是否在那上面' + isInTowers)
        console.log(finaAxis)
        this.autoMoveToAxis(this.target, this.diskOldAxis)
      },
      // 获取translate的x，y，z坐标
      getTranslate (tranStr) {
        if (!tranStr) return
        let str = tranStr.toString()
        let tranNum = str.split('(')[1]
        let reg = /-?\d+/g
        let result = tranNum.match(reg)
        return {
          x: result[0],
          y: result[1],
          z: result[2]
        }
      },
      /*
       ** 判断是否在某个塔里面
       * @param {Object} el - 目标节点dom元素对象
       */
      isInTowers (el) {
        let {topLeftX, topLeftY, bottomRightX, bottomRightY} = this.getElementLocation(el)
        let isInTowers = false
        // 最终的disk停留的轴的坐标
        let finaAxis = this.getElementAxisOrigin(el)
        this.towersOrigin.forEach((item, index) => {
          if (topLeftX < item.x && topLeftY < this.towersTop[index].y && bottomRightX > item.x && bottomRightY > item.y) {
            isInTowers = true
            el.setAttribute('data-axis', index)
            finaAxis = this.towersOrigin[index]
            return
          }
        })
        return {
          isInTowers,
          finaAxis
        }
      },
      // 获取当前元素左上角坐标和右下角坐标
      getElementLocation (el) {
        let {x: tranX, y: tranY} = this.getTranslate(el.style.transform)
        let top = parseFloat(el.style.top)
        let left = parseFloat(el.style.left)
        let topLeftX = left + parseFloat(tranX)
        let topLeftY = -top - parseFloat(tranY)
        let elH = parseFloat(el.clientHeight)
        let elW = parseFloat(el.clientWidth)
        let bottomRightX = topLeftX + elW
        let bottomRightY = topLeftY - elH
        return {
          topLeftX,
          topLeftY,
          bottomRightX,
          bottomRightY
        }
      },
      // 获取当前元素所在轴原点坐标
      getElementAxisOrigin (el) {
        let axisIndex = el.getAttribute('data-axis')
        return this.towersOrigin[axisIndex]
      },
      // 获取当前元素的原始坐标, 元素左上角坐标
      getElementOrigin (el) {
        let top = parseFloat(el.style.top)
        let left = parseFloat(el.style.left)
        return {
          x: left,
          y: -top
        }
      },
      /*
       ** 过渡到某个轴上面
       * @param {Number | String} oldAxis - 当前元素前一个轴的下标
       */
      autoMoveToAxis (el, oldAxis = 0) {
        let axisIndex = el.getAttribute('data-axis')
        let axisDiskArr = this.towersDiskArrs[axisIndex]
        let diskLen = axisDiskArr.length
        let axisOrigin = this.towersOrigin[axisIndex]
        let {x: originX, y: originY} = this.getElementOrigin(el)
        let tranX = axisOrigin.x - originX - (el.clientWidth / 2).toFixed(2)
        // Y必须加上当前轴上disk数量的偏移量
        // 如果轴没有改变就保持原来的不用 +1
        let dis = oldAxis == axisIndex ? diskLen : diskLen + 1
        let tranY = -(axisOrigin.y - originY) - this.diskH * dis
        // 从旧轴出栈，新轴入栈
        if (oldAxis != axisIndex) {
          let diskNum = this.towersDiskArrs[oldAxis].shift()
          this.towersDiskArrs[axisIndex].unshift(diskNum)
        }
        this.makeTransition(el, tranX, tranY)
      },
      // translate过渡元素
      makeTransition (el, tranX, tranY) {
        let tranStyle = `translate3d(${tranX}px, ${tranY}px, 0)`
        // 添加transition
        el.style.cssText += `transition: all ${this.transitionDelay}ms`
        // 确保渲染完成才添加translate
        let timer = setTimeout(() => {
          el.style.transform = tranStyle
          clearTimeout(timer)
          timer = null
        }, 10)
        // 过渡完成清除transition
        let delayTimer = setTimeout(() => {
          el.style.cssText = el.style.cssText.replace(`transition: all ${this.transitionDelay}ms`, '')
          this.isWin()
          clearTimeout(delayTimer)
          delayTimer = null
        }, this.transitionDelay)
      },
      // 是否胜利
      isWin () {
        let isWin = false
        for (let key in this.towersDiskArrs) {
          if (key != 0 && this.towersDiskArrs[key].length == this.diskCount) {
            isWin = true
            alert('你赢了')
            return isWin
          }
        }
      },
      // 获取最小步骤数
      getMinStep () {
        return Math.pow(2, this.diskCount) - 1
      },
      // 根据轴到从某根轴移动到目标轴
      moveToAxis (from, to) {
        this.$nextTick(() => {
          let diskIndex = this.towersDiskArrs[from].shift()
          // 获取目标轴的数组长度
          let toLen = this.towersDiskArrs[to].length
          let {x: toAxisX, y: toAxisY} = this.towersOrigin[to]
          let el = document.querySelector(`.disk${diskIndex}`)
          let elLen = parseFloat((el.clientWidth / 2).toFixed(2))
          let {topLeftX: tlOriginX, topLeftY: tlOriginY} = this.getElementLocation(el)
          let tran = el.style.transform
          let {x: tranX0, y: tranY0} = this.getTranslate(tran)
          let toY = toAxisY + (parseInt(toLen) + 1) * this.diskH
          let toX = toAxisX - elLen
          // translate Y轴的方向跟定义的坐标轴方向相反所以要加-
          let disTranY = -(toY - tlOriginY)
          let disTranX = toX - tlOriginX
          let toTranX = parseFloat(tranX0) + parseFloat(disTranX)
          let toTranY = parseFloat(tranY0) + parseFloat(disTranY)
          // 目标轴入栈
          this.towersDiskArrs[to].unshift(diskIndex)
          el.setAttribute('data-axis', to)
          this.makeTransition(el, toTranX, toTranY)
        })
      },
      // 根据传入的队列栈实现自动移动
      autoMove (moveArr) {
        if (!moveArr || moveArr.length < 1) return
        let i = 0
        let len = moveArr.length
        let timer = setInterval(() => {
          let {from, to} = moveArr[i]
          this.moveToAxis(from, to)
          i++
          if (i > len - 1) {
            clearInterval(timer)
            timer = null
            this.isAutoMove = false
          }
        }, 1000)
      },
      // 获取自动一定的步骤数组
      getAutoMoveArr () {
        // 先定义原始的两步的数组
        let stepArr = [{
          from: 0,
          to: 2
        },
          {
            from: 0,
            to: 1
          },
          {
            from: 2,
            to: 1
          }]
        // 移动整列后下一个目标映射轴index
        let nextAxisObj = {
          '1': 2,
          '2': 1
        }
        let getIndex = (oldIndex, dis) => {
          dis = dis < 0 ? parseFloat(dis) + 3 : dis
          let newIndex = parseFloat(oldIndex) + parseFloat(dis)
          newIndex = newIndex > 2 ? newIndex - 3 : newIndex
          return newIndex
        }
        for (let i = 2; i < this.diskCount; i++) {
          let lastTo = stepArr[stepArr.length - 1].to
          let nextAxis = nextAxisObj[lastTo]
          let fromDis = lastTo - 0
          let toDis = nextAxis - lastTo
          let arr = []
          stepArr.forEach((item, index) => {
            arr.push({
              from: getIndex(item.from, fromDis),
              to: getIndex(item.to, toDis)
            })
          })
          stepArr.push({
            from: 0,
            to: nextAxis
          })
          stepArr.push(...arr)
        }
        console.log(stepArr)
        return stepArr
      },
      // 点击自动搞事
      handleAutoMove () {
        this.isAutoMove = true
        let arr = this.getAutoMoveArr()
        this.autoMove(arr)
      },
      // 显示最小步骤数
      getLestStep () {
        this.lestStep = this.getMinStep()
      }
    },
    created () {
      this.init()
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .ui-tower {
    position: relative;
    width: 500px;
    height: 500px;
    background: #ffffff;
  }

  .tower-wrap, .disk-wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .tower-wrap {
    z-index: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .tower-wrap .tower {
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tower .bottom {
    border-bottom: 3px solid #333;
    width: 100%;
    flex: none;
  }

  .tower .middle {
    border-right: 3px solid #333;
    height: 100%;
    flex: 1;
  }

  .disk-wrap {
    z-index: 2;
  }

  .black{
    color: #333;
  }

  .btn-wrap{
    position: relative;
    z-index: 999999;
  }
</style>
