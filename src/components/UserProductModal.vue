<script>
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";
export default {
  props: ["productInfo", "cart"],
  data() {
    return {
      count: 1,
    }
  },
  methods: {
    showModal() {
      this.ctlModal.show();
    },
    closeModal() {
      this.ctlModal.hide();
    },
    joinCart() {
      const apiOption = (this.productInCart.length !== 0) ? 'put' : 'post';
      const apiRoute = (apiOption === 'put') ? `/${this.productInCart[0]["product_id"]}` : '';
      const data = (apiOption === 'put') ?
        {//put
          "data": {
            "product_id": this.productInCart[0]["product_id"],
            "qty": this.count + this.productInCart[0]["qty"]
          }
        } :
        {//post
          "data": {
            "product_id": this.productInfo["id"],
            "qty": this.count
          }
        };
      console.log('/cart' + apiRoute, data);

      this.$axios[apiOption]('/cart' + apiRoute, data)
        .then((res) => {
          this.$emit('emitToast', ((apiOption === 'put') ? '數量成功累加' : '成功加入購物車'));
          this.$emit('renderView');
          this.closeModal();
        })
        .catch(err => console.log(err))
    },
  },
  computed: {
    productInCart() { //是否已存在購物車
      return this.cart.filter((icart) => (icart.id === this.productInfo.id));
    }
  },
  mounted() {
    this.ctlModal = new bootstrap.Modal(this.$refs.modal);
  }
}
</script>
<template>
  <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ productInfo.title }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="productInfo.imageUrl" alt="">
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ productInfo.category }}</span>
              <p>商品描述：{{ productInfo.description }}</p>
              <p>商品內容：{{ productInfo.content }}</p>
              <del class="h6">原價 {{ productInfo.origin_price }} 元</del>
              <div class="h5">現在只要 {{ productInfo.price }}元</div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" min="1" v-model="count">
                  <button type="button" class="btn btn-primary" @click="joinCart">加入購物車</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
