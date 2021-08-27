import {debounce} from './utils'

// 处理推荐点击和goodlistItem点击的总线监听
export const itemListenerMixin = {
  data() {
    return {
      ItemImgListener:null,
    }
  },
  mounted() {
    let refresh = debounce(this.$refs.scroll.refresh,50)
      this.ItemImgListener = () =>{
        refresh()
      }
    this.$bus.$on('itemImageLoad',this.ItemImgListener)
  },
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop:false
    }
  },
  methods: {
    backClick(){
    // this.$refs.scroll.scroll.scrollTo(0,0,500);//拿到scroll组件的scroll对象调用bscroll的scrollTo方法
      this.$refs.scroll.scrollTo(0,0,500)
    },
  },

}