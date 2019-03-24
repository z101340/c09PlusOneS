<template>
    <div>
        <div class="card next">
            <header class="card-header">
                <p class="card-header-title">
                    Next
                </p>
            </header>
            <NextTetromino class="card-content" v-bind:tetromino="nextTetromino" />
        </div>
        <div class="card hold">
            <header class="card-header">
                <p class="card-header-title">
                    Hold
                </p>
            </header>
            <NextTetromino class="card-content" v-bind:tetromino="holdTetromino" />
        </div>
        <div class="card Score">
            <header class="card-header">
                <p class="card-header-title">
                    Score
                </p>
            </header>
            <div class="card-content">
                {{ score }}
            </div>
        </div>
    </div>
</template>

<script>
import NextTetromino from './NextTetromino.vue'
import HoldTetromino from './HoldTetromino.vue'
export default {
    name: "side",
    props: ['nextTetromino','holdTetromino', 'score'],
    components: {
        NextTetromino,
        HoldTetromino
    },
}
</script>

<style scoped>
.card > .card-content {
    margin: auto;
}
</style>
