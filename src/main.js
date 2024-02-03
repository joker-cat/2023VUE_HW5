import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";

// import './assets/main.css';

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

//toast CSS
import "vue3-toastify/dist/index.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

//API
import axios from 'axios';
import VueAxios from 'vue-axios';

// 引入 VeeValidate 元件跟功能
import {
  Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// 引入 VeeValidate 的驗證規則
import * as AllRules from '@vee-validate/rules';
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

// 將當前 VeeValidate 的語系設定為繁體中文
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true, //有輸入時就驗證
});
setLocale('zh_TW');

const app = createApp(App);


// 掛載 Global 的 VeeValidate 元件
app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);

app.config.productionTip = false;
app.config.globalProperties.$axios = axios.create({
  baseURL: 'https://ec-course-api.hexschool.io/v2/api/joooker',
})

app.use(VueAxios, axios);
app.use(createPinia());
app.use(LoadingPlugin);
app.use(router);


app.mount('#app');
