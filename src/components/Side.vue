<template>
    <div>
        <NextTetromino v-bind:tetromino="nextTetromino" />
        <div>
            {{ score }}
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
