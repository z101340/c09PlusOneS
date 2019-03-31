<template>
    <div>
        <div v-for="message in messages">{{message}}</div>
        <textarea v-model="textMsg" placeholder="input message"></textarea>
        <button v-on:click="sendMessage(textMsg)">send</button>
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
            this.ws = new WebSocket('ws://localhost:3000/api/chat');
            this.ws.onerror = this.websocketonerror();
        },

        closeWebsocket(){
            this.ws.close()
        },

        sendMessage(text){
            this.ws.send(text);
        },
        websocketonerror(){//连接建立失败重连
            this.connectWebSocket();
      },
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
