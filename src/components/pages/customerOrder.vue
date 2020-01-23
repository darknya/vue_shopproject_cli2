<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="(item) in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
              <del class="h6" v-if="item.price">原價{{item.origin_price}}</del>
              <div class="h5" v-if="item.price">特價{{item.price}}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm"
            @click="getProduct(item.id)">
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
    </div>
    <!-- <Products :paginations="pagination" @changePage="getProducts"/> -->
    <hr>
    <div class="my-5 row justify-content-center">
      <div class="col-md-6">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody v-if="cart.carts">
            <tr v-for="(item) in cart.carts" :key="item.id">
              <td class="align-middle">
                <button class="btn btn-outline-danger btn-sm"
                @click="removeCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{item.product.title}}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td class="align-middle">
                {{item.qty}}/{{item.product.unit}}
              </td>
              <td>{{item.final_total}}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="text-right">
              <td colspan="3">總計</td>
              <td>{{cart.total}}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{cart.final_total}}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button"
              @click="addCouponCode">
                使用優惠碼
              </button>
            </div>
          </div>
      </div>
    </div>

    <!-- 購物車表單 -->
    <ValidationObserver ref="observer" v-slot="{ invalid }">
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
            <label for="useremail">Email</label>
            <input type="email" class="form-control" name="email" id="useremail"
              v-model="form.user.email" placeholder="請輸入 Email"
              :class="{'is-invalid': errors[0]}" required>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider name="收件人姓名" rules="required|min:2" v-slot="{ errors }">
            <label for="username">收件人姓名</label>
            <input type="text" class="form-control" name="name" id="username"
              v-model="form.user.name" placeholder="輸入姓名" :class="{'is-invalid': errors[0]}" required>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider name="收件人電話" rules="required|min:9" v-slot="{ errors }">
            <label for="usertel">收件人電話</label>
            <input type="tel" class="form-control" name="usertel" id="usertel"
              v-model="form.user.tel" placeholder="請輸入電話" :class="{'is-invalid': errors[0]}" required>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider name="收件人地址" rules="required|min:1" v-slot="{ errors }">
            <label for="useraddress">收件人地址</label>
            <input type="text" class="form-control" name="address" id="useraddress"
              v-model="form.user.address" placeholder="請輸入地址" :class="{'is-invalid': errors[0]}" required>
            <span class="text-danger">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <label for="comment">留言</label>
          <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
        </div>
      </form>
    </div>
    </ValidationObserver>

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
              <div class="h5" v-if="!tempProduct.price">{{tempProduct.origin_price}}元</div>
              <del class="h6" v-if="tempProduct.price">原價{{tempProduct.origin_price}}元</del>
              <div class="h5" v-if="tempProduct.price">現在只要{{tempProduct.price}}元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="tempProduct.num">
              <option v-for="(item) in 10" :key="item" :value="item">
                選購 {{item}} {{tempProduct.unit}}
              </option>
            </select>
            <hr>
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
  </div>
</template>

<script>
import $ from 'jquery';
import Products from '../Pagination';

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
      cart: {},
      coupon_code: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',

        },
        message: '',
      },
    };
  },
  components: {
    Products,
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
    removeCartItem(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.delete(api).then(() => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.coupon_code,
      };
      vm.isLoading = true;
      this.$http.post(api, { data: coupon }).then((response) => {
        // eslint-disable-next-line
        console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    async createOrder() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const vm = this;
      const order = vm.form;
      const isValid = await vm.$refs.observer.validate();
      if (isValid) {
        this.$http.post(api, { data: order }).then((response) => {
          // eslint-disable-next-line
          console.log('送出訂單', response);
          if (response.data.success) {
            vm.$router.push(`/admin/customer_checkout/${response.data.orderId}`);
          }
          vm.isLoading = false;
        });
      } else {
        // eslint-disable-next-line
        console.log("驗證失敗", isValid);
      }
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
