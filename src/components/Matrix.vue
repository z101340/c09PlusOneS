<template>
    <div class="grid-container">
        <div v-for="row in matrix" class="row">
            <div v-for="cell in row" v-bind:class="{ black: cell }" class="cell">
                {{ cell }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'matrix'
    ]
}
</script>

<style scoped>
.row{
  display: flex;
}
.row div{
  width: 20px;
  height: 20px;
  border: 1px solid black;
}
.black {
    background-color: black;
}
</style>
