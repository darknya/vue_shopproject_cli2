import Vue from 'vue';
import Router from 'vue-router';
// admin
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import CustomerOrder from '@/components/pages/customerOrder';
import Coupons from '@/components/pages/Coupons';
import CustomerCheckout from '@/components/pages/customerCheckout';
import Orders from '@/components/pages/Orders';
// Guest
import HomePage from '@/components/guests/home';
import GuestDashboard from '@/components/guests/Dashboard';
import Promotions from '@/components/guests/pages/promotions';
import GuestCustomerProducts from '@/components/guests/pages/customerProducts';
import GuestCustomerShopingCart from '@/components/guests/pages/customerShopingCart';
import ProductPage from '@/components/guests/pages/productPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/guest',
    },
    {
      path: '/guest',
      name: 'GuestDashboard',
      component: GuestDashboard,
      children: [
        {
          path: '/',
          name: 'Home',
          component: HomePage,
        },
        {
          path: 'customer_products',
          name: 'GuestCustomerProducts',
          component: GuestCustomerProducts,
        },
        {
          path: 'customer_products/:id',
          name: 'ProductPage',
          component: ProductPage,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
        {
          path: 'promotions',
          name: 'Promotions',
          component: Promotions,
        },
        {
          path: 'customer_shopingcart',
          name: 'customerShopingcart',
          component: GuestCustomerShopingCart,
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'customerCheckout',
          component: CustomerCheckout,
        },
      ],
    },
    // {
    //   path: '/',
    //   name: 'Dashboard',
    //   component: Dashboard,
    //   children: [
    //     {
    //       path: 'customer_order',
    //       name: 'CustomerOrder',
    //       component: CustomerOrder,
    //     },
    //     {
    //       path: 'customer_checkout/:orderId',
    //       name: 'customerCheckout',
    //       component: CustomerCheckout,
    //     },
    //   ],
    // },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
