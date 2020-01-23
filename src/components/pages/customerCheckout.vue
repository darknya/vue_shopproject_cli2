<template>
<div class="mt-3">
  <loading :active.sync="isLoading"></loading>
  <!-- 流程圖 -->
  <div>
    <ul class="flow-chart-list">
      <li>
        <i class="fas fa-clipboard-list"></i>填寫資料
      </li>
      <li :class="{'is-paid': !order.is_paid}">
        <i class="fas fa-hand-holding-usd"></i>金流付款
      </li>
      <li :class="{'is-paid': order.is_paid}">
        <i class="fas fa-clipboard-check"></i>完成訂單
      </li>
    </ul>
  </div>
  <!-- 流程圖-END -->
  <div class="my-5 row justify-content-center">
    <form class="col-md-6" @submit.prevent="payOrder">
      <table class="table">
        <thead>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.id">
            <td class="align-middle">{{ item.product.title }}</td>
            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="align-middle text-right">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-right">總計</td>
            <td class="text-right">{{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!order.is_paid">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-right" v-if="!order.is_paid">
        <button class="btn btn-danger">確認付款去</button>
      </div>
      <router-link to="/guest">返回首頁</router-link>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      order: {
        user: {},
      },
      isLoading: false,
    };
  },
  methods: {
    getOrder() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${vm.orderId}`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.order = response.data.order;
        vm.isLoading = false;
      });
    },
    payOrder() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${vm.orderId}`;
      vm.isLoading = true;
      this.$http.post(url).then((response) => {
        // eslint-disable-next-line
        console.log(response);
        if (response.data.success) {
          vm.getOrder();
        }
        vm.isLoading = false;
      });
    },
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  },
};
</script>
