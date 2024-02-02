<script>
import { toast } from "vue3-toastify";
import UserProductModal from "./components/UserProductModal.vue";
export default {
  data() {
    return {
      products: [], //產品
      pagination: {}, //頁數
      productInfo: {},
      cart: {
        "carts": []
      }, //我的購物車
      ctlModal: null,
      load: null
    }
  },
  created(page = 1) {
    this.load = this.$loading.show();
    this.$axios.get(`/products?page=${page}`)
      .then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      })
      .finally(() => {
        this.load.hide();
      })
  },
  computed: {
    originPriceTotal() {
      let total = 0;
      this.cart.carts.reduce((acc, ipt) => {
        total += (ipt["product"]["origin_price"] * ipt["qty"]);
      }, total)
      return total
    }
  },
  methods: {
    lookMore(productId) { //查看商品資訊
      this.$axios.get(`/product/${productId}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.productInfo = res.data.product;
            this.$refs.productModal.showModal();
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    joinCart(productId) { //加入購物車
      this.$axios.post('/cart', {
        "data": {
          "product_id": `${productId}`,
          "qty": 1
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err))
    },
    getCart() { //取得購物車
      this.$axios.get('/cart')
        .then((res) => {
          this.cart = res.data.data;
          console.log(this.cart);
        })
        .catch((err) => console.log(err))
    },
    changeCount(event, productId) { //更改購物車商品數量
      this.$axios.put(`/cart/${productId}`, {
        "data": {
          "product_id": productId,
          "qty": Number(event.target.value)
        }
      })
        .then((res) => {
          if (res.status === 200) {
            this.toastAnimation('成功修改數量');
            this.getCart();
          }
        })
        .catch((err) => console.log(err))
    },
    toastAnimation(str) {
      toast(`${str}`, {
        "theme": "colored",
        "type": "error",
        "dangerouslyHTMLString": true
      })
    }
  },
  components: {
    UserProductModal
  },
  mounted() {
    this.getCart();
  }
}

</script>

<template>
  <div class="container">
    <div class="mt-4">
      <!-- 產品Modal -->
      <userProductModal :productInfo="productInfo" ref="productModal"></userProductModal>
      <!-- 產品Modal -->
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products">
            <td style="width: 200px">
              <div style="height: 100px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url('${item.imageUrl}')` }"></div>
            </td>
            <td>
              {{ item.title }}
            </td>
            <td>
              <del class="h6">原價 {{ item.origin_price }} 元</del>
              <div class="h5">現在只要 {{ item.price }} 元</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary" @click="lookMore(item.id)">
                  <i class="fas fa-spinner fa-pulse"></i>
                  查看更多
                </button>
                <button type="button" class="btn btn-outline-danger" @click="joinCart(item.id)">
                  <i class="fas fa-spinner fa-pulse"></i>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 購物車列表 -->
      <div class="text-end">
        <button class="btn btn-outline-danger" type="button">清空購物車</button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th class="col"></th>
            <th class="col">品名</th>
            <th class="col">數量/單位</th>
            <th class="col">單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cart.carts">
            <tr v-for="iproduct in cart.carts">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm">
                  <i class="fas fa-spinner fa-pulse"></i>
                  x
                </button>
              </td>
              <td>
                {{ iproduct.product.title }}
                <div class="text-success">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group">
                    <input min="1" type="number" class="form-control" :value="iproduct.qty"
                      @change="changeCount($event, iproduct.id)">
                    <span class="input-group-text" id="basic-addon2">{{ iproduct.product.unit }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="input-group d-flex ">
                  <span class="text-decoration-line-through flex-grow-1">{{ iproduct.product.origin_price }}</span>
                  <span>
                    <small class="text-success">折扣價：</small>
                    <span>{{ iproduct.product.price }}</span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">原價總計</td>
            <td class="text-end">{{ originPriceTotal }}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-end">折扣</td>
            <td class="text-end text-danger">{{ originPriceTotal - cart.total }}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-end text-success">總折扣價</td>
            <td class="text-end">{{ cart.total }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- <div class="my-5 row justify-content-center">
        <v-form ref="form" class="col-md-6" v-slot="{ errors }">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <v-field id="email" name="email" type="email" class="form-control" :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入 Email"></v-field>
            <error-message name="email" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名" rules="required"></v-field>
            <error-message name="姓名" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <v-field id="tel" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"></v-field>
            <error-message name="電話" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <v-field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址" rules="required"></v-field>
            <error-message name="地址" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea id="message" class="form-control" cols="30" rows="10"></textarea>
          </div>
          <div class="text-end">
            <button type="submit" class="btn btn-danger">送出訂單</button>
          </div>
        </v-form>
      </div> -->
  </div>


  <!-- <script src="https://unpkg.com/vue@next"></script>
  <script src="https://unpkg.com/vee-validate@next"></script>
  <script src="https://unpkg.com/@vee-validate/i18n@4.1.0"></script>
  <script src="https://unpkg.com/@vee-validate/rules"></script>
  <script src="./javascript/app2.js" type="module"></script> -->
</template>

<style scoped></style>
