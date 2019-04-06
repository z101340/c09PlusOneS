<template>
<div class="scoreBoard">
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
