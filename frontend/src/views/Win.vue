<template>
    <div>
        <h1>
            ✌️
            You WON!
        </h1>
        <a class="button is-primary is-rounded" v-on:click="back">Back to home page</a>
    </div>
</template>

<script>
import chatroom from '../components/ChatRoom.vue';
export default {
    name: "Win",
    methods:{
    back: function(){
        this.$router.push("/")
        }    
    }  
}
</script>
