<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="110">購買時間</th>
          <th>客戶名稱</th>
          <th>Email</th>
          <th width="200">購買款項</th>
          <th width="120">應付金額</th>
          <th width="100">是否付款</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{new Date(item.create_at * 1000).toLocaleDateString()}}</td>
          <td>{{item.user.name}}</td>
          <td>{{item.user.email}}</td>
          <td class="text-right">
            <div v-for="(item2) in item.products" :key="item2.id">
              {{item2.product.title}} * {{item2.qty}} : {{item2.final_total | currency}}
            </div>
          </td>
          <td class="text-right">{{item.total | currency}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else>未付款</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)">修改</button>
              <button class="btn btn-outline-danger btn-sm"
              @click="openDelModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :paginations="pagination" @changePage="getOrders"/>
    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>修改訂單</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-8">
              <div class="form-group">
                <label for="title">標題</label>
                <input type="text" class="form-control" id="title"
                  v-model="tempOrder.title"
                  placeholder="請輸入標題">
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input type="text" class="form-control" id="category"
                    v-model="tempOrder.category"
                    placeholder="請輸入分類">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">單位</label>
                  <input type="unit" class="form-control" id="unit"
                    v-model="tempOrder.unit"
                    placeholder="請輸入單位">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                  <input type="number" class="form-control" id="origin_price"
                    v-model="tempOrder.origin_price"
                    placeholder="請輸入原價">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">售價</label>
                  <input type="number" class="form-control" id="price"
                    v-model="tempOrder.price"
                    placeholder="請輸入售價">
                </div>
              </div>
              <hr>

              <div class="form-group">
                <label for="description">產品描述</label>
                <textarea type="text" class="form-control" id="description"
                  v-model="tempOrder.description"
                  placeholder="請輸入產品描述"></textarea>
              </div>
              <div class="form-group">
                <label for="content">說明內容</label>
                <textarea type="text" class="form-control" id="content"
                  v-model="tempOrder.content"
                  placeholder="請輸入產品說明內容"></textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                    v-model="tempOrder.is_enabled"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled">
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
        </div>
      </div>
      </div>
    </div>
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">
              {{new Date(tempOrder.create_at * 1000).toLocaleDateString()}} {{tempOrder.user.name}}
              </strong> 訂單(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
            @click="deleteOrder">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination';

export default {
  data() {
    return {
      orders: [],
      tempOrder: {
        user: {},
      },
      pagination: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
      },
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        // console.log(response);
        vm.orders = response.data.orders;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempOrder = {};
        this.isNew = true;
      } else {
        this.tempOrder = Object.assign({}, item);
        this.isNew = false;
      }
      $('#productModal').modal('show');
    },
    openDelModal(item) {
      const vm = this;
      $('#delProductModal').modal('show');
      vm.tempOrder = Object.assign({}, item);
    },
    updateProduct() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      let httpMethod = 'post';
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempOrder.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: vm.tempOrder }).then((response) => {
        if (response.data.success) {
          $('#productModal').modal('hide');
          vm.getOrders();
          vm.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          $('#productModal').modal('hide');
          vm.getOrders();
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
      });
    },
    deleteOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempOrder.id}`;
      vm.$http.delete(api).then((response) => {
        $('#delProductModal').modal('hide');
        vm.$bus.$emit('message:push', response.data.message, 'danger');
        vm.getOrders();
      });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
