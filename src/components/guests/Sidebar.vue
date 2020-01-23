<template>
  <div class="left_widgets p_filter_widgets sidebar_box_shadow list-group">
    <div class="l_w_title list-group-item">
      <h3><b>商品分類</b></h3>
    </div>
    <ul class="list">
      <li>
        <a href="javascript:" @click.prevent="clickCategory('All')">ALL 所有商品</a>
      </li>
      <li class="sub_menu">
        <a href="#category-list" class="d-flex justify-content-between"
        data-toggle="collapse" role="button" aria-expanded="false" aria-controls="category-list">
          商品分類
        </a>
        <ul class="collapse" id="category-list">
          <li v-for="(category, index) in categorys" :key="index">
            <a href="javascript:" @click.prevent="clickCategory(category)">{{ category }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: ['categorys'],
  methods: {
    clickCategory(category) {
      this.$emit('click_category', category);
    },
  },
};
</script>

<style lang="scss" scoped>
  .sidebar_box_shadow {
    box-shadow: 0px 10px 10px 0px rgba(153, 153, 153, 0.1);
  }

  .left_widgets {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .l_w_title {
    h3 {
      font-size: 14px;
      line-height: 30px;
      margin: 0;
      text-align: center;
      letter-spacing: .4em;
    }
  }

  .sub_menu {
    ul {
      margin-top: 15px;
      padding-top: 15px;
      padding-left: 10px;
      border-top: 1px solid rgb(175, 175, 175);
    }
  }

  .p_filter_widgets {
    .list {
      padding: 25px 20px;
      background-color: white;
      border: 1px solid rgba(0,0,0,0.125);

      &:first-child {
        padding-top: 0;
        margin-top: 0;
      }

      li {
        margin-bottom: 18px;
        letter-spacing: .4em;
        a {
          font-size: 14px;
          font-weight: normal;
          color: #606060;
          position: relative;
        }

        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
