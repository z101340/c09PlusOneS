<template>
    <div>
        <div class="chatMessage" v-for="message in messages">{{message}}</div>
        <textarea v-model="textMsg" placeholder="input message" v-bind:textMsg="textMsg" class="inputBox"></textarea>
        <button v-on:click="sendMessage(textMsg)" class="sendButton">send</button>
    </div>
</template>

<script>
export default {
    name:"chatroom",
    data() {
        return{
            messages: [],
            ws: null,
        }
    },
    methods:{
        connectWebsocket: function(){
            this.ws = new WebSocket('ws://localhost:3000/api/chat');
            this.ws.onerror = this.websocketonerror();
        },

        closeWebsocket: function(){
            this.ws.close()
        },

        sendMessage: function(text){
            this.ws.send(text);
            this.reciveMessage();
        },
        websocketonerror: function(){
            this.connectWebSocket();
        },
        reciveMessage: function(){
            var msgs = this.messages;
            this.ws.onmessage = function(msg) {
                var response = msg.data;
                msgs.push(response);
            }
            this.messages = msgs;
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
.chatMessage{
    font-family:'Courier New', Courier, monospace;
    margin: auto;
    width: fit-content;
    min-width: 50%;
}
.inputBox{
    margin: auto;
    width: fit-content;
    min-width: 50%;
}
</style>
