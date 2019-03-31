<template>
    <div class = "box">
        <div class="rows is-multiline is-mobile">
            <div class="row is-half is-narrow has-cell-border" v-for="message in messages">{{message.player}} {{message.text}}</div>
        </div>
        <input v-model="textMsg" 
                placeholder="input message" 
                v-bind:textMsg="textMsg" 
                class="input is-large is-hovered"
                v-on:keyup.13="sendMessage(textMsg)">
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
                this.messages.push({player: "You: ",text: text})
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
                if(temp != response){
                    msgs.push({player: "Opponent: ", text: response});
                }
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
    padding-right: 10px;
}
.row{
    margin: auto;
    text-align: left;
    width:40%;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
    margin-bottom: 10px;
    border: 1px solid;
    border-color: grey;
    border-radius: 16px;
}
.box{
    margin: auto;
    width:60%
}
</style>
