<template>
  <grid-view>
    <goods-list-item
      v-for="(item, index) in categoryDetail"
      :key="index"
      :goodsItem="item"
    ></goods-list-item>
  </grid-view>
</template>

<script>
import GridView from "components/common/gridView.vue/GridView";
import GoodsListItem from "components/content/goods/GoodsListItem";
export default {
  components: { GoodsListItem, GridView },
  name: "TabContentDetail",
  props: {
    categoryDetail: {
      type: Array | Object,
      default() {
        return [];
      },
    },
  },
};
</script>
<style scoped></style>
