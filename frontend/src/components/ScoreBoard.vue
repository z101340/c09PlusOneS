<template>
    <div class="score" v-bind:score="score">
        Score: {{score}}
        Other Score: {{score}}
    </div>
</template>

<script>
export default {
    name:'score',
    props: [
        'score',
        'otherScore'
    ]
}
</script>
