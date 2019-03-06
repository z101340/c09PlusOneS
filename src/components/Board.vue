<template>
    <Matrix v-bind:matrix="matrix" v-bind:HEIGHT="HEIGHT" v-bind:WIDTH="WIDTH" />
</template>

<script>
import Matrix from './Matrix.vue'

export default {
  name: "board",
  components: {
    Matrix
  },
  data() {
    return {
      WIDTH: 10,
      HEIGHT: 20,
      matrix: []
    }
  },

  methods: {
    initMatrix: function() {
      for (let row = 0; row < this.HEIGHT; row++) {
          this.matrix.push([])
          for (let column = 0; column < this.WIDTH; column++) {
              this.matrix[row].push(0)
          }
      }
    }
  },

  created() {
    this.initMatrix()
  }
}
</script>
