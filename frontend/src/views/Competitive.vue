<template>
    <div>
        this is a competitive board
        {{ id }}
        {{ game }}
    </div>
</template>

<script>
export default {
    name: "competitive",
    computed: {
        id() {
            return this.$route.params.id
        },
        game() {
            fetch('http://localhost:3000/api/game/' + this.id)
            .then((res) => res.json())
            .then(res => {
                return res;
            })
        }
    }
}
</script>
