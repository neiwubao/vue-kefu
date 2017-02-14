import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';

import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://121.201.2.70:3000');

var VueResource = require('vue-resource');

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;


Vue.config.devtools = true;

new Vue({
    el: 'body',
    components: { App },
    store: store,
});
