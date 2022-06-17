<template>
  <van-popup
    v-model="showPopup"
    style="background: unset"
    @click-overlay="clickOverlay"
    :close-on-click-overlay="false"
  >
    <div class="popup-out-box" @click="cancel">
      <div class="popup-inner-box" @click.stop>
        <div class="popup-title">{{ title }}</div>
        <div class="popup-content">
          <slot name="default">
            <p class="content-box">{{ message }}</p>
            <div
              class="button-bar flex-center"
              v-if="confirmText || cancelText"
            >
              <button class="btnCom" @click="confirm" v-if="confirmText">
                {{ confirmText }}
              </button>
              <button class="btnCom" @click="cancel" v-if="cancelText">
                {{ cancelText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
      <img src="../assets/img/comm/guanbi_icn@2x.png" alt="" class="close" />
    </div>
  </van-popup>
</template>

<script type="text/ecmascript-6">
export default {
  model: {
    prop: "show",
    event: "changeShow",
  },
  props: {
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    title: {
      type: String,
      default: "提示",
    },
    message: {
      type: String,
      default: "",
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  methods: {
    clickOverlay() {
      if (this.closeOnClickOverlay) {
        this.cancel();
      }
    },
    cancel() {
      this.$emit("cancel");
      this.close();
    },
    confirm() {
      this.$emit("confirm");
      this.close();
    },
    close() {
      this.showPopup = false;
      this.$emit("close");
    },
  },
  components: {},
  created() {
    this.showPopup = this.show;
  },
  watch: {
    show(nVal) {
      this.showPopup = nVal;
    },
    showPopup(nVal) {
      this.$emit("changeShow", nVal);
    },
  },
};
</script>

<style scoped lang="less">
.popup-out-box {
  width: 260px;
  text-align: center;

  .popup-inner-box {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;

    .popup-title {
      padding: 10px 0;
      background-color: @theme-bgcolor;
      font-size: 18px;
      color: #111111;
      font-weight: 600;
    }

    .popup-content {
      color: @reverse-color;
      font-size: 14px;
      padding: 15px 20px 30px;

      .content-box {
        padding: 5px 0 20px;
      }

      .button-bar {
        button {
          padding: 6px 0;
          flex: 1;
          // max-width: 164px;
          margin-right: 20px;

          &:last-child {
            margin-right: 0;
          }

          &:only-child {
            margin: 0 28px;
          }
        }
      }
    }
  }
}

.close {
  width: 34px;
  height: 34px;
  margin-top: 20px;
}
</style>