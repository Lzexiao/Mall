<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @srcoll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
import { itemListenerMixin, backTopMixin } from "@/common/mixin.js";

import { getHomeMultidata, getHomeGoods } from "network/home.js";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      //results:null,
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  mixins: [itemListenerMixin, backTopMixin],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  destroyed() {
    // console.log('destroyed')
  },
  activated() {
    // console.log('进来');
    this.$refs.scroll.scrollTo(0, this.saveY, 1);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // console.log('离开');
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    4;
    //2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.ItemImgListener);
  },
  created() {
    //不要在created里面用$refs，容易拿不到东西
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    console.log(refresh);
    //监听事件总线中图片加载完成的事件;

    //对监听的事件进行保存;
    this.ItemImgListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.ItemImgListener);
    this.$bus.$on("itemImageLoad", () => {
      // console.log(this.$refs.scroll.refresh);
      // console.log("----");
      // this.$refs.scroll.refresh();
      // refresh()
    });
  },
  methods: {
    //2.获取tabControl的offsetTop
    swiperImageLoad() {
      //所有的组件都有个属性$el:用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    //上拉加载更多
    loadMore() {
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.scroll.refresh();
    },

    //backTop到一定位置才会显示
    contentScroll(position) {
      // console.log(position);
      //1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    /**
     * 时间监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    /**
     * 网络请求相关方法
     */
    getHomeMultidata() {
      //1.请求多个数据
      getHomeMultidata().then((res) => {
        //this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    getHomeGoods(type) {
      //2.请求商品数据
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* .content{
  height: cal(100%-93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>
