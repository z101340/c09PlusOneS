<template>
    <div>
        <Matrix v-bind:matrix="blendedMatrix" />
        Next:
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
        this.matrix = this.blendedMatrix
        this.currentTetromino = this.nextTetromino;
        this.nextTetromino = this.TETROMINOS[Math.floor(Math.random()*this.TETROMINOS.length)];
        this.currentTetrominoX = 0
        this.currentTetrominoY = 0
    },
    softDrop: function() {
        setTimeout(() => {
            this.softDrop()
            this.moveDown()
        }, 1000)
    },
    moveLeft: function() {
        if (this.currentTetrominoY > 0) {
            this.currentTetrominoY--
        }
    },
    moveRight: function() {
        if (this.currentTetrominoY < this.WIDTH) {
            this.currentTetrominoY++
        }
    },
    moveDown: function() {
        if (!this.isCollisionDown) {
            this.currentTetrominoX++
        } else {
            this.getNextTetromino()
        }
    },
    moveSharpDown: function() {
        // this.currentTetrominoX = this.HEIGHT - this.currentTetromino.length
        // this.getNextTetromino()
        while (!this.isCollisionDown) {
            this.moveDown()
        }
        this.getNextTetromino()
    },

    rotate: function() {
        let rotated = []
        for (let column = 0; column < this.currentTetromino[0].length; column++) {
            for (let row = this.currentTetromino.length - 1; row >=0 ; row--) {
                if (row == this.currentTetromino.length - 1) {
                    rotated.push([])
                }
                rotated[rotated.length - 1].push(this.currentTetromino[row][column])
            }
        }
        this.currentTetromino = rotated
    },

    bindKeys: function() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveLeft()
                    break
                case 'ArrowRight':
                    this.moveRight()
                    break
                case 'ArrowDown':
                    this.moveDown()
                    break
                case 'ArrowUp':
                    this.rotate()
                    break
                case ' ':
                    this.moveSharpDown()
                    break
            }
        })
    }

  },

  computed: {
      blendedMatrix: function() {
          let blendedMatrix = JSON.parse(JSON.stringify(this.matrix));
          for (let row=0; row<this.currentTetromino.length; row++) {
              for (let column=0; column<this.currentTetromino[0].length; column++) {
                  blendedMatrix[this.currentTetrominoX + row][this.currentTetrominoY + column] = this.currentTetromino[row][column] + this.matrix[this.currentTetrominoX + row][this.currentTetrominoY + column]
              }
          }
          return blendedMatrix;
      },
      isCollisionDown: function() {
          for (let row = 0; row < this.currentTetromino.length; row++) {
              for (let column = 0; column < this.currentTetromino[0].length; column++) {
                  if (row + this.currentTetrominoX + 1 == this.HEIGHT) {
                      return true
                  }
                  if (this.currentTetromino[row][column] == 1
                  && (row == this.currentTetromino.length - 1 || this.currentTetromino[row + 1][column] == 0)
                  && (this.matrix[this.currentTetrominoX + row+1][this.currentTetrominoY + column] >= 1)) {
                              return true
                          }
                      }
          }
          return false
      }
  },

  created() {
    this.initMatrixAndTetrominos()
    this.softDrop()
    this.bindKeys()
  }
}
</script>
