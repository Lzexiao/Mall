<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :paramInfo="paramInfo"></detail-param-info>
      <!-- <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>
       -->
      <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
      <goods-list :goods="recommendList"></goods-list>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
// import DetailRecommendInfo from './childComps/DetailRecommendInfo'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import{getDetail,getRecommend,Goods,Shop,GoodsParam} from 'network/detail.js'

import {itemListenerMixin} from '@/common/mixin.js'

export default{
    name:"Detail",
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
        DetailCommentInfo

    },
    mixins:[itemListenerMixin],
    data() {
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        recommendList:[],
        commentInfo:{}
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid
      //2.根据iid请求详情的数据
      getDetail(this.iid).then(res =>{
        const data = res.result
        //1.获取顶部的图片轮播数据
        this.topImages = res.result.itemInfo.topImages
        // console.log(this.topImages);
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        // console.log(this.goods);
        //3.获取店铺信息
        this.shop = new Shop(data.shopInfo);
        // console.log(this.shop);
        //4.获取商品详情信息
        this.detailInfo = data.detailInfo;
        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //6.取出评论信息
        if(data.rate.cRate != 0){
          this.commentInfo = data.rate.list[0]
        }
      })

      //6.获取推荐商品列表
      getRecommend().then((res, error) => {
          if (error) return
          this.recommendList = res.data.list
          // console.log(this.recommendList);
      })
    },
    mounted() {
      
    },
    destroyed() {
      //.取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.ItemImgListener)
    },


    methods: {
      imageLoad(){
        this.$refs.scroll.refresh();
      }
    },
  }
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content{
  height: calc(100% - 44px);
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
