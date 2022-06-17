<template>
  <div class="selects">
    <div class="holder-text" @click="showIt">
      <slot name="holder" :current="list[current]">
        <input
          type="text"
          :value="thisValue[labelName]"
          :placeholder="holder"
          readonly
          class="holder-text-inner"
        />
        <van-icon
          name="arrow-down"
          size="0.426rem"
          :class="{ 'show-select': showSelect }"
        />
      </slot>
    </div>
    <van-overlay :show="showSelect" @click="showSelect = false" z-index="99" />
    <transition name="van-fade">
      <ul class="select-board" v-show="showSelect">
        <li
          v-for="(item, index) in list"
          :key="listKey ? item[listKey] : index"
          @click="choose(item, index)"
          :class="{ select: current == index }"
        >
          <slot :item="item">
            <span>{{ item.label }}</span>
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  model: {
    prop: "value",
    event: "update:value",
  },
  props: {
    holder: {
      type: String,
      default: () => {
        return this.$t("请选择");
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    listKey: {
      type: String,
    },
    value: {
      type: [String, Number],
    },
    valueName: {
      type: String,
      default: "value",
    },
    labelName: {
      type: String,
      default: "label",
    },
  },
  data() {
    return {
      showSelect: false,
      current: -1,
    };
  },
  methods: {
    showIt() {
      this.showSelect = !this.showSelect;
    },
    choose(item, index) {
      if (this.current == index) {
        return;
      }
      this.current = index;
      this.$emit("change", item[this.valueName]);
      this.showSelect = false;
    },
    getIndex() {
      return this.list.findIndex((item) => item[this.valueName] == this.value);
    },
  },
  computed: {
    thisValue() {
      return this.list[this.current] ? this.list[this.current] : {};
    },
  },
  watch: {
    value() {
      this.current = this.getIndex();
    },
    current() {
      this.$emit("update:value", this.thisValue[this.valueName]);
    },
  },
  created() {
    this.current = this.getIndex();
  },
};
</script>

<style scoped lang="less">
.selects {
  display: inline-block;
  position: relative;
  vertical-align: middle;

  .holder-text {
    display: inline-flex;
    align-items: center;
    padding: 5px;

    .holder-text-inner {
      flex: 1;
    }

    .van-icon {
      margin-left: 8px;
      transition: transform 300ms;

      &.show-select {
        transform: rotate(180deg);
      }
    }
  }

  .select-board {
    z-index: 699;
    background-color: #fff;
    position: absolute;
    min-width: 100%;
    min-height: 80px;
    max-height: 200px;
    overflow: auto;
    bottom: -5px;
    transform: translateY(100%);
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

    li {
      padding: 4px 8px;

      &.select {
        background-color: rgba(#0066f9, 0.1);
        padding-right: 5px;
      }
    }
  }

  .van-overlay {
    background-color: transparent;
  }
}
</style>