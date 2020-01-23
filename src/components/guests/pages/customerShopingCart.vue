<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div>
      <h5 class="text-center">您的購物車</h5>
    </div>
    <div v-if="cart.carts.length == 0">
      <p>喔呀!是空的喔!</p>
    </div>
    <div v-else>
      <!-- 購物車明細 -->
      <div class="my-5 row justify-content-center">
        <div class="col-md-6">
          <table class="table table-sm">
            <thead>
              <tr>
                <th width="30"></th>
                <th width="100"></th>
                <th>商品名稱</th>
                <th width="100">數量</th>
                <th width="80">小計</th>
              </tr>
            </thead>
            <tbody v-if="cart.carts">
              <tr v-for="(item) in cart.carts" :key="item.id">
                <td class="align-middle text-center">
                  <button class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
                <td class="align-middle">
                  <img :src="item.product.imageUrl" class="img-fluid img-thumbnail" alt="">
                </td>
                <td class="align-middle">
                  {{item.product.title}}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                </td>
                <td class="align-middle">{{item.qty}} {{item.product.unit}}</td>
                <td class="align-middle text-right">${{item.final_total}}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-right">運費</td>
                <td class="text-right strikethrough">
                  <strong>$60</strong>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="text-right">合計</td>
                <td class="text-right">
                  <strong>${{cart.total}}</strong>
                </td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td colspan="4" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{cart.final_total}}</td>
              </tr>
            </tbody>
          </table>

          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                使用優惠碼
              </button>
            </div>
          </div>
          <router-link class="btn btn-secondary" to="/guest/customer_products">繼續購物</router-link>
        </div>
      </div>
      <!-- 購物車明細-END -->
      <hr>
      <!-- 流程圖 -->
      <div class="mt-3">
        <ul class="flow-chart-list">
          <li class="is-paid">
            <i class="fas fa-clipboard-list"></i>填寫資料
          </li>
          <li><i class="fas fa-hand-holding-usd"></i>金流付款</li>
          <li><i class="fas fa-clipboard-check"></i>完成訂單</li>
        </ul>
      </div>
      <!-- 流程圖-END -->
      <!-- 購物車表單 -->
      <ValidationObserver ref="observer" v-slot="{ invalid }">
        <div class="my-5 row justify-content-center">
          <form class="col-md-6" @submit.prevent="createOrder">
            <div class="form-group">
              <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                <label for="useremail">Email <small class="text-muted">必填</small></label>
                <input type="email" class="form-control" name="email" id="useremail"
                  v-model="form.user.email" placeholder="請輸入 Email"
                  :class="{'is-invalid': errors[0]}" required>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider name="收件人姓名" rules="required|min:2" v-slot="{ errors }">
                <label for="username">收件人姓名 <small class="text-muted">必填</small></label>
                <input type="text" class="form-control" name="name" id="username"
                  v-model="form.user.name" placeholder="輸入姓名" :class="{'is-invalid': errors[0]}" required>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider name="收件人電話" rules="required|min:9" v-slot="{ errors }">
                <label for="usertel">收件人電話 <small class="text-muted">必填</small></label>
                <input type="tel" class="form-control" name="usertel" id="usertel"
                  v-model="form.user.tel" placeholder="請輸入電話" :class="{'is-invalid': errors[0]}" required>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider name="收件人地址" rules="required|min:1" v-slot="{ errors }">
                <label for="useraddress">收件人地址 <small class="text-muted">必填</small></label>
                <input type="text" class="form-control" name="address" id="useraddress"
                  v-model="form.user.address" placeholder="請輸入地址" :class="{'is-invalid': errors[0]}" required>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <label for="comment">留言 <small class="text-muted">選填</small></label>
              <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
            </div>
            <div class="text-right">
              <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
            </div>
          </form>
        </div>
      </ValidationObserver>
      <!-- 購物車表單-END -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: {
        carts: [],
      },
      coupon_code: '',
      isLoading: false,
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
  created() {
    this.getCart();
  },
  methods: {
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
            vm.$router.push(`/guest/customer_checkout/${response.data.orderId}`);
          }
          vm.isLoading = false;
        });
      } else {
        // eslint-disable-next-line
        console.log("驗證失敗", isValid);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
html,body {
  height: 100%;
}
.strikethrough {
  text-decoration: line-through;
}
</style>
