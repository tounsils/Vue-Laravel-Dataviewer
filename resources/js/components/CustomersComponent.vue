<template>
    <div id="customer"> 
        <div class="row justify-content-center">
            <div class="col-md-12 mx-auto">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Customers  Details</h3>
                        <div class="card-tools" style="position: absolute; right: 1rem; top: .7rem;">
                            <button class="btn btn-primary" @click="create">Add New <i class="fas fa-plus"></i></button>
                            <button class="btn btn-success" @click="reload">Reload <i class="fas fa-sync"></i></button>
                        </div>
                    </div>

                    <div class="card-body"> 
                        <div action="" class="mb-3">
                            <div class="row">                                
                                <div class="col-md-2 pl-5">
                                    <strong>Search By : </strong>
                                </div>
                                <div class="col-md-3 form-group">
                                    <select v-model="queryField" id="fields" class="form-control">
                                        <option value="name">Name</option>
                                        <option value="email">email</option>
                                        <option value="phone">Phone</option>
                                        <option value="address">Address</option>
                                        <option value="total">Total</option>
                                    </select>
                                </div>
                                <div class="col-md-7">
                                    <input v-model="query" type="text" class="form-control" placeholder="Search">
                                </div>
                            </div>
                        </div>
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Total</th>
                                    <th scope="col" class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-show="customers.length" v-for="(customer, index) in customers" :key="customer.id"> 
                                    <th scope="row">{{ index+1 }}</th>
                                    <td scope="row">{{ customer.name }}</td>
                                    <td scope="row">{{ customer.email }}</td>
                                    <td scope="row">{{ customer.phone }}</td>
                                    <td scope="row">{{ customer.total }}</td>
                                    <td class="text-center">                                        
                                        <button type="button" @click="show(customer)" class="btn btn-success btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button type="button" @click="edit(customer)" class="btn btn-warning btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button type="button" @click="destroy(customer)" class="btn btn-danger btn-sm">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>

                                </tr> 
                                <tr v-show="!customers.length">
                                    <td colspan="6">
                                        <div class="alert alert-danger" role="alert">
                                            Sorry :( No data found
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                        <pagination  v-if="pagination.last_page > 1"
                                        :pagination="pagination"
                                        :offset="5"
                                        @paginate="query=== '' ? getData() : searchData() "
                        ></pagination>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="CustomerModalLong" tabindex="-1" role="dialog" aria-labelledby="CustomerModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="CustomerModalLongTitle">{{ editMode ? "Edit": "Add New" }} Customer</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <form @submit.prevent=" editMode ? update(): store() " @keydown="form.onKeydown($event)">
                            <div class="modal-body">
                                <alert-error :form="form"></alert-error>
                                <div class="form-group">
                                    <label>Name</label>
                                    <input v-model="form.name" type="text" name="name"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                    <has-error :form="form" field="name"></has-error>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input v-model="form.email" type="email" name="email"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                    <has-error :form="form" field="email"></has-error>
                                </div> 
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input v-model="form.phone" type="tel" name="phone"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }">
                                    <has-error :form="form" field="phone"></has-error>
                                </div>  
                                <div class="form-group">
                                    <label>Address</label>
                                    <textarea v-model="form.address" name="address"
                                        class="form-control" rows="3" :class="{ 'is-invalid': form.errors.has('address') }"></textarea>
                                    <has-error :form="form" field="address"></has-error>
                                </div>  
                                <div class="form-group">
                                    <label>Total</label>
                                    <input v-model="form.total" type="number" name="total"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('total') }">
                                    <has-error :form="form" field="total"></has-error>
                                </div> 
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button :disabled="form.busy" type="submit" class="btn btn-primary">{{ editMode ? "Update": "Create"}}</button>
                            </div>
                        </form>
                </div>
            </div>
        </div>

        <!-- Modal 2 -->
        <div class="modal fade" id="readModalLong" tabindex="-1" role="dialog" aria-labelledby="readModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="readModalLongTitle">Show Customer</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <form  @submit.prevent=" editMode ? update(): store() " @keydown="form.onKeydown($event)">
                            <div class="modal-body">
                                <alert-error :form="form"></alert-error>
                                <div class="form-group">
                                    <label>Name</label>
                                    <input v-model="form.name" type="text" name="name"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" readonly>
                                    <has-error :form="form" field="name"></has-error>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input v-model="form.email" type="email" name="email"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" readonly>
                                    <has-error :form="form" field="email"></has-error>
                                </div> 
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input v-model="form.phone" type="tel" name="phone"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }" readonly>
                                    <has-error :form="form" field="phone"></has-error>
                                </div>  
                                <div class="form-group">
                                    <label>Address</label>
                                    <textarea v-model="form.address" name="address"
                                        class="form-control" rows="3" :class="{ 'is-invalid': form.errors.has('address') }" readonly></textarea>
                                    <has-error :form="form" field="address"></has-error>
                                </div>  
                                <div class="form-group">
                                    <label>Total</label>
                                    <input v-model="form.total" type="number" name="total"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('total') }" readonly>
                                    <has-error :form="form" field="total"></has-error>
                                </div> 
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </form>
                </div>
            </div>
        </div>

        <vue-progress-bar></vue-progress-bar>
         <vue-snotify></vue-snotify>
    </div>
