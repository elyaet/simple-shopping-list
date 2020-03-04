<template>
    <b-container fluid id="app">
        <ShoppingList/>
    </b-container>
</template>

<script>
    import ShoppingList from './components/ShoppingList.vue'

    export default {
        name: 'app',
        components:
            {
                ShoppingList
            }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .container-fluid {
        padding: 0;
    }
</style>