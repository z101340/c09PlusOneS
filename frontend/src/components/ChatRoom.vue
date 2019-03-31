<template>
    <div class = "box">
        <div class="rows is-multiline is-mobile">
            <div class="row is-half is-narrow" v-for="message in messages">{{message}}</div>
        </div>
        <input v-model="textMsg" placeholder="input message" v-bind:textMsg="textMsg" class="input is-large is-hovered">
        <a class="button is-primary is-large" v-on:click="sendMessage(textMsg)">send</a>
    </div>
</template>

<script>
export default {
    name:"chatroom",
    data() {
        return{
            textMsg: null,
            messages: [],
            ws: null,
        }
    },
    methods:{
        connectWebsocket: function(){
            this.ws = new WebSocket('ws://localhost:3000/api/game/:id/chat');
            // this.ws.onerror = this.websocketonerror();
        },

        closeWebsocket: function(){
            this.ws.close()
        },

        sendMessage: function(text){
            if(text.length != 0){
                this.ws.send(text);
                this.reciveMessage();
            }
        },
        websocketonerror: function(){
            this.connectWebsocket();
        },
        reciveMessage: function(){
            var msgs = this.messages;
            var temp = this.textMsg;
            this.ws.onmessage = function(msg) {
                var response = msg.data
                msgs.push(response);
            }
            this.messages = msgs;
            this.textMsg = '';
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
<style scoped>
.input{
    margin: auto;
    width: fit-content;
    min-width: 50%;
}
.row{
    margin: auto;
    text-align: left;
    width:40%;
}
.box{
    margin: auto;
    width:80%
}
</style>
