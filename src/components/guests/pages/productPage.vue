<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container main-contant mb-1">
      <div class="row">
        <div class="col-md-4 mb-5">
          <div class="sticky-top" style="top: 10px;">
            <h1 class="h2">{{product.title}}</h1>
            <div class="d-flex my-3 align-items-end justify-content-end">
              <del class="text-muted">售價 NT${{product.origin_price}}</del>
              <div class="h3 mb-0 ml-auto text-danger">
                <small>網路價 NT$</small>
                <strong>{{product.price}}</strong>
              </div>
            </div>
            <hr>
            <div class="input-group mt-3">
              <select name="" class="form-control mr-1" v-model="product.num">
                <option v-for="(item) in 10" :key="item" :value="item">
                  選購 {{item}} {{product.unit}}
                </option>
              </select>
              <a href="shoppingCart-checkout.html" class="btn btn-primary">
                <i class="fa fa-cart-plus" aria-hidden="true"></i> 加入購物車
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <h2>{{product.description}}</h2>
          <p class="card-text">{{product.content}}</p>

          <!-- <h3 class="mt-5 text-center">合身剪裁</h3> -->
          <img :src="product.imageUrl" class="w-100" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      isLoading: false,
      product: {},
    };
  },
  methods: {
    getProduct(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        // console.log(response);
        vm.product = response.data.product;
        vm.product.num = 1;
        $('#productModal').modal('show');
      });
    },
  },
  created() {
    const vm = this;
    vm.getProduct(vm.$route.params.id);
  },
};
</script>
