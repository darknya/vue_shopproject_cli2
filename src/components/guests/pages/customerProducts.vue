<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-md-4 ml-sm-auto px-4 pt-4">
        <Sidebar :categorys="categoryHandler" @click_category="clickCategory"></Sidebar>
      </aside>
      <div class="col-md-8 ml-sm-auto px-4">
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
          <!-- products -->
          <div class="col-md-8 col-lg-6 col-xl-4 mb-4" v-for="(item) in productFilter" :key="item.id">
            <div class="card border-0 shadow-sm">
              <div style="height: 150px; background-size: cover; background-position: center"
                :style="{backgroundImage: `url(${item.imageUrl})`}">
              </div>
              <div class="card-body">
                <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                <h5 class="card-title">
                  <a href="#" class="text-dark" @click.prevent="toProductPage(item.id)">{{item.title}}</a>
                </h5>
                <p class="card-text text-truncate">{{item.content}}</p>
                <div class="d-flex justify-content-between align-items-baseline">
                  <div class="h5" v-if="!item.origin_price">售價NT{{item.price | currency}}</div>
                  <del class="small" v-if="item.origin_price">原價NT{{item.origin_price | currency}}</del>
                  <div class="h6" v-if="item.origin_price">特價NT{{item.price | currency}}</div>
                </div>
              </div>
              <div class="card-footer d-flex">
                <button type="button" class="btn btn-outline-secondary btn-sm"
                @click="toProductPage(item.id)">
                  <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                  查看更多
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
                @click="addtoCart(item.id)">
                  <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                  加到購物車
                </button>
              </div>
            </div>
          </div>
          <!-- products end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery';
import Sidebar from '../Sidebar';
// import Products from '../Pagination';

export default {
  data() {
    return {
      products: [],
      sidebarCategoryName: 'All',
      tempProduct: {
        num: 1,
      },
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
      cart: {},
    };
  },
  components: {
    Sidebar,
  },
  computed: {
    // 將現有的分類名稱整理出來給sidebar
    categoryHandler() {
      const vm = this;
      const categorys = new Set();
      vm.products.forEach((product) => {
        categorys.add(product.category);
      });
      return Array.from(categorys);
    },
    // 商品分類過濾
    productFilter() {
      const vm = this;
      if (vm.sidebarCategoryName === 'All') {
        return vm.products;
      }
      return vm.products.filter(product => product.category === vm.sidebarCategoryName);
    },
  },
  methods: {
    getProducts() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    toProductPage(id) {
      const vm = this;
      vm.$router.push(`customer_products/${id}`);
    },
    addtoCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      this.$http.post(api, { data: cart }).then(() => {
        vm.status.loadingItem = '';
        vm.getCart();
      });
    },
    getCart() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        // console.log("Cart:", response.data.data);
        vm.cart = response.data.data;
        vm.$bus.$emit('updataCart');
        vm.isLoading = false;
      });
    },
    // 將點到的分類名稱存到sidebarCategory
    clickCategory(categoryName) {
      this.sidebarCategoryName = categoryName;
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
