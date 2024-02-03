<script>
import { toast } from "vue3-toastify";
import UserProductModal from "./components/UserProductModal.vue";

export default {
  data() {
    return {
      products: [], //產品
      pagination: {}, //頁數
      productInfo: {},
      cart: { //我的購物車
        "carts": []
      },
      writeInfo: {
        email: '',
        name: '',
        tel: '',
        address: '',
      },
      message: '',
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
    },
    cartsLength() {
      return this.cart.carts.length;
    }
  },
  watch: {
    cartsLength(newValue, oldValue) { //購物車為空時，清空填寫欄位
      if (newValue === 0) {
        this.writeInfo = {
          email: '',
          name: '',
          tel: '',
          address: '',
        }
        this.message = '';
      }
    },
  },
  methods: {
    lookMore(productId) { //查看商品資訊
      this.$axios.get(`/product/${productId}`)
        .then((res) => {
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
          if (res.status === 200) {
            this.toastAnimation('成功加入購物車');
            this.getCart();
          }
        })
        .catch((err) => console.log(err))
    },
    getCart() { //取得購物車
      this.$axios.get('/cart')
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => console.log(err))
    },
    changeCount(event, product) { //更改購物車商品數量
      this.$axios.put(`/cart/${product.id}`, {
        "data": {
          "product_id": product.id,
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
    removeProduct(product) { //移除商品
      this.$axios.delete(`/cart/${product.id}`)
        .then((res) => {
          if (res.status === 200) {
            this.toastAnimation('成功刪除產品');
            this.getCart();
          }
        })
        .catch((err) => console.log(err))
    },
    clearCart() { //清空購物車
      this.$axios.delete(`/carts`)
        .then((res) => {
          if (res.status === 200) {
            this.toastAnimation('成功清空購物車');
            this.cart = { "carts": [] };
          }
        })
        .catch((err) => console.log(err))
    },
    toastAnimation(str) { //彈出提示
      toast(`${str}`, {
        "theme": "colored",
        "type": "error",
        "dangerouslyHTMLString": true
      })
    },
    onSubmit() {//表單送出，驗證成功才會觸發
      this.$axios.post(`/order`, {
        data: {
          user:{...this.writeInfo},
          message: this.message
        }
      })
        .then((res) => {
          if (res.status === 200) {
            this.toastAnimation('已建立訂單，清空購物車');
          }
        })
        .catch((err) => console.log(err))
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
      <userProductModal @emitToast="toastAnimation" @renderView="getCart" :cart="cart['carts']" :productInfo="productInfo"
        ref="productModal">
      </userProductModal>
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
      <div v-if="cart.carts.length !== 0">

        <div class="text-end">
          <button class="btn btn-outline-danger" type="button" @click="clearCart">清空購物車</button>
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
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="removeProduct(iproduct)">
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
                        @input="changeCount($event, iproduct)">
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
              <td class="text-end text-danger">-{{ originPriceTotal - cart.total }}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-end text-success">總折扣價</td>
              <td class="text-end">{{ cart.total }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p class="text-center fs-2 fw-bolder text-danger" v-else>購物車目前為空</p>
    </div>
    <div class="my-5 row justify-content-center" v-if="cart.carts.length !== 0">
      <VForm ref="form" class="col-md-6" v-slot="{ errors }">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <VField id="email" name="email" type="email" class="form-control" :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email" v-model="writeInfo.email" rules="email|required"></VField>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <VField id="name" name="name" type="text" class="form-control" :class="{ 'is-invalid': errors['name'] }"
            placeholder="請輸入姓名" v-model="writeInfo.name" rules="required"></VField>
          <ErrorMessage name="name" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <VField id="tel" name="tel" type="tel" class="form-control" :class="{ 'is-invalid': errors['tel'] }"
            placeholder="請輸入電話" v-model="writeInfo.tel" rules="required|min:8|numeric"></VField>
          <ErrorMessage name="tel" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <VField id="address" name="address" type="text" class="form-control"
            :class="{ 'is-invalid': errors['address'] }" placeholder="請輸入地址" v-model="writeInfo.address" rules="required">
          </VField>
          <ErrorMessage name="address" class="invalid-feedback"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea id="message" class="form-control" v-model="message" cols="30" rows="10"></textarea>
        </div>
        <div class="text-end">
          <button type="button" class="btn btn-danger" @click="onSubmit">送出訂單</button>
        </div>
      </VForm>
    </div>
  </div>
</template>

<style scoped></style>
