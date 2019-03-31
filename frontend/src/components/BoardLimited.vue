<template>
    <div class="board">
        <div class="box columns">
            <Matrix class="column" v-bind:matrix="matrix" />
            <div class="column">
                <Side class="is-vertical-center" v-bind:nextTetromino="nextTetromino" v-bind:score="score" />
            </div>
        </div>
    </div>
</template>

<script>
import Matrix from './Matrix.vue'
import Side from './Side.vue'

export default {
    props: [
        'matrix',
        'nextTetrimino',
        'score'
    ],
    components: {
        Matrix,
        Side
    }
}
</script>