</template>

<script>
import { request } from 'http';
    export default {

        data(){
            return {
                editMode: false,
                query: "",
                queryField: "name",
                customers: [],
                form : new Form({
                    id : '',
                    name : '',
                    email : '',
                    phone : '',
                    address : '',
                    total : '',

                }),
                pagination: {
                    current_page: 1,
                },
            }

        },
        watch: {
            query: function(newQ, old){
                if (newQ=== '') {
                   this.getData() 
                } else{
                    this.searchData()
                }

            }
        },
        mounted() {
            console.log('Component mounted.')
            this.getData();
        },
        methods: {
            getData(){
                this.$Progress.start()
                axios.get('/api/customers?page='+this.pagination.current_page)
                    .then(response=> {
                        this.customers = response.data.data
                        this.pagination = response.data.meta
                        this.$Progress.finish()
                    })
                    .catch(e => {
                        console.log(e)
                        this.$Progress.fail()
                    })
            },
            searchData(){
                this.$Progress.start()
                axios.get('/api/search/customers/'+this.queryField+'/'+this.query+'?page='+this.pagination.current_page)
                    .then(response=> {
                        this.customers = response.data.data
                        this.pagination = response.data.meta
                        this.$Progress.finish()
                    })
                    .catch(e => {
                        console.log(e)
                        this.$Progress.fail()
                    })
            },
            reload(){
                this.getData()
                this.query = ''
                this.queryField = 'name'
                this.$snotify.success('Page Successfully Refreshed!', 'Success')
            },
            create(){
                this.editMode = false;
                this.form.reset()
                this.form.clear()
                $('#CustomerModalLong').modal('show');
            },
            store(){
                this.$Progress.start()
                this.form.busy = true
                this.form.post('/api/customers')
                .then(reponse =>{
                    this.getData()
                    $('#CustomerModalLong').modal('hide');
                    if (this.form.successful) {
                        this.$Progress.finish()
                        this.$snotify.success('Customer created Successfully!', 'Success')
                    } else{
                        this.$Progress.fail()
                        this.$snotify.error('Something went Wrong :(', 'Error')

                    }
                })
                .catch( e =>{
                    this.$Progress.fail()
                    console.log(e);
                })
            },
            edit(customer){
                this.editMode = true;
                this.form.reset()
                this.form.clear()
                this.form.fill(customer)
                $('#CustomerModalLong').modal('show');
            },
            update(){
                this.$Progress.start()
                this.form.busy = true
                this.form.put('/api/customers/'+this.form.id)
                .then(reponse =>{
                    this.getData()
                    $('#CustomerModalLong').modal('hide');
                    if (this.form.successful) {
                        this.$Progress.finish()
                        this.$snotify.success('Customer Updated Successfully!', 'Success')
                    } else{
                        this.$Progress.fail()
                        this.$snotify.error('Something went Wrong :(', 'Error')

                    }
                })
                .catch( e =>{
                    this.$Progress.fail()
                    console.log(e);
                })
            },

            destroy(customer){
                this.$snotify.clear()
                this.$snotify.confirm(
                    "You wil not be able to recover this data!",
                    "Are you sure?",
                    {
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        position: "centerCenter",  
                        buttons: [
                            {
                                text: "Yes",
                                action: toast => {
                                    this.$snotify.remove(toast.id);
                                    this.$Progress.start();
                                    axios.delete('/api/customers/'+ customer.id)
                                        .then(response=> { 
                                            this.getData()
                                            this.$Progress.finish()
                                            this.$snotify.success('Customer Deleted Successfully!', 'Success')
                                        })
                                        .catch(e => {
                                            console.log(e)
                                            this.$Progress.fail()
                                        })
                                },
                                bold: true
                            },
                            {
                                text: "No",
                                action: toast => {
                                    this.$snotify.remove(toast.id);
                                },
                                bold: true                               
                            }
                        ]
                    }
                )
            },

            show(customer){ 
                this.form.fill(customer)
                $('#readModalLong').modal('show');
                console.log(customer)
            },
        }
    }
</script>
