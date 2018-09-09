<template>
  <div class="water-button-wrap">
    <p>测试按钮水波纹</p>
    <div class="water-wrap"></div>
    <div class="mask" @click="handleClick"></div>
  </div>
</template>

<script>
  export default {
    name: 'waterButton',
    methods: {
      handleClick (e) {
        const waterW = 100
        const waterH = 100
        let left = e.offsetX - waterW / 2
        let top = e.offsetY - waterH / 2
        let target = e.target
        let parentNode = target.parentNode.querySelector('.water-wrap')
        let html = document.createElement('div')
        let baseStyle = 'transition: all .5s ease;background:red;position:absolute;width:100px;height:100px;border-radius:50%;left:0;top:0;transform-origin:center;'
        let baseScale = `transForm: translate3d(${left}px,${top}px,0) scale(0);opacity:0.2;`
        let activeScale = `transForm: translate3d(${left}px,${top}px,0) scale(2.5);opacity: 0;`
        html.style.cssText = `${baseStyle}${baseScale}`
        parentNode.appendChild(html)
        setTimeout(() => {
          html.style.cssText = `${baseStyle}${activeScale}`
          setTimeout(() => {
            parentNode.removeChild(html)
          }, 500)
        }, 10)
        this.$emit('click', e)
      }
    }
  }
</script>

<style scoped>
  .water-button-wrap {
    position: relative;
    padding: 10px;
    background-color: #ffffff;
    color: #333;
  }

  .mask, .water-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .mask {
    z-index: 10;
  }

  .water-wrap {
    z-index: 5;
  }
</style>
