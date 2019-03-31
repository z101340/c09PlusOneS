<template>
    <div class="board">
        <div class="box columns">
            <Matrix class="column" v-bind:matrix="matrix" />
            <div class="column">
                <Side class="is-vertical-center" v-bind:nextTetromino="next" v-bind:score="score" v-bind:holdTetromino="hold" />
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
        'next',
        'score',
        'hold'
    ],
    components: {
        Matrix,
        Side
    }
}
</script>

<style scoped>
.board {
    width: fit-content;
}
</style>