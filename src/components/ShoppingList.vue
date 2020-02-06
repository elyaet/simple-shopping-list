<template>
    <div>
        <b-modal id="modal-1" hide-header hide-footer>
            <b-button variant="warning" @click="currentRetry = retryNb" class="mt-3" block>Synchroniser</b-button>
        </b-modal>
        <draggable v-model="shoppingList" handle=".handle">

            <div class="list-group-item" v-for="(item, index) in shoppingList" :key="item.date">
                <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <b-form-checkbox :id="'c-' + index" v-model="item.done"/>
                        </div>
                    </div>
                    <b-form-textarea
                            :class="item.done ? 'line-through' : '' + bgColor[item.tag] + ' ' + textColor[item.tag]"
                            v-model="item.text"
                            :disabled="item.done"
                            rows="2"
                            max-rows="10"
                            style="overflow-y:hidden;"/>
                    <div class="input-group-append">
                        <b-button :id="'c-changetag-' + index" @click="changeTag(index)">&#x25CB;</b-button>
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
                             ref="addItemField"
                             style="overflow-y:hidden;"/>
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
                lastUpdated: null,
                updateDelay: 5000,
                retryNb: 700,
                currentRetry: 0,
                shoppingList: [],
                newItem: "",
                dragging: false,
                bgColor: [".bg-white", "bg-primary", "bg-success", "bg-danger", "bg-warning", "bg-info"],
                textColor: ["text-dark", "text-white", "text-white", "text-white", "text-white", "text-white"],
                mode: "pull",
                updatedFromBackEnd: false
            }
        },
        methods: {
            addItem(event) {
                if (event.target.value.trim() !== '') {
                    this.shoppingList.push({
                        date: new Date().toJSON(),
                        text: event.target.value.trim(),
                        done: false,
                        tag: 0
                    });
                    this.$nextTick(function () {
                        event.target.value = "";
                    });
                }
            },
            removeItem(index) {
                this.shoppingList.splice(index, 1);
            },
            changeTag(index) {
                this.shoppingList[index].tag++;
                if (this.bgColor.length <= this.shoppingList[index].tag) {
                    this.shoppingList[index].tag = 0;
                }
            },
            checkUpdates() {
                if (this.mode === "push") {
                    axios
                        .post(this.resShoppingListPath, this.shoppingList)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.mode = "pull";
                            this.$nextTick(function () {
                                this.newItem = "";
                            })
                        });
                } else {
                    if (this.currentRetry > 0) {
                        this.currentRetry--;
                        let headers = {
                            'If-Modified-Since': this.lastUpdated
                        };
                        axios
                            .get(this.resShoppingListPath, {headers})
                            .then(response => {
                                if (JSON.stringify(response.data) !== JSON.stringify(this.shoppingList) && response.headers['last-modified'] !== this.lastUpdated) {
                                    this.shoppingList = response.data;
                                    this.lastUpdated = response.headers['last-modified'];
                                    this.updatedFromBackEnd = true;
                                }
                            })
                            // eslint-disable-next-line no-unused-vars
                            .catch(error => {
                            });
                    }
                }
            }
        },
        watch: {
            shoppingList: {
                handler() {
                    if (this.updatedFromBackEnd === true) {
                        this.updatedFromBackEnd = false;
                    } else {
                        this.mode = "push";
                        this.checkUpdates();
                    }

                }, deep: true
            },
            currentRetry: {
                handler() {
                    if (this.currentRetry === 0) {
                        this.$bvModal.show('modal-1');
                    }
                    if (this.currentRetry === this.retryNb) {
                        this.checkUpdates();
                        this.$bvModal.hide('modal-1');
                    }
                }
            }
        },
        created() {
            this.currentRetry = this.retryNb;
            this.checkUpdates();
            setInterval(this.checkUpdates, this.updateDelay);
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

    .line-through {
        text-decoration: line-through;
    }
</style>
