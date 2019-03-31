<template>
    <div>
        <h1>
            You DIED!
            💀
        </h1>
        <a class="button is-primary is-rounded" v-on:click="back">Back to home page</a>
    </div>
</template>

<script>
export default {
    name: "Die",

    methods:{
        back: function(){
            this.$router.push("/")
        }    
    }    
}
</script>
