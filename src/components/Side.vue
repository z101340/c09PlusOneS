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
        <div class="card">
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
export default {
    name: "side",
    props: ['nextTetromino', 'score'],
    components: {
        NextTetromino
    },
}
</script>

<style scoped>
.next {
    min-height: 30vh;
}
.next > .card-content {
    margin: auto;
}
</style>
