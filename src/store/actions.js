import { ADD_COUNTER, ADD_TO_CART } from "./mutation-type";

export default {
  addCart({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      //payload新添加的商品
      // oldInfo和payload指向同一个地址
      //1.查找之前数组中是否有该商品
      let oldInfo = state.cartList.find(function (item) {
        return item.iid === payload.iid;
      });

      //2.判断product
      if (oldInfo) {
        commit(ADD_COUNTER, oldInfo);
        resolve("当前的商品数量+1");
        // console.log('当前的商品数量');
      } else {
        payload.count = 1;
        commit(ADD_TO_CART, payload);
        resolve("添加了新的商品");
        // console.log('添加了新的商品');
      }
    });
  },
};
