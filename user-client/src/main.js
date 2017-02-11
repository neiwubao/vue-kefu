// polyfill
import 'babel-polyfill';

import Vue from 'vue';
import App from './App';
import store from './store';

import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://120.76.246.92:3000'); 

import VueRouter from 'vue-router';
Vue.use(VueRouter);



Vue.config.devtools = true;

new Vue({
    el: 'body',
    components: { App },
    store: store,
});
