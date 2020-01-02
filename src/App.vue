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