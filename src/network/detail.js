import axios from "axios";
import { request } from "./request";

export function getDetail(iid) {
  return request({
    url: "/detail",
    params: {
      iid,
    },
  });
}

export function getRecommend() {
  return request({
    url: "/recommend",
  });
}

export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title; //标题
    this.desc = itemInfo.desc; //
    this.newPrice = itemInfo.price; //新的价格
    this.oldPrice = itemInfo.oldPrice; //旧的价格
    this.discount = itemInfo.discountDesc; //打折
    this.columns = columns;
    this.services = services;
    this.nowPrice = itemInfo.highNowPrice;
    this.realPrice = itemInfo.lowNowPrice;
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : "";
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}
