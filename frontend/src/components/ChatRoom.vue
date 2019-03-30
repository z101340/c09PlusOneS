<template>
    <div>
        <textarea v-model="message" placeholder="inputmessage"></textarea>
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
            var text = vm.message;
            ws.send(text);
            vm.message = '';
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
