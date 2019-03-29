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
    }
}
</script>
