<template>
    <div>
        <Matrix v-bind:matrix="blendedMatrix" />
        <NextTetromino v-bind:tetromino="nextTetromino" />
    </div>
</template>

<script>
import Matrix from './Matrix.vue'
import NextTetromino from './NextTetromino.vue'
import { setTimeout } from 'timers';

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
      currentTetromino: [],
      nextTetromino: [],
      currentTetrominoX: 0,
      currentTetrominoY: 0
    }
  },

  methods: {
    initMatrixAndTetrominos: function() {
      for (let row = 0; row < this.HEIGHT; row++) {
          this.matrix.push([])
          for (let column = 0; column < this.WIDTH; column++) {
              this.matrix[row].push(0)
          }
      }
      this.getNextTetromino()
      this.getNextTetromino() // run twice to initialize current and next for first time
    },
    getNextTetromino: function() {
        this.currentTetromino = this.nextTetromino;
        this.nextTetromino = this.TETROMINOS[Math.floor(Math.random()*this.TETROMINOS.length)];
    },
    softDrop: function() {
        setTimeout(this.softDrop, 1000)
        this.currentTetrominoX++
    }
  },

  computed: {
      blendedMatrix: function() {
          let blendedMatrix = JSON.parse(JSON.stringify(this.matrix));
          for (let row=0; row<this.currentTetromino.length; row++) {
              for (let column=0; column<this.currentTetromino[0].length; column++) {
                  blendedMatrix[this.currentTetrominoX + row][this.currentTetrominoY + column] = this.currentTetromino[row][column]
              }
          }
          return blendedMatrix;
      }
  },

  created() {
    this.initMatrixAndTetrominos()
    this.softDrop()
  }
}
</script>
