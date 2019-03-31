<template>
    <div>
        <h1>
            ✌️
            You WON!
        </h1>
        <score v-bind:score="this.$route.query.score" v-bind:otherScore="this.$route.query.otherscore"/>
        <a class="button is-primary is-rounded" v-on:click="back">Back to home page</a>
    </div>
</template>

<script>
import score from '../components/ScoreBoard.vue';
export default {
    name: "Win",
    components:{
        score
    },
    methods:{
    back: function(){
        this.$router.push("/")
        }    
    }  
}
</script>
