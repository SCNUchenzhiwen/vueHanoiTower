<template>
  <button @click="goushi"></button>
</template>

<script>
  export default {
    name: 'test',
    methods: {
      goushi () {
        this.jiba.goushi = 2233
      }
    }
  }
</script>

<style scoped>

</style>
