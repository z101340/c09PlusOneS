<template>
    <div>
        this is a competitive board
        {{ id }}
    </div>
</template>

<script>
export default {
    name: "competitive",
    computed: {
        id() {
            return this.$route.params.id
        },
    },
    mounted() {
        fetch('http://localhost:3000/api/game/'+this.id, {
            credentials: 'include'
        })
        .then(res=>res.json())
        .then(res=>{
            if (res.success && res.result.isHost) {
                this.setupGameForHost(res.result)
            }
        })
    },
    methods: {
        setupGameForHost(gameInfo) {
            if (!gameInfo.hasStarted) {
                // game is not started yet. waiting for client

            }
        }
    }
}
</script>
