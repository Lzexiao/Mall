<template>
  <div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>

      <scroll
        id="tab-content"
        :probe-type="3"
        ref="scroll"
        :data="[categoryData]"
        @srcoll="contentScroll"
      >
        <div>
          <tab-content-category
            :subcategories="showSubcategory"
          ></tab-content-category>
          <tab-control
            :titles="['综合', '新品', '销量']"
            @tabClick="tabClick"
          ></tab-control>
          <tab-content-detail
            :category-detail="showCategoryDetail"
          ></tab-content-detail>
        </div>
      </scroll>
    </div>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
import TabControl from "components/content/tabControl/TabControl";
import BackTop from "components/content/backTop/BackTop";

import TabMenu from "./childComps/TabMenu";
import TabContentCategory from "./childComps/TabContentCategory";
import TabContentDetail from "./childComps/TabContentDetail.vue";

import { POP, SELL, NEW } from "@/common/const";
import { tabControlMixin, backTopMixin } from "@/common/mixin";
import {
  getCategory,
  getSubcategory,
  getCategoryDetail,
} from "network/category.js";

export default {
  components: {
    NavBar,
    TabMenu,
    Scroll,
    TabContentCategory,
    TabControl,
    TabContentDetail,
    BackTop,
  },
  name: "Category",
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
    };
  },
  mixins: [tabControlMixin, backTopMixin],
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return {};
      // console.log("---detail");
      // console.log(this.categoryData[this.currentIndex].categoryDetail[this.currentType]);
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    },
  },
  created() {
    this._getCategory();
  },
  methods: {
    contentScroll(position) {
      //console.log(position);
      //1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      //2.决定tabControl是否吸顶(position:fixed)
      //this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    _getCategory() {
      getCategory().then((res) => {
        //1.获取左边栏的商品分类数据
        this.categories = res.data.category.list;
        //console.log(this.categories);
        //2.初始化每个类别的子数据 （为什么不一次性取？答：因为数据过大，需要时再一组一组去取）
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {}, //各个分类条目下的衣服品种,
            categoryDetail: {
              //获取pop new sell下的所有商品
              pop: [],
              new: [],
              sell: [],
            },
          };
        }
        //3.请求第一个分类的数据，在页面展示
        this._getSubcategories(0);
      });
    },

    //获取各个分类条目下的衣服品种
    _getSubcategories(index) {
      this.currentIndex = index;
      const maitKey = this.categories[index].maitKey;
      getSubcategory(maitKey).then((res) => {
        this.categoryData[index].subcategories = res.data;
        this.categoryData = { ...this.categoryData }; //整合16个分类下的所有数据
        //console.log(this.categoryData);
        this._getCategoryDetail(POP);
        this._getCategoryDetail(SELL);
        this._getCategoryDetail(NEW);
      });
    },

    //获取pop/new/sell下的所有商品
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then((res) => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData }; //将new sell pop的数据都整合进categoryData中
      });
    },
    //接收分类条目的点击，请求数据
    selectItem(index) {
      this._getSubcategories(index);
    },
  },
};
</script>

<style scoped>
#category {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  height: calc(100% - 44px - 49px);
  overflow: hidden;

  display: flex;
}

#tab-content {
  height: 100%;
  flex: 1;
}
</style>
