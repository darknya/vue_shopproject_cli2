<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary">
      <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div @click="navActive = 'home'">
          <router-link class="navbar-brand" to="/guest"><strong>Xocolatl巧</strong></router-link>
        </div>
        <div class="collapse navbar-collapse menu-item" id="navbarSupportedContent">
          <ul class="navbar-nav justify-content-center">
            <li class="nav-item"  @click="navActive = '優惠活動'" :class="{active: navActive === '優惠活動'}">
              <router-link class="nav-link" to="/guest/promotions">優惠活動</router-link>
            </li>
            <li class="nav-item" @click="navActive = '購物'" :class="{active: navActive === '購物'}">
              <router-link class="nav-link" to="/guest/customer_products">商品列表</router-link>
            </li>
            <!-- <li class="nav-item" @click="navActive = '關於我們'" :class="{active: navActive === '關於我們'}">
              <router-link class="nav-link" to="/guest/customer_order">關於我們</router-link>
            </li> -->
          </ul>
        </div>
        <div @click="navActive = ''">
          <router-link class="nav-link" to="/guest/customer_shopingcart">
            <i class="fas fa-shopping-bag position-relative">
              <span class="cart-num" v-if="cartnum !== 0">{{ getCart() }}</span>
            </i>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navActive: '',
      cartnum: 0,
    };
  },
  methods: {
    getCart() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        console.log("Cart:", response.data.data.carts.length);
        vm.cartnum = response.data.data.carts.length;
        vm.isLoading = false;
      });
      return vm.cartnum;
    },
  },
  created() {
    this.getCart();
  },
};
</script>

<style lang="scss">
.menu-item {
  .nav-item {
    .nav-link {
      line-height: 12px;
      font-weight: 400;
    }
    padding: 15px 20px;
  }
}
.navbar-nav {
  width: 100%;
}
.fas {
  font-size: 1.2em;
}
.cart-num {
  background: red;
  color: white;
  border-radius: 30%;
  padding: 2px 4px;
  position: absolute;
  right: -8px;
  top: -8px;
  font-size: .5em;
}
</style>
