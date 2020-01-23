import Vue from 'vue';

Vue.prototype.$bus = new Vue();

// Message
// vm.$bus.$emit('message:push', message, status);
// message: 傳入參數 訊息內容
// status: Alert樣式，預設值為 warning 使用bootstrap顏色樣式
