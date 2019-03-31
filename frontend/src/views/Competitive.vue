<template>
    <div>
        {{ id }}
        <Board v-if="hasStarted" v-on:matrix-changed="updateMatrix" />
        <BoardLimited v-if="hasStarted" v-bind:matrix="opponent.matrix" v-bind:score="opponent.score" />
    </div>
</template>

<script>
import BoardLimited from './../components/BoardLimited.vue'
import Board from './../components/Board.vue'

export default {
    name: "competitive",
    components: {
        BoardLimited,
        Board
    },
    data() {
        return {
            opponent: {},
            hasStarted: false,
            ws: new WebSocket("ws://localhost:3000/api/game/" +this.$route.params.id + "/ws")
        }
    },
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
            if (res.success) {
                this.setupGame(res.result)
            }
        })

        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if (data.method == "guestJoined") {
                this.hasStarted = true
            } else if (data.method == "updateOpponentMatrix") {
                this.opponent = {
                    matrix: data.matrix,
                    score: data.score
                }
            }
        }
    },
    methods: {
        setupGame: function (gameInfo) {
            const me = gameInfo.players.you;
            const opponent = gameInfo.players.opponent;

            this.opponent
            this.hasStarted = gameInfo.hasStarted

            if (!gameInfo.isHost && !this.hasStarted) {
                // guest
                fetch('http://localhost:3000/api/game/' + this.id, {
                    credentials: 'include',
                    method: 'PATCH'
                })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        this.hasStarted = true
                    }
                })
            }
        },
        updateMatrix: function(pack) {
            const matrix = pack.matrix;
            const score = pack.score;
            this.ws.send(JSON.stringify({
                method: "updateMatrix",
                matrix,
                score
            }))
        }
    }
}
</script>
