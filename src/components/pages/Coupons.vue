<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary"
      @click="openModal(true)">
        建立新優惠卷
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">標題</th>
          <th width="120">優惠碼</th>
          <th width="80">折扣百分比</th>
          <th width="100">到期日</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.code}}</td>
          <td>{{item.percent}}%</td>
          <td>{{new Date(item.due_date * 1000).toLocaleDateString()}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm"
              @click="openDelModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :paginations="pagination" @changePage="getCoupons"/>
    <!-- Modal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>新增優惠卷</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
              <div class="form-group">
                <label for="title">標題</label>
                <input type="text" class="form-control" id="title"
                  v-model="tempCoupon.title"
                  placeholder="請輸入標題">
              </div>
              <div class="form-group">
                <label for="coupon_code">優惠碼</label>
                <input type="text" class="form-control" id="coupon_code"
                  v-model="tempCoupon.code"
                  placeholder="請輸入優惠碼">
              </div>
              <div class="form-group">
                <label for="percent">折扣百分比(%)</label>
                <div class="form-inline">
                  <input type="number" class="form-control col-sm-11" id="percent"
                    v-model="tempCoupon.percent"
                    placeholder="請輸入折扣"><b class="col-sm-1 text-center">%</b>
                </div>
              </div>
              <div class="form-group">
                <label for="due_date">到期日</label>
                <input type="date" class="form-control" id="due_date"
                  v-model="due_date"
                  placeholder="請輸入到期日">
              </div>
              <hr>
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                    v-model="tempCoupon.is_enabled"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled">
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
        </div>
      </div>
      </div>
    </div>
    <!-- deleteModal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
            @click="deleteCoupon">確認刪除</button>
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
      coupons: {},
      tempCoupon: {
        title: '',
        code: '',
        percent: 100,
        due_date: 0,
        is_enabled: 0,
      },
      due_date: new Date(),
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
    getCoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // eslint-disable-next-line
        //console.log(response);
        vm.coupons = response.data.coupons;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        const timetemp = new Date(this.tempCoupon.due_date * 1000);
        this.due_date = timetemp.toISOString().split('T')[0];
        this.isNew = false;
      }
      $('#couponModal').modal('show');
    },
    openDelModal(item) {
      const vm = this;
      $('#delCouponModal').modal('show');
      vm.tempCoupon = Object.assign({}, item);
    },
    updateCoupon() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMethod = 'post';
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = 'put';
      }
      // vm.tempCoupon.due_date = Math.floor(new Date(vm.tempCoupon.due_date));
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if (response.data.success) {
          $('#couponModal').modal('hide');
          vm.getCoupons();
          vm.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          $('#couponModal').modal('hide');
          vm.getCoupons();
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
      });
    },
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
      vm.$http.delete(api).then((response) => {
        $('#delCouponModal').modal('hide');
        vm.$bus.$emit('message:push', response.data.message, 'danger');
        vm.getCoupons();
      });
    },
  },
  created() {
    this.getCoupons();
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
      // console.log(timestamp);
    },
  },
};
</script>
