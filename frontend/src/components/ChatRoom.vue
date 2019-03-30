<template>
    <div>
        <div class="message">{{msg}}</div>
        <textarea v-model="text" placeholder="inputmessage"></textarea>
    </div>
</template>

<script>
export default {
    name:"chatroom",
    props:{
        msg: String
    },
    methods:{
        connectWs(){
            const ws = new WebSocket('ws://localhost:8080');
        },

        sendMessage(){
            var text = vm.text;
            ws.send(text);
            vm.text = '';
        },

        reciveMessage(){
            ws.onmessage = function(msg) {
                var response = msg.data;
            }
        }

        
    },
    created(){
        this.connectWs();
    }
}
</script>

<style>

</style>
