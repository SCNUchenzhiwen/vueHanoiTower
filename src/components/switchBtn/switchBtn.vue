<template>
  <div class="ui-switch-btn" @click="handleSwitch">
    <div class="point left" :style="{background: switchBg}"></div>
    <div class="middle" :style="{background: switchBg}"></div>
    <div class="point right" :style="{background: switchBg}"></div>
    <div class="ball" :class="{active: value}"></div>
  </div>
</template>

<script>
  export default {
    name: 'vSwitchBtn',
    props: {
      value: [Boolean],
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
        return this.value ? this.btnBg : this.closeBtnBg
      }
    },
    methods: {
      handleSwitch () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>

<style scoped>
  *{
    box-sizing: border-box;
  }
  .ui-switch-btn{
    position: relative;
    width: 2.4em;
    height: 1.2em;
  }
  .point, .middle, .ball{
    transition: all .3s;
  }
  .point{
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
  .left{
    left: 0;
  }
  .right{
    right: 0;
  }
  .ball{
    width: 1.2em;
    height: 1.2em;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 .8em #888888;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate3d(0 ,0, 0);
    z-index: 3;
  }
  .ball.active{
    transform: translate3d(1.2em ,0 , 0);
  }
</style>
