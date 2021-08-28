<template>
  <div id="detail">
    <detail-nav-bar
      ref="nav"
      class="detail-nav"
      @titleClick="titleClick"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @srcoll="contentScroll"
    >
      <!-- 属性：topImages 传入值的时候要使用-连接 ：top-images -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="params"
        :param-info="paramInfo"
      ></detail-param-info>
      <!-- <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>
       -->
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommendList"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
// import DetailRecommendInfo from './childComps/DetailRecommendInfo'

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
//import Toast from 'components/common/toast/Toast'
// import BackTop from 'components/content/backTop/BackTop'

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail.js";

import { itemListenerMixin, backTopMixin } from "@/common/mixin.js";
import { debounce } from "@/common/utils.js";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    // DetailRecommendInfo,
    GoodsList,
    DetailCommentInfo,
    DetailBottomBar,
    //Toast,
  },

  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      recommendList: [],
      commentInfo: {},
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      message: "",
      show: false,
    };
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;
    //2.根据iid请求详情的数据
    getDetail(this.iid).then((res) => {
      const data = res.result;
      //1.获取顶部的图片轮播数据
      this.topImages = res.result.itemInfo.topImages;
      // console.log(this.topImages);
      //2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // console.log(this.goods);
      //3.获取店铺信息
      this.shop = new Shop(data.shopInfo);
      // console.log(this.shop);
      //4.获取商品详情信息
      this.detailInfo = data.detailInfo;
      //5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //6.取出评论信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    // this.$nextTick(() =>{
    //   //根据最新的数据，对应的DOM已经被渲染出来了
    //   //但是对应的图片依然是没有加载完的（目前获取到offsetTop不包含其中的图片）
    //   //offsetTop值不对的时候，都是因为图片的问题
    //   this.themeTopYs = []
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    //   console.log(this.themeTopYs);
    // })
    //6.获取推荐商品列表
    getRecommend().then((res, error) => {
      if (error) return;
      this.recommendList = res.data.list;
      // console.log(this.recommendList);
    });

    //4.给getThemeTopY进行赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {},
  destroyed() {
    //.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.ItemImgListener);
  },
  updated() {
    // this.themeTopYs = []
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    // console.log(this.themeTopYs);
  },

  methods: {
    ...mapActions(["addCart"]),

    imageLoad() {
      this.$refs.scroll.refresh();
      //图片加载完之后进行回调，结果才是正确的
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      // console.log(position);
      //1.获取y值
      const positionY = -position.y;
      const length = this.themeTopYs.length;
      //2.positionY和主题中值进行对比
      for (let i = 0; i < length - 1; i++) {
        //console.log(i);//用let in themeTopYs时 i是String类型
        // if(positionY > this.themeTopYs[i] && positionY <this.themeTopYs[i+1]){
        //   console.log(i);
        // }
        if (
          this.currentIndex !== i &&
          i < length - 1 &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },
    addToCart() {
      //1.获取购物车西药展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.iid = this.iid;
      product.price = this.goods.realPrice;

      //2.将商品添加到购物车(1.Promise 2.mapActions)

      // this.$store.commit('addCart',product)
      //1.promise
      // this.$store.dispatch('addCart', product).then(res =>{
      //   console.log(res);
      // })
      //2.mapActions
      this.addCart(product).then((res) => {
        this.$toast.show(res, 1500);
      });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
