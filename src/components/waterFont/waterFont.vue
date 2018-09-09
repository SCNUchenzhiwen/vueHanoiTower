<template>
  <div class="water-font-wrap">
    <p class="txt">海琳萌萌哒</p>
  </div>
</template>

<script>
    export default {
        name: 'waterFont'
    }
</script>

<style scoped>
  .txt{
    background: url("../../assets/timg.jpg") no-repeat center;
    background-size: 100% auto;
    color: #333;
    font-size: 50px;
    font-weight: 900;
    -webkit-background-clip: text;
    clip-path: polygon(0% 0, 100% 0%, 0 100%, 0 100%);
  }
</style>
