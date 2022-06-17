<template>
  <div
    class="simple-qr-code"
    v-on="$listeners"
    :style="`background-color: ${background}`"
  ></div>
</template>

<script type="text/ecmascript-6">
import QRCode from "qrcode";

export default {
  props: {
    /**
     * 被编入二维码的值
     */
    value: {
      type: String,
    },
    margin: {
      type: Number,
      default: 0,
    },
    background: {
      type: String,
      default: "#ffffff",
    },
    color: {
      type: String,
      default: "#000000",
    },
    icon: {
      type: String,
    },
  },
  data() {
    return {
      qrcode: undefined,
      url: "",
      logo: null,
      ctx: null,
    };
  },
  methods: {
    drawQrCode(value) {
      if (!this.qrcode) {
        this.qrcode = document.createElement("canvas");
        this.qrcode.width = this.$el.clientWidth;
        this.qrcode.height = this.$el.clientHeight;
        this.$el.appendChild(this.qrcode);
        this.ctx = this.qrcode.getContext("2d");
      }
      QRCode.toDataURL(value, {
        margin: 0,
        width: this.qrcode.width,
        height: this.qrcode.height,
        color: {
          dark: this.color,
          light: this.background,
        },
      }).then((url) => {
        const ctx = this.ctx;
        const img = new Image();
        this.url = url;
        this.$emit("update:url", url);
        img.src = url;
        img.onload = () => {
          ctx.drawImage(
            img,
            this.margin,
            this.margin,
            this.qrcode.width - this.margin * 2,
            this.qrcode.height - this.margin * 2
          );
          this.drawLogo();
        };
      });
    },
    onResize() {
      if (this.qrcode) {
        this.qrcode.width = this.$el.clientWidth;
        this.qrcode.height = this.$el.clientHeight;
      }
      this.$nextTick(()=>{
        this.drawQrCode(this.value)
      });
    },
    drawLogo() {
      if (this.icon) {
        const ctx = this.ctx;
        const size = this.qrcode.width * 0.2;
        const r = (this.qrcode.width - size) / 2;
        ctx.drawImage(this.logo, r, r, size, size);
      }
    },
  },
  components: {},
  mounted() {
    this.drawQrCode(this.value);
  },
  watch: {
    value() {
      if (this.$el) {
        this.drawQrCode(this.value);
      }
    },
    icon() {
      if (this.logo) {
        this.logo.src = this.icon;
        this.drawLogo();
      }
    },
  },
  created() {
    this.logo = new Image();
    this.logo.src = this.icon;
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped lang="less">
.simple-qr-code {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>