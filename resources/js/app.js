/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import Vue from "vue";
//window.Vue = require('vue');
import VueProgressBar from 'vue-progressbar'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import { Form, HasError, AlertError } from "vform";

window.Form  = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

const Snotifyoptions = {
    toast: {
        position: SnotifyPosition.rightTop
    }
};

Vue.use(Snotify, Snotifyoptions);

const VueProgressBarOptions = {
    color: '#50d38a',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}

Vue.use(VueProgressBar, VueProgressBarOptions);

 
Vue.component('customers-component', require('./components/CustomersComponent.vue').default);
Vue.component('pagination', require('./components/partials/PaginationComponent.vue').default);

 

const app = new Vue({
    el: '#app',
});
