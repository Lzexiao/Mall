import { ADD_COUNTER, ADD_TO_CART } from "./mutation-type";

export default {
  //数组常用的方法有哪些？push/unshift/shift/sort/reserve/map/filter/reduce/join
  //mutations中的每一个方法尽可能完成的单一一点
  [ADD_COUNTER](state, payload) {
    // console.log('mu-1');
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    // console.log('mu-2');
    payload.checked = false;
    state.cartList.push(payload);
  },
};
