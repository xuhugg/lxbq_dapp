<template>
  <div class="matryoshka">
    <div class="matryoshka-out" v-if="nodeList.length">
      <div
        class="matryoshkaChild"
        v-for="(nodeItem, index) in nodeList"
        :key="index"
      >
        <slot
          name="default"
          :nodeItem="nodeItem"
          :isOpen="addition[index].show"
          :changeOpen="(isOpen) => changeOpen(isOpen, index)"
        >
        </slot>
        <div
          class="children"
          v-if="addition[index].isLoad"
          v-show="addition[index].show"
        >
          <van-loading
            v-if="addition[index].isLoad && addition[index].loading"
            size="0.6rem"
          >
            加载中
          </van-loading>
          <matryoshka
            :loadList="loadList"
            :baseId="nodeItem.id"
            @initialized="addition[index].loading = false"
            :holderText="holderText"
          >
            <template #default="child">
              <slot
                name="default"
                :nodeItem="child.nodeItem"
                :isOpen="child.isOpen"
                :changeOpen="child.changeOpen"
              >
              </slot>
            </template>
          </matryoshka>
        </div>
      </div>
    </div>
    <div class="holder matryoshkaChild" v-else-if="holderText && isLoad">
      {{ holderText }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import matryoshka from "./Matryoshka.vue";

export default {
  name: "matryoshka",
  props: {
    loadList: {
      type: Function,
      default() {
        return function () {};
      },
    },
    baseId: {
      type: [String, Number],
      default: "",
    },
    holderText: {
      type: String,
      default: "暂无更多",
    },
  },
  data() {
    return {
      isLoad: false,
      nodeList: [],
      addition: [],
    };
  },
  methods: {
    changeOpen(isOpen, index) {
      this.addition[index].show = isOpen;
      if (!this.addition[index].isLoad) {
        this.addition[index].loading = true;
        this.addition[index].isLoad = true;
      }
    },
    getList(nodeId) {
      this.loadList(nodeId, (nodeList) => {
        this.addition = nodeList.map(() => ({
          show: false,
          children: [],
          isLoad: false,
          loading: false,
        }));

        this.nodeList = nodeList;
        this.$emit("initialized");
        this.isLoad = true;
      });
    },
  },
  components: { matryoshka },
  created() {
    this.getList(this.baseId);
  },
};
</script>

<style scoped lang="less">
.matryoshka {
  width: fit-content;
}

.children {
  overflow: hidden;
}
</style>