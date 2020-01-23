<template>
  <div>
    <header>
      <Navbar/>
    </header>
    <Alert/>
    <div class="container">
      <main role="main" class="main">
        <router-view></router-view>
      </main>
    </div>
    <footer>
      <Footer/>
    </footer>
  </div>
</template>

<script>
import Navbar from './Navbar';
import Footer from './Footer';
import Alert from '../AlertMessage';

export default {
  components: {
    Navbar,
    Footer,
    Alert,
  },
};
</script>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .main {
      padding-top: 20px;
    }
  }
  .main {
    padding-bottom: 60px;
    min-height: calc(100vh - 70px);
  }
</style>
