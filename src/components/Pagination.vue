<template>
  <div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !paginations.has_pre}">
          <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="getPage(paginations.current_page -1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in paginations.total_pages" :key="page"
        :class="{'active': paginations.current_page == page}">
          <a class="page-link" href="#" @click.prevent="getPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !paginations.has_next}">
          <a class="page-link" href="#" aria-label="Next"
          @click.prevent="getPage(paginations.current_page +1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: ['paginations'],
  methods: {
    getPage(page) {
      const vm = this;
      vm.$emit('changePage', page);
    },
  },
};
</script>
