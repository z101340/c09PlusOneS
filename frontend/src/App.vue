<template>
  <div id="app">
    <!-- <Board /> -->
    <Welcome />
  </div>
</template>

<script>
// import Board from './components/Board.vue'
import Welcome from './components/Welcome.vue'

export default {
  name: 'app',
  components: {
    // Board
    Welcome
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
