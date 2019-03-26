<template>
    <div class="box">
        <h1 class="title is-1">
            Tetris!
        </h1>
        <h4 class="subtitle is-4">Start a new game or join an existing game using given links</h4>
        <a class="button is-primary is-rounded" v-on:click="startNewGame">Start a new game</a>
    </div>
</template>

<script>
export default {
    name: "Welcome",
    methods: {
        startNewGame: function() {
            fetch('//localhost:3000/api/newgame', {
                method: 'POST',
                // mode: 'no-cors'
            }).then(res => res.json())
            .then((response) => {
                if (response.success) {
                    const id = response.id;

                } else {
                    console.error(response)
                }
            }).catch((error) => {
                console.error(error)
            })
        }
    }
}
</script>
