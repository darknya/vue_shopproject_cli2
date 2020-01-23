/* eslint-disable guard-for-in */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';// Import component
import 'vue-loading-overlay/dist/vue-loading.css';// Import stylesheet
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
// eslint-disable-next-line import/extensions
import tw from 'vee-validate/dist/locale/zh_TW';

import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(Loading, { color: 'red' });
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);

function Vrule() {
  // eslint-disable-next-line no-restricted-syntax
  for (const rule in rules) {
    extend(rule, {
      ...rules[rule], // add the rule
      message: tw.messages[rule], // add its message
    });
  }
}
Vrule();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

router.beforeEach((to, from, next) => {
  // // eslint-disable-next-line no-console
  // console.log('TO', to, from, next);
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      // // eslint-disable-next-line no-console
      // console.log(response.data);
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});
