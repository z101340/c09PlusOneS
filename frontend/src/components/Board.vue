<template>
    <div class="board">
        <div class="box columns">
            <Matrix class="column" v-bind:matrix="blendedMatrix" />
            <div class="column">
                <Side class="is-vertical-center" v-bind:nextTetromino="nextTetromino" v-bind:holdTetromino="holdTetromino" v-bind:score="score" />
            </div>
        </div>
    </div>
</template>

<script>

import Matrix from './Matrix.vue';
import Side from './Side.vue'
import { setTimeout } from 'timers';
import ScoreBoard from './ScoreBoard.vue';

export default {
  name: "board",
  props: ['initialMatrix', 'initialScore'],
  components: {
    Side,
    Matrix
  },
  data() {
    return {
      WIDTH: 10,
      HEIGHT: 20,
    //   score: 0,
      TETROMINOS: [
          [
              [1, 1, 1, 1]
          ],
          [
              [1, 1],
              [1, 1]
          ],
          [
              [0, 1],
              [0, 1],
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
              [0, 1],
              [1, 1],
              [1, 0]
          ],
          [
              [1, 1, 1],
              [0, 1, 0]
          ]
      ],
    //   matrix: [],
      currentTetromino: [],
      nextTetromino: [],
      holdTetromino: [],
      currentTetrominoX: 0,
      currentTetrominoY: 0,
      matrix: this.initialMatrix,
      score: this.initialScore
    }
  },

  methods: {
    initMatrixAndTetrominos: function() {
    //   let matrix = []
    //   for (let row = 0; row < this.HEIGHT; row++) {
    //       matrix.push([])
    //       for (let column = 0; column < this.WIDTH; column++) {
    //           matrix[row].push(0)
    //       }
    //   }
    //   this.score = 0;
    //   this.matrix = matrix
      this.getNextTetromino(true)
      this.getNextTetromino(true) // run twice to initialize current and next for first time
    },
    getNextTetromino: function(init) {
        if (init == false) {
            this.matrix = this.blendedMatrix
        }

        this.currentTetromino = this.nextTetromino;
        this.nextTetromino = this.TETROMINOS[Math.floor(Math.random()*this.TETROMINOS.length)];
        this.currentTetrominoX = 0
        this.currentTetrominoY = Math.floor(this.WIDTH / 2 - 1)
        this.reduceFilledRows()
        this.deathDetection()
    },
    deathDetection: function() {
        const row = 0
        for (let column = 0; column < this.WIDTH; column++) {
            if (this.matrix[row][column] > 1) {
                // dead
                this.die()
            }
        }
    },
    die: function() {
        this.$emit("die")
    },
    reduceFilledRows: function() {
        for (let row = 0; row < this.HEIGHT; row++) {
            let filled = true
            for (let column = 0; column < this.WIDTH && filled == true; column++) {
                if (this.matrix[row][column] == 0) {
                    filled = false
                }
            }
            if (filled) {
                this.matrix.splice(row, 1)
                let empty = []
                for (let i = 0; i < this.WIDTH; i++) {
                    empty.push(0)
                }
                this.matrix.unshift(empty)
                this.lineClearActions();
            }
        }

    },
    lineClearActions: function() {
        // executed after line clear
        this.score++
    },
    softDrop: function() {
        setTimeout(() => {
            this.softDrop()
            this.moveDown()
            this.$emit('matrix-changed', {
                matrix: this.blendedMatrix,
                score: this.score,
                next: this.nextTetromino,
                hold: this.holdTetromino})
        }, 1000)
    },
    moveLeft: function() {
        if (!this.isCollisionLeft) {
            this.currentTetrominoY--
        }
    },
    moveRight: function() {
        if (!this.isCollisionRight) {
            this.currentTetrominoY++
        }
    },
    moveDown: function() {
        if (!this.isCollisionDown) {
            this.currentTetrominoX++
        } else {
            this.getNextTetromino(false)
        }
    },
    moveSharpDown: function() {
        // this.currentTetrominoX = this.HEIGHT - this.currentTetromino.length
        // this.getNextTetromino()
        while (!this.isCollisionDown) {
            this.moveDown()
        }
        this.getNextTetromino(false)
    },
    HoldTetro: function() {
        if(this.holdTetromino.length == 0){
            this.holdTetromino = this.currentTetromino;
            this.currentTetromino = [];
            this.getNextTetromino(false);
        }
        else{
            this.ReleaseTetro();
        }
    },
    ReleaseTetro: function() {
        if(this.holdTetromino.length != 0){
            let temp = [];
            temp = this.currentTetromino;
            this.currentTetromino = this.holdTetromino;
            this.holdTetromino = temp;
            this.currentTetrominoX = 0;
            this.currentTetrominoY = Math.floor(this.WIDTH / 2 - 1);
            this.reduceFilledRows();
            this.deathDetection();
        }
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
        if(this.currentTetrominoY + rotated[0].length < this.WIDTH + 1){
            this.currentTetromino = rotated;
        }
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
                case 'h':
                    this.HoldTetro()
                    break
                // case 'r':
                //     this.ReleaseTetro()
                //     break
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
                  } else if (this.currentTetromino[row][column] == 1
                  && (row == this.currentTetromino.length - 1 || this.currentTetromino[row + 1][column] == 0)
                  && (this.matrix[this.currentTetrominoX + row + 1][this.currentTetrominoY + column] >= 1)) {
                              return true
                          }
                      }
          }
          return false
      },

      isCollisionRight: function() {
          for (let row = 0; row < this.currentTetromino.length; row++) {
              for (let column = 0; column < this.currentTetromino[0].length; column++) {
                  if (column + this.currentTetrominoY + 1 == this.WIDTH) {
                      return true
                  } else if (this.currentTetromino[row][column] == 1
                  && (column == this.currentTetromino[0].length - 1 || this.currentTetromino[row][column + 1] == 0)
                  && (this.matrix[this.currentTetrominoX + row][this.currentTetrominoY + column + 1] >= 1)) {
                      return true
                  }
              }
          }
          return false
      },

      isCollisionLeft: function() {
          for (let row = 0; row < this.currentTetromino.length; row++) {
              for (let column = 0; column < this.currentTetromino[0].length; column++) {
                  if (this.currentTetrominoY == 0) {
                      return true
                  } else if (this.currentTetromino[row][column] == 1
                  && (column == 0 || this.currentTetromino[row][column - 1] == 0)
                  && (this.matrix[this.currentTetrominoX + row][this.currentTetrominoY + column - 1] >= 1)) {
                      return true
                  }
              }
          }
          return false
      }
  },

  mounted() {
      console.log(this.initialMatrix)
    this.initMatrixAndTetrominos()
    this.softDrop()
    this.bindKeys()
  }
}
</script>
