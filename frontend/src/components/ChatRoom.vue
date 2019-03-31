<template>
    <div>
        <div v-for="message in messages">{{message}}</div>
        <textarea v-model="text" placeholder="input message"></textarea>
        <button v-on:click="sendMessage(text)">send</button>
    </div>
</template>

<script>
export default {
    name:"chatroom",
    props:{
        msg: String,
    },
    data(){
        return{
            messages:[],
            websock: null,
        } 
    },
    methods:{
        connectWebsocket(){
            this.ws = new WebSocket('ws://localhost:8080/api/chat');
        },

        closeWebsocket(){
            this.ws.close()
        },

        sendMessage(text){
            this.ws.send(text);
        }
    },
    computed:{
        reciveMessage(){
            this.ws.onmessage = function(res) {
                var response = res.data;
                this.messages.append(res);
            }
        }
    },
    destroyed(){
        this.closeWebsocket();
    },
    created(){
        this.connectWebsocket();
    }
}
</script>

<style>

</style>
