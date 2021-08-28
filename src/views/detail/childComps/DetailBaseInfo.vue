<template>
  <div class="base-info" v-if="Object.keys(goods).length !== 0">
    <div class="info-title">{{ goods.title }}</div>
    <div class="info-price">
      <span class="n-price">{{ goods.newPrice }}</span>
      <span class="o-price">{{ goods.oldPrice }}</span>
      <span :class="{ discount: Active }">{{ goods.discount }}</span>
    </div>
    <div class="info-other">
      <span>{{ goods.columns[0] }}</span>
      <span>{{ goods.columns[1] }}</span>
      <span>{{ goods.services[goods.services.length - 1].name }}</span>
    </div>
    <div class="info-service">
      <span
        class="info-service-item"
        v-for="index in goods.services.length - 1"
        :key="index"
      >
        <img :src="goods.services[index - 1].icon" />
        <span>{{ goods.services[index - 1].name }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailBaseInfo",
  data() {
    return {
      isActive: true,
    };
  },
  computed: {
    Active() {
      if (this.goods.discount == "") {
        return false;
      } else {
        return true;
      }
    },
  },
  props: {
    goods: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style scoped>
.base-info {
  margin-top: 15px;
  padding: 0 8px;
  color: #999;
  border-bottom: 5px solid #f2f5f8;
}
.info-title {
  color: #222;
}
.info-price {
  margin-top: 10px;
}
.info-price .n-price {
  font-size: 24px;
  color: var(--color-high-text);
}
.info-price .o-price {
  font-size: 14px;
  margin-left: 8px;
  text-decoration: line-through;
}
.info-price .discount {
  font-size: 10px;
  padding: 5px 7px;
  color: #fff;
  background-color: var(--color-high-text);
  border-radius: 8px;
  margin-left: 8px;
  /*让元素上浮一些: 使用相对定位即可*/
  position: relative;
  top: -8px;
}
.info-other {
  margin-top: 11px;
  line-height: 30px;
  display: flex;
  font-size: 13px;
  border-bottom: 1px solid rgba(100, 100, 100, 0.1);
  justify-content: space-between;
}
.info-service {
  display: flex;
  justify-content: space-between;
  line-height: 55px;
}

.info-service-item img {
  width: 14px;
  height: 14px;
  position: relative;
  top: 2px;
}

.info-service-item span {
  font-size: 13px;
  color: #333;
}
</style>
