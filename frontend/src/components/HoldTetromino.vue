<template>
    <div class="grid-container">
        <div v-for="row in tetromino" class="row">
            <div v-for="cell in row" v-bind:class="{ black: cell }" class="cell">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "holdTetromono",
    props: ['tetromino'],
}
</script>
<style scoped>
.grid-container {
    width: fit-content;
}
.black {
    background-color: black;
}
.row{
  display: flex;
}
.row div{
  width: 20px;
  height: 20px;
}
</style>
