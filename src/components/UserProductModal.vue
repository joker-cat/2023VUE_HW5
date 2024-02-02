<script>
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";
export default {
  props: ["productInfo"],
  data() {
    return {
      count: 1
    }
  },
  methods: {
    showModal() {
      console.log('show');
      this.ctlModal.show();
    },
    closeModal() {

    },
    joinCart() {
      this.$axios('/cart', {
        "data": {
          "product_id": `${productInfo.id}`,
          "qty": this.count
        }
      })
        .then((res) => {
          console.log(res);
        })
    }
  },
  computed: {

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
              <div class="h5">現在只要 {{ productInfo.price }} 元</div>
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
