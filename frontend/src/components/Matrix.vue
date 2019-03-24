<template>
    <div class="grid-container">
        <div v-for="row in matrix" class="row">
            <div v-for="cell in row" v-bind:class="{ black: cell }" class="cell">
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
.grid-container {
    width: fit-content;
}
.row{
  display: flex;
}
.row div{
  width: 20px;
  height: 20px;
  /* border: 0.5px solid rgb(184, 184, 184); */
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.2);
}
.black {
    background-color: black;
}
</style>
