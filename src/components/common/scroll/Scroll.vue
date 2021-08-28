<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });
    //2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        // console.log(position);
        this.$emit("srcoll", position);
      });
    }

    //4.监听scroll滚动到底部
    if (this.pullUpLoad) {
      //监听上拉事件
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }

    //每一次滚动都调用一次refresh
    // console.log(this.scroll);
    this.scroll.refresh();
  },
  methods: {
    //回到顶部封装
    scrollTo(x, y, time = 300) {
      //满足scroll有值且srocllTo有值的情况下才会去执行（严谨一点）
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    //再一次上拉加载更多封装
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    //每一张图片加载完成后都进行refresh
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    //返回离开时的位置
    getScrollY() {
      // console.log(this.scroll.y);
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>

<style scoped></style>
