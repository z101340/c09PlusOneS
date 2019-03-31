<template>
    <div>
        <Share v-if="!hasStarted" />
        <div class="columns board">
            <div class="column gamepad">
                <Board v-if="hasStarted"
                    v-on:matrix-changed="updateMatrix"
                    v-on:die="die"
                    v-bind:initialMatrix="me.matrix"
                    v-bind:initialScore="me.score" />
            </div>
            <div class="column gamepad">
                <BoardLimited v-if="hasStarted" 
                    v-bind:matrix="opponent.matrix"
                    v-bind:score="opponent.score"
                    v-bind:hold="opponent.hold"
                    v-bind:next="opponent.next" />
            </div>
        </div>
        <chatroom/>
    </div>
</template>

<script>
import chatroom from '../components/ChatRoom.vue';
import BoardLimited from './../components/BoardLimited.vue'
import Board from './../components/Board.vue'
import Share from './../components/Share.vue'

export default {
    name: "competitive",
    components: {
        BoardLimited,
        Board,
        chatroom,
        Share
    },
    data() {
        return {
            opponent: {},
            me: {},
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
                    score: data.score,
                    next: data.next,
                    hold: data.hold
                }
            } else if (data.method == "win") {
                this.$router.push({
                    path: "/win/" + this.id,
                    query: {
                        score: this.me.score,
                        otherscore: this.opponent.score
                    }
                })
            }
        }
    },
    methods: {
        setupGame: function (gameInfo) {
            this.me = gameInfo.players.you;
            const opponent = gameInfo.players.opponent;

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
            const {matrix, score, hold, next} = pack;
            this.ws.send(JSON.stringify({
                method: "updateMatrix",
                matrix,
                score,
                hold,
                next
            }))
        },
        die: function() {
            this.ws.send(JSON.stringify({
                method: "die"
            }))
            this.$router.push({
                path: '/die/'+this.id,
                query: {
                    score: this.me.score,
                    otherscore: this.opponent.score
                }
            })
        }
    }
}
</script>

<style scoped>
.board {
    margin: auto;
    position: relative;
}
.gamepad {
    width: 20vw;
    padding-left: 5em;
    padding-right: 5em;
    height: 100%;
}
</style>
