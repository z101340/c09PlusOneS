<template>
<div class="scoreBoard">
    <div class="score" v-bind:score="score">
        Score: {{score}}
    </div>
    <div class="enemyScore" v-bind:otherScore="otherScore">
        Enemy Score: {{otherScore}} 
    </div>
</div>
</template>

<script>
export default {
    name:'score',
    props: [
        'score',
        'otherScore'
    ],
}
</script>
