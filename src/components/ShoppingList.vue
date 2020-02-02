<template>
    <div>
        <b-modal id="modal-1" hide-header hide-footer>
            <b-button variant="warning" @click="updateShoppingList" class="mt-3" block>Synchroniser</b-button>
        </b-modal>
        <draggable v-model="shoppingList" handle=".handle">

            <div class="list-group-item" v-for="(item, index) in shoppingList" :key="item.date">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <b-form-checkbox :id="'c-' + index" v-model="item.done"/>
                        </div>
                    </div>
                    <b-form-textarea :class="item.done ? 'line-through' : ''" v-model="item.text"
                                     :disabled="item.done" rows="2" max-rows="10"/>
                    <div class="input-group-append">
                        <b-button class="fa fa-align-justify handle">&#x2630;</b-button>
                        <b-button :id="'c-remove-' + index" @click="removeItem(index)">&#x2718;</b-button>
                    </div>
                </div>
            </div>
        </draggable>
        <div class="input-group mb-3">
            <b-form-textarea @focusout="addItem"
                             @keydown.enter.exact.prevent
                             @keyup.enter.exact="addItem"
                             v-model="newItem" rows="2" max-rows="10"
                             ref="addItemField"/>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import draggable from 'vuedraggable';

    export default {
        components: {
            draggable
        },
        data: function () {
            return {
                resShoppingListPath: "courses.php",
                updateDelay: 5000,
                shoppingList: [],
                underline: "text-decoration:underline;",
                hasUpdate: 0,
                newItem: "",
                dragging: false
            }
        },
        methods: {
            addItem(event) {

                if (event.target.value.trim() != '') {
                    this.shoppingList.push({
                        date: new Date().toJSON(),
                        text: event.target.value.trim(),
                        done: false
                    });
                    this.$nextTick(function () {
                        event.target.value = "";
                    })
                    // eslint-disable-next-line no-console
                    console.log(event.target.value);
                }
            },
            removeItem(index) {
                this.shoppingList.splice(index, 1);
            },
            updateShoppingList() {
                axios
                    .get(this.resShoppingListPath)
                    .then(response => (this.shoppingList = response.data));
                //this.$bvModal.hide('modal-1')
            },
            checkUpdates() {
                axios
                    .get(this.resShoppingListPath)
                    .then(response => (JSON.stringify(response.data) != JSON.stringify(this.shoppingList) ? this.hasUpdate++ : this.hasUpdate = 0));
            }
        },
        watch: {
            shoppingList: {
                handler() {
                    axios.post(this.resShoppingListPath, this.shoppingList)
                    this.$nextTick(function () {
                        this.newItem = "";
                    })
                }, deep: true
            },
            hasUpdate: {
                handler() {
                    if (this.hasUpdate >= 2) {
                        //this.$bvModal.show('modal-1')
                        this.updateShoppingList();
                    }
                }
            }
        },
        created() {
            this.updateShoppingList();
            this.interval = setInterval(this.checkUpdates, this.updateDelay);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .list-group-item {
        padding: 0;
        background-color: #fff;
        border: none;
    }
</style>
