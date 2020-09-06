import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import Loader from './components/app/Loader';
import Paginate from 'vuejs-paginate'
import Vuelidate from 'vuelidate';
import tooltipDirective from './directives/tooltip.directive'
import messagePlugin from './utils/message.plugin.js';
import firebase from 'firebase/app';
import dateFilter from "./filters/date.filter.js";
import currencyFilter from "./filters/currency.filter";
import './registerServiceWorker';
import 'materialize-css/dist/js/materialize.min.js';
import 'firebase/database'
import 'firebase/auth'

Vue.config.productionTip = false

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp({
    apiKey: "AIzaSyBJBu9qmTkzRyK28UC3OfL9usbIEID4mw8",
    authDomain: "crm-db-603ba.firebaseapp.com",
    databaseURL: "https://crm-db-603ba.firebaseio.com",
    projectId: "crm-db-603ba",
    storageBucket: "crm-db-603ba.appspot.com",
    messagingSenderId: "967662286026",
    appId: "1:967662286026:web:d51b32712b11a0f4ac3033",
    measurementId: "G-EPGF3HYM9G"
});

let app;

firebase.auth().onAuthStateChanged(() =>{
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
})