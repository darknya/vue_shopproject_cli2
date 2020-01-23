<template>
  <div>
    <!-- 幻燈片 -->
    <div class="swiper-container ind-banner-wrap">
      <swiper :options="swiperOption" class="ind-banner-wrap">
        <swiper-slide class="ind-banner picture1">
          <p>標語1</p>
        </swiper-slide>
        <swiper-slide class="ind-banner picture2">
          <p>標語2</p>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <!-- 幻燈片-END -->
    <hr>
    <div class="new-products">
      <div class="title">
        <p>NEW! 新品上架</p>
      </div>
      <hr>
      <div class="container">
            <div class="px-4">
              <loading :active.sync="isLoading"></loading>
              <div class="row">
                <!-- products -->
                <div class="col-sm-6 col-md-6 col-xl-4 mb-4" v-for="(item) in newstProducts" :key="item.id">
                  <div class="card border-0 shadow-sm">
                    <div class="card-img-top" :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                      <span class="badge badge-secondary">{{item.category}}</span>
                      <h5 class="card-title">
                        <a href="#" @click.prevent="toProductPage(item.id)" class="text-primary">{{item.title}}</a>
                      </h5>
                      <p class="card-text">{{item.description}}</p>
                      <div class="align-items-baseline d-flex justify-content-between">
                        <div>
                          <div class="h5" v-if="!item.origin_price">NT{{item.price | currency}}</div>
                          <del class="h6" v-if="item.origin_price">NT{{item.origin_price | currency}}</del>
                          <div class="special-price" v-if="item.origin_price"><b>NT{{item.price | currency}}</b></div>
                        </div>
                        <button type="button" class="btn btn-outline-secondary btn-sm btn-quicklook"
                        @click="getProduct(item.id)">
                          <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                          快速預覽
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- products end -->
              </div>
            </div>
      </div>
    </div>

    <!-- Model -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header bg-white text-dark">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{tempProduct.title}}</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <img :src="tempProduct.imageUrl"
                class="img-fluid" alt="">
            <hr>
            <blockquote class="blockquote">
              <p class="mb-0">{{tempProduct.content}}</p>
              <footer class="blockquote-footer text-right">{{tempProduct.description}}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!tempProduct.price">NT${{tempProduct.origin_price}}元</div>
              <del class="h6" v-if="tempProduct.price">原價{{tempProduct.origin_price}}元</del>
              <div class="h5" v-if="tempProduct.price">現在只要{{tempProduct.price}}元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="tempProduct.num">
              <option v-for="(item) in 10" :key="item" :value="item">
                選購 {{item}} {{tempProduct.unit}}
              </option>
            </select>
            </div>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{tempProduct.num * tempProduct.price}}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
            @click="addtoCart(tempProduct.id, tempProduct.num)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === tempProduct.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Model end -->
  </div>
</template>

<script>
import $ from 'jquery';
import 'swiper/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';

export default {
  data() {
    return {
      // swiper參數
      swiperOption: {
        autoplay: {
          delay: 5000,
        },
        loop: true,
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      //
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
    swiper,
    swiperSlide,
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
    getProduct(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        // console.log(response);
        vm.tempProduct = response.data.product;
        vm.tempProduct.num = 1;
        $('#productModal').modal('show');
        vm.status.loadingItem = '';
      });
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
        $('#productModal').modal('hide');
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
        vm.isLoading = false;
      });
    },
    toProductPage(id) {
      const vm = this;
      vm.$router.push(`guest/customer_products/${id}`);
    },
  },
  computed: {
    newstProducts() {
      const vm = this;
      return vm.products.sort((a, b) => b.create_at - a.create_at).slice(0, 6);
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>

<style lang="scss" scoped>
  .ind-banner {
    width: 100%;
    position: relative;
    padding-bottom: 40%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    &.picture1 {
      background-image: url('https://images.unsplash.com/photo-1502790567318-e224ec90bd60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
    }

    &.picture2 {
      background-image: url('https://images.unsplash.com/photo-1557242071-6d7e84b73e61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
    }

    p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      opacity: 0.8;
      font-size: 40px;
      text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
    }
  }
  @media (max-width: 780px) {
    .ind-banner {
      padding-bottom: 50%;
    }
  }
  // 新品上架
  .new-products {
    .title {
      height: 100px;
      width: 100%;
      text-align: center;
      font-size: 1.5em;
      background-image: url('https://images.unsplash.com/photo-1559763668-84f7b8d84825?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
      position: relative;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      p {
        color: #fff;
        background-color: crimson;
        line-height: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .new {
      width: 200px;
      height: 400px;
      background-color: bisque;
      margin: 0 5px;
      padding: 0;
    }
  }
  .card {
    @media (max-width: 768px) and (min-width: 576px) {
      .card-body {
        padding: .5rem;
      }
    }
    .card-body {
      .badge {
        font-weight: 500;
      }
    }
    .card-img-top {
      height: 200px;
      background-size: cover;
      background-position: center;
    }
    .btn-quicklook {
      position: absolute;
      bottom: 1.25rem;
      right: 1.25rem;
    }
    .special-price {
      color: red;
      font-size: 1.25rem;
      font-weight: 500;
    }
  }
</style>
