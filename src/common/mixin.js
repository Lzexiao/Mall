import { debounce } from "./utils";
import { POP, NEW, SELL } from "./const";

// 处理推荐点击和goodlistItem点击的总线监听
export const itemListenerMixin = {
  data() {
    return {
      ItemImgListener: null,
    };
  },
  mounted() {
    let refresh = debounce(this.$refs.scroll.refresh, 50);
    this.ItemImgListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.ItemImgListener);
  },
};

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: true,
    };
  },
  methods: {
    backClick() {
      //console.log('back');
      // this.$refs.scroll.scroll.scrollTo(0,0,500);//拿到scroll组件的scroll对象调用bscroll的scrollTo方法
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
  },
};

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP,
    };
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
      console.log(this.currentType);
    },
  },
};
