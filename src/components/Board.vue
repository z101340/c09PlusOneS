<template>
    <div>
        <Matrix v-bind:matrix="matrix" />
        <NextTetromino v-bind:tetromino="nextTetromino" />
    </div>
</template>

<script>
import Matrix from './Matrix.vue'
import NextTetromino from './NextTetromino.vue'

export default {
  name: "board",
  components: {
    Matrix,
    NextTetromino
  },
  data() {
    return {
      WIDTH: 10,
      HEIGHT: 20,
      TETROMINOS: [
          [
              [1, 1, 1, 1]
          ],
          [
              [1, 1],
              [1, 1]
          ],
          [
              [1, 0],
              [1, 0],
              [1, 1]
          ],
          [
              [1, 0],
              [1, 1],
              [0, 1]
          ],
          [
              [1, 1, 1],
              [0, 1, 0]
          ]
      ],
      matrix: [],
      nextTetromino: []

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
    },
    getNextTetromino: function() {
        this.nextTetromino = this.TETROMINOS[Math.floor(Math.random()*this.TETROMINOS.length)];
        console.log(this.nextTetromino)
    }
  },

  created() {
    this.initMatrix()
    this.getNextTetromino()
  }
}
</script>
